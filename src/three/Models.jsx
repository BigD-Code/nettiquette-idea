import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, AccumulativeShadows, RandomizedLight, useTexture, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

/* ============================================================
   PROCEDURAL TEXTURES (real CanvasTexture data, generated at runtime)
   ============================================================ */

function makeCRTTexture(faceColor = '#7df0ff', label = 'AMIGA') {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 384
  const g = c.getContext('2d')

  // background dark
  g.fillStyle = '#000'
  g.fillRect(0, 0, 512, 384)

  // phosphor glow gradient
  const grad = g.createRadialGradient(256, 192, 30, 256, 192, 360)
  grad.addColorStop(0, faceColor)
  grad.addColorStop(0.5, faceColor + '88')
  grad.addColorStop(1, '#000')
  g.fillStyle = grad
  g.fillRect(0, 0, 512, 384)

  // scanlines
  g.globalAlpha = 0.25
  g.fillStyle = '#000'
  for (let y = 0; y < 384; y += 3) g.fillRect(0, y, 512, 1)
  g.globalAlpha = 1

  // text label
  g.font = 'bold 28px monospace'
  g.fillStyle = faceColor
  g.textAlign = 'center'
  g.shadowColor = faceColor
  g.shadowBlur = 12
  g.fillText(label, 256, 200)
  g.shadowBlur = 0

  // fake "prompt" lines
  g.font = '16px monospace'
  g.fillText('> READY.', 256, 250)
  g.fillText('> 640 x 256 PIXELS', 256, 280)

  // CRT curvature reflection
  const refl = g.createRadialGradient(120, 80, 5, 120, 80, 220)
  refl.addColorStop(0, 'rgba(255,255,255,0.25)')
  refl.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = refl
  g.fillRect(0, 0, 512, 384)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function makePlasticTexture(base = '#c4c8d0') {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = base
  g.fillRect(0, 0, 512, 512)

  // subtle noise
  const img = g.getImageData(0, 0, 512, 512)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n))
    img.data[i+1] = Math.max(0, Math.min(255, img.data[i+1] + n))
    img.data[i+2] = Math.max(0, Math.min(255, img.data[i+2] + n))
  }
  g.putImageData(img, 0, 0)

  // brushed horizontal lines (light)
  g.globalAlpha = 0.06
  g.fillStyle = '#000'
  for (let y = 0; y < 512; y += 2) g.fillRect(0, y, 512, 1)
  g.globalAlpha = 1

  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeKeyboardTexture() {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#1a1a22'
  g.fillRect(0, 0, 512, 256)

  // keys
  const keys = 'qwertyuiopasdfghjklzxcvbnm'.split('')
  const cols = 10, rows = 3
  const keyW = 38, keyH = 38, gap = 6
  const startX = (512 - cols * (keyW + gap) + gap) / 2
  const startY = (256 - rows * (keyH + gap) + gap) / 2
  for (let r = 0; r < rows; r++) {
    for (let cIdx = 0; cIdx < cols; cIdx++) {
      const idx = r * cols + cIdx
      if (idx >= keys.length) break
      const x = startX + cIdx * (keyW + gap)
      const y = startY + r * (keyH + gap)
      g.fillStyle = '#e8e8e8'
      g.fillRect(x, y, keyW, keyH)
      g.fillStyle = '#888'
      g.fillRect(x, y + keyH - 4, keyW, 4) // shadow
      g.fillStyle = '#222'
      g.font = 'bold 16px monospace'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.fillText(keys[idx].toUpperCase(), x + keyW/2, y + keyH/2)
    }
  }

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeCircuitTexture() {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#0a3d0a'
  g.fillRect(0, 0, 256, 256)

  // traces
  g.strokeStyle = '#1f6b1f'
  g.lineWidth = 2
  for (let i = 0; i < 30; i++) {
    g.beginPath()
    let x = Math.random() * 256, y = Math.random() * 256
    g.moveTo(x, y)
    for (let s = 0; s < 5; s++) {
      if (Math.random() > 0.5) x += (Math.random() - 0.5) * 80
      else y += (Math.random() - 0.5) * 80
      g.lineTo(x, y)
    }
    g.stroke()
  }

  // pads
  g.fillStyle = '#c9b778'
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 256, y = Math.random() * 256
    g.beginPath(); g.arc(x, y, 3, 0, Math.PI * 2); g.fill()
  }

  // chips
  g.fillStyle = '#1a1a22'
  g.fillRect(60, 60, 50, 50)
  g.fillRect(140, 140, 50, 50)
  g.fillStyle = '#888'
  g.font = '8px monospace'
  g.fillText('MOS', 65, 75)
  g.fillText('6502', 65, 90)
  g.fillText('SID', 145, 165)
  g.fillText('6581', 145, 180)

  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const TEXTURE_CACHE = {}
function getTexture(key, fn) {
  if (!TEXTURE_CACHE[key]) TEXTURE_CACHE[key] = fn()
  return TEXTURE_CACHE[key]
}

/* ============================================================
   COMPUTER MODELS — realistic vintage machines
   ============================================================ */

export function VintageComputer({ type = 'a500', color = { case: '#c4c8d0', accent: '#ffb347', screen: '#00f0ff' }, label = 'AMIGA' }) {
  switch (type) {
    case 'a500': return <Amiga500 color={color} label={label} />
    case 'a1200': return <Amiga1200 color={color} label={label} />
    case 'c64': return <C64 color={color} label={label} />
    case 'c128': return <C128 color={color} label={label} />
    case 'macse': return <MacSE color={color} label={label} />
    case 'atarist': return <AtariST color={color} label={label} />
    case 'iigs': return <AppleIIGS color={color} label={label} />
    case 'ibm': return <IBMPC color={color} label={label} />
    default: return <Amiga500 color={color} label={label} />
  }
}

function Amiga500({ color, label }) {
  const caseTex = useMemo(() => getTexture('case-' + color.case, () => makePlasticTexture(color.case)), [color.case])
  const kbdTex = useMemo(() => getTexture('kbd-amiga', () => makeKeyboardTexture()), [])
  const screenTex = useMemo(() => getTexture('crt-' + label + color.screen, () => makeCRTTexture(color.screen, label)), [label, color.screen])
  const grp = useRef()
  useFrame((s) => { if (grp.current) grp.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.4) * 0.3 })

  return (
    <group ref={grp}>
      {/* main case — low, wide Amiga style */}
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[2.2, 0.3, 1.6]} />
        <meshStandardMaterial map={caseTex} color={color.case} roughness={0.5} metalness={0.15} />
      </mesh>
      {/* top vent slats */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} position={[-0.9 + i * 0.1, 0.31, 0.3]}>
          <boxGeometry args={[0.02, 0.005, 0.6]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}
      {/* disk slot */}
      <mesh position={[-0.5, 0.31, 0.2]}>
        <boxGeometry args={[1.2, 0.005, 0.04]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* power LED */}
      <mesh position={[0.95, 0.31, 0.4]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color={color.accent} emissive={color.accent} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      {/* keyboard */}
      <group position={[0, -0.4, 0.4]} rotation={[-0.25, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.0, 0.12, 0.7]} />
          <meshStandardMaterial map={kbdTex} color="#dcdcdc" roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

function Amiga1200({ color, label }) {
  const caseTex = useMemo(() => getTexture('case-' + color.case, () => makePlasticTexture(color.case)), [color.case])
  const screenTex = useMemo(() => getTexture('crt-' + label + color.screen, () => makeCRTTexture(color.screen, label)), [label, color.screen])
  const grp = useRef()
  useFrame((s) => { if (grp.current) grp.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.35 })

  return (
    <group ref={grp}>
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[2.4, 0.36, 1.8]} />
        <meshStandardMaterial map={caseTex} color={color.case} roughness={0.45} metalness={0.2} />
      </mesh>
      {/* PCMCIA slot */}
      <mesh position={[0.9, 0.37, 0.4]}>
        <boxGeometry args={[0.4, 0.005, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* logo area */}
      <mesh position={[-0.8, 0.37, 0.7]}>
        <planeGeometry args={[0.5, 0.15]} />
        <meshStandardMaterial color={color.accent} emissive={color.accent} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </group>
  )
}

function C64({ color, label }) {
  const caseTex = useMemo(() => getTexture('case-c64', () => makePlasticTexture(color.case)), [color.case])
  const kbdTex = useMemo(() => getTexture('kbd-c64', () => makeKeyboardTexture()), [])
  const grp = useRef()
  useFrame((s) => { if (grp.current) grp.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.45) * 0.3 })

  return (
    <group ref={grp}>
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[2.0, 0.4, 1.4]} />
        <meshStandardMaterial map={caseTex} color={color.case} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* color stripe */}
      <mesh position={[0, 0.21, 0.71]}>
        <boxGeometry args={[2.0, 0.08, 0.001]} />
        <meshStandardMaterial color={color.accent} />
      </mesh>
      {/* keys integrated */}
      <mesh position={[0, 0.41, 0.4]}>
        <boxGeometry args={[1.8, 0.05, 0.6]} />
        <meshStandardMaterial map={kbdTex} color="#dcdcdc" roughness={0.6} />
      </mesh>
    </group>
  )
}

