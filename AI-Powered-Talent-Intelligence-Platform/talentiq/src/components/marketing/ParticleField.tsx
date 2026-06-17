'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const BRAND_COLORS = {
  primary: '#2563EB',
  accent: '#10B981',
  white: '#FFFFFF',
}

const vertexShader = `
uniform float uTime;
attribute float aSize;
attribute float aSpeed;
attribute float aOffset;
varying vec3 vColor;

void main() {
  vColor = color;
  vec3 pos = position;

  // Move particles along Z
  pos.z += uTime * aSpeed * 2.0;
  
  // Wrap around
  // The box depth is 5, from -2.5 to 2.5
  float depth = 5.0;
  pos.z = mod(pos.z + 2.5, depth) - 2.5;
  
  // Add some slight waving based on time and offset
  pos.x += sin(uTime * 0.5 + aOffset) * 0.1;
  pos.y += cos(uTime * 0.3 + aOffset) * 0.1;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (30.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = `
varying vec3 vColor;

void main() {
  // Make it a soft circle
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;
  
  float alpha = smoothstep(0.5, 0.1, dist);
  gl_FragColor = vec4(vColor, alpha * 0.8);
}
`

function Particles({ count, disableParallax }: { count: number, disableParallax: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  
  const { positions, colors, sizes, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)

    const color1 = new THREE.Color(BRAND_COLORS.primary)
    const color2 = new THREE.Color(BRAND_COLORS.accent)
    const color3 = new THREE.Color(BRAND_COLORS.white)

    for (let i = 0; i < count; i++) {
      // Box: 20x10x5
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5

      const rColor = Math.random()
      const c = rColor > 0.7 ? color1 : (rColor > 0.4 ? color2 : color3)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      sizes[i] = Math.random() * 1.5 + 0.5
      speeds[i] = Math.random() * 0.5 + 0.1
      offsets[i] = Math.random() * Math.PI * 2
    }

    return { positions, colors, sizes, speeds, offsets }
  }, [count])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const material = pointsRef.current.material as THREE.ShaderMaterial
    material.uniforms.uTime.value = state.clock.elapsedTime

    if (!disableParallax) {
      // Mouse parallax: left-right shifts 0.3 units, up-down 0.1 units
      const targetX = state.pointer.x * 0.3
      const targetY = state.pointer.y * 0.1
      pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.05
      pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aSpeed" count={count} array={speeds} itemSize={1} />
        <bufferAttribute attach="attributes-aOffset" count={count} array={offsets} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

class ErrorBoundary extends React.Component<{children: React.ReactNode, fallback: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode, fallback: React.ReactNode}) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

export default function ParticleField() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [particleCount, setParticleCount] = useState(2000)
  const [disableParallax, setDisableParallax] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    if (window.innerWidth < 768) {
      setParticleCount(400)
    }

    // Very simple low-tier heuristic
    if (typeof navigator !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const lowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4
      const fewCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
      if (isMobile && (lowMemory || fewCores)) {
        setParticleCount(200)
        setDisableParallax(true)
      }
    }
  }, [])

  if (reducedMotion) return null

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
      <ErrorBoundary fallback={null}>
        <React.Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 2], fov: 60 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          >
            <Particles count={particleCount} disableParallax={disableParallax} />
          </Canvas>
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}
