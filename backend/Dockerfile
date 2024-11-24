FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .

COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

EXPOSE 8080

# Use sh para executar o script wait-for-it.sh
#pessoal aqui quero garantir que o sevidor só funciona depois  do banco de dados está ok, 
#já que é um robô que vocês vão rodar então quis me certificar de deixar as coias mais automáticas possíveis.
CMD ["sh", "./wait-for-it.sh", "mysqldb:3306", "--", "npm", "run", "dev"]