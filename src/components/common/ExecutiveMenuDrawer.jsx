import React, { useState, useEffect, useRef } from "react";
import { X, ArrowRight, Mail } from "lucide-react";
import brandLogoImg from "../../assets/wenmar-creates-logo.png";
import { FacebookIcon, XIcon, YoutubeIcon, InstagramIcon, LinkedinIcon } from "./SocialNavIcons";

export const ExecutiveMenuDrawer = ({ isOpen, onClose, onNavigate }) => {
  const [isClosing, setIsClosing] = useState(false);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;
      setIsClosing(false);
      document.body.style.overflow = "hidden";
    } else {
      isClosingRef.current = false;
      setIsClosing(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);
    setTimeout(() => {
      document.body.style.overflow = "";
      onClose();
    }, 280);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isClosingRef.current) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const menuSections = [
    {
      id: "hero",
      num: "01",
      title: "HOME",
      desc: "Overview & Executive Intro"
    },
    {
      id: "work-section",
      num: "02",
      title: "SELECTED WORK",
      desc: "Web Apps, Automations & GHL Infrastructure"
    },
    {
      id: "about-section",
      num: "03",
      title: "ABOUT WENMAR",
      desc: "Creative Developer & Systems Architect"
    },
    {
      id: "services-section",
      num: "04",
      title: "CAPABILITIES",
      desc: "Autonomous AI Workflows & Bespoke Dev"
    },
    {
      id: "process-section",
      num: "05",
      title: "THE PROCESS",
      desc: "From System Audit to Scaled Deployment"
    },
    {
      id: "results-section",
      num: "06",
      title: "PROVEN RESULTS",
      desc: "Client Conversion Impact & Case Studies"
    },
    {
      id: "cta-section",
      num: "07",
      title: "START A CONVERSATION",
      desc: "Direct Consultation & Project Inquiries"
    }
  ];

  const handleItemClick = (sectionId) => {
    handleClose();
    setTimeout(() => {
      if (onNavigate) {
        onNavigate(sectionId);
      } else {
        if (sectionId === "hero") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    }, 220);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        justifyContent: "flex-end",
        pointerEvents: isClosing ? "none" : "auto"
      }}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop with cinematic fade */}
      <div
        onClick={handleClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10, 6, 5, 0.74)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          animation: isClosing
            ? "fadeOut 0.28s ease forwards"
            : "fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards"
        }}
      />

      {/* Cinematic Slide-In / Slide-Out Luxury Drawer Container */}
      <div
        style={{
          position: "relative",
          width: "min(490px, 92vw)",
          height: "100%",
          backgroundColor: "#120c09",
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(211, 163, 115, 0.14) 0%, transparent 60%),
            radial-gradient(circle at 90% 80%, rgba(146, 0, 0, 0.16) 0%, transparent 70%),
            repeating-linear-gradient(45deg, rgba(254, 250, 223, 0.02) 0px, rgba(254, 250, 223, 0.02) 1px, transparent 1px, transparent 4px)
          `,
          borderLeft: "1px solid rgba(211, 163, 115, 0.38)",
          boxShadow: "-28px 0 70px rgba(0, 0, 0, 0.9), inset 1px 0 0 rgba(254, 250, 223, 0.12)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "2rem 2.25rem 1.85rem",
          overflowY: "auto",
          animation: isClosing
            ? "slideOutRight 0.28s cubic-bezier(0.7, 0, 0.84, 0) forwards"
            : "slideInCinematic 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          zIndex: 2,
          willChange: "transform, opacity"
        }}
      >
        {/* Top Bar: Brand Monogram & Close Button */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid rgba(211, 163, 115, 0.22)",
              marginBottom: "1.75rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={brandLogoImg}
                alt="Wenmar Creates"
                style={{ height: "42px", width: "auto", objectFit: "contain" }}
              />
            </div>

            {/* Circular Close Button with Specular Ring */}
            <button
              onClick={handleClose}
              aria-label="Close Navigation Menu"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "rgba(254, 250, 223, 0.06)",
                border: "1px solid rgba(211, 163, 115, 0.4)",
                color: "#FEFADF",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "rotate(90deg) scale(1.08)";
                e.currentTarget.style.borderColor = "rgba(254, 250, 223, 0.85)";
                e.currentTarget.style.background = "rgba(211, 163, 115, 0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotate(0deg) scale(1)";
                e.currentTarget.style.borderColor = "rgba(211, 163, 115, 0.4)";
                e.currentTarget.style.background = "rgba(254, 250, 223, 0.06)";
              }}
            >
              <X size={18} strokeWidth={2.4} />
            </button>
          </div>

          {/* Section Navigation Items with Cinematic Cascading Stagger */}
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem"
            }}
          >
            {menuSections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => handleItemClick(sec.id)}
                className="executive-menu-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1.15rem",
                  borderRadius: "12px",
                  background: "transparent",
                  border: "1px solid transparent",
                  color: "#FEFADF",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.24s cubic-bezier(0.22, 1, 0.36, 1)",
                  width: "100%",
                  textDecoration: "none",
                  outline: "none",
                  animation: !isClosing
                    ? `menuItemCinematic 0.42s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.038 + 0.08}s backwards`
                    : "none"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(254, 250, 223, 0.07)";
                  e.currentTarget.style.borderColor = "rgba(211, 163, 115, 0.4)";
                  e.currentTarget.style.transform = "translateX(6px)";
                  const arrow = e.currentTarget.querySelector(".menu-arrow-icon");
                  if (arrow) arrow.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                  const arrow = e.currentTarget.querySelector(".menu-arrow-icon");
                  if (arrow) arrow.style.transform = "translateX(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "1.1rem" }}>
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.8rem",
                      color: "#D3A373",
                      letterSpacing: "0.06em",
                      fontWeight: 700
                    }}
                  >
                    {sec.num}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "1.08rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        color: "#FEFADF",
                        lineHeight: 1.2
                      }}
                    >
                      {sec.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-sans, sans-serif)",
                        fontSize: "0.76rem",
                        color: "#EEDCAC",
                        opacity: 0.72,
                        marginTop: "0.2rem",
                        fontWeight: 500
                      }}
                    >
                      {sec.desc}
                    </div>
                  </div>
                </div>

                <ArrowRight
                  size={16}
                  className="menu-arrow-icon"
                  style={{
                    color: "#D3A373",
                    transition: "transform 0.2s ease",
                    flexShrink: 0
                  }}
                />
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Drawer Footer: Contact & Social Presence */}
        <div
          style={{
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(211, 163, 115, 0.22)",
            marginTop: "1.5rem"
          }}
        >
          {/* Email Quick Contact Badge */}
          <a
            href="mailto:wenmarcreates@gmail.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              color: "#FEFADF",
              fontSize: "0.86rem",
              fontWeight: 650,
              textDecoration: "none",
              padding: "0.55rem 1.15rem",
              background: "rgba(17, 17, 17, 0.55)",
              border: "1px solid rgba(211, 163, 115, 0.4)",
              borderRadius: "9999px",
              backdropFilter: "blur(8px)",
              marginBottom: "1.2rem",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(254, 250, 223, 0.8)";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.background = "rgba(17, 17, 17, 0.85)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(211, 163, 115, 0.4)";
              e.currentTarget.style.color = "#FEFADF";
              e.currentTarget.style.background = "rgba(17, 17, 17, 0.55)";
            }}
          >
            <Mail size={15} style={{ color: "#D3A373", flexShrink: 0 }} />
            <span>wenmarcreates@gmail.com</span>
          </a>

          {/* Social Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-btn"
              aria-label="Facebook"
            >
              <FacebookIcon size={18} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-btn"
              aria-label="X (Twitter)"
            >
              <XIcon size={16} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-btn"
              aria-label="YouTube"
            >
              <YoutubeIcon size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-btn"
              aria-label="Instagram"
            >
              <InstagramIcon size={17} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-btn"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={17} />
            </a>
          </div>

          <div
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.7rem",
              color: "#EEDCAC",
              opacity: 0.5,
              letterSpacing: "0.08em"
            }}
          >
            WENMAR CREATES © 2026 // ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </div>
  );
};

/* High-End Tactile Hamburger Button Component */
export const LuxuryHamburgerButton = ({ onClick, isOpen = false }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
      type="button"
      className="luxury-hamburger-btn"
      aria-label="Toggle Navigation Menu"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.55rem 1.25rem",
        borderRadius: "9999px",
        background: "rgba(17, 17, 17, 0.72)",
        backgroundImage: "linear-gradient(135deg, rgba(36, 20, 11, 0.75) 0%, rgba(17, 17, 17, 0.92) 100%)",
        border: "1px solid rgba(211, 163, 115, 0.48)",
        boxShadow: "0 4px 18px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(254, 250, 223, 0.22)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        color: "#FEFADF",
        cursor: "pointer",
        transition: "all 0.26s cubic-bezier(0.22, 1, 0.36, 1)",
        userSelect: "none",
        position: "relative",
        zIndex: 50
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1.5px) scale(1.02)";
        e.currentTarget.style.borderColor = "rgba(254, 250, 223, 0.85)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 0 16px rgba(211, 163, 115, 0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.borderColor = "rgba(211, 163, 115, 0.48)";
        e.currentTarget.style.boxShadow = "0 4px 18px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(254, 250, 223, 0.22)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(0.96)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-1.5px) scale(1.02)";
      }}
    >
      {/* 3 Luxury Tactile Gold Bars */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "4px",
          width: "20px"
        }}
      >
        <span
          style={{
            height: "2px",
            width: "20px",
            background: "#FEFADF",
            borderRadius: "2px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
            transition: "transform 0.24s ease, width 0.24s ease"
          }}
        />
        <span
          style={{
            height: "2px",
            width: "14px",
            background: "#D3A373",
            borderRadius: "2px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
            transition: "transform 0.24s ease, width 0.24s ease"
          }}
        />
        <span
          style={{
            height: "2px",
            width: "18px",
            background: "#FEFADF",
            borderRadius: "2px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
            transition: "transform 0.24s ease, width 0.24s ease"
          }}
        />
      </div>

      <span
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "0.85rem",
          fontWeight: 800,
          letterSpacing: "0.14em",
          color: "#FEFADF",
          textShadow: "0 1px 8px rgba(0, 0, 0, 0.5)",
          textTransform: "uppercase"
        }}
      >
        Menu
      </span>
    </button>
  );
};
