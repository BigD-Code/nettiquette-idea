import React from 'react'
import { Instance, Instances as DreiInstances } from '@react-three/drei'

// Placeholder for the Computers component referenced in App.jsx
// This creates a simple instanced mesh of boxes.

export function Instances({ children, ...props }) {
  return (
    <DreiInstances range={10} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
      {children}
    </DreiInstances>
  )
}

export function Computers(props) {
  return (
    <group {...props}>
      {/* Create a few instances positioned randomly or in a line */}
      <Instance position={[-2, 1, -1]} rotation={[0, 0.5, 0]} />
      <Instance position={[2, 1, -1]} rotation={[0, -0.5, 0]} />
      <Instance position={[0, 1, -2]} />
    </group>
  )
}