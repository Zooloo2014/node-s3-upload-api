FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY src ./

EXPOSE 5000

CMD ["node", "server.js"]
