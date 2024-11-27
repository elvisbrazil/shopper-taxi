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


      // Verifica se o usuário existe
      const userExists = await this.rideSearchService.userExists(customer_id);
      if (!userExists) {
        return res.status(404).json({
          error_code: "NO_RIDES_FOUND",
          error_description: "Nenhum registro encontrado"
        });
      }

      // Verifica se o motorista existe (se foi fornecido)
      if (driver_id) {
        const driverExists = await this.rideSearchService.driverExists(driver_id as string);
        if (!driverExists) {
          return res.status(400).json({
            error_code: "INVALID_DRIVER",
            error_description: "Motorista invalido"
          });
        }
      }

      const rides = await this.rideSearchService.getRidesByUser(customer_id, driver_id as string);

      // Verifica se encontrou corridas
      if (!rides || rides.length === 0) {
        return res.status(404).json({
          error_code: "NO_RIDES_FOUND",
          error_description: "Nenhum registro encontrado"
        });
      }

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
        })),
        description: "Operação realizada com sucesso"
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao buscar viagens:', error);
      res.status(500).json({ error: 'Erro ao buscar viagens' });
    }
  }
}