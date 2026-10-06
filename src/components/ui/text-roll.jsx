"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
} from "motion/react";

const defaultVariants = {
  enter: {
    animate: { rotateX: 90 },
    initial: { rotateX: 0 },
  },
  exit: {
    animate: { rotateX: 0 },
    initial: { rotateX: 90 },
  },
};

/**
 * TextRoll
 * 3D split-flap perspective rolling text animation.
 * Each letter rolls along the 3D X-axis with staggered delays.
 * Supports auto-looping (always active) as well as hover triggers.
 */
export function TextRoll({
  children = "",
  duration = 0.5,
  getEnterDelay = (i) => i * 0.08,
  getExitDelay = (i) => i * 0.08 + 0.15,
  className = "",
  style = {},
  transition = { ease: [0.34, 1.56, 0.64, 1] }, // Physics spring-like bounce
  variants,
  alwaysActive = true,
  loopInterval = 2200,
  initialDelay = 400,
  onAnimationComplete,
}) {
  const letters = (typeof children === "string" ? children : String(children || "")).split("");
  const [rollKey, setRollKey] = useState(0);
  const timerRef = useRef(null);
  const isHoverBlockedRef = useRef(false);

  const triggerNextRoll = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRollKey((k) => k + 1);
  }, []);

  const handleLastLetterComplete = () => {
    if (onAnimationComplete) onAnimationComplete();
    if (alwaysActive) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        triggerNextRoll();
      }, loopInterval);
    }
  };

  useEffect(() => {
    if (alwaysActive) {
      timerRef.current = setTimeout(() => {
        triggerNextRoll();
      }, initialDelay);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [alwaysActive, initialDelay, triggerNextRoll]);

  const handleMouseEnter = () => {
    if (isHoverBlockedRef.current) return;
    isHoverBlockedRef.current = true;
    triggerNextRoll();
    setTimeout(() => {
      isHoverBlockedRef.current = false;
    }, (letters.length * 0.08 + duration) * 1000 + 100);
  };

  return (
    <span
      className={`text-roll-root relative inline-flex items-center select-none ${className}`}
      style={{
        display: "inline-flex",
        position: "relative",
        verticalAlign: "middle",
        cursor: "pointer",
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
    >
      {letters.map((letter, i) => {
        const isSpace = letter === " ";
        const displayChar = isSpace ? "\u00A0" : letter;
        const enterDelay = getEnterDelay(i);
        const exitDelay = getExitDelay(i);

        return (
          <span
            aria-hidden="true"
            key={`${i}-${rollKey}`}
            className="perspective-[10000px] transform-3d relative inline-block w-auto"
            style={{
              perspective: "1000px",
              WebkitPerspective: "1000px",
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              position: "relative",
              display: "inline-block",
              width: "auto",
            }}
          >
            {/* Primary Exiting Letter: rotates forward from 0 to 90deg */}
            <motion.span
              animate={variants?.enter?.animate ?? defaultVariants.enter.animate}
              className="backface-hidden absolute inline-block origin-[50%_25%]"
              initial={variants?.enter?.initial ?? defaultVariants.enter.initial}
              transition={{
                ...transition,
                delay: enterDelay,
                duration,
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                display: "inline-block",
                transformOrigin: "50% 25%",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                willChange: "transform",
              }}
            >
              {displayChar}
            </motion.span>

            {/* Secondary Entering Letter: rolls into place from 90deg to 0deg */}
            <motion.span
              animate={variants?.exit?.animate ?? defaultVariants.exit.animate}
              className="backface-hidden absolute inline-block origin-[50%_100%]"
              initial={variants?.exit?.initial ?? defaultVariants.exit.initial}
              onAnimationComplete={
                letters.length === i + 1 ? handleLastLetterComplete : undefined
              }
              transition={{
                ...transition,
                delay: exitDelay,
                duration,
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                display: "inline-block",
                transformOrigin: "50% 100%",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                willChange: "transform",
              }}
            >
              {displayChar}
            </motion.span>

            {/* Sizing Spacer Character (invisible to size width/height precisely) */}
            <span
              className="invisible"
              style={{
                visibility: "hidden",
                display: "inline-block",
                pointerEvents: "none",
              }}
            >
              {displayChar}
            </span>
          </span>
        );
      })}
      <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", border: 0 }}>
        {children}
      </span>
    </span>
  );
}

export default TextRoll;
