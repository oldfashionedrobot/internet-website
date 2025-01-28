'use client'
import PageWrapper from '@components/PageWrapper'
import { Canvas } from '@react-three/fiber'
import { Box } from './Box'

export default function ThreeDeePage() {
  return (
    <PageWrapper title="3D">
      <div className="w-full h-[500px] bg-gray-light">
        <Canvas>
          <ambientLight intensity={Math.PI / 2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </Canvas>
      </div>
    </PageWrapper>
  )
}
