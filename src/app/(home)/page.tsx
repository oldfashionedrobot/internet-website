'use client'

import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three'
import PageWrapper from '@shared/components/PageWrapper'
import { FilingCabinet } from './components/FilingCabinet'
import { CameraRig } from './components/CameraRig'

export default function HomePage() {
  const defaultTarget = new Vector3(0, 0.75, -0.25)
  const defaultCameraPos = new Vector3(0, 0.75, 2)
  const [cameraTarget, setCameraTarget] = useState(defaultTarget)
  const [cameraPos, setCameraPos] = useState(defaultCameraPos)

  const handleDrawerToggle = (target: Vector3, position: Vector3) => {
    setCameraTarget(target)
    setCameraPos(position)
  }

  return (
    <PageWrapper title="Filing Cabinet">
      <Canvas
        shadows
        frameloop="always"
        dpr={[1, 2]}
        style={{ height: '500px' }}
      >
        <CameraRig
          cameraTarget={cameraTarget}
          cameraPos={cameraPos}
          stats={true}
        />
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
        <FilingCabinet onDrawerToggle={handleDrawerToggle} />
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
