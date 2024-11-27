// src/styles/driveOption.ts
import styled from 'styled-components';

export const MainContainer = styled.main`
  display: flex;
  min-height: 100vh;
  background-color: #e6f7e6;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const MapSection = styled.div`
  flex: 1;
  padding: 1rem;
  min-height: 300px;

  @media (max-width: 767px) {
    height: 100vh;
  }
`;

export const DriverList = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem;
`;

export const DriverCard = styled.div`
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

export const CarIcon = styled.img`
  width: 120px;
  height: auto;
  margin-right: 1.5rem;
`;

export const DriverDetails = styled.div`
  flex: 1;
`;

export const DriverName = styled.h2`
  font-size: 1.25rem;
  color: #1b5e20;
`;

export const DriverDescription = styled.p`
  font-size: 1rem;
  color: #616161;
`;

export const DriverVehicle = styled.p`
  font-size: 1rem;
  color: #616161;
`;

export const DriverReview = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: #616161;
`;

export const Stars = styled.img`
  width: 100px;
  height: auto;
  margin-left: 0.5rem;
`;

export const DriverValue = styled.p`
  font-size: 1rem;
  color: #1b5e20;
  font-weight: bold;
`;

export const ConfirmButton = styled.button`
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

export const BackButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background-color: #b71c1c;
  }
`;