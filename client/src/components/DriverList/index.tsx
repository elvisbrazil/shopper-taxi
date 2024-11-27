import React, { useState } from 'react';
import styled from 'styled-components';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar, MapPin, Navigation, Clock, DollarSign, Car, Home, Search } from 'lucide-react';

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

// Adicionar estados de paginação
const TravelList: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [userId, setUserId] = useState('');
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Calcular páginas
  const totalPages = Math.ceil(rides.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRides = rides.slice(indexOfFirstItem, indexOfLastItem);

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
      const data = await response.json();
      
      if (response.status === 200) {
        setRides(data.rides);
        console.log('Resposta do servidor:', data);
        toast.success(data.description); // Usa a mensagem de sucesso do servidor
      } else {
        toast.error(data.error_description);
        throw new Error(data.error_description);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar viagens');
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para converter minutos em dias, horas e minutos
  const formatDuration = (minutes: number): string => {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const remainingMinutes = Math.floor(minutes % 60);
  
    let formattedTime = '';
    
    if (days > 0) {
      formattedTime += `${days}d `;
    }
    
    if (hours > 0) {
      formattedTime += `${hours}h `;
    }
    
    if (remainingMinutes > 0 || formattedTime === '') {
      formattedTime += `${remainingMinutes}min`;
    }
  
    return formattedTime.trim();
  };

  // Botões de navegação estilizados
  const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  `;

  const PageButton = styled.button<{ isActive?: boolean }>`
    padding: 8px 16px;
    border: 1px solid #2e7d32;
    background-color: ${props => props.isActive ? '#2e7d32' : 'white'};
    color: ${props => props.isActive ? 'white' : '#2e7d32'};
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #1b5e20;
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

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
            <Search size={18} />
            {loading ? 'Carregando...' : 'Buscar'}
          </ConfirmButton>
          <HomeButton onClick={() => window.location.href = '/'}>
            <Home size={18} />
            Início
          </HomeButton>
        </InputWrapper>

      

        <CardContainer>
          {currentRides.map((ride) => (
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
                  {formatDuration(parseFloat(ride.duration))} • {parseFloat(ride.distance).toFixed(1)} km
                </InfoRow>

                <Value>
                  <DollarSign size={20} />
                  R$ {parseFloat(ride.value).toFixed(2)}
                </Value>
              </DriverDetails>
            </DriverCard>
          ))}
        </CardContainer>

        {rides.length > itemsPerPage && (
          <PaginationWrapper>
            <PageButton 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </PageButton>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <PageButton
                key={number}
                onClick={() => setCurrentPage(number)}
                isActive={currentPage === number}
              >
                {number}
              </PageButton>
            ))}

            <PageButton
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </PageButton>
          </PaginationWrapper>
        )}
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
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
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

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: white;
`;

const ConfirmButton = styled(Button)`
  background-color: #2e7d32;

  &:hover {
    background-color: #1b5e20;
  }
`;

const HomeButton = styled(Button)`
  background-color: #8acb64;

  &:hover {
    background-color: #517a47;
  }
`;