function C128({ color, label }) {
  const caseTex = useMemo(() => getTexture('case-c128', () => makePlasticTexture(color.case)), [color.case])
  const grp = useRef()
  useFrame((s) => { if (grp.current) grp.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.4) * 0.3 })
  return (
    <group ref={grp}>
      <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[2.2, 0.5, 1.6]} />
        <meshStandardMaterial map={caseTex} color={color.case} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.51, 0.81]}>
        <boxGeometry args={[2.0, 0.05, 0.001]} />
        <meshStandardMaterial color={color.accent} />
      </mesh>
    </group>
  )
}

function MacSE({ color, label }) {
  const caseTex = useMemo(() => getTexture('case-mac', () => makePlasticTexture(color.case)), [color.case])
  const screenTex = useMemo(() => getTexture('crt-mac', () => makeCRTTexture(color.screen, label)), [label, color.screen])
  const grp = useRef()
  useFrame((s) => { if (grp.current) grp.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.35 })
  return (
    <group ref={grp}>
      {/* main compact mac body */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.4, 1.0, 1.4]} />
        <meshStandardMaterial map={caseTex} color={color.case} roughness={0.45} metalness={0.2} />
      </mesh>
      {/* CRT tube bulge */}
      <mesh position={[0, 0.6, 0.3]}>
        <boxGeometry args={[1.0, 0.7, 0.3]} />
        <meshStandardMaterial color="#e6e6e6" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 0.6, 0.46]}>
        <planeGeometry args={[0.9, 0.6]} />
        <meshStandardMaterial map={screenTex} emissive="#ffffff" emissiveMap={screenTex} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {/* floppy slot */}
      <mesh position={[0, 0.5, 0.71]}>
        <boxGeometry args={[0.8, 0.04, 0.005]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* base */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.5, 0.08, 1.5]} />
        <meshStandardMaterial color="#d4d4d4" roughness={0.6} />
      </mesh>
    </group>
  )
}

