---
name: aaystyle-design-system
description: >-
  Use this skill whenever building, styling, or refactoring UI in the AayStyle luxury warm
  bronze & denim aesthetic. Covers the signature woven multi-layered background, 3D Three.js
  interactive honeycomb grid, denim-bronze tactile buttons, 3D spatial flip cards, floating
  capsule navigation, and warm executive color tokens (#FEFADF, #D3A373, #EEDCAC, #573325).
---

# AayStyle Design System & UI Skill

Use this skill whenever creating landing pages, dashboards, components, or styles following the **AayStyle** luxury SaaS aesthetic.

## Trigger Scenarios
Activate this skill when:
- The user requests "AayStyle design", "AayStyle theme", or "AayStyle look and feel".
- The user wants a warm, organic, tactile luxury aesthetic (cream, gold bronze, denim, leather) rather than cold stark white or neon cyberpunk dark mode.
- The user asks for the "signature denim button", "textured background", "honeycomb 3D wave background", or "3D flip cards".
- The user asks to style buttons, cards, forms, tables, or entire web applications in this brand identity.

---

## 1. Design Philosophy & Token Hierarchy

The AayStyle design language merges luxury paper goods, textured twill denim, and warm metallic bronze:
- **Base Canvas (`#FEFADF`)**: Soft warm linen/cream that eliminates eye strain and provides an organic foundation.
- **Contrast Typography & Brand Dark (`#573325`)**: Deep espresso walnut leather used for headings, high-contrast readable text, and primary tactile buttons.
- **Metallic Gold Bronze (`#D3A373`)**: Champagne amber metallic used for glow borders, active pills, gradients, and focus states.
- **Secondary Sand (`#EEDCAC`)**: Warm oatmeal sand used for table headers, secondary buttons, and capsule navigation tracks.
- **Tactile Materiality**: Repeating diagonal micro-twills and SVG fractal noise create physical depth rather than flat digital pixels.

### CSS Variables
```css
:root {
  --bg-primary: #FEFADF;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #EEDCAC;
  --bg-card: #FFFDF5;
  --bg-card-hover: #FFFFFF;
  --bg-glass: rgba(254, 250, 223, 0.85);
  --bg-input: #FFFFFF;

  --border-color: rgba(87, 51, 37, 0.14);
  --border-focus: #D3A373;
  --border-highlight: rgba(211, 163, 115, 0.5);

  --text-main: #573325;
  --text-muted: #7c5140;
  --text-subtle: #9e7564;

  --accent-primary: #D3A373;
  --accent-secondary: #EEDCAC;
  --accent-tertiary: #573325;

  --gradient-primary: linear-gradient(135deg, #D3A373 0%, #573325 100%);
  --gradient-glow: linear-gradient(135deg, rgba(211, 163, 115, 0.22) 0%, rgba(238, 220, 172, 0.4) 100%);
  
  --shadow-sm: 0 2px 8px rgba(87, 51, 37, 0.06);
  --shadow-md: 0 8px 24px rgba(87, 51, 37, 0.1);
  --shadow-lg: 0 16px 40px rgba(87, 51, 37, 0.16);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-full: 9999px;

  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 2. Signature Background Implementations

### A. Pure CSS Multi-Layered Textured Weave (Fast, Full-Page)
Always apply this to the `body` or main wrapper container:

```css
body {
  min-height: 100vh;
  background-color: #FEFADF;
  background-image: 
    radial-gradient(ellipse at 50% 0%, rgba(211, 163, 115, 0.2) 0%, rgba(254, 250, 223, 0.4) 100%),
    repeating-linear-gradient(45deg, rgba(87, 51, 37, 0.045) 0px, rgba(87, 51, 37, 0.045) 1px, transparent 1px, transparent 4px),
    repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.65) 0px, rgba(255, 255, 255, 0.65) 2px, transparent 2px, transparent 5px),
    repeating-linear-gradient(90deg, rgba(87, 51, 37, 0.025) 0px, rgba(87, 51, 37, 0.025) 1px, transparent 1px, transparent 3px),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.06'/%3E%3C/svg%3E");
  background-attachment: fixed;
  color: var(--text-main);
}
```

### B. Interactive Three.js Honeycomb Hex Mesh (Hero Section)
Use in Hero sections behind headings and CTAs:
1. Use an `InstancedMesh` with ~1,000-1,400 instances (`COLS = 42`, `ROWS = 32`, `HEX_RADIUS = 0.52`).
2. Track pointer position in world space and apply smooth exponential distance displacement:
   `mouseFactor = Math.max(0, 1 - dist / 7.0) * 0.9`.
3. Combine with dual organic sine waves:
   `wave = Math.sin(x * 0.35 + t * 0.5) * Math.cos(y * 0.3 + t * 0.4) + Math.sin(r * 0.4 - t * 0.6) * 0.5`.
4. Add a warm bottom gradient fade overlay (`rgba(254, 250, 223, 0.4)` to `#FEFADF`) to blend seamlessly into downstream content.

