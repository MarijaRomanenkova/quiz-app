FROM node:20-alpine

WORKDIR /app

# Install netcat for health check
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD npx prisma migrate deploy && npm run start:dev 
