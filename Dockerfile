
# ==================================
# Stage 1: Build React Application
# ==================================

FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# ==================================
# Stage 2: Non-root Nginx Runtime
# ==================================

FROM nginxinc/nginx-unprivileged:stable-alpine

# Update Alpine OS packages
USER root
RUN apk upgrade --no-cache

# Restore non-root user
USER 101

# Copy custom Nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy Vite production build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

# Container health check
HEALTHCHECK --interval=30s \
            --timeout=3s \
            --start-period=10s \
            --retries=3 \
            CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

