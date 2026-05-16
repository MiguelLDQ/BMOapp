#!/bin/sh
ls /app/dist
npx prisma migrate deploy
node dist/main