// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Home from './components/home';
import DriverOptions from './components/DriverOption';
import DriveList from './components/DriverList';
import LoadingCar from './components/LoadingCar';
import { useState } from 'react';
import './styles/transitions.css';

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

export default function App() {
  const location = useLocation();
  const [rideData, setRideData] = useState<DriverOptionsProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleRideConfirm = (data: DriverOptionsProps) => {
    setIsLoading(true);
    setRideData(data);
    
    // Tempo para loading inicial
    setTimeout(() => {
      setIsLoading(false);
      setIsTransitioning(true);
      
      // Tempo para transição
      setTimeout(() => {
        setIsTransitioning(false);
      }, 2000);
    }, 3000);
  };

  return (
    <>
      {(isLoading || isTransitioning) && <LoadingCar />}
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          timeout={3000}
          classNames="fade"
          onEnter={() => {
            if (!isLoading) {
              setIsTransitioning(true);
              setTimeout(() => setIsTransitioning(false), 4500);
            }
          }}
        >
          <div className="route-section">
            <Routes location={location}>
              <Route 
                path="/" 
                element={<Home onRideConfirm={handleRideConfirm} />} 
              />
              <Route 
                path="/DriverList" 
                element={<DriveList />} 
              />
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
                    <Navigate to="/DriverList" />
                  )
                } 
              />
              <Route 
                path="*" 
                element={<Navigate to="/" replace />} 
              />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
}