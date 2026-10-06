import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRight, Lock, Mail, Eye, EyeOff, X, Sparkles, CheckCircle2, ShieldCheck, Building2, User } from "lucide-react";
import logoImg from "../../assets/logo.png";
import heroBadgeImg from "../../assets/hero-badge.png";

export const SignUpView = () => {
  const { setCurrentView, addToast, setIsAuthenticated } = useApp();
  const [formData, setFormData] = useState({
    businessName: "Apex Digital Solutions",
    email: "admin@apexdigital.example.com",
    password: "••••••••••••",
    industry: "Marketing & Technology"
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    addToast("Account Created!", "14-Day Enterprise Trial activated. Welcome to AayStyle!");
    setCurrentView("dashboard");
  };

  const handleClose = () => {
    setCurrentView("home");
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
      {/* Popout Container Card */}
      <div 
        className="glass-card animate-fade-in" 
        style={{ 
          width: "100%", 
          maxWidth: "1040px", 
          maxHeight: "92vh",
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(211, 163, 115, 0.4)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
          position: "relative"
        }}
      >
        {/* Close Modal Button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            zIndex: 10,
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-main)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all var(--transition-fast)"
          }}
          title="Close Popout Modal"
        >
          <X size={20} />
        </button>

        {/* LEFT COLUMN: Brand Denim Showcase (Logo + Hero Image + Value Prop) */}
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
                  maxHeight: "125px", 
                  maxWidth: "100%", 
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "var(--radius-md)",
                  filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))"
                }} 
              />
            </div>

            <h2 style={{ fontSize: "1.6rem", fontWeight: "800", lineHeight: 1.3, marginBottom: "0.85rem", color: "#FEFADF" }}>
              Start 14-Day Free Workspace Trial
            </h2>
            <p style={{ fontSize: "0.9rem", color: "rgba(254, 250, 223, 0.85)", lineHeight: 1.6, marginBottom: "1.75rem" }}>
              No credit card required. Unlock full access to AI Web Chat, WebRTC Voice Calls, verified lead database, and automated CRM pipeline.
            </p>

            {/* Key Feature Badges */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                "Instant Live Web Call AI Receptionist Setup",
                "50 Free B2B Lead Scrapes per Day",
                "Omnichannel AI Web Chat & Social Connections",
                "Automated Google & Outlook Calendar Sync"
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
            <span>SOC2 Type II Certified • 256-bit Encrypted Enterprise SaaS</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Sign Up Form */}
        <div style={{ padding: "3rem 2.5rem", background: "#FEFADF", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto" }}>
          
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(211, 163, 115, 0.15)", border: "1px solid rgba(211, 163, 115, 0.3)", padding: "0.3rem 0.8rem", borderRadius: "var(--radius-full)", marginBottom: "0.75rem" }}>
              <Sparkles size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: "0.78rem", fontWeight: "800", color: "var(--text-main)" }}>Free Registration</span>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--text-main)" }}>Create Your Free Account</h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-subtle)", marginTop: "0.35rem" }}>
              Get started in under 60 seconds. Full feature access included.
            </p>
          </div>

          <form onSubmit={handleSignUp}>
            
            <div className="form-group" style={{ marginBottom: "1.1rem" }}>
              <label className="form-label" style={{ fontWeight: "700" }}>Business Name</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ paddingLeft: "2.6rem" }}
                  placeholder="e.g. Apex Digital Solutions"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
                <Building2 size={18} color="var(--text-subtle)" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.1rem" }}>
              <label className="form-label" style={{ fontWeight: "700" }}>Work Email Address</label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: "2.6rem" }}
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Mail size={18} color="var(--text-subtle)" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.1rem" }}>
              <label className="form-label" style={{ fontWeight: "700" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input"
                  style={{ paddingLeft: "2.6rem", paddingRight: "2.6rem" }}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Lock size={18} color="var(--text-subtle)" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-subtle)", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label" style={{ fontWeight: "700" }}>Industry Sector</label>
              <select
                className="form-select"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <option>Marketing & Technology</option>
                <option>Real Estate & Construction</option>
                <option>Healthcare & Dental</option>
                <option>Legal & Professional Services</option>
                <option>E-commerce & Retail</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn-denim" 
              style={{ width: "100%", justifyContent: "center", padding: "0.85rem", fontSize: "0.95rem" }}
            >
              Activate Free Trial & Launch Workspace <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--text-subtle)" }}>
            Already have a workspace account?{" "}
            <button
              onClick={() => setCurrentView("login")}
              style={{ background: "none", border: "none", color: "var(--accent-primary)", fontWeight: "800", cursor: "pointer", textDecoration: "underline" }}
            >
              Log In Here
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
