FROM node:14-alpine

WORKDIR /app

COPY . .

RUN npm i

CMD ["node", "index.js"]
