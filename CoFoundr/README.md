# CoFoundr

CoFoundr is a platform designed for students and aspiring entrepreneurs to find co-founders, form startup teams, manage tasks, and communicate in real-time. Whether you have an idea and need a team, or you want to join an exciting new project to build your portfolio, CoFoundr provides the tools to connect, collaborate, and build together.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Context API (for global state management)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- Socket.io (Real-time chat)
- JSON Web Tokens (JWT) for Authentication
- Nodemailer (Email Notifications)
- Cloudinary (Resume Uploads)

## Features

- **User Authentication:** Secure signup and login using JWT.
- **Role-Based Access Control:** Differentiated roles (Student, Leader, Admin).
- **Startup Discovery:** Browse, filter, and save startups looking for teammates.
- **Join Requests:** Apply to startups and receive email notifications on acceptance/rejection.
- **Team Management:** Dedicated team workspaces, member roles, and real-time group chat.
- **Task Management:** Create, assign, and track tasks within your startup team.
- **Profiles & Resumes:** Detailed user profiles with Cloudinary-backed resume uploads.
- **Reviews & Ratings:** Leave feedback for teammates after collaborating on a project.
- **Admin Dashboard:** Platform analytics and user management functionality.

## Folder Structure

```
CoFoundr/
├── client/                 # React frontend application
│   ├── public/             # Static assets
│   └── src/                
│       ├── components/     # Reusable UI components
│       ├── context/        # React Context (Auth)
│       ├── layouts/        # Page layouts (Navbar, Footer, Sidebar)
│       ├── pages/          # Application views/pages
│       └── services/       # API integration logic
│
└── server/                 # Node.js/Express backend application
    ├── config/             # Database connection
    ├── controllers/        # Route controllers
    ├── middleware/         # Custom middleware (Auth, Upload)
    ├── models/             # Mongoose schemas
    ├── routes/             # API routes definition
    └── utils/              # Helper functions (e.g., Email sender)
```

## Setup Instructions

To run this project locally, you will need Node.js and MongoDB installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/cofoundr.git
cd cofoundr
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory using the provided `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cofoundr
JWT_SECRET=your_jwt_secret_here

# Email Configuration (e.g. Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (if needed for API URLs):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running on `http://localhost:5173`.

## Screenshots

*(Placeholder for application screenshots)*

## Live Demo

*(Placeholder for live deployment link)*
