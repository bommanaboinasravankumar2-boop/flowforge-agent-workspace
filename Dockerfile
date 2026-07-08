# Multi-stage production build for FlowForge AI
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy lockfiles and configuration files
COPY package*.json tsconfig.json vite.config.ts server.ts ./

# Install dependencies including dev dependencies to build client
RUN npm ci

# Copy all source files
COPY src/ ./src/
COPY public/ ./public/
COPY metadata.json index.html ./

# Build production Vite app and bundle Node server via esbuild
RUN npm run build

# Stage 2: Minimal runtime image
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Copy built artifacts
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
