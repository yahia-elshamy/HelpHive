# 🐝 HelpHive — Community Tasks & Micro-Volunteering Platform

> A real-time web platform connecting community members who need small tasks done with nearby volunteers.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://www.mongodb.com/atlas)
[![React](https://img.shields.io/badge/React-v18-blue)](https://reactjs.org)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](#)

---

## 📖 Project Overview

HelpHive bridges the gap between people who need small tasks done (Requesters) and local volunteers who want to help. The platform features real-time chat, a gamified Honey Drops reward system, achievement badges, category-based task matching, and a full admin moderation layer — all built on the MERN stack with Socket.IO.

**Three roles:**
- **Requester** — posts tasks, reviews applicants, confirms completion
- **Volunteer** — browses the feed, offers help, tracks mission progress
- **Admin** — moderates users and content via a dedicated dashboard

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js | Server-side JavaScript runtime |
| **Framework** | Express.js | REST API · middleware chain · MVC structure |
| **Database** | MongoDB + Mongoose | Document store; ODM for schema validation & queries |
| **Real-Time** | Socket.IO | Bi-directional events: chat, notifications, presence |
| **Auth** | JWT + bcrypt | Stateless auth; password hashing (12 rounds) |
| **Auth Transport** | HttpOnly Cookie | Secure refresh token storage; prevents XSS theft |
| **Validation** | Joi | Server-side schema validation on all mutating routes |
| **File Uploads** | Multer | Multipart form parsing; MIME validation from buffer |
| **State Management** | Redux Toolkit + RTK Query | Global UI state; server cache + async data fetching |
| **Forms** | React Hook Form | Performant form state; integrates with Joi-style rules |
| **HTTP Client** | Axios | API calls with JWT interceptor and silent refresh |
| **Routing** | React Router v6 | Client-side routing; ProtectedRoute + RoleRoute |
| **Styling** | Bootstrap 5 | Responsive grid, components, dark mode via `data-bs-theme` |
| **Build Tool** | Vite | Fast dev server; bundle analysis; < 300 KB output |
| **API Docs** | Swagger + Postman | Live `/api-docs` UI + exported collection with examples |
| **Deployment** | Render + Vercel + MongoDB Atlas | Backend, frontend, and database hosting |

---

## ⚙️ Local Setup

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (or a local MongoDB instance)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/<your-org>/helphive.git
cd helphive
```

### 2. Configure environment variables

```bash
# In /server
cp .env.example .env
```

Open `server/.env` and fill in every variable (see [Environment Variables](#-environment-variables) below).

### 3. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Seed the database (optional)

```bash
cd server
node scripts/seed.js
```

This creates 5 demo users (2 requesters, 2 volunteers, 1 admin), 20 tasks across all categories, sample chats, reviews, and badge awards.

### 5. Start the development servers

```bash
# Terminal 1 — backend (runs on http://localhost:5000)
cd server
npm run dev

# Terminal 2 — frontend (runs on http://localhost:5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Express server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing access tokens | `supersecretkey` |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | `anothersecretkey` |
| `CLIENT_ORIGIN` | Allowed CORS origin (Vercel URL in prod) | `http://localhost:5173` |
| `NODE_ENV` | `development` or `production` | `development` |

---

## 📁 Project Structure

```
helphive/
├── server/               # Express MVC backend
│   ├── config/           # db.js (Mongoose connection)
│   ├── models/           # 8 Mongoose schemas
│   ├── controllers/      # Route handler logic
│   ├── routes/           # Express routers
│   ├── middleware/        # auth, role, upload, error, rate-limit
│   ├── validators/        # Joi schemas
│   ├── socket/           # Socket.IO event handlers
│   ├── utils/            # generateToken, badgeEngine, notificationService
│   ├── scripts/          # seed.js
│   ├── app.js
│   └── server.js
│
└── client/               # React + Vite frontend
    └── src/
        ├── app/          # Redux store
        ├── features/     # RTK Query slices per domain
        ├── pages/        # 14 route-level page components
        ├── components/   # atoms / molecules / organisms
        ├── hooks/        # Custom React hooks
        ├── services/     # Axios instance
        ├── constants/
        └── styles/       # Bootstrap 5 SCSS overrides
```

---

## 🌐 API Documentation

Swagger UI is available at `/api-docs` when the backend is running.

The API covers 9 route groups: `auth` · `users` · `requests` · `applications` · `tasks` · `chats` · `reviews` · `notifications` · `admin`.

A Postman collection with example request/response pairs is available in `/docs`.

---

## 🚀 Deployment

| Service | Platform | URL |
|---|---|---|
| Backend | Render | `https://helphive-api.onrender.com` |
| Frontend | Vercel | `https://helphive.vercel.app` |
| Database | MongoDB Atlas | — |

---

## 👤 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@helphive.com` | `<!-- fill in -->` |
| Requester | `requester@helphive.com` | `<!-- fill in -->` |
| Volunteer | `volunteer@helphive.com` | `<!-- fill in -->` |

---

## 🗺 Roadmap

- [ ] Week 1–2 — Planning, schema design, auth API
- [ ] Week 3–5 — Requests, applications, mission tracker, Socket.IO
- [ ] Week 6–9 — Profile, dashboard, admin panel, full integration
- [ ] Week 10–11 — QA, security hardening, performance audit
- [ ] Week 12 — Deployment, Swagger docs, defense presentation

---

## 🤝 Contributing

1. Fork the repo and create a feature branch from `develop`.
2. Follow the existing MVC structure and Joi validation patterns.
3. Open a pull request — include a short description and screenshots if applicable.

---

## 📄 License

This project is a graduation project developed for academic purposes.