# AayStyle Luxury SaaS Design System & UI Specification
*The Signature "Warm Denim, Honeycomb & Bronze" Aesthetic*

---

## 1. Design Overview & Philosophy

The **AayStyle** aesthetic combines the tactile warmth of luxury textiles (denim twill weave, fine parchment paper) with high-end executive metallic accents (champagne gold, amber bronze, and deep walnut leather). 

Instead of stark cold minimalist white or generic dark mode, AayStyle uses **warm cream base tones (`#FEFADF`)**, **woven textural depth**, **custom glassmorphism**, and **tactile 3D physical interactions** (spatial tilt, layered z-depth, and interactive Three.js honeycomb wave mesh).

---

## 2. Core Color Tokens & CSS Variables

```css
:root {
  /* Core Brand Colors */
  --bg-primary: #FEFADF;          /* Warm Cream / Soft Linen */
  --bg-secondary: #FFFFFF;        /* Crisp Surface White */
  --bg-tertiary: #EEDCAC;         /* Honey Sand / Warm Oatmeal */
  --bg-card: #FFFDF5;             /* Alabaster Warm Card */
  --bg-card-hover: #FFFFFF;       /* Hover Surface Elevate */
  --bg-glass: rgba(254, 250, 223, 0.85); /* Frost Blur Glass */
  --bg-input: #FFFFFF;

  /* Borders */
  --border-color: rgba(87, 51, 37, 0.14);
  --border-focus: #D3A373;
  --border-highlight: rgba(211, 163, 115, 0.5);

  /* Typography Colors */
  --text-main: #573325;           /* Deep Espresso / Walnut Leather */
  --text-muted: #7c5140;          /* Warm Earth Brown */
  --text-subtle: #9e7564;         /* Soft Sand Brown */

  /* Metallic Accents */
  --accent-primary: #D3A373;      /* Champagne Amber Gold */
  --accent-secondary: #EEDCAC;    /* Soft Warm Sand */
  --accent-tertiary: #573325;     /* Dark Denim Bronze */
  
  /* Status / Semantic Indicators */
  --accent-cyan: #0284c7;         /* Information */
  --accent-emerald: #059669;      /* Success / Verified */
  --accent-rose: #e11d48;         /* High Priority / Alert */
  --accent-amber: #d97706;        /* In Progress / Warning */

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #D3A373 0%, #573325 100%);
  --gradient-glow: linear-gradient(135deg, rgba(211, 163, 115, 0.22) 0%, rgba(238, 220, 172, 0.4) 100%);
  --gradient-emerald: linear-gradient(135deg, #059669 0%, #047857 100%);
  --gradient-amber: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(87, 51, 37, 0.06);
  --shadow-md: 0 8px 24px rgba(87, 51, 37, 0.1);
  --shadow-lg: 0 16px 40px rgba(87, 51, 37, 0.16);
  --shadow-glow: 0 0 25px rgba(211, 163, 115, 0.35);

  /* Border Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* Typography */
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}
```

---

## 3. Signature Website Backgrounds

AayStyle features two background solutions: a **Pure CSS Multi-layered Textured Weave** for ultra-fast full-page backgrounds, and a **Three.js Interactive 3D Honeycomb Mesh** for hero sections.

### Solution A: Pure CSS Multi-Layered Textured Weave (Global Body Background)
Combines an organic radial glow, cross-hatch twill diagonal lines, and SVG procedural fractal noise to eliminate plastic flat surfaces.

```css
html, body {
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  background-color: #FEFADF;
  background-image: 
    /* Layer 1: Top radial ambient glow */
    radial-gradient(ellipse at 50% 0%, rgba(211, 163, 115, 0.2) 0%, rgba(254, 250, 223, 0.4) 100%),
    /* Layer 2: 45deg denim twill stripe */
    repeating-linear-gradient(45deg, rgba(87, 51, 37, 0.045) 0px, rgba(87, 51, 37, 0.045) 1px, transparent 1px, transparent 4px),
    /* Layer 3: -45deg counter-twill highlight */
    repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.65) 0px, rgba(255, 255, 255, 0.65) 2px, transparent 2px, transparent 5px),
    /* Layer 4: 90deg subtle vertical weft */
    repeating-linear-gradient(90deg, rgba(87, 51, 37, 0.025) 0px, rgba(87, 51, 37, 0.025) 1px, transparent 1px, transparent 3px),
    /* Layer 5: Procedural SVG noise grain */
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.06'/%3E%3C/svg%3E");
  background-attachment: fixed;
  color: #573325;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

### Solution B: Interactive 3D Honeycomb Hex Grid (Three.js / React Three Fiber)
Renders 1,344 extruded rounded hex prisms that dynamically displace based on mouse cursor proximity and continuous sine wave propagation.

```jsx
import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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

