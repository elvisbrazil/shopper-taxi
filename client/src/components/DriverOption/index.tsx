import * as S from '../../styles/driveOption';
import MapWithCoordinates from '../MapWithCoordinates';
import twoStars from '../../assets/2-stars.svg';
import fourStars from '../../assets/4-stars.svg';
import fiveStars from '../../assets/5-stars.svg';
import car1 from '../../assets/car-1.svg';
import car2 from '../../assets/car-2.svg';
import car3 from '../../assets/car-3.svg';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Adicionar Toaster
import { DriverOptionsProps } from '../../types';



const renderStars = (rating: number) => {
  switch (rating) {
    case 2:
      return <S.Stars src={twoStars} alt="2 estrelas" />;
    case 4:
      return <S.Stars src={fourStars} alt="4 estrelas" />;
    case 5:
      return <S.Stars src={fiveStars} alt="5 estrelas" />;
    default:
      return null;
  }
};

const renderCarIcon = (rating: number) => {
  switch (rating) {
    case 2:
      return <S.CarIcon src={car1} alt="Carro 1" />;
    case 4:
      return <S.CarIcon src={car2} alt="Carro 2" />;
    case 5:
      return <S.CarIcon src={car3} alt="Carro 3" />;
    default:
      return null;
  }
};

export default function DriverOptions({ customer_id, origin, destination, distance, duration, options = [] }: DriverOptionsProps) {
  const navigate = useNavigate();

  const handleConfirm = async (driverId: number) => {
    const driver = options.find((driver) => driver.id === driverId);
    if (!driver) return;
  
    const distanceInKm = Number((distance / 1000).toFixed(2));
    const confirmData = {
      customer_id,
      origin: `${origin.latitude}, ${origin.longitude}`,
      destination: `${destination.latitude}, ${destination.longitude}`,
      distance: distanceInKm,
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
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 406) {
          toast.error(data.error_description, {
            duration: 4000,
            position: 'bottom-center',
          });
          return;
        }
        throw new Error(data.error_description || 'Erro ao confirmar a corrida');
      }
  
      toast.success('Corrida confirmada com sucesso!');
      navigate('/DriverList');
  
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao confirmar a corrida';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'bottom-center',
      });
    }
  };

  const handleBack = () => {
    window.location.reload(); // Recarrega a página para voltar à tela inicial
  };

  return (
    <S.MainContainer>
      <Toaster position="bottom-center" /> {/* Adicionar o Toaster aqui */}
      <S.MapSection>
        <MapWithCoordinates origin={origin} destination={destination} />
      </S.MapSection>
      <S.DriverList>
        {options.map((driver) => (
          <S.DriverCard key={driver.id}>
            {renderCarIcon(driver.review.rating)}
            <S.DriverDetails>
              <S.DriverName>{driver.name}</S.DriverName>
              <S.DriverDescription>{driver.description}</S.DriverDescription>
              <S.DriverVehicle>Veículo: {driver.vehicle}</S.DriverVehicle>
              <S.DriverReview>
                Avaliação: {renderStars(driver.review.rating)}
              </S.DriverReview>
              <S.DriverValue>Valor: R$ {driver.value.toFixed(2)}</S.DriverValue>
              <S.ConfirmButton onClick={() => handleConfirm(driver.id)}>
                Confirmar
              </S.ConfirmButton>
            </S.DriverDetails>
          </S.DriverCard>
        ))}
        <S.BackButton onClick={handleBack}>Voltar</S.BackButton>
      </S.DriverList>
    </S.MainContainer>
  );
}