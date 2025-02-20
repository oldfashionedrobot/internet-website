import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import { Text } from '@react-three/drei'

export type FolderProps = {
  width: number
  height: number
  thickness?: number
  tabName: string
  color?: string
  index: number
  totalFolders?: number
  onClick?: () => void
  position?: [number, number, number]
}

export function Folder({
  width,
  height,
  thickness = 0.02,
  tabName,
  color = '#FCEBB6',
  index,
  totalFolders,
  onClick = () => {},
  position = [0, 0, 0]
}: FolderProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const baseY = 0
  const hoverOffset = 0.02

  useFrame(() => {
    if (groupRef.current) {
      const currentY = groupRef.current.position.y
      const targetY = hovered ? baseY + hoverOffset : baseY
      groupRef.current.position.y = MathUtils.lerp(currentY, targetY, 0.1)
    }
  })

  // Folder body dimensions
  const folderBodyWidth = width
  const folderBodyHeight = height
  const folderBodyDepth = thickness

  // Tab dimensions
  const tabWidth = folderBodyWidth * 0.4
  const tabHeight = folderBodyHeight * 0.15
  const tabDepth = 0.005

  // Compute horizontal position for the tab.
  // If multiple folders exist, linearly interpolate from left to right edge.
  let tabPosX = 0
  if (totalFolders && totalFolders > 1) {
    // Calculate starting and ending x positions ensuring the tab doesn't run off the folder's edges.
    const start = -folderBodyWidth / 2 + tabWidth / 2
    const end = folderBodyWidth / 2 - tabWidth / 2
    const t = index / (totalFolders - 1)
    tabPosX = start + t * (end - start)
  }

  // Position the tab along the top of the folder.
  const tabPosY = folderBodyHeight / 2 + tabHeight / 2
  const tabPosZ = 0

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* Folder Body */}
      <mesh castShadow>
        <boxGeometry
          args={[folderBodyWidth, folderBodyHeight, folderBodyDepth]}
        />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Folder Tab with Text */}
      <group position={[tabPosX, tabPosY, tabPosZ]}>
        <mesh castShadow>
          <boxGeometry args={[tabWidth, tabHeight, tabDepth]} />
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
        </mesh>
        <Text
          position={[0, 0, tabDepth / 2 + 0.002]}
          fontSize={0.03}
          font="/Schoolbell-Regular.ttf"
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {tabName}
        </Text>
      </group>
    </group>
  )
}
