# 🚀 CoFoundr - Connecting Ideas with the Right Team

> A full-stack platform designed for students, innovators, and aspiring entrepreneurs to find co-founders, form startup teams, manage tasks, and communicate in real-time.

![CoFoundr Banner](https://img.shields.io/badge/CoFoundr-Connect%20%26%20Build-indigo?style=for-the-badge&logo=rocket)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)

---

## 📌 Overview

**CoFoundr** provides an end-to-end workspace for turning innovative ideas into real startups. Whether you are a founder looking for technical or business partners, or a student/developer seeking to gain hands-on startup experience, CoFoundr bridges the gap between vision and execution.

### Key Features
- 🔐 **Authentication & Security:** JWT-based authentication with role-based access (Students, Team Leaders, Admins).
- 💡 **Startup Discovery:** Search, filter, and discover startups looking for specific skills and domain expertise.
- 🤝 **Join Requests & Application Tracking:** Apply to join teams with automated email notifications on status updates.
- 💬 **Real-time Team Workspace:** Socket.io powered instant messaging for seamless project team collaboration.
- 📋 **Kanban Task Management:** Assign, track, and complete tasks within designated startup project teams.
- 📄 **Profile & Resume Showcase:** Dynamic profiles featuring Cloudinary-powered PDF resume uploads.
- ⭐ **Peer Reviews & Ratings:** End-of-project rating system to build trust and reputational scores.
- 📊 **Admin Dashboard:** Platform metrics, analytics, and content moderation tools.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS, Lucide Icons
- **Routing:** React Router DOM v6
- **State Management:** React Context API

### Backend
- **Runtime & Server:** Node.js & Express.js
- **Database & ODM:** MongoDB & Mongoose
- **Real-Time Communication:** Socket.io
- **Security:** JWT (JSON Web Tokens), bcryptjs
- **File Uploads:** Multer & Cloudinary SDK
- **Email Service:** Nodemailer

---

## 📂 Project Structure

```
CoFoundr/
├── client/                 # React Frontend Application
│   ├── public/             # Static Assets & Icons
│   └── src/
│       ├── components/     # Reusable UI & Layout Components
│       ├── context/        # Global Auth & App State Context
│       ├── layouts/        # Application Page Layouts
│       ├── pages/          # Main Views & Dashboard Pages
│       └── services/       # Axios API Service Layer
│
└── server/                 # Node.js Express Backend API
    ├── config/             # DB Connection Config
    ├── controllers/        # Business Logic Controllers
    ├── middleware/         # Auth & Upload Middleware
    ├── models/             # Mongoose Schemas & Data Models
    ├── routes/             # Express API Routes
    └── utils/              # Email & Helper Utilities
```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/abhayrattan/CoFoundr---Connecting-ideas-with-the-Right-team.git
cd CoFoundr---Connecting-ideas-with-the-Right-team/CoFoundr
```

### 2. Backend Setup
Navigate into the server directory, install dependencies, and setup environment variables:
```bash
cd server
npm install
```

Create a `.env` file in `CoFoundr/server/`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cofoundr
JWT_SECRET=your_jwt_secret_key

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=your_email@gmail.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate into the client directory, install dependencies:
```bash
cd ../client
npm install
```

Create a `.env` file in `CoFoundr/client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend app:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 👥 Authors & Acknowledgments

- **Abhay Rattan** - Creator & Lead Developer - [@abhayrattan](https://github.com/abhayrattan)

---

## 📄 License

This project is licensed under the MIT License.
