FROM node:20-slim

# Prisma a besoin d'OpenSSL pour fonctionner correctement
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
