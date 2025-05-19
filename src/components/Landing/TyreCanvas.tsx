import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Preload, useGLTF } from '@react-three/drei'

import CanvasLoader from '../Loader'

const Tyres = ({ isMobile }) => {
  const computer = useGLTF('/model/scene.gltf') // Use absolute path for public folder assets

  // Rotation state
  const [rotation, setRotation] = useState([0, 0, 0])

  // Use `useFrame` to rotate the model in place
  useFrame(() => {
    setRotation(prev => [prev[0], prev[1] + 0.01, prev[2]]) // Increment Y-axis rotation
  })

  return (
    <>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <mesh
        position={[0, isMobile ? -3.5 : -2.5, 0]} // Adjust Y-axis to move the model lower
        rotation={rotation} // Keep the rotation logic
      >
        <primitive object={computer.scene} scale={isMobile ? 0.7 : 1.2} />
      </mesh>
    </>
  )
}

const TyreCanvas = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 500px)')
    setIsMobile(mediaQuery.matches)

    const handleMediaQueryChange = event => {
      setIsMobile(event.matches)
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])

  return (
    <Canvas
      frameloop='demand'
      shadow={false}
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          enableRotate={false} // Prevent user rotation
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Tyres isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  )
}

export default TyreCanvas
