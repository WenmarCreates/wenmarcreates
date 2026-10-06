import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRight, X, Lock, Mail, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import logoImg from "../../assets/logo.png";
import heroBadgeImg from "../../assets/hero-badge.png";

export const LoginView = () => {
  const { setCurrentView, addToast, setIsAuthenticated } = useApp();
  const [email, setEmail] = useState("admin@apexdigital.example.com");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    addToast("Welcome Back!", "Logged into AayStyle Business Workspace.");
    setCurrentView("dashboard");
  };

  return (
    <div 
      style={{ 
        position: "fixed", 
        inset: 0, 
        zIndex: 2000, 
        background: "rgba(18, 12, 9, 0.52)", 
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "1.5rem",
        animation: "fadeIn 0.3s ease-out"
      }}
    >
      {/* Floating Close Button */}
      <button
        onClick={() => setCurrentView("home")}
        aria-label="Close"
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 20,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(254, 250, 223, 0.18)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(211, 163, 115, 0.4)",
          color: "#FEFADF",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(211, 163, 115, 0.35)";
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(254, 250, 223, 0.18)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <X size={20} />
      </button>

      {/* Popout Container Card */}
      <div 
        className="glass-card animate-fade-in" 
        style={{ 
          width: "100%", 
          maxWidth: "1020px", 
          maxHeight: "90vh",
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(211, 163, 115, 0.4)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.55)",
          position: "relative",
          zIndex: 10
        }}
      >
        {/* LEFT COLUMN: Brand Denim Showcase (Navbar Logo + Hero Image + Value Prop) */}
        <div 
          style={{ 
            backgroundColor: "#573325",
            backgroundImage: `
              linear-gradient(135deg, rgba(211, 163, 115, 0.35) 0%, rgba(87, 51, 37, 0.95) 100%),
              repeating-linear-gradient(45deg, rgba(254, 250, 223, 0.08) 0px, rgba(254, 250, 223, 0.08) 1px, transparent 1px, transparent 4px),
              repeating-linear-gradient(-45deg, rgba(254, 250, 223, 0.05) 0px, rgba(254, 250, 223, 0.05) 2px, transparent 2px, transparent 5px)
            `,
            padding: "3rem 2.5rem",
            color: "#FEFADF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative"
          }}
        >
          {/* Top Brand Logo */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <img 
                src={logoImg} 
                alt="Wenmar Creates Logo" 
                style={{ 
                  height: "56px", 
                  width: "auto", 
                  objectFit: "contain",
                  borderRadius: "var(--radius-sm)",
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
                }} 
              />
            </div>

            {/* Hero Image Showcase */}
            <div style={{ textAlign: "center", margin: "1rem 0 1.5rem" }}>
              <img 
                src={heroBadgeImg} 
                alt="Wenmar Creates Feature" 
                style={{ 
                  maxHeight: "130px", 
                  maxWidth: "100%", 
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "var(--radius-md)",
                  filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))"
                }} 
              />
            </div>

            <h2 style={{ fontSize: "1.6rem", fontWeight: "800", lineHeight: 1.3, marginBottom: "0.85rem", color: "#FEFADF" }}>
              Commercial AI Business Suite
            </h2>
            <p style={{ fontSize: "0.9rem", color: "rgba(254, 250, 223, 0.85)", lineHeight: 1.6, marginBottom: "1.75rem" }}>
              Automate customer conversations, live WebRTC voice calls, appointment booking, and B2B lead generation in one unified workspace.
            </p>

            {/* Key Feature Badges */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                "WebRTC Live In-Browser Web Voice Calls",
                "Omnichannel AI Chat Widget & Knowledge Base",
                "Verified B2B Lead Marketplace & Email Outreach",
                "Automated Calendar Sync & CRM Pipeline"
              ].map((feature, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.65rem", fontSize: "0.85rem", fontWeight: "600", color: "#FEFADF" }}>
                  <CheckCircle2 size={16} color="#D3A373" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Security Badge */}
          <div style={{ paddingTop: "1.5rem", marginTop: "1.5rem", borderTop: "1px solid rgba(211, 163, 115, 0.3)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "rgba(254, 250, 223, 0.75)" }}>
            <ShieldCheck size={16} color="#D3A373" />
            <span>SOC2 Type II Certified • 256-bit Encrypted Workspace</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Log In Form */}
        <div style={{ padding: "3rem 2.5rem", background: "#FEFADF", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(211, 163, 115, 0.15)", border: "1px solid rgba(211, 163, 115, 0.3)", padding: "0.3rem 0.8rem", borderRadius: "var(--radius-full)", marginBottom: "0.75rem" }}>
              <Sparkles size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: "0.78rem", fontWeight: "800", color: "var(--text-main)" }}>Admin Portal</span>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--text-main)" }}>Sign In to Dashboard</h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-subtle)", marginTop: "0.35rem" }}>
              Welcome back. Enter your administrator credentials to access the workspace.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            
            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label className="form-label" style={{ fontWeight: "700" }}>Admin Email</label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: "2.75rem", fontSize: "0.925rem" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={18} color="var(--text-subtle)" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <div className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700" }}>Password</span>
                <span style={{ fontSize: "0.78rem", color: "var(--accent-primary)", fontWeight: "700", cursor: "pointer" }}>Forgot Password?</span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input"
                  style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem", fontSize: "0.925rem" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={18} color="var(--text-subtle)" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-main)" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "#573325" }}
                />
                Remember me for 30 days
              </label>
            </div>

            {/* Denim Textured Submit Button */}
            <button 
              type="submit" 
              className="btn-denim" 
              style={{ width: "100%", justifyContent: "center", padding: "0.85rem", fontSize: "0.975rem", borderRadius: "var(--radius-md)" }}
            >
              Sign In to Dashboard
              <ArrowRight size={18} />
            </button>

          </form>

          {/* Return to Landing Page Link */}
          <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Administrator access only. Return to{" "}
            <span 
              onClick={() => setCurrentView("home")} 
              style={{ color: "var(--accent-primary)", fontWeight: "800", cursor: "pointer", textDecoration: "underline" }}
            >
              Landing Page
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
