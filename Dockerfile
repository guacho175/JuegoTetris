# Etapa 1: Construcción (Build)
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./

RUN rm -f package-lock.json && npm install

COPY . .

RUN npm run build

# Etapa 2: Servidor (Nginx)
FROM nginx:stable-alpine

COPY default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]