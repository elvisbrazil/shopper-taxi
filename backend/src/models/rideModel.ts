import pool from '../config/database';

const createRide = async (usuario_id: number, origin: string, destination: string, distancia_km: number, valor: number) => {
  const [result]: any = await pool.query(
    'INSERT INTO viagens (usuario_id, origin, destination, distancia_km, valor) VALUES (?, ?, ?, ?, ?)',
    [usuario_id, origin, destination, distancia_km, valor]
  );

  if (!result || !result.insertId) {
    throw new Error('Erro ao inserir corrida');
  }

  return result.insertId;
};

const getRidesByUserId = async (usuario_id: number) => {
  const [rows] = await pool.query('SELECT * FROM viagens WHERE usuario_id = ? ORDER BY data DESC', [usuario_id]);
  return rows;
};

export { createRide, getRidesByUserId };