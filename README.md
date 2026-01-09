# StyleDecor – Smart Home & Ceremony Decoration Booking System

## 📌 Project Overview

**StyleDecor** is a full-stack web application designed for a local home & ceremony decoration company. The platform allows users to explore decoration services, book consultations or on-site decoration services, make secure payments, and track service progress. It also provides powerful role-based dashboards for admins and decorators to manage services, bookings, and project workflows efficiently.

This project focuses on solving real-world problems such as manual booking, poor service coordination, and lack of service tracking in local decoration businesses.

---

## 🎯 Purpose of the Project

* Digitize the decoration service booking process
* Reduce walk-in crowd and manual appointment handling
* Manage decorators, services, and bookings efficiently
* Provide real-time project status updates
* Enable secure online payments and tracking

---

## 🌐 Live Website

* **Live URL:** https://style-deco.web.app/
* **Server Repo URL:** [https://github.com/Pranto78/Deco-Server.git

---

## ✨ Key Features

### 🔐 Authentication & Security

* Email & password authentication
* Social login support
* JWT-based protected routes
* Role-based access control (Admin, Decorator, User)

### 🏠 User Features

* Browse decoration services and packages
* Search and filter services by category and budget
* View detailed service information
* Book consultation or on-site decoration services
* Secure payment using Stripe
* View booking history and payment history
* Cancel or update bookings
* Track service/project status step-by-step

### 🛠 Admin Features

* Manage decoration services & packages (CRUD)
* Manage decorators (CRUD)
* Assign decorators to paid on-site services
* Approve or disable decorator accounts
* Manage all bookings
* Monitor revenue and payments
* View analytics (service demand, booking statistics)

### 🎨 Decorator Features

* View assigned projects
* See daily schedule
* Update project status (Assigned → Completed)
* View earnings and payment summary

### 📊 Service Workflow Status

* Assigned
* Planning Phase
* Materials Prepared
* On the Way
* Setup in Progress
* Completed

### 🧭 UI & UX

* Modern and clean UI using DaisyUI
* Fully responsive for mobile, tablet, and desktop
* Smooth animations using Framer Motion
* Global loading spinner and error handling
* Toast notifications for all actions

---

## 📄 Main Pages

* Home
* Services
* Service Details
* Booking
* Payment
* Dashboard (Role-based)
* Login / Register
* Error Page

---

## 🧰 Technologies & NPM Packages Used

### Frontend

* React
* React Router DOM
* Axios
* Firebase Authentication
* Framer Motion
* React Hook Form
* React Hot Toast
* React Leaflet
* DaisyUI & Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* JWT (jsonwebtoken)
* Stripe
* CORS
* dotenv

---

## 🔑 Environment Variables

Environment variables are securely stored using `.env` files.

### Client

* Firebase configuration keys

### Server

* MongoDB URI
* JWT Secret
* Stripe Secret Key

---

## 🚀 Deployment

* Client deployed on **Firebase**
* Server deployed on **Vercel**
* Environment variables properly configured
* No CORS, 404, or reload issues on live site


---

## 📌 Conclusion

StyleDecor is a complete real-world service booking and management system that demonstrates full-stack development skills, secure authentication, payment integration, role-based dashboards, and a smooth user experience. The project is built following modern best practices and scalable architecture.

---

⭐ *Thank you for checking out this project!*
