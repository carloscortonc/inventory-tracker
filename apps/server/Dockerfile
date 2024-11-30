FROM arm64v8/node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ARG PORT

EXPOSE $PORT

CMD ["node", "index.js"]