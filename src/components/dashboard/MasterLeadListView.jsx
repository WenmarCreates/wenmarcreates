import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Clock,
  Calendar,
  MapPin,
  Building2,
  Mail,
  Sparkles,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  Plus,
  RefreshCw,
  Zap,
  Globe
} from "lucide-react";

export const MasterLeadListView = () => {
  const {
    automations,
    addAutomation,
    toggleAutomationStatus,
    deleteAutomation,
    runAutomationNow,
    addToast
  } = useApp();

  // Form State
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Miami, FL");
  const [niche, setNiche] = useState("Plumbers");
  const [day, setDay] = useState("Every Monday");
  const [time, setTime] = useState("09:00 AM");
  
  const [selectedTemplatePreset, setSelectedTemplatePreset] = useState("ai_pitch");
  const [subject, setSubject] = useState("Automate customer inquiries for {{business_name}}");
  const [templateBody, setTemplateBody] = useState(
    "Hi {{business_name}} Team,\n\nWe noticed your {{niche}} business in {{location}}. Our AI Automation Assistant helps local businesses capture 2x more customer leads and field inquiries 24/7.\n\nWould you be open to a quick 5-minute preview this week?\n\nBest regards,\nApex Digital Team"
  );

  // Presets for Email Templates
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

  const handleSelectPreset = (presetId) => {
    setSelectedTemplatePreset(presetId);
    const p = templatePresets.find((t) => t.id === presetId);
    if (p) {
      setSubject(p.subject);
      setTemplateBody(p.body);
    }
  };

  const handleCreateAutomation = (e) => {
    e.preventDefault();

    const autoName = name.trim() || `Automated ${niche} Outreach (${location})`;

    addAutomation({
      name: autoName,
      location,
      niche,
      day,
      time,
      template: selectedTemplatePreset,
      subject,
      templateBody
    });

    setName("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      
      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Scraping & Email <span className="gradient-text">Automation</span>
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "0.2rem" }}>
            Set up recurring automated schedules to scrape leads by <strong>Location & Niche</strong> on specific days and times, then automatically send email templates.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span className="badge badge-success" style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem", fontWeight: "700" }}>
            <Zap size={14} /> Cron Scheduler Active
          </span>
        </div>
      </div>

      {/* AUTOMATION CREATION FORM */}
      <form onSubmit={handleCreateAutomation} className="glass-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)", display: "flex", flexDirection: "column", gap: "1.25rem", border: "1px solid var(--border-highlight)" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800", fontSize: "1rem" }}>
            <Clock size={18} color="var(--accent-primary)" /> Create Scheduled Automation
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>
            Location + Niche + Schedule (Day & Time) + Template
          </span>
        </div>

        {/* Row 1: Automation Name, Location, Niche */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          
          {/* Automation Name */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "700" }}>Automation Name</label>
            <input
              type="text"
              placeholder="e.g. Weekly Miami Plumbers Outreach"
              className="form-input"
              style={{ fontWeight: "600" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <MapPin size={14} color="var(--accent-primary)" /> Location / City
            </label>
            <input
              type="text"
              placeholder="e.g. Miami, FL or Dallas, TX"
              className="form-input"
              style={{ fontWeight: "600" }}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Niche */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Building2 size={14} color="var(--accent-primary)" /> Business Niche
            </label>
            <input
              type="text"
              placeholder="e.g. Plumbers, Dentists..."
              className="form-input"
              style={{ fontWeight: "600" }}
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              required
            />
          </div>

        </div>

        {/* Row 2: Day and Time Selection */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          
          {/* Day Selection */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Calendar size={14} color="var(--accent-primary)" /> Day When to Scrape
            </label>
            <select
              className="form-select"
              style={{ fontWeight: "600" }}
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="Every Monday">Every Monday</option>
              <option value="Every Tuesday">Every Tuesday</option>
              <option value="Every Wednesday">Every Wednesday</option>
              <option value="Every Thursday">Every Thursday</option>
              <option value="Every Friday">Every Friday</option>
              <option value="Every Saturday">Every Saturday</option>
              <option value="Every Sunday">Every Sunday</option>
              <option value="Daily">Daily (Every 24 Hours)</option>
              <option value="1st & 15th of Month">1st & 15th of Month</option>
            </select>
          </div>

          {/* Time Selection */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Clock size={14} color="var(--accent-primary)" /> Time to Scrape & Send
            </label>
            <select
              className="form-select"
              style={{ fontWeight: "600" }}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="08:00 AM">08:00 AM</option>
              <option value="09:00 AM">09:00 AM (Recommended)</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="02:30 PM">02:30 PM</option>
              <option value="06:00 PM">06:00 PM</option>
            </select>
          </div>

        </div>

        {/* Row 3: Email Template Selection */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: "800", marginBottom: 0, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Mail size={15} color="var(--accent-primary)" /> Outreach Email Template
            </label>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: "600" }}>Choose Template:</span>
              {templatePresets.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectPreset(t.id)}
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.2rem 0.55rem",
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

          <input
            type="text"
            className="form-input"
            style={{ fontSize: "0.85rem", fontWeight: "600" }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject Line..."
            required
          />

          <textarea
            className="form-input"
            rows={3}
            style={{ fontSize: "0.82rem", lineHeight: 1.5, fontFamily: "var(--font-sans)" }}
            value={templateBody}
            onChange={(e) => setTemplateBody(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            className="gradient-btn"
            style={{
              width: "100%",
              padding: "0.75rem 1.25rem",
              fontSize: "0.95rem",
              justifyContent: "center",
              fontWeight: "800",
              boxShadow: "var(--shadow-md)"
            }}
          >
            <Sparkles size={18} /> Save & Activate Automation
          </button>
        </div>

      </form>

      {/* ACTIVE AUTOMATIONS TABLE */}
      <div className="glass-card" style={{ padding: "1.25rem", background: "var(--bg-secondary)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800" }}>
              Active Automations Schedule
            </h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>
              Manage recurring lead scraping and automated email sequences.
            </p>
          </div>
          <span className="badge badge-primary">
            {automations.length} Active Automations
          </span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Automation Name & Target</th>
                <th>Schedule (Day & Time)</th>
                <th>Email Template</th>
                <th>Status</th>
                <th>Next Scheduled Run</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {automations.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--text-subtle)" }}>
                    No automations configured yet. Fill out the form above to schedule recurring lead scraping!
                  </td>
                </tr>
              ) : (
                automations.map((auto) => (
                  <tr key={auto.id}>
                    
                    {/* Name & Target */}
                    <td>
                      <div style={{ fontWeight: "800", color: "var(--text-main)", fontSize: "0.88rem" }}>{auto.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "2px" }}>
                        <MapPin size={12} /> {auto.niche} in {auto.location}
                      </div>
                    </td>

                    {/* Schedule */}
                    <td style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--accent-primary)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Calendar size={13} /> {auto.day}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-subtle)", fontWeight: "600" }}>at {auto.time}</div>
                    </td>

                    {/* Template */}
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={auto.subject}>
                      <span className="badge badge-neutral" style={{ fontSize: "0.68rem", padding: "0.15rem 0.4rem", marginRight: "0.3rem" }}>
                        {auto.template || "Email Template"}
                      </span>
                      {auto.subject}
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`badge ${auto.status === "Active" ? "badge-success" : "badge-neutral"}`} style={{ fontWeight: "800" }}>
                        {auto.status === "Active" ? "🟢 Active" : "⏸️ Paused"}
                      </span>
                    </td>

                    {/* Next Run */}
                    <td style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>
                      <div>{auto.nextRun}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Last: {auto.lastRun}</div>
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => runAutomationNow(auto.id, auto.name)}
                          className="gradient-btn"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", whiteSpace: "nowrap" }}
                          title="Run Immediately"
                        >
                          <Play size={12} /> Run Now
                        </button>
                        <button
                          onClick={() => toggleAutomationStatus(auto.id)}
                          className="btn-secondary"
                          style={{ padding: "0.35rem 0.6rem", fontSize: "0.75rem" }}
                          title={auto.status === "Active" ? "Pause Automation" : "Resume Automation"}
                        >
                          {auto.status === "Active" ? <Pause size={12} /> : <Play size={12} />}
                        </button>
                        <button
                          onClick={() => deleteAutomation(auto.id, auto.name)}
                          style={{ padding: "0.35rem 0.6rem", borderRadius: "var(--radius-sm)", background: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)", border: "1px solid rgba(244, 63, 94, 0.3)", fontSize: "0.75rem" }}
                          title="Delete Automation"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
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
