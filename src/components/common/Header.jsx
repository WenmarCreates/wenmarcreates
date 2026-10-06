import React from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRight, ShieldCheck, ChevronDown, Code, Zap, Layers } from "lucide-react";
import navLogoImg from "../../assets/nav-logo.png";
import wenmarWordmarkImg from "../../assets/wenmar-creates-wordmark.png";

export const Header = ({ isFloating = false, isGlass = false, isScrolled: propIsScrolled, style = {} }) => {
  const { currentView, setCurrentView } = useApp();
  const [internalScrolled, setInternalScrolled] = React.useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = React.useState(false);
  const dropdownTimeoutRef = React.useRef(null);

  React.useEffect(() => {
    if (propIsScrolled !== undefined) return;
    const handleScroll = () => {
      setInternalScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [propIsScrolled]);

  const isScrolled = propIsScrolled !== undefined ? propIsScrolled : internalScrolled;
  const isGlassActive = (isGlass || isFloating) && isScrolled;

  const handleMouseEnterPortfolio = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsPortfolioOpen(true);
  };

  const handleMouseLeavePortfolio = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsPortfolioOpen(false);
    }, 180);
  };

  const navLinks = [
    { label: "Home", key: "home", type: "link" },
    { label: "About", key: "about", type: "link" },
    { label: "Services", key: "services", type: "link" },
    {
      label: "Portfolio",
      key: "portfolio",
      type: "dropdown",
      subItems: [
        { label: "Website dev", key: "web-dev", icon: Code },
        { label: "Automations", key: "automations", icon: Zap },
        { label: "GHL", key: "ghl", icon: Layers }
      ]
    },
    { label: "Contact", key: "contact", type: "link" }
  ];

  const handleNavClick = (key) => {
    setIsPortfolioOpen(false);
    if (key === currentView && key === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentView(key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePortfolioSubClick = (subKey) => {
    setIsPortfolioOpen(false);
    const scrollTarget = () => {
      if (subKey === "web-dev" || subKey === "automations") {
        const el = document.getElementById("portfolio-stage") || document.getElementById("workstation-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (subKey === "ghl") {
        const el = document.getElementById("workstation-section") || document.getElementById("portfolio-stage");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    if (currentView !== "home") {
      setCurrentView("home");
      setTimeout(scrollTarget, 150);
    } else {
      scrollTarget();
    }
  };

  return (
    <header 
      className={isGlassActive ? "glass-panel" : ""}
      style={{ 
        position: "sticky", 
        top: 0, 
        left: 0,
        right: 0,
        zIndex: 1000, 
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        background: isGlassActive 
          ? "rgba(254, 250, 223, 0.75)" 
          : (isGlass || isFloating ? "transparent" : "rgba(254, 250, 223, 0.96)"), 
        backgroundImage: isGlassActive 
          ? "linear-gradient(180deg, rgba(254, 250, 223, 0.82) 0%, rgba(255, 253, 245, 0.68) 100%)" 
          : "none",
        backdropFilter: isGlassActive ? "blur(20px) saturate(180%)" : "none", 
        WebkitBackdropFilter: isGlassActive ? "blur(20px) saturate(180%)" : "none", 
        borderTop: isGlassActive ? "1px solid rgba(255, 255, 255, 0.6)" : "none",
        borderBottom: isGlassActive 
          ? "1px solid rgba(211, 163, 115, 0.35)" 
          : (isGlass || isFloating ? "1px solid rgba(211, 163, 115, 0.2)" : "1px solid rgba(87, 51, 37, 0.12)"), 
        borderRadius: 0,
        boxShadow: isGlassActive 
          ? "0 10px 30px rgba(87, 51, 37, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.75)" 
          : "none", 
        transition: "background 0.3s cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        ...style
      }}
    >
      <div 
        style={{ 
          maxWidth: "1240px", 
          margin: "0 auto", 
          padding: "1.15rem 1.5rem", 
          minHeight: "78px", 
          display: "grid", 
          gridTemplateColumns: "1fr auto 1fr", 
          alignItems: "center" 
        }}
      >
        
        {/* Left: Brand Emblem Logo & Wordmark */}
        <div 
          onClick={() => handleNavClick("home")} 
          style={{ display: "flex", alignItems: "center", gap: "0.85rem", cursor: "pointer", justifySelf: "start" }}
        >
          <img 
            src={navLogoImg} 
            alt="Wenmar Creates Emblem" 
            style={{ 
              height: "48px", 
              width: "auto", 
              objectFit: "contain",
              transition: "transform var(--transition-fast)",
              filter: "drop-shadow(0 3px 10px rgba(87, 51, 37, 0.14))"
            }} 
          />
          <img 
            src={wenmarWordmarkImg} 
            alt="Wenmar Creates" 
            style={{ 
              height: "29px", 
              width: "auto", 
              objectFit: "contain",
              filter: "drop-shadow(0 2px 8px rgba(87, 51, 37, 0.12))"
            }} 
          />
        </div>

        {/* Center: Complete Navigation Links */}
        <nav 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.35rem",
            background: isGlassActive ? "rgba(238, 220, 172, 0.45)" : (isGlass ? "rgba(238, 220, 172, 0.35)" : "var(--bg-tertiary)"),
            backdropFilter: isGlassActive ? "blur(12px)" : "none",
            WebkitBackdropFilter: isGlassActive ? "blur(12px)" : "none",
            border: isGlassActive ? "1px solid rgba(211, 163, 115, 0.45)" : "1px solid var(--border-color)",
            padding: "0.42rem 0.65rem",
            borderRadius: "var(--radius-full)",
            boxShadow: isGlassActive ? "0 2px 10px rgba(87, 51, 37, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)" : "var(--shadow-sm)",
            transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
            justifySelf: "center",
            position: "relative"
          }}
        >
          {navLinks.map((link) => {
            if (link.type === "dropdown") {
              const isPortfolioActive = currentView === "portfolio";
              return (
                <div
                  key={link.key}
                  style={{ position: "relative" }}
                  onMouseEnter={handleMouseEnterPortfolio}
                  onMouseLeave={handleMouseLeavePortfolio}
                >
                  <button
                    onClick={() => {
                      setIsPortfolioOpen(prev => !prev);
                    }}
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: isPortfolioActive ? "800" : "600",
                      color: isPortfolioActive ? "#ffffff" : "var(--text-main)",
                      background: isPortfolioActive 
                        ? "var(--gradient-primary)" 
                        : (isPortfolioOpen ? "rgba(211, 163, 115, 0.22)" : "transparent"),
                      padding: "0.52rem 1.15rem",
                      borderRadius: "var(--radius-full)",
                      transition: "all var(--transition-fast)",
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem"
                    }}
                  >
                    <span>{link.label}</span>
                    <ChevronDown 
                      size={14} 
                      strokeWidth={2.4} 
                      style={{
                        transform: isPortfolioOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.22s ease",
                        color: isPortfolioActive ? "#ffffff" : "#703E20"
                      }}
                    />
                  </button>

                  {/* Portfolio Dropdown Menu */}
                  {isPortfolioOpen && (
                    <div
                      className="nav-dropdown-menu"
                      style={{
                        position: "absolute",
                        top: "calc(100% + 0.55rem)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(254, 250, 223, 0.96)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(211, 163, 115, 0.45)",
                        borderRadius: "14px",
                        padding: "0.45rem",
                        boxShadow: "0 14px 35px rgba(87, 51, 37, 0.16), 0 0 1px rgba(211, 163, 115, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                        minWidth: "185px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                        zIndex: 1100
                      }}
                    >
                      {link.subItems.map((sub) => {
                        const Icon = sub.icon;
                        return (
                          <button
                            key={sub.key}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePortfolioSubClick(sub.key);
                            }}
                            className="nav-dropdown-item"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.7rem",
                              width: "100%",
                              padding: "0.6rem 0.95rem",
                              borderRadius: "10px",
                              border: "none",
                              background: "transparent",
                              color: "#573325",
                              fontSize: "0.86rem",
                              fontWeight: "650",
                              textAlign: "left",
                              cursor: "pointer",
                              transition: "all 0.18s ease",
                              whiteSpace: "nowrap"
                            }}
                          >
                            <Icon size={15} style={{ color: "#703E20", flexShrink: 0 }} />
                            <span>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = link.key === currentView;
            return (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.key)}
                style={{
                  fontSize: "0.88rem",
                  fontWeight: isActive ? "800" : "600",
                  color: isActive ? "#ffffff" : "var(--text-main)",
                  background: isActive ? "var(--gradient-primary)" : "transparent",
                  padding: "0.52rem 1.15rem",
                  borderRadius: "var(--radius-full)",
                  transition: "all var(--transition-fast)",
                  boxShadow: isActive ? "0 2px 8px rgba(87, 51, 37, 0.2)" : "none",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifySelf: "end" }}>
          <button
            onClick={() => handleNavClick("login")}
            className="btn-denim"
            style={{ fontSize: "0.88rem", padding: "0.62rem 1.45rem" }}
          >
            <ShieldCheck size={15} strokeWidth={2.2} />
            <span>Admin Access</span>
          </button>
        </div>

      </div>
    </header>
  );
};
