# DPMS

**DPMS (Digital Process Management System)** is a full-stack web application for submitting, tracking, reviewing, and managing process applications and their supporting documents. The repository contains a React/Vite frontend, a Spring Boot backend, and MySQL/MariaDB schema and seed scripts.

> **Development status:** This project is under active development. Some administrative screens currently use mock data, and a few backend flows still contain temporary development assumptions. Review the known limitations before deploying to a shared or production environment.

## Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Database setup](#database-setup)
- [Run the backend](#run-the-backend)
- [Run the frontend](#run-the-frontend)
- [Configuration](#configuration)
- [Development workflow](#development-workflow)
- [Known limitations and security notes](#known-limitations-and-security-notes)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features

The current application includes or is structured to support:

- User registration, login, profile management, and password changes.
- JWT-based authentication infrastructure.
- User dashboards and application status tracking.
- Application creation and management.
- Product selection and document uploads.
- Notifications and user settings.
- Administrative dashboards, application review, user management, reports, audit logs, and system settings (some admin views are currently mock or partially wired).
- Relational persistence for users, profiles, settings, applications, documents, notifications, logs, products, document types, roles, permissions, and system settings.

## Architecture

```text
Browser
  │
  └── React/Vite frontend (:5173)
        │  Axios/REST requests
        ▼
     Spring Boot backend (:8080)
        ├── Controllers     HTTP API layer
        ├── Services        Business logic
        ├── Repositories    Spring Data JPA access
        ├── Entities         Database mappings
        └── Security         JWT and request security
                │
                ▼
          MySQL/MariaDB (dpms_db)
```

The backend follows a conventional Spring layered architecture. The frontend is organized around routes, pages, reusable components, API helpers, services, context, and styles.

## Technology stack

### Frontend

- React 19
- Vite 8
- React Router
- Axios
- Material UI and Emotion
- React Hook Form and Zod
- Chart.js/Recharts
- Framer Motion
- npm

### Backend

- Java 21
- Spring Boot 4.1
- Spring Web/MVC
- Spring Data JPA and Hibernate
- Spring Security
- Jakarta validation
- MySQL Connector/J
- JJWT 0.12.6
- Maven Wrapper

### Database

- MySQL or MariaDB
- SQL schema and reference-data scripts in [`database/`](./database)

## Repository layout

```text
DPMS/
├── database/
│   ├── 01_schema.sql          # Database, tables, indexes, and constraints
│   ├── 02_seed.sql            # Lookup/reference data
│   └── README.md              # Schema notes and ER documentation
├── dpms-backend/
│   ├── src/main/java/com/dpms/dpmsbackend/
│   │   ├── config/            # Application and CORS configuration
│   │   ├── controller/        # REST controllers
│   │   ├── dto/               # Request and response DTOs
│   │   ├── entity/            # JPA entities
│   │   ├── exception/          # Exception handling
│   │   ├── repository/        # Spring Data repositories
│   │   ├── security/          # JWT/security classes
│   │   └── service/            # Business services
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
├── frontend/
│   ├── src/api/               # API client helpers
│   ├── src/components/        # Shared UI components
│   ├── src/context/           # React context/state
│   ├── src/pages/             # Feature and route pages
│   ├── src/routes/            # Route definitions
│   ├── src/services/          # Frontend service modules
│   ├── src/styles/            # Global and feature styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

Install the following before starting development:

- Git
- Java 21
- Node.js and npm
- MySQL or MariaDB
- Maven is optional because the backend includes the Maven Wrapper

## Database setup

The backend is configured for a database named `dpms_db` on `localhost:3306`.

1. Start MySQL/MariaDB.
2. Run [`database/01_schema.sql`](./database/01_schema.sql) against a fresh server or database. It creates the database and tables.
3. Run [`database/02_seed.sql`](./database/02_seed.sql) to insert lookup/reference data.
4. Confirm that the credentials in the backend configuration match your local database.

For more detail about relationships, assumptions, and schema limitations, see [`database/README.md`](./database/README.md).

> The schema README notes that the SQL scripts are intended to be run in order. Avoid renumbering product or document-type IDs without updating the frontend code that currently references them.

## Run the backend

From the repository root:

```bash
cd dpms-backend
./mvnw spring-boot:run
```

On Windows, use:

```bat
cd dpms-backend
mvnw.cmd spring-boot:run
```

The backend listens on [http://localhost:8080](http://localhost:8080) by default.

To build and test it:

```bash
./mvnw clean verify
```

If you already have Maven installed, `mvn spring-boot:run` and `mvn clean verify` are equivalent commands.

## Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server listens on [http://localhost:5173](http://localhost:5173). The port is configured as strict, so another process must not already be using it.

Additional frontend commands:

```bash
npm run build      # Create a production build in frontend/dist
npm run preview    # Preview the production build locally
npm run lint       # Run Oxlint
```

Start the backend before using frontend features that call the API. If the frontend uses a different API base URL in your environment, update the frontend API configuration rather than hardcoding credentials or tokens into source files.

## Configuration

Backend configuration is located at [`dpms-backend/src/main/resources/application.properties`](./dpms-backend/src/main/resources/application.properties). Important settings include:

| Setting | Default | Purpose |
|---|---:|---|
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/dpms_db` | Database connection |
| `spring.datasource.username` | `root` | Database user |
| `spring.datasource.password` | empty | Database password; set locally |
| `server.port` | `8080` | Backend HTTP port |
| `jwt.expiration` | `86400000` | JWT lifetime in milliseconds |
| `spring.servlet.multipart.max-file-size` | `10MB` | Maximum individual upload |
| `spring.servlet.multipart.max-request-size` | `20MB` | Maximum multipart request |
| `file.upload-dir` | `uploads/profile/` | Profile upload directory |

Use a local, untracked configuration or environment-specific secret management for passwords, JWT secrets, mail credentials, and external API keys. Do not commit secrets to Git.

## Development workflow

1. Create a feature branch from the default branch.
2. Start MySQL/MariaDB and prepare the database.
3. Start the backend and frontend in separate terminals.
4. Make changes in the appropriate layer.
5. Run backend verification and frontend lint/build checks:

   ```bash
   cd dpms-backend && ./mvnw clean verify
   cd ../frontend && npm run lint && npm run build
   ```

6. Open a pull request describing the change, database impact, configuration changes, and test commands used.

## Known limitations and security notes

The repository's database documentation identifies several areas that should be addressed before production deployment:

- Administrative pages such as user management, audit logs, system settings, reports, and parts of application review may still use hardcoded/mock data.
- Some application and document flows contain temporary hardcoded user/application IDs and must use the authenticated user instead.
- Authorization is not yet a complete role/permission implementation; verify backend endpoint protection before exposing the application.
- Logging and audit concepts overlap across application logs, activities, and audit logs and should be consolidated or clearly defined.
- File upload behavior and storage strategy need to be standardized. The database stores document content as a `LONGBLOB`, while upload directories also exist in the repository.
- Upload-size limits are not consistent across all backend and frontend settings.
- The application configuration currently contains credentials and API secrets in plaintext. Rotate any credentials that have been committed, remove them from version control, and supply replacements through secure environment-specific configuration.
- Replace development defaults such as `spring.jpa.hibernate.ddl-auto=update` and verbose SQL logging with deployment-appropriate settings.
- Review CORS policy and JWT configuration before deployment.

These notes are operational guidance, not a substitute for a security review.

## Troubleshooting

### Cannot connect to MySQL/MariaDB

- Confirm the database service is running.
- Check the host, port, database name, username, and password in `application.properties`.
- Run the SQL scripts against the same server configured by Spring Boot.

### Port 8080 is already in use

Stop the process using port 8080 or change `server.port` in the backend configuration.

### Port 5173 is already in use

Vite is configured with `strictPort: true`. Stop the process using port 5173; changing the port requires updating the Vite configuration and any corresponding CORS/API settings.

### Frontend requests fail with network or CORS errors

Verify that the backend is running on port 8080, that the frontend API base URL is correct, and that the backend CORS configuration allows `http://localhost:5173`.

### Uploads fail

Check both multipart limits in Spring configuration and the target upload directory. Also compare the frontend validation limit with the backend limit.

## Contributing

Contributions are welcome:

1. Fork the repository.
2. Create a focused feature branch.
3. Keep secrets and local configuration out of commits.
4. Add or update tests where practical.
5. Run the backend and frontend checks.
6. Open a pull request with a clear summary and verification steps.

## License

No license file is currently included. Until a license is added, the repository should not be assumed to grant permission to redistribute or modify the code.

## Contact

Open a GitHub issue or pull request in [Minhal-Zubair/DPMS](https://github.com/Minhal-Zubair/DPMS) for questions, bug reports, and improvements.
