# AI Health Platform

Modern full-stack application that lets users track wellness entries, receive AI-driven insights, and manage their account through a polished authentication flow (signup, login, forgot/reset password).

## Tech Stack

- **Frontend**: React + Vite, TypeScript, shadcn/ui components, Tailwind CSS, Zustand, axios, sonner toasts
- **Backend**: Node.js, Express, TypeScript, Zod validation, Mongoose/MongoDB, Nodemailer
- **Tooling**: pnpm, tsx, Mailpit (SMTP dev server), Docker (for Mongo/Mailpit convenience)

## Requirements

- Node.js 18+
- pnpm (`corepack enable` or `npm i -g pnpm`)
- Docker (recommended for MongoDB & Mailpit dev services)

## Quick Start

```bash
git clone https://github.com/Mulham27/Ai-health.git
cd Ai-health
```

### 1. Environment variables

Create `backend/.env`:

```bash
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_health
JWT_SECRET=change-me
CORS_ORIGIN=http://localhost:5173

# SMTP (use Mailpit for local testing)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=HealthAI <no-reply@example.com>
```

Create `frontend/.env` if you want to customize the API base (defaults to `http://localhost:4000/api`):

```bash
VITE_API_URL=http://localhost:4000/api
```

### 2. Start services (recommended)

```bash
# MongoDB
docker run -d --name ai_health_mongo -p 27017:27017 -v ai_health_mongo_data:/data/db mongo:7

# Mailpit (SMTP + UI at http://localhost:8025)
docker run -d --name mailpit -p 1025:1025 -p 8025:8025 axllent/mailpit
```

### 3. Backend

```bash
cd backend
pnpm install
pnpm dev
```

The API is available at `http://localhost:4000/api`.

### 4. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:5173.

## Key Features

- **Authentication**: Signup/login with full zod validation, Mongo persistence, JWT issuance, session persistence in frontend store.
- **Password reset**: User requests link, receives Mailpit email, sets new password via secure token endpoint.
- **Health entries API**: Stores entries in MongoDB with typed schema, provides AI analysis stub endpoint.
- **Professional UI**: Gradient layouts, validation hints, disabled states, toast notifications, seamless UX for auth flows.

## Testing the Reset Flow

1. Run Mailpit (`docker run ...` above).
2. Click “Forgot password” in the UI and submit your email.
3. Open http://localhost:8025 to view the email and copy the reset link.
4. Set a new password and confirm; you’ll be redirected to login.

## Project Structure

```
backend/
  src/
    app.ts
    routes/
    models/
    utils/
frontend/
  src/
    pages/
    components/
    lib/
```

## Troubleshooting

- **Cannot connect to Mongo**: Ensure Docker container is running (`docker ps`) and `MONGODB_URI` matches the port (default 27017).
- **Emails not sent**: Run Mailpit, confirm `.env` SMTP values, and check the Mailpit UI.
- **Signup/login toasts**: Verify backend is running on port 4000; the frontend will show inline validation errors when the API is reachable.

## Scripts

Backend:

| Script | Description |
| ------ | ----------- |
| `pnpm dev` | Run Express server via tsx |
| `pnpm build` | Type-check & compile |
| `pnpm start` | Run compiled server |

Frontend:

| Script | Description |
| ------ | ----------- |
| `pnpm dev` | Vite dev server (HMR) |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |

## License

MIT © 2025 Mulham27


