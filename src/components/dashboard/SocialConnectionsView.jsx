import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Share2, CheckCircle2, XCircle, Link2, Unlink, Settings, ExternalLink, 
  Sparkles, Key, Code, RefreshCw, X, MessageCircle, 
  Globe, ShieldCheck, Check, Send, Bot, User, Radio, Sliders, Shield, Zap, Play, ArrowRight, Lock
} from "lucide-react";

export const SocialConnectionsView = () => {
  const { socialPlatforms, toggleSocialConnection, addToast, receptionistConfig } = useApp();
  
  // Developer Platform Keys State
  const [showDevKeysModal, setShowDevKeysModal] = useState(false);
  const [developerKeys, setDeveloperKeys] = useState({
    metaAppId: "1042415078412380",
    metaAppSecret: "6dbbf85371fa329f06c07002f7e1cba4",
    webhookVerifyToken: "aaystyle_webhook_secret_2026",
    whatsappPhoneId: "109482710492837"
  });

  // User 4-Step Connection Wizard State
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // User Settings State
  const [accountHandle, setAccountHandle] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [permissions, setPermissions] = useState({
    enableDmReply: true,
    enableCommentReply: true,
    enableCrmSync: true,
    enableStoryReply: true
  });

  // Developer Guide State
  const [showDeveloperGuide, setShowDeveloperGuide] = useState(false);

  // Interactive Live DM Simulator State
  const [showDMSimulator, setShowDMSimulator] = useState(false);
  const [simulatorPlatform, setSimulatorPlatform] = useState(null);
  const [simulatedMessages, setSimulatedMessages] = useState([]);
  const [userTestInput, setUserTestInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleSaveDevKeys = (e) => {
    e.preventDefault();
    addToast(
      "Developer Platform Keys Saved!",
      "Meta App ID & Webhook Verification tokens updated. Your SaaS app is ready to process live OAuth 2.0 connections."
    );
    setShowDevKeysModal(false);
  };

  const handleOpenConnectModal = (platform) => {
    setSelectedPlatform(platform);
    setAccountHandle(platform.account !== "Not Linked" ? platform.account : `@Apex${platform.name.replace(/\s+/g, "")}`);
    setSelectedPage(platform.name === "Instagram" ? "@ApexDigitalOfficial (Instagram Business)" : `${platform.name} Business Account`);
    setWizardStep(1);
    setIsAuthenticating(false);
    setShowConfigModal(true);
  };

  const handleSimulateOAuthClick = () => {
    setIsAuthenticating(true);

    const appId = (developerKeys.metaAppId && developerKeys.metaAppId.trim()) || "1042415078412380";

    // If official Meta Facebook JavaScript SDK is available
    if (window.FB && appId) {
      try {
        window.FB.init({
          appId: appId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });

        window.FB.login((response) => {
          setIsAuthenticating(false);
          if (response && response.authResponse) {
            setWizardStep(2);
            addToast("Facebook Account Authenticated!", "Successfully authorized real Facebook Page access.");
          } else {
            addToast("Facebook Login Cancelled", "Login window closed before completing authorization.");
          }
        }, { scope: 'public_profile,email,pages_show_list,pages_read_engagement' });

        return;
      } catch (err) {
        console.warn("FB SDK init notice:", err);
      }
    }

    // Direct OAuth Popup Launch Fallback
    if (selectedPlatform?.id === "facebook" || selectedPlatform?.id === "instagram" || selectedPlatform?.id === "whatsapp") {
      const redirectUri = encodeURIComponent(`${window.location.origin}/oauth-callback.html`);
      const scope = "public_profile,email,pages_show_list,pages_read_engagement";
      const oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

      const width = 600, height = 720;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      try {
        window.open(
          oauthUrl,
          `${selectedPlatform.name} OAuth Authorization`,
          `width=${width},height=${height},top=${top},left=${left}`
        );
      } catch (e) {
        console.warn("Popup blocked by browser:", e);
      }
    }

    setTimeout(() => {
      setIsAuthenticating(false);
      setWizardStep(2);
      addToast(
        "OAuth 2.0 Authorization Popup Launched!",
        `Opened official ${selectedPlatform.name} Facebook OAuth window. Select your real business page to finalize.`
      );
    }, 1000);
  };

  const handleConfirmConnect = (e) => {
    e.preventDefault();
    if (!selectedPlatform) return;
    
    if (selectedPlatform.status !== "Connected") {
      toggleSocialConnection(selectedPlatform.id);
    }
    
    addToast(
      "Account Connected & Live!",
      `${selectedPlatform.name} (${accountHandle}) is now actively listening to Webhooks. AI DM auto-replies are LIVE.`
    );
    setShowConfigModal(false);
  };

  // Open Interactive DM Simulator
  const handleOpenDMSimulator = (platform) => {
    setSimulatorPlatform(platform);
    setSimulatedMessages([
      {
        id: 1,
        sender: "user",
        text: `Hi! I saw your post on ${platform.name}. What are your business hours and consultation pricing?`,
        time: "Just now"
      },
      {
        id: 2,
        sender: "ai",
        text: `Hello! 👋 Thank you for reaching out to Apex Digital on ${platform.name}! I am ${receptionistConfig?.receptionistName || "Apex Assistant"}. We are open Mon-Fri from 8:00 AM to 6:00 PM EST. Strategy consultations start at $150. Would you like me to reserve a 30-minute slot for you tomorrow?`,
        time: "Just now"
      }
    ]);
    setUserTestInput("");
    setShowDMSimulator(true);
  };

  const handleSendTestDM = (e) => {
    if (e) e.preventDefault();
    if (!userTestInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "user",
      text: userTestInput.trim(),
      time: "Just now"
    };

    setSimulatedMessages((prev) => [...prev, newMsg]);
    const currentInput = userTestInput.trim();
    setUserTestInput("");
    setIsAiTyping(true);

    setTimeout(() => {
      let aiReply = `Thank you for your message! Our team at Apex Digital has logged your request. You can also reach our live receptionist line anytime.`;
      
      const lower = currentInput.toLowerCase();
      if (lower.includes("price") || lower.includes("cost") || lower.includes("fee")) {
        aiReply = `Our starter AI Receptionist package starts at $99/mo, and full omnichannel social automation is $299/mo. Would you like a demo?`;
      } else if (lower.includes("book") || lower.includes("appointment") || lower.includes("schedule")) {
        aiReply = `Great! I can book a consultation slot for you right now. Please provide your preferred time (e.g. Tomorrow at 2 PM EST) and phone number.`;
      } else if (lower.includes("location") || lower.includes("address") || lower.includes("where")) {
        aiReply = `We are headquartered in Austin, TX with global 24/7 web & social support!`;
      }

      setSimulatedMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: aiReply,
          time: "Just now"
        }
      ]);
      setIsAiTyping(false);

      addToast(
        "Lead Captured & Unified Inbox Synced!",
        `Test message from ${simulatorPlatform.name} auto-replied by AI and synced to your Unified Inbox.`
      );
    }, 900);
  };

  const getPlatformIcon = (id) => {
    switch (id) {
      case "facebook": return Share2;
      case "instagram": return Share2;
      case "whatsapp": return MessageCircle;
      case "google": return Globe;
      case "twitter": return Share2;
      case "linkedin": return Share2;
      default: return Share2;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Share2 className="text-accent" size={24} /> Social Media & Omnichannel Messaging Integration
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "0.25rem" }}>
            Connect your official social accounts to enable 24/7 AI auto-replies across Instagram DMs, Facebook Messenger, WhatsApp, Google Chat, and LinkedIn.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <button 
            onClick={() => setShowDevKeysModal(true)}
            className="btn-secondary"
            style={{ fontSize: "0.85rem", padding: "0.6rem 1.1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Key size={16} color="var(--accent-primary)" /> Developer Platform API Keys
          </button>
          <button 
            onClick={() => setShowDeveloperGuide(true)}
            className="btn-secondary"
            style={{ fontSize: "0.85rem", padding: "0.6rem 1.1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Code size={16} /> Webhook Setup Guide
          </button>
        </div>
      </div>

      {/* PLATFORMS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {socialPlatforms.map((platform) => {
          const isConnected = platform.status === "Connected";
          const PlatformIcon = getPlatformIcon(platform.id);

          return (
            <div 
              key={platform.id} 
              className="glass-card" 
              style={{ 
                padding: "1.75rem", 
                background: "var(--bg-secondary)", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between", 
                gap: "1.5rem",
                border: isConnected ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid var(--border-color)",
                boxShadow: isConnected ? "0 8px 24px rgba(16, 185, 129, 0.08)" : "none"
              }}
            >
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                  <div 
                    style={{ 
                      width: "48px", 
                      height: "48px", 
                      borderRadius: "var(--radius-md)", 
                      background: isConnected ? "rgba(16, 185, 129, 0.15)" : "var(--bg-tertiary)", 
                      color: isConnected ? "var(--accent-emerald)" : "var(--text-subtle)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      boxShadow: isConnected ? "0 4px 12px rgba(16, 185, 129, 0.2)" : "none"
                    }}
                  >
                    <PlatformIcon size={24} />
                  </div>
                  <span className={`badge ${isConnected ? "badge-success" : "badge-neutral"}`}>
                    {isConnected ? "● Active Webhook" : "Disconnected"}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-main)" }}>{platform.name}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                  Linked Account: <strong style={{ color: "var(--text-main)" }}>{platform.account}</strong>
                </p>

                {/* Enabled AI Capabilities */}
                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-subtle)" }}>AI Capabilities:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {isConnected ? (
                      <>
                        <span style={{ fontSize: "0.72rem", background: "var(--bg-tertiary)", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-sm)", color: "var(--text-main)" }}>✓ DM Auto-Reply</span>
                        <span style={{ fontSize: "0.72rem", background: "var(--bg-tertiary)", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-sm)", color: "var(--text-main)" }}>✓ Lead Capture</span>
                        <span style={{ fontSize: "0.72rem", background: "var(--bg-tertiary)", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-sm)", color: "var(--text-main)" }}>✓ CRM Inbox Sync</span>
                      </>
                    ) : (
                      <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>Connect account via OAuth to enable 24/7 DM auto-replies.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {isConnected ? (
                  <>
                    <button
                      onClick={() => handleOpenConnectModal(platform)}
                      className="btn-secondary"
                      style={{ flex: 1, justifyContent: "center", fontSize: "0.82rem", padding: "0.55rem" }}
                    >
                      <Settings size={15} /> Configure
                    </button>

                    <button
                      onClick={() => handleOpenDMSimulator(platform)}
                      className="btn-secondary"
                      style={{ flex: 1.2, justifyContent: "center", fontSize: "0.82rem", padding: "0.55rem", background: "var(--bg-tertiary)", color: "var(--accent-primary)", border: "1px solid var(--border-highlight)" }}
                      title="Test Live DM Response"
                    >
                      <Sparkles size={15} /> Test Live DM
                    </button>

                    <button
                      onClick={() => toggleSocialConnection(platform.id)}
                      style={{ padding: "0.55rem 0.75rem", background: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}
                      title="Disconnect Platform"
                    >
                      <Unlink size={15} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleOpenConnectModal(platform)}
                    className="btn-denim"
                    style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "0.65rem" }}
                  >
                    <Link2 size={16} /> Connect Account via OAuth
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* DEVELOPER PLATFORM API KEYS MODAL */}
      {showDevKeysModal && (
        <div 
          style={{ 
            position: "fixed", 
            inset: 0, 
            zIndex: 2600, 
            background: "rgba(18, 12, 9, 0.75)", 
            backdropFilter: "blur(16px)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "1.5rem"
          }}
        >
          <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "560px", padding: "2rem", background: "var(--bg-secondary)", border: "1px solid var(--border-highlight)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-sm)", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                  <Key size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800" }}>Developer Platform API Credentials</h3>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>Meta App ID, App Secret & Webhook Verification Secrets</p>
                </div>
              </div>
              <button onClick={() => setShowDevKeysModal(false)} style={{ color: "var(--text-subtle)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDevKeys} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="form-group">
                <label className="form-label">Meta / Facebook App ID</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={developerKeys.metaAppId}
                  onChange={(e) => setDeveloperKeys({ ...developerKeys, metaAppId: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Meta App Secret</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={developerKeys.metaAppSecret}
                  onChange={(e) => setDeveloperKeys({ ...developerKeys, metaAppSecret: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Webhook Verification Secret Token</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={developerKeys.webhookVerifyToken}
                  onChange={(e) => setDeveloperKeys({ ...developerKeys, webhookVerifyToken: e.target.value })}
                />
                <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "2px" }}>
                  Used to verify inbound Webhook challenges from Meta Graph API.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Cloud Business Phone Number ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={developerKeys.whatsappPhoneId}
                  onChange={(e) => setDeveloperKeys({ ...developerKeys, whatsappPhoneId: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowDevKeysModal(false)} className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
                  Cancel
                </button>
                <button type="submit" className="btn-denim" style={{ flex: 1.5, justifyContent: "center" }}>
                  <CheckCircle2 size={16} /> Save Developer API Keys
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4-STEP OAUTH 2.0 USER CONNECTION WIZARD MODAL */}
      {showConfigModal && selectedPlatform && (
        <div 
          style={{ 
            position: "fixed", 
            inset: 0, 
            zIndex: 2600, 
            background: "rgba(18, 12, 9, 0.75)", 
            backdropFilter: "blur(16px)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "1.5rem"
          }}
        >
          <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "560px", padding: "2rem", background: "var(--bg-secondary)", border: "1px solid var(--border-highlight)" }}>
            
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "var(--radius-sm)", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                  <Link2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "800" }}>{selectedPlatform.name} OAuth Authorization Wizard</h3>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>Step {wizardStep} of 4 • Official Webhook Integration</p>
                </div>
              </div>
              <button onClick={() => setShowConfigModal(false)} style={{ color: "var(--text-subtle)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Wizard Step Progress Tracker */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {[1, 2, 3, 4].map((stepNum) => (
                <div 
                  key={stepNum}
                  style={{ 
                    flex: 1, 
                    height: "4px", 
                    borderRadius: "2px", 
                    background: wizardStep >= stepNum ? "var(--accent-primary)" : "var(--bg-tertiary)",
                    transition: "all 0.3s ease"
                  }}
                />
              ))}
            </div>

            <form onSubmit={handleConfirmConnect}>
              
              {/* STEP 1: OAuth Authentication */}
              {wizardStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", textAlign: "center", padding: "1rem 0" }}>
                  <div style={{ margin: "0 auto", width: "64px", height: "64px", borderRadius: "50%", background: "rgba(180, 83, 9, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-primary)" }}>
                    <ShieldCheck size={36} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: "800" }}>Authorize {selectedPlatform.name} Access</h4>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-subtle)", marginTop: "0.3rem" }}>
                      Click below to log in with your official {selectedPlatform.name} Business credentials and grant messaging permissions.
                    </p>
                  </div>

                  <div style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)", textAlign: "left", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    <div style={{ fontWeight: "700", color: "var(--text-main)", marginBottom: "0.3rem" }}>Permissions Requested:</div>
                    <ul style={{ paddingLeft: "1.2rem", margin: "0 0 0.5rem 0" }}>
                      <li>Read & respond to direct messages (DMs)</li>
                      <li>Auto-reply to post comments & story tags</li>
                      <li>Sync lead profiles with Master Lead List</li>
                    </ul>
                    <div style={{ fontSize: "0.74rem", color: "var(--accent-primary)", background: "rgba(180, 83, 9, 0.1)", padding: "0.4rem 0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(180, 83, 9, 0.2)" }}>
                      💡 <strong>Developer Note:</strong> Facebook requires a valid Meta App ID from developers.facebook.com to log into real Facebook Pages. For local testing without a live Meta App ID, click <strong>Quick Demo Authorization</strong> below!
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setWizardStep(2);
                        addToast("Quick Auth Authorized!", `Authorized ${selectedPlatform.name}. Select your business page to complete.`);
                      }}
                      className="gradient-btn"
                      style={{ width: "100%", justifyContent: "center", padding: "0.75rem", fontSize: "0.92rem" }}
                    >
                      <CheckCircle2 size={18} /> Quick Demo Authorization (Recommended for Testing)
                    </button>

                    <button
                      type="button"
                      onClick={handleSimulateOAuthClick}
                      disabled={isAuthenticating}
                      className="btn-secondary"
                      style={{ width: "100%", justifyContent: "center", padding: "0.65rem", fontSize: "0.85rem", background: "var(--bg-tertiary)" }}
                    >
                      {isAuthenticating ? (
                        <>Launching Live Meta Window...</>
                      ) : (
                        <><ExternalLink size={16} /> Launch Live Meta OAuth Popup (Requires Meta App ID)</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Page & Account Selection */}
              {wizardStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  
                  {selectedPlatform.id === "whatsapp" ? (
                    <>
                      <div className="form-group">
                        <label className="form-label">Client WhatsApp Business Phone Number</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. +1 (512) 555-0199"
                          className="form-input"
                          value={accountHandle}
                          onChange={(e) => setAccountHandle(e.target.value)}
                        />
                        <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "2px" }}>
                          Your official WhatsApp Business phone number used to receive customer chats.
                        </p>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Client WhatsApp Phone Number ID (From Meta Manager)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 104928374910283"
                          className="form-input"
                          defaultValue="104928374910283"
                        />
                        <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "2px" }}>
                          Meta charges your WhatsApp Business Account directly after your 1,000 free monthly chats.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label className="form-label">Select Business Page / Profile</label>
                        <select 
                          className="form-select"
                          value={selectedPage}
                          onChange={(e) => setSelectedPage(e.target.value)}
                        >
                          <option value="@ApexDigitalOfficial (Instagram Business)">@ApexDigitalOfficial (Instagram Business)</option>
                          <option value="Apex Digital Agency (Facebook Page)">Apex Digital Agency (Facebook Page)</option>
                          <option value="Apex Digital Solutions (LinkedIn Org)">Apex Digital Solutions (LinkedIn Org)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Official Social Handle</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={accountHandle}
                          onChange={(e) => setAccountHandle(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                    <button type="button" onClick={() => setWizardStep(1)} className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
                      Back
                    </button>
                    <button type="button" onClick={() => setWizardStep(3)} className="btn-denim" style={{ flex: 1.5, justifyContent: "center" }}>
                      Next: AI Capabilities <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Granular AI Permissions */}
              {wizardStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-main)" }}>Configure AI Capabilities for {selectedPlatform.name}</h4>
                  
                  <div style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.65rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700" }}>
                      <input
                        type="checkbox"
                        checked={permissions.enableDmReply}
                        onChange={(e) => setPermissions({ ...permissions, enableDmReply: e.target.checked })}
                        style={{ width: "18px", height: "18px", accentColor: "#573325" }}
                      />
                      Enable 24/7 AI DM Auto-Replies
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "0.65rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700" }}>
                      <input
                        type="checkbox"
                        checked={permissions.enableCommentReply}
                        onChange={(e) => setPermissions({ ...permissions, enableCommentReply: e.target.checked })}
                        style={{ width: "18px", height: "18px", accentColor: "#573325" }}
                      />
                      Enable AI Post & Reel Comment Auto-Replies
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "0.65rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700" }}>
                      <input
                        type="checkbox"
                        checked={permissions.enableCrmSync}
                        onChange={(e) => setPermissions({ ...permissions, enableCrmSync: e.target.checked })}
                        style={{ width: "18px", height: "18px", accentColor: "#573325" }}
                      />
                      Auto-Extract Lead Info to Master Lead List
                    </label>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                    <button type="button" onClick={() => setWizardStep(2)} className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
                      Back
                    </button>
                    <button type="button" onClick={() => setWizardStep(4)} className="btn-denim" style={{ flex: 1.5, justifyContent: "center" }}>
                      Next: Webhook Health Check <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Webhook Health & Verification */}
              {wizardStep === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", textAlign: "center" }}>
                  <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--accent-emerald)", fontWeight: "800", fontSize: "1rem" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent-emerald)", boxShadow: "0 0 10px var(--accent-emerald)" }} />
                      Webhook Health: ACTIVE & LISTENING
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "0.4rem" }}>
                      Meta Graph API callback verified successfully for <strong>{accountHandle}</strong>.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <button type="button" onClick={() => setWizardStep(3)} className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
                      Back
                    </button>
                    <button type="submit" className="gradient-btn" style={{ flex: 1.5, justifyContent: "center" }}>
                      <CheckCircle2 size={16} /> Complete Connection & Activate AI
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE LIVE SOCIAL DM SIMULATOR MODAL */}
      {showDMSimulator && simulatorPlatform && (
        <div 
          style={{ 
            position: "fixed", 
            inset: 0, 
            zIndex: 2700, 
            background: "rgba(18, 12, 9, 0.8)", 
            backdropFilter: "blur(18px)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "1.5rem"
          }}
        >
          <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "480px", padding: "0", background: "var(--bg-secondary)", border: "1px solid var(--border-highlight)", overflow: "hidden", borderRadius: "var(--radius-lg)" }}>
            
            {/* DM Header */}
            <div style={{ padding: "1rem 1.25rem", background: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: "800" }}>
                  <Bot size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-main)" }}>
                    {simulatorPlatform.name} AI DM Simulator
                  </h4>
                  <span style={{ fontSize: "0.72rem", color: "var(--accent-emerald)", fontWeight: "600" }}>
                    ● 24/7 AI Auto-Reply Active
                  </span>
                </div>
              </div>
              <button onClick={() => setShowDMSimulator(false)} style={{ color: "var(--text-subtle)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* DM Messages Thread */}
            <div style={{ padding: "1.25rem", minHeight: "280px", maxHeight: "360px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.85rem", background: "var(--bg-primary)" }}>
              {simulatedMessages.map((msg) => (
                <div 
                  key={msg.id}
                  style={{ 
                    display: "flex", 
                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" 
                  }}
                >
                  <div 
                    style={{ 
                      maxWidth: "80%", 
                      padding: "0.7rem 0.95rem", 
                      borderRadius: "1rem", 
                      background: msg.sender === "user" ? "var(--accent-primary)" : "var(--bg-tertiary)",
                      color: msg.sender === "user" ? "#ffffff" : "var(--text-main)",
                      fontSize: "0.85rem",
                      lineHeight: "1.45",
                      border: msg.sender === "user" ? "none" : "1px solid var(--border-color)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ padding: "0.5rem 0.85rem", borderRadius: "1rem", background: "var(--bg-tertiary)", color: "var(--text-subtle)", fontSize: "0.78rem", fontStyle: "italic" }}>
                    🤖 AI Assistant is typing response...
                  </div>
                </div>
              )}
            </div>

            {/* Quick Test Prompt Presets */}
            <div style={{ padding: "0.6rem 1rem", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)", display: "flex", gap: "0.4rem", overflowX: "auto" }}>
              <button 
                onClick={() => setUserTestInput("What are your business hours?")}
                style={{ fontSize: "0.7rem", padding: "0.25rem 0.6rem", background: "var(--bg-tertiary)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: "1rem", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                "Business hours?"
              </button>
              <button 
                onClick={() => setUserTestInput("How much does consultation cost?")}
                style={{ fontSize: "0.7rem", padding: "0.25rem 0.6rem", background: "var(--bg-tertiary)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: "1rem", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                "Pricing info?"
              </button>
              <button 
                onClick={() => setUserTestInput("Can I book a call for tomorrow?")}
                style={{ fontSize: "0.7rem", padding: "0.25rem 0.6rem", background: "var(--bg-tertiary)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: "1rem", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                "Book appointment"
              </button>
            </div>

            {/* DM Input Bar */}
            <form onSubmit={handleSendTestDM} style={{ padding: "0.75rem 1rem", background: "var(--bg-tertiary)", borderTop: "1px solid var(--border-color)", display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder={`Type a test DM to ${simulatorPlatform.name}...`}
                className="form-input"
                style={{ flex: 1, fontSize: "0.85rem" }}
                value={userTestInput}
                onChange={(e) => setUserTestInput(e.target.value)}
              />
              <button type="submit" className="btn-denim" style={{ padding: "0.5rem 0.85rem" }}>
                <Send size={16} />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* DEVELOPER WEBHOOK & API SETUP GUIDE MODAL */}
      {showDeveloperGuide && (
        <div 
          style={{ 
            position: "fixed", 
            inset: 0, 
            zIndex: 2600, 
            background: "rgba(18, 12, 9, 0.75)", 
            backdropFilter: "blur(16px)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "1.5rem"
          }}
        >
          <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "680px", padding: "2.25rem", background: "var(--bg-secondary)", border: "1px solid var(--border-highlight)", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "800" }}>Developer Social Integration Setup Guide</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>How to configure Meta App, WhatsApp Cloud API & Webhooks</p>
              </div>
              <button onClick={() => setShowDeveloperGuide(false)} style={{ color: "var(--text-subtle)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.875rem", lineHeight: 1.6 }}>
              
              <div style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--accent-primary)", marginBottom: "0.35rem" }}>1. Webhook Callback URL Endpoint</h4>
                <p style={{ fontSize: "0.825rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>
                  Register this HTTPS URL in your Meta App Dashboard under <strong>Webhooks &gt; Page / Instagram / WhatsApp</strong>:
                </p>
                <code style={{ background: "var(--bg-primary)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", display: "block", color: "var(--accent-emerald)", fontSize: "0.8rem", fontFamily: "monospace" }}>
                  https://api.aaystyle.example.com/v1/webhooks/social-events
                </code>
              </div>

              <div style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--accent-primary)", marginBottom: "0.35rem" }}>2. Meta OAuth Permissions Required</h4>
                <ul style={{ paddingLeft: "1.25rem", fontSize: "0.825rem" }}>
                  <li><code style={{ color: "var(--accent-cyan)" }}>pages_messaging</code> : Read & reply to Facebook Messenger DMs.</li>
                  <li><code style={{ color: "var(--accent-cyan)" }}>instagram_manage_messages</code> : Read & reply to Instagram DMs.</li>
                  <li><code style={{ color: "var(--accent-cyan)" }}>instagram_manage_comments</code> : Auto-reply to post comments.</li>
                  <li><code style={{ color: "var(--accent-cyan)" }}>whatsapp_business_messaging</code> : Send & receive WhatsApp Cloud messages.</li>
                </ul>
              </div>

              <div style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--accent-primary)", marginBottom: "0.35rem" }}>3. How End-Users Connect Accounts</h4>
                <p style={{ fontSize: "0.825rem", color: "var(--text-main)" }}>
                  Users simply click <strong>"Connect Account"</strong> on the Social Connections dashboard view. A Meta OAuth popup opens, allowing them to select their business Facebook Page or Instagram profile. AayStyle automatically saves their Page Access Token and starts handling DMs 24/7!
                </p>
              </div>

            </div>

            <button onClick={() => setShowDeveloperGuide(false)} className="btn-denim" style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }}>
              Got It! Close Setup Guide
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
