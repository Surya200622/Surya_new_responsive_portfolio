'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';

function MagicalOrb() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.5}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          wireframe={true} 
          emissive="#6d28d9"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      <Sphere args={[0.7, 64, 64]}>
        <MeshDistortMaterial 
          color="#3b82f6" 
          attach="material" 
          distort={0.4} 
          speed={2} 
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function Floating3DElement() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        <MagicalOrb />
      </Canvas>
    </div>
  );
}
