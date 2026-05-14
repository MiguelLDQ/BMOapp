FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY bmo-backend/package*.json ./

RUN npm install

COPY bmo-backend/ .

RUN npx prisma generate

RUN npm run build

COPY start.sh ./start.sh
RUN chmod +x start.sh

EXPOSE 3000

CMD ["sh", "start.sh"]