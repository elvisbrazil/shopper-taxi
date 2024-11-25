"use client"

import styled from 'styled-components';
import MapWithCoordinates from '../MapWithCoordinates';
import twoStars from '../../assets/2-stars.svg';
import fourStars from '../../assets/4-stars.svg';
import fiveStars from '../../assets/5-stars.svg';
import car1 from '../../assets/car-1.svg';
import car2 from '../../assets/car-2.svg';
import car3 from '../../assets/car-3.svg';

const MainContainer = styled.main`
  display: flex;
  min-height: 100vh;
  background-color: #e6f7e6;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const MapSection = styled.div`
  flex: 1;
  padding: 1rem;
  min-height: 300px;

  @media (max-width: 767px) {
    height: 100vh; /* Ocupa a altura total da tela na versão mobile */
  }
`;

const DriverList = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem;
`;

const DriverCard = styled.div`
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CarIcon = styled.img`
  width: 120px; /* Ajuste o tamanho conforme necessário */
  height: auto;
  margin-right: 1.5rem; /* Espaçamento maior entre o ícone do carro e os textos */
`;

const DriverDetails = styled.div`
  flex: 1;
`;

const DriverName = styled.h2`
  font-size: 1.25rem;
  color: #1b5e20;
`;

const DriverDescription = styled.p`
  font-size: 1rem;
  color: #616161;
`;

const DriverVehicle = styled.p`
  font-size: 1rem;
  color: #616161;
`;

const DriverReview = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: #1b5e20;
`;

const Stars = styled.img`
  width: 100px; /* Ajuste o tamanho conforme necessário */
  height: auto;
  margin-left: 0.5rem;
`;

const DriverValue = styled.p`
  font-size: 1rem;
  color: #1b5e20;
  font-weight: bold;
`;

const ConfirmButton = styled.button`
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
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%; /* Ocupa a largura total do card */

  &:hover {
    background-color: #b71c1c;
  }
`;

interface DriverOptionsProps {
  customer_id: string;
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

const renderStars = (rating: number) => {
  switch (rating) {
    case 2:
      return <Stars src={twoStars} alt="2 estrelas" />;
    case 4:
      return <Stars src={fourStars} alt="4 estrelas" />;
    case 5:
      return <Stars src={fiveStars} alt="5 estrelas" />;
    default:
      return null;
  }
};

const renderCarIcon = (rating: number) => {
  switch (rating) {
    case 2:
      return <CarIcon src={car1} alt="Carro 1" />;
    case 4:
      return <CarIcon src={car3} alt="Carro 2" />;
    case 5:
      return <CarIcon src={car2} alt="Carro 3" />;
    default:
      return null;
  }
};

export default function DriverOptions({ customer_id, origin, destination, distance, duration, options = [] }: DriverOptionsProps) {
  const handleConfirm = async (driverId: number) => {
    const driver = options.find((driver) => driver.id === driverId);
    if (!driver) return;

    const confirmData = {
      customer_id,
      origin: `${origin.latitude}, ${origin.longitude}`,
      destination: `${destination.latitude}, ${destination.longitude}`,
      distance,
      duration,
      driver: {
        id: driver.id,
        name: driver.name,
      },
      value: driver.value,
    };

    try {
      const response = await fetch('http://localhost:8080/ride/confirm', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao confirmar a corrida: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Confirmação de corrida:', data);
      // Adicione a lógica para lidar com a resposta da confirmação aqui
    } catch (error) {
      console.error('Erro ao confirmar a corrida:', error);
    }
  };

  const handleBack = () => {
    window.location.reload(); // Recarrega a página para voltar à tela inicial
  };

  return (
    <MainContainer>
      <MapSection>
        <MapWithCoordinates origin={origin} destination={destination} />
      </MapSection>
      <DriverList>
        {options.map((driver) => (
          <DriverCard key={driver.id}>
            {renderCarIcon(driver.review.rating)}
            <DriverDetails>
              <DriverName>{driver.name}</DriverName>
              <DriverDescription>{driver.description}</DriverDescription>
              <DriverVehicle>Veículo: {driver.vehicle}</DriverVehicle>
              <DriverReview>
                Avaliação: {renderStars(driver.review.rating)}
              </DriverReview>
              <DriverValue>Valor: R$ {driver.value.toFixed(2)}</DriverValue>
              <ConfirmButton onClick={() => handleConfirm(driver.id)}>Confirmar</ConfirmButton>
            </DriverDetails>
          </DriverCard>
        ))}
        <BackButton onClick={handleBack}>Voltar</BackButton>
      </DriverList>
    </MainContainer>
  );
}