---

## 3. Button Design Rules

### A. The Signature "Denim Bronze" Tactile CTA Button
Used for primary conversions:
- **Background**: Multi-gradient with crosshatch micro-lines.
- **Top Rim Specular**: `inset 0 1px 0 rgba(255, 255, 255, 0.25)`.
- **Shadow**: `0 4px 14px rgba(87, 51, 37, 0.25)`.
- **Hover**: Lift `translateY(-2px)`, shadow `0 6px 20px rgba(87, 51, 37, 0.4)`, border-color `rgba(254, 250, 223, 0.8)`.

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
  padding: 0.65rem 1.4rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(211, 163, 115, 0.5);
  box-shadow: 0 4px 14px rgba(87, 51, 37, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-denim:hover,
.gradient-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(87, 51, 37, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  border-color: rgba(254, 250, 223, 0.8);
}
```

### B. Secondary Warm Sand Button
```css
.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  font-weight: 700;
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

### C. Floating Pill Navigation Capsule
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

## 4. 3D Spatial Flip Card System

When presenting features or multi-step processes:
- Set `perspective: 1400px` on container and `transform-style: preserve-3d` on the inner card.
- Apply unique slight multi-axis tilts (`rotateX`, `rotateZ`, `translateZ`) per column index on hover.
- Float interior elements in 3D using `transform: translateZ(25px)` -> `translateZ(35px)`.
- Front face: Warm frosted glass (`rgba(254, 250, 223, 0.08)`).
- Back face: Deep luxury walnut leather (`linear-gradient(145deg, #573325 0%, #2f1b13 100%)`).

```css
.step-card-container {
  perspective: 1400px;
  height: 275px;
  width: 100%;
}

.step-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.2, 0.85, 0.25, 1.15);
  transform-style: preserve-3d;
}

.step-card-container:hover .step-card-inner {
  transform: translateY(-10px) translateZ(40px) rotateY(180deg);
}

.step-card-container:nth-child(1):hover .step-card-inner {
  transform: translateY(-12px) translateZ(50px) rotateY(180deg) rotateX(-5deg) rotateZ(1.5deg);
}
.step-card-container:nth-child(2):hover .step-card-inner {
  transform: translateY(-12px) translateZ(50px) rotateY(-180deg) rotateX(5deg) rotateZ(-1.5deg);
}
```

---

## 5. Implementation Rules & Best Practices

1. **Avoid Generic Pure White or Flat Black**: Always anchor layouts to `#FEFADF` (canvas) and `#573325` (text & dark chrome).
2. **Always Include Textural Gradients on Primary Buttons**: A flat brown button looks dull; the double repeating twill lines and top specular rim make it feel like premium bespoke hardware.
3. **Use Subtle Amber Focus Rings**: For input fields, use `box-shadow: 0 0 0 3px rgba(211, 163, 115, 0.25)` and `border-color: #D3A373`.
4. **Frosted Glass Elevation**: Use `backdrop-filter: blur(16px)` with `background: rgba(254, 250, 223, 0.85)` for sticky headers and modal backdrops.
