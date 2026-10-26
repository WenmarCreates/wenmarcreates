import React, { useRef } from "react";
import { useApp } from "../../context/AppContext";
import heroNavLogoImg from "../../assets/glossy-red-and-gold-monogram-emblem.png";
import wenmarMetallicLogoImg from "../../assets/wenmar-creates-maroon-metallic-logo.png";
import wenmarSeatedImg from "../../assets/wenmar-seated.png";
import {
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Mail,
  MapPin
} from "lucide-react";
import { RandomLetterSwap } from "../ui/random-letter-swap";
import { BrandMarquee } from "./BrandMarquee";
import { HomeSections } from "./HomeSections";
import { useScrollSpatial } from "../../hooks/useScrollSpatial";

// Custom Social SVG Components for 100% Reliable Rendering
const FacebookIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const XIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const LinkedinIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const HomeView = () => {
  const { setCurrentView } = useApp();

  const homeContainerRef = useRef(null);
  useScrollSpatial(homeContainerRef);

  const handleContactClick = () => {
    const ctaSection = document.getElementById("cta-section");
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "mailto:wenmarcreates@gmail.com";
    }
  };

  return (
    <div ref={homeContainerRef} style={{ display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Hero Block with Split Background (65% Existing / 35% #920000 Denim Texture) */}
      <div 
        className="hero-split-backdrop"
        style={{ 
          width: "100%", 
          background: "transparent", 
          position: "relative", 
          zIndex: 30,
          borderBottom: "none"
        }}
      >
        {/* Right Denim Panel (Exact match with denim texture) */}
        <div className="hero-right-denim-panel" />
        {/* (Straight divider seam removed: the denim panel now has a slanted left edge) */}

        {/* Red slant on the left: above the founder image (z 20), below the hero text (z 25+) */}
        <div className="hero-red-slant" aria-hidden="true" />

        {/* Top Hero Navigation Bar (Logo & Button Only - Full-Width Transparent Container) */}
        <div 
          style={{ 
            width: "100%", 
            background: "transparent",
            position: "relative",
            zIndex: 35
          }}
        >
          <div 
            style={{ 
              maxWidth: "1240px", 
              margin: "0 auto", 
              padding: "0.65rem 1.5rem", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between" 
            }}
          >
            {/* Left: Brand Emblem Logo, Wordmark & Social Icons (Strictly within the 65% white background) */}
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "1.15rem",
                maxWidth: "62%", /* Strictly contained within the left 65% white/cream background */
                flexWrap: "nowrap"
              }}
            >
              {/* Brand Logo & Wordmark */}
              <div 
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="brand-nav-link"
                style={{ display: "flex", alignItems: "center", gap: "0.85rem", cursor: "pointer", flexShrink: 0 }}
              >
                <img 
                  src={heroNavLogoImg} 
                  alt="Wenmar Creates Emblem" 
                  decoding="async"
                  style={{ 
                    height: "44px", 
                    width: "auto", 
                    objectFit: "contain", 
                    filter: "drop-shadow(0 4px 12px rgba(87, 51, 37, 0.18))" 
                  }} 
                />
                <img 
                  src={wenmarMetallicLogoImg} 
                  alt="Wenmar Creates" 
                  className="brand-nav-wordmark"
                  decoding="async"
                  style={{ 
                    height: "36px", 
                    width: "auto", 
                    objectFit: "contain" 
                  }} 
                />
              </div>

              {/* Vertical Elegant Hairline Divider */}
              <div 
                style={{ 
                  width: "1px", 
                  height: "22px", 
                  background: "rgba(211, 163, 115, 0.45)", 
                  flexShrink: 0 
                }} 
              />

              {/* Social Icons - Contained within White/Cream Background */}
              <div 
                className="hero-social-links"
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.75rem",
                  flexShrink: 0
                }}
              >
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hero-social-btn"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <LinkedinIcon size={18} />
                </a>
                <a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hero-social-btn"
                  aria-label="X (Twitter)"
                  title="X (Twitter)"
                >
                  <XIcon size={17} />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hero-social-btn"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FacebookIcon size={18} />
                </a>
              </div>
            </div>

            {/* Right: Contact Button with Signature AayStyle Denim Texture */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <button 
                onClick={handleContactClick} 
                className="nav-contact-btn"
                title="Start a Conversation"
              >
                <Mail size={15} strokeWidth={2.2} />
                <span>Start a Conversation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section - Executive Content over 65% Existing Background */}
        <section 
          className="hero-main-section"
          style={{ 
            width: "100%", 
            maxWidth: "1240px", 
            margin: "0 auto", 
            minHeight: 0,
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "1.5rem 1.5rem 2rem", 
            position: "relative" 
          }}
        >
          <div 
            className="hero-main-content"
            style={{ 
              width: "100%", 
              maxWidth: "880px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "flex-start", 
              textAlign: "left", 
              marginTop: "clamp(2rem, 5vh, 3.8rem)" 
            }}
          >
            {/* Highlight Robotic Intro: Hey I'm Wenmar (Layered below the founder image at zIndex: 10) */}
            <h1 
              className="hero-title"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: 0.95,
                gap: "0.25rem",
                margin: "0 0 1.5rem 0",
                position: "relative",
                zIndex: 30
              }}
            >
              <span 
                className="hero-title-intro"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontStyle: "normal",
                  fontSize: "clamp(2.2rem, 4.2vw, 3.8rem)",
                  fontWeight: 700,
                  color: "#111111",
                  letterSpacing: "0.02em",
                  textTransform: "none",
                  lineHeight: 1.15
                }}
              >
                Hey I'm
              </span>
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  lineHeight: 0.85,
                  gap: "0"
                }}
              >
                <span 
                  className="text-denim-red-robotic hero-title-big"
                  style={{
                    fontSize: "clamp(6.2rem, 15vw, 13.5rem)",
                    fontWeight: 900,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    lineHeight: 0.85
                  }}
                >
                  WEN
                </span>
                <span 
                  className="text-denim-red-robotic hero-title-big"
                  style={{
                    fontSize: "clamp(6.2rem, 15vw, 13.5rem)",
                    fontWeight: 900,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    lineHeight: 0.85,
                    marginLeft: "0"
                  }}
                >
                  MAR
                </span>
              </span>
            </h1>

            {/* Foreground Content: Description & Interactive Action Buttons (zIndex: 25) */}
            <div 
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "flex-start", 
                position: "relative", 
                zIndex: 25 
              }}
            >
              <p
                className="hero-description"
                style={{
                  margin: 0,
                  fontSize: "clamp(0.92rem, 1.15vw, 1.05rem)",
                  color: "#111111",
                  lineHeight: 1.65,
                  fontWeight: 500,
                  maxWidth: "520px"
                }}
              >
                I build high-speed web apps, automate tedious business workflows, and engineer advanced GoHighLevel (GHL) CRM systems built to scale your business.
              </p>

              {/* Dual Hero CTA Action Buttons */}
              <div
                className="hero-cta-row"
                style={{
                  marginTop: "1.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.35rem",
                  flexWrap: "wrap"
                }}
              >
                <button
                  onClick={() => {
                    const el = document.getElementById("marquee-section");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.scrollTo({ top: window.innerHeight * 0.95, behavior: "smooth" });
                    }
                  }}
                  className="hero-btn-primary"
                >
                  <span>See my Portfolio</span>
                  <span className="hero-btn-circle-arrow">
                    <span className="hero-slant-arrow">
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleContactClick}
                  className="hero-btn-conversation"
                  style={{ color: "#920000" }}
                >
                  <RandomLetterSwap
                    className="cursor-pointer font-bold text-base"
                    label="Start a Conversation"
                    style={{ color: "#920000" }}
                    staggerDuration={0.025}
                    transition={{ duration: 0.6, type: "spring" }}
                  />
                </button>
              </div>

              {/* Direct Contact & Location Info: sits 50px below the CTA buttons */}
              <div
                className="hero-contact-location-row"
                style={{
                  position: "relative",
                  marginTop: "50px",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  gap: "0.85rem",
                  zIndex: 35
                }}
              >
                <a
                  href="mailto:wenmarcreates@gmail.com"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#573325",
                    fontSize: "0.85rem",
                    fontWeight: 650,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "opacity 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.75";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  title="Send an email"
                >
                  <Mail size={14} style={{ color: "#920000", flexShrink: 0 }} />
                  <span>wenmarcreates@gmail.com</span>
                </a>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#573325",
                    fontSize: "0.85rem",
                    fontWeight: 650,
                    whiteSpace: "nowrap",
                    flexShrink: 0
                  }}
                >
                  <MapPin size={14} style={{ color: "#920000", flexShrink: 0 }} />
                  <span>Philippines • Available Worldwide</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Left Luxury "Scroll" Note Indicator */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("marquee-section");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              } else {
                window.scrollTo({ top: window.innerHeight * 0.95, behavior: "smooth" });
              }
            }}
            className="hero-scroll-note"
            aria-label="Scroll down to explore"
          >
            <div className="hero-scroll-mouse">
              <div className="hero-scroll-wheel" />
            </div>
            <span className="hero-scroll-text">Scroll</span>
            <ChevronDown size={14} className="hero-scroll-chevron" strokeWidth={2.4} />
          </button>
        </section>

        {/* Founder Figure in the #920000 Right Background (Massive Scale & Presence) */}
        <div 
          className="hero-founder-frame"
          style={{
            position: "absolute",
            left: "calc(68% + 100px)",
            transform: "translateX(-50%)",
            top: "0px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 20,
            pointerEvents: "none",
            overflow: "visible"
          }}
        >

          {/* Seated Founder in Executive Armchair (Scaled Up) */}
          <img 
            src={wenmarSeatedImg} 
            alt="Wenmar - Creative Developer & Automation Specialist" 
            fetchPriority="high"
            decoding="async"
            style={{
              height: "clamp(920px, 115vh, 1320px)",
              maxWidth: "min(1280px, 75vw)",
              width: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 30px 60px rgba(0, 0, 0, 0.7)) drop-shadow(0 10px 24px rgba(0, 0, 0, 0.5))",
              pointerEvents: "auto",
              display: "block"
            }} 
          />
        </div>
      </div>

      {/* Brand Logos Trust Marquee Section */}
      <section 
        id="marquee-section"
        style={{ 
          width: "100%", 
          position: "relative", 
          zIndex: 25,
          backgroundColor: "transparent",
          borderBottom: "1px solid rgba(211, 163, 115, 0.35)",
          padding: "2rem 0 1.5rem",
          overflow: "hidden"
        }}
      >
        {/* Slants continuing seamlessly from hero section */}
        <div className="marquee-red-slant" aria-hidden="true" />
        <div className="marquee-black-slant" aria-hidden="true" />

        {/* Foreground Content: Quote and BrandMarquee cards remain fully visible on top */}
        <div style={{ position: "relative", zIndex: 10, width: "100%" }}>
          {/* Editorial Brand Quote Above Marquee */}
          <div 
            style={{
              maxWidth: "1240px",
              margin: "0 auto",
              padding: "0 1.5rem 1.6rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center"
            }}
          >
            <div
              className="hero-tagline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.55rem",
                flexWrap: "wrap",
                fontSize: "clamp(1.15rem, 2.4vw, 1.95rem)",
                lineHeight: 1.25,
                fontWeight: 800,
                letterSpacing: "-0.01em",
                background: "rgba(17, 17, 17, 0.82)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(211, 163, 115, 0.5)",
                borderRadius: "9999px",
                padding: "0.55rem 1.75rem",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
              }}
            >
              <span style={{ color: "#D3A373", fontSize: "1.35em", lineHeight: 0.8, fontFamily: "Georgia, serif", fontWeight: 700 }}>“</span>
              <span 
                style={{ 
                  color: "#FEFADF",
                  fontSize: "inherit",
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)"
                }}
              >
                CREATIONS
              </span>
              <span 
                style={{ 
                  fontSize: "clamp(0.95rem, 1.8vw, 1.45rem)",
                  fontWeight: 600, 
                  color: "#EEDCAC",
                  margin: "0 0.2rem"
                }}
              >
                that power your
              </span>
              <span 
                style={{ 
                  color: "#FEFADF",
                  fontSize: "inherit",
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)"
                }}
              >
                OPERATIONS.
              </span>
              <span style={{ color: "#D3A373", fontSize: "1.35em", lineHeight: 0.8, fontFamily: "Georgia, serif", fontWeight: 700 }}>”</span>
            </div>
          </div>

          <BrandMarquee />
        </div>
      </section>

      {/* Home Page Sections: Projects, About, Services, Process, Results, CTA, Footer */}
      <HomeSections />

    </div>
  );
};
