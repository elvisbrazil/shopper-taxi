"use client"

import { useEffect, useRef, useState } from 'react';
import loader from '../../utils/googleMapsLoader';
import carIcon from '../../assets/icone-carro.svg';
import { MapContainer } from '../../styles/mapStyles';
import mapStyles from '../../styles/mapStyles';

interface MapProps {
  origin: string;
  destination: string;
}

export default function Map({ origin, destination }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        console.log('Inicializando o Loader do Google Maps');
        const { Map } = await loader.importLibrary('maps');
        console.log('Biblioteca do Google Maps carregada');

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center: { lat: -23.5505, lng: -46.6333 }, // Coordenadas de São Paulo
            zoom: 12,
            styles: mapStyles,
          });

          const directionsRendererInstance = new google.maps.DirectionsRenderer({
            markerOptions: {
              icon: {
                url: carIcon, // URL do ícone do carro
                scaledSize: new google.maps.Size(40, 40), // Tamanho do ícone
              },
            },
            polylineOptions: {
              strokeColor: '#2e7d32',
              strokeOpacity: 0.5,
              strokeWeight: 4,
              icons: [{
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 2,
                  strokeColor: '#2e7d32',
                  strokeOpacity: 1,
                },
                offset: '100%',
                repeat: '20px'
              }]
            }
          });
          directionsRendererInstance.setMap(mapInstance);
          setDirectionsRenderer(directionsRendererInstance);

          console.log('Mapa carregado com sucesso');
        } else {
          console.error('mapRef.current está nulo');
        }
      } catch (error) {
        console.error('Erro ao carregar o mapa:', error);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (directionsRenderer && origin && destination) {
      console.log('Calculando rota de:', origin, 'para:', destination);
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            directionsRenderer.setDirections(result);
          } else {
            console.error('Erro ao obter direções:', status);
            if (status === 'NOT_FOUND') {
              console.error('Rota não encontrada. Verifique os endereços de origem e destino.');
            }
          }
        }
      );
    }
  }, [directionsRenderer, origin, destination]);

  return <MapContainer ref={mapRef} />;
}