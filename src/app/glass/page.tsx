'use client';

import { useEffect, useRef } from 'react';
import { useEbooks } from '@/context/ebook-provider';

const fragmentShaderSource = `
  precision mediump float;

  uniform vec3 iResolution;
  uniform float iTime;
  uniform vec4 iMouse;
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

  void mainImage(out vec4 fragColor, in vec2 fragCoord)
  {
    const float NUM_ZERO = 0.0;
    const float NUM_ONE = 1.0;
    const float NUM_HALF = 0.5;
    const float NUM_TWO = 2.0;
    const float POWER_EXPONENT = 6.0;
    const float MASK_MULTIPLIER_1 = 10000.0;
    const float MASK_MULTIPLIER_2 = 9500.0;
    const float MASK_MULTIPLIER_3 = 11000.0;
    const float LENS_MULTIPLIER = 5000.0;
    const float MASK_STRENGTH_1 = 8.0;
    const float MASK_STRENGTH_2 = 16.0;
    const float MASK_STRENGTH_3 = 2.0;
    const float MASK_THRESHOLD_1 = 0.95;
    const float MASK_THRESHOLD_2 = 0.9;
    const float MASK_THRESHOLD_3 = 1.5;
    const float SAMPLE_RANGE = 4.0;
    const float SAMPLE_OFFSET = 0.5;
    const float GRADIENT_RANGE = 0.2;
    const float GRADIENT_OFFSET = 0.1;
    const float GRADIENT_EXTREME = -1000.0;
    const float LIGHTING_INTENSITY = 0.3;
    const float CA_STRENGTH = 0.005; // Chromatic aberration strength

    vec2 uv = fragCoord / iResolution.xy;
    vec2 mouse = iResolution.xy / NUM_TWO;
    vec2 m2 = (uv - mouse / iResolution.xy);

    float roundedBox = pow(abs(m2.x * iResolution.x / iResolution.y), POWER_EXPONENT) + pow(abs(m2.y), POWER_EXPONENT);
    float rb1 = clamp((NUM_ONE - roundedBox * MASK_MULTIPLIER_1) * MASK_STRENGTH_1, NUM_ZERO, NUM_ONE);
    float rb2 = clamp((MASK_THRESHOLD_1 - roundedBox * MASK_MULTIPLIER_2) * MASK_STRENGTH_2, NUM_ZERO, NUM_ONE) -
      clamp(pow(MASK_THRESHOLD_2 - roundedBox * MASK_MULTIPLIER_2, NUM_ONE) * MASK_STRENGTH_2, NUM_ZERO, NUM_ONE);
    float rb3 = clamp((MASK_THRESHOLD_3 - roundedBox * MASK_MULTIPLIER_3) * MASK_STRENGTH_3, NUM_ZERO, NUM_ONE) -
      clamp(pow(NUM_ONE - roundedBox * MASK_MULTIPLIER_3, NUM_ONE) * MASK_STRENGTH_3, NUM_ZERO, NUM_ONE);

    fragColor = vec4(NUM_ZERO);
    float transition = smoothstep(NUM_ZERO, NUM_ONE, rb1 + rb2);
    
    vec4 backgroundColor = getBackgroundColor(uv);

    if (transition > NUM_ZERO) {
      vec2 lens = ((uv - NUM_HALF) * NUM_ONE * (NUM_ONE - roundedBox * LENS_MULTIPLIER) + NUM_HALF);
      
      // Chromatic Aberration offset
      vec2 ca_offset = m2 * CA_STRENGTH;
      
      // Sample background with blur and chromatic aberration
      vec4 blurredColor = vec4(NUM_ZERO);
      float total = NUM_ZERO;
      for (float x = -SAMPLE_RANGE; x <= SAMPLE_RANGE; x++) {
        for (float y = -SAMPLE_RANGE; y <= SAMPLE_RANGE; y++) {
          vec2 offset = vec2(x, y) * SAMPLE_OFFSET / iResolution.xy;
          vec2 sample_pos = offset + lens;
          blurredColor.r += getBackgroundColor(sample_pos + ca_offset).r;
          blurredColor.g += getBackgroundColor(sample_pos).g;
          blurredColor.b += getBackgroundColor(sample_pos - ca_offset).b;
          blurredColor.a += getBackgroundColor(sample_pos).a;
          total += NUM_ONE;
        }
      }
      blurredColor /= total;

      float gradient = clamp((clamp(m2.y, NUM_ZERO, GRADIENT_RANGE) + GRADIENT_OFFSET) / NUM_TWO, NUM_ZERO, NUM_ONE) +
        clamp((clamp(-m2.y, GRADIENT_EXTREME, GRADIENT_RANGE) * rb3 + GRADIENT_OFFSET) / NUM_TWO, NUM_ZERO, NUM_ONE);
      vec4 lighting = clamp(blurredColor + vec4(rb1) * gradient + vec4(rb2) * LIGHTING_INTENSITY, NUM_ZERO, NUM_ONE);

      fragColor = mix(backgroundColor, lighting, transition);
    } else {
      fragColor = backgroundColor;
    }
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export default function GlassPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const { theme } = useEbooks();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use a small delay to prevent race conditions on fast reloads
    const timeoutId = setTimeout(() => {
        const gl = canvas.getContext("webgl");
        if (!gl) {
          console.error("WebGL not supported");
          return;
        }

        const setCanvasSize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
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
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW
        );

        const position = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

        const uniforms = {
          resolution: gl.getUniformLocation(program, "iResolution"),
          time: gl.getUniformLocation(program, "iTime"),
          mouse: gl.getUniformLocation(program, "iMouse"),
          isDarkTheme: gl.getUniformLocation(program, "isDarkTheme"),
        };
        
        const mouse = [0, 0];

        const startTime = performance.now();
        const render = (time: number) => {
          animationFrameId.current = requestAnimationFrame(render);
          
          const currentTime = (performance.now() - startTime) / 1000;

          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.uniform3f(uniforms.resolution, canvas.width, canvas.height, 1.0);
          gl.uniform1f(uniforms.time, time * 0.001);
          gl.uniform4f(uniforms.mouse, mouse[0], mouse[1], 0, 0);
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
    }, 100);

    return () => clearTimeout(timeoutId);

  }, [theme]);

  return (
    <div className="bg-background w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} id="canvas" className="block w-full h-full" />
    </div>
  );
}
