import { Request, Response } from 'express';
import { GoogleMapsService } from '../services/googleMapsService';
import { DatabaseService } from '../services/databaseService';
import { RideService } from '../services/rideService';

export class RideController {
  private googleMapsService: GoogleMapsService;
  private databaseService: DatabaseService;
  private rideService: RideService;

  constructor() {
    this.googleMapsService = new GoogleMapsService();
    this.databaseService = new DatabaseService();
    this.rideService = new RideService();
  }
/// Metodo para Estimar a viagem
  async estimateRide(req: Request, res: Response): Promise<void> {
    try {
      const { customer_id, origin, destination } = req.body;

      // Verificação básica dos dados fornecidos
      if (!customer_id || !origin || !destination) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Os dados fornecidos no corpo da requisição são inválidos.',
        });
      }

      const estimate = await this.googleMapsService.estimateRide({ 
        customer_id, origin, destination 
      });

      const googleMapsResultId = await this.databaseService.saveGoogleMapsResult(estimate, customer_id);
      const viagemId = await this.databaseService.saveRide(estimate, customer_id);

      const options = await this.getDriverOptions(estimate.distance);

      res.json({
        origin: estimate.origin,
        destination: estimate.destination,
        distance: estimate.distance,
        duration: estimate.duration,
        options,
        routeResponse: estimate.routeResponse
      });
    } catch (error) {
      console.error('Erro na estimativa de corrida:', error);
      res.status(500).json({ error: 'Erro na estimativa de corrida' });
    }
  }
  /// Metodo para Confirmar a viagem
  
  async confirmRide(req: Request, res: Response): Promise<void> {
    try {
      const { customer_id, origin, destination, distance, driver } = req.body;
  
      // Verificação básica dos dados fornecidos
      if (!customer_id || !origin || !destination || distance === undefined) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Os dados fornecidos no corpo da requisição são inválidos.',
        });
      }
  
      // Verifica se o driver.id está presente
      if (!driver || !driver.id) {
        return res.status(404).json({
          error_code: 'DRIVER_NOT_FOUND',
          error_description: 'Motorista não encontrado.',
        });
      }
  
      // Verifica se o motorista existe
      const driverExists = await this.databaseService.driverExists(driver.id);
      if (!driverExists) {
        return res.status(404).json({
          error_code: 'DRIVER_NOT_FOUND',
          error_description: `Motorista não encontrado.`,
        });
      }
  
      // Verifica se há detalhes da última corrida
      const lastRideDetails = await this.databaseService.getLastRideDetails(customer_id);
      if (!lastRideDetails) {
        return res.status(400).json({
          error_code: 'RIDE_NOT_FOUND',
          error_description: `Os dados fornecidos no corpo da requisição são inválidos.`,
        });
      }
      const driverDetails = await this.databaseService.getDriverById(driver.id);
      const minDistance = driverDetails.minimo; // Supondo que a coluna se chama 'minimo'

      // Verifica se a distância é válida para o motorista
      if (distance < minDistance) {
        return res.status(406).json({
          error_code: 'INVALID_DISTANCE',
          error_description: 'Quilometragem inválida para o motorista.',
        });
      }
      const rideDetailsWithLastRide = this.buildRideDetails(req.body, lastRideDetails);
      
      // Confirma a corrida
      const confirmation = await this.databaseService.confirmRide(rideDetailsWithLastRide);
      res.status(200).json(confirmation);
    } catch (error) {
      console.error('Erro ao confirmar corrida:', error);
  
      // Se não houver um status, retorna um erro 500 padrão
      res.status(500).json({
        error_code: 'INTERNAL_SERVER_ERROR',
        error_description: 'Erro ao confirmar corrida',
      });
    }
  }



  
  private async getDriverOptions(distance: number): Promise<any[]> {
    const drivers = await this.databaseService.getAllDrivers();
    return drivers.map((driver: any) => ({
      id: driver.id,
      name: driver.nome,
      description: driver.descricao,
      vehicle: driver.carro,
      review: {
        rating: parseFloat(driver.avaliacao),
        comment: driver.comment || ''
      },
      value: driver.taxa_km * (distance / 1000)
    })).sort((driverA: any, driverB: any) => driverA.value - driverB.value); // Ordena por valor da corrida
  }

  private buildRideDetails(newRideDetails: any, lastRideDetails: any): any {
    // Lógica para construir os detalhes da corrida
    return {
      ...lastRideDetails,
      ...newRideDetails,
    };
  }
}