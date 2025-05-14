FROM node:22-slim

RUN apt-get -y update

RUN apt-get -y upgrade

RUN apt-get install -y ffmpeg

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force && npm ci --only=production

COPY . .

RUN npm install -g pm2

EXPOSE 3001

ENV PORT=3001

CMD ["pm2-runtime", "start", "src/app.js"]