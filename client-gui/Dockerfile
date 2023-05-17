FROM node:16.14.0-alpine as build-stage

WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM nginx:1.20-alpine
COPY --from=build-stage /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
