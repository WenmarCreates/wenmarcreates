import React from "react";
import { useApp } from "../../context/AppContext";
import { Mail, Shield, Sparkles, PhoneCall, Globe, CheckCircle2 } from "lucide-react";
import logoImg from "../../assets/logo.png";

export const Footer = () => {
  const { setCurrentView } = useApp();

  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)", marginTop: "auto" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 1.5rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>
          
          {/* Col 1 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1.2rem" }}>
              <img 
                src={logoImg} 
                alt="Wenmar Creates Logo" 
                style={{ 
                  height: "44px", 
                  width: "auto", 
                  objectFit: "contain",
                  borderRadius: "var(--radius-sm)"
                }} 
              />
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              The complete commercial AI business automation suite. Receptionist, omnichannel chat, lead database, and outreach workflows in one platform.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span className="badge badge-success">
                <CheckCircle2 size={12} /> SOC2 Type II Certified
              </span>
              <span className="badge badge-primary">
                <Shield size={12} /> 99.9% Uptime SLA
              </span>
            </div>
          </div>

          {/* Col 2 - Solutions */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "1.2rem", color: "var(--text-main)" }}>Solutions</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
              <li style={{ cursor: "pointer" }} onClick={() => setCurrentView("chat-widget")}>AI Website Chat Widget</li>
              <li style={{ cursor: "pointer" }} onClick={() => setCurrentView("ai-receptionist")}>AI Voice Call Receptionist</li>
              <li style={{ cursor: "pointer" }} onClick={() => setCurrentView("knowledge-base")}>AI Knowledge Base Generator</li>
              <li style={{ cursor: "pointer" }} onClick={() => setCurrentView("leads")}>Verified Lead Database</li>
              <li style={{ cursor: "pointer" }} onClick={() => setCurrentView("campaigns")}>Automated Email Outreach</li>
            </ul>
          </div>

          {/* Col 3 - Navigation */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "1.2rem", color: "var(--text-main)" }}>Navigation</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
              <li style={{ cursor: "pointer" }} onClick={() => { setCurrentView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Home</li>
              <li style={{ cursor: "pointer" }} onClick={() => {
                setCurrentView("home");
                setTimeout(() => {
                  const el = document.getElementById("workstation-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}>Executive Workstation</li>
              <li style={{ cursor: "pointer" }} onClick={() => {
                setCurrentView("home");
                setTimeout(() => {
                  const el = document.getElementById("portfolio-stage") || document.getElementById("workstation-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}>Creative Portfolio</li>
              <li style={{ cursor: "pointer" }} onClick={() => { setCurrentView("login"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Admin Login</li>
              <li style={{ cursor: "pointer" }} onClick={() => setCurrentView("dashboard")}>Admin Dashboard</li>
            </ul>
          </div>

          {/* Col 4 - Newsletter */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "1.2rem", color: "var(--text-main)" }}>Stay Updated</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Get monthly AI automation strategy guides & product updates.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input 
                type="email" 
                placeholder="Enter your business email" 
                className="form-input" 
                style={{ fontSize: "0.825rem", padding: "0.55rem 0.8rem" }} 
              />
              <button className="gradient-btn" style={{ padding: "0.55rem 1rem", fontSize: "0.825rem", whiteSpace: "nowrap" }}>
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: "1px solid var(--border-color)", 
          paddingTop: "1.8rem", 
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "space-between", 
          alignItems: "center", 
          gap: "1rem", 
          fontSize: "0.825rem", 
          color: "var(--text-subtle)" 
        }}>
          <div>© 2026 AayStyle Platform Inc. All rights reserved. Built for commercial enterprise automation.</div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
            <span style={{ cursor: "pointer" }}>Terms of Service</span>
            <span style={{ cursor: "pointer" }}>Security & Compliance</span>
            <span style={{ cursor: "pointer" }}>API Docs</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
