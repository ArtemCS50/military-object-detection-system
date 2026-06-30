# Military Object Detection System

A full-stack web application for real-time detection and tracking of military objects in images and videos using YOLOv8 deep learning model.

![System Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [License](#license)

## 🎯 Overview

This system provides an automated solution for detecting and tracking military objects (tanks, artillery, military vehicles, personnel, etc.) in images and videos. It utilizes a custom-trained YOLOv8 model for object detection and provides a user-friendly web interface for uploading media and viewing results.

### Key Capabilities:
- **Real-time Video Processing**: Process video files with live frame-by-frame detection streaming
- **Image Analysis**: Upload and analyze static images for object detection
- **Object Tracking**: Advanced tracking algorithm to count unique objects and prevent duplicates
- **User Management**: Secure authentication and authorization using JWT tokens
- **Results Persistence**: Store detection results linked to user accounts

## ✨ Features

- **🎥 Video Processing**
  - Upload video files for object detection
  - Real-time streaming of processed frames via WebSocket
  - Automatic object counting and tracking
  - Download processed video with annotations

- **🖼️ Image Processing**
  - Upload images for instant object detection
  - Visual bounding boxes with confidence scores
  - Object count statistics
  - Side-by-side original and processed image comparison

- **👤 User Authentication**
  - Secure registration and login
  - JWT-based authentication
  - Protected routes and API endpoints

- **📊 Analytics & Reporting**
  - Historical view of processed media
  - Object count statistics per video/image
  - User-specific detection history

## 🛠️ Technology Stack

### Backend Services

#### Python Service (AI/ML Processing)
- **Framework**: Flask 2.x
- **AI/ML**: YOLOv8 (Ultralytics)
- **Computer Vision**: OpenCV
- **Real-time Communication**: Flask-SocketIO
- **Scientific Computing**: NumPy, SciPy
- **API Communication**: Requests

#### Java Service (Business Logic & Data)
- **Framework**: Spring Boot 3.3.5
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL
- **ORM**: Hibernate/JPA
- **Authentication**: JWT (JSON Web Tokens)
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.3.1
- **UI Library**: React Bootstrap 5.3.3
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **State Management**: React Context API

### Database
- **RDBMS**: PostgreSQL
- **Schema**: Users, Videos, Images, Object Counts

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                      (React Application)                        │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP/HTTPS + WebSocket
                 │
    ┌────────────┴──────────────┐
    │                           │
    ▼                           ▼
┌─────────────────┐      ┌─────────────────┐
│  Spring Boot    │      │  Flask Server   │
│  Backend API    │◄────►│  (ML Service)   │
│  (Port 8080)    │ HTTP │  (Port 5000)    │
└────────┬────────┘      └─────────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│   PostgreSQL    │      │  YOLO Model     │
│    Database     │      │   (best.pt)     │
└─────────────────┘      └─────────────────┘
```

### Data Flow:
1. **User uploads** image/video through React frontend
2. **Spring Backend** authenticates request and stores metadata
3. **Flask Service** receives file for AI processing
4. **YOLOv8 Model** performs object detection
5. **Results stream** back via WebSocket (video) or HTTP (image)
6. **Spring Backend** persists detection results to database
7. **Frontend displays** processed media and statistics

## 📦 Prerequisites

### General Requirements
- **Git** for version control
- **PostgreSQL 12+** for database
- **Node.js 16+** and npm
- **Python 3.8+** and pip
- **Java 17+** and Maven
- **4GB+ RAM** recommended

### Python Dependencies
- Flask
- OpenCV
- Ultralytics (YOLOv8)
- NumPy, SciPy
- Flask-SocketIO, Flask-CORS

### YOLOv8 Model
You need a trained YOLOv8 model file (`best.pt`). Place it in:
```
military-object-detection-system-python/app/best.pt
```

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/military-object-detection-system.git
cd military-object-detection-system
```

### 2. Database Setup
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE militarySystem;
\q
```

### 3. Backend Setup (Spring Boot)

```bash
cd military-object-detection-system-spring

# Copy and configure application properties
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Edit application.properties with your database credentials and JWT secret
# nano src/main/resources/application.properties

# Build and run
./mvnw clean install
./mvnw spring-boot:run
```

The Spring Boot server will start on `http://localhost:8080`

### 4. Python ML Service Setup

```bash
cd military-object-detection-system-python

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r app/requirements.txt

# Place your trained YOLO model
# Copy best.pt to app/best.pt

# Run the service
python -m app.app
```

The Flask server will start on `http://localhost:5000`

### 5. Frontend Setup (React)

```bash
cd military-object-detection-system-react

# Install dependencies
npm install

# Start development server
npm start
```

The React application will open at `http://localhost:3000`

## ⚙️ Configuration

### Spring Boot Configuration
Edit `military-object-detection-system-spring/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/militarySystem
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Secret (use a strong random string)
jwt.secret=your-secure-secret-key

# Upload directory
upload.dir=/path/to/video/storage
```

### Python Service Configuration
The Flask service is configured in `app/app.py`:
- Default port: 5000
- CORS: Allows `http://localhost:3000`
- Model path: `app/best.pt`

### Frontend Configuration
API endpoints are configured in:
- `src/api/authApi.js`
- `src/api/imageApi.js`
- `src/api/videoApi.js`

Default backend URL: `http://localhost:8080`

## 📖 Usage

### 1. Create an Account
- Navigate to `http://localhost:3000/register`
- Fill in your details and create an account
- Login with your credentials

### 2. Process Images
- Click on "Upload Image" section
- Select an image file
- Click "Process Image"
- View results with detected objects and counts

### 3. Process Videos
- Click on "Upload Video" section
- Select a video file
- Click "Process Video"
- Watch real-time processing stream
- Download processed video when complete

### 4. View History
- Access your detection history
- View object counts for previous uploads
- Filter by video/image ID

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword",
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
  "password": "securePassword"
}

Response:
{
  "token": "jwt-token-here"
}
```

### Image Processing

#### Upload Image
```http
POST /api/images/upload-backend
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [image file]
email: user@example.com
```

### Video Processing

#### Upload Video
```http
POST /api/videos/upload-backend
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [video file]
email: user@example.com
```

#### Get Object Counts
```http
GET /api/videos/counts
Authorization: Bearer {token}
```

### WebSocket Events

Connect to `http://localhost:5000` for real-time updates:

- **Event**: `video_frame` - Receives processed video frames
- **Event**: `processing_complete` - Final object count results
- **Event**: `image_processed` - Processed image with results

## 📁 Project Structure

```
military-object-detection-system/
├── military-object-detection-system-spring/     # Spring Boot Backend
│   ├── src/main/java/com/example/militaryobjectdetectionsystem/
│   │   ├── config/                   # Security, CORS configuration
│   │   ├── controller/               # REST controllers
│   │   ├── dto/                      # Data transfer objects
│   │   ├── filter/                   # JWT authentication filter
│   │   ├── models/                   # JPA entities
│   │   ├── repositories/             # Database repositories
│   │   ├── service/                  # Business logic
│   │   └── utils/                    # Utility classes (JWT)
│   └── src/main/resources/
│       ├── application.properties.example
│       └── application.properties    # (git-ignored)
│
├── military-object-detection-system-python/     # Flask ML Service
│   └── app/
│       ├── routes/                   # API routes
│       ├── services/                 # Processing services
│       ├── utils/                    # Utilities
│       ├── uploads/                  # Temporary storage
│       ├── app.py                    # Main Flask application
│       ├── requirements.txt          # Python dependencies
│       └── best.pt                   # YOLO model (git-ignored)
│
└── military-object-detection-system-react/      # React Frontend
    ├── public/                       # Static assets
    │   └── images/                   # Object icons
    └── src/
        ├── api/                      # API integration
        ├── components/               # React components
        ├── context/                  # React context (auth)
        ├── pages/                    # Page components
        ├── routes/                   # Route protection
        └── App.js                    # Main application
```

## 🔒 Security Considerations

### ⚠️ Important: Configuration Security

This project uses sensitive configuration files that **must not** be committed to version control:

1. **application.properties** - Contains database credentials and JWT secrets
2. **best.pt** - Proprietary trained model file
3. **Upload directories** - May contain user data

These files are included in `.gitignore`. Use the provided `.example` files as templates.

### Best Practices:
- ✅ Use strong, randomly generated JWT secrets
- ✅ Use environment variables for production deployment
- ✅ Enable HTTPS in production
- ✅ Implement rate limiting
- ✅ Regularly update dependencies
- ✅ Use strong database passwords
- ✅ Sanitize user inputs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name - [Your GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- YOLOv8 by Ultralytics for the object detection framework
- Spring Boot team for the excellent backend framework
- React team for the frontend library
- OpenCV community for computer vision tools

## 📧 Contact

For questions or support, please open an issue on GitHub or contact [your-email@example.com]

---

**Note**: This is a portfolio project demonstrating full-stack development, machine learning integration, and microservices architecture. The model training data and specifics are not included in this repository.

