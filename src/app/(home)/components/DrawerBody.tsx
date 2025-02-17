import React from 'react'
import { BoxGeometry, MeshStandardMaterial } from 'three'
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
  const geometry = new BoxGeometry(width, height, depth)

  const materials = [
    new MeshStandardMaterial({
      color: '#666666',
      metalness: 0.3,
      roughness: 1,
      side: THREE.DoubleSide
    }),
    new MeshStandardMaterial({
      color: '#666666',
      metalness: 0.3,
      roughness: 1,
      side: THREE.DoubleSide
    }),
    new MeshStandardMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    }),
    new MeshStandardMaterial({
      color: '#666666',
      metalness: 0.3,
      roughness: 1,
      side: THREE.DoubleSide
    }),
    new MeshStandardMaterial({
      color: '#666666',
      metalness: 0.3,
      roughness: 1,
      side: THREE.DoubleSide
    }),
    new MeshStandardMaterial({
      color: '#666666',
      metalness: 0.3,
      roughness: 1,
      side: THREE.DoubleSide
    })
  ]

  return <mesh geometry={geometry} material={materials} castShadow />
}
