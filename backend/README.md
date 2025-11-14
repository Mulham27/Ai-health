Backend (Node + Express + MongoDB)

Scripts
- dev: tsx watch src/server.ts
- build: tsc -p tsconfig.json
- start: node dist/server.js

Setup
1. Copy env.example to .env and adjust values
2. pnpm i (or npm i)
3. pnpm dev (or npm run dev)

Endpoints
- GET /healthz
- POST /api/auth/register { email, password, name? }
- POST /api/auth/login { email, password }
- GET /api/auth/me (Authorization: Bearer TOKEN)


