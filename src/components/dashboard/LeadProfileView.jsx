import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { User, Building2, Mail, Phone, MapPin, Tag, Calendar, Clock, MessageSquare, ArrowLeft, Plus } from "lucide-react";

export const LeadProfileView = () => {
  const { selectedLead, setCurrentView, appointments, conversations, addToast } = useApp();
  const [activeTab, setActiveTab] = useState("overview");
  const [notesText, setNotesText] = useState(selectedLead?.notes || "");
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState(selectedLead?.tags || ["Medical", "Hot Lead"]);

  if (!selectedLead) {
    return (
      <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
        <p>No lead selected. Please return to Master Lead List.</p>
        <button onClick={() => setCurrentView("master-leads")} className="btn-secondary" style={{ marginTop: "1rem" }}>
          Back to Leads List
        </button>
      </div>
    );
  }

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    setTags([...tags, newTag]);
    setNewTag("");
    addToast("Tag Added", `Added tag '${newTag}' to ${selectedLead.name}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      
      {/* Top Return & Title Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setCurrentView("master-leads")} className="btn-secondary" style={{ fontSize: "0.85rem" }}>
          <ArrowLeft size={16} /> Back to Master Leads List
        </button>
        <span className="badge badge-success">Score: {selectedLead.score || 92} / 100</span>
      </div>

      {/* Main Profile Glass Header Card */}
      <div className="glass-card" style={{ padding: "2rem", background: "var(--bg-secondary)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--gradient-primary)", color: "#ffffff", fontWeight: "800", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {selectedLead.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "800" }}>{selectedLead.name}</h2>
            <div style={{ fontSize: "0.875rem", color: "var(--text-subtle)", marginTop: "0.2rem" }}>
              {selectedLead.contactPerson} • {selectedLead.industry} • {selectedLead.location}
            </div>
            
            {/* Tags list */}
            <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.65rem", flexWrap: "wrap" }}>
              {tags.map((t, idx) => (
                <span key={idx} className="badge badge-primary" style={{ fontSize: "0.72rem" }}>
                  <Tag size={12} /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "right" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>CRM Status: <strong style={{ color: "var(--accent-primary)" }}>{selectedLead.status}</strong></div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Active Campaign: <strong>{selectedLead.campaign}</strong></div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
        {[
          { id: "overview", label: "Business Info & Contact" },
          { id: "campaigns", label: "Campaign & Email History" },
          { id: "conversations", label: "Chat & Call History" },
          { id: "notes", label: "CRM Notes & Tags" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "0.55rem 1.1rem",
              borderRadius: "var(--radius-sm)",
              background: activeTab === tab.id ? "var(--accent-primary)" : "var(--bg-tertiary)",
              color: activeTab === tab.id ? "#ffffff" : "var(--text-muted)",
              fontSize: "0.85rem",
              fontWeight: activeTab === tab.id ? "700" : "500"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="glass-card" style={{ padding: "1.75rem", background: "var(--bg-secondary)" }}>
        
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "1rem", color: "var(--accent-primary)" }}>Contact Details</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Mail size={16} color="var(--accent-cyan)" /> <strong>Email:</strong> {selectedLead.email}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Phone size={16} color="var(--accent-emerald)" /> <strong>Phone:</strong> {selectedLead.phone}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <MapPin size={16} color="var(--accent-rose)" /> <strong>Location:</strong> {selectedLead.location}
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "1rem", color: "var(--accent-primary)" }}>Account Metrics</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
                <div><strong>Marketplace Score:</strong> {selectedLead.score} / 100</div>
                <div><strong>Last Contacted:</strong> {selectedLead.lastContact}</div>
                <div><strong>Lead Source:</strong> Verified B2B Marketplace</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "1rem" }}>Campaign & Email Log</h4>
            <div style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem" }}>
              <div style={{ fontWeight: "700", color: "var(--accent-primary)" }}>Campaign: {selectedLead.campaign}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "0.2rem" }}>Email Delivered & Opened • Reply Received</div>
            </div>
          </div>
        )}

        {activeTab === "conversations" && (
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "1rem" }}>Chat & Voice Call Interactions</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {conversations.map((c) => (
                <div key={c.id} style={{ background: "var(--bg-tertiary)", padding: "0.85rem", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--accent-primary)" }}>{c.channel} - {c.timestamp}</div>
                  <div style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>{c.lastMsg}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "1rem" }}>CRM Internal Notes & Tags</h4>
            <div className="form-group">
              <label className="form-label">Notes on Lead Opportunity</label>
              <textarea
                rows="4"
                className="form-textarea"
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
              ></textarea>
            </div>

            {/* Tag add form */}
            <form onSubmit={handleAddTag} style={{ display: "flex", gap: "0.5rem", maxWidth: "400px" }}>
              <input
                type="text"
                placeholder="Add custom tag (e.g. VIP Client)..."
                className="form-input"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button type="submit" className="gradient-btn" style={{ padding: "0.55rem 1rem", fontSize: "0.825rem", whiteSpace: "nowrap" }}>
                + Add Tag
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};
