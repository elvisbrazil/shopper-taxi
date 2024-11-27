import styled from 'styled-components';

// Layout principal
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

// Componentes do cartão do motorista
export const DriverList = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem;
`;

export const DriverCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  display: flex;
  border: 1px solid #ddd;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

// Elementos visuais do cartão
export const CarIcon = styled.img`
  width: 120px;
  height: auto;
  margin-right: 1.5rem;
`;

export const DriverDetails = styled.div`
  flex: 1;
  padding: 1rem;
`;

// Tipografia e informações
export const DriverName = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #1b5e20;
  margin-bottom: 1rem;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #616161;
  
  svg {
    color: #2e7d32;
    width: 20px;    
    height: 20px;   
    flex-shrink: 0; 
    display: flex;  
    align-items: center;
    justify-content: center;
  }
`;

// Informações complementares
export const DriverDescription = styled.p`
  font-size: 1rem;
  color: #616161;
`;

export const DriverVehicle = styled.p`
  font-size: 1rem;
  color: #616161;
`;

// Elementos de avaliação
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

// Elementos de valor e preço
export const Value = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  color: #2e7d32;
  margin-top: 1rem;
`;

export const DriverValue = styled.p`
  font-size: 1rem;
  color: #1b5e20;
  font-weight: bold;
`;

export const Button = styled.button`
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

  @media (max-width: 767px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`;

export const ConfirmButton = styled(Button)`
  background-color: #2e7d32;

  &:hover {
    background-color: #1b5e20;
  }
`;

export const HomeButton = styled(Button)`
  background-color: #8acb64;

  &:hover {
    background-color: #517a47;
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

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  padding: 2rem;
`;

export const ContentWrapper = styled.div`
  background-color: #e8f5e9;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 800px;
`;

export const Header = styled.h1`
  font-size: 2rem;
  color: #1b5e20;
  text-align: center;
  margin-bottom: 2rem;
`;

export const InputWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Select = styled.select`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;



export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const PageButton = styled.button`
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #1b5e20;
  }
`;

export const PageInfo = styled.span`
  margin: 0 10px;
  font-size: 1rem;
  color: #2e7d32;
`;


export const FormSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

export const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const IconWrapper = styled.div`
  background-color: #2e7d32;
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1b5e20;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

