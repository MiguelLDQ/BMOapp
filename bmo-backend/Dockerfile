FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npx prisma generate

RUN npm run build

RUN ls -la dist/

EXPOSE 3000

CMD ["sh", "start.sh"]