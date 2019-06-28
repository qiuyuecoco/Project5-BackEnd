FROM node:lts-alpine

MAINTAINER Keisha Ding <krding@verisk.com>

WORKDIR /usr/src/app

EXPOSE 4040
COPY . .

#COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
