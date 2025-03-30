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
  onFolderOpen: (
    target: Vector3,
    cameraPos: Vector3,
    folderCenter: Vector3 | null
  ) => void
}

export function FilingCabinet({
  onDrawerToggle,
  onFolderOpen
}: FilingCabinetProps) {
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

  // Keep track of which drawer (if any) is open
  const [openDrawer, setOpenDrawer] = useState<number | null>(null)

  // Track if any folder is currently open
  const [isFolderOpen, setIsFolderOpen] = useState(false)

  // Track active folder id
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)

  // Simplified view functions to reduce duplication and improve organization
  const getCabinetView = () => ({
    target: new Vector3(0, cabinetHeight / 2, -cabinetDepth / 2),
    position: new Vector3(0, 0.75, 2)
  })

  const getDrawerView = (drawerIndex: number) => {
    const y = drawersY[drawerIndex]
    return {
      target: new Vector3(0, y - 0.1, 0),
      position: new Vector3(0, y + 0.4, 0.5)
    }
  }

  const getFolderView = (drawerIndex: number) => {
    const y = drawersY[drawerIndex]
    return {
      target: new Vector3(0, y + 0.2, 0.2),
      position: new Vector3(1.2, y + 0.7, 1.8)
    }
  }

  // Simplified drawer click handler
  const handleDrawerClick = (index: number) => {
    // Don't allow drawer actions when a folder is open
    if (isFolderOpen) return

    const newOpen = openDrawer === index ? null : index
    setOpenDrawer(newOpen)

    // Apply the appropriate camera view
    const view = newOpen !== null ? getDrawerView(index) : getCabinetView()
    onDrawerToggle(view.target, view.position)
  }

  // Simplified folder open handler
  const handleFolderOpen = (
    position: Vector3,
    isOpening: boolean,
    folderId: string
  ) => {
    setIsFolderOpen(isOpening)
    setActiveFolderId(isOpening ? folderId : null)

    const drawerIndex = openDrawer !== null ? openDrawer : 0

    if (isOpening) {
      // Move camera to folder view while enabling folder tracking
      const view = getFolderView(drawerIndex)
      onFolderOpen(view.target, view.position, position)
    } else {
      // When closing folder, return to drawer view if drawer is open
      const view =
        openDrawer !== null ? getDrawerView(drawerIndex) : getCabinetView()
      onFolderOpen(view.target, view.position, null)
    }
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
            activeFolderId={activeFolderId}
            onFolderOpen={handleFolderOpen}
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
