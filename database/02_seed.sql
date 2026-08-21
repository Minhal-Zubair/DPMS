-- =====================================================================
-- DPMS — Seed / Lookup Data
-- Run AFTER 01_schema.sql. Only lookup/reference data required for the
-- app to function is included here — no fake users or applications.
-- =====================================================================

USE dpms_db;

-- ---------------------------------------------------------------------
-- Roles (inferred RBAC — see README). "Applicant" is the implicit role
-- every self-registered user has today (CustomUserDetailsService hardcodes
-- ROLE_USER for everyone); Verifier/Admin are forward-looking for the
-- in-progress Admin module (ManageUsers.jsx mock data uses these 3 names).
-- ---------------------------------------------------------------------
INSERT INTO roles (id, name, description) VALUES
    (1, 'Applicant', 'Default role for self-registered users who submit applications'),
    (2, 'Verifier',  'Reviews submitted applications and verifies documents'),
    (3, 'Admin',     'Full administrative access to the system');

-- ---------------------------------------------------------------------
-- Permissions (inferred RBAC)
-- ---------------------------------------------------------------------
INSERT INTO permissions (id, code, description) VALUES
    (1, 'USERS_READ',          'View user accounts'),
    (2, 'USERS_WRITE',         'Create or edit user accounts'),
    (3, 'USERS_DELETE',        'Delete user accounts'),
    (4, 'APPLICATIONS_READ',   'View submitted applications'),
    (5, 'APPLICATIONS_REVIEW', 'Open applications for review'),
    (6, 'APPLICATIONS_APPROVE','Approve an application'),
    (7, 'APPLICATIONS_REJECT', 'Reject an application'),
    (8, 'REPORTS_VIEW',        'View / generate system reports'),
    (9, 'SETTINGS_MANAGE',     'Manage global system settings'),
    (10,'AUDIT_VIEW',          'View audit logs');

-- ---------------------------------------------------------------------
-- Role -> Permission mapping
-- ---------------------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id) VALUES
    -- Admin: everything
    (3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (3, 10),
    -- Verifier: application review workflow + audit visibility
    (2, 4), (2, 5), (2, 6), (2, 7), (2, 10);

-- ---------------------------------------------------------------------
-- Products — entity: Product / table "products"
-- IDs are pinned explicitly because the frontend hardcodes productId
-- 1 = AGAC, 2 = DIG PERSONAL LOAN, 3 = ELECTRIC BIKE
-- (frontend/src/pages/application/NewApplication.jsx)
-- ---------------------------------------------------------------------
INSERT INTO products (id, product_name, active) VALUES
    (1, 'AGAC', 1),
    (2, 'DIG PERSONAL LOAN', 1),
    (3, 'ELECTRIC BIKE', 1);

-- ---------------------------------------------------------------------
-- Document Types (inferred — see README)
-- IDs 1-6 are pinned to match the hardcoded typeId values in
-- frontend/src/pages/application/DocumentUpload.jsx; 7-8 come from the
-- per-product matrix in frontend/src/pages/application/DocumentTypes.jsx
-- ---------------------------------------------------------------------
INSERT INTO document_types (id, code, name, description) VALUES
    (1, 'CNIC_FRONT',          'CNIC Front',            'Front side of applicant CNIC'),
    (2, 'CNIC_BACK',           'CNIC Back',              'Back side of applicant CNIC'),
    (3, 'APPLICANT_PHOTO',     'Applicant Photograph',   'Passport-size photograph of the applicant'),
    (4, 'SALARY_SLIP',         'Salary Slip',             'Most recent salary slip'),
    (5, 'BANK_STATEMENT',      'Bank Statement',         'Recent bank account statement'),
    (6, 'ADDITIONAL_DOCUMENT', 'Additional Document',    'Any other supporting document'),
    (7, 'SALARY_CERTIFICATE',  'Salary Certificate',     'Employer-issued salary certificate'),
    (8, 'DRIVING_LICENSE',     'Driving License',        'Valid driving license');

-- ---------------------------------------------------------------------
-- Product <-> Document Type requirement matrix
-- Mirrors frontend/src/pages/application/DocumentTypes.jsx exactly
-- ---------------------------------------------------------------------
INSERT INTO product_document_types
    (product_id, document_type_id, is_required, allowed_formats, max_size_mb)
VALUES
    -- AGAC
    (1, 1, 1, 'PDF,JPG,PNG', 5),
    (1, 2, 1, 'PDF,JPG,PNG', 5),
    (1, 3, 1, 'JPG,PNG',     2),
    (1, 4, 1, 'PDF',        10),
    -- DIG PERSONAL LOAN
    (2, 1, 1, 'PDF,JPG', 5),
    (2, 5, 1, 'PDF',    10),
    (2, 7, 1, 'PDF',    10),
    -- ELECTRIC BIKE
    (3, 1, 1, 'PDF,JPG', 5),
    (3, 2, 1, 'PDF,JPG', 5),
    (3, 8, 0, 'PDF,JPG', 5);

-- ---------------------------------------------------------------------
-- System Settings (inferred — see README)
-- Defaults mirror frontend/src/pages/admin/SystemSettings.jsx initial state
-- ---------------------------------------------------------------------
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
    ('system_name',               'DPMS',  'Display name of the system'),
    ('maintenance_mode',          'false', 'Globally disable non-admin access when true'),
    ('email_notifications_enabled','true', 'Master switch for outbound email notifications'),
    ('two_factor_required',       'true',  'Require two-factor authentication system-wide'),
    ('automatic_backup_enabled',  'true',  'Enable automatic daily database backup'),
    ('max_upload_size_mb',        '20',    'Maximum allowed upload size in megabytes');
