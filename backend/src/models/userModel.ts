import pool from '../config/database';

const getUserById = async (id: number) => {
  const [rows]: any = (await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]))[0];
  return rows[0];
};

export { getUserById };