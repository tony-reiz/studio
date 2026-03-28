'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useEbooks } from '@/context/ebook-provider';

interface IridescenceBackgroundProps {
  className?: string;
}

export function IridescenceBackground({ className }: IridescenceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const { theme } = useEbooks();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures we only render/run effects on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    // We also check isClient here to ensure canvas is available
    // and theme is correctly initialized.
    if (!canvas || theme !== 'light' || !isClient) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    const fsSource = `
        precision mediump float;
        uniform float uTime;
        uniform vec2 uResolution;

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);

            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));

            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
        }

        void main() {
            vec2 st = gl_FragCoord.xy / uResolution.xy;
            st.x *= uResolution.x / uResolution.y;

            float t = uTime * 0.2;

            float n = noise(st * 2.0 + t);
            
            float r = 0.5 + 0.5 * cos(t + st.x * 2.0 + n * 3.14);
            float g = 0.5 + 0.5 * sin(t + st.y * 1.5 + n * 3.14);
            float b = 0.5 + 0.5 * cos(t + (st.x + st.y) * 1.0 + n * 3.14);

            vec3 color = vec3(r, g, b);
            
            color = mix(color, vec3(1.0), 0.7);
            
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

    let startTime = Date.now();
    function render() {
        if (!canvasRef.current) return;
        const time = (Date.now() - startTime) * 0.001;
        gl.uniform1f(timeUniform, time);
        gl.uniform2f(resUniform, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animationFrameId.current = requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [theme, isClient]);

  return (
    <canvas ref={canvasRef} className={cn(
      "fixed inset-0 w-full h-full -z-10 transition-opacity duration-1000",
      isClient && theme === 'light' ? "opacity-100" : "opacity-0 pointer-events-none",
      className
    )} />
  );
}
