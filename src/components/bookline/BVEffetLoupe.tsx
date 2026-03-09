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
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec2 uElementSize;
    varying vec2 vUv;

    // Fonction pour séparer les couleurs sur les bords (Dispersion chromatique)
    vec3 applyDispersion(sampler2D tex, vec2 uv, vec2 direction, float strength) {
        float r = texture2D(tex, uv + direction * strength * 0.0).r;
        float g = texture2D(tex, uv + direction * strength * 0.7).g;
        float b = texture2D(tex, uv + direction * strength * 1.4).b;
        return vec3(r, g, b);
    }

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
            
            float refractionFactor = 0.55; 
            vec2 refraction = p * refractionFactor * lensCurve;
            vec2 refractedUv = center + (p - refraction) / 2.1;

            float dispersionStrength = 0.045 * lensCurve;
            vec3 glassColor = applyDispersion(tDiffuse, refractedUv, normalize(p + 0.0001), dispersionStrength);
            
            gl_FragColor = vec4(glassColor * 1.15, 1.0);
        } else {
            gl_FragColor = texture2D(tDiffuse, vUv) * 0.8;
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

        const m = { x: 0, y: 0, tx: 0, ty: 0 };
        let rect = mountNode.getBoundingClientRect();

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(rect.width, rect.height);
            mountNode?.appendChild(renderer.domElement);

            const loader = new THREE.TextureLoader();
            loader.setCrossOrigin("anonymous");
            const tex = loader.load('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564');
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            
            m.x = rect.width / 2;
            m.y = rect.height / 2;
            m.tx = rect.width / 2;
            m.ty = rect.height / 2;

            material = new THREE.ShaderMaterial({
                uniforms: {
                    tDiffuse: { value: tex },
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
            
            // Cleanup Three.js resources
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
