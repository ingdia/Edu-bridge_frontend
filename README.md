# EDU-Bridge — Frontend

> Empowering public day school students in Rwanda with English communication skills, digital literacy, and career guidance.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-green)](LICENSE)

---

## 🔗 Repositories

| Layer | Repository |
|-------|-----------|
| **Frontend** (this repo) | [github.com/ingdia/Edu-bridge_frontend](https://github.com/ingdia/Edu-bridge_frontend) |
| **Backend API** | [github.com/ingdia/edu-bridge-backend](https://github.com/ingdia/edu-bridge-backend) |

---

## 📖 Overview

EDU-Bridge is a full-stack digital learning and mentorship platform designed for Senior 4 students at public day secondary schools in Rwanda, starting with **GS Ruyenzi**. It addresses three critical gaps:

- **English Communication** — listening, speaking, reading, and writing exercises
- **Digital Literacy** — email simulation, internet safety, and computer basics
- **Career Guidance** — CV builder, cover letter templates, opportunity matching, and application tracking

The platform serves three user roles — **Students**, **Mentors**, and **Administrators** — each with a dedicated dashboard and role-based access control.

---

## ✨ Features

### 👩‍🎓 Student Dashboard
- Interactive learning modules (listening, speaking, reading, writing, digital literacy)
- Real-time progress tracking with completion rates and scores
- Mentorship session scheduling and management
- Career hub: CV builder, cover letter builder, opportunity matching
- Secure messaging with mentors and administrators
- In-app notifications

### 👨‍🏫 Mentor Dashboard
- School-based student management (admin assigns mentor to a school)
- Student progress monitoring with module-level breakdown
- Exercise grading and feedback submission
- Session scheduling with students
- Messaging with students and administrators
- Course assignments (admin assigns specific modules to each mentor)

### 🛡️ Admin Dashboard
- School registration and management
- Mentor access request approval/rejection with school assignment
- Course assignment to mentors
- User management (activate/deactivate accounts)
- Learning module CRUD
- Opportunity management (scholarships, internships, jobs)
- Academic report entry (manual + scan)
- Analytics and engagement metrics
- Bulk notifications

---

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Next.js](https://nextjs.org) | 16.1.6 | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first styling |
| [Lucide React](https://lucide.dev) | 0.577 | Icon library |
| [Axios](https://axios-http.com) | 1.x | HTTP client (with token refresh interceptor) |
| [React Hot Toast](https://react-hot-toast.com) | 2.x | Toast notifications |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, Register, Reset Password, Verify Email
│   ├── (dashboard)/
│   │   ├── admin/           # Admin pages (users, schools, mentors, modules, analytics…)
│   │   ├── mentor/          # Mentor pages (students, sessions, grading, messages…)
│   │   └── student/         # Student pages (learning, progress, career, sessions…)
│   └── page.tsx             # Landing page
├── components/
│   ├── features/            # Domain-specific components (EmailSimulator, SpeakingExercise…)
│   ├── layout/              # Layout components
│   ├── shared/              # Shared components
│   └── ui/                  # Base UI components (Button, etc.)
├── lib/
│   ├── api/                 # API client modules
│   │   ├── fetchClient.ts   # Shared fetch with auto token refresh
│   │   ├── admin.ts         # Admin API functions
│   │   ├── student.ts       # Student API functions
│   │   ├── mentorship.ts    # Mentorship, sessions, messages API
│   │   └── school.ts        # School & mentor access API
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication state & token management
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions & constants
└── middleware.ts             # Route protection middleware
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- The [backend API](https://github.com/ingdia/edu-bridge-backend) running on `http://localhost:5000`

### Installation

```bash
# Clone the repository
git clone https://github.com/ingdia/Edu-bridge_frontend.git
cd Edu-bridge_frontend/my-project

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file at the root of `my-project/`:

```env
# Point to the backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Set to true to use mock data (no backend required)
NEXT_PUBLIC_USE_MOCK_API=false
```

> For production, replace `NEXT_PUBLIC_API_URL` with your deployed backend URL (e.g. `https://your-app.onrender.com`).

### Running Locally

```bash
# Development server (port 3000)
npm run dev

# Production build
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Authentication Flow

1. **Register** — Students and mentors register via `/register`. Mentors are set to **inactive** pending admin approval.
2. **Email Verification** — Users verify their email before logging in.
3. **Login** — JWT access token + refresh token issued on login.
4. **Token Refresh** — `fetchClient.ts` automatically refreshes the access token on 401 responses and retries the original request.
5. **Role-based Redirect** — After login, users are redirected to their role dashboard (`/student`, `/mentor`, `/admin`).

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@edubridge.rw` | `Admin@2025!` |
| Mentor | `mentor@edubridge.rw` | *(must be approved by admin)* |
| Student | `student@edubridge.rw` | *(must verify email)* |

---

## 🌐 Backend API

This frontend connects to the **EDU-Bridge Backend** REST API.

- **Backend Repository:** [github.com/ingdia/edu-bridge-backend](https://github.com/ingdia/edu-bridge-backend)
- **API Base URL (dev):** `http://localhost:5000`
- **API Base URL (prod):** `https://your-app.onrender.com`
- **Full API Documentation:** See [`FRONTEND_INTEGRATION_GUIDE.md`](https://github.com/ingdia/edu-bridge-backend/blob/main/FRONTEND_INTEGRATION_GUIDE.md) in the backend repo

### Key Endpoints Used

| Feature | Endpoint |
|---------|---------|
| Auth | `POST /api/auth/login`, `POST /api/auth/register` |
| Student modules | `GET /api/modules/student` |
| Progress | `GET /api/progress/me`, `POST /api/progress/submit` |
| Sessions | `GET /api/mentorship/sessions/student` |
| Messages | `GET /api/messages/conversations`, `POST /api/messages` |
| Opportunities | `GET /api/opportunities`, `GET /api/opportunities/matched` |
| Schools | `GET /api/schools` |
| Mentor access | `GET /api/mentor-access`, `PATCH /api/mentor-access/:id/approve` |

---

## 👥 User Roles & Access

| Route | Role | Description |
|-------|------|-------------|
| `/student/*` | STUDENT | Learning, progress, career, sessions, messages |
| `/mentor/*` | MENTOR | Students, grading, sessions, messages |
| `/admin/*` | ADMIN | Full platform management |

Route protection is handled by `src/middleware.ts` — unauthenticated users are redirected to `/login`.

---

## 🏫 School & Mentor Assignment Flow

1. Admin registers schools via `/admin/schools`
2. Mentor registers → account created as **inactive**, `accessStatus: PENDING`
3. Admin reviews request at `/admin/mentors` → approves with optional school assignment
4. On approval, mentor is activated and linked to a school
5. Mentor sees all students registered under their assigned school
6. Admin can also assign specific courses (modules) to each mentor

---

## 🚢 Deployment

The frontend is designed to deploy on **Vercel**:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set the following environment variable in your Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

> See the [backend deployment guide](https://github.com/ingdia/edu-bridge-backend/blob/main/DEPLOYMENT_GUIDE.md) for deploying the API to Render.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 👩‍💻 Author

**Diane INGABIRE**
African Leadership University — January 2026

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
