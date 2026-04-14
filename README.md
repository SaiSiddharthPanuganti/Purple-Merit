# PurpleMerit — User Management System

A production-ready, enterprise-grade User Management System built with the MERN stack featuring role-based access control (RBAC), JWT authentication, and a professional SaaS dashboard UI.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS 3 + Headless UI |
| State | React Context API |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh Tokens) |
| Icons | Lucide React |

## 🏗️ Project Structure

```
PurpleMerit/
├── server/                 # Express API
│   ├── src/
│   │   ├── config/         # DB & env config
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/     # Auth, RBAC, validation, errors
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Route definitions
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers
│   │   └── validators/     # Zod schemas
│   └── server.js
├── client/                 # React SPA
│   ├── src/
│   │   ├── api/            # Axios + interceptors
│   │   ├── components/     # UI, layout, guards, users
│   │   ├── contexts/       # Auth + Theme
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Route pages
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Constants + helpers
│   └── index.html
└── README.md
```

## 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@purplemerit.com | admin |
| Manager | sarah.johnson@purplemerit.com | password123 |
| User | emily.rodriguez@purplemerit.com | password123 |

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd server
npm install
# Copy and configure .env
cp .env.example .env
# Start the server
npm run dev
```

The API will start on `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The app will start on `http://localhost:5173`.

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| POST | /api/auth/logout | Logout |

### Users
| Method | Endpoint | Auth | Roles |
|---|---|---|---|
| GET | /api/users | ✅ | Admin, Manager |
| POST | /api/users | ✅ | Admin |
| GET | /api/users/:id | ✅ | Admin, Manager |
| PUT | /api/users/:id | ✅ | Admin, Manager* |
| DELETE | /api/users/:id | ✅ | Admin |
| GET | /api/users/me | ✅ | Any |
| PUT | /api/users/me | ✅ | Any |
| GET | /api/users/stats | ✅ | Admin, Manager |

*Managers can only edit users with the "user" role and cannot change roles/status.

## 🛡️ Security Features

- JWT with short-lived access tokens (15 min) + refresh tokens (7 days)
- HTTP-only cookies for refresh token storage
- bcrypt password hashing (12 salt rounds)
- Helmet.js security headers
- CORS with origin whitelist
- Rate limiting (100 req/15min general, 20 req/15min auth)
- Zod input validation on all endpoints
- Soft delete (deactivation, not permanent deletion)

## 🎨 UI Features

- Dark mode toggle with system preference detection
- Collapsible sidebar navigation
- Animated skeleton loaders
- Toast notifications
- Empty states
- Role-based UI rendering
- Responsive design
- Micro-animations and hover effects
