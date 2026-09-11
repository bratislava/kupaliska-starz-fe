FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite bakes VITE_* into the bundle; the cluster's committed env file is the
# only build-time configuration.
ARG CLUSTER=development
COPY .env.build.${CLUSTER} .env.production.local
RUN npm run build

# nginx-unprivileged runs as uid 101 and listens on 8080 (restricted PodSecurity).
# The config stays a template: RENDERTRON_HOST is substituted at container start.
FROM nginxinc/nginx-unprivileged:1.30.4-alpine AS prod
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
