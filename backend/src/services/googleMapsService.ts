import axios from 'axios';
import { RideEstimateRequest, RideEstimateResponse, Location, DriverOption } from '../types';
import { DatabaseService } from './databaseService';
export class GoogleMapsService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
  }

  async estimateRide(request: RideEstimateRequest): Promise<RideEstimateResponse> {
    try {
      // Chamada para API do Google Maps para geocoding
      const originGeocoding = await this.geocodeAddress(request.origin);
      const destinationGeocoding = await this.geocodeAddress(request.destination);

      // Rota e distância
      const routeDetails = await this.getRouteDetails(
        originGeocoding.latitude, 
        originGeocoding.longitude,
        destinationGeocoding.latitude,
        destinationGeocoding.longitude
      );

      // Buscar motoristas
      const drivers = await this.getDriverOptions(routeDetails.distance);

      return {
        origin: originGeocoding,
        destination: destinationGeocoding,
        distance: routeDetails.distance,
        duration: routeDetails.duration,
        options: drivers,
        routeResponse: routeDetails.rawResponse
      };
    } catch (error) {
      console.error('Erro na estimativa:', error);
      throw error;
    }
  }

  private async geocodeAddress(address: string): Promise<Location> {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: address,
          key: this.apiKey,
        },
      });
  
      console.log('Response from geocoding:', response.data); // Adicionando log
  
      if (response.data.status !== 'OK' || response.data.results.length === 0) {
        throw new Error('Erro ao geocodificar o endereço: ' + response.data.status);
      }
  
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } catch (error) {
      console.error('Erro na geocodificação:', error);
      throw error; // Propagar o erro
    }
  }

  private async getRouteDetails(
    originLat: number, 
    originLng: number, 
    destLat: number, 
    destLng: number
  ): Promise<{ distance: number; duration: number; rawResponse: any }> {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: `${originLat},${originLng}`,
          destinations: `${destLat},${destLng}`,
          key: this.apiKey,
        },
      });

      console.log('Response from distance matrix API:', response.data); // Adicionando log

      if (response.data.status !== 'OK' || response.data.rows.length === 0) {
        throw new Error('Erro ao obter detalhes da rota: ' + response.data.status);
      }

      const element = response.data.rows[0].elements[0];
      if (!element || element.status !== 'OK') {
        throw new Error('Erro ao obter detalhes da rota: ' + element.status);
      }

      return {
        distance: element.distance.value, // Distância em metros
        duration: element.duration.value,   // Duração em segundos
        rawResponse: response.data,
      };
    } catch (error) {
      console.error('Erro ao obter detalhes da rota:', error);
      throw error; // Propagar o erro
    }
  }

  private async getDriverOptions(distance: number): Promise<DriverOption[]> {
    // Aqui você deve implementar a lógica para buscar motoristas do banco baseado na distância
    // Este é um exemplo fictício para ilustrar como você pode retornar motoristas
    const driverOptions: DriverOption[] = [
      { id: 1, name: 'Motorista A', price: distance * 1.5 }, // Exemplo de cálculo de preço
      { id: 2, name: 'Motorista B', price: distance * 1.7 },
    ];
    
    return driverOptions;
  }
}