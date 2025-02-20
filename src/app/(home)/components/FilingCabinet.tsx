import { useState } from 'react'
import { Drawer } from './Drawer'
import { Vector3 } from 'three'

/**
 * FilingCabinet Component
 *
 * Builds the cabinet frame from separate panels (back, left, right, top, bottom) and
 * lays out three Drawer components in the front opening. Only one drawer can be open at a time.
 */
type FilingCabinetProps = {
  onDrawerToggle: (target: Vector3, cameraPos: Vector3) => void
}

export function FilingCabinet({ onDrawerToggle }: FilingCabinetProps) {
  // Cabinet overall dimensions
  const cabinetWidth = 0.8 // meters
  const cabinetHeight = 1.5 // a bit shorter than an average person
  const cabinetDepth = 0.6

  // Thickness for the panels that form the cabinet frame
  const panelThickness = 0.05

  // Vertical layout settings for the drawers
  const bottomPadding = 0.1
  const topPadding = 0.05
  // Height for the separator between drawers
  const separatorHeight = 0.02
  // Compute each drawer's height so that three drawers plus two separators fill the front area.
  const drawerHeight =
    (cabinetHeight - bottomPadding - topPadding - 2 * separatorHeight) / 3
  const drawerWidth = cabinetWidth - 2 * panelThickness

  // Compute the vertical centers for each drawer.
  const drawersY = [0, 1, 2].map(
    (i) =>
      bottomPadding + drawerHeight / 2 + i * (drawerHeight + separatorHeight)
  )

  // Compute the Y positions for two separators (between drawers)
  const separatorYs = [
    bottomPadding + drawerHeight + separatorHeight / 2,
    bottomPadding + 2 * drawerHeight + 1.5 * separatorHeight
  ]

  // Depth for each drawer's body (cavity)
  const drawerDepth = 0.6

  const drawerLabels = ['Misc.', 'Stuff', 'Things']

  // Keep track of which drawer (if any) is open.
  const [openDrawer, setOpenDrawer] = useState<number | null>(null)

  // Toggle logic: clicking a drawer opens it (and closes any other) or closes it if already open.
  const handleDrawerClick = (index: number) => {
    setOpenDrawer((prev) => {
      const newOpen = prev === index ? null : index

      if (newOpen !== null) {
        // When a drawer is open, aim the camera to look downward into the drawer.
        // For example, set the target a little lower (drawer center - 0.1 in Y)
        // and raise the camera position (drawer center + 0.3 in Y) so it angles downward.
        onDrawerToggle(
          new Vector3(0, drawersY[index] - 0.2, 0),
          new Vector3(0, drawersY[index] + 0.4, 0.5)
        )
      } else {
        // Reset to the cabinet's default view.
        onDrawerToggle(
          new Vector3(0, cabinetHeight / 2, -cabinetDepth / 2),
          new Vector3(0, 0.75, 2)
        )
      }

      return newOpen
    })
  }

  // Sample folder configuration for each drawer.
  const sampleFolders = [
    { tabName: 'Folder 1', color: '#ff6347' },
    { tabName: 'Folder 2', color: '#4682b4' },
    { tabName: 'Folder 3', color: '#32cd32' }
  ]

  return (
    <group>
      {/* Cabinet frame built from separate panels */}
      <group>
        {/* Back Panel */}
        <mesh
          receiveShadow
          position={[0, cabinetHeight / 2, -cabinetDepth + panelThickness / 2]}
        >
          <boxGeometry args={[cabinetWidth, cabinetHeight, panelThickness]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.6}
            roughness={0.9}
          />
        </mesh>
        {/* Left Panel */}
        <mesh
          receiveShadow
          position={[
            -cabinetWidth / 2 + panelThickness / 2,
            cabinetHeight / 2,
            -cabinetDepth / 2
          ]}
        >
          <boxGeometry args={[panelThickness, cabinetHeight, cabinetDepth]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.6}
            roughness={0.9}
          />
        </mesh>
        {/* Right Panel */}
        <mesh
          receiveShadow
          position={[
            cabinetWidth / 2 - panelThickness / 2,
            cabinetHeight / 2,
            -cabinetDepth / 2
          ]}
        >
          <boxGeometry args={[panelThickness, cabinetHeight, cabinetDepth]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.6}
            roughness={0.9}
          />
        </mesh>
        {/* Top Panel */}
        <mesh
          receiveShadow
          position={[0, cabinetHeight - panelThickness / 2, -cabinetDepth / 2]}
        >
          <boxGeometry args={[cabinetWidth, panelThickness, cabinetDepth]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.6}
            roughness={0.9}
          />
        </mesh>
        {/* Bottom Panel */}
        <mesh
          receiveShadow
          position={[0, bottomPadding / 2, -cabinetDepth / 2]}
        >
          <boxGeometry args={[cabinetWidth, bottomPadding, cabinetDepth]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.6}
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* Drawers positioned in the open front area */}
      <group>
        {drawersY.map((y, i) => (
          <Drawer
            key={i}
            isOpen={openDrawer === i}
            onClick={() => handleDrawerClick(i)}
            position={[0, y, 0]}
            width={drawerWidth}
            height={drawerHeight}
            depth={drawerDepth}
            label={drawerLabels[i]}
            colorIndex={i}
            folders={sampleFolders}
          />
        ))}
      </group>

      {/* Separators between drawers */}
      {separatorYs.map((separatorY, i) => (
        <mesh
          key={`separator-${i}`}
          position={[0, separatorY, 0.002]}
          receiveShadow
        >
          <planeGeometry args={[drawerWidth, separatorHeight]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.6}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}
