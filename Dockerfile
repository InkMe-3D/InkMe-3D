# Build: Vite tự load .env.production khi NODE_ENV=production
FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN yarn build

FROM node:20-bookworm-slim

RUN npm install -g serve@14

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 3037

CMD ["serve", "-s", "dist", "-l", "3037"]
