import pool from '../config/database';

const getAllDrivers = async () => {
  const [rows] = await pool.query('SELECT * FROM motoristas');
  return rows;
};

const getDriverById = async (id: number) => {
  const [rows]: [any[], any] = await pool.query('SELECT * FROM motoristas WHERE id = ?', [id]);
  return rows[0];
};

export { getAllDrivers, getDriverById };