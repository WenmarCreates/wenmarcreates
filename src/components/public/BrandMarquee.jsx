import * as React from "react";

const RATIO = 96 / 62;
const MAX_W = 124;
const MIN_RAIL_W = 100;
const EM = 11.2;
const RAIL_PITCH_MIN = 1.16;
const RAIL_PITCH_MAX = 1.62;
const CAROUSEL_PITCH = 1.2;
const GAP = 0.07;
const PERSPECTIVE = 900;
const MAX_STRETCH = 64;
const FIRST_DELAY = 1100;
const FLIP_DELAY = 700;
const SWING_K = 28;
const SWING_DAMP = 2.2;
const LAG = 0.12;
const REEL_K = 220;
const REEL_ZETA = 0.5;
const REST_Y = [9, -10, 7, -8, 10, -7, 8, -9];
const REST_Z = [-1.6, 1.2, -2, 1.5, -1, 1.8, -1.3, 2];
const DROPS = [6, 20, 0, 13, 22, 4, 16, 9];
const TONES = ["text-chart-1", "text-chart-2", "text-chart-3", "text-chart-4", "text-chart-5"];
const DEFAULT_LABELS = {
  flip: "Click or press Enter to flip the badge • Drag or pull down to interact",
  back: "Click again or press Esc to turn it back",
  show: "Show",
};

const METAL =
  "linear-gradient(to right, #3a2e27 0%, #e5d5c3 38%, #8c7362 70%, #2e231d 100%)";
const PLASTIC =
  "linear-gradient(180deg, #573e30 0%, #241710 100%)";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function random(seed) {
  let a = seed || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function qrPath(seed) {
  const size = 21;
  const next = random(seed);
  const corners = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ];
  let d = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const corner = corners.find(
        ([cx = 0, cy = 0]) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7
      );
      const quiet =
        (x < 8 && y < 8) ||
        (x >= size - 8 && y < 8) ||
        (x < 8 && y >= size - 8);
      let on;
      if (corner)
        on =
          Math.max(
            Math.abs(x - (corner[0] ?? 0) - 3),
            Math.abs(y - (corner[1] ?? 0) - 3)
          ) !== 2;
      else if (quiet) on = false;
      else if (x === 6 || y === 6) on = (x + y) % 2 === 0;
      else on = next() > 0.52;
      if (on) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
}

function barcode(seed) {
  const next = random(seed ^ 0x9e3779b9);
  let x = 0;
  let d = "";
  while (x < 92) {
    const w = 1 + Math.floor(next() * 3);
    d += `M${x} 0h${w}v20h-${w}z`;
    x += w + 1 + Math.floor(next() * 2.2);
  }
  return { d, width: x };
}

function soft(distance, max) {
  const knee = max * 0.75;
  if (distance <= knee) return distance;
  return (
    knee + (max - knee) * (1 - Math.exp(-(distance - knee) / (max - knee)))
  );
}

function geometry(W, items) {
  const u = W / MAX_W;
  const H = W * RATIO;
  const railR = Math.max(3, 4.2 * u);
  const railY = 14 + railR;
  const ring = 9 * u;
  const pivotY = railY + ring * 0.8;
  const strapW = Math.max(8, 11 * u);
  const crimp = 6 * u;
  const reel = 21 * u;
  const cordRest = 12 * u;
  const clipH = 13 * u;
  const clipW = 30 * u;
  const base = 56 * u;
  const straps = items.map(
    (item, i) => base + Math.max(0, item.drop ?? DROPS[i % DROPS.length] ?? 0) * u
  );
  const reelTops = straps.map((len) => pivotY + len + crimp * 0.6);
  const clipTops = reelTops.map((top) => top + reel * 0.82 + cordRest);
  const cardTops = clipTops.map((top) => top + clipH * 0.62);
  const pendulum = cardTops.map((top) => top + H / 2 - pivotY);
  const restLength =
    pivotY + base + crimp * 0.6 + reel * 0.82 + cordRest + clipH * 0.62 + H / 2 - pivotY;
  const bottom = Math.max(0, ...cardTops.map((top) => top + H));
  return {
    W,
    H,
    u,
    railR,
    railY,
    ring,
    pivotY,
    strapW,
    crimp,
    reel,
    cordRest,
    clipH,
    clipW,
    straps,
    reelTops,
    clipTops,
    cardTops,
    pendulum,
    swingK: pendulum.map((len) => (SWING_K * restLength) / len),
    couple: pendulum.map((len) => (0.25 * 57.3) / len),
    maxStretch: Math.round(MAX_STRETCH * Math.min(1, W / 118)),
    height: Math.ceil(bottom + 16 * u + 8),
  };
}

function layoutTargets(width, W, carousel, center, count) {
  if (!carousel) {
    const pitch = clamp(
      (width - 40 - W * 0.6) / Math.max(1, count),
      W * RAIL_PITCH_MIN,
      W * RAIL_PITCH_MAX
    );
    const start = width / 2 - (pitch * (count - 1)) / 2;
    return {
      xs: Array.from({ length: count }, (_, i) => start + i * pitch),
      total: 0,
    };
  }
  const pitch = W * CAROUSEL_PITCH;
  const total = pitch * count;
  const cyclic = count > 2 && total >= width + W * 2;
  const c = center ?? 0;
  const xs = Array.from({ length: count }, (_, i) => {
    let k = i - c;
    if (cyclic) {
      k = ((k % count) + count) % count;
      if (k >= count / 2) k -= count;
    }
    return width / 2 + k * pitch;
  });
  return { xs, total: cyclic ? total : 0 };
}

function emptySim() {
  return {
    x: [],
    vx: [],
    px: [],
    tx: [],
    sw: [],
    vsw: [],
    beta: [],
    ry: [],
    vry: [],
    tr: [],
    rz: [],
    vrz: [],
    tz: [],
    lift: [],
    vlift: [],
    tl: [],
    pop: [],
    vpop: [],
    tp: [],
    st: [],
    vst: [],
    drag: -1,
    grab: 0,
    pull: -1,
    free: 0,
    last: 0,
    raf: 0,
    carousel: null,
  };
}

function spring(value, velocity, target, i, k, zeta, h) {
  const v = velocity[i] ?? 0;
  const x = value[i] ?? 0;
  const next = v + (-k * (x - target) - 2 * zeta * Math.sqrt(k) * v) * h;
  velocity[i] = next;
  value[i] = x + next * h;
}

function badgeWidth(s, W, i) {
  return W * (1 + 0.08 * (s.pop[i] ?? 0));
}

function minGap(s, W, a, b) {
  return (badgeWidth(s, W, a) + badgeWidth(s, W, b)) / 2 + W * GAP;
}

function stops(s, W, width, count) {
  return [
    W * 0.32 + badgeWidth(s, W, 0) / 2,
    width - W * 0.32 - badgeWidth(s, W, count - 1) / 2,
  ];
}

function cardEdge(s, g, i, side) {
  const theta = ((s.sw[i] ?? 0) * Math.PI) / 180;
  const psi = (((s.beta[i] ?? 0) + (s.rz[i] ?? 0)) * Math.PI) / 180;
  const scale = 1 + 0.08 * (s.pop[i] ?? 0);
  const clipDepth =
    (g.clipTops[i] ?? 0) + (s.st[i] ?? 0) - 4 * (s.lift[i] ?? 0) - g.pivotY;
  const offset = (g.cardTops[i] ?? 0) - (g.clipTops[i] ?? 0);
  const cx = (s.x[i] ?? 0) - clipDepth * Math.sin(theta);
  const half = (g.W / 2) * scale * Math.cos(psi) * side;
  return [
    cx + half - offset * scale * Math.sin(psi),
    cx + half - (offset + g.H) * scale * Math.sin(psi),
    clipDepth + offset * scale,
    clipDepth + (offset + g.H) * scale,
  ];
}

function LinkIcon({ label }) {
  if (/mail|@/i.test(label)) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        style={{ width: "1.05em", height: "1.05em", flexShrink: 0 }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <rect x="2" y="3.5" width="12" height="9" rx="1.6" />
        <path d="M2.6 4.6 8 8.9l5.4-4.3" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      style={{ width: "1.05em", height: "1.05em", flexShrink: 0 }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 11 11 5M6.2 5H11v4.8" />
    </svg>
  );
}

const LINK_ROW_STYLE = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.3em",
  borderRadius: "0.4em",
  padding: "0.14em 0.3em",
  fontSize: "0.68em",
  fontWeight: 600,
  lineHeight: 1.2,
  color: "#2A160D",
  textDecoration: "none",
};

function Band({ tone, tall }) {
  return (
    <span
      aria-hidden="true"
      className={tone}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        display: "block",
        height: tall ? "4.3em" : "2.15em",
        background:
          "repeating-linear-gradient(135deg, transparent 0 0.45em, rgba(255,255,255,0.12) 0.45em 0.56em), linear-gradient(180deg, color-mix(in oklab, currentColor 82%, white), currentColor 72%, color-mix(in oklab, currentColor 85%, black))",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "1px",
          background: "rgba(0, 0, 0, 0.18)",
        }}
      />
    </span>
  );
}

