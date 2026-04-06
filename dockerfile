# Build: Vite tự load .env.production khi NODE_ENV=production (file phải có trong context, không bị .dockerignore loại)
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
# vite.config: outDir là dish (không phải dist)
COPY --from=builder /app/dish ./dish

EXPOSE 3036

CMD ["serve", "-s", "dish", "-l", "3036"]
