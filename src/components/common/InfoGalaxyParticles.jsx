import React, { useEffect, useRef } from "react";

/**
 * InfoGalaxyParticles Component
 * Creates an ethereal galaxy / cosmic stardust particle stream
 * located on the right side of the info container,
 * continuously flowing from the far right edge toward the left side.
 */
export default function InfoGalaxyParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Mouse coordinates relative to canvas for subtle interactive galaxy pull
    let mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    // Color palette matching AayStyle luxury cosmic aesthetic
    const colors = [
      { r: 255, g: 223, b: 158 }, // Warm Champagne Gold (#FFDF9E)
      { r: 211, g: 163, b: 115 }, // Warm Bronze Amber (#D3A373)
      { r: 254, g: 250, b: 223 }, // Celestial Cream Linen (#FEFADF)
      { r: 238, g: 220, b: 172 }, // Soft Stardust Oatmeal (#EEDCAC)
      { r: 245, g: 180, b: 105 }, // Luminous Amber Flare
      { r: 195, g: 160, b: 230 }  // Subtle Cosmic Violet Nebula
    ];

    // Particle class
    class GalaxyParticle {
      constructor(initialSpawn = false) {
        this.reset(initialSpawn);
      }

      reset(initialSpawn = false) {
        // Particles originate from the right side
        if (initialSpawn) {
          // Spread across right 45% initially for immediate visual fullness
          this.x = width * (0.55 + Math.random() * 0.45);
        } else {
          // New particles spawn at or slightly beyond the right edge
          this.x = width + Math.random() * 35;
        }

        this.y = Math.random() * height;

        // Flowing strictly from right to left (negative vx)
        const isComet = Math.random() < 0.12;
        this.isComet = isComet;

        if (isComet) {
          this.vx = -(1.8 + Math.random() * 1.8);
          this.radius = 1.0 + Math.random() * 1.6;
          this.trailLength = 16 + Math.random() * 26;
        } else {
          this.vx = -(0.5 + Math.random() * 1.25);
          this.radius = Math.random() < 0.75 
            ? 0.6 + Math.random() * 1.1   // Micro stardust
            : 1.6 + Math.random() * 2.2;  // Glowing stellar node
          this.trailLength = 0;
        }

        // Gentle harmonic vertical wave
        this.baseVy = (Math.random() - 0.5) * 0.25;
        this.waveAmp = 0.25 + Math.random() * 0.55;
        this.waveFreq = 0.02 + Math.random() * 0.03;
        this.phase = Math.random() * Math.PI * 2;

        // Stellar twinkle & glow
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.baseAlpha = 0.35 + Math.random() * 0.6;
        this.twinkleSpeed = 0.025 + Math.random() * 0.045;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.hasFlare = !isComet && this.radius > 2.0 && Math.random() < 0.35;
      }

      update(time) {
        // Move towards the left
        this.x += this.vx;

        // Subtle organic cosmic wave
        this.y += this.baseVy + Math.sin(time * this.waveFreq + this.phase) * this.waveAmp;

        // Mouse interaction: Gentle gravitational deflection if hovered near right
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const force = (1 - dist / 80) * 0.45;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
          }
        }

        // Left boundary: Particles smoothly dissolve and reset before reaching the left info text
        // Text is at left ~0% to 30%, particles travel across 100% down to ~22%
        const leftFadeBoundary = width * 0.22;
        if (this.x < leftFadeBoundary || this.y < -10 || this.y > height + 10) {
          this.reset(false);
        }
      }

      draw(ctx, time) {
        // Opacity fade profile:
        // - Fades in near right edge (x > width * 0.92)
        // - Full brightness through the right and mid-right (width * 0.92 down to width * 0.48)
        // - Smoothly fades out down to zero at leftFadeBoundary (width * 0.22)
        let edgeAlpha = 1;
        const leftFadeBoundary = width * 0.22;
        const leftFadeStart = width * 0.48;

        if (this.x < leftFadeStart) {
          edgeAlpha = Math.max(0, (this.x - leftFadeBoundary) / (leftFadeStart - leftFadeBoundary));
        } else if (this.x > width * 0.92) {
          edgeAlpha = Math.max(0, Math.min(1, (width - this.x + 30) / (width * 0.08 + 30)));
        }

        const twinkle = 0.68 + 0.32 * Math.sin(time * this.twinkleSpeed + this.twinklePhase);
        const finalAlpha = Math.min(1, Math.max(0, this.baseAlpha * twinkle * edgeAlpha));

        if (finalAlpha <= 0.01) return;

        const { r, g, b } = this.color;

        // 1. Comet trail streak streaming rightwards behind leftward particle
        if (this.isComet && this.trailLength > 0) {
          const grad = ctx.createLinearGradient(
            this.x, this.y,
            this.x + this.trailLength, this.y
          );
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.9})`);
          grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.4})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = this.radius * 1.2;
          ctx.lineCap = "round";
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + this.trailLength, this.y);
          ctx.stroke();
        }

        // 2. Halo glow for larger stellar nodes
        if (this.radius > 1.4) {
          const glowRadius = this.radius * 3.2;
          const radial = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, glowRadius
          );
          radial.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.6})`);
          radial.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.18})`);
          radial.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.beginPath();
          ctx.fillStyle = radial;
          ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Central core star
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 4. 4-point diffraction diamond sparkle for select bright stars
        if (this.hasFlare && finalAlpha > 0.45) {
          const flareLen = this.radius * 3.5;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${finalAlpha * 0.75})`;
          ctx.lineWidth = 0.75;
          // Horizontal cross
          ctx.moveTo(this.x - flareLen, this.y);
          ctx.lineTo(this.x + flareLen, this.y);
          // Vertical cross
          ctx.moveTo(this.x, this.y - flareLen);
          ctx.lineTo(this.x, this.y + flareLen);
          ctx.stroke();
        }
      }
    }

    // Soft nebula gas clouds on the far right
    const nebulaClouds = [
      { xRel: 0.94, yRel: 0.35, radius: 55, r: 211, g: 163, b: 115, alpha: 0.14, speed: 0.008, phase: 0 },
      { xRel: 0.88, yRel: 0.68, radius: 48, r: 255, g: 223, b: 158, alpha: 0.12, speed: 0.012, phase: 2 },
      { xRel: 0.98, yRel: 0.50, radius: 65, r: 195, g: 150, b: 220, alpha: 0.08, speed: 0.006, phase: 4 }
    ];

    let particles = [];
    const PARTICLE_COUNT = 65;

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new GalaxyParticle(true));
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles();
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(canvas);
    handleResize();

    let startTime = performance.now();

    const render = (now) => {
      const time = (now - startTime) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render subtle cosmic nebula clouds on the right
      for (let cloud of nebulaClouds) {
        const cx = width * cloud.xRel;
        const cy = height * cloud.yRel;
        const pulse = 1 + 0.15 * Math.sin(time * cloud.speed + cloud.phase);
        const curRadius = cloud.radius * pulse;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, curRadius);
        grad.addColorStop(0, `rgba(${cloud.r}, ${cloud.g}, ${cloud.b}, ${cloud.alpha})`);
        grad.addColorStop(0.6, `rgba(${cloud.r}, ${cloud.g}, ${cloud.b}, ${cloud.alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${cloud.r}, ${cloud.g}, ${cloud.b}, 0)`);

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(cx, cy, curRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render particles drifting right to left
      for (let p of particles) {
        p.update(time);
        p.draw(ctx, time);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="info-galaxy-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        display: "block"
      }}
      aria-hidden="true"
    />
  );
}
