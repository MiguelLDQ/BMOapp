FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN ./node_modules/.bin/nest build && echo "BUILD OK" && find /app -name "main.js" 2>/dev/null || echo "main.js NAO ENCONTRADO"

EXPOSE 3000

RUN sed -i 's/\r//' start.sh && chmod +x start.sh

CMD ["sh", "start.sh"]