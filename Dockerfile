FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

ENV PORT=3000
EXPOSE 3000

CMD ["yarn", "start"]