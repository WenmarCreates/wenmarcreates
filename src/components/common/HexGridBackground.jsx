import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── Honeycomb Configuration ── */
const HEX_RADIUS = 0.52;
const GAP = 0.06;
const COLS = 42;
const ROWS = 32;

function createRoundedHexShape(radius, rounding) {
  const shape = new THREE.Shape();
  const corners = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    corners.push(new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius));
  }
  const r = rounding;
  for (let i = 0; i < 6; i++) {
    const curr = corners[i];
    const next = corners[(i + 1) % 6];
    const prev = corners[(i + 5) % 6];
    const toPrev = prev.clone().sub(curr).normalize().multiplyScalar(r);
    const toNext = next.clone().sub(curr).normalize().multiplyScalar(r);
    const p1 = curr.clone().add(toPrev);
    const p2 = curr.clone().add(toNext);
    if (i === 0) shape.moveTo(p1.x, p1.y);
    else shape.lineTo(p1.x, p1.y);
    shape.quadraticCurveTo(curr.x, curr.y, p2.x, p2.y);
  }
  shape.closePath();
  return shape;
}

/* ── Instanced Honeycomb Cells ── */
function HoneycombGrid() {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Brand Color Palette Integration:
  // Background: #FEFADF, Primary: #D3A373, Secondary: #EEDCAC, Tertiary: #573325
  const primaryColor = useMemo(() => new THREE.Color("#D3A373"), []);
  const secondaryColor = useMemo(() => new THREE.Color("#EEDCAC"), []);
  const targetColor = useRef(new THREE.Color("#D3A373"));

  // Track global pointer coordinates across page overlay
  const pointerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerPos.current = { x: x * 12, y: y * 12 };
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const positions = useMemo(() => {
    const pos = [];
    const w = (HEX_RADIUS + GAP) * Math.sqrt(3);
    const h = (HEX_RADIUS + GAP) * 1.5;
    const offsetX = (COLS * w) / 2;
    const offsetY = (ROWS * h) / 2;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * w + (row % 2 === 1 ? w / 2 : 0) - offsetX;
        const y = row * h - offsetY;
        pos.push([x, y]);
      }
    }
    return pos;
  }, []);

  const count = positions.length;

  const geometry = useMemo(() => {
    const shape = createRoundedHexShape(HEX_RADIUS, 0.04);
    const extrudeSettings = {
      depth: 0.55,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#D3A373"),
        roughness: 0.45,
        metalness: 0.1,
      }),
    []
  );

  const frameSkip = useRef(0);

  useFrame(({ clock }) => {
    material.color.lerp(targetColor.current, 0.05);

    if (!meshRef.current) return;

    frameSkip.current++;
    if (frameSkip.current % 2 !== 0) return;

    const time = clock.elapsedTime;
    const mouseX = pointerPos.current.x;
    const mouseY = pointerPos.current.y;

    for (let i = 0; i < count; i++) {
      const [x, y] = positions[i];

      // Interactive mouse wave displacement
      const dx = x - mouseX;
      const dy = y - mouseY;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);
      const mouseFactor = Math.max(0, 1 - distToMouse / 7.0) * 0.9;

      // Organic 3D Honeycomb wave math
      const wave1 = Math.sin(x * 0.35 + time * 0.5) * Math.cos(y * 0.3 + time * 0.4);
      const wave2 = Math.sin(Math.sqrt(x * x + y * y) * 0.4 - time * 0.6) * 0.5;
      const height = (wave1 + wave2) * 0.45 + mouseFactor;

      dummy.position.set(x, y, height * 0.4);

      dummy.rotation.set(
        Math.sin(time * 0.3 + x) * 0.04,
        Math.cos(time * 0.3 + y) * 0.04,
        0
      );

      const normalScale = 0.5 + Math.max(0, height + 0.6) * 1.1;
      dummy.scale.set(1, 1, normalScale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} castShadow receiveShadow />;
}

function SceneBg() {
  const { scene } = useThree();
  const bgColor = useMemo(() => new THREE.Color("#FEFADF"), []);

  useEffect(() => {
    scene.background = bgColor;
  }, [scene, bgColor]);

  return null;
}

function DynamicLights() {
  return (
    <>
      <ambientLight intensity={0.75} color="#FEFADF" />
      <directionalLight
        position={[12, 18, 15]}
        intensity={1.4}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-10, 12, -8]} intensity={0.4} color="#EEDCAC" />
      <directionalLight position={[0, -6, 12]} intensity={0.3} color="#D3A373" />
    </>
  );
}

export const HexGridBackground = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "680px",
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        borderBottom: "1px solid rgba(87, 51, 37, 0.12)"
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [8, -14, 10],
          fov: 60,
          near: 0.1,
          far: 120,
        }}
        dpr={[1, 1.5]}
        frameloop="always"
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(-1, 4, 0);
        }}
      >
        <color attach="background" args={["#FEFADF"]} />
        <fog attach="fog" args={["#FEFADF", 14, 32]} />

        <SceneBg />
        <DynamicLights />
        <HoneycombGrid />

        <mesh rotation={[0, 0, 0]} position={[0, 0, -0.8]} receiveShadow>
          <planeGeometry args={[80, 80]} />
          <shadowMaterial opacity={0.12} />
        </mesh>
      </Canvas>

      {/* Warm gradient overlay fade into content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(254, 250, 223, 0.4) 0%, rgba(254, 250, 223, 0.85) 75%, #FEFADF 100%)",
          pointerEvents: "none"
        }}
      ></div>
    </div>
  );
};

export default HexGridBackground;
