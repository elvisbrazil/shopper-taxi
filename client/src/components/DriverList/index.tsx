import React, { useState } from 'react';
import toast from 'react-hot-toast';
import TravelList from './TravelList';
import { Ride } from '../../types';

const TravelListContainer: React.FC = () => {
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
        toast.success(data.description || 'Operação realizada com sucesso');
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
    <TravelList
      userId={userId}
      setUserId={setUserId}
      selectedDriver={selectedDriver}
      setSelectedDriver={setSelectedDriver}
      drivers={drivers}
      rides={rides}
      loading={loading}
      fetchRides={fetchRides}
    />
  );
};

export default TravelListContainer;