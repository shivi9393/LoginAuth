import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Icosahedron, Torus } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/** The glowing, slowly-morphing core orb that anchors the scene. */
function CoreOrb() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.18;
      ref.current.rotation.x = Math.sin(t * 0.15) * 0.2;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.1}>
      <Icosahedron ref={ref} args={[1.5, 12]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#7c3aed"
          emissive="#3b1d8f"
          emissiveIntensity={0.55}
          roughness={0.18}
          metalness={0.65}
          distort={0.42}
          speed={1.6}
        />
      </Icosahedron>
    </Float>
  );
}

/** Thin neon rings orbiting the core for a high-end, layered look. */
function Rings() {
  const group = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.z = t * 0.08;
      group.current.rotation.x = Math.sin(t * 0.1) * 0.4 + 0.5;
    }
  });
  return (
    <group ref={group}>
      <Torus args={[2.6, 0.012, 16, 120]}>
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.2} toneMapped={false} />
      </Torus>
      <Torus args={[3.2, 0.01, 16, 120]} rotation={[Math.PI / 2.4, 0, 0]}>
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.8} toneMapped={false} />
      </Torus>
    </group>
  );
}

/** Small floating gem shards scattered for depth. */
function Shards() {
  const shards = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        key: i,
        position: [
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4 - 1,
        ],
        scale: 0.12 + Math.random() * 0.22,
        color: ['#8b5cf6', '#22d3ee', '#ec4899', '#34d399'][i % 4],
      })),
    []
  );
  return (
    <>
      {shards.map((s) => (
        <Float key={s.key} speed={2} rotationIntensity={2} floatIntensity={2}>
          <Icosahedron args={[s.scale, 0]} position={s.position}>
            <meshStandardMaterial
              color={s.color}
              emissive={s.color}
              emissiveIntensity={1.4}
              roughness={0.1}
              metalness={0.4}
              toneMapped={false}
            />
          </Icosahedron>
        </Float>
      ))}
    </>
  );
}

/** Gentle parallax that follows the pointer, giving the scene depth. */
function ParallaxRig({ children }) {
  const group = useRef();
  useFrame((state) => {
    if (group.current) {
      group.current.position.x = THREE.MathUtils.lerp(
        group.current.position.x,
        state.pointer.x * 0.6,
        0.04
      );
      group.current.position.y = THREE.MathUtils.lerp(
        group.current.position.y,
        state.pointer.y * 0.4,
        0.04
      );
    }
  });
  return <group ref={group}>{children}</group>;
}

export default function Scene() {
  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05060f']} />
        <fog attach="fog" args={['#05060f', 7, 16]} />

        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={60} color="#8b5cf6" />
        <pointLight position={[-6, -3, 2]} intensity={45} color="#22d3ee" />
        <pointLight position={[0, -5, -4]} intensity={30} color="#ec4899" />

        <Suspense fallback={null}>
          <ParallaxRig>
            <CoreOrb />
            <Rings />
            <Shards />
            <Sparkles count={120} scale={[14, 9, 6]} size={2.4} speed={0.35} color="#a5b4fc" opacity={0.7} />
          </ParallaxRig>

          <EffectComposer disableNormalPass>
            <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.2} luminanceSmoothing={0.4} />
            <Vignette eskil={false} offset={0.25} darkness={0.85} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
