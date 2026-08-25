import React from "react";
import { X, Sparkles } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children, maxWidth = "680px" }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(18, 12, 9, 0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        animation: "fadeIn 0.3s ease-out"
      }}
      onClick={onClose}
    >
      {/* Popout Container Card matching Login Card Design */}
      <div
        className="glass-card animate-fade-in"
        style={{
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(211, 163, 115, 0.4)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
          position: "relative",
          background: "#FEFADF"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luxury Denim Header matching Login Left Column */}
        <div
          style={{
            backgroundColor: "#573325",
            backgroundImage: `
              linear-gradient(135deg, rgba(211, 163, 115, 0.35) 0%, rgba(87, 51, 37, 0.95) 100%),
              repeating-linear-gradient(45deg, rgba(254, 250, 223, 0.08) 0px, rgba(254, 250, 223, 0.08) 1px, transparent 1px, transparent 4px),
              repeating-linear-gradient(-45deg, rgba(254, 250, 223, 0.05) 0px, rgba(254, 250, 223, 0.05) 2px, transparent 2px, transparent 5px)
            `,
            padding: "1.25rem 2rem",
            color: "#FEFADF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            borderBottom: "1px solid rgba(211, 163, 115, 0.4)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "rgba(211, 163, 115, 0.25)", border: "1px solid rgba(211, 163, 115, 0.5)", padding: "0.25rem 0.65rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: "800", color: "#FEFADF" }}>
              <Sparkles size={13} color="#D3A373" />
              <span>AAYSTYLE AI</span>
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#FEFADF", margin: 0 }}>
              {title}
            </h3>
          </div>

          {/* Close Modal Button (Circular icon button matching Login Card) */}
          <button
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(254, 250, 223, 0.15)",
              border: "1px solid rgba(254, 250, 223, 0.3)",
              color: "#FEFADF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all var(--transition-fast)"
            }}
            title="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body with smooth scrolling and #FEFADF luxury card background */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.75rem 2rem", color: "#392119" }}>
          {children}
        </div>

      </div>
    </div>
  );
};
