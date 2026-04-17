# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final stage
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/ranking.json ./
# Note: tsx is needed to run server.ts directly, or I could compile it.
# For simplicity in this environment, I'll install tsx as a dependency or run node with strip types.
# Actually, I'll use tsx as a dev dependency to run it.
RUN npm install -g tsx

ENV PORT=8080
EXPOSE 8080
ENV NODE_ENV=production
CMD ["tsx", "server.ts"]
