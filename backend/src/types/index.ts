export interface RideEstimateRequest {
    customer_id: string;
    origin: string;
    destination: string;
  }
  
  export interface Location {
    latitude: number;
    longitude: number;
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
  
  export interface RideEstimateResponse {
    origin: Location;
    destination: Location;
    distance: number;
    duration: string;
    options: DriverOption[];
    routeResponse: any;
  }
  
  export interface RideConfirmRequest {
    customer_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: {
      id: number;
      name: string;
    };
    value: number;
  }