function Hole() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "50%",
        top: "0.72em",
        display: "block",
        height: "0.56em",
        width: "2.7em",
        transform: "translateX(-50%)",
        borderRadius: "9999px",
        background: "#1B110C",
        boxShadow:
          "inset 0 0.09em 0.2em rgba(0,0,0,0.65), 0 0.05em 0 rgba(255,255,255,0.35)",
      }}
    />
  );
}

function Finish() {
  return (
    <>
      <span
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "-50%",
          display: "block",
          width: "200%",
          opacity: 0.7,
          background:
            "linear-gradient(100deg, transparent 40%, rgba(255, 255, 255, 0.34) 48%, rgba(255, 255, 255, 0.1) 52%, transparent 58%)",
          transform: "translateX(var(--gx, 0%))",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          display: "block",
          background: "#000000",
          opacity: "var(--shade, 0)",
        }}
      />
    </>
  );
}

function Silhouette() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        color: "rgba(122, 84, 62, 0.45)",
      }}
    >
      <circle cx="20" cy="15" r="7" fill="currentColor" />
      <path d="M6 38c1.5-8 7-12 14-12s12.5 4 14 12z" fill="currentColor" />
    </svg>
  );
}

const BadgeFaces = React.memo(function BadgeFaces({ item, tone }) {
  const seed = React.useMemo(
    () => hash(`${item.id}:${item.name}`),
    [item.id, item.name]
  );
  const qr = React.useMemo(() => qrPath(seed), [seed]);
  const bars = React.useMemo(() => barcode(seed), [seed]);
  const digits = String(seed % 1000000000).padStart(9, "0");
  const [failed, setFailed] = React.useState(false);
  const tags = (item.tags ?? []).slice(0, 3);
  const links = (item.links ?? []).slice(0, 3);

  return (
    <>
      {/* Front Face */}
      <span
        data-face="front"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
          borderRadius: "0.85em",
          border: "1px solid rgba(211, 163, 115, 0.65)",
          background: "linear-gradient(180deg, #FFFDF9 0%, #FDF6E2 100%)",
          padding: "0 0.8em 0.7em",
          color: "#2A160D",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translateZ(1px)",
          boxSizing: "border-box",
        }}
      >
        <Band tone={tone} tall />
        <Hole />
        <span
          style={{
            position: "relative",
            marginTop: "2.05em",
            display: "block",
            width: "5.3em",
            height: "5.3em",
            flexShrink: 0,
            borderRadius: "9999px",
            background: "#FFFDF9",
            padding: "0.2em",
            boxShadow:
              "0 0.18em 0.55em rgba(42, 22, 13, 0.25), inset 0 0 0 1px rgba(211, 163, 115, 0.45)",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "9999px",
              background:
                "radial-gradient(circle at 32% 28%, #FFFFFF 0%, #F5E8CE 48%, #E0B78A 88%, #B37E4C 100%)",
            }}
          >
            {item.icon ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "54%",
                  height: "54%",
                  color: "#402216",
                  filter: "drop-shadow(0 1px 1px rgba(255,255,255,0.7))",
                }}
              >
                {item.icon}
              </span>
            ) : (
              <Silhouette />
            )}
            {!failed && item.image && (
              <img
                src={item.image}
                alt=""
                draggable={false}
                decoding="async"
                onError={() => setFailed(true)}
                style={{
                  pointerEvents: "none",
                  position: "absolute",
                  inset: 0,
                  display: "block",
                  width: "100%",
                  height: "100%",
                  userSelect: "none",
                  objectFit: "cover",
                }}
              />
            )}
          </span>
        </span>
        <span
          style={{
            marginTop: "0.55em",
            display: "block",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "center",
            fontSize: "1.06em",
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "#2A160D",
          }}
        >
          {item.name}
        </span>
        <span
          style={{
            marginTop: "0.15em",
            display: "block",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "center",
            fontSize: "0.78em",
            lineHeight: 1.35,
            fontWeight: 600,
            color: "#7A543E",
          }}
        >
          {item.role}
        </span>
        {item.team && (
          <span
            style={{
              marginTop: "0.45em",
              display: "block",
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
              fontSize: "0.56em",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#9A6B4E",
            }}
          >
            {item.team}
          </span>
        )}
        <span
          style={{
            marginTop: "auto",
            display: "block",
            width: "100%",
            borderTop: "1px dashed rgba(211, 163, 115, 0.65)",
            paddingTop: "0.5em",
          }}
        >
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${bars.width} 20`}
            preserveAspectRatio="none"
            style={{
              display: "block",
              height: "1.6em",
              width: "100%",
              color: "rgba(42, 22, 13, 0.82)",
            }}
          >
            <path d={bars.d} fill="currentColor" />
          </svg>
          <span
            style={{
              marginTop: "0.25em",
              display: "block",
              textAlign: "center",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.52em",
              letterSpacing: "0.32em",
              color: "#7A543E",
            }}
          >
            {digits}
          </span>
        </span>
        <Finish />
      </span>

      {/* Back Face */}
      <span
        data-face="back"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          borderRadius: "0.85em",
          border: "1px solid rgba(211, 163, 115, 0.65)",
          background: "linear-gradient(180deg, #FFFDF9 0%, #FDF6E2 100%)",
          color: "#2A160D",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg) translateZ(1px)",
          boxSizing: "border-box",
        }}
      >
        <Band tone={tone} />
        <Hole />
        <span
          style={{
            position: "absolute",
            left: "0.85em",
            right: "0.85em",
            top: "2.6em",
            display: "block",
          }}
        >
          <span
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.95em",
              fontWeight: 800,
              lineHeight: 1.2,
              color: "#2A160D",
            }}
          >
            {item.name}
          </span>
          <span
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.72em",
              lineHeight: 1.35,
              fontWeight: 600,
              color: "#7A543E",
            }}
          >
            {item.role}
          </span>
        </span>
        {item.bio && (
          <span
            style={{
              position: "absolute",
              left: "0.85em",
              right: "0.85em",
              top: "5.1em",
              display: "block",
            }}
          >
            <span
              data-bio
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontSize: "0.72em",
                lineHeight: 1.38,
                color: "#432618",
                fontWeight: 500,
              }}
            >
              {item.bio}
            </span>
          </span>
        )}
        {tags.length > 0 && (
          <span
            style={{
              position: "absolute",
              left: "0.85em",
              right: "0.85em",
              top: "9.8em",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.28em",
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: "block",
                  borderRadius: "9999px",
                  border: "1px solid rgba(211, 163, 115, 0.55)",
                  background: "rgba(238, 220, 172, 0.5)",
                  padding: "0.16em 0.58em",
                  fontSize: "0.58em",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: "#573325",
                }}
              >
                {tag}
              </span>
            ))}
          </span>
        )}
        {links.length > 0 && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "0.75em",
              left: "0.6em",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.1em",
              transition: "opacity 150ms ease",
              opacity: "var(--drawn, 1)",
            }}
          >
            {links.map((link) => (
              <span key={link.label} style={LINK_ROW_STYLE}>
                <LinkIcon label={link.label} />
                {link.label}
              </span>
            ))}
          </span>
        )}
        <svg
          aria-hidden="true"
          viewBox="-1 -1 23 23"
          style={{
            position: "absolute",
            bottom: "0.8em",
            right: "0.8em",
            width: "3.9em",
            height: "3.9em",
            color: "#2A160D",
          }}
        >
          <path d={qr} fill="currentColor" />
        </svg>
        <Finish />
      </span>

      {/* Card 3D Side Edges */}
      {[0, 1].map((side) => (
        <span
          key={side}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "0.85em",
            bottom: "0.85em",
            display: "block",
            width: "2px",
            [side ? "right" : "left"]: 0,
            transform: `translateX(${side ? 1 : -1}px) rotateY(90deg)`,
            background: "#D3A373",
          }}
        />
      ))}
    </>
  );
});

export function TeamLanyardRail({
  items,
  eyebrow,
  heading,
  caption,
  action,
  autoplay = false,
  interval = 2800,
  active: activeProp,
  onActiveChange,
  flipped: flippedProp,
  onFlippedChange,
  labels = DEFAULT_LABELS,
  className,
  style,
  ...rest
}) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const count = items.length;
  const stageRef = React.useRef(null);
  const slots = React.useRef([]);
  const swings = React.useRef([]);
  const straps = React.useRef([]);
  const cords = React.useRef([]);
  const hangs = React.useRef([]);
  const buttons = React.useRef([]);
  const flips = React.useRef([]);
  const shadows = React.useRef([]);
  const linkLayers = React.useRef([]);
  const sim = React.useRef(emptySim());
  const [size, setSize] = React.useState({ width: 0, W: MAX_W, carousel: false });
  const [innerActive, setInnerActive] = React.useState(null);
  const [innerFlipped, setInnerFlipped] = React.useState(null);
  const [focusIndex, setFocusIndex] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);
  const [playing, setPlaying] = React.useState(autoplay);
  const pendingOpen = React.useRef(-1);
  const pointer = React.useRef({
    id: -1,
    index: -1,
    x: 0,
    y: 0,
    mode: "",
    kind: "",
    lastX: 0,
    lastY: 0,
    lastT: 0,
    v: 0,
    swipe: 0,
    angle: 0,
    hoverX: 0,
    hoverT: 0,
    hoverHit: -1,
  });

  const valid = (value) =>
    value === null || value === undefined || value < 0 || value >= count
      ? null
      : value;
  const active = valid(activeProp !== undefined ? activeProp : innerActive);
  const flipped = valid(flippedProp !== undefined ? flippedProp : innerFlipped);
  const geo = React.useMemo(() => geometry(size.W, items), [size.W, items]);
  const live = React.useRef({
    active,
    flipped,
    size,
    geo,
    reduced,
    count,
    carouselIndex: 0,
    cyclic: false,
    activeControlled: false,
    flippedControlled: false,
  });
  live.current = {
    ...live.current,
    active,
    flipped,
    size,
    geo,
    reduced,
    count,
    activeControlled: activeProp !== undefined,
    flippedControlled: flippedProp !== undefined,
  };
  const callbacks = React.useRef({ onActiveChange, onFlippedChange });
  callbacks.current = { onActiveChange, onFlippedChange };

  const setActive = React.useCallback((index) => {
    const L = live.current;
    if (L.active === index) return;
    L.active = index;
    if (index !== null) L.carouselIndex = index;
    if (!L.activeControlled) setInnerActive(index);
    callbacks.current.onActiveChange?.(index);
  }, []);

  const setFlipped = React.useCallback((index) => {
    const L = live.current;
    if (L.flipped === index) return;
    const old = L.flipped;
    if (old !== null && linkLayers.current[old]?.contains(document.activeElement))
      buttons.current[old]?.focus({ preventScroll: true });
    L.flipped = index;
    if (!L.flippedControlled) setInnerFlipped(index);
    callbacks.current.onFlippedChange?.(index);
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    setPlaying(autoplay);
  }, [autoplay]);

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = (width) => {
      const n = Math.max(1, live.current.count);
      const railW = Math.min(MAX_W, (width - 40) / (n * RAIL_PITCH_MIN + 0.4));
      const carousel = railW < MIN_RAIL_W;
      const W = Math.round((carousel ? clamp(width * 0.3, 96, 118) : railW) * 4) / 4;
      setSize((old) =>
        Math.abs(old.width - width) < 0.5 &&
        old.carousel === carousel &&
        old.W === W
          ? old
          : { width, W, carousel }
      );
    };
    measure(stage.clientWidth);
    const observer = new ResizeObserver((entries) => {
      const box = entries[0];
      if (box) measure(box.contentRect.width);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [count]);

  const paint = React.useCallback((i) => {
    const s = sim.current;
    const g = live.current.geo;
    const slot = slots.current[i];
    if (!slot) return;
    slot.style.transform = `translate3d(${((s.x[i] ?? 0) - g.W / 2).toFixed(2)}px,0,0)`;
    const sw = s.sw[i] ?? 0;
    const swing = swings.current[i];
    if (swing) swing.style.transform = `rotate(${sw.toFixed(3)}deg)`;
    const st = s.st[i] ?? 0;
    straps.current[i]?.style.setProperty("--stretch", `${st.toFixed(2)}px`);
    const cord = cords.current[i];
    if (cord)
      cord.style.transform = `scaleY(${Math.max(
        0.12,
        (g.cordRest + st) / g.cordRest
      ).toFixed(4)})`;
    const lift = s.lift[i] ?? 0;
    const pop = s.pop[i] ?? 0;
    const hang = hangs.current[i];
    if (hang)
      hang.style.transform = `translate3d(0,${(st - 4 * lift).toFixed(
        2
      )}px,0) rotate(${((s.beta[i] ?? 0) - sw + (s.rz[i] ?? 0)).toFixed(
        3
      )}deg) scale(${(1 + 0.08 * pop).toFixed(4)})`;
    const ry = s.ry[i] ?? 0;
    const flip = flips.current[i];
    const facing = Math.abs(Math.cos((ry * Math.PI) / 180));
    if (flip) {
      flip.style.transform = `perspective(${PERSPECTIVE}px) rotateY(${ry.toFixed(
        2
      )}deg)`;
      flip.style.setProperty("--shade", ((1 - facing) * 0.45).toFixed(3));
      const phi = ((((ry + 90) % 180) + 180) % 180) - 90;
      flip.style.setProperty("--gx", `${(phi * 0.9).toFixed(1)}%`);
    }
    const shadow = shadows.current[i];
    if (shadow) {
      shadow.style.transform = `translate3d(${(
        g.W * 0.045 +
        lift * 3 * g.u
      ).toFixed(2)}px,${(g.H * 0.03 + lift * 7 * g.u).toFixed(
        2
      )}px,0) scale(${(
        Math.max(0.12, facing) *
        (1 + 0.03 * lift + 0.05 * pop)
      ).toFixed(3)},${(1 + 0.03 * lift + 0.05 * pop).toFixed(3)})`;
      shadow.style.opacity = (0.72 + 0.28 * lift).toFixed(3);
    }
    const layer = linkLayers.current[i];
    const on =
      !!layer &&
      Math.abs(ry - 180) < (layer.style.visibility === "visible" ? 24 : 9);
    if (layer) {
      layer.style.opacity = on ? "1" : "0";
      layer.style.visibility = on ? "visible" : "hidden";
    }
    flip?.style.setProperty("--drawn", on ? "0" : "1");
  }, []);

  const step = React.useCallback(
    (now) => {
      const s = sim.current;
      const L = live.current;
      const n = L.count;
      const g = L.geo;
      const { width, carousel } = L.size;
      const dt = s.last ? Math.min(0.1, (now - s.last) / 1000) : 1 / 60;
      s.last = now;
      const sub = Math.max(3, Math.ceil(dt / 0.006));
      const h = dt / sub;
      let busy = false;
      for (let k = 0; k < sub; k++) {
        for (let i = 0; i < n; i++) {
          const before = s.vx[i] ?? 0;
          if (i !== s.drag) {
            const restoring = now > s.free;
            const ax = restoring
              ? -130 * ((s.x[i] ?? 0) - (s.tx[i] ?? 0)) -
                2 * Math.sqrt(130) * 0.86 * before
              : -3.2 * before;
            s.vx[i] = before + ax * h;
            s.x[i] = (s.x[i] ?? 0) + (s.vx[i] ?? 0) * h;
          }
        }
        if (!carousel && n > 0) {
          const [left, right] = stops(s, g.W, width, n);
          if (s.drag >= 0) {
            const d = s.drag;
            for (let j = d - 1; j >= 0; j--) {
              const limit = (s.x[j + 1] ?? 0) - minGap(s, g.W, j, j + 1);
              if ((s.x[j] ?? 0) > limit) {
                s.x[j] = limit;
                s.vx[j] = Math.min(s.vx[j] ?? 0, s.vx[j + 1] ?? 0);
              }
            }
            for (let j = d + 1; j < n; j++) {
              const limit = (s.x[j - 1] ?? 0) + minGap(s, g.W, j - 1, j);
              if ((s.x[j] ?? 0) < limit) {
                s.x[j] = limit;
                s.vx[j] = Math.max(s.vx[j] ?? 0, s.vx[j - 1] ?? 0);
              }
            }
          } else {
            for (let pass = 0; pass < 3; pass++) {
              for (let j = 0; j < n - 1; j++) {
                const a = s.x[j] ?? 0;
                const b = s.x[j + 1] ?? 0;
                const overlap = minGap(s, g.W, j, j + 1) - (b - a);
                if (overlap <= 0) continue;
                s.x[j] = a - overlap / 2;
                s.x[j + 1] = b + overlap / 2;
                const va = s.vx[j] ?? 0;
                const vb = s.vx[j + 1] ?? 0;
                if (va > vb) {
                  const shared = (va + vb) / 2;
                  s.vx[j] = shared;
                  s.vx[j + 1] = shared;
                }
              }
            }
            if ((s.x[0] ?? 0) < left) {
              s.x[0] = left;
              s.vx[0] = Math.abs(s.vx[0] ?? 0) * 0.3;
            }
            for (let j = 1; j < n; j++)
              s.x[j] = Math.max(
                s.x[j] ?? 0,
                (s.x[j - 1] ?? 0) + minGap(s, g.W, j - 1, j)
              );
            if ((s.x[n - 1] ?? 0) > right) {
              s.x[n - 1] = right;
              s.vx[n - 1] = -Math.abs(s.vx[n - 1] ?? 0) * 0.3;
            }
            for (let j = n - 2; j >= 0; j--)
              s.x[j] = Math.min(
                s.x[j] ?? 0,
                (s.x[j + 1] ?? 0) - minGap(s, g.W, j, j + 1)
              );
          }
        }
        for (let i = 0; i < n; i++) {
          const dv = (s.vx[i] ?? 0) - (s.px[i] ?? 0);
          s.px[i] = s.vx[i] ?? 0;
          if (i !== s.pull) {
            const sw = s.sw[i] ?? 0;
            const vsw = clamp(
              (s.vsw[i] ?? 0) + (g.couple[i] ?? 0.07) * clamp(dv, -900, 900),
              -90,
              90
            );
            const next =
              vsw + (-(g.swingK[i] ?? SWING_K) * sw - SWING_DAMP * vsw) * h;
            s.vsw[i] = next;
            s.sw[i] = clamp(sw + next * h, -18, 18);
          }
          s.beta[i] =
            (s.beta[i] ?? 0) +
            ((s.sw[i] ?? 0) - (s.beta[i] ?? 0)) * Math.min(1, h / LAG);
          spring(s.ry, s.vry, s.tr[i] ?? 0, i, 170, 0.62, h);
          spring(s.rz, s.vrz, s.tz[i] ?? 0, i, 120, 0.8, h);
          spring(s.lift, s.vlift, s.tl[i] ?? 0, i, 200, 0.75, h);
          spring(s.pop, s.vpop, s.tp[i] ?? 0, i, 160, 0.55, h);
          if (i !== s.pull) {
            spring(s.st, s.vst, 0, i, REEL_K, REEL_ZETA, h);
            s.st[i] = Math.max(-g.cordRest * 0.85, s.st[i] ?? 0);
          }
        }
        for (let a = 0; a < n - 1; a++) {
          const b = a + 1;
          if ((s.x[b] ?? 0) <= (s.x[a] ?? 0)) continue;
          const [aTop, aBottom, aArmTop, aArmBottom] = cardEdge(s, g, a, 1);
          const [bTop, bBottom, bArmTop, bArmBottom] = cardEdge(s, g, b, -1);
          const topExcess = aTop - bTop + 2;
          const bottomExcess = aBottom - bBottom + 2;
          const excess = Math.max(topExcess, bottomExcess);
          if (excess <= 0) continue;
          const arm = Math.max(
            40,
            topExcess > bottomExcess
              ? (aArmTop + bArmTop) / 2
              : (aArmBottom + bArmBottom) / 2
          );
          const push = (Math.asin(clamp(excess / arm, 0, 1)) * 180) / Math.PI;
          const share = a === s.pull ? 0 : b === s.pull ? 1 : 0.5;
          s.sw[a] = clamp((s.sw[a] ?? 0) + push * share, -18, 18);
          s.beta[a] = (s.beta[a] ?? 0) + push * share;
          s.sw[b] = clamp((s.sw[b] ?? 0) - push * (1 - share), -18, 18);
          s.beta[b] = (s.beta[b] ?? 0) - push * (1 - share);
          const va = s.vsw[a] ?? 0;
          const vb = s.vsw[b] ?? 0;
          if (vb - va > 0) {
            const mean = (va + vb) / 2;
            if (a !== s.pull) s.vsw[a] = mean + (vb - va) * 0.15;
            if (b !== s.pull) s.vsw[b] = mean - (vb - va) * 0.15;
          }
        }
      }
      for (let i = 0; i < n; i++) {
        paint(i);
        if (
          Math.abs(s.vx[i] ?? 0) > 0.4 ||
          (now > s.free && Math.abs((s.x[i] ?? 0) - (s.tx[i] ?? 0)) > 0.25) ||
          Math.abs((s.ry[i] ?? 0) - (s.tr[i] ?? 0)) > 0.05 ||
          Math.abs(s.vry[i] ?? 0) > 0.05 ||
          Math.abs((s.rz[i] ?? 0) - (s.tz[i] ?? 0)) > 0.02 ||
          Math.abs(s.vrz[i] ?? 0) > 0.05 ||
          Math.abs((s.lift[i] ?? 0) - (s.tl[i] ?? 0)) > 0.002 ||
          Math.abs(s.vlift[i] ?? 0) > 0.01 ||
          Math.abs((s.pop[i] ?? 0) - (s.tp[i] ?? 0)) > 0.002 ||
          Math.abs(s.vpop[i] ?? 0) > 0.01 ||
          Math.abs(s.sw[i] ?? 0) > 0.02 ||
          Math.abs(s.vsw[i] ?? 0) > 0.05 ||
          Math.abs((s.beta[i] ?? 0) - (s.sw[i] ?? 0)) > 0.01 ||
          Math.abs(s.st[i] ?? 0) > 0.05 ||
          Math.abs(s.vst[i] ?? 0) > 0.1
        )
          busy = true;
      }
      if (s.drag >= 0 || s.pull >= 0 || now < s.free) busy = true;
      if (busy) s.raf = requestAnimationFrame(step);
      else {
        s.raf = 0;
        s.last = 0;
        for (let i = 0; i < n; i++) {
          if (now > s.free) {
            s.x[i] = s.tx[i] ?? 0;
            s.vx[i] = 0;
            s.px[i] = 0;
          }
          s.sw[i] = 0;
          s.vsw[i] = 0;
          s.beta[i] = 0;
          s.st[i] = 0;
          s.vst[i] = 0;
          s.ry[i] = s.tr[i] ?? 0;
          s.vry[i] = 0;
          s.rz[i] = s.tz[i] ?? 0;
          s.vrz[i] = 0;
          s.lift[i] = s.tl[i] ?? 0;
          s.vlift[i] = 0;
          s.pop[i] = s.tp[i] ?? 0;
          s.vpop[i] = 0;
          paint(i);
        }
      }
    },
    [paint]
  );

  const snap = React.useCallback(() => {
    const s = sim.current;
    for (let i = 0; i < live.current.count; i++) {
      s.x[i] = s.tx[i] ?? 0;
      s.vx[i] = 0;
      s.px[i] = 0;
      s.sw[i] = 0;
      s.vsw[i] = 0;
      s.beta[i] = 0;
      if (i !== s.pull) {
        s.st[i] = 0;
        s.vst[i] = 0;
      }
      s.ry[i] = s.tr[i] ?? 0;
      s.vry[i] = 0;
      s.rz[i] = s.tz[i] ?? 0;
      s.vrz[i] = 0;
      s.lift[i] = s.tl[i] ?? 0;
      s.vlift[i] = 0;
      s.pop[i] = s.tp[i] ?? 0;
      s.vpop[i] = 0;
      paint(i);
    }
  }, [paint]);

  const kick = React.useCallback(() => {
    const s = sim.current;
    if (live.current.reduced) {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      snap();
      return;
    }
    if (!s.raf) {
      s.last = 0;
      s.raf = requestAnimationFrame(step);
    }
  }, [snap, step]);

  const impulse = React.useCallback(
    (i, amount) => {
      const s = sim.current;
      if (live.current.reduced || i < 0 || i >= live.current.count) return;
      s.vsw[i] = (s.vsw[i] ?? 0) + amount;
      kick();
    },
    [kick]
  );

  const tug = React.useCallback(
    (i, amount) => {
      const s = sim.current;
      if (live.current.reduced || i < 0 || i >= live.current.count) return;
      s.vst[i] = (s.vst[i] ?? 0) + amount;
      kick();
    },
    [kick]
  );

  React.useLayoutEffect(() => {
    if (!size.width) return;
    const s = sim.current;
    const L = live.current;
    const center = size.carousel ? active ?? L.carouselIndex : null;
    const { xs, total } = layoutTargets(
      size.width,
      size.W,
      size.carousel,
      center,
      count
    );
    L.cyclic = total > 0;
    const fresh = s.x.length !== count || s.carousel !== size.carousel;
    s.carousel = size.carousel;
    for (let i = 0; i < count; i++) {
      const tx = (xs[i] ?? 0) + (size.carousel ? pointer.current.swipe : 0);
      if (!fresh && total > 0) {
        const shift = Math.round((tx - (s.tx[i] ?? tx)) / total) * total;
        if (shift) s.x[i] = (s.x[i] ?? 0) + shift;
      }
      s.tx[i] = tx;
      const front = flipped === i || active === i;
      s.tr[i] =
        flipped === i ? 180 : active === i ? 0 : REST_Y[i % REST_Y.length] ?? 0;
      s.tz[i] = front ? 0 : REST_Z[i % REST_Z.length] ?? 0;
      s.tl[i] = front ? 1 : 0;
      s.tp[i] = flipped === i ? 1 : 0;
      if (fresh) {
        s.x[i] = tx;
        s.vx[i] = 0;
        s.px[i] = 0;
        s.sw[i] = 0;
        s.vsw[i] = 0;
        s.beta[i] = 0;
        s.st[i] = 0;
        s.vst[i] = 0;
        s.ry[i] = s.tr[i] ?? 0;
        s.vry[i] = 0;
        s.rz[i] = s.tz[i] ?? 0;
        s.vrz[i] = 0;
        s.lift[i] = s.tl[i] ?? 0;
        s.vlift[i] = 0;
        s.pop[i] = s.tp[i] ?? 0;
        s.vpop[i] = 0;
      }
    }
    for (const key of [
      "x",
      "vx",
      "px",
      "tx",
      "sw",
      "vsw",
      "beta",
      "ry",
      "vry",
      "tr",
      "rz",
      "vrz",
      "tz",
      "lift",
      "vlift",
      "tl",
      "pop",
      "vpop",
      "tp",
      "st",
      "vst",
    ])
      s[key].length = count;
    if (fresh) for (let i = 0; i < count; i++) paint(i);
    kick();
  }, [size, active, flipped, count, paint, kick]);

  React.useEffect(() => {
    if (reduced) kick();
  }, [reduced, kick]);

  const swayed = React.useRef(false);
  const ready = size.width > 0;
  React.useEffect(() => {
    if (!ready || reduced || swayed.current) return;
    const timers = Array.from({ length: count }, (_, i) =>
      window.setTimeout(
        () => impulse(i, (i % 2 ? -1 : 1) * (30 - (i % 4) * 3)),
        60 + i * 70
      )
    );
    const done = window.setTimeout(() => {
      swayed.current = true;
    }, 80 + count * 70);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(done);
    };
  }, [ready, reduced, count, impulse]);

  React.useEffect(
    () => () => {
      cancelAnimationFrame(sim.current.raf);
      sim.current.raf = 0;
    },
    []
  );

  const previous = React.useRef({ active: null, flipped: null });
  React.useEffect(() => {
    const old = previous.current;
    const wrap = (i) => (live.current.cyclic ? ((i % count) + count) % count : i);
    if (old.active !== active) {
      if (active !== null) {
        impulse(wrap(active - 1), 16);
        impulse(wrap(active + 1), -16);
      }
      if (old.active !== null) {
        impulse(wrap(old.active - 1), -6);
        impulse(wrap(old.active + 1), 6);
      }
    }
    if (old.flipped !== flipped) {
      if (flipped !== null) {
        impulse(flipped, flipped % 2 ? 9 : -9);
        tug(flipped, 70);
      }
      if (old.flipped !== null) tug(old.flipped, 40);
    }
    previous.current = { active, flipped };
  }, [active, flipped, count, impulse, tug]);

  const stop = React.useCallback(() => setPlaying(false), []);

  React.useEffect(() => {
    if (!playing || reduced || count === 0 || !ready) return;
    let timer = 0;
    function front(index) {
      setActive(index);
      timer = window.setTimeout(() => flip(index), FLIP_DELAY);
    }
    function flip(index) {
      setFlipped(index);
      timer = window.setTimeout(() => {
        setFlipped(null);
        front((index + 1) % Math.max(1, live.current.count));
      }, interval);
    }
    const current = live.current.active;
    timer =
      current === null
        ? window.setTimeout(() => front(0), FIRST_DELAY)
        : window.setTimeout(() => flip(current), FLIP_DELAY);
    return () => window.clearTimeout(timer);
  }, [playing, reduced, count, ready, interval, setActive, setFlipped]);

  React.useEffect(() => {
    if (flipped === null) return;
    const onKey = (event) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const stage = stageRef.current;
      if (stage && event.target instanceof Node && stage.contains(event.target))
        return;
      setFlipped(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [flipped, setFlipped]);

  const toggle = React.useCallback(
    (index) => {
      stop();
      const next = live.current.flipped === index ? null : index;
      if (next !== null) setActive(index);
      setFlipped(next);
    },
    [stop, setActive, setFlipped]
  );

  const retarget = () => {
    const s = sim.current;
    const L = live.current;
    const { xs } = layoutTargets(
      L.size.width,
      L.size.W,
      L.size.carousel,
      L.size.carousel ? L.active ?? L.carouselIndex : null,
      L.count
    );
    for (let i = 0; i < L.count; i++)
      s.tx[i] = (xs[i] ?? 0) + (L.size.carousel ? pointer.current.swipe : 0);
    if (L.reduced) snap();
    else kick();
  };

  const feasible = (d) => {
    const s = sim.current;
    const L = live.current;
    const W = L.geo.W;
    const n = L.count;
    let [lo, hi] = stops(s, W, L.size.width, n);
    for (let k = 0; k < d; k++) lo += minGap(s, W, k, k + 1);
    for (let k = n - 1; k > d; k--) hi -= minGap(s, W, k - 1, k);
    return [lo, Math.max(lo, hi)];
  };

  const nearest = (clientX, clientY) => {
    const stage = stageRef.current;
    if (!stage) return null;
    const box = stage.getBoundingClientRect();
    const x = clientX - box.left;
    const y = clientY - box.top;
    const g = live.current.geo;
    const s = sim.current;
    if (y < g.railY - 12) return null;
    let best = null;
    let distance = Infinity;
    for (let i = 0; i < live.current.count; i++) {
      if (y > (g.cardTops[i] ?? 0) + g.H + Math.max(0, s.st[i] ?? 0) + 8)
        continue;
      const d = Math.abs(x - (s.x[i] ?? 0));
      if (d < g.W / 2 + 6 && d < distance) {
        best = i;
        distance = d;
      }
    }
    return best;
  };

  const onPointerMove = (event) => {
    const p = pointer.current;
    const s = sim.current;
    const L = live.current;
    const stage = stageRef.current;
    const now = performance.now();
    if (p.id === event.pointerId && stage) {
      const dx = event.clientX - p.x;
      const dy = event.clientY - p.y;
      if (!p.mode && Math.hypot(dx, dy) > 8) {
        if (Math.abs(dy) > Math.abs(dx))
          p.mode = dy > 0 && p.index >= 0 ? "pull" : "none";
        else
          p.mode = L.size.carousel
            ? "swipe"
            : p.index >= 0 && !L.reduced
            ? "drag"
            : "none";
        if (p.mode !== "none") {
          stop();
          if (stage.isConnected) stage.setPointerCapture(event.pointerId);
        }
        if (p.mode === "pull") s.pull = p.index;
        if (p.mode === "drag") {
          s.drag = p.index;
          s.grab =
            event.clientX -
            stage.getBoundingClientRect().left -
            (s.x[p.index] ?? 0);
        }
      }
      const elapsed = Math.max(1, now - p.lastT);
      p.v = p.v * 0.6 + ((event.clientX - p.lastX) / elapsed) * 0.4;
      p.lastX = event.clientX;
      p.lastY = event.clientY;
      p.lastT = now;
      if (p.mode === "pull") {
        const i = p.index;
        s.st[i] = soft(Math.max(0, dy), L.geo.maxStretch);
        s.vst[i] = 0;
        const angle = clamp(
          (-Math.atan2(dx, (L.geo.pendulum[i] ?? 200) + (s.st[i] ?? 0)) * 180) /
            Math.PI,
          -16,
          16
        );
        s.vsw[i] = ((angle - (s.sw[i] ?? 0)) / elapsed) * 1000 * 0.5;
        s.sw[i] = angle;
        if (L.reduced) paint(i);
        else kick();
      } else if (p.mode === "drag" && s.drag >= 0) {
        const [lo, hi] = feasible(s.drag);
        s.x[s.drag] = clamp(
          event.clientX - stage.getBoundingClientRect().left - s.grab,
          lo,
          hi
        );
        s.vx[s.drag] = p.v * 1000;
        s.free = now + 900;
        kick();
      } else if (p.mode === "swipe") {
        p.swipe = dx;
        retarget();
      }
      return;
    }
    if (event.pointerType !== "mouse" || p.id >= 0) return;
    const hit = nearest(event.clientX, event.clientY);
    const hoverV = (event.clientX - p.hoverX) / Math.max(1, now - p.hoverT);
    p.hoverX = event.clientX;
    p.hoverT = now;
    if (L.size.carousel) {
      const center = L.active ?? L.carouselIndex;
      if (hit !== null && hit === center && L.active !== hit) {
        stop();
        setActive(hit);
      }
      return;
    }
    if (hit !== null && hit !== p.hoverHit)
      impulse(hit, clamp(-hoverV * 22, -24, 24));
    p.hoverHit = hit ?? -1;
    if (hit !== null && hit !== L.active) {
      stop();
      setActive(hit);
    }
  };

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    const hit = nearest(event.clientX, event.clientY);
    const now = performance.now();
    pendingOpen.current = -1;
    pointer.current = {
      ...pointer.current,
      id: event.pointerId,
      index: hit ?? -1,
      x: event.clientX,
      y: event.clientY,
      mode: "",
      kind: event.pointerType,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: now,
      v: 0,
      swipe: 0,
    };
  };

  const finishPointer = (event, cancelled) => {
    const p = pointer.current;
    if (p.id !== event.pointerId) return;
    const s = sim.current;
    const L = live.current;
    const stage = stageRef.current;
    if (stage?.hasPointerCapture(event.pointerId))
      stage.releasePointerCapture(event.pointerId);
    pointer.current = { ...p, id: -1 };
    if (p.mode === "pull") {
      const i = s.pull;
      s.pull = -1;
      if (L.reduced) {
        s.st[i] = 0;
        s.vst[i] = 0;
        s.sw[i] = 0;
        s.vsw[i] = 0;
        s.beta[i] = 0;
        paint(i);
      } else kick();
      return;
    }
    if (p.mode === "drag") {
      s.drag = -1;
      s.free = performance.now() + 700;
      kick();
      return;
    }
    if (p.mode === "swipe") {
      const dx = event.clientX - p.x;
      const n = L.count;
      const current = L.active ?? L.carouselIndex;
      const by =
        Math.abs(dx) > 40 || Math.abs(p.v) > 0.45 ? (dx < 0 ? 1 : -1) : 0;
      pointer.current.swipe = 0;
      const next = L.cyclic
        ? (((current + by) % n) + n) % n
        : clamp(current + by, 0, n - 1);
      if (next === L.active) retarget();
      else setActive(next);
      return;
    }
    if (cancelled || p.mode || p.index < 0) return;
    stop();
    if ((p.kind !== "mouse" || L.size.carousel) && L.active !== p.index)
      setActive(p.index);
    else pendingOpen.current = p.index;
  };

  const onKeyDown = (event) => {
    const L = live.current;
    if (event.key === "Escape") {
      if (L.flipped !== null) {
        event.preventDefault();
        setFlipped(null);
      }
      return;
    }
    const target = event.target instanceof HTMLElement ? event.target : null;
    const badge = target?.dataset.badge;
    if (event.key === "ArrowDown") {
      if (badge === undefined) return;
      event.preventDefault();
      stop();
      tug(Number(badge), 300);
      return;
    }
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    stop();
    const from = L.active ?? focusIndex;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
        ? L.count - 1
        : clamp(
            from + (event.key === "ArrowRight" ? 1 : -1),
            0,
            L.count - 1
          );
    setFocusIndex(next);
    setActive(next);
    buttons.current[next]?.focus({ preventScroll: true });
  };

  const g = geo;
  const W = g.W;
  const base = W / EM;
  const current = active ?? flipped;
  const person = current === null ? null : items[current] ?? null;
  const showingBack = current !== null && current === flipped;
  const centerIndex = size.carousel
    ? active ?? live.current.carouselIndex
    : null;
  const line1 = person ? `${person.name} — ${person.role}` : caption;
  const line2 = person ? (showingBack ? labels.back : labels.flip) : "";

  return (
    <section
      {...rest}
      data-slot="team-lanyard-rail"
      data-mode={size.carousel ? "carousel" : "rail"}
      data-active={active ?? ""}
      data-flipped={flipped ?? ""}
      className={`lanyard-rail-section ${className ?? ""}`}
      style={{
        position: "relative",
        isolation: "isolate",
        width: "100%",
        maxWidth: "1320px",
        margin: "0 auto",
        overflow: "hidden",
        background: "transparent",
        color: "#FEFADF",
        ...style,
      }}
    >
      {(eyebrow || heading) && (
        <header
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1.25rem 1.5rem 0",
            textAlign: "center",
          }}
        >
          {eyebrow && (
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                color: "#EEDCAC",
                margin: 0,
              }}
            >
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#FEFADF",
                margin: 0,
              }}
            >
              {heading}
            </h2>
          )}
        </header>
      )}

      <div
        ref={stageRef}
        data-stage
        role="group"
        aria-label={heading ?? "Tech Stack & Capabilities"}
        aria-roledescription="lanyard rail"
        style={{
          position: "relative",
          marginTop: "0.5rem",
          width: "100%",
          height: g.height,
          overflowX: "clip",
          touchAction: "pan-y",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={(event) => finishPointer(event, false)}
        onPointerCancel={(event) => finishPointer(event, true)}
        onPointerLeave={(event) => {
          pointer.current.hoverHit = -1;
          if (
            event.pointerType === "mouse" &&
            pointer.current.id < 0 &&
            !size.carousel &&
            !document.activeElement?.matches("[data-badge]:focus-visible")
          )
            setActive(null);
        }}
        onKeyDown={onKeyDown}
      >
        {/* Overhead Brushed Metal Rail */}
        <div
          aria-hidden="true"
          data-rail
          style={{
            pointerEvents: "none",
            position: "absolute",
            left: 0,
            right: 0,
            zIndex: 0,
            top: g.railY - g.railR,
            height: g.railR * 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: g.railR * 2 + 2,
              height: "12px",
              borderRadius: "9999px",
              background: "rgba(0, 0, 0, 0.32)",
              filter: "blur(5px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "9999px",
              background:
                "linear-gradient(to bottom, #f4e6d4 0%, #ffffff 20%, #d3a373 45%, #8c6239 72%, #3a2314 100%)",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.45)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "9999px",
              opacity: 0.4,
              mixBlendMode: "overlay",
              background:
                "repeating-linear-gradient(90deg, transparent 0 2px, rgba(255,255,255,0.45) 2px 3px, transparent 3px 7px)",
            }}
          />
          {!size.carousel &&
            [0, 1].map((side) => (
              <div
                key={side}
                style={{
                  position: "absolute",
                  top: "50%",
                  height: "28px",
                  width: "16px",
                  transform: "translateY(-50%)",
                  borderRadius: "3px",
                  [side ? "right" : "left"]: 6,
                  background:
                    "linear-gradient(to right, #e5d5c3 0%, #a88463 55%, #4a3325 100%)",
                  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.45)",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "4px",
                    width: "4px",
                    height: "4px",
                    transform: "translateX(-50%)",
                    borderRadius: "9999px",
                    background: "rgba(42, 22, 13, 0.65)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "4px",
                    width: "4px",
                    height: "4px",
                    transform: "translateX(-50%)",
                    borderRadius: "9999px",
                    background: "rgba(42, 22, 13, 0.65)",
                  }}
                />
              </div>
            ))}
        </div>

        {/* Hanging Lanyards */}
        {items.map((item, i) => {
          const tone =
            TONES[((item.tone ?? (i % 5) + 1) - 1) % TONES.length] ?? TONES[0];
          const isActive = active === i;
          const isFlipped = flipped === i;
          const strap = g.straps[i] ?? 0;
          const reelTop = g.reelTops[i] ?? 0;
          const clipTop = g.clipTops[i] ?? 0;
          const cardOffset = (g.cardTops[i] ?? 0) - clipTop;
          const links = (item.links ?? []).slice(0, 3);

          return (
            <div
              key={item.id}
              ref={(node) => {
                slots.current[i] = node;
              }}
              data-lanyard={i}
              className={tone}
              style={{
                pointerEvents: "none",
                position: "absolute",
                left: 0,
                top: 0,
                width: W,
                height: g.height,
                zIndex: isFlipped ? 40 : isActive ? 30 : 10 + i,
                transform: `translate3d(${((sim.current.x[i] ?? 0) - W / 2).toFixed(
                  2
                )}px,0,0)`,
              }}
            >
              {/* Top Rail Ring */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  display: "block",
                  borderRadius: "9999px",
                  left: W / 2 - 4.5 * g.u,
                  top: g.railY - g.ring,
                  width: 9 * g.u,
                  height: g.ring * 2,
                  border: `${Math.max(1.6, 2.2 * g.u).toFixed(2)}px solid #dfc9b0`,
                  boxShadow:
                    "inset 1px 0 0 rgba(0,0,0,0.35), 1px 1px 3px rgba(0,0,0,0.35)",
                  boxSizing: "border-box",
                }}
              />

              {/* Pendulum Swing Group */}
              <span
                ref={(node) => {
                  swings.current[i] = node;
                }}
                data-swing
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "block",
                  transformOrigin: `${W / 2}px ${g.pivotY}px`,
                }}
              >
                {/* Lanyard Strap, Crimp, Retractable Reel & Cord */}
                <span
                  ref={(node) => {
                    straps.current[i] = node;
                  }}
                  data-strap
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "block",
                    "--stretch": "0px",
                  }}
                >
                  {/* Strap Drop Shadow */}
                  <span
                    style={{
                      position: "absolute",
                      display: "block",
                      background: "rgba(0, 0, 0, 0.28)",
                      filter: "blur(2px)",
                      left: W / 2 - g.strapW / 2 + 3 * g.u,
                      top: g.pivotY + 3,
                      width: g.strapW,
                      height: strap,
                    }}
                  />
                  {/* Woven Fabric Strap */}
                  <span
                    style={{
                      position: "absolute",
                      display: "block",
                      left: W / 2 - g.strapW / 2,
                      top: g.pivotY - 2,
                      width: g.strapW,
                      height: strap + 2,
                      background: [
                        "repeating-linear-gradient(135deg, rgba(255,255,255,0.16) 0 1px, transparent 1px 3px)",
                        "repeating-linear-gradient(45deg, rgba(0,0,0,0.14) 0 1px, transparent 1px 3px)",
                        "linear-gradient(90deg, color-mix(in oklab, currentColor 68%, black) 0%, currentColor 16%, color-mix(in oklab, currentColor 86%, white) 48%, currentColor 80%, color-mix(in oklab, currentColor 66%, black) 100%)",
                      ].join(","),
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: "1.5px",
                        right: "1.5px",
                        display: "block",
                        borderLeft: "1px dashed rgba(255, 255, 255, 0.38)",
                        borderRight: "1px dashed rgba(255, 255, 255, 0.38)",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        display: "block",
                        background: "rgba(0, 0, 0, 0.25)",
                        height: 7 * g.u,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: "2px",
                        right: "2px",
                        top: 9 * g.u,
                        display: "block",
                        borderTop: "1px dashed rgba(255, 255, 255, 0.45)",
                      }}
                    />
                  </span>

                  {/* Top Metal Loop Clasp */}
                  <svg
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      overflow: "visible",
                      left: W / 2 - g.strapW * 0.75,
                      top: g.pivotY - 4 * g.u,
                      width: g.strapW * 1.5,
                      height: 8 * g.u,
                    }}
                    viewBox="0 0 30 16"
                    preserveAspectRatio="none"
                  >
                    <rect
                      x="2"
                      y="3"
                      width="26"
                      height="10"
                      rx="5"
                      fill="none"
                      stroke="#d8c2a8"
                      strokeWidth="3"
                    />
                    <path
                      d="M7 4.5 H23"
                      stroke="white"
                      strokeOpacity="0.65"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* Metal Crimp */}
                  <span
                    style={{
                      position: "absolute",
                      display: "block",
                      borderRadius: "2px",
                      left: W / 2 - g.strapW / 2 - 1.5,
                      top: g.pivotY + strap - g.crimp * 0.4,
                      width: g.strapW + 3,
                      height: g.crimp,
                      background: METAL,
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.35)",
                    }}
                  />

                  {/* Retractable Badge Reel */}
                  <span
                    style={{
                      position: "absolute",
                      display: "block",
                      borderRadius: "9999px",
                      left: W / 2 - g.reel / 2,
                      top: reelTop,
                      width: g.reel,
                      height: g.reel,
                      background:
                        "radial-gradient(circle at 34% 30%, #6e4e3a 0%, #2a1810 58%, #140b07 100%)",
                      boxShadow:
                        "inset 0 -1px 2px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4)",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        inset: "14%",
                        display: "block",
                        borderRadius: "9999px",
                        border: "1px solid rgba(254, 250, 223, 0.25)",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        display: "block",
                        width: "32%",
                        height: "32%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "9999px",
                        background: METAL,
                      }}
                    />
                  </span>

                  {/* Retractable Reel Cord */}
                  <span
                    ref={(node) => {
                      cords.current[i] = node;
                    }}
                    style={{
                      position: "absolute",
                      display: "block",
                      width: "1.5px",
                      background: "rgba(254, 250, 223, 0.72)",
                      left: W / 2 - 0.75,
                      top: reelTop + g.reel * 0.82,
                      height: g.cordRest,
                      transformOrigin: "50% 0",
                    }}
                  />
                </span>

                {/* Hanging Card + Clip Assembly */}
                <span
                  ref={(node) => {
                    hangs.current[i] = node;
                  }}
                  data-hang
                  style={{
                    position: "absolute",
                    left: 0,
                    display: "block",
                    top: clipTop,
                    width: W,
                    height: cardOffset + g.H,
                    transformOrigin: `${W / 2}px 0px`,
                  }}
                >
                  {/* Card Ambient Drop Shadow */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0,
                      display: "block",
                      top: cardOffset,
                      width: W,
                      height: g.H,
                      filter: `blur(${Math.max(4, 8 * g.u).toFixed(1)}px)`,
                    }}
                  >
                    <span
                      ref={(node) => {
                        shadows.current[i] = node;
                      }}
                      data-shadow
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "block",
                        borderRadius: "10px",
                        background: "rgba(0, 0, 0, 0.42)",
                      }}
                    />
                  </span>

                  {/* Interactive 3D Badge Button */}
                  <button
                    ref={(node) => {
                      buttons.current[i] = node;
                    }}
                    type="button"
                    data-badge={i}
                    data-flipped={isFlipped ? "true" : "false"}
                    data-active={isActive || undefined}
                    tabIndex={i === (active ?? focusIndex) ? 0 : -1}
                    aria-label={`${item.name}, ${item.role}`}
                    aria-describedby={`${uid}-caption`}
                    aria-pressed={isFlipped}
                    className="lanyard-badge-btn"
                    style={{
                      pointerEvents: "auto",
                      position: "absolute",
                      left: 0,
                      top: cardOffset,
                      width: W,
                      height: g.H,
                      fontSize: base,
                      cursor: "pointer",
                      borderRadius: "0.85em",
                      padding: 0,
                      border: "none",
                      background: "transparent",
                      textAlign: "left",
                      outline: "none",
                    }}
                    onFocus={() => {
                      setFocusIndex(i);
                      if (pointer.current.id < 0) {
                        stop();
                        setActive(i);
                      }
                    }}
                    onClick={(event) => {
                      const pending = pendingOpen.current;
                      pendingOpen.current = -1;
                      if (event.detail === 0 || pending === i) toggle(i);
                    }}
                  >
                    <span
                      ref={(node) => {
                        flips.current[i] = node;
                      }}
                      data-flip
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "block",
                        transformStyle: "preserve-3d",
                        WebkitTransformStyle: "preserve-3d",
                        transform: `perspective(${PERSPECTIVE}px) rotateY(${
                          REST_Y[i % REST_Y.length] ?? 0
                        }deg)`,
                      }}
                    >
                      <BadgeFaces item={item} tone={tone} />
                    </span>
                  </button>

                  {/* Top Plastic Badge Clip */}
                  <span
                    aria-hidden="true"
                    style={{
                      pointerEvents: "none",
                      position: "absolute",
                      display: "block",
                      left: W / 2 - g.clipW / 2,
                      top: 0,
                      width: g.clipW,
                      height: g.clipH + 10 * g.u,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "50%",
                        display: "block",
                        transform: "translateX(-50%)",
                        borderBottomLeftRadius: "2px",
                        borderBottomRightRadius: "2px",
                        top: g.clipH * 0.7,
                        width: g.clipW * 0.42,
                        height:
                          cardOffset - g.clipH * 0.7 + 0.72 * base + 0.3 * base,
                        background: PLASTIC,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        display: "block",
                        height: g.clipH,
                        clipPath:
                          "polygon(24% 0, 76% 0, 100% 72%, 94% 100%, 6% 100%, 0 72%)",
                        background: PLASTIC,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        display: "block",
                        background: "rgba(255, 255, 255, 0.45)",
                        left: "30%",
                        right: "30%",
                        top: 1,
                        height: 1,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: "50%",
                        display: "block",
                        transform: "translateX(-50%)",
                        borderRadius: "9999px",
                        background: "#140b07",
                        top: g.clipH * 0.14,
                        width: g.clipH * 0.34,
                        height: g.clipH * 0.34,
                        boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.55)",
                      }}
                    />
                  </span>

                  {/* Interactive Links Overlay when Flipped */}
                  {isFlipped && links.length > 0 && (
                    <div
                      ref={(node) => {
                        linkLayers.current[i] = node;
                      }}
                      data-links
                      style={{
                        pointerEvents: "none",
                        position: "absolute",
                        left: 0,
                        top: cardOffset,
                        width: W,
                        height: g.H,
                        fontSize: base,
                        opacity: 0,
                        visibility: "hidden",
                        transition: "opacity 150ms ease",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0.75em",
                          left: "0.6em",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: "0.1em",
                        }}
                      >
                        {links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            onPointerDown={(event) => {
                              event.stopPropagation();
                              stop();
                            }}
                            onFocus={stop}
                            className="lanyard-back-link"
                            style={{
                              ...LINK_ROW_STYLE,
                              pointerEvents: "auto",
                              outline: "none",
                            }}
                          >
                            <LinkIcon label={link.label} />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Narrow Screen Carousel Dots */}
      {size.carousel && count > 1 && (
        <div
          role="group"
          aria-label={labels.show}
          style={{
            position: "relative",
            zIndex: 10,
            marginTop: "0.35rem",
            display: "flex",
            justifyContent: "center",
            gap: "0.4rem",
          }}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${labels.show} ${item.name}`}
              aria-current={centerIndex === i}
              onClick={() => {
                stop();
                setActive(i);
              }}
              style={{
                height: "6px",
                width: centerIndex === i ? "24px" : "6px",
                borderRadius: "9999px",
                border: "none",
                padding: 0,
                cursor: "pointer",
                outline: "none",
                background:
                  centerIndex === i
                    ? "#FEFADF"
                    : "rgba(254, 250, 223, 0.35)",
                transition: "width 300ms ease, background-color 300ms ease",
              }}
            />
          ))}
        </div>
      )}

      {/* Interactive Status Caption Pill */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.65rem 1.5rem 0.5rem",
          textAlign: "center",
        }}
      >
        <div
          id={`${uid}-caption`}
          aria-live="polite"
          style={{
            minHeight: "2.6rem",
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.45rem 1.35rem",
            borderRadius: "9999px",
            background: "rgba(17, 17, 17, 0.78)",
            border: "1px solid rgba(211, 163, 115, 0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.28)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.86rem",
              fontWeight: 700,
              color: "#FEFADF",
              letterSpacing: "0.01em",
            }}
          >
            {line1}
          </p>
          {line2 && (
            <p
              style={{
                margin: "0.12rem 0 0",
                fontSize: "0.74rem",
                fontWeight: 500,
                color: "#EEDCAC",
              }}
            >
              {line2}
            </p>
          )}
          {showingBack && person?.bio && (
            <span className="sr-only">{person.bio}</span>
          )}
        </div>
        {action}
      </div>
    </section>
  );
}

/* ── Default Lanyard Badges for Wenmar Creates Tech & Operations Stack ── */
const STACK_LANYARD_ITEMS = [
  {
    id: "react-nextjs",
    name: "React & Next.js",
    role: "Frontend Architecture",
    team: "WEB DEV · UI ENGINE",
    image: "",
    tone: 1,
    drop: 6,
    bio: "High-speed SSR web applications, interactive 3D spatial interfaces, and conversion-engineered digital experiences.",
    tags: ["React 19", "Next.js", "3D UI"],
    links: [
      { label: "View Web Projects", href: "#work-section" },
      { label: "wenmarcreates@gmail.com", href: "mailto:wenmarcreates@gmail.com" },
    ],
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.6">
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </g>
      </svg>
    ),
  },
  {
    id: "gohighlevel",
    name: "GoHighLevel",
    role: "CRM & Funnel Systems",
    team: "GHL · REVENUE OPS",
    image: "",
    tone: 2,
    drop: 20,
    bio: "Custom agency snapshots, multi-stage opportunity pipelines, AI appointment calendars, and automated 2-way SMS/email follow-up.",
    tags: ["Snapshots", "Pipelines", "2-Way SMS"],
    links: [
      { label: "See GHL Systems", href: "#work-section" },
      { label: "wenmarcreates@gmail.com", href: "mailto:wenmarcreates@gmail.com" },
    ],
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 19V11l4.5-3.5v11.5H3zm6.5 0V7l4.5-3.5V19h-4.5zm6.5 0V3.5L20.5 7V19H16z" />
      </svg>
    ),
  },
  {
    id: "n8n-workflows",
    name: "n8n Workflows",
    role: "Autonomous Orchestration",
    team: "OPS · LOGIC ENGINE",
    image: "",
    tone: 3,
    drop: 0,
    bio: "Multi-branch webhook orchestration, autonomous lead scraping, AI agent tool calling, and real-time multi-platform synchronization.",
    tags: ["Webhooks", "Lead Scraper", "AI Agents"],
    links: [
      { label: "See Automations", href: "#work-section" },
      { label: "wenmarcreates@gmail.com", href: "mailto:wenmarcreates@gmail.com" },
    ],
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.474 5.684a2.53 2.53 0 0 0-2.447 1.895H16.13a2.526 2.526 0 0 0-2.492 2.11l-.103.624a1.26 1.26 0 0 1-1.246 1.055h-1.001a2.527 2.527 0 0 0-4.893 0H4.973a2.527 2.527 0 1 0 0 1.264h1.422a2.527 2.527 0 0 0 4.894 0h1a1.26 1.26 0 0 1 1.247 1.055l.103.623a2.526 2.526 0 0 0 2.492 2.111h.37a2.527 2.527 0 1 0 0-1.263h-.37a1.26 1.26 0 0 1-1.246-1.056l-.103-.623A2.52 2.52 0 0 0 13.96 12a2.52 2.52 0 0 0 .82-1.48l.104-.622a1.26 1.26 0 0 1 1.246-1.056h2.896a2.527 2.527 0 1 0 2.447-3.158m0 1.263a1.263 1.263 0 0 1 1.263 1.263a1.263 1.263 0 0 1-1.263 1.264A1.263 1.263 0 0 1 20.21 8.21a1.263 1.263 0 0 1 1.264-1.263m-18.948 3.79A1.263 1.263 0 0 1 3.79 12a1.263 1.263 0 0 1-1.264 1.263A1.263 1.263 0 0 1 1.263 12a1.263 1.263 0 0 1 1.263-1.263m6.316 0A1.263 1.263 0 0 1 10.105 12a1.263 1.263 0 0 1-1.263 1.263A1.263 1.263 0 0 1 7.58 12a1.263 1.263 0 0 1 1.263-1.263m10.106 3.79a1.263 1.263 0 0 1 1.263 1.263a1.263 1.263 0 0 1-1.263 1.263a1.263 1.263 0 0 1-1.264-1.263a1.263 1.263 0 0 1 1.263-1.264" />
      </svg>
    ),
  },
  {
    id: "claude-gemini",
    name: "Claude & Gemini",
    role: "AI Agent Systems",
    team: "AI · MULTIMODAL LLM",
    image: "",
    tone: 4,
    drop: 13,
    bio: "24/7 autonomous AI chat widgets, dynamic quote & proposal generators, website audit agents, and deep reasoning pipelines.",
    tags: ["Claude Code", "Gemini", "24/7 Agents"],
    links: [
      { label: "Explore AI Agents", href: "#work-section" },
      { label: "wenmarcreates@gmail.com", href: "mailto:wenmarcreates@gmail.com" },
    ],
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68q.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-3.81Q12 2.49 12 0q0 2.49-.96 4.68q-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96q2.19.93 3.81 2.55t2.55 3.81" />
      </svg>
    ),
  },
  {
    id: "typescript",
    name: "TypeScript",
    role: "Type-Safe Full-Stack",
    team: "CORE · ARCHITECTURE",
    image: "",
    tone: 5,
    drop: 22,
    bio: "Production-grade type safety across frontend, Node.js APIs, webhook handlers, and scalable cloud microservices.",
    tags: ["TypeScript", "Node.js", "REST APIs"],
    links: [
      { label: "Our Capabilities", href: "#services-section" },
      { label: "wenmarcreates@gmail.com", href: "mailto:wenmarcreates@gmail.com" },
    ],
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75q.918 0 1.627.111a6.4 6.4 0 0 1 1.306.34v2.458a4 4 0 0 0-.643-.361a5 5 0 0 0-.717-.26a5.5 5.5 0 0 0-1.426-.2q-.45 0-.819.086a2.1 2.1 0 0 0-.623.242q-.254.156-.393.374a.9.9 0 0 0-.14.49q0 .294.156.529q.156.234.443.444c.287.21.423.276.696.41q.41.203.926.416q.705.296 1.266.628q.561.333.963.753q.402.418.614.957q.213.538.214 1.253q0 .986-.373 1.656a3 3 0 0 1-1.012 1.085a4.4 4.4 0 0 1-1.487.596q-.85.18-1.79.18a10 10 0 0 1-1.84-.164a5.5 5.5 0 0 1-1.512-.493v-2.63a5.03 5.03 0 0 0 3.237 1.2q.5 0 .872-.09q.373-.09.623-.25q.249-.162.373-.38a1.02 1.02 0 0 0-.074-1.089a2.1 2.1 0 0 0-.537-.5a5.6 5.6 0 0 0-.807-.444a28 28 0 0 0-1.007-.436q-1.377-.575-2.053-1.405t-.676-2.005q0-.92.369-1.582q.368-.662 1.004-1.089a4.5 4.5 0 0 1 1.47-.629a7.5 7.5 0 0 1 1.77-.201m-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
      </svg>
    ),
  },
  {
    id: "supabase",
    name: "Supabase",
    role: "Database & Auth Cloud",
    team: "BACKEND · POSTGRES",
    image: "",
    tone: 1,
    drop: 4,
    bio: "Enterprise PostgreSQL databases, Row-Level Security, authentication, and real-time state synchronization.",
    tags: ["PostgreSQL", "Realtime", "Auth"],
    links: [
      { label: "System Architecture", href: "#services-section" },
      { label: "wenmarcreates@gmail.com", href: "mailto:wenmarcreates@gmail.com" },
    ],
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.32 14.242a.792.792 0 0 0 .616 1.284H12v8.958a.396.396 0 0 0 .716.233l10.964-14.079a.792.792 0 0 0-.616-1.284z" />
      </svg>
    ),
  },
  {
    id: "make-zapier",
    name: "Make & Zapier",
    role: "API Integration Mesh",
    team: "CLOUD · CONNECTORS",
    image: "",
    tone: 2,
    drop: 16,
    bio: "Seamless cross-platform pipelines uniting calendars, CRMs, PDF contract generators, and instant team notifications.",
    tags: ["Make", "Zapier", "REST Webhooks"],
    links: [
      { label: "See Workflows", href: "#work-section" },
      { label: "wenmarcreates@gmail.com", href: "mailto:wenmarcreates@gmail.com" },
    ],
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.38 3.498c-.27 0-.511.19-.566.465L9.85 18.986a.58.58 0 0 0 .453.678l4.095.826a.58.58 0 0 0 .682-.455l2.963-15.021a.58.58 0 0 0-.453-.678l-4.096-.826a.6.6 0 0 0-.113-.012zm-5.876.098a.58.58 0 0 0-.516.318L.062 17.697a.575.575 0 0 0 .256.774l3.733 1.877a.58.58 0 0 0 .775-.258l6.926-13.781a.577.577 0 0 0-.256-.776L7.762 3.658a.6.6 0 0 0-.258-.062m11.74.115a.576.576 0 0 0-.576.576v15.426c0 .318.258.578.576.578h4.178a.58.58 0 0 0 .578-.578V4.287a.58.58 0 0 0-.578-.576Z" />
      </svg>
    ),
  },
  {
    id: "stripe-commerce",
    name: "Stripe & Billing",
    role: "Revenue & Checkout",
    team: "FINTECH · INVOICING",
    image: "",
    tone: 3,
    drop: 9,
    bio: "Automated proposal-to-invoice flows, subscription billing, payment link webhooks, and high-converting checkout funnels.",
    tags: ["Auto-Invoicing", "Checkout", "Subscriptions"],
    links: [
      { label: "Start a Project", href: "#cta-section" },
      { label: "wenmarcreates@gmail.com", href: "mailto:wenmarcreates@gmail.com" },
    ],
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.54 12.832.54 6.74.54 2.82 3.738 2.82 8.766c0 5.433 5.372 6.84 8.795 8.16 2.386.918 3.356 1.64 3.356 2.651 0 .977-.872 1.512-2.263 1.512-2.392 0-5.32-1.144-7.218-2.296l-.914 5.613c1.782 1.033 4.887 1.694 8.077 1.694 6.29 0 10.38-2.955 10.38-8.196 0-5.528-5.374-7.147-9.057-8.754z" />
      </svg>
    ),
  },
];

export const BrandMarquee = ({ items = STACK_LANYARD_ITEMS, ...props }) => {
  return (
    <TeamLanyardRail
      items={items}
      autoplay={true}
      interval={3000}
      caption="Hover, drag sideways, pull down, or click any badge to flip & inspect the stack"
      {...props}
    />
  );
};

export default TeamLanyardRail;
