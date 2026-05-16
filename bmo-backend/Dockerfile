FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npx prisma generate

RUN npm run build

RUN echo "=== verificando dist ===" && ls -la /app/dist/ && echo "=== main.js ===" && ls /app/dist/main.js

EXPOSE 3000

CMD ["sh", "start.sh"]