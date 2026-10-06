"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * RandomLetterSwap
 * An ultra-smooth, physics-based text animation component.
 * On hover or click, each letter swaps into place with a randomized staggered spring roll.
 * 
 * @param {string} label - The text label to display.
 * @param {boolean} [reverse=true] - Swap direction (top-to-bottom or bottom-to-top).
 * @param {object} [transition] - Animation duration and physics configuration.
 * @param {number} [staggerDuration=0.025] - Delay interval (in seconds) between each random letter swap.
 * @param {string} [className] - Additional CSS classes.
 * @param {function} [onClick] - Click handler.
 */
export const RandomLetterSwap = React.forwardRef(function RandomLetterSwap({
  label = "",
  reverse = true,
  transition = { duration: 0.6, type: "spring" },
  staggerDuration = 0.025,
  className,
  style,
  trigger,
  autoLoop = false,
  alwaysActive = false,
  loopInterval = 2000,
  initialDelay = 400,
  onClick,
  ...props
}, ref) {
  const [isSwapping, setIsSwapping] = useState(false);
  const [delays, setDelays] = useState({});
  const blockedRef = useRef(false);
  const timerRef = useRef(null);

  const duration = transition?.duration || 0.6;
  const letters = Array.from(label || "");

  const triggerSwap = useCallback(() => {
    if (blockedRef.current || letters.length === 0) return;
    blockedRef.current = true;

    // Generate random permutation of indices
    const shuffled = Array.from({ length: letters.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);

    const calculatedDelays = {};
    shuffled.forEach((letterIndex, order) => {
      calculatedDelays[letterIndex] = order * staggerDuration;
    });

    setDelays(calculatedDelays);
    setIsSwapping(true);

    const totalTimeMs = (letters.length * staggerDuration + duration) * 1000 + 40;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsSwapping(false);
      blockedRef.current = false;
    }, totalTimeMs);
  }, [letters.length, staggerDuration, duration]);

  React.useImperativeHandle(ref, () => ({
    trigger: triggerSwap
  }), [triggerSwap]);

  useEffect(() => {
    if (trigger) {
      triggerSwap();
    }
  }, [trigger, triggerSwap]);

  // Continuous auto-looping animation when alwaysActive or autoLoop is enabled
  useEffect(() => {
    if (!autoLoop && !alwaysActive) return;

    let loopTimeout = null;
    let isCancelled = false;

    const scheduleNext = (delayMs) => {
      loopTimeout = setTimeout(() => {
        if (isCancelled) return;
        triggerSwap();
        const cycleTime = (letters.length * staggerDuration + duration) * 1000 + loopInterval;
        scheduleNext(cycleTime);
      }, delayMs);
    };

    scheduleNext(initialDelay);

    return () => {
      isCancelled = true;
      if (loopTimeout) clearTimeout(loopTimeout);
    };
  }, [autoLoop, alwaysActive, triggerSwap, letters.length, staggerDuration, duration, loopInterval, initialDelay]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = (e) => {
    triggerSwap();
    if (onClick) onClick(e);
  };

  // Luxury spring cubic-bezier for physical bounce
  const springEasing = "cubic-bezier(0.34, 1.56, 0.64, 1)";

  return (
    <span
      aria-label={label}
      className={cn(
        "random-letter-swap-root relative inline-flex items-center justify-center select-none",
        className
      )}
      style={{
        display: "inline-flex",
        position: "relative",
        verticalAlign: "middle",
        ...style
      }}
      onMouseEnter={triggerSwap}
      onClick={handleClick}
      {...props}
    >
      <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", border: 0 }}>
        {label}
      </span>
      {letters.map((letter, i) => {
        const delay = delays[i] || 0;
        const isSpace = letter === " ";
        const displayChar = isSpace ? "\u00A0" : letter;

        return (
          <span
            key={i}
            aria-hidden="true"
            className="random-letter-col relative inline-block overflow-hidden"
            style={{
              position: "relative",
              display: "inline-block",
              overflow: "hidden",
              whiteSpace: "pre",
              lineHeight: "1.25",
              verticalAlign: "bottom",
              paddingBottom: "0.08em"
            }}
          >
            {/* Primary Original Letter */}
            <span
              className={`letter-${i} inline-block`}
              style={{
                display: "inline-block",
                transform: isSwapping
                  ? `translateY(${reverse ? "100%" : "-100%"})`
                  : "translateY(0%)",
                transition: isSwapping
                  ? `transform ${duration}s ${springEasing} ${delay}s`
                  : "none",
                willChange: isSwapping ? "transform" : "auto"
              }}
            >
              {displayChar}
            </span>

            {/* Secondary Incoming Letter */}
            <span
              className={`letter-secondary-${i} absolute left-0`}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                display: "inline-block",
                transform: isSwapping
                  ? "translateY(0%)"
                  : `translateY(${reverse ? "-100%" : "100%"})`,
                transition: isSwapping
                  ? `transform ${duration}s ${springEasing} ${delay}s`
                  : "none",
                willChange: isSwapping ? "transform" : "auto"
              }}
            >
              {displayChar}
            </span>
          </span>
        );
      })}
    </span>
  );
});

export default RandomLetterSwap;
