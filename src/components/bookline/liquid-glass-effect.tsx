'use client';

import { cn } from '@/lib/utils';

export const LiquidGlassSVG = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
            <filter 
              id="liquid-glass-distortion" 
              x="-100%" 
              y="-100%" 
              width="300%" 
              height="300%" 
              filterUnits="objectBoundingBox"
            >
                <feTurbulence 
                    type="fractalNoise" 
                    baseFrequency="0.01 0.01" 
                    numOctaves="1" 
                    seed="5" 
                    result="turbulence" 
                />
                <feDisplacementMap 
                    in="SourceGraphic" 
                    in2="turbulence" 
                    scale="150"
                    xChannelSelector="R" 
                    yChannelSelector="G" 
                />
            </filter>
        </defs>
    </svg>
);

export const LiquidGlassEffect = () => (
    <div
        className="liquid-glass-effect-layer"
        style={{
            filter: 'url(#liquid-glass-distortion)',
        }}
    />
);
