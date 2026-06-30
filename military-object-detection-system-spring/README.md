# Military Object Detection - Spring Boot Backend

RESTful API backend service providing business logic, data persistence, and security for the Military Object Detection System.

## Overview

This Spring Boot application serves as the central backend service, handling user authentication, authorization, data persistence, and coordination between the React frontend and Python ML service.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **User Management** - Registration, login, and user data
- 🗄️ **Data Persistence** - PostgreSQL database with JPA/Hibernate
- 🔒 **Security** - Spring Security with BCrypt password encryption
- 📡 **RESTful API** - Clean REST endpoints for all operations
- 🌐 **CORS Configuration** - Configured for React frontend
- 📤 **File Upload** - Large file support for videos (up to 10GB)

## Tech Stack

- **Spring Boot 3.3.5** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction
- **PostgreSQL** - Relational database
- **JWT (jjwt 0.11.5)** - JSON Web Tokens
- **Lombok** - Reduce boilerplate code
- **Maven** - Dependency management

## Setup

### Prerequisites
- Java 17+
- Maven 3.6+
- PostgreSQL 12+

### Installation

1. **Create Database**
```sql
CREATE DATABASE militarySystem;
```

2. **Configure Application**
```bash
# Copy example configuration
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Edit with your settings
nano src/main/resources/application.properties
```

3. **Build and Run**
```bash
# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

## Configuration

### application.properties

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/militarySystem
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Secret (use a strong random value)
jwt.secret=your-secret-key-change-this

# File Upload
spring.servlet.multipart.max-file-size=10000MB
upload.dir=/path/to/video/storage
```

### Security Configuration

JWT token expiration: **10 hours** (configurable in `JwtUtil.java`)

Permitted endpoints (no authentication required):
- `/api/auth/**` - Registration and login
- `/api/videos/**` - Video operations (currently open)
- `/api/images/**` - Image operations (currently open)

## Project Structure

```
src/main/java/com/example/militaryobjectdetectionsystem/
├── config/
│   ├── CorsConfig.java              # CORS configuration
│   └── SecurityConfig.java          # Security & JWT setup
├── controller/
│   ├── AuthController.java          # Authentication endpoints
│   ├── ImageController.java         # Image processing endpoints
│   ├── VideoController.java         # Video processing endpoints
│   └── ObjectCountController.java   # Object count queries
├── dto/
│   └── ObjectCountDto.java          # Data transfer objects
├── filter/
│   └── JwtAuthenticationFilter.java # JWT token validation
├── models/
│   ├── User.java                    # User entity
│   ├── Video.java                   # Video entity
│   ├── Image.java                   # Image entity
│   └── ObjectCount.java             # Object count entity
├── repositories/
│   ├── UserRepository.java          # User data access
│   ├── VideoRepository.java         # Video data access
│   ├── ImageRepository.java         # Image data access
│   └── ObjectCountRepository.java   # Object count data access
├── service/
│   ├── UserService.java             # User business logic
│   ├── VideoService.java            # Video business logic
│   ├── ImageService.java            # Image business logic
│   └── ObjectCountService.java      # Object count business logic
└── utils/
    └── JwtUtil.java                 # JWT token utilities
```

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Video Processing

#### Upload Video (Backend Processing)
```http
POST /api/videos/upload-backend
Authorization: Bearer {jwt-token}
Content-Type: multipart/form-data

file: [video file]
email: user@example.com

Response: 200 OK
{
  "message": "Video sent to Python service successfully"
}
```

#### Get All Object Counts
```http
GET /api/videos/counts
Authorization: Bearer {jwt-token}

Response: 200 OK
[
  {
    "id": 1,
    "tank": 3,
    "artillery": 2,
    "person": 5,
    "videoId": 1
  }
]
```

#### Get Counts by Email and Video ID
```http
GET /api/videos/counts-by-email-and-video-id?email=user@example.com&videoId=1
Authorization: Bearer {jwt-token}

Response: 200 OK
{
  "id": 1,
  "tank": 3,
  "artillery": 2,
  "person": 5,
  "videoId": 1
}
```

#### Save Object Counts (Called by Python service)
```http
POST /api/videos/save-counts
Content-Type: application/json

{
  "email": "user@example.com",
  "counts": {
    "tank": 3,
    "artillery": 2,
    "person": 5
  }
}
```

### Image Processing

Similar endpoints exist under `/api/images/*`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100)
);
```

### Videos Table
```sql
CREATE TABLE videos (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    upload_date TIMESTAMP,
    user_id BIGINT REFERENCES users(id)
);
```

### Object_Counts Table
```sql
CREATE TABLE object_counts (
    id BIGSERIAL PRIMARY KEY,
    tank INTEGER DEFAULT 0,
    artillery INTEGER DEFAULT 0,
    military_vehicle INTEGER DEFAULT 0,
    person INTEGER DEFAULT 0,
    -- ... other object types
    video_id BIGINT REFERENCES videos(id),
    image_id BIGINT REFERENCES images(id)
);
```

## Security Features

### Password Encryption
Passwords are hashed using **BCrypt** before storage.

### JWT Tokens
- Generated upon successful login
- Contain user email as subject
- Expire after 10 hours
- Must be included in `Authorization: Bearer {token}` header

### CORS
Configured to allow requests from:
- `http://localhost:3000` (React dev server)

Update `CorsConfig.java` for production origins.

## Integration with Python Service

The Spring Boot backend communicates with the Flask ML service:

1. **Video Upload Flow**:
   - React → Spring (saves metadata)
   - Spring → Flask (forwards file for processing)
   - Flask processes and sends results back
   - Flask → Spring (saves object counts)

2. **REST Client**: Uses `RestTemplate` for HTTP communication

## Development

### Running Tests
```bash
./mvnw test
```

### Building JAR
```bash
./mvnw clean package
java -jar target/MilitaryObjectDetectionSystem-Spring-0.0.1-SNAPSHOT.jar
```

### Hot Reload
Spring Boot DevTools is included for automatic restart during development.

## Troubleshooting

### Database Connection Failed
- Check PostgreSQL is running
- Verify credentials in `application.properties`
- Ensure database `militarySystem` exists

### JWT Errors
- Ensure `jwt.secret` is set in application.properties
- Check token hasn't expired
- Verify `Authorization` header format

### File Upload Errors
- Check `upload.dir` exists and is writable
- Verify max file size settings
- Ensure sufficient disk space

## Production Deployment

### Environment Variables
Use environment variables instead of hardcoded values:

```bash
export DB_URL=jdbc:postgresql://prod-db:5432/militarySystem
export DB_USER=produser
export DB_PASSWORD=securepassword
export JWT_SECRET=very-secure-random-string
```

Update `application.properties`:
```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
```

### Database Migration
Change to `update` or use Flyway/Liquibase:
```properties
spring.jpa.hibernate.ddl-auto=update
```

### Logging
Configure logging in `application.properties`:
```properties
logging.level.root=INFO
logging.level.com.example.militaryobjectdetectionsystem=DEBUG
```

## License

MIT

