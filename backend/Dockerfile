FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY tsconfig.json ./tsconfig.json
COPY src ./src

ENV NODE_ENV=production

EXPOSE 4000

CMD ["pnpm", "dev"]


