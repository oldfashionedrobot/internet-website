import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei'
import { Vector3 } from 'three'

type CameraRigProps = {
  cameraTarget: Vector3
  cameraPos: Vector3
  stats?: boolean
}

export function CameraRig({ cameraTarget, cameraPos, stats }: CameraRigProps) {
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null)
  const cameraRef = useRef<React.ElementRef<typeof PerspectiveCamera>>(null)

  // These flags let us know when our short transition is done.
  const positionTransitionDone = useRef(false)
  const targetTransitionDone = useRef(false)

  // Reset the flags if new external camera props are provided.
  useEffect(() => {
    positionTransitionDone.current = false
    targetTransitionDone.current = false
  }, [cameraTarget, cameraPos])

  useFrame(() => {
    // Lerp the OrbitControls target only while not done transitioning
    if (controlsRef.current && !targetTransitionDone.current) {
      const currentTarget = controlsRef.current.target
      // Check the distance between the current and target value
      if (currentTarget.distanceTo(cameraTarget) > 0.01) {
        currentTarget.lerp(cameraTarget, 0.1)
        controlsRef.current.update()
      } else {
        // Once close enough, snap to the final target and stop further updates.
        currentTarget.copy(cameraTarget)
        targetTransitionDone.current = true
      }
    }

    // Lerp the camera position only while not done transitioning
    if (cameraRef.current && !positionTransitionDone.current) {
      const currentPos = cameraRef.current.position
      if (currentPos.distanceTo(cameraPos) > 0.01) {
        currentPos.lerp(cameraPos, 0.1)
      } else {
        currentPos.copy(cameraPos)
        positionTransitionDone.current = true
      }
    }
  })

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0.75, 2]}
        fov={50}
      />
      <OrbitControls ref={controlsRef} />
      {stats && <Stats showPanel={0} />}
    </>
  )
}
