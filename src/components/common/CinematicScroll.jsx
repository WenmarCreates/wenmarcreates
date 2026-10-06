import React, { useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";

/**
 * CinematicScroll
 * Zero-overhead cinematic scroll progress indicator and smooth viewport tracking.
 * Operates purely via direct DOM manipulation (no React re-renders during scrolling),
 * completely eliminating scroll flickering and frame drops.
 */
export const CinematicScroll = () => {
  const { currentView } = useApp();
  const progressBarRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      if (!progressBarRef.current) return;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      progressBarRef.current.style.transform = `scaleX(${progress})`;
      progressBarRef.current.style.opacity = progress > 0.005 ? "1" : "0";
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [currentView]);

  return (
    <div
      ref={progressBarRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "2.5px",
        background: "linear-gradient(90deg, #D3A373 0%, #FEFADF 50%, #D3A373 100%)",
        boxShadow: "0 0 10px rgba(211, 163, 115, 0.8), 0 0 3px rgba(254, 250, 223, 0.9)",
        zIndex: 99999,
        pointerEvents: "none",
        transformOrigin: "left center",
        transform: "scaleX(0)",
        opacity: 0,
        transition: "opacity 0.25s ease",
        willChange: "transform"
      }}
    />
  );
};
