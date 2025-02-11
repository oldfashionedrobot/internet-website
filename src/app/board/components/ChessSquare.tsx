import { ThreeElements } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'

type Props = {
  position: [number, number, number]
  isWhite: boolean
}

export function ChessSquare({
  position,
  isWhite
}: Props & ThreeElements['mesh']) {
  const ref = useRef<Mesh<BoxGeometry, MeshStandardMaterial>>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const baseColor = isWhite ? '#ffffff' : '#4285f4'
  const hoverColor = isWhite ? '#f3f3f3' : '#2b5797'
  const clickedColor = '#ff00ff' // magenta

  return (
    <mesh
      position={position}
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial
        color={clicked ? clickedColor : hovered ? hoverColor : baseColor}
      />
    </mesh>
  )
}
