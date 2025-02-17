'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei'
import PageWrapper from '@shared/components/PageWrapper'
import { FilingCabinet } from './components/FilingCabinet'

export default function HomePage() {
  // Approximate center of the cabinet:
  // X: 0, Y: cabinetHeight/2 = 0.75, Z: roughly [-cabinetDepth / 2]
  const cabinetCenter = [0, 0.75, -0.25] as const

  return (
    <PageWrapper title="Filing Cabinet">
      <Canvas
        shadows
        frameloop="always"
        dpr={[1, 2]}
        style={{ height: '500px' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.75, 2]} fov={50} />
        <OrbitControls target={cabinetCenter} />
        <Stats showPanel={0} />
        <ambientLight intensity={0.7} />
        <spotLight
          position={[0.8, 2, 1]}
          angle={0.6}
          penumbra={0.1}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <FilingCabinet />
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, -0.25]}
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
      </Canvas>
    </PageWrapper>
  )
}
