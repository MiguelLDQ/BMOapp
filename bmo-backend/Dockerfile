FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN ./node_modules/.bin/nest build 2>&1 || (echo "NEST BUILD FAILED" && cat tsconfig.json && exit 1)

RUN ls -la dist/ || echo "DIST NAO EXISTE"

EXPOSE 3000

CMD ["sh", "start.sh"]