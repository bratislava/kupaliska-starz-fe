FROM node:14-alpine as builder
WORKDIR /app
COPY . .
RUN npm ci

ENV REACT_APP_HOST=%{HOST}%
ENV REACT_APP_RECAPTCHA_KEY=%{RECAPTCHA_CLIENT_SECRET}%

RUN npm run build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/build /usr/share/nginx/html
COPY scripts/replace-tokens.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/replace-tokens.sh
RUN apk add --no-cache pcre-tools
