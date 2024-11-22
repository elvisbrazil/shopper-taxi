import getRouteDetails from '../utils/googleMaps';
import { getAllDrivers } from '../models/driverModel';

// Função para calcular a estimativa da viagem
const calculateRideEstimate = async (origin: string, destination: string) => {
  try {
    // Pega os detalhes da rota usando a API do Google Maps
    const routeDetails = await getRouteDetails(origin, destination);

    const distance = routeDetails.routes[0].legs[0].distance.value / 1000; // Converte para km
    const duration = routeDetails.routes[0].legs[0].duration.text;

    // Pega todos os motoristas do banco de dados
    const drivers = await getAllDrivers();

    // Calcula as opções de motoristas com base na distância
    const options = (drivers as Array<{ id: string, nome: string, descricao: string, carro: string, avaliacao: string, taxa_km: number }>).map((driver) => ({
      id: driver.id,
      name: driver.nome,
      description: driver.descricao,
      vehicle: driver.carro,
      review: {
        rating: parseFloat(driver.avaliacao.split('/')[0]),
        comment: driver.descricao,
      },
      value: distance * driver.taxa_km,
    })).sort((a: any, b: any) => a.value - b.value);

    return {
      origin: {
        latitude: routeDetails.routes[0].legs[0].start_location.lat,
        longitude: routeDetails.routes[0].legs[0].start_location.lng,
      },
      destination: {
        latitude: routeDetails.routes[0].legs[0].end_location.lat,
        longitude: routeDetails.routes[0].legs[0].end_location.lng,
      },
      distance,
      duration,
      options,
      routeResponse: routeDetails,
    };
  } catch (error) {
    console.error('Erro ao calcular a estimativa da viagem:', error);
    throw error;
  }
};

export { calculateRideEstimate };