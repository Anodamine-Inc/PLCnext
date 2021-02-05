FROM armhf/debian

RUN curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
RUN sudo bash nodesource_setup.sh

WORKDIR /app

COPY . .

RUN npm i

CMD ["node", "index.js"]
