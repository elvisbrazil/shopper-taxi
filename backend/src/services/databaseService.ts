import { Connection } from 'mysql2/promise';
import connect from '../database/database';
import { RideEstimateResponse, RideConfirmRequest, GoogleMapsResult, Ride } from '../types';



export class DatabaseService {
  private connection: Connection;

  constructor() {
    this.connect();
  }

  private async connect() {
    this.connection = await connect();
  }

  // Métodos relacionados ao Google Maps
  async saveGoogleMapsResult(estimate: RideEstimateResponse, userId: string): Promise<number> {
    const { origin, destination, distance, duration, routeResponse } = estimate;

    const data: GoogleMapsResult = {
      usuario_id: userId,
      origin: `${origin.latitude},${origin.longitude}`,
      destination: `${destination.latitude},${destination.longitude}`,
      distancia_km: Number((distance / 1000).toFixed(2)),
      duracao_estimada: Number((duration / 60).toFixed(2)),
      status: 'sucesso',
      response_api: JSON.stringify(routeResponse)
    };

    const query = `
      INSERT INTO google_maps_results SET ?
      ON DUPLICATE KEY UPDATE
        origin = VALUES(origin),
        destination = VALUES(destination),
        distancia_km = VALUES(distancia_km),
        duracao_estimada = VALUES(duracao_estimada),
        status = VALUES(status),
        response_api = VALUES(response_api)
    `;
    
    const [result]: any = await this.connection.query(query, data);
    return result.insertId;
  }

  // Métodos relacionados a Viagens
  async saveRide(estimate: RideEstimateResponse, userId: string): Promise<number> {
    if (!await this.userExists(userId)) {
      throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }

    const { origin, destination, distance, duration } = estimate;

    const ride: Ride = {
      usuario_id: userId,
      origin: `${origin.address}`,
      origin_latitude: origin.latitude,
      origin_longitude: origin.longitude,
      destination: `${destination.address}`,
      destination_latitude: destination.latitude,
      destination_longitude: destination.longitude,
      distancia_km: Number((distance / 1000).toFixed(2)),
      duracao_estimada: Number((duration / 60).toFixed(2)),
      valor: 0 
    };

    const query = 'INSERT INTO viagens SET ?';
    const [result]: any = await this.connection.query(query, ride);
    return result.insertId;
  }

  async getLastRideDetails(userId: string): Promise<Ride | null> {
    const query = `
      SELECT * FROM viagens 
      WHERE usuario_id = ? 
      ORDER BY id DESC 
      LIMIT 1
    `;
    
    const [rows]: any = await this.connection.execute(query, [userId]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Métodos relacionados a Motoristas
  async getAllDrivers(): Promise<any[]> {
    const query = 'SELECT * FROM motoristas';
    const [rows]: any = await this.connection.execute(query);
    return rows;
  }

  async getDriverById(driverId: string): Promise<any | null> {
    const query = 'SELECT * FROM motoristas WHERE id = ?';
    const [rows]: any = await this.connection.execute(query, [driverId]);
    return rows.length > 0 ? rows[0] : null;
  }

  async driverExists(driverId: string): Promise<boolean> {
    const driver = await this.getDriverById(driverId);
    return driver !== null;
  }

  // Métodos relacionados a Usuários
  private async userExists(userId: string): Promise<boolean> {
    const query = 'SELECT COUNT(*) as count FROM usuarios WHERE id = ?';
    const [rows]: any = await this.connection.execute(query, [userId]);
    return rows[0].count > 0;
  }

  // Método de confirmação de corrida
  async confirmRide(rideDetails: RideConfirmRequest): Promise<{ success: boolean }> {
    try {
      if (!rideDetails.driver?.id || !rideDetails.customer_id) {
        throw new Error('Parâmetros obrigatórios estão faltando.');
      }

      await this.connection.beginTransaction();

      const viagemId = await this.getLastRideId(rideDetails.customer_id);
      
      await this.connection.query(
        'UPDATE viagens SET motorista_id = ?, valor = ?, status = ? WHERE id = ?',
        [rideDetails.driver.id, rideDetails.value, 'aceita', viagemId]
      );

      await this.connection.commit();
      return { success: true };
    } catch (error) {
      await this.connection.rollback();
      throw error;
    }
  }

  private async getLastRideId(userId: string): Promise<number> {
    const query = `
      SELECT id FROM viagens 
      WHERE usuario_id = ? 
      ORDER BY id DESC 
      LIMIT 1
    `;
    
    const [rows]: any = await this.connection.execute(query, [userId]);
    if (rows.length === 0) {
      throw new Error('Nenhuma viagem encontrada para este usuário.');
    }
    return rows[0].id;
  }
}