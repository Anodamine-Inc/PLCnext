FROM arm32v7/node:14-alpine

WORKDIR /app

COPY . .

# EXPOSE 1883
# EXPOSE 80
# EXPOSE 3010

# RUN apt update
# RUN apt upgrade -y
# RUN apt install -y nodejs
# RUN apt install -y npm
# RUN npm install -g npm


RUN npm i

CMD ["node", "index.js"]
