FROM node:16

COPY package.json .

RUN npm install
RUN npm install -g pm2
COPY . .

EXPOSE 3000
