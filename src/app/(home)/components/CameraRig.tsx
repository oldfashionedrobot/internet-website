import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei'
import { Vector3 } from 'three'

type CameraRigProps = {
  cameraTarget: Vector3
  cameraPos: Vector3
  folderLookAt?: Vector3 | null
  stats?: boolean
}

export function CameraRig({
  cameraTarget,
  cameraPos,
  folderLookAt = null,
  stats
}: CameraRigProps) {
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null)
  const cameraRef = useRef<React.ElementRef<typeof PerspectiveCamera>>(null)

  // Store current animation state
  const animationState = useRef({
    time: 0,
    duration: 1.5, // Animation duration in seconds
    startTarget: new Vector3(),
    startPosition: new Vector3(),
    isAnimating: false
  })

  // Start a new animation when target or position changes
  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return

    const state = animationState.current
    state.time = 0
    state.startTarget.copy(controlsRef.current.target)
    state.startPosition.copy(cameraRef.current.position)
    state.isAnimating = true

    console.log('Starting new camera animation', {
      from: state.startPosition.toArray(),
      to: cameraPos.toArray()
    })
  }, [cameraTarget, cameraPos])

  // Smooth easing function
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  useFrame((_, delta) => {
    if (!controlsRef.current || !cameraRef.current) return

    const state = animationState.current

    // Priority 1: Handle camera position transitions
    if (state.isAnimating) {
      // Increment animation time
      state.time += delta
      const t = Math.min(state.time / state.duration, 1)
      const easedT = easeInOutCubic(t)

      // Always animate camera position regardless of folder tracking
      cameraRef.current.position.lerpVectors(
        state.startPosition,
        cameraPos,
        easedT
      )

      // Only animate target if not tracking a folder
      if (!folderLookAt) {
        controlsRef.current.target.lerpVectors(
          state.startTarget,
          cameraTarget,
          easedT
        )
      }

      // End animation when complete
      if (t >= 1) {
        state.isAnimating = false
      }
    }

    // Priority 2: Update folder tracking after position is updated
    if (folderLookAt) {
      controlsRef.current.target.lerp(folderLookAt, 0.1)
    }

    controlsRef.current.update()
  })

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0.75, 2]} // Use default values, will be updated in useFrame
        fov={50}
      />
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
      {stats && <Stats showPanel={0} />}
    </>
  )
}
