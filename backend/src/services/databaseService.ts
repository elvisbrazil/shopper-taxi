import connect from '../database/database';
import { RideEstimateResponse, RideConfirmRequest } from '../types';

export class DatabaseService {
  private connection: any;

  constructor() {
    this.connect();
  }

  private async connect() {
    this.connection = await connect();
  }

  async saveGoogleMapsResult(estimate: RideEstimateResponse, userId: string) {
    const { origin, destination, distance, duration, options, routeResponse } = estimate;

    const query = `
      INSERT INTO google_maps_results (
        usuario_id, 
        origin, 
        destination, 
        distancia_km, 
        duracao_estimada, 
        status, 
        response_api
      )
      VALUES (?, ?, ?, ?, ?, 'sucesso', ?)
      ON DUPLICATE KEY UPDATE
        origin = VALUES(origin),
        destination = VALUES(destination),
        distancia_km = VALUES(distancia_km),
        duracao_estimada = VALUES(duracao_estimada),
        status = VALUES(status),
        response_api = VALUES(response_api)
    `;
    
    const [result] = await this.connection.execute(query, [
      userId,
      `${origin.latitude},${origin.longitude}`,
      `${destination.latitude},${destination.longitude}`,
      (distance / 1000).toFixed(2),
      (duration / 60).toFixed(2),
      JSON.stringify(routeResponse)
    ]);

    return result.insertId;
  }

  async saveRide(estimate: RideEstimateResponse, userId: string) {
    const { origin, destination, distance, duration, options } = estimate;

    // Verifique se o usuario_id existe na tabela usuarios
    const userExists = await this.userExists(userId);
    if (!userExists) {
      throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }

    const query = `
      INSERT INTO viagens (
        usuario_id, 
        origin, 
        origin_latitude, 
        origin_longitude, 
        destination, 
        destination_latitude, 
        destination_longitude, 
        distancia_km, 
        duracao_estimada,
        valor
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await this.connection.execute(query, [
      userId,
      estimate.routeResponse.origin_addresses[0],
      origin.latitude,
      origin.longitude,
      estimate.routeResponse.destination_addresses[0],
      destination.latitude,
      destination.longitude,
      (distance / 1000).toFixed(2),
      estimate.duration,
      null // Inicialmente o valor é null
    ]);

    return result.insertId;
  }

  async userExists(userId: string) {
    const query = 'SELECT 1 FROM usuarios WHERE id = ?';
    const [rows]: any = await this.connection.execute(query, [userId]);
    return rows.length > 0;
  }

  async getLastRideDetails(usuario_id: string) {
    const query = `
      SELECT * FROM viagens 
      WHERE usuario_id = ? 
      ORDER BY id DESC 
      LIMIT 1
    `;
    
    const [rows]: any = await this.connection.execute(query, [usuario_id]);

    if (rows.length === 0) {
      throw new Error('Nenhuma corrida encontrada para este usuário.');
    }

    return rows[0];
  }

  async getLastViagemId(usuario_id: string) {
    const query = `
      SELECT id FROM viagens 
      WHERE usuario_id = ? 
      ORDER BY id DESC 
      LIMIT 1
    `;
    
    const [rows]: any = await this.connection.execute(query, [usuario_id]);

    if (rows.length === 0) {
      throw new Error('Nenhuma viagem encontrada para este usuário.');
    }

    return rows[0].id;
  }

  async getAllDrivers() {
    const query = 'SELECT * FROM motoristas';
    const [rows]: any = await this.connection.execute(query);
    return rows;
  }

  async confirmRide(rideDetails: any) {
    const connection = await connect();

    try {
      // Verifique se todos os parâmetros estão definidos
      if (!rideDetails.driver || !rideDetails.driver.id || rideDetails.value === undefined || !rideDetails.customer_id) {
        throw new Error('Parâmetros obrigatórios estão faltando.');
      }

      // Obtenha o ID da última viagem do usuário
      const viagemId = await this.getLastViagemId(rideDetails.customer_id);

      console.log('Confirmando corrida para viagem ID:', viagemId);

      // Inicia transação
      await connection.beginTransaction();

      // Atualiza viagem
      await connection.query(
        'UPDATE viagens SET motorista_id = ?, valor = ?, status = ? WHERE id = ?',
        [
          rideDetails.driver.id,
          rideDetails.value,
          'aceita',
          viagemId
        ]
      );

      // Commita a transação
      await connection.commit();

      return { success: true };
    } catch (error) {
      // Rollback em caso de erro
      await connection.rollback();
      console.error('Erro ao confirmar corrida:', error);
      throw error;
    } finally {
      connection.end();
    }
  }
}