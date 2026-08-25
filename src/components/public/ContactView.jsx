import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Mail, Phone, MapPin, Send, Sparkles, ShieldCheck, User } from "lucide-react";
import logoImg from "../../assets/logo.png";
import heroBadgeImg from "../../assets/hero-badge.png";

export const ContactView = () => {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    name: "Sarah Connor",
    email: "sarah@company.com",
    company: "Skynet Systems",
    phone: "+1 (555) 019-2831",
    subject: "Enterprise Consultation",
    message: "We want to deploy the AI Voice Receptionist across our 5 office locations and integrate the verified lead database with our CRM."
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast("Message Received!", "Thank you for reaching out. Our enterprise AI advisor will contact you within 15 minutes.");
    setFormData({ name: "", email: "", company: "", phone: "", subject: "Enterprise Consultation", message: "" });
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      
      {/* UNIFIED 2-COLUMN CONTACT CARD */}
      <div 
        className="glass-card animate-fade-in" 
        style={{ 
          width: "100%", 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(211, 163, 115, 0.4)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
          position: "relative"
        }}
      >
        {/* LEFT SIDE OF CARD: Dark Denim Texture Background (#573325) */}
        <div 
          style={{ 
            backgroundColor: "#573325",
            backgroundImage: `
              linear-gradient(135deg, rgba(211, 163, 115, 0.35) 0%, rgba(87, 51, 37, 0.95) 100%),
              repeating-linear-gradient(45deg, rgba(254, 250, 223, 0.08) 0px, rgba(254, 250, 223, 0.08) 1px, transparent 1px, transparent 4px),
              repeating-linear-gradient(-45deg, rgba(254, 250, 223, 0.05) 0px, rgba(254, 250, 223, 0.05) 2px, transparent 2px, transparent 5px)
            `,
            padding: "3.5rem 2.5rem",
            color: "#FEFADF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <img 
                src={logoImg} 
                alt="AayStyle Logo" 
                style={{ 
                  height: "56px", 
                  width: "auto", 
                  objectFit: "contain",
                  borderRadius: "var(--radius-sm)",
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
                }} 
              />
            </div>

            {/* Hero Badge Image */}
            <div style={{ textAlign: "center", margin: "1.25rem 0 1.5rem" }}>
              <img 
                src={heroBadgeImg} 
                alt="AayStyle Hero Feature" 
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

            <h2 style={{ fontSize: "1.65rem", fontWeight: "800", lineHeight: 1.3, marginBottom: "0.85rem", color: "#FEFADF" }}>
              Get in Touch with AI Experts
            </h2>
            <p style={{ fontSize: "0.9rem", color: "rgba(254, 250, 223, 0.85)", lineHeight: 1.6, marginBottom: "1.75rem" }}>
              Have questions about Live Web Call AI Receptionist configuration, lead scraping compliance, or custom API keys? Our team is available 24/7.
            </p>

            {/* Contact Details List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", fontSize: "0.875rem", color: "#FEFADF" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(211, 163, 115, 0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={18} color="#D3A373" />
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(254, 250, 223, 0.7)", fontWeight: "700" }}>ENTERPRISE EMAIL</div>
                  <div style={{ fontWeight: "700" }}>support@aaystyle.example.com</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", fontSize: "0.875rem", color: "#FEFADF" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(211, 163, 115, 0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone size={18} color="#D3A373" />
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(254, 250, 223, 0.7)", fontWeight: "700" }}>AI VOICE DEMO LINE</div>
                  <div style={{ fontWeight: "700" }}>+1 (800) 555-0199</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", fontSize: "0.875rem", color: "#FEFADF" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(211, 163, 115, 0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={18} color="#D3A373" />
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(254, 250, 223, 0.7)", fontWeight: "700" }}>HEADQUARTERS</div>
                  <div style={{ fontWeight: "700" }}>750 Innovation Way, Suite 400</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(254, 250, 223, 0.8)" }}>Austin, TX 78701</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security SLA Badge */}
          <div style={{ paddingTop: "1.5rem", marginTop: "1.75rem", borderTop: "1px solid rgba(211, 163, 115, 0.3)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "rgba(254, 250, 223, 0.75)" }}>
            <ShieldCheck size={16} color="#D3A373" />
            <span>SOC2 Type II Certified • Guaranteed 15-Minute SLA</span>
          </div>
        </div>

        {/* RIGHT SIDE OF CARD: Warm Cream (#FEFADF) Form Side */}
        <div style={{ padding: "3.5rem 2.5rem", background: "#FEFADF", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(211, 163, 115, 0.15)", border: "1px solid rgba(211, 163, 115, 0.3)", padding: "0.3rem 0.8rem", borderRadius: "var(--radius-full)", marginBottom: "0.75rem" }}>
              <Sparkles size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: "0.78rem", fontWeight: "800", color: "var(--text-main)" }}>Enterprise Contact</span>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--text-main)" }}>Send Us a Message</h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-subtle)", marginTop: "0.35rem" }}>
              Fill out the form below and an AI technical advisor will respond within 15 minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div className="form-group" style={{ marginBottom: "1.1rem" }}>
              <label className="form-label" style={{ fontWeight: "700" }}>Your Full Name</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ paddingLeft: "2.6rem" }}
                  placeholder="e.g. Sarah Connor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <User size={18} color="var(--text-subtle)" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div className="form-row" style={{ marginBottom: "1.1rem" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>Business Email</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    required
                    className="form-input"
                    style={{ paddingLeft: "2.6rem" }}
                    placeholder="sarah@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Mail size={18} color="var(--text-subtle)" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>Phone Number</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: "2.6rem" }}
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Phone size={18} color="var(--text-subtle)" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.1rem" }}>
              <label className="form-label" style={{ fontWeight: "700" }}>Inquiry Subject</label>
              <select
                className="form-select"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="Enterprise Consultation">Enterprise Consultation & Audit</option>
                <option value="Live Web Call AI Receptionist Demo">Live Web Call AI Receptionist Demo</option>
                <option value="Lead Scraping Compliance">Lead Database & Scraper Inquiry</option>
                <option value="Custom API Integration">Custom API & White-label Request</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label" style={{ fontWeight: "700" }}>Message Details</label>
              <textarea
                rows="4"
                required
                placeholder="Tell us about your team size, expected call volume, and lead generation goals..."
                className="form-textarea"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn-denim" 
              style={{ width: "100%", justifyContent: "center", padding: "0.85rem", fontSize: "0.95rem" }}
            >
              <Send size={18} /> Send Message to AI Team
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
