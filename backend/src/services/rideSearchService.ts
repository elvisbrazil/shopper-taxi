import mysql from 'mysql2/promise';

export class RideSearchService {
  private connection: mysql.Connection;

  constructor() {
    this.connect();
  }

  private async connect() {
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async getRidesByUser(userId: string, driverId?: string) {
    let query = `
      SELECT v.id, v.data, v.origin, v.destination, v.distancia_km, v.duracao_estimada, v.valor, 
             m.id as motorista_id, m.nome as motorista_nome
      FROM viagens v
      JOIN motoristas m ON v.motorista_id = m.id
      WHERE v.usuario_id = ?
    `;
    const params: any[] = [userId];

    if (driverId) {
      query += ' AND v.motorista_id = ?';
      params.push(driverId);
    }

    query += ' ORDER BY v.data DESC';

    const [rows]: any = await this.connection.execute(query, params);
    return rows;
  }

  async userExists(userId: string) {
    const query = 'SELECT 1 FROM usuarios WHERE id = ?';
    const [rows]: any = await this.connection.execute(query, [userId]);
    return rows.length > 0;
  }

  async driverExists(driverId: string) {
    const query = 'SELECT 1 FROM motoristas WHERE id = ?';
    const [rows]: any = await this.connection.execute(query, [driverId]);
    return rows.length > 0;
  }
}