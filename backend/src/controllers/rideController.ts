import { Request, Response } from 'express';
import { calculateRideEstimate, confirmRide } from '../services/rideService';

class RideController {
  async estimate(req: Request, res: Response) {
    try {
      const { origin, destination } = req.body;
      const estimate = await calculateRideEstimate(origin, destination);
      res.status(200).json(estimate);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao calcular estimativa', error });
    }
  }

  async confirm(req: Request, res: Response) {
    try {
      const rideDetails = req.body;
      const confirmation = await confirmRide(rideDetails);
      res.status(200).json(confirmation);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao confirmar corrida', error });
    }
  }
}

export default new RideController();