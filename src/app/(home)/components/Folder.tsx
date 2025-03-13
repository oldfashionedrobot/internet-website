import React, { useState, useRef } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Group, MathUtils, Vector3 } from 'three'
import { Text, useCursor } from '@react-three/drei'

export type FolderProps = {
  width: number
  height: number
  thickness?: number
  tabName: string
  color?: string
  index: number
  totalFolders?: number
  isActive?: boolean
  isInteractive?: boolean
  onClick?: (position: Vector3, isOpening: boolean) => void
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
  isInteractive = true,
  onClick = () => {},
  position = [0, 0, 0]
}: FolderProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [opened, setOpened] = useState(false)
  const hoverOffset = 0.01
  const animationProgress = useRef(0)

  // Target positions for different animation phases when opening:
  // We'll use these for calculating bezier-like curved paths
  const keyPoints = useRef({
    initial: new Vector3(...position),
    up: new Vector3(position[0], position[1] + 0.35, position[2]),
    forward: new Vector3(position[0], position[1] + 0.35, position[2] + 0.4),
    final: new Vector3(0, position[1] + 0.25, position[2] + 0.6)
  })

  // This automatically handles the cursor changes
  useCursor(hovered)

  // Animation function that uses easing for curved motion
  const easeInOutQuad = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

  useFrame(() => {
    if (!groupRef.current) return

    // Animation state
    const { current: folder } = groupRef
    const progress = animationProgress.current

    if (opened) {
      // Increment animation progress
      if (progress < 1) {
        animationProgress.current = Math.min(1, progress + 0.02)
      }

      // Calculate position based on animation phase
      const targetPos = new Vector3(...position)
      let targetRotY = 0
      let targetRotX = 0

      if (progress < 0.4) {
        // Phase 1: Move up
        const phaseProgress = progress / 0.4
        targetPos.lerpVectors(
          keyPoints.current.initial,
          keyPoints.current.up,
          easeInOutQuad(phaseProgress)
        )
      } else if (progress < 0.7) {
        // Phase 2: Move forward with rotation
        const phaseProgress = (progress - 0.4) / 0.3
        targetPos.lerpVectors(
          keyPoints.current.up,
          keyPoints.current.forward,
          easeInOutQuad(phaseProgress)
        )
        targetRotY = Math.PI * easeInOutQuad(phaseProgress)
        targetRotX = -0.1 * easeInOutQuad(phaseProgress)
      } else {
        // Phase 3: Move to final position
        const phaseProgress = (progress - 0.7) / 0.3
        targetPos.lerpVectors(
          keyPoints.current.forward,
          keyPoints.current.final,
          easeInOutQuad(phaseProgress)
        )
        targetRotY = Math.PI
        targetRotX = -0.1
      }

      // Apply position and rotation with smooth lerping
      folder.position.lerp(targetPos, 0.15)
      folder.rotation.y = MathUtils.lerp(folder.rotation.y, targetRotY, 0.15)
      folder.rotation.x = MathUtils.lerp(folder.rotation.x, targetRotX, 0.15)

      // Update folder world position for camera tracking
      const worldPosition = new Vector3()
      folder.getWorldPosition(worldPosition)
      onClick(worldPosition, true)
    } else {
      // Closing animation - simplified
      if (progress > 0) {
        animationProgress.current = Math.max(0, progress - 0.03)

        // Simply reverse the animation path
        const targetPos = new Vector3(...position)
        let targetRotY = 0
        let targetRotX = 0

        if (progress > 0.7) {
          // Phase 3 in reverse
          const phaseProgress = (1 - progress) / 0.3
          targetPos.lerpVectors(
            keyPoints.current.final,
            keyPoints.current.forward,
            easeInOutQuad(phaseProgress)
          )
          targetRotY = Math.PI
          targetRotX = -0.1
        } else if (progress > 0.4) {
          // Phase 2 in reverse
          const phaseProgress = (0.7 - progress) / 0.3
          targetPos.lerpVectors(
            keyPoints.current.forward,
            keyPoints.current.up,
            easeInOutQuad(phaseProgress)
          )
          targetRotY = Math.PI * (1 - easeInOutQuad(phaseProgress))
          targetRotX = -0.1 * (1 - easeInOutQuad(phaseProgress))
        } else {
          // Phase 1 in reverse
          const phaseProgress = (0.4 - progress) / 0.4
          targetPos.lerpVectors(
            keyPoints.current.up,
            keyPoints.current.initial,
            easeInOutQuad(phaseProgress)
          )
        }

        folder.position.lerp(targetPos, 0.15)
        folder.rotation.y = MathUtils.lerp(folder.rotation.y, targetRotY, 0.08)
        folder.rotation.x = MathUtils.lerp(folder.rotation.x, targetRotX, 0.08)
      } else {
        // Handle hover effect when fully closed
        const targetY = hovered ? position[1] + hoverOffset : position[1]
        folder.position.lerp(
          new Vector3(position[0], targetY, position[2]),
          0.15
        )
      }
    }
  })

  // Handle click to toggle opened state
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    // Only process clicks if interactive
    if (!isInteractive) return

    e.stopPropagation()
    const newOpenState = !opened
    setOpened(newOpenState)

    // Reset animation when changing state
    if (newOpenState) {
      animationProgress.current = 0
    }

    // Get folder's center position for camera targeting
    const folderCenter = new Vector3()
    if (groupRef.current) {
      groupRef.current.getWorldPosition(folderCenter)
    }

    // Call the parent's onClick with the center position and opened state
    onClick(folderCenter, newOpenState)
  }

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
        if (!isInteractive) return
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={(e) => {
        if (!isInteractive) return
        e.stopPropagation()
        setHovered(false)
      }}
      onClick={handleClick}
      // Make non-interactive folders visually distinct
      // and disable pointer events entirely
      style={{
        pointerEvents: isInteractive ? 'auto' : 'none',
        opacity: isInteractive ? 1 : 0.7
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
