import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/*
 * Workforce Constellation — a fully procedural React Three Fiber scene.
 * No binary assets (no .glb/.gltf/.hdr/.png): every geometry, color, and
 * texture below is generated in code at runtime. The motif is an org/people
 * network — glowing nodes (employees) wired into a living constellation,
 * orbited by faceted glass shapes, lit in the brand's blue/indigo/amber.
 */

// Brand-aligned palette (primary #1E3C72, secondary #ff9800) widened for glow.
const PALETTE = ['#1E3C72', '#3b5bdb', '#4f7cff', '#7c5cff', '#22d3ee', '#ff9800'].map(
  c => new THREE.Color(c)
);

// Deterministic PRNG so the layout is stable across re-renders / reloads.
const mulberry32 = seed => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// A soft, round, glowing sprite drawn on a canvas — used for the node points.
const makeGlowTexture = () => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.32)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 2;
  return tex;
};

const Constellation = ({ count, animate, pointer }) => {
  const groupRef = useRef();
  const spriteTexture = useMemo(() => makeGlowTexture(), []);

  // Build node positions, per-node colors/sizes, and nearest-neighbour edges.
  const { nodeGeometry, lineGeometry, nodeMaterial } = useMemo(() => {
    const rand = mulberry32(20240611);
    const spread = new THREE.Vector3(9.5, 5.2, 4.6);
    const points = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < count; i += 1) {
      // Sample inside an ellipsoid for an organic, centered cloud.
      let x;
      let y;
      let z;
      do {
        x = rand() * 2 - 1;
        y = rand() * 2 - 1;
        z = rand() * 2 - 1;
      } while (x * x + y * y + z * z > 1);

      const v = new THREE.Vector3(x * spread.x, y * spread.y, z * spread.z);
      points.push(v);

      const t = (v.x / spread.x + 1) / 2; // left→right gradient
      const base = PALETTE[Math.min(PALETTE.length - 1, Math.floor(t * (PALETTE.length - 1)))]
        .clone()
        .lerp(new THREE.Color('#ffffff'), rand() * 0.35);
      colors.push(base.r, base.g, base.b);
      sizes.push(0.18 + rand() * 0.5);
    }

    // Connect each node to a few nearby neighbours to form the web.
    const linePositions = [];
    const lineColors = [];
    const maxDist = 2.9;
    const maxNeighbors = 3;
    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      const neighbors = [];
      for (let j = 0; j < points.length; j += 1) {
        if (i === j) continue;
        const d = a.distanceTo(points[j]);
        if (d < maxDist) neighbors.push({ j, d });
      }
      neighbors.sort((m, n) => m.d - n.d);
      for (let k = 0; k < Math.min(maxNeighbors, neighbors.length); k += 1) {
        const j = neighbors[k].j;
        if (j < i) continue; // de-dupe undirected edges
        const b = points[j];
        const fade = 1 - neighbors[k].d / maxDist;
        const ca = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
        const cb = new THREE.Color(colors[j * 3], colors[j * 3 + 1], colors[j * 3 + 2]);
        linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        lineColors.push(ca.r * fade, ca.g * fade, ca.b * fade, cb.r * fade, cb.g * fade, cb.b * fade);
      }
    }

    const posArray = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      posArray[i * 3] = p.x;
      posArray[i * 3 + 1] = p.y;
      posArray[i * 3 + 2] = p.z;
    });

    const ng = new THREE.BufferGeometry();
    ng.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    ng.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    ng.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lg.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const nm = new THREE.PointsMaterial({
      size: 0.42,
      map: spriteTexture,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    return { nodeGeometry: ng, lineGeometry: lg, nodeMaterial: nm };
  }, [count, spriteTexture]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g || !animate) return;
    const d = Math.min(delta, 0.05);
    g.rotation.y += d * 0.06;
    // Ease toward the pointer for a parallax tilt.
    const targetX = pointer.current.y * 0.18;
    const targetY = pointer.current.x * 0.32 + state.clock.elapsedTime * 0.0;
    g.rotation.x += (targetX - g.rotation.x) * 0.04;
    g.position.x += (pointer.current.x * 0.8 - g.position.x) * 0.03;
    g.position.y += (-pointer.current.y * 0.5 - g.position.y) * 0.03;
    void targetY;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.36}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={nodeGeometry} material={nodeMaterial} />
    </group>
  );
};

