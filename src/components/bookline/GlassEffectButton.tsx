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
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  uniform vec3 iResolution;
  uniform float iTime;
  uniform bool isDarkTheme;

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

  vec4 getLightBackgroundColor(vec2 uv) {
      float ratio = iResolution.x / iResolution.y;
      vec2 p = uv * vec2(ratio, 1.0);
      float t = iTime * 0.5;
      p *= 0.8;
      float n = snoise(p + snoise(p * 0.4 + t * 0.2));
      float edge = smoothstep(0.2, 0.8, n);
      float core = smoothstep(0.4, 0.9, n);
      vec3 baseWhite = vec3(1.0, 1.0, 1.0);
      vec3 softPurple = vec3(0.65, 0.6, 0.95);
      vec3 skyBlue = vec3(0.75, 0.85, 1.0);
      vec3 color = mix(baseWhite, softPurple, edge * 0.45);
      color = mix(color, skyBlue, core * 0.5);
      return vec4(color, 1.0);
  }

  vec4 getDarkBackgroundColor(vec2 uv) {
      float ratio = iResolution.x / iResolution.y;
      vec2 p = uv * vec2(ratio, 1.0);
      float t = iTime * 0.3;
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
      color = mix(color, white, pow(core, 4.0));
      return vec4(color, 1.0);
  }

  vec4 getBackgroundColor(vec2 uv) {
    if (isDarkTheme) {
      return getDarkBackgroundColor(uv);
    }
    return getLightBackgroundColor(uv);
  }

  void main()
  {
    const float LENS_MAGNIFICATION = 0.1;
    const float BLUR_STRENGTH = 2.0;
    const float CHROMATIC_ABERRATION = 0.005;
    const float SPECULAR_INTENSITY = 0.7;
    const float RIM_LIGHT_INTENSITY = 0.4;
    const float OCCLUSION_DEPTH = 0.2;

    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    // --- Start Shape Calculation (SDF for a capsule) ---
    vec2 p = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;
    
    float aspect = iResolution.x / iResolution.y;
    vec2 start_point = vec2(-aspect + 1.0, 0.0);
    vec2 end_point = vec2(aspect - 1.0, 0.0);
    float radius = 1.0;
    
    vec2 pa = p - start_point;
    vec2 ba = end_point - start_point;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float sdf = length(pa - ba * h) - radius;

    float mask = 1.0 - smoothstep(-0.05, 0.05, sdf);
    // --- End Shape Calculation ---
    
    if (mask < 0.01) {
        discard;
    }

    vec2 d = vec2(dFdx(sdf), dFdy(sdf));
    vec2 normal = normalize(d);

    vec2 refracted_uv = uv - normal * LENS_MAGNIFICATION * (1.0 - mask);
    
    vec4 blurred_color = vec4(0.0);
    for(float x = -2.0; x <= 2.0; x++) {
        for(float y = -2.0; y <= 2.0; y++) {
            vec2 offset = vec2(x, y) * BLUR_STRENGTH / iResolution.xy;
            blurred_color += getBackgroundColor(refracted_uv + offset);
        }
    }
    blurred_color /= 25.0;

    vec3 color_r = getBackgroundColor(refracted_uv + normal * CHROMATIC_ABERRATION).rgb;
    vec3 color_b = getBackgroundColor(refracted_uv - normal * CHROMATIC_ABERRATION).rgb;
    blurred_color.r = color_r.r;
    blurred_color.b = color_b.b;

    vec3 light_dir = normalize(vec3(0.5, 0.5, 1.0));
    float specular = pow(max(0.0, dot(vec3(normal, 0.5), light_dir)), 32.0) * SPECULAR_INTENSITY;
    float rim = pow(1.0 - smoothstep(0.0, 1.0, sdf + 1.0), 2.0) * RIM_LIGHT_INTENSITY;

    vec3 final_color = blurred_color.rgb + specular + rim;

    final_color *= (1.0 - (1.0 - mask) * OCCLUSION_DEPTH);

    gl_FragColor = vec4(final_color, mask);
  }
`;

export function GlassEffectButton({ children, className, onClick }: GlassEffectButtonProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>();
    const { theme } = useEbooks();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
        if (!gl) {
          console.error("WebGL not supported");
          return;
        }
        
        gl.getExtension('OES_standard_derivatives');

        const setCanvasSize = () => {
          const parent = canvas.parentElement;
          if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
          }
        };
        setCanvasSize();

        const createShader = (type: number, source: string) => {
          const shader = gl.createShader(type);
          if (!shader) return null;
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader error:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
          }
          return shader;
        };

        const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        const position = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

        const uniforms = {
          resolution: gl.getUniformLocation(program, "iResolution"),
          time: gl.getUniformLocation(program, "iTime"),
          isDarkTheme: gl.getUniformLocation(program, "isDarkTheme"),
        };
        
        const startTime = performance.now();
        const render = (time: number) => {
          animationFrameId.current = requestAnimationFrame(render);
          
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clearColor(0.0, 0.0, 0.0, 0.0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.uniform3f(uniforms.resolution, canvas.width, canvas.height, 1.0);
          gl.uniform1f(uniforms.time, (performance.now() - startTime) * 0.001);
          gl.uniform1i(uniforms.isDarkTheme, theme === 'dark' ? 1 : 0);

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        
        window.addEventListener("resize", setCanvasSize);
        render(performance.now());
        
        return () => {
            window.removeEventListener("resize", setCanvasSize);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
  }, [theme]);

  return (
    <button onClick={onClick} className={cn("relative overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95", theme === 'dark' ? 'text-white' : 'text-black', className)}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />
        <span className="relative z-10">{children}</span>
    </button>
  );
}
