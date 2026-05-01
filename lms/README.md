# Leave Management System

Full-stack leave management system built with Angular and Spring Boot.

## What changed

This project is now set up to run more reliably on another PC or laptop:

- Backend now builds with Java 17.
- Default database is embedded H2 file storage, so MySQL is not required.
- SMTP credentials are no longer hardcoded.
- Frontend now uses `/api` with an Angular proxy instead of a hardcoded `localhost:8080` URL.
- Added Windows helper scripts:
  - `run-project.bat`
  - `run-backend.bat`
  - `run-frontend.bat`

## Requirements

- Java 17+
- Node.js 18+
- npm 9+

## Quick start on a new laptop

1. Open the project root:

```bat
cd lms
```

2. Start both apps:

```bat
run-project.bat
```

Or run them separately:

```bat
run-backend.bat
run-frontend.bat
```

## Manual start

### Backend

```bat
cd backend
mvnw.cmd spring-boot:run
```

Backend runs at:

`http://localhost:8080`

H2 console:

`http://localhost:8080/h2-console`

Default JDBC URL:

`jdbc:h2:file:./data/leave-management-db`

### Frontend

```bat
cd frontend
npm install
npm start
```

Frontend runs at:

`http://localhost:4200`

The Angular dev server proxies `/api` requests to `http://127.0.0.1:8080`.

## Demo accounts

- Manager: `manager@lms.com` / `password123`
- Employee: `john@lms.com` / `password123`
- Employee: `emily@lms.com` / `password123`
- Employee: `michael@lms.com` / `password123`

## Database options

### Default: H2

No setup required. Data is stored locally in:

`backend/data/leave-management-db`

### Optional: MySQL

If you want MySQL instead of H2, start the backend with:

```bat
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```

Environment variables for MySQL:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

## Email configuration

Email notifications are disabled by default.

To enable them, set:

- `APP_MAIL_ENABLED=true`
- `APP_MAIL_FROM=no-reply@yourdomain.com`
- `APP_MAIL_FROM_NAME=Leave Management System`
- `MAIL_HOST=...`
- `MAIL_PORT=587`
- `MAIL_USERNAME=...`
- `MAIL_PASSWORD=...`
- `MAIL_SMTP_AUTH=true`
- `MAIL_SMTP_STARTTLS_ENABLE=true`

## Notes

- No global Angular CLI install is required.
- The backend was verified locally with Java 17 and returns a successful login response.
- Backend includes Maven Wrapper, so Maven does not need to be installed globally.
- Frontend still requires Node.js and npm.
