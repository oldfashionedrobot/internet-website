import { ThreeElements } from '@react-three/fiber'
import { useRef } from 'react'
import { Mesh } from 'three'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { memo } from 'react'

type Props = {
  position: [number, number, number]
  color?: string
}

export const GummyBear = memo(function GummyBear({
  position,
  color = '#ff6b81'
}: Props & ThreeElements['mesh']) {
  const ref = useRef<Mesh>(null)

  return (
    <group position={[position[0], 0.05, position[2]]}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <MeshTransmissionMaterial
          samples={2}
          thickness={0.8}
          chromaticAberration={0.5}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0.0}
          roughness={0}
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <MeshTransmissionMaterial
          samples={2}
          thickness={0.8}
          chromaticAberration={0.5}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0.0}
          roughness={0}
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
        />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.2, 0.9, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <MeshTransmissionMaterial
          samples={2}
          thickness={0.8}
          chromaticAberration={0.5}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0.0}
          roughness={0}
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
        />
      </mesh>
      <mesh position={[0.2, 0.9, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <MeshTransmissionMaterial
          samples={2}
          thickness={0.8}
          chromaticAberration={0.5}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0.0}
          roughness={0}
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.3, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <capsuleGeometry args={[0.08, 0.2, 8, 16]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.8}
          chromaticAberration={0.5}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0.0}
          roughness={0}
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
        />
      </mesh>
      <mesh position={[0.3, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.08, 0.2, 8, 16]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.8}
          chromaticAberration={0.5}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0.0}
          roughness={0}
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
        />
      </mesh>
    </group>
  )
})
