
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { PlatonicElement } from './types';
import { FINALE_BG } from './constants';

const App: React.FC = () => {
  const [activeElement, setActiveElement] = useState<PlatonicElement>(PlatonicElement.NONE);
  const [isFinale, setIsFinale] = useState(false);

  const handleHover = (element: PlatonicElement) => {
    if (isFinale) return;
    setActiveElement(element);
    if (element === PlatonicElement.ETHER) {
      setIsFinale(true);
    }
  };

  const handleHoverLeave = () => {
    if (isFinale) return;
    setActiveElement(PlatonicElement.NONE);
  };

  return (
    <div 
      className="relative w-screen h-screen transition-colors duration-1000 ease-in-out overflow-hidden"
      style={{ backgroundColor: isFinale ? FINALE_BG : '#000000' }}
    >
      {/* Canvas lowered to z-10 */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        className="absolute inset-0 z-10"
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Scene 
          activeElement={activeElement} 
          isFinale={isFinale} 
          onHover={handleHover} 
          onHoverLeave={handleHoverLeave}
        />
      </Canvas>

      {/* Overlay raised to z-30 to be in front of the tree */}
      <Overlay 
        activeElement={activeElement} 
        isFinale={isFinale} 
      />
    </div>
  );
};

export default App;
