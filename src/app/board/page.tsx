'use client'
import PageWrapper from '@shared/components/PageWrapper'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ChessSquare } from './components/ChessSquare'
import { GummyBear } from './components/Pawn'
import { useControls } from 'leva'

export default function BoardPage() {
  const {
    ambientIntensity,
    spotlightIntensity,
    pointLight1Intensity,
    pointLight2Intensity,
    sunlightIntensity,
    sunPosition
  } = useControls({
    ambientIntensity: {
      value: 0.6,
      min: 0,
      max: 2,
      step: 0.1,
      label: 'Ambient Light'
    },
    spotlightIntensity: {
      value: 2,
      min: 0,
      max: 5,
      step: 0.1,
      label: 'Spotlight'
    },
    pointLight1Intensity: {
      value: 1.5,
      min: 0,
      max: 3,
      step: 0.1,
      label: 'Pink Point Light'
    },
    pointLight2Intensity: {
      value: 1.5,
      min: 0,
      max: 3,
      step: 0.1,
      label: 'Blue Point Light'
    },
    sunlightIntensity: {
      value: 1,
      min: 0,
      max: 3,
      step: 0.1,
      label: 'Sunlight'
    },
    sunPosition: {
      value: { x: 10, y: 10, z: 10 },
      step: 1,
      label: 'Sun Position'
    }
  })

  return (
    <PageWrapper title="Board">
      <div className="w-full h-[500px] bg-gray-light">
        <Canvas
          camera={{ position: [0, 5, 10], fov: 45 }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          {/* Lighting setup with controls */}
          <ambientLight intensity={ambientIntensity} />

          <spotLight
            position={[5, 8, 0]}
            angle={0.4}
            penumbra={1}
            intensity={spotlightIntensity}
            color="#fff5b6"
          />

          <pointLight
            position={[-5, 5, -5]}
            intensity={pointLight1Intensity}
            color="#ff9eb1"
          />

          <pointLight
            position={[5, 3, 5]}
            intensity={pointLight2Intensity}
            color="#b6e3ff"
          />

          {/* New directional sunlight */}
          <directionalLight
            position={[sunPosition.x, sunPosition.y, sunPosition.z]}
            intensity={sunlightIntensity}
            color="#ffffff"
            castShadow
          />

          {/* Chess board */}
          {Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => {
              const isWhite = (row + col) % 2 === 0
              return (
                <ChessSquare
                  key={`${row}-${col}`}
                  position={[col - 3.5, 0, row - 3.5]}
                  isWhite={isWhite}
                />
              )
            })
          )}

          {/* Gummy Bears */}
          <GummyBear position={[0.5, 0, 2.5]} color="#ff6b81" />
          <GummyBear position={[-1.5, 0, 1.5]} color="#42c2ff" />
          <GummyBear position={[2.5, 0, -0.5]} color="#98ff98" />
          <GummyBear position={[-2.5, 0, -2.5]} color="#ffb347" />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
        </Canvas>
      </div>
    </PageWrapper>
  )
}
