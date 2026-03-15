'use client';

// This component contains the visual layers for the glass effect.
// It should be placed inside a container with `relative isolate overflow-hidden`.
export function GlassEffect() {
  return (
    <div className="glass-container">
      <div className="glass-effect-backdrop"></div>
    </div>
  );
}

// This component defines the SVG filter. It should be placed once in a layout file.
export function DistortionFilter() {
  return null;
}
