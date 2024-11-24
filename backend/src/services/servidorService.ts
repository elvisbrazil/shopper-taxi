import express from 'express';
import waitPort from 'wait-port';
import rideRoutes from '../routes/rideRoutes';
import { DB_HOST, DB_PORT } from '../database/database';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Bem vindo à API da ShopperTaxi🚕</h1> ');
});
app.use('/ride', rideRoutes);

const PORT = process.env.NODE_DOCKER_PORT || 8080 ;

/// pessoal aqui quero garantir que o sevidor só funciona depois  do banco de dados está ok, 
///já que é um robô que vocês vão rodar então quis me certificar de deixar as coias mais automáticas possíveis.
export const startServer = async () => {
  console.log(`Esperando o banco de dados em ${DB_HOST}:${DB_PORT}...`);
  const dbReady = await waitPort({ host: DB_HOST, port: DB_PORT, timeout: 30000 });
  if (dbReady) {
    console.log('Banco de dados está pronto. Iniciando o servidor...');
    app.listen(PORT, () => {
      console.log(`🚀 api iniciada!🚕
      ______
     /|_||_\\\`.__
    (   _    _ _\\
    =\`-(_)--(_)-'
   S H O P P E R  T A X I `);
    });
  } else {
    console.error('Erro: Banco de dados não está pronto.');
    process.exit(1);
  }
};