
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home';
import DriverOptions from './components/DriverOption';
import DriveList  from './components/DriverList';
import { useState } from 'react';

// Interface para as props do DriverOptions
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

// Remove a definição do componente Home daqui, já que estamos importando
export default function App() {
  const [rideData, setRideData] = useState<DriverOptionsProps | null>(null);

  const handleRideConfirm = (data: DriverOptionsProps) => {
    setRideData(data);
  };
  return (
    <Routes>
      <Route path="/" element={<Home onRideConfirm={handleRideConfirm} />} />
      <Route path="/DriverList" element={<DriveList />} />
      <Route 
        path="/components/DriverOption" 
        element={
          rideData ? (
            <DriverOptions 
              customer_id={rideData.customer_id}
              origin={rideData.origin}
              destination={rideData.destination}
              distance={rideData.distance}
              duration={rideData.duration}
              options={rideData.options}
            />
          ) : (
            <Navigate to="/" />
          )
        } 
      />
   
    </Routes>
  );
}