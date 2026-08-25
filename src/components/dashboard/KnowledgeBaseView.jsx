import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { BookOpen, Sparkles, Edit3, RefreshCw, Save, Trash2, CheckCircle2, FileText } from "lucide-react";

export const KnowledgeBaseView = () => {
  const { kbInput, setKbInput, generatedKb, generateKnowledgeBase, addToast } = useApp();
  const [activeTab, setActiveTab] = useState("companyOverview");
  const [isEditing, setIsEditing] = useState(false);
  const [kbSections, setKbSections] = useState(generatedKb.sections);

  const handleSaveKb = () => {
    setIsEditing(false);
    addToast("Knowledge Base Saved", "AI Knowledge base vectors updated across Chat & Voice Receptionist.");
  };

  const handleDeleteKb = () => {
    if (window.confirm("Are you sure you want to clear the AI Knowledge Base?")) {
      addToast("Knowledge Base Reset", "AI Knowledge Base cleared.", "warning");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Inputs Card */}
      <div className="glass-card" style={{ padding: "2rem", background: "var(--bg-secondary)" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "800" }}>AI Knowledge Base Input Builder</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>
              Provide information below to generate your custom AI vector memory for automated customer support and voice calls.
            </p>
          </div>
          <button onClick={generateKnowledgeBase} className="gradient-btn" style={{ padding: "0.75rem 1.8rem", fontSize: "0.95rem" }}>
            <Sparkles size={18} /> Generate Knowledge Base
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-input"
              value={kbInput.companyName}
              onChange={(e) => setKbInput({ ...kbInput, companyName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Details</label>
            <input
              type="text"
              className="form-input"
              value={kbInput.contact}
              onChange={(e) => setKbInput({ ...kbInput, contact: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">About Company</label>
            <textarea
              rows="2"
              className="form-textarea"
              value={kbInput.about}
              onChange={(e) => setKbInput({ ...kbInput, about: e.target.value })}
            ></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Services Offered</label>
            <textarea
              rows="2"
              className="form-textarea"
              value={kbInput.services}
              onChange={(e) => setKbInput({ ...kbInput, services: e.target.value })}
            ></textarea>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Frequently Asked Questions (FAQs)</label>
            <textarea
              rows="3"
              className="form-textarea"
              value={kbInput.faqs}
              onChange={(e) => setKbInput({ ...kbInput, faqs: e.target.value })}
            ></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Special Offers & Promotions</label>
            <textarea
              rows="3"
              className="form-textarea"
              value={kbInput.offers}
              onChange={(e) => setKbInput({ ...kbInput, offers: e.target.value })}
            ></textarea>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Business Operating Hours</label>
            <input
              type="text"
              className="form-input"
              value={kbInput.hours}
              onChange={(e) => setKbInput({ ...kbInput, hours: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Company Guarantees & Policies</label>
            <input
              type="text"
              className="form-input"
              value={kbInput.policies}
              onChange={(e) => setKbInput({ ...kbInput, policies: e.target.value })}
            />
          </div>
        </div>

      </div>

      {/* Generated Knowledge Base Preview */}
      {generatedKb.isGenerated && (
        <div className="glass-card animate-fade-in" style={{ padding: "2rem", background: "var(--bg-secondary)", border: "1px solid var(--border-highlight)" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "800" }}>Generated AI Vector Knowledge Base</h3>
                <span className="badge badge-success">Active Sync</span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "2px" }}>
                Last indexed: {generatedKb.lastGenerated} • Ready for Chat Widget & Voice Receptionist
              </p>
            </div>

            {/* Action Bar: Edit, Regenerate, Save, Delete */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-secondary"
                style={{ fontSize: "0.85rem" }}
              >
                <Edit3 size={16} /> {isEditing ? "View Preview" : "Edit Section"}
              </button>
              <button
                onClick={generateKnowledgeBase}
                className="btn-secondary"
                style={{ fontSize: "0.85rem" }}
              >
                <RefreshCw size={16} /> Regenerate
              </button>
              <button
                onClick={handleSaveKb}
                className="gradient-btn"
                style={{ fontSize: "0.85rem" }}
              >
                <Save size={16} /> Save Changes
              </button>
              <button
                onClick={handleDeleteKb}
                style={{ padding: "0.55rem 0.85rem", background: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Trash2 size={16} /> Clear KB
              </button>
            </div>
          </div>

          {/* Rendered Preview Navigation Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-color)", marginBottom: "1.5rem" }}>
            {[
              { id: "companyOverview", label: "Company Overview" },
              { id: "services", label: "Services" },
              { id: "faqs", label: "FAQs" },
              { id: "offers", label: "Offers" },
              { id: "policies", label: "Policies" },
              { id: "hours", label: "Hours" },
              { id: "contactInformation", label: "Contact Info" },
              { id: "appointmentInformation", label: "Appointments" },
              { id: "generalInstructions", label: "AI Instructions" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "0.5rem 0.9rem",
                  borderRadius: "var(--radius-sm)",
                  background: activeTab === tab.id ? "var(--accent-primary)" : "var(--bg-tertiary)",
                  color: activeTab === tab.id ? "#ffffff" : "var(--text-muted)",
                  fontSize: "0.825rem",
                  fontWeight: activeTab === tab.id ? "700" : "500",
                  whiteSpace: "nowrap"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Section View / Editor */}
          <div style={{ background: "var(--bg-tertiary)", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            
            {activeTab === "companyOverview" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.75rem" }}>Company Overview Vector Document</h4>
                {isEditing ? (
                  <textarea
                    rows="4"
                    className="form-textarea"
                    value={kbSections.companyOverview}
                    onChange={(e) => setKbSections({ ...kbSections, companyOverview: e.target.value })}
                  />
                ) : (
                  <p style={{ fontSize: "0.9rem", color: "var(--text-main)", lineHeight: 1.6 }}>{kbSections.companyOverview}</p>
                )}
              </div>
            )}

            {activeTab === "services" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.75rem" }}>Indexed Services List</h4>
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.9rem", lineHeight: 1.8 }}>
                  {kbSections.services.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "faqs" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.75rem" }}>FAQ Vector Pairs</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {kbSections.faqs.map((faq, i) => (
                    <div key={i} style={{ background: "var(--bg-secondary)", padding: "0.85rem", borderRadius: "var(--radius-sm)" }}>
                      <div style={{ fontWeight: "700", fontSize: "0.875rem", color: "var(--accent-primary)" }}>{faq.q}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-main)", marginTop: "0.2rem" }}>{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "offers" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.75rem" }}>Active Special Offers</h4>
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.9rem", lineHeight: 1.8 }}>
                  {kbSections.offers.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "policies" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.75rem" }}>Policies & SLA Terms</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>{kbSections.policies}</p>
              </div>
            )}

            {activeTab === "hours" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.75rem" }}>Business Operating Hours</h4>
                <pre style={{ fontSize: "0.875rem", fontFamily: "inherit", color: "var(--text-main)", whiteSpace: "pre-wrap" }}>{kbSections.hours}</pre>
              </div>
            )}

            {activeTab === "contactInformation" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.75rem" }}>Verified Contact Channels</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>{kbSections.contactInformation}</p>
              </div>
            )}

            {activeTab === "appointmentInformation" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.75rem" }}>Appointment Booking Rules</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>{kbSections.appointmentInformation}</p>
              </div>
            )}

            {activeTab === "generalInstructions" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.75rem" }}>System Prompt Instructions</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--text-main)", fontStyle: "italic" }}>{kbSections.generalInstructions}</p>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
