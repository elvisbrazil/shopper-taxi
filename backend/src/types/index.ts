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

  export interface GoogleMapsResult {
    usuario_id: string;
    origin: string;
    destination: string;
    distancia_km: number;
    duracao_estimada: number;
    status: string;
    response_api: string;
  }
  
  export interface Ride {
    usuario_id: string;
    origin: string;
    origin_latitude: number;
    origin_longitude: number;
    destination: string;
    destination_latitude: number;
    destination_longitude: number;
    distancia_km: number;
    duracao_estimada: number;
    valor: number;
    status?: string;
    motorista_id?: number;
  }

  export interface Driver {
    id: string;
    nome: string;
    descricao: string;
    carro: string;
    avaliacao: number;
    minimo: number;
    taxa_km: number;
    comment?: string;
  }
  
