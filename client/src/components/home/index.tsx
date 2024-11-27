import { useState } from 'react';
import { MapPin, Navigation,User, CarTaxiFront } from 'lucide-react';
import AutocompleteInput from '../Autocomplet/'
import UserIdInput from '../UserIdInput';
import Map from '../Map';
import DriverOptions from '../DriverOption';
import * as S from '../../styles/driveOption';
import toast, { Toaster } from 'react-hot-toast';

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
    <S.MainContainer>
      <Toaster position="bottom-center" />
      <S.FormSection>
        <S.Card>
          <S.CardHeader>
            <S.IconWrapper>
              <CarTaxiFront size={32} />
            </S.IconWrapper>
            <S.Title>Solicitação de viagem</S.Title>
          </S.CardHeader>
          <S.Form onSubmit={handleSubmit}>
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
            {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
            <S.Button type="submit">Solicitar Corrida</S.Button>
          </S.Form>
        </S.Card>
      </S.FormSection>
      <S.MapSection>
        <Map origin={origin} destination={destination} />
      </S.MapSection>
    </S.MainContainer>
  );
}