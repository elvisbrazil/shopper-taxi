FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .
# Copiar e tornar o script wait-for-it.sh executável
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

EXPOSE 8080

# Use sh para executar o script wait-for-it.sh
CMD ["sh", "./wait-for-it.sh", "mysqldb:3306", "--", "npm", "run", "dev"]