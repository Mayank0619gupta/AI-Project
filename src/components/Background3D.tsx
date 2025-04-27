
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Create a simpler distorted material that doesn't rely on MeshDistortMaterial
function AnimatedSphere({ position, scale, color, speed }: { 
  position: [number, number, number], 
  scale: number, 
  color: string, 
  speed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry] = useState(() => new THREE.SphereGeometry(1, 32, 32));
  const [material] = useState(() => new THREE.MeshStandardMaterial({ 
    color: color,
    roughness: 0.5,
    metalness: 0.8,
  }));
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    // Simple animation without distortion
    meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * speed) * 0.5;
    meshRef.current.rotation.x = clock.getElapsedTime() * speed * 0.2;
    meshRef.current.rotation.y = clock.getElapsedTime() * speed * 0.3;
  });
  
  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
      scale={scale}
    />
  );
}

function Scene() {
  const spheres = [
    { position: [-6, 0, -5] as [number, number, number], scale: 1.5, color: "#6366f1", speed: 0.5 },
    { position: [5, -2, -10] as [number, number, number], scale: 2, color: "#8b5cf6", speed: 0.3 },
    { position: [-4, 2, -15] as [number, number, number], scale: 2.5, color: "#ec4899", speed: 0.2 },
    { position: [10, 0, -15] as [number, number, number], scale: 1.8, color: "#3b82f6", speed: 0.4 },
    { position: [0, 5, -20] as [number, number, number], scale: 3, color: "#14b8a6", speed: 0.15 },
  ];

  return (
    <>
      {spheres.map((sphere, i) => (
        <AnimatedSphere 
          key={i} 
          position={sphere.position} 
          scale={sphere.scale} 
          color={sphere.color} 
          speed={sphere.speed}
        />
      ))}
    </>
  );
}

export const Background3D: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-background to-background/80">
      <Canvas className="opacity-60" camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <Scene />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