const GlassShape = ({ geometry, color, position, distort, speed, scale }) => (
  <Float speed={speed} rotationIntensity={1.1} floatIntensity={1.6} position={position}>
    <mesh scale={scale}>
      {geometry}
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.45}
        roughness={0.12}
        metalness={0.35}
        distort={distort}
        speed={1.4}
        transparent
        opacity={0.92}
      />
    </mesh>
  </Float>
);

const FloatingShapes = ({ animate }) => {
  // Geometries are created once and shared via JSX children.
  return (
    <group>
      <GlassShape
        geometry={<icosahedronGeometry args={[1, 0]} />}
        color="#4f7cff"
        position={[-6.2, 2.1, -1.5]}
        distort={animate ? 0.35 : 0}
        speed={animate ? 1.6 : 0}
        scale={1.15}
      />
      <GlassShape
        geometry={<octahedronGeometry args={[1, 0]} />}
        color="#ff9800"
        position={[6.4, -1.8, -0.5]}
        distort={animate ? 0.28 : 0}
        speed={animate ? 1.2 : 0}
        scale={1.0}
      />
      <GlassShape
        geometry={<dodecahedronGeometry args={[1, 0]} />}
        color="#7c5cff"
        position={[4.6, 2.6, -2.4]}
        distort={animate ? 0.3 : 0}
        speed={animate ? 2.0 : 0}
        scale={0.8}
      />
      <GlassShape
        geometry={<tetrahedronGeometry args={[1, 0]} />}
        color="#22d3ee"
        position={[-5.0, -2.6, -1.0]}
        distort={animate ? 0.4 : 0}
        speed={animate ? 1.8 : 0}
        scale={0.7}
      />
    </group>
  );
};

const BackdropRing = ({ animate }) => {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current && animate) ref.current.rotation.z += Math.min(delta, 0.05) * 0.05;
  });
  return (
    <mesh ref={ref} position={[0, 0, -6]}>
      <torusGeometry args={[7.5, 0.02, 8, 120]} />
      <meshBasicMaterial color="#3b5bdb" transparent opacity={0.18} />
    </mesh>
  );
};

const Rig = ({ pointer }) => {
  // Subtle camera drift toward the pointer adds depth without nausea.
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    state.camera.position.x += (pointer.current.x * 1.2 - state.camera.position.x) * d * 1.5;
    state.camera.position.y += (pointer.current.y * 0.8 - state.camera.position.y) * d * 1.5;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const HeroCanvas = ({ count = 150, animate = true, pointer }) => {
  // A no-op pointer ref when the host doesn't supply one (e.g. reduced motion).
  const localPointer = useRef({ x: 0, y: 0 });
  const activePointer = pointer || localPointer;

  return (
    <Canvas
      frameloop={animate ? 'always' : 'demand'}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 15], fov: 52 }}
      style={{ width: '100%', height: '100%' }}
    >
      <fog attach="fog" args={['#0a1024', 14, 30]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[-12, 6, 6]} intensity={120} color="#4f7cff" />
      <pointLight position={[12, -6, 4]} intensity={90} color="#ff9800" />
      <pointLight position={[0, 8, -6]} intensity={60} color="#7c5cff" />

      <Constellation count={count} animate={animate} pointer={activePointer} />
      <FloatingShapes animate={animate} />
      <BackdropRing animate={animate} />
      <Rig pointer={activePointer} />

      <EffectComposer disableNormalPass>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.7}
        />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
};

export default HeroCanvas;
