# Student Management API - Authentication & Authorization

A REST API for managing student records with secure authentication and role-based authorization.

This project is built using Node.js, Express.js, MongoDB, JWT, bcryptjs, and dotenv.

---

## 1. Project Overview

This project is an extension of the Student Management REST API.

The API provides:

- User registration
- User login
- Password hashing
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Student CRUD operations
- Protected API routes
- Admin-only operations
- Secure environment variable management

There are two user roles:

- `user`
- `admin`

---

## 2. Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- dotenv
- Postman

---

## 3. Project Structure

```text
student-auth-api/
│
├── config/
│   └── db.js
│
├── models/
│   ├── Student.js
│   └── User.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── controllers/
│   └── authController.js
│
├── routes/
│   └── authRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js