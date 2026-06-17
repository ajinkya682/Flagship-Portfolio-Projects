'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Icosahedron, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  active: boolean;
  scrollProgress: number;
}

function CenterMesh({ active }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Spin faster when active
      const targetSpeed = active ? 2.5 : 0.5
      meshRef.current.rotation.y += delta * targetSpeed
      meshRef.current.rotation.x += delta * (targetSpeed * 0.5)
      
      // Pulse scale slightly when active
      const targetScale = active ? 1 + Math.sin(state.clock.elapsedTime * 6) * 0.08 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }

    if (ringRef.current) {
      // Orbiting rings spin up when active
      const targetRingSpeed = active ? 2.0 : 0.3
      ringRef.current.rotation.z -= delta * targetRingSpeed
      ringRef.current.rotation.x = Math.PI / 3.5 // Tilted orbit
    }
  })

  return (
    <group>
      {/* Core Icosahedron Energy Mesh */}
      <Icosahedron ref={meshRef} args={[1.2, 0]}>
        <MeshDistortMaterial 
          color={active ? "#34D399" : "#10B981"} 
          emissive="#10B981" 
          emissiveIntensity={active ? 1.5 : 0.3} 
          wireframe={true} 
          distort={0.4} 
          speed={active ? 5 : 1} 
        />
      </Icosahedron>

      {/* Orbiting energy particles */}
      <group ref={ringRef}>
        <Sparkles 
          count={active ? 80 : 20} 
          scale={3.5} 
          size={active ? 5 : 2} 
          speed={active ? 1.5 : 0.2} 
          opacity={active ? 0.9 : 0.3} 
          color="#A7F3D0" 
        />
      </group>
    </group>
  )
}

export default function ThreeSparkleMesh({ active, scrollProgress }: Props) {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <CenterMesh active={active} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
