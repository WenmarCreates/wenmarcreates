import React from "react";
import { AppProvider, useApp } from "./context/AppContext";

// Common Layouts & Overlay Components
import { Footer } from "./components/common/Footer";
import { Sidebar } from "./components/common/Sidebar";
import { Topbar } from "./components/common/Topbar";
import { ToastContainer } from "./components/common/ToastContainer";
import { SearchModal } from "./components/common/SearchModal";
import { DemoPreviewModal } from "./components/common/DemoPreviewModal";
import { EntryGateModal } from "./components/common/EntryGateModal";
import { CinematicScroll } from "./components/common/CinematicScroll";

// Public Website Views - Single Landing Page & Admin Login
import { HomeView } from "./components/public/HomeView";
import { LoginView } from "./components/public/LoginView";

// Logged-In App Dashboard Views
import { DashboardHome } from "./components/dashboard/DashboardHome";
import { BusinessProfileView } from "./components/dashboard/BusinessProfileView";
import { KnowledgeBaseView } from "./components/dashboard/KnowledgeBaseView";
import { ChatWidgetConfigView } from "./components/dashboard/ChatWidgetConfigView";
import { AIReceptionistView } from "./components/dashboard/AIReceptionistView";
import { AppointmentsView } from "./components/dashboard/AppointmentsView";
import { UnifiedInboxView } from "./components/dashboard/UnifiedInboxView";
import { SocialConnectionsView } from "./components/dashboard/SocialConnectionsView";
import { LeadMarketplaceView } from "./components/dashboard/LeadMarketplaceView";
import { MasterLeadListView } from "./components/dashboard/MasterLeadListView";
import { EmailCampaignsView } from "./components/dashboard/EmailCampaignsView";
import { ConversationHistoryView } from "./components/dashboard/ConversationHistoryView";
import { LeadProfileView } from "./components/dashboard/LeadProfileView";
import { AnalyticsView } from "./components/dashboard/AnalyticsView";
import { BillingView } from "./components/dashboard/BillingView";
import { AdminDashboardView } from "./components/dashboard/AdminDashboardView";

const MainContent = () => {
  const { currentView } = useApp();

  const publicViews = ["home", "login"];
  const isPublic = publicViews.includes(currentView);

  const renderViewContent = () => {
    switch (currentView) {
      // Single Landing Page & Admin Login
      case "home":
        return <HomeView />;
      case "login":
        return <LoginView />;

      // Admin Dashboard Views
      case "dashboard":
        return <DashboardHome />;
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
        return <HomeView />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <CinematicScroll />
      <ToastContainer />
      <SearchModal />
      <DemoPreviewModal />
      <EntryGateModal />

      {isPublic ? (
        <>
          <main style={{ flex: 1, padding: 0, maxWidth: "100%", margin: "0 auto", width: "100%" }}>
            {renderViewContent()}
          </main>
          {currentView !== "home" && <Footer />}
        </>
      ) : (
        <div className="app-layout">
          <Sidebar />
          <div className="main-content-wrapper">
            <Topbar />
            <main className="content-body animate-fade-in">
              {renderViewContent()}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
