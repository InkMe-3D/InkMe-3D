# Build Stage
FROM node:18-alpine as builder

WORKDIR /app
COPY . .

# Cài đặt phụ thuộc
RUN npm install

# Build project
RUN npm run build

# Serve stage
FROM node:18-alpine

# Cài serve
RUN npm install -g serve

WORKDIR /app
COPY --from=builder /app/dist ./dist

EXPOSE 3036
CMD ["serve", "-s", "dist", "-l", "3036"]
