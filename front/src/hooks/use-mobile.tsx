import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Função para determinar se é mobile baseado nas dimensões
    const checkIsMobile = (dimensions: ScaledSize) => {
      // Considera a maior dimensão (para lidar com rotação)
      const largerDimension = Math.max(dimensions.width, dimensions.height);
      return largerDimension < MOBILE_BREAKPOINT;
    };

    // Configuração inicial
    const initialDimensions = Dimensions.get('window');
    setIsMobile(checkIsMobile(initialDimensions));

    // Listener para mudanças de orientação/dimensões
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsMobile(checkIsMobile(window));
    });

    // Cleanup
    return () => subscription?.remove();
  }, []);

  return !!isMobile;
}