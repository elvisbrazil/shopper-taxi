import { Request, Response } from 'express';
import { GoogleMapsService } from '../services/googleMapsService';
import { DatabaseService } from '../services/databaseService';

export class RideController {
  private googleMapsService: GoogleMapsService;
  private databaseService: DatabaseService;

  constructor() {
    this.googleMapsService = new GoogleMapsService();
    this.databaseService = new DatabaseService();
  }

  async estimateRide(req: Request, res: Response): Promise<void> {
    try {
      const { customer_id, origin, destination } = req.body;
           // Verificação básica dos dados fornecidos
           if (!customer_id || !origin || !destination) {
            res.status(400).json({
              error_code: 'INVALID_DATA',
              error_description: 'Os dados fornecidos no corpo da requisição são inválidos.',
            });
            return;
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

  async confirmRide(req: Request, res: Response): Promise<void> {
    try {
      const usuario_id = req.body.customer_id;
      if (!usuario_id) {
        throw new Error('ID do usuário não está disponível.');
      }

      const lastRideDetails = await this.databaseService.getLastRideDetails(usuario_id);
      if (!lastRideDetails) {
        throw new Error(`Nenhuma corrida encontrada para o usuário com ID ${usuario_id}.`);
      }

      const rideDetails = this.buildRideDetails(req.body, lastRideDetails);

      const confirmation = await this.databaseService.confirmRide(rideDetails);
      res.status(200).json(confirmation);
    } catch (error) {
      console.error('Erro ao confirmar corrida:', error);
      res.status(500).json({ error: 'Erro ao confirmar corrida' });
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

  private buildRideDetails(body: any, lastRideDetails: any): any {
    return {
      customer_id: body.customer_id,
      origin: lastRideDetails.origin,
      destination: lastRideDetails.destination,
      distance: lastRideDetails.distance,
      duration: lastRideDetails.duration,
      driver: body.driver,
      value: body.value, // Valor da corrida
      destinationCoordinates: {
        latitude: lastRideDetails.destination_latitude,
        longitude: lastRideDetails.destination_longitude,
      },
    };
  }
}