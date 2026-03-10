'use client';

import { useState, useRef, useEffect, type MouseEvent, type TouchEvent } from 'react';
import { cn } from '@/lib/utils';

export function LiquidGlassDock() {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleDragStart = (clientX: number, clientY: number) => {
    if (nodeRef.current) {
      setIsDragging(true);
      dragStartPos.current = {
        x: clientX - position.x,
        y: clientY - position.y
      };
      nodeRef.current.style.cursor = 'grabbing';
    }
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      setPosition({
        x: clientX - dragStartPos.current.x,
        y: clientY - dragStartPos.current.y
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (nodeRef.current) {
        nodeRef.current.style.cursor = 'grab';
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const onTouchStart = (e: TouchEvent) => {
    handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  
  useEffect(() => {
    const handleMove = (e: globalThis.MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const handleTouchMoveEvent = (e: globalThis.TouchEvent) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMoveEvent);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMoveEvent);
      window.removeEventListener('touchend', handleDragEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);


  return (
    <>
      <div 
        ref={nodeRef}
        className="relative flex flex-col items-center justify-center mt-8 cursor-grab"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div className="liquidGlass-wrapper dock group">
          <div className="liquidGlass-effect"></div>
          <div className="liquidGlass-tint"></div>
          <div className="liquidGlass-shine"></div>
          
          <div className="liquidGlass-text">
            <div className="dock-content">
              {/* Le contenu du dock peut aller ici */}
            </div>
          </div>
        </div>
      </div>

      <svg className="absolute w-0 h-0" style={{ visibility: 'hidden' }}>
        <defs>
          <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
              <feTurbulence 
                  type="fractalNoise" 
                  baseFrequency="0.01 0.01" 
                  numOctaves="1" 
                  seed="5" 
                  result="turbulence" 
              />
              <feComponentTransfer in="turbulence" result="mapped">
                  <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
                  <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
                  <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
              </feComponentTransfer>
              <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
              <feSpecularLighting 
                  in="softMap" 
                  surfaceScale="5" 
                  specularConstant="1" 
                  specularExponent="100" 
                  lightingColor="white" 
                  result="specLight"
              >
                  <fePointLight x="-200" y="-200" z="300" />
              </feSpecularLighting>
              <feComposite 
                  in="specLight" 
                  operator="arithmetic" 
                  k1="0" k2="1" k3="1" k4="0" 
                  result="litImage" 
              />
              <feDisplacementMap 
                  in="SourceGraphic" 
                  in2="softMap" 
                  scale="150" 
                  xChannelSelector="R" 
                  yChannelSelector="G" 
              />
          </filter>
        </defs>
      </svg>
    </>
  );
}
