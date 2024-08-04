FROM arm64v8/node:20-alpine

RUN apk update && apk upgrade
RUN apk add g++ make py3-pip libusb-dev hidapi-dev linux-headers eudev-dev
# libusb-dev
#  libusb-1.0-dev
# RUN apk add udev

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ARG PORT
ENV PORT=$PORT

EXPOSE $PORT

CMD ["node", "index.js"]