import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Mail,
  Plus,
  Check,
  ArrowRight,
  ArrowLeft,
  Send,
  RefreshCw,
  AlertCircle,
  Clock,
  Globe,
  Filter,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { Modal } from "../common/Modal";

// Inline SVG Icon for Instagram
const InstagramIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Inline SVG Icon for Facebook
const FacebookIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export const EmailCampaignsView = () => {
  const { campaigns, setCampaigns, masterLeads, scrapedCampaignLeads, addToast, setCurrentView } = useApp();
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  const [localEmails, setLocalEmails] = useState(null);

  const emailList = localEmails || scrapedCampaignLeads || [];

  // Multi-step Campaign Builder State (Steps 1 to 6)
  const [builderStep, setBuilderStep] = useState(1);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "Automate consultations for {{business_name}} in {{city}}",
    body: "Hi {{first_name}},\n\nWe noticed {{business_name}} is operating in {{city}}'s {{industry}} sector. AayStyle can automate your customer inquiries 24/7.\n\nVisit {{website}} or reply to this email for a quick setup!\n\nBest regards,\nApex Digital Team",
    selectedLeadIds: masterLeads.map((l) => l.id),
    scheduleDate: new Date().toISOString().split("T")[0],
    scheduleTime: "09:00 AM"
  });

  const variableChips = ["{{first_name}}", "{{business_name}}", "{{city}}", "{{industry}}", "{{website}}"];

  const handleRetryEmail = (id, businessName) => {
    setLocalEmails((prev) => {
      const base = prev || scrapedCampaignLeads || [];
      return base.map((item) =>
        item.id === id ? { ...item, status: "Sending", sentAt: "Retrying now..." } : item
      );
    });

    addToast("Retrying Email", `Retrying email dispatch to ${businessName}...`, "info");

    setTimeout(() => {
      setLocalEmails((prev) => {
        const base = prev || scrapedCampaignLeads || [];
        return base.map((item) =>
          item.id === id ? { ...item, status: "Sent", sentAt: "Just now" } : item
        );
      });
      addToast("Email Delivered", `Successfully resent email to ${businessName}!`, "success");
    }, 1200);
  };

  const filteredEmails = emailList.filter((item) => {
    if (selectedStatusFilter === "ALL") return true;
    return item.status.toUpperCase() === selectedStatusFilter;
  });

  const renderSourceBadge = (sourceStr) => {
    const s = sourceStr || "Google Business Profile";
    const isGoogle = s.includes("Google");
    const isIG = s.includes("Instagram");
    const isFB = s.includes("Facebook");

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", alignItems: "center" }}>
        {isGoogle && (
          <span
            className="badge"
            style={{
              background: "rgba(66, 133, 244, 0.14)",
              color: "#60a5fa",
              border: "1px solid rgba(66, 133, 244, 0.3)",
              fontSize: "0.72rem",
              padding: "0.2rem 0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem"
            }}
          >
            <Globe size={12} /> Google
          </span>
        )}
        {isIG && (
          <span
            className="badge"
            style={{
              background: "rgba(225, 48, 108, 0.15)",
              color: "#f472b6",
              border: "1px solid rgba(225, 48, 108, 0.3)",
              fontSize: "0.72rem",
              padding: "0.2rem 0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem"
            }}
          >
            <InstagramIcon size={12} /> Instagram
          </span>
        )}
        {isFB && (
          <span
            className="badge"
            style={{
              background: "rgba(24, 119, 242, 0.15)",
              color: "#38bdf8",
              border: "1px solid rgba(24, 119, 242, 0.3)",
              fontSize: "0.72rem",
              padding: "0.2rem 0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem"
            }}
          >
            <FacebookIcon size={12} /> Facebook
          </span>
        )}
      </div>
    );
  };

  const renderStatusBadge = (status, errorMsg) => {
    switch (status) {
      case "Sent":
        return (
          <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: "800" }}>
            <CheckCircle2 size={13} /> Sent
          </span>
        );
      case "Sending":
        return (
          <span className="badge badge-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: "800" }}>
            <RefreshCw size={13} className="animate-spin" /> Sending...
          </span>
        );
      case "Error":
        return (
          <span className="badge" style={{ background: "rgba(225, 29, 72, 0.15)", color: "#f43f5e", border: "1px solid rgba(225, 29, 72, 0.3)", display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: "800" }} title={errorMsg || "Dispatch Error"}>
            <XCircle size={13} /> Error
          </span>
        );
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: "800" }}>Email Campaigns & Status Audit</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "0.2rem" }}>
            Real-time status tracking for scraped campaign emails (Sent, Sending, Error).
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => setCurrentView("leads")} className="btn-secondary" style={{ fontSize: "0.85rem" }}>
            <Plus size={16} /> New Scrape Campaign
          </button>
        </div>
      </div>

      {/* Campaign Email Performance Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <div className="glass-card" style={{ padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: "700", textTransform: "uppercase" }}>Total Delivered</span>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--accent-emerald)" }}>
            {emailList.filter(e => e.status === "Sent").length} Emails
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: "700", textTransform: "uppercase" }}>Sending In Progress</span>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--accent-primary)" }}>
            {emailList.filter(e => e.status === "Sending").length} Pending
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: "700", textTransform: "uppercase" }}>Bounced / Errors</span>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--accent-rose)" }}>
            {emailList.filter(e => e.status === "Error").length} Failed
          </div>
        </div>
      </div>

      {/* SCRAPED CAMPAIGN EMAILS STATUS TABLE */}
      <div className="glass-card" style={{ padding: "1.25rem", background: "var(--bg-secondary)", border: "1px solid var(--border-highlight)" }}>
        
        {/* Table Header & Status Filter Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.85rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800" }}>
              Scraped Campaign Email Logs
            </h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>
              Detailed delivery log for extracted leads by platform source and dispatch state.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "var(--bg-tertiary)", padding: "0.25rem", borderRadius: "var(--radius-sm)" }}>
            {["ALL", "SENT", "SENDING", "ERROR"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                style={{
                  fontSize: "0.75rem",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "4px",
                  background: selectedStatusFilter === st ? "var(--bg-secondary)" : "transparent",
                  color: selectedStatusFilter === st ? "var(--text-main)" : "var(--text-muted)",
                  fontWeight: selectedStatusFilter === st ? "800" : "600",
                  boxShadow: selectedStatusFilter === st ? "var(--shadow-sm)" : "none"
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Status Audit Table */}
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Scraped Email</th>
                <th>Source Platform</th>
                <th>Subject Line</th>
                <th>Email Status</th>
                <th>Time Log</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-subtle)" }}>
                    No campaign emails found matching the selected status filter.
                  </td>
                </tr>
              ) : (
                filteredEmails.map((item) => (
                  <tr key={item.id}>
                    
                    {/* Business Name */}
                    <td>
                      <div style={{ fontWeight: "800", color: "var(--text-main)", fontSize: "0.9rem" }}>{item.businessName}</div>
                    </td>

                    {/* Scraped Email */}
                    <td style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)" }}>
                      {item.email}
                    </td>

                    {/* Source Platform */}
                    <td>
                      {renderSourceBadge(item.source)}
                    </td>

                    {/* Subject Line */}
                    <td style={{ fontSize: "0.78rem", color: "var(--text-muted)", maxWidth: "220px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={item.subject}>
                      {item.subject}
                    </td>

                    {/* Email Status */}
                    <td>
                      {renderStatusBadge(item.status, item.errorMsg)}
                    </td>

                    {/* Time Log */}
                    <td style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>
                      {item.sentAt}
                    </td>

                    {/* Actions */}
                    <td>
                      {item.status === "Error" ? (
                        <button
                          onClick={() => handleRetryEmail(item.id, item.businessName)}
                          className="gradient-btn"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", whiteSpace: "nowrap" }}
                        >
                          <RotateCcw size={12} /> Retry Email
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>--</span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
