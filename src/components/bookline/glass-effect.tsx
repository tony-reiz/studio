'use client';

// This component contains the visual layers for the glass effect.
// It should be placed inside a container with `relative isolate overflow-hidden`.
export function GlassEffect() {
  return (
    <div className="glass-container">
      <div className="glass-effect-backdrop"></div>
      <div className="glass-effect top"></div>
      <div className="glass-effect bottom"></div>
      <div className="glass-effect left"></div>
      <div className="glass-effect right"></div>
    </div>
  );
}

// This component defines the SVG filter. It should be placed once in a layout file.
export function DistortionFilter() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
      <filter id="distortion" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" />
      </filter>
    </svg>
  );
}
