'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'

function ParticleSystem() {
  return (
    <>
      {/* Large out-of-focus bokeh orbs */}
      <Sparkles count={40} scale={25} size={30} speed={0.1} opacity={0.08} color="#3B58F6" />
      <Sparkles count={30} scale={20} size={40} speed={0.1} opacity={0.05} color="#10B981" />
      
      {/* Medium floating particles */}
      <Sparkles count={80} scale={20} size={10} speed={0.3} opacity={0.2} color="#8B5CF6" />
      
      {/* Tiny fast moving dust particles */}
      <Sparkles count={150} scale={25} size={3} speed={0.5} opacity={0.4} color="#ffffff" />
    </>
  )
}

export default function ThreeParticleBackground() {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 1.5]}>
        <ParticleSystem />
      </Canvas>
    </div>
  )
}
