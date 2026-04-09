<div align="center">

# 🤖 AI-Assisted Pull Request Review Platform

<p align="center">
  <em>Automated code reviews powered by Google Gemini — built for teams who ship fast.</em>
</p>

<!-- Badges Row 1: Stack -->
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<!-- Badges Row 2: Services & Meta -->
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white)
![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 Overview

This platform brings **AI-assisted code collaboration** to development teams. Repository owners and contributors can manage codebases, submit pull requests, and get instant feedback from a Gemini-powered AI reviewer — all in a clean, GitHub-inspired interface.

The AI reviews each PR for rule violations, classifies issues as `critical`, `warning`, or `suggestion`, and delivers an overall `good` or `bad` verdict, giving maintainers the context they need to merge with confidence.

---

## ✨ Features

<table>
  <tr>
    <td>🤖</td>
    <td><strong>AI-Powered Code Review</strong></td>
    <td>Google Gemini reviews every PR, flags violations, and rates overall code quality</td>
  </tr>
  <tr>
    <td>🗂️</td>
    <td><strong>Repository Management</strong></td>
    <td>Create public/private repos, manage files with version history</td>
  </tr>
  <tr>
    <td>🔀</td>
    <td><strong>Pull Request Workflow</strong></td>
    <td>Submit, review, accept or reject PRs with full status tracking</td>
  </tr>
  <tr>
    <td>📨</td>
    <td><strong>Contributor Invitations</strong></td>
    <td>Email-based secure invitations with accept/decline flow and 7-day token expiry</td>
  </tr>
  <tr>
    <td>🔔</td>
    <td><strong>Real-Time Notifications</strong></td>
    <td>In-app alerts for PR updates, comments, and contributor events</td>
  </tr>
  <tr>
    <td>📊</td>
    <td><strong>Stats Dashboard</strong></td>
    <td>Visualize PR trends, AI review outcomes, top violations, and active contributors</td>
  </tr>
  <tr>
    <td>🔍</td>
    <td><strong>Global Search</strong></td>
    <td>Search across repositories, users, and pull requests</td>
  </tr>
  <tr>
    <td>📜</td>
    <td><strong>Activity Feed</strong></td>
    <td>Paginated repo-level and user-level activity logs</td>
  </tr>
  <tr>
    <td>🔐</td>
    <td><strong>Secure Authentication</strong></td>
    <td>JWT access/refresh tokens, email OTP, and Twilio SMS verification</td>
  </tr>
</table>

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Role |
|---|---|---|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white&style=flat-square) **Node.js** | 18+ | Runtime |
| ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=flat-square) **Express** | v5 | REST API framework |
| ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat-square) **MongoDB + Mongoose** | v9 | Database & ODM |
| ![Gemini](https://img.shields.io/badge/-Gemini_AI-4285F4?logo=google&logoColor=white&style=flat-square) **Google Generative AI** | ^0.24 | AI PR review engine |
| **JWT** | ^9 | Auth token management |
| **Nodemailer** | ^8 | Transactional emails |
| **Twilio** | ^5 | SMS verification |
| **bcrypt** | ^6 | Password hashing |

### Frontend

| Technology | Version | Role |
|---|---|---|
| ![React](https://img.shields.io/badge/-React-20232A?logo=react&logoColor=61DAFB&style=flat-square) **React** | 18+ | UI framework |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat-square) **Vite** | Latest | Build tool & dev server |
| ![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square) **Tailwind CSS** | v4 | Utility-first styling |
| **Zustand** | Latest | Lightweight state management |
| **Axios** | Latest | HTTP client |
| **Lucide React** | Latest | Icon library |
| **date-fns** | Latest | Date formatting |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│         Vite · Tailwind CSS · Zustand · Axios           │
└──────────────────────┬──────────────────────────────────┘
                       │  REST API  (proxied via Vite)
                       ▼
┌─────────────────────────────────────────────────────────┐
│               Express.js REST API (v5)                  │
│    Auth · Repos · PRs · Files · Search · Stats · More  │
└───────────┬───────────────────────┬─────────────────────┘
            │                       │
            ▼                       ▼
┌─────────────────┐     ┌───────────────────────┐
│    MongoDB      │     │    External Services   │
│   (Mongoose)    │     │  ┌─────────────────┐  │
│                 │     │  │  Google Gemini  │  │
│  Users · Repos  │     │  │  (AI Review)    │  │
│  PRs · Files    │     │  ├─────────────────┤  │
│  Comments       │     │  │  Nodemailer     │  │
│  Notifications  │     │  │  (Email)        │  │
│  Activity       │     │  ├─────────────────┤  │
│  Invitations    │     │  │  Twilio (SMS)   │  │
└─────────────────┘     │  └─────────────────┘  │
                        └───────────────────────┘
```

---

## 📁 Project Structure

```
ai-pr-review-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # MongoDB connection
│   │   │
│   │   ├── controllers/                  # Route handlers
│   │   │   ├── activity.controller.js
│   │   │   ├── comment.controller.js
│   │   │   ├── contributor.controller.js
│   │   │   ├── file.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── pullRequest.controller.js
│   │   │   ├── repository.controller.js
│   │   │   ├── search.controller.js
│   │   │   ├── stats.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js        # JWT verification
│   │   │   └── error.middleware.js       # Global error handler
│   │   │
│   │   ├── models/                       # Mongoose schemas
│   │   │   ├── activity.model.js
│   │   │   ├── comment.model.js
│   │   │   ├── file.model.js
│   │   │   ├── invitation.model.js
│   │   │   ├── notification.model.js
│   │   │   ├── pullRequest.model.js
│   │   │   ├── repository.model.js
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/                       # Express routers
│   │   │   ├── activity.routes.js
│   │   │   ├── comment.routes.js
│   │   │   ├── contributor.routes.js
│   │   │   ├── file.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── pullRequest.routes.js
│   │   │   ├── repository.routes.js
│   │   │   ├── search.routes.js
│   │   │   ├── stats.routes.js
│   │   │   └── user.routes.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js               # Custom error class
│   │   │   ├── ApiResponse.js            # Standardized responses
│   │   │   ├── asyncHandler.js           # Async wrapper
│   │   │   ├── createActivity.js
│   │   │   ├── createNotification.js
│   │   │   └── email.js                  # Email templates
│   │   │
│   │   ├── app.js                        # Express app setup
│   │   └── server.js                     # Entry point
│   │
│   ├── .env                              # ⚠️ Never commit
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/                   # Reusable UI components
    │   ├── pages/                        # Route-level pages
    │   ├── store/
    │   │   ├── auth.store.js             # Zustand auth state
    │   │   └── notification.store.js     # Unread count state
    │   └── utils/
    │       ├── formatDate.js
    │       ├── getStatusColor.js
    │       └── truncate.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

> Make sure you have all of the following before starting.

| Requirement | Version | Notes |
|---|---|---|
| ![Node](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white&style=flat-square) Node.js | v18+ | [Download](https://nodejs.org) |
| ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat-square) MongoDB | Any | Local or [Atlas](https://www.mongodb.com/atlas) |
| Google Gemini API Key | — | [Get here](https://aistudio.google.com/app/apikey) |
| Twilio Account | — | For SMS verification |
| Gmail App Password | — | For transactional emails |

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/ai-pr-review-system.git
cd ai-pr-review-system
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

---

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# ── Server ────────────────────────────────────
PORT=8000
NODE_ENV=development

# ── Database ──────────────────────────────────
MONGODB_URI=mongodb://localhost:27017/ai_pr_review

# ── CORS ──────────────────────────────────────
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# ── JWT ───────────────────────────────────────
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

# ── Email (Nodemailer) ────────────────────────
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# ── Google Gemini AI ──────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ── Twilio (SMS) ──────────────────────────────
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
```

> [!WARNING]
> Never commit your `.env` file. Ensure `backend/.env` is listed in `.gitignore`.

---

### Running the App

**Start the backend**

```bash
cd backend
npm run dev
# API running at http://localhost:8000
```

**Start the frontend**

```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

**Verify the API health**

```bash
curl http://localhost:8000/api/v1/health
# → { "success": true, "message": "API is running 🚀" }
```

---

## 📡 API Reference

All endpoints are prefixed with `/api/v1`.

| Module | Base Path | Auth Required |
|---|---|---|
| 👤 Users & Auth | `/api/v1/users` | Partial |
| 🗂 Repositories | `/api/v1/repos` | ✅ |
| 📄 Files | `/api/v1/files` | ✅ |
| 🔀 Pull Requests | `/api/v1/pr` | ✅ |
| 👥 Contributors | `/api/v1/repos/:repoId/contributors` | ✅ |
| 💬 Comments | `/api/v1/pr/:prId/comments` | ✅ |
| 🔔 Notifications | `/api/v1/notifications` | ✅ |
| 📊 Stats | `/api/v1/stats` | ✅ |
| 🔍 Search | `/api/v1/search` | ✅ |
| 📜 Activity | `/api/v1/activity` | ✅ |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork and clone the repo
git clone https://github.com/your-username/ai-pr-review-system.git

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git commit -m "feat: describe your change"

# 4. Push and open a PR
git push origin feature/your-feature-name
```

Please ensure your changes don't break existing functionality and follow the existing code style.

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using **Node.js**, **React**, and **Google Gemini AI**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white)

</div>