function AtariST({ color, label }) {
  const caseTex = useMemo(() => getTexture('case-st', () => makePlasticTexture(color.case)), [color.case])
  const grp = useRef()
  useFrame((s) => { if (grp.current) grp.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.4) * 0.3 })
  return (
    <group ref={grp}>
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[2.0, 0.8, 1.6]} />
        <meshStandardMaterial map={caseTex} color={color.case} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.81, 0.81]}>
        <boxGeometry args={[1.8, 0.02, 0.001]} />
        <meshStandardMaterial color={color.accent} emissive={color.accent} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function AppleIIGS({ color, label }) {
  const caseTex = useMemo(() => getTexture('case-iigs', () => makePlasticTexture(color.case)), [color.case])
  const grp = useRef()
  useFrame((s) => { if (grp.current) grp.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.35 })
  return (
    <group ref={grp}>
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[2.4, 0.4, 1.8]} />
        <meshStandardMaterial map={caseTex} color={color.case} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* rainbow stripe */}
      <mesh position={[-0.6, 0.41, 0.91]}>
        <boxGeometry args={[0.8, 0.02, 0.001]} />
        <meshStandardMaterial color={color.accent} emissive={color.accent} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </group>
  )
}

function IBMPC({ color, label }) {
  const caseTex = useMemo(() => getTexture('case-ibm', () => makePlasticTexture(color.case)), [color.case])
  const grp = useRef()
  useFrame((s) => { if (grp.current) grp.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.4) * 0.3 })
  return (
    <group ref={grp}>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.4, 1.0, 1.4]} />
        <meshStandardMaterial map={caseTex} color={color.case} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.71, 0.71]}>
        <boxGeometry args={[0.8, 0.4, 0.01]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0, 0.71, 0.72]}>
        <planeGeometry args={[0.7, 0.35]} />
        <meshStandardMaterial color={color.screen} emissive={color.screen} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ============================================================
   HERO 3D STAGE — three computers orbiting
   ============================================================ */

