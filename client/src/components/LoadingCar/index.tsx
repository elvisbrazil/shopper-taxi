// src/components/LoadingCar/index.tsx
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../../assets/car-shopper.json';

const LoadingCar = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const anim = lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'none', // Alterado para permitir stretch
          viewBoxSize: '0 0 1920 1080' // Viewport maior para a animação
        }
      });

      return () => anim.destroy();
    }
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
    >
      <div 
        ref={container} 
        style={{
          width: '600px',  // Aumentado para 800px
          height: '300px', // Proporção 4:3 para melhor visualização
          overflow: 'hidden' // Previne overflow da animação
        }}
      />
    </div>
  );
};

export default LoadingCar;