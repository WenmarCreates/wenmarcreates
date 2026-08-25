import React from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRight } from "lucide-react";
import logoImg from "../../assets/logo.png";

export const Header = () => {
  const { currentView, setCurrentView } = useApp();

  const publicNavLinks = [
    { label: "Home", key: "home" },
    { label: "About", key: "about" },
    { label: "Services", key: "services" },
    { label: "Pricing", key: "pricing" },
    { label: "Contact", key: "contact" }
  ];

  return (
    <header className="glass-panel" style={{ position: "sticky", top: 0, zIndex: 1000, borderBottom: "1px solid var(--border-color)", background: "var(--bg-glass)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", width: "100%" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0.6rem 1.5rem", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
        
        {/* Left Logo */}
        <div 
          onClick={() => setCurrentView("home")} 
          style={{ display: "flex", alignItems: "center", cursor: "pointer", justifySelf: "start" }}
        >
          <img 
            src={logoImg} 
            alt="AayStyle Logo" 
            style={{ 
              height: "68px", 
              width: "auto", 
              objectFit: "contain",
              borderRadius: "var(--radius-sm)",
              transition: "transform var(--transition-fast)"
            }} 
          />
        </div>

        {/* Center Floating Navigation Pill Container */}
        <nav 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.35rem",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-color)",
            padding: "0.35rem 0.6rem",
            borderRadius: "var(--radius-full)",
            boxShadow: "var(--shadow-sm)",
            justifySelf: "center"
          }}
        >
          {publicNavLinks.map((link) => {
            const isActive = link.key === currentView;
            return (
              <button
                key={link.key}
                onClick={() => setCurrentView(link.key)}
                style={{
                  fontSize: "0.85rem",
                  fontWeight: isActive ? "800" : "600",
                  color: isActive ? "#ffffff" : "var(--text-main)",
                  background: isActive ? "var(--gradient-primary)" : "transparent",
                  padding: "0.45rem 1.1rem",
                  borderRadius: "var(--radius-full)",
                  transition: "all var(--transition-fast)",
                  boxShadow: isActive ? "0 2px 8px rgba(87, 51, 37, 0.2)" : "none"
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifySelf: "end" }}>
          <button
            onClick={() => setCurrentView("login")}
            className="btn-denim"
            style={{ fontSize: "0.875rem", padding: "0.6rem 1.5rem" }}
          >
            Log In
          </button>
        </div>

      </div>
    </header>
  );
};
