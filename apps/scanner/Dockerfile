FROM arm64v8/node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

ARG SRV_PASSWORD
ENV SRV_PASSWORD=$SRV_PASSWORD

COPY . .

CMD ["node", "index.js"]