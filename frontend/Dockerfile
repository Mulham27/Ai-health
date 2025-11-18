FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY tsconfig*.json ./ 
COPY vite.config.ts ./vite.config.ts
COPY index.html ./index.html
COPY globals.css ./globals.css
COPY src ./src

ENV VITE_API_URL=http://backend:4000/api

EXPOSE 5173

CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "5173"]


