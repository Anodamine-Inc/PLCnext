FROM arm32v7/node

WORKDIR /app

COPY . .

RUN npm i

CMD ["node", "index.js"]
