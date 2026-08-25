import React from "react";
import { useApp } from "../../context/AppContext";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

// Dashboard Views
import { DashboardHome } from "../dashboard/DashboardHome";
import { BusinessProfileView } from "../dashboard/BusinessProfileView";
import { KnowledgeBaseView } from "../dashboard/KnowledgeBaseView";
import { ChatWidgetConfigView } from "../dashboard/ChatWidgetConfigView";
import { AIReceptionistView } from "../dashboard/AIReceptionistView";
import { AppointmentsView } from "../dashboard/AppointmentsView";
import { UnifiedInboxView } from "../dashboard/UnifiedInboxView";
import { SocialConnectionsView } from "../dashboard/SocialConnectionsView";
import { LeadMarketplaceView } from "../dashboard/LeadMarketplaceView";
import { MasterLeadListView } from "../dashboard/MasterLeadListView";
import { EmailCampaignsView } from "../dashboard/EmailCampaignsView";
import { ConversationHistoryView } from "../dashboard/ConversationHistoryView";
import { LeadProfileView } from "../dashboard/LeadProfileView";
import { AnalyticsView } from "../dashboard/AnalyticsView";
import { BillingView } from "../dashboard/BillingView";
import { AdminDashboardView } from "../dashboard/AdminDashboardView";

export const DemoPreviewModal = () => {
  const { isDemoModalOpen, closeDemoModal, currentView, setCurrentView, addToast } = useApp();

  if (!isDemoModalOpen) return null;

  const handleLaunchFullWorkspace = () => {
    closeDemoModal();
    if (["home", "about", "services", "pricing", "contact", "login", "signup"].includes(currentView)) {
      setCurrentView("dashboard");
    }
    addToast("Full Workspace Launched", "Switched to full-screen commercial dashboard.");
  };

  const renderDashboardContent = () => {
    switch (currentView) {
      case "business":
        return <BusinessProfileView />;
      case "knowledge-base":
        return <KnowledgeBaseView />;
      case "chat-widget":
        return <ChatWidgetConfigView />;
      case "ai-receptionist":
        return <AIReceptionistView />;
      case "appointments":
        return <AppointmentsView />;
      case "messages":
        return <UnifiedInboxView />;
      case "social":
        return <SocialConnectionsView />;
      case "leads":
        return <LeadMarketplaceView />;
      case "master-leads":
        return <MasterLeadListView />;
      case "campaigns":
        return <EmailCampaignsView />;
      case "conversations":
        return <ConversationHistoryView />;
      case "lead-profile":
        return <LeadProfileView />;
      case "analytics":
        return <AnalyticsView />;
      case "billing":
        return <BillingView />;
      case "admin":
        return <AdminDashboardView />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div 
      style={{ 
        position: "fixed", 
        inset: 0, 
        zIndex: 2500, 
        background: "rgba(18, 12, 9, 0.82)", 
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "1.25rem",
        animation: "fadeIn 0.3s ease-out"
      }}
    >
      {/* Popout Container holding the exact actual dashboard */}
      <div 
        className="glass-card animate-fade-in" 
        style={{ 
          width: "100%", 
          maxWidth: "1440px", 
          height: "92vh",
          display: "flex", 
          flexDirection: "column",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(211, 163, 115, 0.4)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6)",
          background: "var(--bg-primary)"
        }}
      >
        {/* MODAL HEADER BAR */}
        <div 
          style={{ 
            padding: "0.85rem 1.75rem", 
            borderBottom: "1px solid var(--border-color)", 
            background: "#573325",
            color: "#FEFADF",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between" 
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(211, 163, 115, 0.25)", border: "1px solid rgba(211, 163, 115, 0.5)", padding: "0.3rem 0.8rem", borderRadius: "var(--radius-full)", fontSize: "0.78rem", fontWeight: "800", color: "#FEFADF" }}>
              <Sparkles size={14} color="#D3A373" />
              LIVE SAMPLE DASHBOARD DEMO
            </div>
            <span style={{ fontSize: "0.85rem", opacity: 0.9, fontWeight: "600" }}>
              Interactive Sandbox Mode • Explore all sidebar features & tools in real-time
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button 
              onClick={handleLaunchFullWorkspace}
              className="btn-denim"
              style={{ fontSize: "0.825rem", padding: "0.45rem 1.1rem" }}
            >
              Launch Full Workspace
              <ArrowRight size={16} />
            </button>
            <button
              onClick={closeDemoModal}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
              title="Close Demo"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* MODAL BODY HOLDING EXACT ACTUAL DASHBOARD LAYOUT */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          <div className="app-layout" style={{ flex: 1, height: "100%", overflow: "hidden" }}>
            <Sidebar />
            <div className="main-content-wrapper" style={{ flex: 1, overflow: "auto" }}>
              <Topbar />
              <main className="content-body animate-fade-in" style={{ padding: "1.5rem" }}>
                {renderDashboardContent()}
              </main>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
