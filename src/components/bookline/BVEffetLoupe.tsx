'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec2 uElementSize;
    varying vec2 vUv;

    void main() {
        float aspect = uResolution.x / uResolution.y;
        vec2 center = uMouse / uResolution;
        vec2 p = (vUv - center);
        p.x *= aspect;
        
        float w = (uElementSize.x / uResolution.y) * 0.5;
        float h = (uElementSize.y / uResolution.y) * 0.5;
        float r = h; 
        
        vec2 q = abs(p) - vec2(w - r, h - r);
        float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;

        if (dist < 0.0) {
            float normDist = clamp(-dist / r, 0.0, 1.0);
            float lensCurve = pow(sin(normDist * 1.5707), 1.2);
            
            vec4 glassColor = vec4(1.0, 1.0, 1.0, 0.05);

            vec2 reflectionDir = normalize(vec2(0.5, 0.5) - p);
            float reflection = max(0.0, dot(reflectionDir, normalize(p)));
            reflection = pow(reflection, 20.0) * lensCurve;

            float edgeHighlight = smoothstep(0.9, 1.0, lensCurve) * 0.3;
            
            glassColor.rgb += vec3(reflection * 0.3 + edgeHighlight * 0.2);
            
            gl_FragColor = glassColor;
        } else {
            discard;
        }
    }
`;

export function BVEffetLoupe() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mountNode = mountRef.current;
        if (!mountNode) return;

        let scene: THREE.Scene, 
            camera: THREE.OrthographicCamera, 
            renderer: THREE.WebGLRenderer, 
            material: THREE.ShaderMaterial;
            
        let animationFrameId: number;

        let m = { x: 0, y: 0, tx: 0, ty: 0 };
        let rect = mountNode.getBoundingClientRect();

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(rect.width, rect.height);
            mountNode?.appendChild(renderer.domElement);
            
            m.x = rect.width / 2;
            m.y = rect.height / 2;
            m.tx = rect.width / 2;
            m.ty = rect.height / 2;

            material = new THREE.ShaderMaterial({
                uniforms: {
                    uResolution: { value: new THREE.Vector2(rect.width, rect.height) },
                    uMouse: { value: new THREE.Vector2(m.x, m.y) },
                    uElementSize: { value: new THREE.Vector2(rect.width, rect.height) }
                },
                vertexShader,
                fragmentShader,
                transparent: true,
            });

            scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

            mountNode?.addEventListener('mousemove', onMouseMove);
            mountNode?.addEventListener('mouseleave', onMouseLeave);
            window.addEventListener('resize', onResize);
            
            animate();
        }

        function onMouseMove(e: MouseEvent) {
            if (!mountNode) return;
            rect = mountNode.getBoundingClientRect();
            m.tx = e.clientX - rect.left;
            m.ty = rect.height - (e.clientY - rect.top);
        }

        function onMouseLeave() {
            if (!mountNode) return;
            rect = mountNode.getBoundingClientRect();
            m.tx = rect.width / 2;
            m.ty = rect.height / 2;
        }

        function onResize() {
            if (!mountNode) return;
            rect = mountNode.getBoundingClientRect();
            renderer.setSize(rect.width, rect.height);
            material.uniforms.uResolution.value.set(rect.width, rect.height);
            material.uniforms.uElementSize.value.set(rect.width, rect.height);
        }

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            
            m.x += (m.tx - m.x) * 0.1;
            m.y += (m.ty - m.y) * 0.1;
            
            material.uniforms.uMouse.value.set(m.x, m.y);
            renderer.render(scene, camera);
        }
        
        init();

        return () => {
            cancelAnimationFrame(animationFrameId);
            mountNode?.removeEventListener('mousemove', onMouseMove);
            mountNode?.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('resize', onResize);
            
            if (material) material.dispose();
            scene.traverse(object => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                }
            });
            if (renderer) renderer.dispose();
            if (mountNode && renderer) {
                mountNode.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full" />;
}
