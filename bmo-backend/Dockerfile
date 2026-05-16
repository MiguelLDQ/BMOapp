FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN echo "=== iniciando build ===" && \
    ./node_modules/.bin/nest build && \
    echo "=== build ok ===" || \
    (echo "=== ERRO NO BUILD ===" && \
    ./node_modules/.bin/tsc --version && \
    ./node_modules/.bin/tsc 2>&1 && \
    exit 1)

RUN ls -la dist/ || echo "DIST VAZIO"

EXPOSE 3000

CMD ["sh", "start.sh"]