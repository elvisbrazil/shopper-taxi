import React, { useState } from 'react';
import styled from 'styled-components';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar, MapPin, Navigation, Clock, DollarSign, Car } from 'lucide-react';

// Interfaces
interface Driver {
  id: number;
  name: string;
}

interface Ride {
  id: number;
  date: string;
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  driver: Driver;
  value: string;
}

interface RideResponse {
  customer_id: string;
  rides: Ride[];
}

const TravelList: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [userId, setUserId] = useState('');
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const drivers = [
    { id: 1, name: "Brian O'Conner" },
    { id: 2, name: "Dominic Toretto" },
    { id: 3, name: "James Bond" },

  ];
  const fetchRides = async () => {
    if (!userId) {
      toast.error('Por favor, digite o ID do usuário');
      return;
    }
  
    if (!selectedDriver) {
      toast.error('Por favor, selecione um motorista');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch(`http://localhost:8080/ride/${userId}?driver_id=${selectedDriver}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 400 && errorData.error_code === 'INVALID_DRIVER') {
          throw new Error(errorData.error_description);
        }
        
        throw new Error('Erro ao buscar viagens');
      }
  
      const data: RideResponse = await response.json();
      setRides(data.rides);
      toast.success('Viagens carregadas com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar viagens';
      toast.error(errorMessage);
      setError(errorMessage);
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Container>
            <Toaster position="bottom-center" />
      <ContentWrapper>
        <Header>Histórico de viagens</Header>
        <InputWrapper>
          <Input
            type="text"
            placeholder="Entre com o id do usuário"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        <Select
  value={selectedDriver}
  onChange={(e) => setSelectedDriver(e.target.value)}
>
  <option value="">Selecione um motorista</option>
  {drivers.map(driver => (
    <option key={driver.id} value={driver.id}>
      {driver.name}
    </option>
  ))}
</Select>
          <ConfirmButton onClick={fetchRides}>
            {loading ? 'Carregando...' : 'Buscar'}
          </ConfirmButton>
        </InputWrapper>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <CardContainer>
          {rides.map((ride) => (
            <DriverCard key={ride.id}>
              <DriverDetails>
                <DriverName>
                  <Car size={20} />
                  Corrida #{ride.id}
                </DriverName>
                
                <InfoRow>
                  <Calendar size={16} />
                  {new Date(ride.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </InfoRow>

                <InfoRow>
                  <MapPin size={16} />
                  {ride.origin}
                </InfoRow>

                <InfoRow>
                  <Navigation size={16} />
                  {ride.destination}
                </InfoRow>

                <InfoRow>
                  <Clock size={16} />
                  {parseFloat(ride.duration).toFixed(0)} min • {parseFloat(ride.distance).toFixed(1)} km
                </InfoRow>

                <Value>
                  <DollarSign size={20} />
                  R$ {parseFloat(ride.value).toFixed(2)}
                </Value>
              </DriverDetails>
            </DriverCard>
          ))}
        </CardContainer>
      </ContentWrapper>
    </Container>
  );
};

export default TravelList;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  background-color: #e8f5e9;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 800px;
`;

const Header = styled.h1`
  font-size: 2rem;
  color: #1b5e20;
  text-align: center;
  margin-bottom: 2rem;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const DriverCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const DriverDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DriverName = styled.h3`
  color: #1b5e20;
  font-size: 1.25rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #424242;
  font-size: 0.9rem;

  svg {
    color: #2e7d32;
    min-width: 16px;
  }
`;

const Value = styled.div`
  font-size: 1.25rem;
  color: #1b5e20;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

const ConfirmButton = styled.button`
  flex: 1;
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
`;

const BackButton = styled.button`
  flex: 1;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #b71c1c;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin: 1rem 0;
  text-align: center;
`;

