<div align="center">
  
# 🏡 GharSewa 
### Your On-Demand Smart Home Services Platform powered by Modern LLMs

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-10b981?style=for-the-badge&logo=vercel)](https://gharsewa-web.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build: Vite / React](https://img.shields.io/badge/Frontend-Vite%20|%20React-blue?style=for-the-badge&logo=react)](#)
[![Backend: Express](https://img.shields.io/badge/Backend-Node.js%20|%20Express-38bdf8?style=for-the-badge&logo=nodedotjs)](#)

*Eliminate the stress of hiring unreliable help. GharSewa uses Large Language Models and intelligent matchmaking to seamlessly connect proven professionals with Indian households in minutes.*

</div>

---

## ✨ Key Features

- 🤖 **Autonomous AI Booking Agent**: A natively integrated LLM assistant capable of parsing natural language requests into structured booking payloads (e.g., *"I need a plumber for my bursting pipe immediately"*).
- ⚡ **Three-Tier Role Management**: Completely isolated and secure portals for **Customers**, **Service Providers**, and **Admins**.
- 📍 **Real-Time Matchmaking**: Instantly locates available providers in your region and displays distance, ratings, and immediate dispatch availability via WebSockets.
- 💳 **Earnings & PDF Invoicing**: Providers have an independent analytics dashboard displaying revenue metrics and one-click downloadable PDF invoices.
- 🔒 **Production-Ready Security**: Global CORS policies mapped securely to our Vercel frontend, combined with Helmet headers, rate limiters, and JWT interceptor layers.

<br/>

## 🛠 Tech Stack

**Frontend** 
- React | Vite 
- Zustand (Global State Management)
- CSS-in-JS + Tailwind
- Lucide React (Dynamic Iconography)
- jsPDF (Invoice Generation)

**Backend** 
- Node.js | Express
- MongoDB Atlas | Mongoose (Aggregations & Indexing)
- Socket.io (Bi-directional Realtime Architecture)
- OpenAI API (Action-Mapped JSON Tool Calling)
- JWT (Access + Refresh Token Lifecycles)

<br/>

## 🚀 Live Demo
Access the live production deployment of the platform here: 

👉 [**https://gharsewa-web.vercel.app/**](https://gharsewa-web.vercel.app/)

<br/>

## 💻 Local Installation

To run GharSewa locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/paragmondal/GharSewa.git
cd GharSewa
```

### 2. Setup the Backend Database
Navigate to the `backend` directory and install its dependencies. Create a `.env` file referencing your keys:
```bash
cd backend
npm install

# Required Environment Variables in backend/.env:
# PORT=5000
# MONGODB_URI=mongodb+srv://<user>:<pwd>@cluster.mongodb.net/gharsewa?retryWrites=true&w=majority
# JWT_ACCESS_SECRET=your_jwt_secret
# JWT_REFRESH_SECRET=your_refresh_secret
# OPENAI_API_KEY=sk-your-api-key
# CLIENT_URL=http://localhost:5173
```
Start the backend development server:
```bash
npm run dev
```

### 3. Setup the Frontend Client
Open a new terminal window, navigate to the `frontend` directory, and install its dependencies:
```bash
cd frontend
npm install

# Required Environment Variables in frontend/.env:
# VITE_API_URL=http://localhost:5000/api/v1
# VITE_SOCKET_URL=http://localhost:5000
```
Start the frontend interface:
```bash
npm run dev
```

The application will now be running on `http://localhost:5173`.

---
<div align="center">
  <b>Built with passion to elevate home services in India.</b><br/>
  &copy; GharSewa Technologies AI
</div>
