import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Search,
  Bell,
  Sparkles,
  User,
  ChevronDown,
  LogOut,
  CheckCircle2,
  Building2,
  CreditCard
} from "lucide-react";

export const Topbar = () => {
  const { currentView, setCurrentView, setIsSearchOpen, billing, businessProfile } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const viewTitles = {
    dashboard: { title: "Executive Dashboard", desc: "Real-time AI automation performance & key operational metrics" },
    business: { title: "Business Profile Settings", desc: "Manage company info, operating hours, services, and policies" },
    "knowledge-base": { title: "AI Knowledge Base Engine", desc: "Train and index your enterprise vector database for Chat & Voice" },
    "chat-widget": { title: "Website Chat Widget Config", desc: "Customize, brand, and embed live AI web chat on your website" },
    "ai-receptionist": { title: "Live Web Call AI Receptionist", desc: "Configure voice tone, appointment rules, and live web call behavior" },
    appointments: { title: "Appointment Calendar", desc: "Schedule, manage, and track upcoming customer bookings" },
    messages: { title: "Unified Omnichannel Inbox", desc: "Consolidated messages from Chat, Voice Calls, Email, and Social" },
    social: { title: "Social Media Integrations", desc: "Connect Facebook, Instagram, WhatsApp, and Google Business" },
    leads: { title: "Launch Campaign", desc: "Set target location, niche, and email template to launch automated outreach" },
    "master-leads": { title: "Scheduled Scraping & Email Automations", desc: "Configure scheduled days and times to automatically scrape leads and send email templates" },
    campaigns: { title: "Email Outreach Campaigns", desc: "Build, preview, schedule, and launch multi-step cold email workflows" },
    conversations: { title: "Lead Conversation Timeline", desc: "Complete CRM interaction audit log with AI vs manual indicators" },
    "lead-profile": { title: "Lead Profile View", desc: "Deep-dive lead record, campaign history, and activity logs" },
    analytics: { title: "Advanced Analytics & Reports", desc: "Conversion funnels, reply rates, and AI call performance" },
    billing: { title: "Billing & Subscription Management", desc: "Manage plan tiers, track usage limits, and view invoices" },
    admin: { title: "Super Admin Console", desc: "Global tenant management, subscription overrides, and prompt logs" }
  };

  const currentInfo = viewTitles[currentView] || { title: "Dashboard", desc: "AayStyle Business Suite" };

  const notificationsList = [
    { id: 1, text: "AI Receptionist booked new appointment with Vanguard Health", time: "10 mins ago", type: "success" },
    { id: 2, text: "Email Campaign 'Real Estate Boost' reached 150+ opens", time: "1 hour ago", type: "info" },
    { id: 3, text: "Daily lead limit (34/50 used) - 68% reached", time: "3 hours ago", type: "warning" }
  ];

  return (
    <header
      className="glass-panel"
      style={{
        padding: "0.85rem 1.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border-color)",
        background: "var(--bg-glass)",
        position: "sticky",
        top: 0,
        zIndex: 80
      }}
    >
      {/* Title & Description */}
      <div>
        <h1 style={{ fontSize: "1.2rem", fontWeight: "800", letterSpacing: "-0.01em" }}>
          {currentInfo.title}
        </h1>
        <p style={{ fontSize: "0.78rem", color: "var(--text-subtle)", fontWeight: "600" }}>
          {currentInfo.desc}
        </p>
      </div>

      {/* Center Search Bar */}
      <div style={{ flex: 1, maxWidth: "420px", margin: "0 2rem" }}>
        <button
          onClick={() => setIsSearchOpen(true)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.55rem 0.9rem",
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-subtle)",
            fontSize: "0.85rem",
            cursor: "pointer"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <Search size={16} color="var(--text-main)" />
            <span style={{ color: "var(--text-subtle)" }}>Search leads, campaigns, appointments...</span>
          </div>
          <span style={{ fontSize: "0.7rem", background: "var(--bg-tertiary)", color: "var(--text-main)", fontWeight: "700", padding: "0.15rem 0.45rem", borderRadius: "4px", border: "1px solid var(--border-color)" }}>
            Ctrl + K
          </span>
        </button>
      </div>

      {/* Right User Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        
        {/* Upgrade Plan Badge */}
        <button
          onClick={() => setCurrentView("billing")}
          style={{
            background: "var(--gradient-glow)",
            border: "1px solid var(--border-highlight)",
            color: "var(--text-main)",
            padding: "0.4rem 0.8rem",
            borderRadius: "var(--radius-md)",
            fontSize: "0.78rem",
            fontWeight: "800",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem"
          }}
        >
          <Sparkles size={14} color="var(--accent-primary)" />
          <span>{billing.currentPlan} Plan</span>
        </button>

        {/* Notifications Popover Toggle */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: "relative",
              padding: "0.55rem",
              borderRadius: "var(--radius-sm)",
              background: "var(--bg-tertiary)",
              color: "var(--text-main)",
              display: "flex",
              alignItems: "center"
            }}
          >
            <Bell size={18} />
            <span style={{ position: "absolute", top: "4px", right: "4px", width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-rose)" }}></span>
          </button>

          {showNotifications && (
            <div
              className="glass-card animate-fade-in"
              style={{
                position: "absolute",
                right: 0,
                top: "120%",
                width: "320px",
                padding: "1rem",
                zIndex: 110,
                background: "var(--bg-secondary)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "800" }}>Notifications</span>
                <span className="badge badge-primary" style={{ fontSize: "0.68rem" }}>3 New</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {notificationsList.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "0.6rem", fontSize: "0.78rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                    <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ shrink: 0, marginTop: "2px" }} />
                    <div>
                      <div style={{ color: "var(--text-main)", lineHeight: 1.4, fontWeight: "600" }}>{item.text}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", marginTop: "2px" }}>{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.35rem 0.6rem",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
              cursor: "pointer"
            }}
          >
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", color: "#FEFADF", fontSize: "0.85rem", overflow: "hidden" }}>
              {businessProfile?.avatarUrl ? (
                <img src={businessProfile.avatarUrl} alt="User Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                businessProfile?.name ? businessProfile.name.substring(0, 2).toUpperCase() : "AD"
              )}
            </div>
            <div style={{ textAlign: "left", fontSize: "0.8rem" }}>
              <div style={{ fontWeight: "800", color: "var(--text-main)" }}>{businessProfile?.name || "Apex Digital"}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)" }}>Admin User</div>
            </div>
            <ChevronDown size={14} color="var(--text-main)" />
          </div>

          {showProfileMenu && (
            <div
              className="glass-card animate-fade-in"
              style={{
                position: "absolute",
                right: 0,
                top: "120%",
                width: "220px",
                padding: "0.5rem",
                zIndex: 110,
                background: "var(--bg-secondary)"
              }}
            >
              <button
                onClick={() => { setCurrentView("business"); setShowProfileMenu(false); }}
                style={{ width: "100%", padding: "0.55rem 0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem", color: "var(--text-main)", borderRadius: "var(--radius-sm)", fontWeight: "600" }}
              >
                <Building2 size={16} /> Business Settings
              </button>
              <button
                onClick={() => { setCurrentView("billing"); setShowProfileMenu(false); }}
                style={{ width: "100%", padding: "0.55rem 0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem", color: "var(--text-main)", borderRadius: "var(--radius-sm)", fontWeight: "600" }}
              >
                <CreditCard size={16} /> Subscription & Billing
              </button>
              <div style={{ borderTop: "1px solid var(--border-color)", margin: "0.35rem 0" }}></div>
              <button
                onClick={() => { setCurrentView("home"); setShowProfileMenu(false); }}
                style={{ width: "100%", padding: "0.55rem 0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem", color: "var(--accent-rose)", borderRadius: "var(--radius-sm)", fontWeight: "700" }}
              >
                <LogOut size={16} /> Log Out Demo
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
