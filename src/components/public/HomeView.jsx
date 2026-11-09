import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import brandLogoImg from "../../assets/wenmar-creates-logo.png";
import wenmarSeatedImg from "../../assets/wenmar-seated.png";
import {
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ShieldCheck,
  Mail,
  MapPin
} from "lucide-react";
import { RandomLetterSwap } from "../ui/random-letter-swap";
import { BrandMarquee } from "./BrandMarquee";
import { HomeSections } from "./HomeSections";
import { useScrollSpatial } from "../../hooks/useScrollSpatial";
import { SocialNavLinks } from "../common/SocialNavIcons";
import { ExecutiveMenuDrawer, LuxuryHamburgerButton } from "../common/ExecutiveMenuDrawer";

export const HomeView = () => {
  const { setCurrentView } = useApp();
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const homeContainerRef = useRef(null);
  useScrollSpatial(homeContainerRef);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 380);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Top Hero Navigation Bar (Logo, Socials, Contact Pills & Menu Button) */}
        <div 
          style={{ 
            width: "100%", 
            background: "transparent",
            position: "relative",
            zIndex: 35
          }}
        >
          <div 
            className="hero-navbar-inner"
            style={{ 
              maxWidth: "1240px", 
              margin: "0 auto", 
              padding: "0.65rem 1.5rem", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between" 
            }}
          >
            {/* Left: Brand Emblem Logo & Social Icons */}
            <div 
              className="hero-nav-left-group"
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.95rem",
                flexWrap: "nowrap"
              }}
            >
              {/* Brand Logo */}
              <div 
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="brand-nav-link"
                style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}
              >
                <img 
                  src={brandLogoImg} 
                  alt="Wenmar Creates" 
                  className="brand-luxury-logo-img brand-nav-logo"
                  decoding="async"
                  style={{ 
                    height: "48px", 
                    width: "auto", 
                    objectFit: "contain", 
                    filter: "drop-shadow(0 4px 12px rgba(87, 51, 37, 0.18))" 
                  }} 
                />
              </div>

              {/* Vertical Elegant Hairline Divider */}
              <div 
                className="hero-nav-social-divider"
                style={{ 
                  width: "1px", 
                  height: "22px", 
                  background: "rgba(211, 163, 115, 0.45)", 
                  flexShrink: 0 
                }} 
              />

              {/* Social Icons */}
              <SocialNavLinks />

              {/* Vertical Elegant Hairline Divider */}
              <div 
                className="hero-nav-contact-divider"
                style={{ 
                  width: "1px", 
                  height: "22px", 
                  background: "rgba(211, 163, 115, 0.45)", 
                  flexShrink: 0 
                }} 
              />
            </div>

            {/* Direct Contact & Location Info in Navbar after Social Icons */}
            <div
              className="hero-nav-contact-items"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "nowrap",
                gap: "0.6rem",
                marginLeft: "0.95rem",
                marginRight: "auto"
              }}
            >
              <a
                href="mailto:wenmarcreates@gmail.com"
                className="hero-contact-item hero-email-item"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  color: "#FEFADF",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  padding: "0.38rem 0.9rem",
                  background: "rgba(17, 17, 17, 0.72)",
                  border: "1px solid rgba(211, 163, 115, 0.48)",
                  borderRadius: "9999px",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.22)",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFFFFF";
                  e.currentTarget.style.borderColor = "rgba(254, 250, 223, 0.85)";
                  e.currentTarget.style.background = "rgba(17, 17, 17, 0.88)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#FEFADF";
                  e.currentTarget.style.borderColor = "rgba(211, 163, 115, 0.48)";
                  e.currentTarget.style.background = "rgba(17, 17, 17, 0.72)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                title="Send an email to wenmarcreates@gmail.com"
              >
                <Mail size={14} style={{ color: "#D3A373", flexShrink: 0 }} />
                <span>wenmarcreates@gmail.com</span>
              </a>

              <div
                className="hero-contact-item hero-location-item"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  color: "#EEDCAC",
                  fontSize: "0.8rem",
                  fontWeight: 650,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  padding: "0.38rem 0.9rem",
                  background: "rgba(17, 17, 17, 0.65)",
                  border: "1px solid rgba(211, 163, 115, 0.38)",
                  borderRadius: "9999px",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)"
                }}
              >
                <MapPin size={14} style={{ color: "#D3A373", flexShrink: 0 }} />
                <span>Philippines • Available Worldwide</span>
              </div>
            </div>

            {/* Right: Spacer to preserve navbar alignment for Sticky Hamburger Button */}
            <div
              className="hero-navbar-right"
              aria-hidden="true"
              style={{ width: "112px", height: "40px", flexShrink: 0, pointerEvents: "none" }}
            />
          </div>
        </div>

        {/* Sticky / Fixed High-End Luxury Hamburger Menu Button */}
        <div
          className="hero-sticky-hamburger"
          style={{
            position: "fixed",
            top: "0.85rem",
            right: "max(1.5rem, calc((100vw - 1240px) / 2 + 1.5rem))",
            zIndex: 98,
            display: "flex",
            alignItems: "center",
            opacity: isNavMenuOpen ? 0 : 1,
            pointerEvents: isNavMenuOpen ? "none" : "auto",
            transition: "opacity 0.22s ease"
          }}
        >
          <LuxuryHamburgerButton
            isOpen={isNavMenuOpen}
            onClick={() => setIsNavMenuOpen(true)}
          />
        </div>

        {/* Executive Slide-In Navigation Menu Drawer */}
        <ExecutiveMenuDrawer
          isOpen={isNavMenuOpen}
          onClose={() => setIsNavMenuOpen(false)}
        />

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
                  color: "#FEFADF",
                  textShadow: "0 2px 12px rgba(0, 0, 0, 0.45)",
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
                    marginLeft: "150px"
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
                  color: "#FEFADF",
                  textShadow: "0 1px 8px rgba(0, 0, 0, 0.4)",
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
                  title="Start a Conversation"
                >
                  <RandomLetterSwap
                    className="cursor-pointer font-bold text-base"
                    label="Start a Conversation"
                    style={{ color: "#FEFADF" }}
                    staggerDuration={0.025}
                    transition={{ duration: 0.6, type: "spring" }}
                  />
                </button>
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
            transform: "translateX(-50%) translateY(150px)",
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
              height: "clamp(915px, calc(115vh - 5px), 1315px)",
              maxWidth: "min(1275px, calc(75vw - 5px))",
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

      {/* Floating Back to Top Button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
        style={{
          position: "fixed",
          right: "clamp(1.1rem, 2.5vw, 2rem)",
          bottom: "clamp(1.1rem, 2.5vw, 2rem)",
          zIndex: 95,
          width: "48px",
          height: "48px",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1E1815 0%, #111111 100%)",
          color: "#FEFADF",
          border: "1.5px solid rgba(211, 163, 115, 0.65)",
          boxShadow: "0 10px 26px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(254, 250, 223, 0.08) inset",
          cursor: "pointer",
          opacity: showBackToTop ? 1 : 0,
          pointerEvents: showBackToTop ? "auto" : "none",
          transform: showBackToTop ? "translateY(0) scale(1)" : "translateY(14px) scale(0.9)",
          transition: "opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(145deg, #920000 0%, #680000 100%)";
          e.currentTarget.style.borderColor = "#FEFADF";
          e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
          e.currentTarget.style.boxShadow = "0 14px 30px rgba(146, 0, 0, 0.48), 0 0 14px rgba(211, 163, 115, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(145deg, #1E1815 0%, #111111 100%)";
          e.currentTarget.style.borderColor = "rgba(211, 163, 115, 0.65)";
          e.currentTarget.style.transform = showBackToTop ? "translateY(0) scale(1)" : "translateY(14px) scale(0.9)";
          e.currentTarget.style.boxShadow = "0 10px 26px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(254, 250, 223, 0.08) inset";
        }}
      >
        <ArrowUp size={20} strokeWidth={2.4} />
      </button>

    </div>
  );
};
