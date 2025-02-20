import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { Folder } from './Folder'

export type FolderConfig = {
  tabName: string
  color: string
}

export type DrawerProps = {
  isOpen: boolean
  onClick: () => void
  position: [number, number, number]
  width: number
  height: number
  depth: number
  label: string
  // Optional prop to manually choose the post-it note color by index
  colorIndex?: number
  // New prop: an array of folder configurations
  folders?: FolderConfig[]
}

const openDistance = 0.35

// Define a set of post-it note style colors.
const noteColors = ['#FFF9C4', '#FFCDD2', '#BBDEFB', '#DCEDC8'] as const

export function Drawer({
  isOpen,
  onClick,
  position,
  width,
  height,
  depth,
  label,
  colorIndex,
  folders = []
}: DrawerProps) {
  const drawerGroupRef = useRef<Group>(null)
  const wallThickness = 0.02
  const faceThickness = 0.01

  useFrame(() => {
    if (drawerGroupRef.current) {
      const target = isOpen ? openDistance : 0
      drawerGroupRef.current.position.z = MathUtils.lerp(
        drawerGroupRef.current.position.z,
        target,
        0.05
      )
    }
  })

  // Label plate dimensions and positioning
  const plateWidth = Math.min(width * 0.3, 0.15)
  const plateHeight = Math.min(height * 0.2, 0.1)
  const plateDepth = 0.005
  const plateY = height / 3

  // Choose a color for the label plate.
  const labelPlateColor = useMemo(() => {
    if (typeof colorIndex === 'number') {
      return noteColors[colorIndex % noteColors.length]
    }
    const randomIndex = Math.floor(Math.random() * noteColors.length)
    return noteColors[randomIndex]
  }, [colorIndex])

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <group ref={drawerGroupRef}>
        {/* Drawer Body: open-top container built from four panels */}
        <group>
          {/* Bottom Panel – rotated to lie in the XZ plane */}
          <mesh
            position={[0, -height / 2 + wallThickness / 2, -depth / 2]}
            rotation={[-Math.PI / 2, 0, 0]}
            castShadow
          >
            <planeGeometry args={[width, depth]} />
            <meshStandardMaterial
              color="#666666"
              metalness={0.3}
              roughness={1}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Left Panel – rotated so its normal faces right */}
          <mesh
            position={[-width / 2 + wallThickness / 2, 0, -depth / 2]}
            rotation={[0, Math.PI / 2, 0]}
            castShadow
          >
            <planeGeometry args={[depth, height - wallThickness]} />
            <meshStandardMaterial
              color="#666666"
              metalness={0.3}
              roughness={1}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Right Panel – rotated so its normal faces left */}
          <mesh
            position={[width / 2 - wallThickness / 2, 0, -depth / 2]}
            rotation={[0, -Math.PI / 2, 0]}
            castShadow
          >
            <planeGeometry args={[depth, height - wallThickness]} />
            <meshStandardMaterial
              color="#666666"
              metalness={0.3}
              roughness={1}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Back Panel – rotated 180° so its front is visible */}
          <mesh
            position={[0, 0, -depth + wallThickness / 2]}
            rotation={[0, Math.PI, 0]}
            castShadow
          >
            <planeGeometry args={[width, height - wallThickness]} />
            <meshStandardMaterial
              color="#666666"
              metalness={0.3}
              roughness={1}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Folders inside the drawer body */}
          {folders && folders.length > 0 && (
            <group>
              {folders.map((folderConfig, idx) => (
                <Folder
                  key={idx}
                  width={width * 0.9} // 90% of the drawer width for the folder body
                  height={height * 0.6} // a fraction of the drawer height
                  thickness={0.02}
                  tabName={folderConfig.tabName}
                  // color={folderConfig.color}
                  index={idx}
                  totalFolders={folders.length} // Pass total folders for even distribution
                  // Adjust the z position so folders start further back inside the cavity
                  position={[0, 0, -0.15 - idx * 0.045]}
                  onClick={() => {
                    // Stubbed onClick: Future logic to animate the folder out can be added here.
                  }}
                />
              ))}
            </group>
          )}
        </group>

        {/* Drawer Face – the hit area for clicks */}
        <mesh
          position={[0, 0, faceThickness / 2]}
          castShadow
          // Stop pointer down and over events from affecting objects behind
          onPointerDown={(e) => e.stopPropagation()}
          onPointerOver={(e) => e.stopPropagation()}
        >
          <boxGeometry args={[width, height, faceThickness]} />
          <meshStandardMaterial
            color="#aaaaaa"
            metalness={0.7}
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Drawer Handle */}
        <mesh position={[width / 2 - 0.1, 0, faceThickness + 0.005]} castShadow>
          <boxGeometry args={[0.05, 0.05, 0.01]} />
          <meshStandardMaterial
            color="#222222"
            metalness={0.3}
            roughness={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Label Plate with Text */}
        <group position={[0, plateY, faceThickness + 0.002]}>
          <mesh castShadow>
            <boxGeometry args={[plateWidth, plateHeight, plateDepth]} />
            <meshStandardMaterial
              color={labelPlateColor}
              metalness={0.3}
              roughness={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Text
            position={[0, 0, plateDepth / 2 + 0.002]}
            fontSize={0.04}
            font="/Schoolbell-Regular.ttf"
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </group>
      </group>
    </group>
  )
}
