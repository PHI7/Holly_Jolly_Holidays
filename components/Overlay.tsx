
import React from 'react';
import { PlatonicElement } from '../types';
import { ELEMENT_BACKGROUNDS, COLORS, FINALE_IMAGE_URL, LOGO_URL } from '../constants';

interface OverlayProps {
  activeElement: PlatonicElement;
  isFinale: boolean;
}

const AlephSpinner: React.FC = () => (
  <div className="relative w-[1.2em] h-[1.2em] mx-3 flex items-center justify-center">
    {/* Geometric Rings */}
    <div className="absolute inset-0 border-[1px] border-[#c70035]/20 rounded-full animate-[spin_12s_linear_infinite]" />
    <div className="absolute inset-[10%] border-[1px] border-[#c70035]/40 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
    {/* Aleph Hebrew Symbol (א) rendered via SVG Path for precision */}
    <svg viewBox="0 0 100 100" className="w-[70%] h-[70%] drop-shadow-[0_0_8px_rgba(199,0,53,0.6)] fill-[#c70035] animate-pulse">
      <path d="M78.5,15.5l-8.4,12.3c-1.5,2.1-1.2,5,0.7,6.8L83,47.4c2,1.9,1.8,5.1-0.4,6.8l-15.3,11.5L25.8,17.2l8.8-11.8 c2.2-2.9,0.1-7.2-3.6-7.2H15.5c-3.1,0-5.7,2.1-6.4,5.1l-8.6,35.4c-0.6,2.6,1.4,5.1,4.1,5.1h15.3l15.8,17.4l-11,26.5 c-0.8,2,0.6,4.1,2.7,4.1H40c3,0,5.6-2,6.4-4.9l8.6-33.8c0.7-2.7-1.3-5.3-4.1-5.3H35L78.5,15.5z" />
    </svg>
  </div>
);

export const Overlay: React.FC<OverlayProps> = ({ activeElement, isFinale }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        {Object.entries(ELEMENT_BACKGROUNDS).map(([key, url]) => (
          <div
            key={key}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out bg-cover bg-center ${
              activeElement === key && !isFinale ? 'opacity-30 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{ 
              backgroundImage: `url(${url})`,
              filter: 'blur(120px) contrast(1.2)',
            }}
          />
        ))}
        
        {/* Finale Main Background - Using the high-quality cozy render */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[3000ms] ease-out ${
            isFinale ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            backgroundImage: `url(${FINALE_IMAGE_URL})`,
          }}
        />
        
        {/* Darkening layer for text readability */}
        <div 
          className={`absolute inset-0 bg-black/40 transition-opacity duration-[3000ms] ${
            isFinale ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Cinematic Overlays: Noise, Vignette */}
      <div className="absolute inset-0 z-[1] opacity-[0.25] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat pointer-events-none" />
      <div 
        className="absolute inset-0 z-[2]"
        style={{
          background: 'radial-gradient(circle at center, transparent 10%, rgba(0,0,0,0.9) 100%)'
        }}
      />

      {/* Editorial Finale Text Layout */}
      <div 
        className={`absolute inset-0 z-[40] flex flex-col items-center justify-center transition-all duration-[4000ms] ease-out ${
          isFinale ? 'opacity-100 translate-y-[-10vh]' : 'opacity-0 translate-y-0'
        }`}
      >
        <div className="flex flex-col items-center max-w-[90vw]">
          <h1 className="text-2xl md:text-5xl lg:text-6xl futura text-center tracking-[0.6em] md:tracking-[0.8em] uppercase font-light flex items-center justify-center flex-wrap" style={{ color: COLORS.WARM_WHITE }}>
            <span>FROHE WEIHNACHTEN</span>
          </h1>
          
          <div className="h-[0.5px] w-16 md:w-32 my-6 md:my-10 bg-white/20" />
          
          <p className="text-sm md:text-xl tracking-[0.4em] md:tracking-[0.5em] futura font-extralight italic opacity-80" style={{ color: COLORS.SOFT_CREME }}>
            und einen guten Rutsch
          </p>
        </div>
      </div>

      {/* Footer with Logo Icon - Moved lower and tightened on mobile */}
      <div 
        className={`absolute inset-x-0 bottom-6 md:bottom-10 z-[40] flex flex-col items-center gap-3 transition-all duration-[4000ms] ease-out delay-[2000ms] ${
          isFinale ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="text-[9px] md:text-sm tracking-[1.2em] md:tracking-[1.8em] futura uppercase font-light opacity-50" style={{ color: COLORS.GOLD }}>
          CardinalContor.com
        </p>
        
        {/* Centered logo icon at the very bottom */}
        <div className="relative w-8 h-8 md:w-12 md:h-12">
          <img 
            src={LOGO_URL} 
            alt="Cardinal Contor Icon" 
            className="w-full h-full object-contain mix-blend-screen opacity-70 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-700 hover:opacity-100 hover:scale-110"
          />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
