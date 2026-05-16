FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN ./node_modules/.bin/nest build

RUN echo "=== dist gerado ===" && ls -la /app/dist/

EXPOSE 3000

CMD ["sh", "start.sh"]