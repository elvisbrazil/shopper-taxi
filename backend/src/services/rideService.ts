import { DatabaseService } from './databaseService';

export class RideService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async confirmRide(customer_id: string, rideDetails: any): Promise<any> {
    if (!customer_id) {
      throw {
        status: 400,
        error_code: 'INVALID_DATA',
        error_description: 'ID do usuário não está disponível.',
      };
    }

    const lastRideDetails = await this.databaseService.getLastRideDetails(customer_id);
    if (!lastRideDetails) {
      throw {
        status: 404,
        error_code: 'DRIVER_NOT_FOUND',
        error_description: `Nenhuma corrida encontrada para o usuário com ID ${customer_id}.`,
      };
    }

    const rideDetailsWithLastRide = this.buildRideDetails(rideDetails, lastRideDetails);

    // Verificação de quilometragem inválida para o motorista
    if (rideDetailsWithLastRide.distance <= 0) {
      throw {
        status: 406,
        error_code: 'INVALID_DISTANCE',
        error_description: 'Quilometragem inválida para o motorista.',
      };
    }

    return await this.databaseService.confirmRide(rideDetailsWithLastRide);
  }

  private buildRideDetails(newRideDetails: any, lastRideDetails: any): any {
    // Lógica para construir os detalhes da corrida
    return {
      ...lastRideDetails,
      ...newRideDetails,
    };
  }
}