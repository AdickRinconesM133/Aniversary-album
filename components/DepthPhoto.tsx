'use client';

import React, { useState, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const DepthDisplacementMaterial = shaderMaterial(
    {
        uMouse: new THREE.Vector2(0, 0),
        uTexture: new THREE.Texture(),
        uDepthMap: new THREE.Texture(),
    },
    // Vertex Shader
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
    // Fragment Shader (La magia ocurre aquí)
    `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uDepthMap;
  uniform vec2 uMouse;
  void main() {
    // Leemos el valor del mapa de profundidad (0.0 a 1.0)
    vec4 depth = texture2D(uDepthMap, vUv);
    
    // Desplazamos las coordenadas UV basándonos en el mouse y la profundidad
    // Multiplicamos por 0.05 para que el movimiento sea sutil
    vec2 displacement = uMouse * depth.r * 0.05;
    vec2 uv = vUv + displacement;
    
    // Dibujamos el color de la textura original con las nuevas UV movidas
    gl_FragColor = texture2D(uTexture, uv);
  }
  `
);

extend({ DepthDisplacementMaterial });

function Scene({ colorMap, depthMap }: {
    colorMap: THREE.Texture;
    depthMap: THREE.Texture;
}) {
    const materialRef = useRef<any>(null);

    useFrame((state) => {
        const { x, y } = state.mouse;

        if (materialRef.current) {
            materialRef.current.uMouse.x += (x - materialRef.current.uMouse.x) * 0.05;
            materialRef.current.uMouse.y += (y - materialRef.current.uMouse.y) * 0.05;
        }
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
    const [colorMap, depthMap] = useLoader(THREE.TextureLoader, [
        '/images/monet.jpg',
        '/images/monet_depth.png',
    ]);

    return (
        <div className="w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Scene colorMap={colorMap} depthMap={depthMap} />
            </Canvas>
        </div>
    );
}
