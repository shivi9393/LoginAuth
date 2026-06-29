import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const FLORA = ['#2dd4bf', '#22d3ee', '#a3e635', '#e879f9', '#34d399', '#5eead4'];

/** A single bioluminescent mushroom: dark stem + glowing cap + soft under-glow. */
function GlowMushroom({ position, scale = 1, color }) {
  return (
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.5}>
      <group position={position} scale={scale}>
        {/* stem */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.07, 0.12, 0.85, 14]} />
          <meshStandardMaterial color="#0a2a20" emissive={color} emissiveIntensity={0.18} roughness={0.7} />
        </mesh>
        {/* glowing cap (top hemisphere, flattened) */}
        <mesh position={[0, 0.85, 0]} scale={[1, 0.62, 1]}>
          <sphereGeometry args={[0.36, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} roughness={0.35} toneMapped={false} />
        </mesh>
        {/* under-glow disc */}
        <mesh position={[0, 0.82, 0]} rotation={[Math.PI, 0, 0]} scale={[1, 0.18, 1]}>
          <sphereGeometry args={[0.33, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

/** Cluster of mushrooms along the jungle floor. */
function Mushrooms() {
  const items = useMemo(
    () =>
      [
        [-4.2, -2.3, -0.5, 1.15],
        [-2.7, -2.5, 0.8, 0.8],
        [-1.2, -2.2, -1.2, 1.35],
        [0.4, -2.6, 0.4, 0.7],
        [1.7, -2.3, -0.8, 1.1],
        [3.0, -2.5, 0.9, 0.85],
        [4.4, -2.2, -0.3, 1.25],
        [-3.4, -2.6, 1.6, 0.6],
        [2.3, -2.6, 1.7, 0.65],
      ].map((p, i) => ({
        key: i,
        position: [p[0], p[1], p[2]],
        scale: p[3],
        color: FLORA[i % FLORA.length],
      })),
    []
  );
  return (
    <>
      {items.map((m) => (
        <GlowMushroom key={m.key} position={m.position} scale={m.scale} color={m.color} />
      ))}
    </>
  );
}

/** Tall glowing reeds with bright tips, gently swaying. */
function Reeds() {
  const group = useRef();
  const reeds = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => ({
        key: i,
        x: (Math.random() - 0.5) * 11,
        z: -1.5 - Math.random() * 2.5,
        h: 1.6 + Math.random() * 1.8,
        color: FLORA[(i + 2) % FLORA.length],
        phase: Math.random() * Math.PI * 2,
      })),
    []
  );
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current?.children.forEach((reed, i) => {
      reed.rotation.z = Math.sin(t * 0.6 + reeds[i].phase) * 0.08;
    });
  });
  return (
    <group ref={group}>
      {reeds.map((r) => (
        <group key={r.key} position={[r.x, -2.6, r.z]}>
          <mesh position={[0, r.h / 2, 0]}>
            <cylinderGeometry args={[0.012, 0.035, r.h, 8]} />
            <meshStandardMaterial color="#0c3a2a" emissive={r.color} emissiveIntensity={0.5} roughness={0.6} />
          </mesh>
          <mesh position={[0, r.h, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color={r.color} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Floating woodsprite seeds — soft glowing puffs drifting up through the canopy. */
function Woodsprites() {
  const seeds = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        key: i,
        position: [(Math.random() - 0.5) * 9, (Math.random() - 0.2) * 4, (Math.random() - 0.5) * 3],
        scale: 0.18 + Math.random() * 0.16,
        color: i % 2 ? '#a7f3d0' : '#5eead4',
      })),
    []
  );
  return (
    <>
      {seeds.map((s) => (
        <Float key={s.key} speed={2.2} rotationIntensity={2} floatIntensity={2.4}>
          <group position={s.position} scale={s.scale}>
            <mesh>
              <icosahedronGeometry args={[0.5, 1]} />
              <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={2} roughness={0.2} toneMapped={false} />
            </mesh>
            {/* soft halo */}
            <mesh scale={2.1}>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshBasicMaterial
                color={s.color}
                transparent
                opacity={0.18}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
        </Float>
      ))}
    </>
  );
}

/** Big, dim canopy glows far back for depth. */
function CanopyGlow() {
  const orbs = [
    { p: [-5, 2.5, -6], c: '#2dd4bf', s: 2.2 },
    { p: [5.5, 3, -7], c: '#e879f9', s: 2.6 },
    { p: [0, -1, -8], c: '#a3e635', s: 3 },
  ];
  return (
    <>
      {orbs.map((o, i) => (
        <mesh key={i} position={o.p} scale={o.s}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial
            color={o.c}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

/** Gentle parallax following the pointer. */
function ParallaxRig({ children }) {
  const group = useRef();
  useFrame((state) => {
    if (group.current) {
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, state.pointer.x * 0.5, 0.04);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, state.pointer.y * 0.3, 0.04);
    }
  });
  return <group ref={group}>{children}</group>;
}

export default function Scene() {
  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0.5, 7.5], fov: 52 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#03110c']} />
        <fog attach="fog" args={['#03110c', 8, 18]} />

        <ambientLight intensity={0.35} color="#7fffd4" />
        <pointLight position={[4, 3, 4]} intensity={45} color="#2dd4bf" />
        <pointLight position={[-5, 1, 2]} intensity={38} color="#e879f9" />
        <pointLight position={[0, -3, 3]} intensity={30} color="#a3e635" />

        <Suspense fallback={null}>
          <ParallaxRig>
            <CanopyGlow />
            <Mushrooms />
            <Reeds />
            <Woodsprites />
            {/* drifting spores + pollen + fireflies */}
            <Sparkles count={90} scale={[16, 10, 6]} size={2.6} speed={0.3} color="#5eead4" opacity={0.7} />
            <Sparkles count={50} scale={[14, 9, 5]} size={3.4} speed={0.45} color="#a3e635" opacity={0.6} />
            <Sparkles count={30} scale={[12, 7, 4]} size={4} speed={0.6} color="#e879f9" opacity={0.5} />
          </ParallaxRig>

          <EffectComposer disableNormalPass>
            <Bloom mipmapBlur intensity={1.35} luminanceThreshold={0.15} luminanceSmoothing={0.45} />
            <Vignette eskil={false} offset={0.22} darkness={0.9} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
