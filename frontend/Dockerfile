## Multi-stage Dockerfile for ScribeCount Angular frontend

# 1) Build stage - compile Angular app
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build


# 2) Runtime stage - serve built app with nginx
FROM nginx:1.27-alpine AS runtime

# Remove default nginx site config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app
COPY --from=build /app/dist/scribecount /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

