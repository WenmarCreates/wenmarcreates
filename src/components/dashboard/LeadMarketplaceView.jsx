import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  MapPin,
  Building2,
  Filter,
  Mail,
  Sparkles,
  RefreshCw,
  Send,
  CheckCircle2,
  ArrowRight,
  Layers,
  Check
} from "lucide-react";

export const LeadMarketplaceView = () => {
  const { addToast, setCurrentView, addScrapedCampaignLeads } = useApp();

  // Campaign Form Inputs
  const [location, setLocation] = useState("Miami, FL");
  const [niche, setNiche] = useState("Plumbers");
  const [selectedSource, setSelectedSource] = useState("All");

  // Email Template State
  const [selectedTemplatePreset, setSelectedTemplatePreset] = useState("ai_pitch");
  const [emailSubject, setEmailSubject] = useState("Automate customer inquiries for {{business_name}}");
  const [emailTemplate, setEmailTemplate] = useState(
    "Hi {{business_name}} Team,\n\nWe noticed your {{niche}} business in {{location}}. Our AI Automation Assistant helps local businesses capture 2x more customer leads and field inquiries 24/7.\n\nWould you be open to a quick 5-minute preview this week?\n\nBest regards,\nApex Digital Team"
  );

  // Campaign Launching & Progress State
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [scrapeStepText, setScrapeStepText] = useState("");
  const [isCampaignLaunched, setIsCampaignLaunched] = useState(false);

  const [launchedCampaignSummary, setLaunchedCampaignSummary] = useState(null);

  // Template Presets
  const templatePresets = [
    {
      id: "ai_pitch",
      title: "AI Service Pitch",
      subject: "Automate customer inquiries for {{business_name}}",
      body: "Hi {{business_name}} Team,\n\nWe noticed your {{niche}} business in {{location}}. Our AI Automation Assistant helps local businesses capture 2x more customer leads and field inquiries 24/7.\n\nWould you be open to a quick 5-minute preview this week?\n\nBest regards,\nApex Digital Team"
    },
    {
      id: "lead_gen",
      title: "Lead Generation Audit",
      subject: "Free lead generation audit for {{business_name}} in {{location}}",
      body: "Hello {{business_name}},\n\nWe are reaching out to top {{niche}} providers in {{location}}. We prepared a complimentary audit on how your website and social profiles handle inbound inquiries.\n\nLet us know if you would like us to send over the report!\n\nBest,\nApex Digital Team"
    },
    {
      id: "partnership",
      title: "Local Partnership Proposal",
      subject: "Partnership opportunity for {{business_name}}",
      body: "Hi Team,\n\nWe are expanding our network of {{niche}} specialists in {{location}} and would love to connect with {{business_name}}.\n\nAre you open for a brief introductory call?\n\nBest regards,\nApex Digital"
    }
  ];

  const handleSelectTemplate = (presetId) => {
    setSelectedTemplatePreset(presetId);
    const preset = templatePresets.find((t) => t.id === presetId);
    if (preset) {
      setEmailSubject(preset.subject);
      setEmailTemplate(preset.body);
    }
  };

  // Helper to launch campaign
  const handleLaunchCampaign = (e) => {
    if (e) e.preventDefault();

    const targetLoc = location.trim() || "Miami, FL";
    const targetNiche = niche.trim() || "Business Services";

    setIsScraping(true);
    setScrapeProgress(15);
    setScrapeStepText(`Connecting to Google Maps, Instagram & Facebook for "${targetNiche}" in ${targetLoc}...`);

    setTimeout(() => {
      setScrapeProgress(50);
      setScrapeStepText(`Extracting verified emails & building target lead list...`);
    }, 500);

    setTimeout(() => {
      setScrapeProgress(85);
      setScrapeStepText(`Configuring automated cold email campaign sequence...`);
    }, 950);

    setTimeout(() => {
      setScrapeProgress(100);
      setIsScraping(false);

      // Generate newly scraped leads for Email Campaigns View
      const city = targetLoc.split(",")[0] || targetLoc;
      const cleanNiche = targetNiche.replace(/[^a-zA-Z0-9 ]/g, "");
      const nicheSlug = cleanNiche.toLowerCase().replace(/\s+/g, "");

      const newScrapedLeads = [
        {
          id: `email-scraped-${Date.now()}-1`,
          businessName: `${city} ${targetNiche} Pros`,
          email: `contact@${nicheSlug}${city.toLowerCase().replace(/\s+/g, "")}pro.com`,
          source: selectedSource === "All" ? "Google Business Profile" : selectedSource,
          status: "Sent",
          sentAt: "Just now",
          subject: emailSubject.replace("{{business_name}}", `${city} ${targetNiche} Pros`)
        },
        {
          id: `email-scraped-${Date.now()}-2`,
          businessName: `Apex ${targetNiche} Experts`,
          email: `info@apex${nicheSlug}experts.com`,
          source: selectedSource === "All" ? "Instagram" : selectedSource,
          status: "Sending",
          sentAt: "In progress...",
          subject: emailSubject.replace("{{business_name}}", `Apex ${targetNiche} Experts`)
        },
        {
          id: `email-scraped-${Date.now()}-3`,
          businessName: `${city} Elite ${targetNiche}`,
          email: `sales@${city.toLowerCase().replace(/\s+/g, "")}elite${nicheSlug}.com`,
          source: selectedSource === "All" ? "Facebook" : selectedSource,
          status: "Sent",
          sentAt: "Just now",
          subject: emailSubject.replace("{{business_name}}", `${city} Elite ${targetNiche}`)
        },
        {
          id: `email-scraped-${Date.now()}-4`,
          businessName: `Vanguard ${targetNiche} Group`,
          email: `support@vanguard${nicheSlug}.com`,
          source: selectedSource === "All" ? "Google & Instagram" : selectedSource,
          status: "Error",
          errorMsg: "Mail server temporary connection timeout",
          sentAt: "Failed just now",
          subject: emailSubject.replace("{{business_name}}", `Vanguard ${targetNiche} Group`)
        }
      ];

      addScrapedCampaignLeads(newScrapedLeads);

      const summary = {
        niche: targetNiche,
        location: targetLoc,
        platform: selectedSource,
        totalLeadsQueued: newScrapedLeads.length,
        subject: emailSubject,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setLaunchedCampaignSummary(summary);
      setIsCampaignLaunched(true);

      addToast(
        "Scrape Successful!",
        `Extracted leads for "${targetNiche}" in ${targetLoc}. Go to Email Campaigns to view email dispatch status!`,
        "success"
      );
    }, 1400);
  };

  const handleResetForm = () => {
    setIsCampaignLaunched(false);
    setLaunchedCampaignSummary(null);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      
      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Launch <span className="gradient-text">Campaign</span>
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "0.2rem" }}>
            Set your target <strong>Location</strong>, <strong>Niche</strong>, and <strong>Email Template</strong> to scrape contacts and initiate email outreach.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span className="badge badge-primary" style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem", fontWeight: "700" }}>
            <Sparkles size={14} color="var(--accent-primary)" /> 50 Daily Scrapes Remaining
          </span>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION STATE */}
      {isCampaignLaunched && launchedCampaignSummary ? (
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: "3rem 2rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-highlight)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1.25rem",
            boxShadow: "var(--shadow-lg)"
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(5, 150, 105, 0.15)",
              border: "1px solid rgba(5, 150, 105, 0.4)",
              color: "var(--accent-emerald)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="badge badge-success" style={{ fontSize: "0.82rem", padding: "0.35rem 0.85rem", marginBottom: "0.5rem" }}>
              ✓ Scrape Successful!
            </span>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "800", marginTop: "0.4rem" }}>
              Leads Extracted & Campaign Active!
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-subtle)", maxWidth: "580px", margin: "0.5rem auto 0", lineHeight: 1.6 }}>
              Successfully scraped verified business contacts for <strong>"{launchedCampaignSummary.niche}"</strong> in <strong>"{launchedCampaignSummary.location}"</strong>. 
              <br />
              <strong style={{ color: "var(--text-main)" }}>Go to Email Campaigns to see the real-time status of your email outreach process (Sent, Sending, Error).</strong>
            </p>
          </div>

          {/* Campaign Summary Card */}
          <div
            style={{
              width: "100%",
              maxWidth: "620px",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
              textAlign: "left",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem"
            }}
          >
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-subtle)", fontWeight: "700", textTransform: "uppercase" }}>Target Niche & Location</div>
              <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "var(--text-main)", marginTop: "2px" }}>
                {launchedCampaignSummary.niche} in {launchedCampaignSummary.location}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-subtle)", fontWeight: "700", textTransform: "uppercase" }}>Leads Extracted</div>
              <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "var(--accent-emerald)", marginTop: "2px" }}>
                {launchedCampaignSummary.totalLeadsQueued} Verified Contacts
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-subtle)", fontWeight: "700", textTransform: "uppercase" }}>Outreach Subject Line</div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", marginTop: "2px" }}>
                "{launchedCampaignSummary.subject}"
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.75rem" }}>
            <button
              onClick={() => setCurrentView("campaigns")}
              className="gradient-btn"
              style={{ padding: "0.8rem 1.75rem", fontSize: "0.95rem", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Mail size={18} /> Go to Email Campaigns <ArrowRight size={18} />
            </button>
            <button
              onClick={handleResetForm}
              className="btn-secondary"
              style={{ padding: "0.8rem 1.4rem", fontSize: "0.88rem", fontWeight: "700" }}
            >
              + Launch Another Campaign
            </button>
          </div>
        </div>
      ) : (
        /* CAMPAIGN INPUT FORM */
        <form onSubmit={handleLaunchCampaign} className="glass-card animate-fade-in" style={{ padding: "1.75rem", background: "var(--bg-secondary)", display: "flex", flexDirection: "column", gap: "1.5rem", border: "1px solid var(--border-highlight)", boxShadow: "var(--shadow-md)" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontWeight: "800", fontSize: "1.05rem" }}>
              <Send size={20} color="var(--accent-primary)" /> Campaign Setup Form
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-subtle)", fontWeight: "600" }}>
              Location • Niche • Outreach Template
            </span>
          </div>

          {/* Field 1 & 2: Location & Niche */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.2rem" }}>
            
            {/* Location Input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <MapPin size={15} color="var(--accent-primary)" /> Location / City
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="e.g. Miami, FL or Dallas, TX"
                  className="form-input"
                  style={{ paddingLeft: "2.3rem", fontWeight: "600" }}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <MapPin size={16} color="var(--text-subtle)" style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            {/* Niche Input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Building2 size={15} color="var(--accent-primary)" /> Business Niche / Industry
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="e.g. Plumbers, Real Estate, Dentists..."
                  className="form-input"
                  style={{ paddingLeft: "2.3rem", fontWeight: "600" }}
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  required
                />
                <Building2 size={16} color="var(--text-subtle)" style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

          </div>

          {/* Field 3: Target Platforms Selector */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Filter size={15} color="var(--accent-primary)" /> Scraping Source Platforms
            </label>
            <select
              className="form-select"
              style={{ fontWeight: "600" }}
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="All">All Platforms (Google Business Profile, Instagram, Facebook)</option>
              <option value="Google">Google Business Profile Only</option>
              <option value="Instagram">Instagram Profiles Only</option>
              <option value="Facebook">Facebook Pages Only</option>
            </select>
          </div>

          {/* Field 4: Email Template Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "var(--bg-tertiary)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: "800", marginBottom: 0, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Mail size={16} color="var(--accent-primary)" /> Outreach Email Template
              </label>

              {/* Template Presets Picker */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: "600" }}>Presets:</span>
                {templatePresets.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTemplate(t.id)}
                    style={{
                      fontSize: "0.72rem",
                      padding: "0.25rem 0.55rem",
                      borderRadius: "4px",
                      background: selectedTemplatePreset === t.id ? "var(--gradient-glow)" : "var(--bg-secondary)",
                      color: selectedTemplatePreset === t.id ? "var(--text-main)" : "var(--text-muted)",
                      border: selectedTemplatePreset === t.id ? "1px solid var(--border-highlight)" : "1px solid var(--border-color)",
                      fontWeight: selectedTemplatePreset === t.id ? "800" : "600"
                    }}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Line */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: "0.78rem", fontWeight: "700" }}>Email Subject Line</label>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: "0.85rem", fontWeight: "600" }}
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject..."
                required
              />
            </div>

            {/* Body Textarea */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: "0.78rem", fontWeight: "700" }}>Email Body Message</label>
              <textarea
                className="form-input"
                rows={5}
                style={{ fontSize: "0.85rem", lineHeight: 1.5, fontFamily: "var(--font-sans)" }}
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                required
              ></textarea>
              <div style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "0.3rem" }}>
                Supported Tags: <code>{"{{business_name}}"}</code>, <code>{"{{niche}}"}</code>, <code>{"{{location}}"}</code>
              </div>
            </div>

          </div>

          {/* Scraping Progress Indicator Banner */}
          {isScraping && (
            <div
              className="glass-card animate-fade-in"
              style={{
                padding: "1.25rem",
                background: "var(--gradient-glow)",
                border: "1px solid var(--border-highlight)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontWeight: "800", fontSize: "0.9rem" }}>
                  <RefreshCw size={16} className="animate-spin" color="var(--accent-primary)" />
                  <span>{scrapeStepText}</span>
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--accent-primary)" }}>
                  {scrapeProgress}%
                </span>
              </div>

              {/* Progress Bar Container */}
              <div style={{ width: "100%", height: "8px", background: "var(--bg-tertiary)", borderRadius: "4px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${scrapeProgress}%`,
                    height: "100%",
                    background: "var(--gradient-primary)",
                    transition: "width 0.4s ease"
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isScraping}
              className="gradient-btn"
              style={{
                width: "100%",
                padding: "0.85rem 1.5rem",
                fontSize: "1rem",
                justifyContent: "center",
                fontWeight: "800",
                boxShadow: "var(--shadow-md)"
              }}
            >
              {isScraping ? (
                <>
                  <RefreshCw size={18} className="animate-spin" /> Scraping Leads & Creating Campaign...
                </>
              ) : (
                <>
                  <Send size={18} /> Launch Lead Campaign
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
