'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useEbooks } from '@/context/ebook-provider';

interface GlassEffectButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
precision highp float;

uniform vec3 iResolution;
uniform float iTime;
uniform float iTheme; // 0.0 for light, 1.0 for dark

// Noise function from the background components
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Generates the animated background color for a given coordinate
vec3 getBackgroundColor(vec2 uv, float time) {
    vec2 p = uv;
    float ratio = iResolution.x / iResolution.y;
    p.x *= ratio;

    if (iTheme > 0.5) { // Dark Theme
        float t = time * 0.3;
        p *= 1.3;
        float n = snoise(p + snoise(p * 0.4 + t * 0.3));
        float glow = smoothstep(-0.3, 0.5, n);
        float core = smoothstep(0.0, 0.8, n);
        vec3 black = vec3(0.0, 0.0, 0.0);
        vec3 purple = vec3(0.4, 0.3, 0.85);
        vec3 blue = vec3(0.55, 0.65, 1.0);
        vec3 white = vec3(1.0, 1.0, 1.0);
        vec3 color = mix(black, purple, glow);
        color = mix(color, blue, core);
        return mix(color, white, pow(core, 4.0));
    } else { // Light Theme
        float t = time * 0.5;
        p *= 0.8;
        float n = snoise(p + snoise(p * 0.4 + t * 0.2));
        float edge = smoothstep(0.2, 0.8, n);
        float core = smoothstep(0.4, 0.9, n);
        vec3 baseWhite = vec3(1.0, 1.0, 1.0);
        vec3 softPurple = vec3(0.65, 0.6, 0.95); 
        vec3 skyBlue = vec3(0.75, 0.85, 1.0);
        vec3 color = mix(baseWhite, softPurple, edge * 0.45); 
        return mix(color, skyBlue, core * 0.5);
    }
}

// SDF for a rounded box, used to mask the effect to the button shape
float sdRoundedBox( in vec2 p, in vec2 b, in float r ) {
    vec2 q = abs(p)-b+r;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 centered_p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    // --- Shape Masking ---
    // Define the button shape. The values are tweaked to match a capsule-like button.
    vec2 box_size = vec2(iResolution.x / iResolution.y * 0.5 - 0.2, 0.5 - 0.2);
    float corner_radius = 0.25;
    float sdf = sdRoundedBox(centered_p, box_size, corner_radius);

    // Discard pixels outside the button shape
    if (sdf > 0.0) {
        discard;
    }

    // --- Chromatic Aberration ---
    // The amount of color separation.
    float ca_amount = 0.003; 

    // Get the R, G, B channels by sampling the background at slightly different coordinates
    float r = getBackgroundColor(uv + vec2(ca_amount, 0.0), iTime).r;
    float g = getBackgroundColor(uv, iTime).g;
    float b = getBackgroundColor(uv - vec2(ca_amount, 0.0), iTime).b;

    vec3 final_color = vec3(r, g, b);

    // --- Final Touches ---
    // Add a subtle inner shadow/vignette to give a sense of depth
    float vignette = smoothstep(0.0, -0.4, sdf);
    final_color *= (1.0 - vignette * 0.2);

    // Add a very subtle highlight on top
    float highlight = smoothstep(-0.05, -0.2, sdf);
    final_color += highlight * 0.05;

    // Apply alpha based on the edge of the shape for soft antialiasing
    float alpha = 1.0 - smoothstep(0.0, 0.005, sdf);

    gl_FragColor = vec4(final_color, alpha);
}
`;

export function GlassEffectButton({ children, className, onClick }: GlassEffectButtonProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>();
    const { theme } = useEbooks();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", { alpha: true });
        if (!gl) {
          console.error("WebGL is not supported");
          return;
        }

        const resizeHandler = () => {
          const parent = canvas.parentElement;
          if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          }
        };

        const createShader = (type: number, source: string) => {
          const shader = gl.createShader(type);
          if (!shader) return null;
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`Error compiling shader: ${"\'\'\'"}${gl.getShaderInfoLog(shader)}${"\'\'\'"}`);
            gl.deleteShader(shader);
            return null;
          }
          return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(`Error linking program: ${"\'\'\'"}${gl.getProgramInfoLog(program)}${"\'\'\'"}`);
            return;
        }
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [-1, 1, 1, 1, -1, -1, 1, -1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        
        const resolutionUniformLocation = gl.getUniformLocation(program, "iResolution");
        const timeUniformLocation = gl.getUniformLocation(program, "iTime");
        const themeUniformLocation = gl.getUniformLocation(program, "iTheme");

        let startTime = performance.now();

        const renderLoop = (now: number) => {
          const elapsedTime = (now - startTime) * 0.001;
          gl.clearColor(0.0, 0.0, 0.0, 0.0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.uniform3f(resolutionUniformLocation, gl.drawingBufferWidth, gl.drawingBufferHeight, 1.0);
          gl.uniform1f(timeUniformLocation, elapsedTime);
          gl.uniform1f(themeUniformLocation, theme === 'dark' ? 1.0 : 0.0);

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

          animationFrameId.current = requestAnimationFrame(renderLoop);
        };
        
        resizeHandler();
        window.addEventListener('resize', resizeHandler);
        animationFrameId.current = requestAnimationFrame(renderLoop);

        return () => {
          window.removeEventListener('resize', resizeHandler);
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
          }
        };
    }, [theme]);

    return (
        <button onClick={onClick} className={cn("relative", className)}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
            <span className={cn("relative z-10", theme === 'dark' ? 'text-white' : 'text-black')}>
                {children}
            </span>
        </button>
    );
}
