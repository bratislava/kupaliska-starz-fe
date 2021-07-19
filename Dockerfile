ARG REACT_APP_HOST=%{HOST}%
ARG REACT_APP_RECAPTCHA_KEY=%{RECAPTCHA_CLIENT_SECRET}%

FROM node:14 as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/build /usr/share/nginx/html
COPY scripts/replace-tokens.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/replace-tokens.sh
RUN apk add --no-cache pcre-tools
