'use client'

import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three'
import PageWrapper from '@shared/components/PageWrapper'
import { FilingCabinet } from './components/FilingCabinet'
import { CameraRig } from './components/CameraRig'

export default function HomePage() {
  // Default camera views
  const defaultView = {
    target: new Vector3(0, 0.75, -0.25),
    position: new Vector3(0, 0.75, 2)
  }

  // Simplified state management
  const [cameraState, setCameraState] = useState({
    target: defaultView.target,
    position: defaultView.position,
    folderCenter: null as Vector3 | null
  })

  // Combined handler for drawer and folder operations
  const handleCameraUpdate = (
    target: Vector3,
    position: Vector3,
    folderCenter: Vector3 | null = null
  ) => {
    setCameraState({
      target,
      position,
      folderCenter
    })
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
          cameraTarget={cameraState.target}
          cameraPos={cameraState.position}
          folderLookAt={cameraState.folderCenter}
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
        <FilingCabinet
          onDrawerToggle={(target, position) =>
            handleCameraUpdate(target, position)
          }
          onFolderOpen={handleCameraUpdate}
        />
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
