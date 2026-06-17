'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import HeroMeshBackground from './HeroMeshBackground'

// BRAND_COLORS from token system
const BRAND_COLORS = {
  aurora1: '#6366F1', // indigo
  aurora2: '#8B5CF6', // violet
  aurora3: '#EC4899', // pink
  aurora4: '#06B6D4', // cyan
  aurora5: '#10B981', // emerald
}

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;
varying float vDisplacement;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Fluid wave effect
  float displacement = 
    sin(pos.x * 1.5 + uTime * 0.4) * 0.3 + 
    sin(pos.y * 2.0 + uTime * 0.3) * 0.2 + 
    cos(pos.x * pos.y * 0.5 + uTime * 0.2) * 0.15;

  // Mouse influence
  // Convert mouse from normalized coordinates to plane coordinates roughly
  vec2 mousePlane = uMouse * vec2(uResolution.x/uResolution.y, 1.0) * 3.0; 
  vec2 vertexPlane = pos.xy;
  float dist = distance(vertexPlane, mousePlane);
  
  if (dist < 0.8) {
    float influence = (0.8 - dist) / 0.8;
    displacement += influence * 0.1;
  }

  pos.z += displacement;
  vDisplacement = displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;

varying vec2 vUv;
varying float vDisplacement;

// Simple 2D noise function for blending
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 st = vUv * 3.0;
  
  // Create organic flowing noise patterns
  float n1 = noise(st + uTime * 0.1);
  float n2 = noise(st * 2.0 - uTime * 0.15);
  float n3 = noise(st * 0.5 + uTime * 0.05);

  // Blend colors based on noise and UVs
  vec3 colorA = mix(color1, color2, n1);
  vec3 colorB = mix(color3, color4, n2);
  vec3 finalColor = mix(colorA, colorB, n3);
  finalColor = mix(finalColor, color5, vDisplacement * 2.0); // Add emerald peaks
  
  // Edge fade (alpha)
  float edgeDistX = min(vUv.x, 1.0 - vUv.x);
  float edgeDistY = min(vUv.y, 1.0 - vUv.y);
  float edgeAlpha = smoothstep(0.0, 0.2, edgeDistX) * smoothstep(0.0, 0.2, edgeDistY);
  
  // Overall opacity 0.18
  gl_FragColor = vec4(finalColor, edgeAlpha * 0.18);
}
`

function AuroraMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport, size } = useThree()
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      color1: { value: new THREE.Color(BRAND_COLORS.aurora1) },
      color2: { value: new THREE.Color(BRAND_COLORS.aurora2) },
      color3: { value: new THREE.Color(BRAND_COLORS.aurora3) },
      color4: { value: new THREE.Color(BRAND_COLORS.aurora4) },
      color5: { value: new THREE.Color(BRAND_COLORS.aurora5) },
    }),
    [size]
  )

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
      
      // Update mouse (normalized -1 to 1)
      material.uniforms.uMouse.value.x = (state.pointer.x)
      material.uniforms.uMouse.value.y = (state.pointer.y)
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
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
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export default function ThreeHeroBackground() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isLowTier, setIsLowTier] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Simple heuristic for low-tier device: no hardware concurrency or low memory
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const lowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4
      const fewCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
      if (isMobile && (lowMemory || fewCores)) {
        setIsLowTier(true)
      }
    }
  }, [])

  if (reducedMotion || isLowTier) {
    return <HeroMeshBackground />
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <ErrorBoundary fallback={<HeroMeshBackground />}>
        <React.Suspense fallback={<HeroMeshBackground />}>
          <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          >
            <AuroraMesh />
          </Canvas>
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}
