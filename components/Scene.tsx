
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera, Environment, useTexture, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PlatonicElement } from '../types';
import { ELEMENT_COLORS, PARTICLE_COLORS, LOGO_URL, COLORS } from '../constants';

const Mesh = 'mesh' as any;
const MeshPhysicalMaterial = 'meshPhysicalMaterial' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const Group = 'group' as any;
const Points = 'points' as any;
const BufferGeometry = 'bufferGeometry' as any;
const BufferAttribute = 'bufferAttribute' as any;
const PointsMaterial = 'pointsMaterial' as any;
const SphereGeometry = 'sphereGeometry' as any;
const ConeGeometry = 'coneGeometry' as any;

interface SceneProps {
  activeElement: PlatonicElement;
  isFinale: boolean;
  onHover: (element: PlatonicElement) => void;
  onHoverLeave: () => void;
}

const Bauble: React.FC<{ position: [number, number, number]; scale: number }> = ({ position, scale }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.position.y += Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.006;
    }
  });

  return (
    <Mesh ref={ref} position={position} scale={scale}>
      <Mesh ref={ref}>
        <DodecahedronGeometry args={[1, 0]} />
        <MeshPhysicalMaterial 
          color={COLORS.FESTIVE_RED} 
          emissive={COLORS.FESTIVE_RED}
          emissiveIntensity={0.8}
          roughness={0.2} 
          metalness={0.8}
          clearcoat={1}
        />
      </Mesh>
    </Mesh>
  );
};

// Custom Star with Aleph
const TreeTopper: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Group ref={group} position={[0, 11, 0]}>
      {/* Golden Star Base */}
      <Mesh rotation={[0, 0, Math.PI / 1]}>
        <IcosahedronGeometry args={[1.5, 0]} />
        <MeshPhysicalMaterial color={COLORS.GOLD} emissive={COLORS.GOLD} emissiveIntensity={2} metalness={1} roughness={0} />
      </Mesh>
      <PointLight intensity={10} distance={10} color={COLORS.GOLD} />
    </Group>
  );
};

const DodecahedronGeometry = 'dodecahedronGeometry' as any;
const IcosahedronGeometry = 'icosahedronGeometry' as any;

const ChristmasTree: React.FC<{ active: boolean }> = ({ active }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && active) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -10, 0.03);
      groupRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.03);
      groupRef.current.rotation.y += 0.001;
    }
  });

  const baubles = useMemo(() => {
    const b = [];
    const layers = 5;
    for (let i = 0; i < layers; i++) {
      const count = 4 + i * 2;
      const radius = 1.0 + i * 0.9;
      const height = i * 2.5;
      for (let j = 0; j < count; j++) {
        const angle = (j / count) * Math.PI * 2 + (i * 0.85);
        b.push({
          pos: [
            Math.cos(angle) * radius,
            10 - height,
            Math.sin(angle) * radius
          ] as [number, number, number],
          scale: 0.38 - (i * 0.03)
        });
      }
    }
    return b;
  }, []);

  return (
    <Group ref={groupRef} position={[0, -40, 0]} scale={[0.1, 0.1, 0.1]}>
      <TreeTopper />
      
      {[...Array(8)].map((_, i) => (
        <Mesh key={i} position={[0, i * 1.6, 0]}>
          <ConeGeometry args={[5.5 - i * 0.7, 4.5, 32]} />
          <MeshPhysicalMaterial 
            color={COLORS.DARK_GREEN} 
            roughness={1} 
            metalness={0.1} 
          />
        </Mesh>
      ))}
      
      <Mesh position={[0, -2.5, 0]}>
        <ConeGeometry args={[1.0, 8, 8]} />
        <MeshPhysicalMaterial color="#0c0601" roughness={1} />
      </Mesh>

      {baubles.map((b, i) => (
        <Bauble key={i} position={b.pos} scale={b.scale} />
      ))}

      <PointLight position={[0, 15, 0]} intensity={12} color={COLORS.GOLD} distance={40} />
      <PointLight position={[0, -5, 0]} intensity={5} color={COLORS.FESTIVE_RED} distance={20} />
    </Group>
  );
};

