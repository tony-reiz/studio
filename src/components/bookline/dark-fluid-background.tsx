'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FluidBackgroundProps {
  isActive: boolean;
  className?: string;
}

export function DarkFluidBackground({ isActive, className }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const [isOpaque, setIsOpaque] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      // Delay setting opacity to allow CSS transition to trigger
      timer = setTimeout(() => setIsOpaque(true), 50);
    } else {
      setIsOpaque(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Add a small delay to ensure the theme has been applied and classes are settled
    const timeoutId = setTimeout(() => {
      const gl = canvas.getContext('webgl');
      if (!gl) {
        console.error("WebGL non supporté");
        return;
      }

      const vsSource = `
          attribute vec4 aVertexPosition;
          void main() {
              gl_Position = aVertexPosition;
          }
      `;

      const fsSource = `
          precision highp float;
          uniform float uTime;
          uniform vec2 uResolution;

          vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

          float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
              dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
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

          void main() {
              vec2 uv = gl_FragCoord.xy / uResolution.xy;
              vec2 p_distorted = uv;

              // Correct for aspect ratio to define a circular area
              vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
              float radius = (384.0 / 2.0) / uResolution.y;

              // Check if the current fragment is inside the circle
              if (length(st) < radius) {
                  // Apply distortion only inside the circle
                  float t_distort = uTime * 0.4;
                  vec2 noise_coord = uv * 6.0 + t_distort;
                  float distortion_x = snoise(noise_coord);
                  float distortion_y = snoise(noise_coord + vec2(10.0));
                  vec2 distortion_vec = vec2(distortion_x, distortion_y);
                  
                  // IOR strength
                  float ior_strength = 0.08; 
                  p_distorted = uv + distortion_vec * ior_strength;
              }

              float ratio = uResolution.x / uResolution.y;
              vec2 p = p_distorted * vec2(ratio, 1.0);

              float t = uTime * 0.3; 

              p *= 1.3;

              float n = snoise(p + snoise(p * 0.4 + t * 0.3));

              float glow = smoothstep(-0.2, 0.6, n);
              float core = smoothstep(0.1, 0.7, n);
              
              vec3 baseColor = vec3(0.03, 0.02, 0.1);
              vec3 purple = vec3(0.4, 0.3, 0.85);
              vec3 blue = vec3(0.55, 0.65, 1.0);
              vec3 white = vec3(1.0, 1.0, 1.0);

              vec3 color = mix(baseColor, purple, glow);
              color = mix(color, blue, core);
              color = mix(color, white, pow(core, 4.0));

              gl_FragColor = vec4(color, 1.0);
          }
      `;

      function createShader(gl, type, source) {
          const shader = gl.createShader(type);
          if (!shader) return null;
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
          }
          return shader;
      }

      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      if(!vertexShader || !fragmentShader) return;

      const program = gl.createProgram();
      if(!program) return;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.useProgram(program);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      const positionAttrib = gl.getAttribLocation(program, 'aVertexPosition');
      gl.enableVertexAttribArray(positionAttrib);
      gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

      const timeUniform = gl.getUniformLocation(program, 'uTime');
      const resUniform = gl.getUniformLocation(program, 'uResolution');

      let resize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          gl.viewport(0, 0, canvas.width, canvas.height);
      }

      window.addEventListener('resize', resize);
      resize();

      function render(time) {
          time *= 0.001; 
          gl.uniform1f(timeUniform, time);
          gl.uniform2f(resUniform, canvas.width, canvas.height);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          animationFrameId.current = requestAnimationFrame(render);
      }

      requestAnimationFrame(render);
    }, 100);


    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className={cn(
        "fixed inset-0 w-full h-full -z-10 transition-opacity duration-500",
        isOpaque ? "opacity-60" : "opacity-0 pointer-events-none",
        className
      )} />;
}
