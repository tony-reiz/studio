'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface BVCouleurProps {
  className?: string;
  id: string;
}

// Shader for the button background
const vsSource = `
    attribute vec4 aVertexPosition;
    void main() { gl_Position = aVertexPosition; }
`;

// Fragment shader from user's code for the button
const fsSource = `
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;
    void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        vec2 p = (uv - 0.5) * 2.0;
        p.x *= uResolution.x / uResolution.y;
        float t = uTime * 2.5;
        for(float i = 1.0; i < 4.0; i++) {
            p.x += 0.3 / i * sin(i * 3.0 * p.y + t);
            p.y += 0.3 / i * cos(i * 3.0 * p.x + t);
        }
        vec3 mainCol = vec3(0.49, 0.54, 1.0); 
        vec3 secondCol = vec3(0.3, 0.1, 0.9);
        float pattern = sin(p.x + p.y + t) * 0.5 + 0.5;
        vec3 col = mix(mainCol, secondCol, pattern);
        col += 0.25 * vec3(smoothstep(0.4, 1.0, pattern));
        gl_FragColor = vec4(col, 1.0);
    }
`;

export function BVCouleur({ className, id }: BVCouleurProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const shaderProgramRef = useRef<WebGLProgram | null>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const parent = canvas.parentElement;
    if (!parent) return;

    const initGL = () => {
      const gl = canvas.getContext('webgl', { alpha: true });
      if (!gl) {
        console.error("WebGL not supported");
        return null;
      }
      const shaderProgram = gl.createProgram();
      if (!shaderProgram) return null;

      const vs = gl.createShader(gl.VERTEX_SHADER);
      if (!vs) return null;
      gl.shaderSource(vs, vsSource);
      gl.compileShader(vs);
      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the vertex shader: ' + gl.getShaderInfoLog(vs));
        gl.deleteShader(vs);
        return null;
      }

      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      if (!fs) return null;
      gl.shaderSource(fs, fsSource);
      gl.compileShader(fs);
       if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the fragment shader: ' + gl.getShaderInfoLog(fs));
        gl.deleteShader(fs);
        return null;
      }

      gl.attachShader(shaderProgram, vs);
      gl.attachShader(shaderProgram, fs);
      gl.linkProgram(shaderProgram);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);

      glRef.current = gl;
      shaderProgramRef.current = shaderProgram;
      return gl;
    };

    if (!initGL()) return;

    const resize = () => {
        const gl = glRef.current;
        if (!gl || !canvas || !parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            canvas.width = rect.width;
            canvas.height = rect.height;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
    };

    const render = (time: number) => {
      const gl = glRef.current;
      const shaderProgram = shaderProgramRef.current;
      if (!gl || !shaderProgram || !canvas) return;

      const t = time * 0.001;

      gl.useProgram(shaderProgram);
      const pos = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(gl.getUniformLocation(shaderProgram, "uTime"), t);
      gl.uniform2f(gl.getUniformLocation(shaderProgram, "uResolution"), canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId.current = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    
    resize();
    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} id={id} className={cn("pointer-events-none", className)} />;
}
