import pool from '../config/database';

const createRoute = async (destination_id: number, latitude: number, longitude: number) => {
  const [result]: any = await pool.query(
    'INSERT INTO rotas (destination_id, latitude, longitude) VALUES (?, ?, ?)',
    [destination_id, latitude, longitude]
  );
  return result.insertId;
};

export { createRoute };