# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./

RUN apk add --no-cache git
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 2: Nginx hosting + runtime env support
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create folder for runtime env
RUN mkdir -p /usr/share/nginx/html/config

# Copy default env template
COPY env.template.js /usr/share/nginx/html/config/env.js

# Copy entrypoint that replaces env variables at container startup
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
