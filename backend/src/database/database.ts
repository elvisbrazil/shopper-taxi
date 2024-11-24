import mysql from 'mysql2/promise';

export const DB_HOST = process.env.DB_HOST || 'mysqldb';
export const DB_PORT = Number(process.env.DB_PORT) || 3306;

const connect = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  return connection;
};

export default connect;