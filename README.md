# Osvald Trading Portfolio Systems

A production-style full-stack MERN application for managing and trading investment portfolios.

## Architecture

| Service | Port | Description |
|---------|------|-------------|
| Backend API | 5000 | Express.js REST API with MongoDB |
| User App | 3000 | Public-facing portfolio marketplace |
| Partner Dashboard | 3001 | Partner portfolio management |
| Super Admin Dashboard | 3002 | Platform administration |

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Quick Start

### 1. Backend API

```bash
cd backend
npm install
# Start MongoDB, then seed the database:
npm run seed
# Start the server:
npm run dev
```

### 2. User App (port 3000)

```bash
cd user-app
npm install
npm run dev
```

### 3. Partner Dashboard (port 3001)

```bash
cd partner-dashboard
npm install
npm run dev
```

### 4. Super Admin Dashboard (port 3002)

```bash
cd super-admin-dashboard
npm install
npm run dev
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@osvald.com | admin123 |
| Partner | marcus@osvald.com | partner123 |
| Partner | elena@osvald.com | partner123 |
| User | john@osvald.com | user123 |
| User | sarah@osvald.com | user123 |
| User | alex@osvald.com | user123 |

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

| Variable | Description |
|----------|-------------|
| PORT | API server port (default: 5000) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | JWT signing secret |
| JWT_REFRESH_SECRET | Refresh token secret |
| JWT_EXPIRE | Token expiration (default: 7d) |
| CORS_ORIGINS | Comma-separated allowed origins |

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, multer
- **Frontend**: React 18, Vite, Tailwind CSS, React Query, React Router, React Hook Form
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## Features

- JWT authentication with role-based access control (Admin, Partner, User)
- Portfolio CRUD with image uploads, search, filter, sort, pagination
- Mock payment/purchase system
- Favorites/watchlist
- Admin analytics with charts
- Partner sales dashboard
- Audit logging
- Dark mode
- Responsive design with glassmorphism UI
- Rate limiting, Helmet security, CORS configuration

## Project Structure

```
osvald-trading-portfolio-system/
├── backend/                  # Express.js API
│   └── src/
│       ├── config/           # DB and app config
│       ├── controllers/      # Route handlers
│       ├── middleware/        # Auth, upload, validation, error handling
│       ├── models/           # Mongoose schemas
│       ├── routes/           # API routes
│       ├── seeders/          # Database seeder
│       └── utils/            # Helpers
├── user-app/                 # React user-facing app
├── partner-dashboard/        # React partner dashboard
├── super-admin-dashboard/    # React admin dashboard
└── README.md
```
