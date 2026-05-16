FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npx prisma generate

RUN rm -rf dist

RUN npm run build

EXPOSE 3000

CMD ["sh", "start.sh"]