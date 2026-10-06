import { useEffect } from "react";

/**
 * useScrollSpatial Hook
 * Provides high-performance 3D spatial perspective reveals and parallax depth tracking.
 * Operates purely via IntersectionObserver and direct GPU-accelerated transforms (translate3d),
 * with ZERO continuous React re-renders during scrolling to prevent any frame drops or flickering.
 */
export function useScrollSpatial(containerRef, deps = []) {
  useEffect(() => {
    const root = containerRef?.current || document;

    // 1. Setup IntersectionObserver for 3D tilts and staggered card reveals
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -60px 0px",
      threshold: [0, 0.12, 0.2]
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          // Once revealed, keep revealed for permanent smooth stability
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const observeElements = () => {
      const targets = root.querySelectorAll(
        ".spatial-3d-tilt, .stagger-reveal-grid, .stagger-reveal-card"
      );
      targets.forEach((el) => {
        // If already in viewport on load, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40) {
          el.classList.add("is-revealed");
        } else {
          observer.observe(el);
        }
      });
    };

    observeElements();

    // 2. Parallax Depth Engine for Editorial Watermark Numerals & Seated Portrait
    let ticking = false;
    const watermarkElements = root.querySelectorAll(".parallax-watermark-num");
    const founderSeated = root.querySelector(".parallax-founder-seated");

    const updateParallax = () => {
      const windowHeight = window.innerHeight;

      // Update Parallax Editorial Watermarks
      watermarkElements.forEach((el) => {
        const rect = el.parentElement?.getBoundingClientRect() || el.getBoundingClientRect();
        // Calculate relative position to viewport center (-1 to 1)
        const centerOffset = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);
        // Subtle, elegant vertical float (-35px to +35px)
        const translateY = Math.round(centerOffset * -35);
        el.style.transform = `translate3d(0, ${translateY}px, 0)`;
      });

      // Update Parallax Seated Founder Portrait
      if (founderSeated) {
        const parentRect = founderSeated.parentElement?.getBoundingClientRect();
        if (parentRect) {
          const centerOffset = (parentRect.top + parentRect.height / 2 - windowHeight / 2) / (windowHeight / 2);
          const translateY = Math.round(centerOffset * -22);
          founderSeated.style.transform = `translate3d(0, ${translateY}px, 0)`;
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateParallax();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, deps);
}

export default useScrollSpatial;
