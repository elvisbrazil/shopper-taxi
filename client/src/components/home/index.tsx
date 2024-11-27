import { useState } from 'react';
import styled from 'styled-components';
import { MapPin, Navigation, User } from 'lucide-react';
import AutocompleteInput from '../Autocomplet/'
import UserIdInput from '../UserIdInput';
import Map from '../Map';
import DriverOptions from '../DriverOption';
import { MapSection } from '../../styles/mapStyles';
import toast, { Toaster } from 'react-hot-toast';

const MainContainer = styled.main`
  display: flex;
  min-height: 100vh;
  background-color: #e6f7e6;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  background-color: #2e7d32;
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1b5e20;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Button = styled.button`
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #1b5e20;
  }

  @media (max-width: 767px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

interface ResponseType {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  distance: number;
  duration: string;
  options: Array<{
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: { rating: number; comment: string };
    value: number;
  }>;
}

// Adicionar a interface DriverOptionsProps
interface DriverOptionsProps {
  customer_id: string;
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: Array<{
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: {
      rating: number;
      comment: string;
    };
    value: number;
  }>;
}

interface HomeProps {
  onRideConfirm: (data: DriverOptionsProps) => void;
}

export default function Home({ onRideConfirm }: HomeProps) {
  const [customer_id, setCustomerId] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Verificar se o ID do usuário está preenchido
    if (!customer_id) {
      toast.error('O ID do usuário não pode estar em branco.');
      return;
    }

    // Verificar se os campos de origem e destino estão preenchidos
    if (!origin || !destination) {
      toast.error('Por favor, preencha os campos de origem e destino.');
      return;
    }

    // Verificar se os endereços de origem e destino são diferentes
    if (origin === destination) {
      toast.error('Os endereços de origem e destino não podem ser o mesmo endereço.');
      return;
    }

    console.log('Solicitação de corrida:', { customer_id, origin, destination });

    try {
      const response = await fetch('http://localhost:8080/ride/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_id, origin, destination }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao solicitar estimativa: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Resposta do backend:', data);
      setResponse(data);
    } catch (error: any) {
      console.error('Erro ao solicitar estimativa:', error);
      toast.error(error.message || 'Erro ao solicitar estimativa.');
    }
  };

  if (response) {
    return (
      <DriverOptions
        customer_id={customer_id}
        origin={response.origin}
        destination={response.destination}
        distance={response.distance}
        duration={response.duration}
        options={response.options}
      />
    );
  }

  return (
    <MainContainer>
      <Toaster position="bottom-center" />
      <FormSection>
        <Card>
          <CardHeader>
            <IconWrapper>
              <Navigation size={32} />
            </IconWrapper>
            <Title>Solicitação de viagem</Title>
          </CardHeader>
          <Form onSubmit={handleSubmit}>
            <UserIdInput
              placeholder="ID do usuário"
              value={customer_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerId(e.target.value)}
              icon={<User color="#2e7d32" />}
            />
            <AutocompleteInput
              placeholder="Origem"
              value={origin}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrigin(e.target.value)}
              icon={<MapPin color="#2e7d32" />}
            />
            <AutocompleteInput
              placeholder="Destino"
              value={destination}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
              icon={<Navigation color="#2e7d32" />}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Button type="submit">Solicitar Corrida</Button>
          </Form>
        </Card>
      </FormSection>
      <MapSection>
        <Map origin={origin} destination={destination} />
      </MapSection>
    </MainContainer>
  );
}