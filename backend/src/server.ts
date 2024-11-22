import express from 'express';
import dotenv from 'dotenv';
import rideRoutes from './routes/rideRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Bem vindo à API da ShopperTaxi</h1>');
});

app.use('/ride', rideRoutes);



const PORT = process.env.NODE_DOCKER_PORT || 8080;

app.listen(PORT, () => {
  console.log(`ShopperTaxi 🚀, api rodando na porta ${PORT}`);
});