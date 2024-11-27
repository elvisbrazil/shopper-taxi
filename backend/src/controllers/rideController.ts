import { Request, Response } from 'express';
import { GoogleMapsService } from '../services/googleMapsService';
import { DatabaseService } from '../services/databaseService';
import { RideService } from '../services/rideService';
import { ValidationService } from '../services/validationService';

export class RideController {
  private googleMapsService: GoogleMapsService;
  private databaseService: DatabaseService;
  private rideService: RideService;
  private validationService: ValidationService;

  constructor() {
    this.databaseService = new DatabaseService();
    this.googleMapsService = new GoogleMapsService();
    this.rideService = new RideService();
    this.validationService = new ValidationService(this.databaseService);
  }



  // Estimar uma corrida
  async estimateRide(req: Request, res: Response): Promise<void> {
    try {
      const { customer_id, origin, destination } = req.body;

      if (!customer_id || !origin || !destination) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Os dados fornecidos no corpo da requisição são inválidos.',
        });
      }

      const estimate = await this.googleMapsService.estimateRide({ 
        customer_id, 
        origin, 
        destination 
      });

      await this.databaseService.saveGoogleMapsResult(estimate, customer_id);
      await this.databaseService.saveRide(estimate, customer_id);

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
      const { customer_id, distance, driver } = req.body;

      await this.validationService.validateCustomerId(customer_id);
      await this.validationService.validateDriver(driver);
      await this.validationService.validateRideDistance(driver.id, distance);
      const lastRideDetails = await this.validationService.validateLastRide(customer_id);

      const rideDetailsWithLastRide = this.buildRideDetails(req.body, lastRideDetails);
      const confirmation = await this.databaseService.confirmRide(rideDetailsWithLastRide);
      
      res.status(200).json(confirmation);

    } catch (error: any) {
      console.error('Erro ao confirmar corrida:', error);
      
      res.status(error.status || 500).json({
        error_code: error.error_code || 'INTERNAL_SERVER_ERROR',
        error_description: error.error_description || 'Erro ao confirmar corrida'
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
    })).sort((driverA: any, driverB: any) => driverA.value - driverB.value);
  }

  private buildRideDetails(newRideDetails: any, lastRideDetails: any): any {
    return {
      ...lastRideDetails,
      ...newRideDetails,
    };
  }
}