import { Request, Response } from 'express';
import { RideSearchService } from '../services/rideSearchService';

export class RideHistoryController {
  private rideSearchService: RideSearchService;

  constructor() {
    this.rideSearchService = new RideSearchService();
  }

  async getRidesByUser(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const { driver_id } = req.query;

      if (!customer_id) {
        return res.status(400).json({
          error_code: "INVALID_DATA",
          error_description: "Nenhum registro encontrado"
        });
      }

      if (driver_id) {
        const driverExists = await this.rideSearchService.driverExists(driver_id as string);
        if (!driverExists) {
          return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "Motorista invalido  "
          });
        }
      }

      const rides = await this.rideSearchService.getRidesByUser(customer_id, driver_id as string);

      const response = {
        customer_id,
        rides: rides.map((ride: any) => ({
          id: ride.id,
          date: ride.data,
          origin: ride.origin,
          destination: ride.destination,
          distance: ride.distancia_km,
          duration: ride.duracao_estimada,
          driver: {
            id: ride.motorista_id,
            name: ride.motorista_nome
          },
          value: ride.valor
        }))
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao buscar viagens:', error);
      res.status(500).json({ error: 'Erro ao buscar viagens' });
    }
  }
}