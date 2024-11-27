import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Calendar, MapPin, Navigation, Clock, DollarSign, Car, Home, Search } from 'lucide-react';
import * as S from '../../styles/driveOption';
import { Ride, Driver } from '../../types';

interface TravelListProps {
  userId: string;
  setUserId: (value: string) => void;
  selectedDriver: string;
  setSelectedDriver: (value: string) => void;
  drivers: Driver[];
  rides: Ride[];
  loading: boolean;
  fetchRides: () => void;
}

const ITEMS_PER_PAGE = 6;

const TravelList: React.FC<TravelListProps> = ({
  userId,
  setUserId,
  selectedDriver,
  setSelectedDriver,
  drivers,
  rides,
  loading,
  fetchRides
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(rides.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRides = rides.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <S.Container>
      <Toaster position="bottom-center" />
      <S.ContentWrapper>
        <S.Header>Histórico de viagens</S.Header>
        <S.InputWrapper>
          <S.Input
            type="text"
            placeholder="Entre com o id do usuário"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <S.Select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
          >
            <option value="">Selecione um motorista</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </S.Select>
          <S.ConfirmButton onClick={fetchRides}>
            <Search size={18} />
            {loading ? 'Carregando...' : 'Buscar'}
          </S.ConfirmButton>

          <S.HomeButton onClick={() => window.location.href = '/'}>
            <Home size={18} />
            Início
          </S.HomeButton>
        </S.InputWrapper>
        <S.CardContainer>
          {currentRides.map((ride) => (
            <S.DriverCard key={ride.id}>
              <S.DriverDetails>
                <S.DriverName>
                  <Car size={20} />
                  Corrida #{ride.id}
                </S.DriverName>
                <S.InfoRow>
                  <Calendar size={16} />
                  {new Date(ride.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </S.InfoRow>
                <S.InfoRow>
                  <MapPin size={16} />
                  {ride.origin}
                </S.InfoRow>
                <S.InfoRow>
                  <Navigation size={16} />
                  {ride.destination}
                </S.InfoRow>
                <S.InfoRow>
                  <Clock size={16} />
                  {parseFloat(ride.duration).toFixed(0)} min • {parseFloat(ride.distance).toFixed(1)} km
                </S.InfoRow>
                <S.Value>
                  <DollarSign size={20} />
                  R$ {parseFloat(ride.value).toFixed(2)}
                </S.Value>
              </S.DriverDetails>
            </S.DriverCard>
          ))}
        </S.CardContainer>
        <S.Pagination>
          <S.PageButton onClick={handlePreviousPage} disabled={currentPage === 1}>
            Anterior
          </S.PageButton>
          <S.PageInfo>
            Página {currentPage} de {totalPages}
          </S.PageInfo>
          <S.PageButton onClick={handleNextPage} disabled={currentPage === totalPages}>
            Próxima
          </S.PageButton>
        </S.Pagination>
      </S.ContentWrapper>
    </S.Container>
  );
};

export default TravelList;