import { createRide } from '../models/rideModel';
import { createRoute } from '../models/routeModel';
import { createGoogleMapsResult } from '../models/googleMapsResultModel';
import { getDriverById } from '../models/driverModel';

// Interface para os detalhes da viagem
interface RideDetails {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

// Função para confirmar a viagem
const confirmRide = async (rideDetails: RideDetails) => {
  try {
    const { customer_id, origin, destination, distance, duration, driver, value } = rideDetails;

    // Validações
    if (!customer_id || !origin || !destination) {
      throw new Error('Os campos customer_id, origin e destination são obrigatórios');
    }

    if (origin === destination) {
      throw new Error('Os endereços de origem e destino não podem ser o mesmo');
    }

    const driverData = await getDriverById(driver.id);
    if (!driverData) {
      throw new Error('Motorista inválido');
    }

    if (distance <= 0 || value <= 0) {
      throw new Error('A quilometragem e o valor devem ser válidos');
    }

    // Bora criar uma nova corrida no banco de dados
    const rideId = await createRide(parseInt(customer_id, 10), origin, destination, distance, value) as number;
    console.log('Corrida criada com ID:', rideId);

    // Agora vamos criar a rota no banco de dados
    await createRoute(rideId, parseFloat(destination.split(',')[0]), parseFloat(destination.split(',')[1]));
    console.log('Rota criada.');

    // E por fim, vamos salvar o resultado do Google Maps no banco de dados
    await createGoogleMapsResult(
      origin,
      destination,
      JSON.stringify({}), // Passando um objeto vazio já que não temos routeResponse
      '', // Passando uma string vazia já que não temos vehicle
      driver.id,
      driver.name,
      customer_id
    );
    console.log('Resultado do Google Maps salvo.');

    return { success: true };
  } catch (error) {
    console.error('Erro ao confirmar a corrida:', error);
    throw error;
  }
};

export { confirmRide };