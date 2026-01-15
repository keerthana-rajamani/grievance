# Online Complaint and Grievance Portal

A complete demo-ready web application for managing complaints and grievances with role-based access control.

## Architecture Overview

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x with Java 17
- **Database**: H2 In-Memory Database (no installation required)
- **Security**: JWT-based authentication with Spring Security
- **Layers**:
  - Controllers: REST API endpoints
  - Services: Business logic and validation
  - Repositories: Data access layer
  - Entities: JPA entities for database mapping

### Frontend (React)
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js for reports and analytics

## Features

1. **Authentication**
   - User registration and login
   - JWT token-based authentication
   - Roles: USER, ADMIN

2. **Complaint Management**
   - Anonymous complaint submission
   - Authenticated user complaints
   - Track complaints by tracking ID
   - Status flow validation (strict transitions)

3. **Admin Dashboard**
   - View all complaints with filters
   - Update complaint status
   - Add admin comments
   - Analytics and reports

4. **Status Flow**
   - NEW → UNDER_REVIEW → RESOLVED
   - NEW → ESCALATED
   - UNDER_REVIEW → ESCALATED
   - Invalid transitions are blocked

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- H2 Database
- JWT (jjwt 0.12.3)
- Lombok

### Frontend
- React 18
- Vite 5
- React Router 6
- Axios
- Chart.js

## Setup and Run

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

**H2 Console:**
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:grievance`
- Username: `sa`
- Password: (empty)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Complaints (Public)
- `POST /api/complaints/submit` - Submit anonymous complaint
- `GET /api/complaints/track/{trackingId}` - Track complaint by ID

### Complaints (Authenticated)
- `POST /api/complaints` - Submit authenticated complaint
- `GET /api/complaints/my-complaints` - Get user's complaints
- `GET /api/complaints/{id}` - Get complaint by ID

### Admin Endpoints
- `GET /api/admin/complaints` - Get all complaints (with filters)
- `PUT /api/admin/complaints/{id}/status` - Update complaint status
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## Status Flow Rules

The system enforces strict status transitions:

1. **NEW** → Can transition to:
   - UNDER_REVIEW
   - ESCALATED

2. **UNDER_REVIEW** → Can transition to:
   - RESOLVED
   - ESCALATED

3. **RESOLVED** → Final status (no transitions)
4. **ESCALATED** → Final status (no transitions)

## Project Structure

```
grievance-portal/
├── backend/
│   ├── src/main/java/com/grievance/portal/
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── security/        # Security configuration
│   │   └── config/          # Configuration classes
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── pages/           # Page components
    │   ├── components/      # Reusable components
    │   ├── context/         # React context
    │   └── App.jsx          # Main app component
    ├── package.json
    └── vite.config.js
```

## Demo Workflow

1. **Submit Anonymous Complaint**:
   - Navigate to `/submit`
   - Fill in complaint details
   - Get tracking ID

2. **Track Complaint**:
   - Use tracking ID to view status
   - View timeline of status changes

3. **Login as Admin**:
   - Use admin credentials
   - Access admin dashboard
   - Update complaint statuses
   - View reports

4. **Register as User**:
   - Create account
   - Submit authenticated complaints
   - View your complaints

## Notes

- This is a demo application using H2 in-memory database
- Data is lost when the application restarts
- Default admin user is created automatically on startup
- JWT tokens expire after 24 hours
- All status transitions are validated server-side

## License

This is a demo application for educational purposes.
