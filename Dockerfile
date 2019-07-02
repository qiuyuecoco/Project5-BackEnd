FROM node:lts-alpine

MAINTAINER Keisha Ding <krding@verisk.com>

WORKDIR /usr/src/app

COPY . .

#COPY package*.json ./

RUN npm install

EXPOSE 4000

CMD ["npm", "start"]
