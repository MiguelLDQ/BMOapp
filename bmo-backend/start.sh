#!/bin/sh
set -e

echo "=== listando dist ==="
ls /app/dist

echo "=== rodando prisma migrate ==="
npx prisma migrate deploy 2>&1

echo "=== subindo app ==="
node /app/dist/main 2>&1