FROM node:18-alpine as build
WORKDIR /app
ARG RUN_ENV
ENV PUBLIC_URL=/
ENV REACT_APP_ROUTER_BASENAME=/
ENV REACT_APP_APP_MODE=${RUN_ENV}
RUN apk update && apk add --no-cache git
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:1.23.1-alpine
COPY --from=build /app/build /app/build
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
