import React, { createContext, useContext, useState } from "react";
import {
  INITIAL_BUSINESS_PROFILE,
  INITIAL_LEADS_MARKETPLACE,
  INITIAL_MASTER_LEADS,
  INITIAL_CAMPAIGNS,
  INITIAL_APPOINTMENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_ANALYTICS,
  INITIAL_ADMIN_DATA
} from "../mockData/mockData";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Authentication
  const [currentView, setCurrentView] = useState("home"); // public or dashboard view key
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Notifications / Toast state
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message = "", type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Contact Section Redirection (Popout cards removed)
  const scrollToContact = () => {
    const el = document.getElementById("cta-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "mailto:wenmarcreates@gmail.com";
    }
  };
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const openDemoModal = scrollToContact;
  const closeDemoModal = () => setIsDemoModalOpen(false);
  const openChatModal = scrollToContact;
  const closeChatModal = () => setIsDemoModalOpen(false);
  const isChatModalOpen = false;
  const openChatWidget = scrollToContact;
  const closeChatWidget = () => setIsDemoModalOpen(false);
  const isChatWidgetOpen = false;

  // Visitor Welcome & Loading Entry Gate State (Disabled)
  const [isEntryGateOpen, setIsEntryGateOpen] = useState(false);
  const [visitorProfile, setVisitorProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("wenmar_visitor_profile");
      return saved ? JSON.parse(saved) : { name: "", email: "" };
    } catch {
      return { name: "", email: "" };
    }
  });

  const passEntryGate = ({ name, email }) => {
    const profile = { name: name || "Visitor", email: email || "" };
    setVisitorProfile(profile);
    localStorage.setItem("wenmar_visitor_profile", JSON.stringify(profile));
    sessionStorage.setItem("wenmar_entry_passed", "true");
    setIsEntryGateOpen(false);
    if (name) {
      addToast(`Welcome to Wenmar Creates, ${name}!`, "Enjoy exploring our services & portfolio.");
    }
  };

  const closeEntryGate = () => {
    sessionStorage.setItem("wenmar_entry_passed", "true");
    setIsEntryGateOpen(false);
  };

  const openEntryGate = () => {
    setIsEntryGateOpen(true);
  };

  // Core App Data States
  const [businessProfile, setBusinessProfile] = useState(INITIAL_BUSINESS_PROFILE);
  const [leads, setLeads] = useState(INITIAL_LEADS_MARKETPLACE);
  const [masterLeads, setMasterLeads] = useState(INITIAL_MASTER_LEADS);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [analytics, setAnalytics] = useState(INITIAL_ANALYTICS);
  const [adminData, setAdminData] = useState(INITIAL_ADMIN_DATA);
  const [selectedLead, setSelectedLead] = useState(INITIAL_MASTER_LEADS[0]);

  // Scraped Campaign Emails State
  const [scrapedCampaignLeads, setScrapedCampaignLeads] = useState([
    {
      id: "email-scraped-101",
      businessName: "Miami Plumbers Pros",
      email: "contact@miami-plumber.com",
      source: "Google Business Profile",
      status: "Sent",
      sentAt: "10 mins ago",
      subject: "Automate customer inquiries for Miami Plumbers Pros"
    },
    {
      id: "email-scraped-102",
      businessName: "Apex Plumbing Experts",
      email: "info@apexplumbingexperts.com",
      source: "Instagram",
      status: "Sending",
      sentAt: "In progress...",
      subject: "Automate customer inquiries for Apex Plumbing Experts"
    },
    {
      id: "email-scraped-103",
      businessName: "Miami Elite Plumbers",
      email: "sales@miamieliteplumber.com",
      source: "Facebook",
      status: "Sent",
      sentAt: "1 hour ago",
      subject: "Automate customer inquiries for Miami Elite Plumbers"
    },
    {
      id: "email-scraped-104",
      businessName: "Vanguard Plumbing Group",
      email: "support@vanguardplumbing.com",
      source: "Google & Instagram",
      status: "Error",
      errorMsg: "MX Host Connection Timeout",
      sentAt: "Failed 25 mins ago",
      subject: "Automate customer inquiries for Vanguard Plumbing Group"
    },
    {
      id: "email-scraped-106",
      businessName: "Premier Plumbing & Co",
      email: "hello@premierplumbingco.com",
      source: "Google Business Profile",
      status: "Sent",
      sentAt: "2 hours ago",
      subject: "Automate customer inquiries for Premier Plumbing & Co"
    }
  ]);

  const addScrapedCampaignLeads = (newLeads) => {
    setScrapedCampaignLeads((prev) => [...newLeads, ...prev]);
  };

  // Scheduled Scraping & Email Automations State
  const [automations, setAutomations] = useState([
    {
      id: "auto-1",
      name: "Weekly Miami Plumbers Outreach",
      location: "Miami, FL",
      niche: "Plumbers",
      frequency: "Weekly",
      day: "Every Monday",
      time: "09:00 AM",
      template: "AI Service Pitch",
      subject: "Automate customer inquiries for {{business_name}}",
      status: "Active",
      lastRun: "2026-08-24 09:00",
      nextRun: "2026-08-31 09:00"
    },
    {
      id: "auto-2",
      name: "Austin Dentists Outreach",
      location: "Austin, TX",
      niche: "Dentists & Clinics",
      frequency: "Weekly",
      day: "Every Wednesday",
      time: "02:30 PM",
      template: "Lead Generation Audit",
      subject: "Free lead generation audit for {{business_name}}",
      status: "Active",
      lastRun: "2026-08-19 14:30",
      nextRun: "2026-08-26 14:30"
    }
  ]);

  const addAutomation = (newAuto) => {
    const autoObj = {
      id: `auto-${Date.now()}`,
      ...newAuto,
      status: "Active",
      lastRun: "Not run yet",
      nextRun: `${newAuto.day} at ${newAuto.time}`
    };
    setAutomations((prev) => [autoObj, ...prev]);
    addToast("Automation Created & Active", `Scheduled ${newAuto.name} for ${newAuto.day} at ${newAuto.time}.`);
  };

  const toggleAutomationStatus = (id) => {
    setAutomations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "Active" ? "Paused" : "Active";
          addToast(
            nextStatus === "Active" ? "Automation Activated" : "Automation Paused",
            `${item.name} is now ${nextStatus.toLowerCase()}.`,
            nextStatus === "Active" ? "success" : "info"
          );
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const deleteAutomation = (id, name) => {
    setAutomations((prev) => prev.filter((item) => item.id !== id));
    addToast("Automation Removed", `Removed ${name} from automations.`, "info");
  };

  const runAutomationNow = (id, name) => {
    addToast("Automation Triggered", `Scraping leads and sending emails for ${name}...`, "info");
    setTimeout(() => {
      setAutomations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, lastRun: "Just now" } : item
        )
      );
      addToast("Automation Completed", `Successfully scraped leads and dispatched emails for ${name}!`, "success");
    }, 1200);
  };

  // AI Knowledge Base State
  const [kbInput, setKbInput] = useState({
    companyName: INITIAL_BUSINESS_PROFILE.name,
    about: INITIAL_BUSINESS_PROFILE.description,
    services: INITIAL_BUSINESS_PROFILE.services.join(", "),
    faqs: "Q: What are your hours? A: Mon-Fri 8am-6pm CST.\nQ: Do you offer refunds? A: Yes, 30-day guarantee.",
    offers: INITIAL_BUSINESS_PROFILE.offers.join(", "),
    hours: INITIAL_BUSINESS_PROFILE.businessHours,
    contact: `${INITIAL_BUSINESS_PROFILE.phone} | ${INITIAL_BUSINESS_PROFILE.email}`,
    policies: INITIAL_BUSINESS_PROFILE.policies
  });

  const [generatedKb, setGeneratedKb] = useState({
    isGenerated: true,
    lastGenerated: "2026-08-18 05:30",
    sections: {
      companyOverview: "Apex Digital Solutions is an industry leader in enterprise AI business automation...",
      services: INITIAL_BUSINESS_PROFILE.services,
      faqs: [
        { q: "What are your business hours?", a: "Monday - Friday: 8:00 AM - 6:00 PM CST, Saturday: 9:00 AM - 2:00 PM CST." },
        { q: "Do you offer refunds or SLAs?", a: "Yes, we guarantee a 30-day money-back SLA on all plans." }
      ],
      offers: INITIAL_BUSINESS_PROFILE.offers,
      policies: INITIAL_BUSINESS_PROFILE.policies,
      hours: INITIAL_BUSINESS_PROFILE.businessHours,
      contactInformation: `${INITIAL_BUSINESS_PROFILE.phone} | ${INITIAL_BUSINESS_PROFILE.email} | ${INITIAL_BUSINESS_PROFILE.address}`,
      appointmentInformation: "Book directly via chat widget or Live Web Call AI Receptionist. Automated Google & Outlook sync.",
      generalInstructions: "Always maintain a professional, helpful tone. Escalate unresolved pricing inquiries to human agents."
    }
  });

  // Chat Widget Configuration State
  const [chatWidgetConfig, setChatWidgetConfig] = useState({
    widgetName: "Apex AI Assistant",
    welcomeMessage: "Hi there! 👋 How can Apex Digital assist your business today?",
    primaryColor: "#D3A373",
    buttonColor: "#573325",
    position: "bottom-right",
    avatar: "🤖",
    aiPersonality: "Friendly & Professional Executive",
    responseBehavior: "Instant Smart Answers + Lead Capture Form"
  });

  // AI Receptionist Configuration State
  const [receptionistConfig, setReceptionistConfig] = useState({
    receptionistName: "Chloe - AI Receptionist",
    greeting: "Thank you for calling Apex Digital Solutions! I can schedule consultations, answer questions, or transfer your call. How can I help you today?",
    voice: "elevenlabs-chloe",
    elevenLabsApiKey: "sk_c1b7a5ddb4ebba85c833ed50104e98b8a7172db0e7de9435",
    businessHours: "Mon-Fri 8AM-6PM",
    services: "Consultations, AI Audit, Support, Billing",
    appointmentRules: "30 min minimum notice, max 4 appointments per slot",
    escalationRules: "Transfer urgent billing calls to +1 (800) 555-0199 option 2",
    
    // AI Personality & Training
    personality: "Warm, Empathetic & Executive Professional",
    goals: "Qualify incoming business leads, schedule consultations on the calendar, answer service FAQs, and route urgent support to human agents.",
    additionalInfo: "Apex Digital Solutions offers custom web apps, AI receptionists, and funnel optimization with a 30-day money-back guarantee.",
    useKnowledgeBase: true,

    // Call Settings
    timezone: "America/Chicago (CST)",
    maxCallTime: "10", // minutes
    idleTime: "30",    // seconds
    reminderFrequency: "Every 30s",
    endCallSilenceDuration: "45", // seconds silence auto-hangup
    waitBeforeSpeaking: "1.0",     // seconds pause delay

    // Agent Behavior Tuning
    responseSpeed: "1.0", // seconds delay
    interruptionSensitivity: "Medium",
    llmTemperature: 0.7,

    // Voice & Audio FX Settings
    noiseCancellationMode: "remove_noise",
    backgroundSound: "none",
    ambientVolume: 30,
    voiceSpeed: 1.0,
    voiceStability: 0.5
  });

  // Social Connections State
  const [socialPlatforms, setSocialPlatforms] = useState([
    { id: "facebook", name: "Facebook Page", status: "Connected", account: "@ApexDigitalOfficial", icon: "Facebook" },
    { id: "instagram", name: "Instagram Business", status: "Connected", account: "@ApexDigitalAI", icon: "Instagram" },
    { id: "whatsapp", name: "WhatsApp Business", status: "Disconnected", account: "Not Linked", icon: "MessageCircle" },
    { id: "google", name: "Google Business Profile", status: "Connected", account: "Apex Digital Austin", icon: "Globe" },
    { id: "twitter", name: "X / Twitter", status: "Disconnected", account: "Not Linked", icon: "Twitter" },
    { id: "linkedin", name: "LinkedIn Page", status: "Connected", account: "Apex Digital Solutions", icon: "Linkedin" }
  ]);

  // Billing State
  const [billing, setBilling] = useState({
    currentPlan: "Standard",
    billingCycle: "Monthly",
    amount: "$149/mo",
    nextBillingDate: "2026-09-18",
    usage: {
      leadsToday: 34,
      leadsLimit: 50,
      aiCallsThisMonth: 142,
      aiCallsLimit: 500,
      emailCampaignsSent: 350,
      emailLimit: 2500
    }
  });

  // Action Handlers
  const updateBusinessProfile = (updated) => {
    setBusinessProfile(updated);
    addToast("Profile Updated", "Your business settings have been saved successfully.");
  };

  const toggleAddMasterLead = (leadId) => {
    setLeads((prev) =>
      prev.map((item) => {
        if (item.id === leadId) {
          const updatedStatus = !item.addedToMaster;
          if (updatedStatus) {
            const exists = masterLeads.some((m) => m.id === `mlead-${item.id}`);
            if (!exists) {
              setMasterLeads((mPrev) => [
                {
                  id: `mlead-${item.id}`,
                  name: item.name,
                  contactPerson: "Executive Contact",
                  industry: item.industry,
                  location: `${item.city}, ${item.state}`,
                  email: item.email,
                  phone: item.phone,
                  status: "New",
                  campaign: "Marketplace Import",
                  lastContact: "2026-08-18",
                  notes: `Imported lead from ${item.industry} marketplace.`,
                  tags: ["Marketplace", item.industry],
                  score: item.score
                },
                ...mPrev
              ]);
            }
            addToast("Lead Added", `${item.name} has been added to your Master Lead List.`);
          } else {
            addToast("Lead Removed", `${item.name} removed from Master Lead List.`, "info");
          }
          return { ...item, addedToMaster: updatedStatus };
        }
        return item;
      })
    );
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    addToast("Appointment Updated", `Appointment status changed to ${newStatus}.`);
  };

  const addAppointment = (newApt) => {
    const aptObj = {
      id: `apt-${Date.now()}`,
      ...newApt,
      status: "Upcoming"
    };
    setAppointments((prev) => [aptObj, ...prev]);
    addToast("Appointment Scheduled", `Booked appointment for ${newApt.customer}.`);
  };

  const addConversationMessage = (convId, text, sender = "ai") => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === convId) {
          const newMsg = {
            sender,
            text,
            time: "Just now"
          };
          return {
            ...conv,
            lastMsg: text,
            timestamp: "Just now",
            history: [...conv.history, newMsg]
          };
        }
        return conv;
      })
    );
  };

  const generateKnowledgeBase = () => {
    addToast("AI Knowledge Base", "Generating AI vector embeddings...", "info");
    setTimeout(() => {
      setGeneratedKb((prev) => ({
        ...prev,
        isGenerated: true,
        lastGenerated: new Date().toLocaleString()
      }));
      addToast("Knowledge Base Ready", "AI knowledge base generated and indexed for Chat & Live Web Call AI Receptionist!");
    }, 1200);
  };

  const toggleSocialConnection = (platformId) => {
    setSocialPlatforms((prev) =>
      prev.map((p) => {
        if (p.id === platformId) {
          const nextStatus = p.status === "Connected" ? "Disconnected" : "Connected";
          addToast(
            nextStatus === "Connected" ? "Platform Connected" : "Platform Disconnected",
            `${p.name} is now ${nextStatus.toLowerCase()}.`,
            nextStatus === "Connected" ? "success" : "info"
          );
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const updateBillingPlan = (planName, price) => {
    setBilling((prev) => ({
      ...prev,
      currentPlan: planName,
      amount: price
    }));
    addToast("Plan Upgraded", `Your account is now subscribed to the ${planName} Plan!`);
  };

  const navigateToView = (viewKey) => {
    setCurrentView(viewKey);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openLeadProfile = (lead) => {
    setSelectedLead(lead);
    navigateToView("lead-profile");
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView: navigateToView,
        isAuthenticated,
        setIsAuthenticated,
        toasts,
        addToast,
        removeToast,
        isSearchOpen,
        setIsSearchOpen,
        isDemoModalOpen,
        setIsDemoModalOpen,
        openDemoModal,
        closeDemoModal,
        isChatModalOpen,
        openChatModal,
        closeChatModal,
        isChatWidgetOpen,
        openChatWidget,
        closeChatWidget,
        businessProfile,
        updateBusinessProfile,
        leads,
        toggleAddMasterLead,
        masterLeads,
        setMasterLeads,
        scrapedCampaignLeads,
        addScrapedCampaignLeads,
        automations,
        addAutomation,
        toggleAutomationStatus,
        deleteAutomation,
        runAutomationNow,
        campaigns,
        setCampaigns,
        appointments,
        updateAppointmentStatus,
        addAppointment,
        conversations,
        addConversationMessage,
        analytics,
        adminData,
        kbInput,
        setKbInput,
        generatedKb,
        generateKnowledgeBase,
        chatWidgetConfig,
        setChatWidgetConfig,
        receptionistConfig,
        setReceptionistConfig,
        socialPlatforms,
        toggleSocialConnection,
        billing,
        updateBillingPlan,
        selectedLead,
        openLeadProfile,
        isEntryGateOpen,
        setIsEntryGateOpen,
        visitorProfile,
        passEntryGate,
        closeEntryGate,
        openEntryGate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
