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

  async estimateRide(req: Request, res: Response) {
    try {
      const { customer_id, origin, destination } = req.body;
      console.log('Request body:', req.body);

      const estimate = await this.googleMapsService.estimateRide({ 
        customer_id, origin, destination 
      });
      console.log('Estimate:', estimate);

      const googleMapsResultId = await this.databaseService.saveGoogleMapsResult(estimate, customer_id);
      console.log('Google Maps Result ID:', googleMapsResultId);

      const viagemId = await this.databaseService.saveRide(estimate, customer_id);
      console.log('Viagem ID:', viagemId);

      // Busca todos os motoristas do banco de dados
      const drivers = await this.databaseService.getAllDrivers();

      // Adiciona os motoristas à resposta e ordena do mais barato para o mais caro
      const options = drivers.map((driver: any) => ({
        id: driver.id,
        name: driver.nome,
        description: driver.descricao,
        vehicle: driver.carro,
        review: {
          rating: parseFloat(driver.avaliacao),
          comment: driver.comment || ''
        },
        value: driver.taxa_km * (estimate.distance / 1000) // Certifique-se de que a distância está em km
      })).sort((a: any, b: any) => a.value - b.value);

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

  async confirmRide(req: Request, res: Response) {
    try {
      // Assume que o usuário está autenticado e o ID está disponível
      const usuario_id = req.body.customer_id;
      if (!usuario_id) {
        throw new Error('ID do usuário não está disponível.');
      }

      console.log('Usuário ID:', usuario_id);

      // Busca os detalhes da última corrida do usuário
      const lastRideDetails = await this.databaseService.getLastRideDetails(usuario_id);

      // Verifique se os detalhes da última corrida foram encontrados
      if (!lastRideDetails) {
        throw new Error(`Nenhuma corrida encontrada para o usuário com ID ${usuario_id}.`);
      }

      // Adiciona os detalhes do motorista e outros dados necessários
      const rideDetails = {
        customer_id: usuario_id,
        origin: lastRideDetails.origin,
        destination: lastRideDetails.destination,
        distance: lastRideDetails.distance,
        duration: lastRideDetails.duration,
        driver: req.body.driver,
        value: req.body.value, // Valor da corrida
        destinationCoordinates: {
          latitude: lastRideDetails.destination_latitude,
          longitude: lastRideDetails.destination_longitude,
        },
      };

      console.log('Confirmando corrida com os seguintes detalhes:', rideDetails);

      const confirmation = await this.databaseService.confirmRide(rideDetails);
      res.status(200).json(confirmation);
    } catch (error) {
      console.error('Erro ao confirmar corrida:', error);
      res.status(500).json({ error: 'Erro ao confirmar corrida' });
    }
  }
}