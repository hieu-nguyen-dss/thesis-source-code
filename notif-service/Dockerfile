FROM node:14.16.0-alpine

EXPOSE 4000

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
