import React, { Suspense, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  MeshReflectorMaterial,
  Float,
  Text,
  Sparkles,
  ScrollControls,
  Preload,
  AdaptiveDpr,
} from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

function Loader() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1200)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`loader ${hidden ? 'hidden' : ''}`}>
      <div>BOOTING RETRO 3D LAB…</div>
      <div className="loader-bar" />
      <div style={{ fontSize: 12, opacity: 0.7 }}>loading shaders · warmup GPU</div>
    </div>
  )
}

function Scene() {
  return (
    <>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
        <RetroComputer position={[-2.4, 0, 0]} rotation={[0, 0.35, 0]} label="AMIGA" color="#ffb347" />
        <RetroComputer position={[0, 0, 0]} rotation={[0, 0, 0]} label="C64" color="#ff2bd6" />
        <RetroComputer position={[2.4, 0, 0]} rotation={[0, -0.35, 0]} label="IBM PC" color="#00f0ff" />
      </Float>

      <Sparkles count={120} scale={[14, 6, 8]} size={2.2} speed={0.3} color="#7df0ff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          blur={[260, 90]}
          resolution={1024}
          mixBlur={1.2}
          mixStrength={3.2}
          roughness={0.85}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#150828"
          metalness={0.65}
          mirror={0.4}
        />
      </mesh>

      <GridFloor />

      <FloatingLabel text="★ RETRO 3D LAB ★" position={[0, 3.2, -2.5]} />

      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={14}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate
        autoRotateSpeed={0.6}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  )
}

function RetroComputer({ position, rotation, label, color }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[1.6, 1.1, 1.2]} />
        <meshStandardMaterial color="#1a1a22" metalness={0.75} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.11, 0]} castShadow>
        <boxGeometry args={[1.62, 0.04, 1.22]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.75, 0.62]}>
        <boxGeometry args={[1.2, 0.7, 0.04]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0, 0.75, 0.641]}>
        <planeGeometry args={[1.12, 0.62]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.07, 0.85]}>
        <boxGeometry args={[1.4, 0.08, 0.55]} />
        <meshStandardMaterial color="#0d0d12" metalness={0.5} roughness={0.6} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[-0.6 + i * 0.11, 0.115, 0.85]}>
          <boxGeometry args={[0.08, 0.01, 0.08]} />
          <meshStandardMaterial color="#e6e6e6" emissive="#222" />
        </mesh>
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`s${i}`} position={[-0.6 + i * 0.45, 0.115, 1.05]}>
          <boxGeometry args={[0.35, 0.012, 0.08]} />
          <meshStandardMaterial color="#cfcfcf" />
        </mesh>
      ))}
      <mesh position={[0.7, 1.12, 0.61]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <pointLight position={[0.7, 1.18, 0.61]} intensity={0.3} color={color} distance={1.5} />
      <Text
        position={[0, 0.32, 0.625]}
        fontSize={0.09}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#000"
      >
        {label}
      </Text>
    </group>
  )
}

function GridFloor() {
  const grid = useRef()
  useFrame((_, delta) => {
    if (grid.current) {
      grid.current.position.z = (grid.current.position.z + delta * 0.2) % 1
    }
  })
  return (
    <group ref={grid} position={[0, -0.59, 0]}>
      <gridHelper args={[40, 40, '#ff2bd6', '#3a1466']} />
    </group>
  )
}

function FloatingLabel({ text, position }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.15
    }
  })
  return (
    <Text
      ref={ref}
      position={position}
      fontSize={0.5}
      color="#ff2bd6"
      outlineWidth={0.02}
      outlineColor="#00f0ff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  )
}

function App() {
  return (
    <>
      <Loader />
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [4.5, 3, 6.5], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <color attach="background" args={['#0a0420']} />
        <fog attach="fog" args={['#0a0420', 12, 35]} />

        <ambientLight intensity={0.35} />
        <hemisphereLight args={['#7df0ff', '#3b0066', 0.4]} />
        <directionalLight position={[6, 8, 4]} intensity={1.6} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <pointLight position={[-4, 2, -2]} intensity={2} color="#ff2bd6" distance={14} />
        <pointLight position={[3, 1, -3]} intensity={2.4} color="#00f0ff" distance={12} />

        <Suspense fallback={null}>
          <ScrollControls pages={1} damping={0.25}>
            <Scene />
          </ScrollControls>
          <Environment preset="night" />
          <Preload all />
        </Suspense>

        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom mipmapBlur intensity={1.4} luminanceThreshold={0.15} luminanceSmoothing={0.6} />
          <ChromaticAberration offset={[0.0008, 0.0008]} blendFunction={BlendFunction.NORMAL} />
          <Noise opacity={0.06} />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>

        <AdaptiveDpr pixelated />
      </Canvas>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
