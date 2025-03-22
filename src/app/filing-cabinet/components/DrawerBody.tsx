import React from 'react'
import * as THREE from 'three'

export function DrawerBody({
  width,
  height,
  depth
}: {
  width: number
  height: number
  depth: number
}) {
  // Create geometry and materials only once
  const geometry = React.useMemo(
    () => new THREE.BoxGeometry(width, height, depth),
    [width, height, depth]
  )

  // Create array of materials with top face transparent
  const materials = React.useMemo(() => {
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: '#666666',
      metalness: 0.3,
      roughness: 1,
      side: THREE.DoubleSide
    })

    const topMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })

    // Return materials array with top face transparent (index 2)
    return [
      sideMaterial, // Right
      sideMaterial, // Left
      topMaterial, // Top
      sideMaterial, // Bottom
      sideMaterial, // Front
      sideMaterial // Back
    ]
  }, [])

  return <mesh geometry={geometry} material={materials} castShadow />
}
