
import { DatabaseService } from './databaseService';

export class ValidationService {
  constructor(private databaseService: DatabaseService) {}


  // Valida se o customerId foi fornecido
  async validateCustomerId(customerId: string): Promise<void> {
    if (!customerId) {
      throw {
        status: 400,
        error_code: 'INVALID_DATA',
        error_description: 'customer_id não fornecido'
      };
    }
  }


    // Valida se os dados do motorista são válidos e se o motorista existe
  async validateDriver(driver: any): Promise<void> {
    if (!driver?.id) {
      throw {
        status: 400,
        error_code: 'INVALID_DATA',
        error_description: 'Dados do motorista inválidos'
      };
    }

    const driverExists = await this.databaseService.driverExists(driver.id);
    if (!driverExists) {
      throw {
        status: 404,
        error_code: 'DRIVER_NOT_FOUND',
        error_description: 'Motorista não encontrado'
      };
    }
  }


    // Valida se a distância da corrida é válida para o motorista
  async validateRideDistance(driverId: string, distance: number): Promise<void> {
    const driverDetails = await this.databaseService.getDriverById(driverId);
    const minDistance = driverDetails.minimo;

    if (distance < minDistance) {
      throw {
        status: 406,
        error_code: 'INVALID_DISTANCE',
        error_description: 'Quilometragem inválida para o motorista.'
      };
    }
  }


    // Valida se há detalhes da última corrida do cliente

  async validateLastRide(customerId: string): Promise<any> {
    const lastRideDetails = await this.databaseService.getLastRideDetails(customerId);
    if (!lastRideDetails) {
      throw {
        status: 400,
        error_code: 'RIDE_NOT_FOUND',
        error_description: 'Os dados fornecidos no corpo da requisição são inválidos.'
      };
    }
    return lastRideDetails;
  }
}