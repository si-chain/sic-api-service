FROM docker.banmadata.com/node:v1.0.0

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
WORKDIR /app
ADD package.json /app/
RUN yarn --pure-lockfile
ADD . /app
RUN yarn docs

CMD ["yarn", "docker:start"]
