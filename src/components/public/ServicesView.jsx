import React from "react";
import { useApp } from "../../context/AppContext";
import { MessageSquare, PhoneCall, Calendar, Search, Mail, ArrowRight } from "lucide-react";

export const ServicesView = () => {
  const { setCurrentView } = useApp();

  const servicePillars = [
    {
      title: "Live Web Call AI Receptionist",
      icon: PhoneCall,
      desc: "Our neural AI receptionist fields live web calls directly in-browser, speaks in natural conversational tones, checks appointment slots, and handles visitor inquiries in real time.",
      actionKey: "ai-receptionist"
    },
    {
      title: "AI Website Chat Widget",
      icon: MessageSquare,
      desc: "Deploy a high-converting floating chat widget on any website. Indexes your product docs and pricing to answer queries and capture verified lead emails instantly.",
      actionKey: "chat-widget"
    },
    {
      title: "Verified B2B Lead Marketplace",
      icon: Search,
      desc: "Access 1M+ business records with direct email addresses, decision-maker names, phone numbers, and company locations filtered by state and industry.",
      actionKey: "leads"
    },
    {
      title: "Automated Cold Email Campaigns",
      icon: Mail,
      desc: "Create multi-stage automated email workflows with dynamic tags like {{first_name}} and {{city}} to drive meeting bookings directly into your calendar.",
      actionKey: "campaigns"
    }
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem", display: "flex", flexDirection: "column", gap: "4rem" }}>
      
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "1rem" }}>
          Full-Stack AI <span className="gradient-text">Automation Services</span>
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: "700px", margin: "0 auto" }}>
          Explore our four core pillars engineered for modern enterprise sales and customer service operations.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
        {servicePillars.map((serv, idx) => {
          const Icon = serv.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.5rem" }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-md)", background: "var(--gradient-glow)", border: "1px solid var(--border-highlight)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-primary)", marginBottom: "1.2rem" }}>
                  <Icon size={24} />
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "0.75rem" }}>{serv.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{serv.desc}</p>
              </div>
              <button
                onClick={() => setCurrentView(serv.actionKey)}
                className="gradient-btn"
                style={{ width: "fit-content", fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}
              >
                Configure Service
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
