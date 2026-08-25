import React from "react";
import { AppProvider, useApp } from "./context/AppContext";

// Common Layouts & Overlay Components
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { Sidebar } from "./components/common/Sidebar";
import { Topbar } from "./components/common/Topbar";
import { ToastContainer } from "./components/common/ToastContainer";
import { SearchModal } from "./components/common/SearchModal";
import { DemoPreviewModal } from "./components/common/DemoPreviewModal";

// Public Website Views
import { HomeView } from "./components/public/HomeView";
import { AboutView } from "./components/public/AboutView";
import { ServicesView } from "./components/public/ServicesView";
import { PricingView } from "./components/public/PricingView";
import { ContactView } from "./components/public/ContactView";
import { LoginView } from "./components/public/LoginView";
import { SignUpView } from "./components/public/SignUpView";

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

  const publicViews = ["home", "about", "services", "pricing", "contact", "login", "signup"];
  const isPublic = publicViews.includes(currentView);

  const renderViewContent = () => {
    switch (currentView) {
      // Public Views
      case "home":
        return <HomeView />;
      case "about":
        return <AboutView />;
      case "services":
        return <ServicesView />;
      case "pricing":
        return <PricingView />;
      case "contact":
        return <ContactView />;
      case "login":
        return <LoginView />;
      case "signup":
        return <SignUpView />;

      // Dashboard Views
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
      <ToastContainer />
      <SearchModal />
      <DemoPreviewModal />

      {isPublic ? (
        <>
          <Header />
          <main style={{ flex: 1, padding: "2rem 1rem", maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
            {renderViewContent()}
          </main>
          <Footer />
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
