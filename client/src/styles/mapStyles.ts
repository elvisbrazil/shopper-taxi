import styled from 'styled-components';

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
export const MapSection = styled.div`
  flex: 1;
  padding: 1rem;
  min-height: 300px;

  @media (max-width: 767px) {
    height: 100vh; /* Ocupa a altura total da tela na versão mobile */
  }
`;
const mapStyles = [
  {
    featureType: 'all',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'all',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#e0f7fa' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#e0f7fa' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#e0f7fa' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#e0f7fa' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
];

export default mapStyles;