import React from "react";
import { useApp } from "../../context/AppContext";
import { Bot, Shield, Globe, Award, Users, CheckCircle2 } from "lucide-react";

export const AboutView = () => {
  const { setCurrentView } = useApp();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem", display: "flex", flexDirection: "column", gap: "4rem" }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "1rem" }}>
          Empowering Businesses with <span className="gradient-text">Autonomous AI Workforce</span>
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: "750px", margin: "0 auto" }}>
          AayStyle was founded to solve a fundamental problem: modern businesses lose 60% of potential leads due to delayed follow-ups and missed phone calls. We built the ultimate commercial AI suite to automate every touchpoint.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", fontWeight: "800" }} className="gradient-text">1.2M+</div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>Verified B2B Leads Indexed</div>
        </div>
        <div className="glass-card" style={{ padding: "1.75rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", fontWeight: "800" }} className="gradient-text">4.8M+</div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>AI Voice Calls & Chats Handled</div>
        </div>
        <div className="glass-card" style={{ padding: "1.75rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", fontWeight: "800" }} className="gradient-text">99.98%</div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>Uptime SLA Guarantee</div>
        </div>
        <div className="glass-card" style={{ padding: "1.75rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", fontWeight: "800" }} className="gradient-text">1,240+</div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>Commercial Clients Globally</div>
        </div>
      </div>

      {/* Security & Infrastructure */}
      <div className="glass-card" style={{ padding: "2.5rem", background: "var(--bg-secondary)" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "1.25rem" }}>
          Enterprise-Grade Security & Compliance
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          We prioritize data privacy and confidentiality. AayStyle employs 256-bit AES encryption at rest, TLS 1.3 in transit, and complies with SOC2 Type II, HIPAA, and GDPR regulatory standards.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", fontSize: "0.9rem", fontWeight: "600" }}>
            <CheckCircle2 color="var(--accent-emerald)" size={18} /> SOC2 Type II Certified
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", fontSize: "0.9rem", fontWeight: "600" }}>
            <CheckCircle2 color="var(--accent-emerald)" size={18} /> HIPAA Compliant Voice AI
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", fontSize: "0.9rem", fontWeight: "600" }}>
            <CheckCircle2 color="var(--accent-emerald)" size={18} /> GDPR & CCPA Ready
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", fontSize: "0.9rem", fontWeight: "600" }}>
            <CheckCircle2 color="var(--accent-emerald)" size={18} /> End-to-End Encryption
          </div>
        </div>
      </div>

    </div>
  );
};
