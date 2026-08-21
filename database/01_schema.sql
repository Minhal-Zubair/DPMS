-- =====================================================================
-- DPMS (Document Processing Management System) — Database Schema
-- Reconstructed from dpms-backend (Spring Boot / Hibernate) source code
-- and cross-checked against the React frontend.
--
-- Target: MySQL 8.x / MariaDB (XAMPP), run directly in phpMyAdmin.
--
-- IMPORTANT: spring.jpa.hibernate.ddl-auto=validate in application.properties.
-- That means Hibernate will REFUSE to start if any entity-mapped table/column
-- is missing or of an incompatible type. Every table/column below that
-- corresponds to a real @Entity field has been matched 1:1 against the
-- Java source (name, nullability, uniqueness, default) so the backend will
-- boot cleanly against this schema. Tables/columns with no corresponding
-- entity today (roles, permissions, document_types, product_document_types,
-- audit_logs, system_settings) are additive/inferred for the in-progress
-- Admin module — Hibernate's "validate" mode ignores tables/columns it has
-- no entity mapping for, so these are safe to include ahead of time.
--
-- See database/README.md for the ER diagram, assumptions, TODOs and
-- inconsistencies found between backend and frontend.
-- =====================================================================

DROP DATABASE IF EXISTS dpms_db;
CREATE DATABASE dpms_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE dpms_db;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================================
-- 1. ROLES  (inferred — Admin module RBAC, see README "Inferred objects")
-- =====================================================================
CREATE TABLE roles (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL,
    description VARCHAR(255) NULL,
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    UNIQUE KEY uk_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 2. PERMISSIONS  (inferred — Admin module RBAC)
-- =====================================================================
CREATE TABLE permissions (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code        VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uk_permissions_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 3. ROLE_PERMISSIONS  (inferred junction table)
-- =====================================================================
CREATE TABLE role_permissions (
    role_id       BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 4. USERS  — entity: com.dpms.dpmsbackend.entity.User (@Table "users")
-- =====================================================================
CREATE TABLE users (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name       VARCHAR(255) NULL,
    last_name        VARCHAR(255) NULL,
    username         VARCHAR(255) NULL,
    email            VARCHAR(255) NULL,
    cnic             VARCHAR(255) NULL,
    phone            VARCHAR(255) NULL,
    password         VARCHAR(255) NULL,
    profile_picture  VARCHAR(255) NULL,
    enabled          TINYINT(1)   NOT NULL DEFAULT 1,
    account_locked   TINYINT(1)   NOT NULL DEFAULT 0,
    -- role_id: inferred, forward-looking for Admin module (not yet on User.java).
    -- Nullable + defaulted so it never blocks Hibernate validate against the
    -- current entity, which has no `role` field at all.
    role_id          BIGINT UNSIGNED NULL,
    created_at       DATETIME(6)  NULL,
    updated_at       DATETIME(6)  NULL,
    last_login       DATETIME(6)  NULL,
    UNIQUE KEY uk_users_username (username),
    UNIQUE KEY uk_users_email (email),
    UNIQUE KEY uk_users_cnic (cnic),
    KEY idx_users_role_id (role_id),
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 5. USER_PROFILES — entity: UserProfile (@Table "user_profiles")
-- One-to-one with users (unique, not-null user_id)
-- =====================================================================
CREATE TABLE user_profiles (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    address     VARCHAR(255) NULL,
    city        VARCHAR(100) NULL,
    postal_code VARCHAR(20)  NULL,
    -- insertable=false/updatable=false in the entity => Hibernate never
    -- writes these; the DB default/on-update clause is the source of truth.
    created_at  DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    UNIQUE KEY uk_user_profiles_user_id (user_id),
    CONSTRAINT fk_user_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 6. USER_SETTINGS — entity: UserSettings (@Table "user_settings")
-- One-to-one with users
-- =====================================================================
CREATE TABLE user_settings (
    id                   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id              BIGINT UNSIGNED NOT NULL,
    dark_mode            TINYINT(1)   NOT NULL DEFAULT 0,
    email_notifications  TINYINT(1)   NOT NULL DEFAULT 1,
    sms_notifications    TINYINT(1)   NOT NULL DEFAULT 0,
    two_factor_auth      TINYINT(1)   NOT NULL DEFAULT 0,
    language             VARCHAR(50)  NOT NULL DEFAULT 'English',
    auto_logout          INT          NOT NULL DEFAULT 15,
    created_at           DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at           DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    UNIQUE KEY uk_user_settings_user_id (user_id),
    CONSTRAINT fk_user_settings_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 7. PASSWORD_HISTORY — entity: PasswordHistory (@Table "password_history")
-- NOTE: entity PK is Integer, not Long, unlike every other table — this is
-- a pre-existing inconsistency in the code, preserved here (see README).
-- =====================================================================
CREATE TABLE password_history (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT UNSIGNED NULL,
    password_hash VARCHAR(255) NULL,
    created_at    DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    KEY idx_password_history_user_id (user_id),
    CONSTRAINT fk_password_history_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 8. PRODUCTS — entity: Product (@Table "products")
-- =====================================================================
CREATE TABLE products (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    active       TINYINT(1)   NOT NULL DEFAULT 1,
    created_at   DATETIME(6)  NULL,
    UNIQUE KEY uk_products_name (product_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 9. DOCUMENT_TYPES  (inferred — see README)
-- Document.documentTypeId (Integer) is referenced everywhere in code/UI
-- with no backing entity/table. Frontend hardcodes IDs 1-6 (DocumentUpload)
-- and per-product requirement lists (DocumentTypes.jsx).
-- =====================================================================
CREATE TABLE document_types (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code        VARCHAR(50)  NOT NULL,
    name        VARCHAR(150) NOT NULL,
    description VARCHAR(255) NULL,
    active      TINYINT(1)   NOT NULL DEFAULT 1,
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uk_document_types_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 10. PRODUCT_DOCUMENT_TYPES  (inferred junction / lookup)
-- Backs the per-product "required documents" matrix shown in
-- frontend/src/pages/application/DocumentTypes.jsx
-- =====================================================================
CREATE TABLE product_document_types (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id       INT UNSIGNED NOT NULL,
    document_type_id INT UNSIGNED NOT NULL,
    is_required      TINYINT(1)   NOT NULL DEFAULT 1,
    allowed_formats  VARCHAR(100) NOT NULL DEFAULT 'PDF,JPG,PNG',
    max_size_mb      INT          NOT NULL DEFAULT 5,
    UNIQUE KEY uk_product_document_types (product_id, document_type_id),
    CONSTRAINT fk_pdt_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pdt_document_type
        FOREIGN KEY (document_type_id) REFERENCES document_types(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 11. APPLICATIONS — entity: Application (@Table "applications")
-- Status enum stored as STRING (@Enumerated(EnumType.STRING))
-- =====================================================================
CREATE TABLE applications (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_number  VARCHAR(255) NULL,
    user_id             BIGINT UNSIGNED NULL,
    cnic                VARCHAR(255) NULL,
    production_date     DATE NULL,
    product_id          INT UNSIGNED NULL,
    status              ENUM('Draft','Submitted','Under_Review','Approved','Rejected')
                             NOT NULL DEFAULT 'Draft',
    remarks             VARCHAR(1000) NULL,
    created_at          DATETIME(6) NULL,
    updated_at          DATETIME(6) NULL,
    UNIQUE KEY uk_applications_number (application_number),
    KEY idx_applications_user_id (user_id),
    KEY idx_applications_status (status),
    KEY idx_applications_product_id (product_id),
    CONSTRAINT fk_applications_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_applications_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 12. APPLICATION_LOGS — entity: ApplicationLog (@Table "application_logs")
-- application_id is nullable in practice: UserServiceImpl calls
-- saveLog(null, userId, "LOGIN"/"REGISTER"/...) for account-level events.
-- =====================================================================
CREATE TABLE application_logs (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT UNSIGNED NULL,
    action         VARCHAR(255) NULL,
    action_by      BIGINT UNSIGNED NULL,
    action_time    DATETIME(6) NULL,
    KEY idx_application_logs_application_id (application_id),
    KEY idx_application_logs_action_by (action_by),
    CONSTRAINT fk_application_logs_application
        FOREIGN KEY (application_id) REFERENCES applications(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_application_logs_user
        FOREIGN KEY (action_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 13. DOCUMENTS — entity: Document (@Table "documents")
-- file_data stored as LONGBLOB (@Lob, LAZY) directly in the DB — see
-- README for the disk-vs-DB storage inconsistency with dpms-backend/uploads.
-- =====================================================================
CREATE TABLE documents (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id    BIGINT UNSIGNED NULL,
    document_type_id  INT UNSIGNED NULL,
    original_name     VARCHAR(255) NULL,
    file_data         LONGBLOB NULL,
    file_size         BIGINT NULL,
    uploaded_by       BIGINT UNSIGNED NULL,
    verified          TINYINT(1) NOT NULL DEFAULT 0,
    remarks           VARCHAR(500) NULL,
    uploaded_at       DATETIME(6) NULL,
    KEY idx_documents_application_id (application_id),
    KEY idx_documents_document_type_id (document_type_id),
    KEY idx_documents_uploaded_by (uploaded_by),
    CONSTRAINT fk_documents_application
        FOREIGN KEY (application_id) REFERENCES applications(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_documents_document_type
        FOREIGN KEY (document_type_id) REFERENCES document_types(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_documents_uploaded_by
        FOREIGN KEY (uploaded_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 14. NOTIFICATIONS — entity: Notification (@Table "notifications")
-- =====================================================================
CREATE TABLE notifications (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT UNSIGNED NOT NULL,
    title      VARCHAR(150) NOT NULL,
    message    TEXT NULL,
    is_read    TINYINT(1)   NOT NULL DEFAULT 0,
    -- insertable=false/updatable=false in the entity => DB default is the
    -- source of truth, Hibernate never writes this column itself.
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    KEY idx_notifications_user_id (user_id),
    KEY idx_notifications_user_unread (user_id, is_read),
    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 15. ACTIVITIES — entity: Activity (@Table "activities")
-- NOTE: entity + repository exist but no service currently writes to or
-- reads from this table (dead code today) — see README. Table is kept so
-- Hibernate validate succeeds and so this can be wired up later.
-- =====================================================================
CREATE TABLE activities (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type           VARCHAR(100) NOT NULL,
    description    VARCHAR(500) NOT NULL,
    user_id        BIGINT UNSIGNED NULL,
    application_id BIGINT UNSIGNED NULL,
    created_at     DATETIME(6) NULL,
    KEY idx_activities_user_id (user_id),
    KEY idx_activities_application_id (application_id),
    KEY idx_activities_created_at (created_at),
    CONSTRAINT fk_activities_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_activities_application
        FOREIGN KEY (application_id) REFERENCES applications(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 16. AUDIT_LOGS  (inferred — backs frontend/src/pages/admin/AuditLogs.jsx)
-- Broader system/security audit trail (user management, role changes,
-- login attempts) distinct from application_logs (application-scoped)
-- and activities (dashboard feed). See README for the overlap TODO.
-- =====================================================================
CREATE TABLE audit_logs (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NULL,
    action      VARCHAR(150) NOT NULL,
    target_type VARCHAR(100) NULL,
    target_ref  VARCHAR(150) NULL,
    ip_address  VARCHAR(45)  NULL,
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    KEY idx_audit_logs_user_id (user_id),
    KEY idx_audit_logs_created_at (created_at),
    CONSTRAINT fk_audit_logs_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 17. SYSTEM_SETTINGS  (inferred — key/value store backing
-- frontend/src/pages/admin/SystemSettings.jsx)
-- =====================================================================
CREATE TABLE system_settings (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key   VARCHAR(100) NOT NULL,
    setting_value VARCHAR(500) NULL,
    description   VARCHAR(255) NULL,
    updated_at    DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    UNIQUE KEY uk_system_settings_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
