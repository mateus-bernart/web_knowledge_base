FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "API_URL=$API_URL react-router-serve ./build/server/index.js"]