export function HoneycombGrid() {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const pointerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointer = (e) => {
      pointerPos.current = {
        x: ((e.clientX / window.innerWidth) * 2 - 1) * 12,
        y: (-(e.clientY / window.innerHeight) * 2 + 1) * 12
      };
    };
    window.addEventListener("pointermove", handlePointer);
    return () => window.removeEventListener("pointermove", handlePointer);
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

  const geometry = useMemo(() => {
    const shape = createRoundedHexShape(HEX_RADIUS, 0.04);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.55,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2
    });
  }, []);

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color("#D3A373"), roughness: 0.45, metalness: 0.1 }),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.elapsedTime;
    const { x: mouseX, y: mouseY } = pointerPos.current;

    for (let i = 0; i < positions.length; i++) {
      const [x, y] = positions[i];
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mouseFactor = Math.max(0, 1 - dist / 7.0) * 0.9;
      const wave = Math.sin(x * 0.35 + time * 0.5) * Math.cos(y * 0.3 + time * 0.4) +
                   Math.sin(Math.sqrt(x * x + y * y) * 0.4 - time * 0.6) * 0.5;
      const h = (wave * 0.45) + mouseFactor;

      dummy.position.set(x, y, h * 0.4);
      dummy.rotation.set(Math.sin(time * 0.3 + x) * 0.04, Math.cos(time * 0.3 + y) * 0.04, 0);
      dummy.scale.set(1, 1, 0.5 + Math.max(0, h + 0.6) * 1.1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, positions.length]} castShadow receiveShadow />;
}
```

---

## 4. Button Design System

### 4.1 Primary "Denim Bronze" Tactile CTA (`.btn-denim` / `.gradient-btn`)
This button features an internal woven micro-weave texture, an inset specular highlight along the top rim, and a rich bronze shadow.

```css
.btn-denim,
.gradient-btn {
  background-color: #573325;
  background-image: 
    linear-gradient(135deg, rgba(211, 163, 115, 0.45) 0%, rgba(87, 51, 37, 0.95) 100%),
    repeating-linear-gradient(45deg, rgba(254, 250, 223, 0.15) 0px, rgba(254, 250, 223, 0.15) 1px, transparent 1px, transparent 4px),
    repeating-linear-gradient(-45deg, rgba(254, 250, 223, 0.1) 0px, rgba(254, 250, 223, 0.1) 2px, transparent 2px, transparent 5px);
  color: #FEFADF;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.65rem 1.4rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(211, 163, 115, 0.5);
  box-shadow: 
    0 4px 14px rgba(87, 51, 37, 0.25), 
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-denim:hover,
.gradient-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(87, 51, 37, 0.4), 
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  border-color: rgba(254, 250, 223, 0.8);
}

.btn-denim:active,
.gradient-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(87, 51, 37, 0.3);
}
```

### 4.2 Secondary Sand Button (`.btn-secondary`)
Used for neutral actions, secondary choices, or filters.

```css
.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.65rem 1.4rem;
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-secondary:hover {
  background: #e2cca0;
  border-color: var(--accent-primary);
  transform: translateY(-1px);
}
```

### 4.3 Floating Capsule Navigation Bar
Pill-shaped floating navigation with active pill indicator.

```html
<nav class="nav-capsule">
  <button class="nav-pill active">Home</button>
  <button class="nav-pill">About</button>
  <button class="nav-pill">Services</button>
  <button class="nav-pill">Pricing</button>
  <button class="nav-pill">Contact</button>