const PlatonicSolid: React.FC<{
  type: PlatonicElement;
  position: [number, number, number];
  isActive: boolean;
  isFinale: boolean;
  onHover: (e: PlatonicElement) => void;
  onHoverLeave: () => void;
}> = ({ type, position, isActive, isFinale, onHover, onHoverLeave }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hasDisappeared, setHasDisappeared] = useState(false);
  
  const geometry = useMemo(() => {
    switch (type) {
      case PlatonicElement.WATER: return new THREE.IcosahedronGeometry(1.4, 0);
      case PlatonicElement.EARTH: return new THREE.BoxGeometry(1.6, 1.6, 1.6);
      case PlatonicElement.FIRE: return new THREE.TetrahedronGeometry(1.6, 0);
      case PlatonicElement.AIR: return new THREE.OctahedronGeometry(1.6, 0);
      case PlatonicElement.ETHER: return new THREE.DodecahedronGeometry(1.6, 0);
      default: return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [type]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (isFinale && type === PlatonicElement.ETHER) {
      meshRef.current.position.lerp(new THREE.Vector3(0, 7, 0), 0.05);
      meshRef.current.scale.lerp(new THREE.Vector3(0.25, 0.25, 0.25), 0.05);
      meshRef.current.rotation.y += 0.2;
      if (meshRef.current.position.y > 6.5) setHasDisappeared(true);
    } else if (isFinale) {
      meshRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
    } else {
      const time = state.clock.getElapsedTime();
      const baseSpin = type === PlatonicElement.ETHER ? 0.015 : 0.025;
      const hoverMultiplier = isActive ? 8 : 1;
      meshRef.current.rotation.y += baseSpin * hoverMultiplier;
      meshRef.current.rotation.z += (baseSpin * 0.5) * hoverMultiplier;
      meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.25;
    }
  });

  if (hasDisappeared && isFinale) return null;

  const baseColor = isActive && !isFinale ? COLORS.WARM_WHITE : (isFinale && type === PlatonicElement.ETHER ? '#ffffff' : ELEMENT_COLORS[type]);

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.4}>
      <Mesh
        ref={meshRef}
        position={position}
        onPointerEnter={() => onHover(type)}
        onPointerLeave={onHoverLeave}
        onClick={() => onHover(type)}
        onPointerDown={() => onHover(type)}
        geometry={geometry}
      >
        <MeshPhysicalMaterial 
          color={baseColor} 
          emissive={baseColor} 
          emissiveIntensity={isActive ? 18 : 0.4}
          roughness={0.0}
          metalness={1.0}
          transmission={0.85}
          thickness={2.5}
          ior={1.6}
          clearcoat={1}
          transparent
          opacity={isFinale && type !== PlatonicElement.ETHER ? 0 : 1}
        />
      </Mesh>
    </Float>
  );
};

const Snow: React.FC<{ activeElement: PlatonicElement, isFinale: boolean }> = ({ activeElement, isFinale }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const count = 7000;
  
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;
    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    const targetColor = isFinale ? new THREE.Color(COLORS.FESTIVE_RED) : new THREE.Color(PARTICLE_COLORS[activeElement] || "#ffffff");
    materialRef.current.color.lerp(targetColor, 0.05);
    
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      
      if (isFinale) {
        positions[idx + 1] += 0.2;
        positions[idx] += Math.sin(time * 3 + i) * 0.15;
        materialRef.current.size = 0.08 + Math.sin(time * 12 + i) * 0.04;
      } else {
        switch (activeElement) {
          case PlatonicElement.FIRE:
            positions[idx + 1] += 0.25;
            positions[idx] += Math.sin(time * 6 + i) * 0.25;
            materialRef.current.size = 0.2;
            break;
          case PlatonicElement.WATER:
            positions[idx + 1] -= 0.05;
            positions[idx] += Math.sin(time + positions[idx + 1] * 0.05) * 0.1;
            materialRef.current.size = 0.14;
            break;
          case PlatonicElement.AIR:
            positions[idx + 1] -= 0.01;
            positions[idx] += Math.cos(time * 0.8 + i) * 0.2;
            materialRef.current.size = 0.09;
            break;
          default:
            positions[idx + 1] -= 0.06;
            positions[idx] += Math.sin(time * 0.3 + i) * 0.03;
            materialRef.current.size = 0.11;
        }
      }

      if (positions[idx + 1] < -50) positions[idx + 1] = 50;
      if (positions[idx + 1] > 50) positions[idx + 1] = -50;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef}>
      <BufferGeometry>
        <BufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} />
      </BufferGeometry>
      <PointsMaterial 
        ref={materialRef} 
        size={0.12} 
        transparent 
        opacity={0.7} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </Points>
  );
};

export const Scene: React.FC<SceneProps> = ({ activeElement, isFinale, onHover, onHoverLeave }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 22]} />
      <AmbientLight intensity={0.4} />
      <PointLight position={[10, 20, 10]} intensity={3} color={COLORS.SOFT_CREME} />
      <PointLight position={[-10, -10, 15]} intensity={1.5} color="#222" />

      <Environment preset="apartment" />
      
      {!isFinale && (
        <Stars radius={200} depth={60} count={10000} factor={14} saturation={0} fade speed={2} />
      )}

      <Snow activeElement={activeElement} isFinale={isFinale} />

      <ChristmasTree active={isFinale} />

      <Group>
        <PlatonicSolid 
          type={PlatonicElement.WATER} position={[-12, 0, 0]} 
          isActive={activeElement === PlatonicElement.WATER} isFinale={isFinale}
          onHover={onHover} onHoverLeave={onHoverLeave} 
        />
        <PlatonicSolid 
          type={PlatonicElement.EARTH} position={[-6, 0, 0]} 
          isActive={activeElement === PlatonicElement.EARTH} isFinale={isFinale}
          onHover={onHover} onHoverLeave={onHoverLeave} 
        />
        <PlatonicSolid 
          type={PlatonicElement.ETHER} position={[0, 0, 0]} 
          isActive={activeElement === PlatonicElement.ETHER} isFinale={isFinale}
          onHover={onHover} onHoverLeave={onHoverLeave} 
        />
        <PlatonicSolid 
          type={PlatonicElement.FIRE} position={[6, 0, 0]} 
          isActive={activeElement === PlatonicElement.FIRE} isFinale={isFinale}
          onHover={onHover} onHoverLeave={onHoverLeave} 
        />
        <PlatonicSolid 
          type={PlatonicElement.AIR} position={[12, 0, 0]} 
          isActive={activeElement === PlatonicElement.AIR} isFinale={isFinale}
          onHover={onHover} onHoverLeave={onHoverLeave} 
        />
      </Group>
    </>
  );
};
