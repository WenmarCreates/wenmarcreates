import React from "react";
import { useApp } from "../../context/AppContext";
import { Clock, MessageSquare, PhoneCall, Mail, Share2, Bot, User, CheckCircle2, Search } from "lucide-react";

export const ConversationHistoryView = () => {
  const { conversations, openLeadProfile, masterLeads } = useApp();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      
      <div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>Lead Conversation History Log</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>
          Audit trail of all customer interactions across Chat Widget, AI Receptionist calls, and Email outreach.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {conversations.map((conv) => (
          <div key={conv.id} className="glass-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)" }}>
            
            {/* Lead & Channel Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "var(--gradient-primary)", color: "#ffffff", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {conv.avatar}
                </div>
                <div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)" }}>{conv.leadName}</h4>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>Timestamp: {conv.timestamp}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="badge badge-primary">{conv.channel}</span>
                <button
                  onClick={() => {
                    const leadObj = masterLeads.find(m => conv.leadName.includes(m.name)) || masterLeads[0];
                    openLeadProfile(leadObj);
                  }}
                  className="btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}
                >
                  Lead Profile →
                </button>
              </div>
            </div>

            {/* Transcript Timeline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {conv.history.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", fontSize: "0.85rem" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: h.sender === "ai" ? "var(--accent-primary)" : "var(--bg-tertiary)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0, marginTop: "2px" }}>
                    {h.sender === "ai" ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div style={{ flex: 1, background: "var(--bg-tertiary)", padding: "0.65rem 0.85rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem", fontSize: "0.72rem", color: "var(--text-subtle)" }}>
                      <span style={{ fontWeight: "700", color: h.sender === "ai" ? "var(--accent-primary)" : "var(--text-main)" }}>
                        {h.sender === "ai" ? "AI Autonomous Response" : "Customer / Lead"}
                      </span>
                      <span>{h.time}</span>
                    </div>
                    <div style={{ color: "var(--text-main)", lineHeight: 1.4 }}>{h.text}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
