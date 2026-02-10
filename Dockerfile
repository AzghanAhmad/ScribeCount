## Root-level Dockerfile
## Builds the Angular frontend from ./frontend and serves it with nginx.
## (A backend container can be added later via a separate Dockerfile or docker-compose.)

# 1) Build stage – compile the Angular frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy frontend source and build
COPY frontend/ .
RUN npm run build


# 2) Runtime stage – serve built frontend with nginx
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Reuse the SPA-aware nginx config from the frontend folder
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular assets
COPY --from=frontend-build /app/frontend/dist/scribecount /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

