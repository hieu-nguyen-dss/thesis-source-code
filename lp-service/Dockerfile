FROM node:16.14.0-alpine

EXPOSE 8000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN apk update && \
  apk upgrade && \
  apk add git

RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile --silent
ADD . /app

CMD ["yarn", "start"]
