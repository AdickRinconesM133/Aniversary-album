'use client';

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const DepthDisplacementMaterial = shaderMaterial(
    {
        uMouse: new THREE.Vector2(0, 0),
        uTexture: new THREE.Texture(),
        uDepthMap: new THREE.Texture(),
    },
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
    `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uDepthMap;
  uniform vec2 uMouse;
  void main() {
    vec4 depth = texture2D(uDepthMap, vUv);
    vec2 displacement = uMouse * depth.r * 0.05;
    vec2 uv = vUv + displacement;
    gl_FragColor = texture2D(uTexture, uv);
  }
  `
);

extend({ DepthDisplacementMaterial });

declare global {
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                depthDisplacementMaterial: any;
            }
        }
    }
}

function Scene({ colorMap, depthMap, isVisible }: {
    colorMap: THREE.Texture;
    depthMap: THREE.Texture;
    isVisible: boolean;
}) {
    const materialRef = useRef<any>(null);
    const { invalidate } = useThree();

    useFrame((state) => {
        if (!isVisible) return;

        const { x, y } = state.mouse;
        const t = state.clock.getElapsedTime();

        if (materialRef.current) {
            const autoX = Math.sin(t) * 0.15;
            const autoY = Math.cos(t) * 0.09;

            const targetX = x + autoX;
            const targetY = y + autoY;

            materialRef.current.uMouse.x += (targetX - materialRef.current.uMouse.x) * 0.05;
            materialRef.current.uMouse.y += (targetY - materialRef.current.uMouse.y) * 0.05;
        }

        invalidate();
    });

    return (
        <mesh scale={[3.2, 1.8, 1]}>
            <planeGeometry args={[1, 1]} />
            <depthDisplacementMaterial
                ref={materialRef}
                uTexture={colorMap}
                uDepthMap={depthMap}
                transparent
            />
        </mesh>
    );
}

export default function DepthPhoto() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    const [colorMap, depthMap] = useLoader(THREE.TextureLoader, [
        '/images/monet.jpg',
        '/images/monet_depth.png',
    ]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 0, 1] }} frameloop="demand">
                <Scene colorMap={colorMap} depthMap={depthMap} isVisible={isVisible} />
            </Canvas>
        </div>
    );
}
