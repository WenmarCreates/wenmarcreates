import React, { useEffect, useRef, useId } from "react";

export function AnimatedText({
  text = "",
  fontSize,
  minWeight = 200,
  maxWeight = 850,
  animationDuration = 1.5,
  delayMultiplier = 0.22,
  color = "#703E20",
  as = "span",
  className = "",
  style = {}
}) {
  const containerRef = useRef(null);
  const rawId = useId();
  const animId = "breath-" + rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    if (!containerRef.current) return;

    const spans = containerRef.current.querySelectorAll(".animated-char");
    const numLetters = spans.length;

    spans.forEach((span, i) => {
      const mappedIndex = i - numLetters / 2;
      span.style.animationDelay = mappedIndex * delayMultiplier + "s";
    });
  }, [text, delayMultiplier]);

  const numLetters = text.length;
  const characters = text.split("").map((char, index) => {
    const mappedIndex = index - numLetters / 2;
    return (
      <span
        key={index}
        className="animated-char"
        aria-hidden="true"
        style={{
          display: "inline-block",
          animation: `${animId} ${animationDuration}s alternate cubic-bezier(0.37, 0, 0.63, 1) infinite`,
          animationDelay: `${mappedIndex * delayMultiplier}s`,
          animationFillMode: "both",
          fontVariationSettings: `"wght" ${minWeight}`,
          color: color || "inherit"
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    );
  });

  const Component = as;

  return (
    <Component
      ref={containerRef}
      aria-label={text}
      className={`animated-text-wrap ${className}`}
      style={{
        display: as === "span" ? "inline-block" : "flex",
        justifyContent: as !== "span" ? "center" : undefined,
        alignItems: as !== "span" ? "center" : undefined,
        whiteSpace: "nowrap",
        ...(fontSize ? { fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize } : {}),
        fontFeatureSettings: '"wght"',
        color: color || "inherit",
        ...style
      }}
    >
      {characters}
      <style>{`
        @keyframes ${animId} {
          0% {
            font-variation-settings: "wght" ${minWeight};
            font-weight: ${minWeight};
          }
          100% {
            font-variation-settings: "wght" ${maxWeight};
            font-weight: ${maxWeight};
          }
        }
      `}</style>
    </Component>
  );
}

export default AnimatedText;