export function HeroStage() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.4, 4.5], fov: 38, near: 0.1, far: 50 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
    >
      <color attach="background" args={['#0a0518']} />
      <fog attach="fog" args={['#0a0518', 6, 18]} />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 2, -2]} intensity={1.5} color="#ff2bd6" distance={10} />
      <pointLight position={[3, 1, -2]} intensity={1.5} color="#00f0ff" distance={10} />
      <pointLight position={[0, 3, 3]} intensity={1.2} color="#ffb347" distance={10} />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[-1.6, -0.2, 0]}>
          <VintageComputer type="a500" color={{ case: '#c4c8d0', accent: '#ffb347', screen: '#00f0ff' }} label="AMIGA" />
        </group>
        <group position={[0, 0.1, 0]}>
          <VintageComputer type="macse" color={{ case: '#e6e6e6', accent: '#b6ff5e', screen: '#b6ff5e' }} label="MAC OS" />
        </group>
        <group position={[1.6, -0.2, 0]}>
          <VintageComputer type="c64" color={{ case: '#b8a07a', accent: '#3a4a8a', screen: '#7df0ff' }} label="READY." />
        </group>
      </Float>

      <ContactShadows position={[0, -0.9, 0]} opacity={0.55} scale={10} blur={2.5} far={3} />

      <AccumulativeShadows position={[0, -0.89, 0]} scale={10} opacity={0.4} frames={60} temporal>
        <RandomizedLight amount={6} radius={3} ambient={0.5} position={[4, 6, 3]} />
      </AccumulativeShadows>

      <Environment preset="night" />

      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={8}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.6}
        enableDamping
        dampingFactor={0.08}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}

/* ============================================================
   MINI THUMBNAIL — single rotating computer for product card
   ============================================================ */

export function ProductThumb({ product }) {
  const { type, color, label } = product
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.6, 2.4], fov: 32, near: 0.1, far: 20 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <color attach="background" args={['#0a0518']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
      <pointLight position={[-2, 1, -1]} intensity={1} color={color.accent} distance={6} />
      <pointLight position={[2, 1, 2]} intensity={1} color={color.screen} distance={6} />

      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.15}>
        <group position={[0, -0.1, 0]}>
          <VintageComputer type={type} color={color} label={label} />
        </group>
      </Float>

      <ContactShadows position={[0, -0.6, 0]} opacity={0.6} scale={4} blur={1.5} far={2} />
      <Environment preset="night" />
    </Canvas>
  )
}
