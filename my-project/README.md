# EDU-Bridge Frontend

A Next.js 16 + React 19 + TypeScript + Tailwind v4 frontend for **EDU-Bridge** — a free education platform for public day school students in Rwanda, providing English learning, digital literacy training, and career guidance.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Demo Credentials

Use these accounts to log in and explore the dashboards. On the login page, click the role buttons to auto-fill the credentials.

| Role    | Email                      | Password     | Redirects to    |
|---------|----------------------------|--------------|-----------------|
| Student | student@edubridge.rw       | student123   | /student        |
| Mentor  | mentor@edubridge.rw        | mentor123    | /mentor         |
| Admin   | admin@edubridge.rw         | admin123     | /admin          |

> These are mock accounts for demo purposes only. No real authentication is implemented yet.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Components**: CVA (class-variance-authority) + clsx + tailwind-merge

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register, Reset Password
│   ├── (dashboard)/     # Student, Mentor, Admin dashboards
│   ├── about/
│   ├── problem/         # "The Challenge"
│   ├── solution/        # "Our Approach"
│   ├── impact/          # "Our Results"
│   ├── contact/
│   └── page.tsx         # Home
├── components/
│   ├── layout/          # Header, Footer
│   └── ui/              # Button, Badge
└── lib/
    ├── api/             # mockData, client
    ├── contexts/        # AuthContext
    └── types/           # user, module, progress, api
```

## Color Palette

| Token     | Color          | Usage                        |
|-----------|----------------|------------------------------|
| Primary   | emerald-700    | Buttons, links, active states |
| Accent    | amber-500      | CTAs on dark backgrounds      |
| Surface   | white / gray-50 | Page backgrounds             |
| Text      | gray-900 / 500 | Headings / body              |
