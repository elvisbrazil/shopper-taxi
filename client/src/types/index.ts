


export interface DriverOptionsProps {
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
    options: Array<DriverOption>;
  }
  
  export interface DriverOption {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: {
      rating: number;
      comment: string;
    };
    value: number;
  }

  export interface DriverOptionsProps {
    customer_id: string;
    origin: { 
      latitude: number; 
      longitude: number 
    };
    destination: { 
      latitude: number; 
      longitude: number 
    };
    distance: number;
    duration: string;
    options: Array<DriverOption>;
  }
  
  export interface DriverOption {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: {
      rating: number;
      comment: string;
    };
    value: number;
  }

 export  interface Driver {
    id: number;
    name: string;
  }
  
  export interface Ride {
    id: number;
    date: string;
    origin: string;
    destination: string;
    distance: string;
    duration: string;
    driver: Driver;
    value: string;
  }

  