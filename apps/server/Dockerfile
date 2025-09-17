FROM arm64v8/alpine:3.20

WORKDIR /app

ENV NODE_VERSION=20.15.1-r0

RUN apk add --no-cache nodejs=$NODE_VERSION npm

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 8080

CMD ["node", "index.js"]