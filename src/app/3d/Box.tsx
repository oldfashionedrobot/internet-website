'use client'
import { useFrame, Vector3 } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh } from 'three'

export function Box(props: { position: Vector3 }) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(null)
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((_state, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta
  })
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}
