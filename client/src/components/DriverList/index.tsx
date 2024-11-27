import React, { useState } from 'react';
import styled from 'styled-components';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar, MapPin, Navigation, Clock, DollarSign, Car, Home, Search } from 'lucide-react';
import * as S from '../../styles/driveOption';

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

const TravelList: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [userId, setUserId] = useState('');
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
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

    try {
      const response = await fetch(`http://localhost:8080/ride/${userId}?driver_id=${selectedDriver}`);
      const data = await response.json();

      if (response.status === 200) {
        setRides(data.rides);
        console.log('Resposta do servidor:', data);
        toast.success(data.description || 'Operação realizada com sucesso'); // Usa a mensagem de sucesso do servidor
      } else {
        toast.error(data.error_description);
        throw new Error(data.error_description);
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao carregar viagens');
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
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
          {rides.map((ride) => (
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
      </S.ContentWrapper>
    </S.Container>
  );
};

export default TravelList;



