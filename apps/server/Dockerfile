FROM arm64v8/node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ARG PORT
ARG SRV_PASSWORD

ENV PORT=$PORT
ENV SRV_PASSWORD=$SRV_PASSWORD

EXPOSE $PORT

CMD ["node", "index.js"]