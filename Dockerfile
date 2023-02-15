FROM node:14-alpine as builder
WORKDIR /app
COPY . .
RUN npm ci \
 && npm run build

FROM nginx:stable-alpine AS prod
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/build /usr/share/nginx/html
COPY scripts/replace-tokens.sh /docker-entrypoint.d/
RUN apk add --no-cache pcre-tools \
 && chmod +x /docker-entrypoint.d/replace-tokens.sh
