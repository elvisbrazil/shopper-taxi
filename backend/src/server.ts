import express from 'express';
import dotenv from 'dotenv';
import waitPort from 'wait-port';
import rideRoutes from './routes/rideRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Bem vindo à API da ShopperTaxi</h1>');
});
app.use('/ride', rideRoutes);

const PORT = process.env.NODE_DOCKER_PORT || 8080;
const DB_HOST = process.env.DB_HOST || 'mysqldb';
const DB_PORT = Number(process.env.DB_PORT) || 3306;

const startServer = async () => {
  console.log(`Esperando o banco de dados em ${DB_HOST}:${DB_PORT}...`);
  const dbReady = await waitPort({ host: DB_HOST, port: DB_PORT, timeout: 30000 });
  if (dbReady) {
    console.log('Banco de dados está pronto. Iniciando o servidor...');
    app.listen(PORT, () => {
      console.log(`ShopperTaxi 🚀, api rodando na porta ${PORT}`);
    });
  } else {
    console.error('Erro: Banco de dados não está pronto.');
    process.exit(1);
  }
};

startServer();