</nav>
```

```css
.nav-capsule {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.nav-pill {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
  background: transparent;
  padding: 0.45rem 1.1rem;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.nav-pill.active {
  color: #ffffff;
  background: var(--gradient-primary);
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(87, 51, 37, 0.2);
}
```

---

## 5. 3D Spatial Flip Card System

Cards with genuine 3D perspective, non-linear easing, index-based spatial tilt, and internal floating layers (`translateZ`).

```css
/* Card Container */
.step-card-container {
  perspective: 1400px;
  height: 275px;
  width: 100%;
}

.step-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.2, 0.85, 0.25, 1.15), filter 0.6s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

/* Base Hover Flip */
.step-card-container:hover .step-card-inner {
  transform: translateY(-10px) translateZ(40px) rotateY(180deg);
}

/* Unique Spatial Variations per Column */
.step-card-container:nth-child(1):hover .step-card-inner {
  transform: translateY(-12px) translateZ(50px) rotateY(180deg) rotateX(-5deg) rotateZ(1.5deg);
}
.step-card-container:nth-child(2):hover .step-card-inner {
  transform: translateY(-12px) translateZ(50px) rotateY(-180deg) rotateX(5deg) rotateZ(-1.5deg);
}
.step-card-container:nth-child(3):hover .step-card-inner {
  transform: translateY(-12px) translateZ(50px) rotateY(180deg) rotateX(6deg) rotateZ(-1deg);
}
.step-card-container:nth-child(4):hover .step-card-inner {
  transform: translateY(-12px) translateZ(50px) rotateY(-180deg) rotateX(-5deg) rotateZ(2deg);
}

/* Front & Back Faces */
.step-card-front,
.step-card-back {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  transform-style: preserve-3d;
}

/* Front Face: Warm Glass Frosted */
.step-card-front {
  background: rgba(254, 250, 223, 0.08);
  border: 1px solid rgba(254, 250, 223, 0.2);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
  transform: rotateY(0deg) translateZ(1px);
}

/* Back Face: Executive Walnut Bronze */
.step-card-back {
  background: linear-gradient(145deg, #573325 0%, #2f1b13 100%);
  border: 1.5px solid #D3A373;
  backdrop-filter: blur(16px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(211, 163, 115, 0.3);
  transform: rotateY(180deg) translateZ(1px);
}

/* Internal Elements 3D Depth */
.step-card-front > *,
.step-card-back > * {
  transform: translateZ(25px);
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.step-card-container:hover .step-card-front > *,
.step-card-container:hover .step-card-back > * {
  transform: translateZ(35px);
}
```

---

## 6. Glass Cards, Panels & Text Gradients

```css
/* Glass Card */
.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.glass-card:hover {
  border-color: var(--border-highlight);
  box-shadow: var(--shadow-md);
}

/* Glass Header / Topbar Panel */
.glass-panel {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
}

/* Metallic Text Gradient */
.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 7. Forms, Inputs, Badges & Tables

### 7.1 Form Controls
```css
.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.65rem 0.9rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-main);
  font-size: 0.9rem;
  transition: border-color var(--transition-fast);
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(211, 163, 115, 0.25);
}
```

### 7.2 Semantic Badges
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
}

.badge-primary {
  background: rgba(211, 163, 115, 0.25);
  color: #573325;
  border: 1px solid rgba(211, 163, 115, 0.5);
}

.badge-success {
  background: rgba(5, 150, 105, 0.15);
  color: #047857;
  border: 1px solid rgba(5, 150, 105, 0.3);
}

.badge-warning {
  background: rgba(217, 119, 6, 0.15);
  color: #b45309;
  border: 1px solid rgba(217, 119, 6, 0.3);
}
```

### 7.3 Custom Executive Data Table
```css
.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
}

.custom-table th {
  background: var(--bg-tertiary);
  color: var(--text-main);
  font-weight: 700;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.custom-table td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
}

.custom-table tbody tr:hover {
  background-color: rgba(211, 163, 115, 0.12);
}
```

---

## 8. Summary Checklist for Designing in AayStyle
1. **Never use sterile plain white or harsh jet-black** - use `#FEFADF` as the foundation, paired with `#573325` for typography and primary buttons.
2. **Apply the 5-layer twill background** to body/containers to give surfaces a woven, tactile feel.
3. **Use the Denim Bronze button (`.btn-denim`)** for high-priority CTA conversions.
4. **Use 3D perspective (`perspective: 1400px`, `transform-style: preserve-3d`)** with individual axis tilts on feature card interactions.
5. **Use Champagne Gold (`#D3A373`)** for glows, focus rings, and accent linear gradients.
