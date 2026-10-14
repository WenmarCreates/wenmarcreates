import React, { Suspense, lazy } from "react";
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

// Public Website Views - Eagerly loaded for instant first paint
import { HomeView } from "./components/public/HomeView";
import { LoginView } from "./components/public/LoginView";

// Code-Split Dashboard Views - Lazy-loaded on demand to optimize initial bundle size & TTI
const DashboardHome = lazy(() => import("./components/dashboard/DashboardHome").then(m => ({ default: m.DashboardHome })));
const BusinessProfileView = lazy(() => import("./components/dashboard/BusinessProfileView").then(m => ({ default: m.BusinessProfileView })));
const KnowledgeBaseView = lazy(() => import("./components/dashboard/KnowledgeBaseView").then(m => ({ default: m.KnowledgeBaseView })));
const ChatWidgetConfigView = lazy(() => import("./components/dashboard/ChatWidgetConfigView").then(m => ({ default: m.ChatWidgetConfigView })));
const AIReceptionistView = lazy(() => import("./components/dashboard/AIReceptionistView").then(m => ({ default: m.AIReceptionistView })));
const AppointmentsView = lazy(() => import("./components/dashboard/AppointmentsView").then(m => ({ default: m.AppointmentsView })));
const UnifiedInboxView = lazy(() => import("./components/dashboard/UnifiedInboxView").then(m => ({ default: m.UnifiedInboxView })));
const SocialConnectionsView = lazy(() => import("./components/dashboard/SocialConnectionsView").then(m => ({ default: m.SocialConnectionsView })));
const LeadMarketplaceView = lazy(() => import("./components/dashboard/LeadMarketplaceView").then(m => ({ default: m.LeadMarketplaceView })));
const MasterLeadListView = lazy(() => import("./components/dashboard/MasterLeadListView").then(m => ({ default: m.MasterLeadListView })));
const EmailCampaignsView = lazy(() => import("./components/dashboard/EmailCampaignsView").then(m => ({ default: m.EmailCampaignsView })));
const ConversationHistoryView = lazy(() => import("./components/dashboard/ConversationHistoryView").then(m => ({ default: m.ConversationHistoryView })));
const LeadProfileView = lazy(() => import("./components/dashboard/LeadProfileView").then(m => ({ default: m.LeadProfileView })));
const AnalyticsView = lazy(() => import("./components/dashboard/AnalyticsView").then(m => ({ default: m.AnalyticsView })));
const BillingView = lazy(() => import("./components/dashboard/BillingView").then(m => ({ default: m.BillingView })));
const AdminDashboardView = lazy(() => import("./components/dashboard/AdminDashboardView").then(m => ({ default: m.AdminDashboardView })));

// Sleek minimal loader during dashboard transitions
const DashboardViewLoader = () => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "420px",
    width: "100%",
    flexDirection: "column",
    gap: "1rem"
  }}>
    <div style={{
      width: "32px",
      height: "32px",
      border: "2px solid rgba(211, 163, 115, 0.2)",
      borderTopColor: "#920000",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite"
    }} />
    <span style={{
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "0.78rem",
      color: "#D3A373",
      letterSpacing: "0.12em",
      textTransform: "uppercase"
    }}>Loading Module...</span>
  </div>
);

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
              <Suspense fallback={<DashboardViewLoader />}>
                {renderViewContent()}
              </Suspense>
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
