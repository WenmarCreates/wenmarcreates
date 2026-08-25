import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  MessageSquare,
  PhoneCall,
  Calendar,
  Inbox,
  Share2,
  Search,
  Users,
  Mail,
  Clock,
  BarChart3,
  CreditCard,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Globe
} from "lucide-react";
import logoImg from "../../assets/logo.png";

export const Sidebar = () => {
  const { currentView, setCurrentView, businessProfile, masterLeads, automations, appointments, conversations } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const navGroups = [
    {
      title: "Core Platform",
      items: [
        { label: "Dashboard", key: "dashboard", icon: LayoutDashboard },
        { label: "Business Profile", key: "business", icon: Building2 }
      ]
    },
    {
      title: "AI Engines",
      items: [
        { label: "AI Knowledge Base", key: "knowledge-base", icon: BookOpen },
        { label: "Chat Widget", key: "chat-widget", icon: MessageSquare },
        { label: "AI Receptionist", key: "ai-receptionist", icon: PhoneCall }
      ]
    },
    {
      title: "Customer Ops",
      items: [
        { 
          label: "Appointments", 
          key: "appointments", 
          icon: Calendar,
          badge: appointments.filter(a => a.status === "Upcoming").length 
        },
        { 
          label: "Unified Messages", 
          key: "messages", 
          icon: Inbox,
          badge: conversations.filter(c => c.unread).length 
        },
        { label: "Social Connections", key: "social", icon: Share2 }
      ]
    },
    {
      title: "Lead Scraping & Campaigns",
      items: [
        { label: "Launch Campaign", key: "leads", icon: Search },
        { label: "Email Campaigns & Status", key: "campaigns", icon: Mail },
        { 
          label: "Automation", 
          key: "master-leads", 
          icon: Clock,
          badge: automations ? automations.length : 2
        },
        { label: "Conversation History", key: "conversations", icon: Clock }
      ]
    },
    {
      title: "Management",
      items: [
        { label: "Analytics", key: "analytics", icon: BarChart3 },
        { label: "Billing & Plans", key: "billing", icon: CreditCard },
        { label: "Admin Console", key: "admin", icon: ShieldCheck }
      ]
    }
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: collapsed ? "80px" : "270px",
        transition: "width var(--transition-normal)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 90,
        borderRight: "1px solid var(--border-color)",
        background: "var(--bg-glass)",
        userSelect: "none"
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          padding: "1.2rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          borderBottom: "1px solid var(--border-color)"
        }}
      >
        {!collapsed ? (
          <div 
            onClick={() => setCurrentView("dashboard")} 
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <img 
              src={logoImg} 
              alt="AayStyle Logo" 
              style={{ 
                height: "38px", 
                width: "auto", 
                objectFit: "contain",
                borderRadius: "var(--radius-sm)"
              }} 
            />
          </div>
        ) : (
          <img 
            src={logoImg} 
            alt="AayStyle Logo" 
            style={{ 
              height: "32px", 
              width: "auto", 
              objectFit: "contain",
              borderRadius: "var(--radius-sm)"
            }} 
          />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            padding: "0.35rem",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-tertiary)",
            color: "var(--text-main)",
            display: "flex",
            alignItems: "center"
          }}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Business Switcher Strip */}
      {!collapsed && (
        <div
          onClick={() => setCurrentView("business")}
          style={{
            margin: "0.85rem 1rem 0.2rem",
            padding: "0.65rem 0.85rem",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            cursor: "pointer"
          }}
        >
          <div style={{ background: "rgba(87, 51, 37, 0.12)", padding: "0.35rem", borderRadius: "var(--radius-sm)", color: "var(--text-main)" }}>
            <Building2 size={16} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: "800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {businessProfile.name}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {businessProfile.industry}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.85rem 0.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {navGroups.map((group, idx) => (
          <div key={idx}>
            {!collapsed && (
              <div style={{ 
                fontSize: "0.68rem", 
                fontWeight: "800", 
                color: "var(--text-subtle)", 
                textTransform: "uppercase", 
                letterSpacing: "0.08em",
                padding: "0 0.6rem 0.4rem"
              }}>
                {group.title}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setCurrentView(item.key)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: collapsed ? "center" : "space-between",
                      padding: collapsed ? "0.65rem" : "0.55rem 0.75rem",
                      borderRadius: "var(--radius-sm)",
                      background: isActive ? "var(--gradient-glow)" : "transparent",
                      color: isActive ? "var(--text-main)" : "var(--text-muted)",
                      border: isActive ? "1px solid var(--border-highlight)" : "1px solid transparent",
                      fontWeight: isActive ? "800" : "600",
                      fontSize: "0.85rem",
                      transition: "all var(--transition-fast)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <Icon size={18} color={isActive ? "var(--text-main)" : "currentColor"} />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && item.badge > 0 && (
                      <span className="badge badge-primary" style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem" }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer / Public Web Link */}
      <div style={{ padding: "0.85rem", borderTop: "1px solid var(--border-color)" }}>
        <button
          onClick={() => setCurrentView("home")}
          className="btn-secondary"
          style={{ width: "100%", justifyContent: collapsed ? "center" : "center", fontSize: "0.8rem", padding: "0.55rem" }}
        >
          <Globe size={16} />
          {!collapsed && <span>Back to Public Site</span>}
        </button>
      </div>

    </aside>
  );
};
