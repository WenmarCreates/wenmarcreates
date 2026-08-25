import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { MessageSquare, Save, Copy, Send, Code, Sparkles, Check, RefreshCw } from "lucide-react";
import { Modal } from "../common/Modal";

export const ChatWidgetConfigView = () => {
  const { chatWidgetConfig, setChatWidgetConfig, addToast } = useApp();
  const [config, setConfig] = useState({ ...chatWidgetConfig });
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Live Chat Preview interactive messages
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: config.welcomeMessage, time: "10:00 AM" }
  ]);
  const [inputMsg, setInputMsg] = useState("");

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setChatWidgetConfig(config);
    addToast("Widget Config Saved", "Chat widget appearance and AI personality updated.");
  };

  const handleSendTestMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInputMsg("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `[${config.aiPersonality}] Thanks for testing our live preview! I am powered by AayStyle and trained on your Knowledge Base to capture lead details and answer queries.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 800);
  };

  const embedCodeSnippet = `<!-- AayStyle Chat Widget Script -->
<script 
  src="https://cdn.aaystyle.example.com/widget.js" 
  data-widget-id="wx-apex-99210"
  data-primary-color="${config.primaryColor}"
  data-position="${config.position}"
  async>
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopied(true);
    addToast("Code Copied", "Embed code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem" }}>
      
      {/* Left Form Settings */}
      <form onSubmit={handleSaveConfig} className="glass-card" style={{ padding: "2rem", background: "var(--bg-secondary)" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "800" }}>Chat Widget Settings</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>Configure branding, AI tone, and response logic</p>
          </div>
          <button type="button" onClick={() => setShowEmbedModal(true)} className="btn-secondary" style={{ fontSize: "0.825rem" }}>
            <Code size={16} /> Copy Embed Code
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Widget Display Name</label>
          <input
            type="text"
            required
            className="form-input"
            value={config.widgetName}
            onChange={(e) => setConfig({ ...config, widgetName: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Welcome Message</label>
          <textarea
            rows="2"
            required
            className="form-textarea"
            value={config.welcomeMessage}
            onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Primary Theme Color</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="color"
                className="form-input"
                style={{ width: "45px", height: "38px", padding: "2px", cursor: "pointer" }}
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
              />
              <input
                type="text"
                className="form-input"
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Button Accent Color</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="color"
                className="form-input"
                style={{ width: "45px", height: "38px", padding: "2px", cursor: "pointer" }}
                value={config.buttonColor}
                onChange={(e) => setConfig({ ...config, buttonColor: e.target.value })}
              />
              <input
                type="text"
                className="form-input"
                value={config.buttonColor}
                onChange={(e) => setConfig({ ...config, buttonColor: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Widget Screen Position</label>
            <select
              className="form-select"
              value={config.position}
              onChange={(e) => setConfig({ ...config, position: e.target.value })}
            >
              <option value="bottom-right">Bottom Right Corner</option>
              <option value="bottom-left">Bottom Left Corner</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Avatar Icon / Emoji</label>
            <input
              type="text"
              className="form-input"
              value={config.avatar}
              onChange={(e) => setConfig({ ...config, avatar: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">AI Agent Tone & Persona</label>
          <select
            className="form-select"
            value={config.aiPersonality}
            onChange={(e) => setConfig({ ...config, aiPersonality: e.target.value })}
          >
            <option value="Friendly & Professional Executive">Friendly & Professional Executive</option>
            <option value="Technical Product Specialist">Technical Product Specialist</option>
            <option value="High-converting Sales Representative">High-converting Sales Representative</option>
            <option value="Casual & Helpful Support Assistant">Casual & Helpful Support Assistant</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Response Behavior</label>
          <input
            type="text"
            className="form-input"
            value={config.responseBehavior}
            onChange={(e) => setConfig({ ...config, responseBehavior: e.target.value })}
          />
        </div>

        <button type="submit" className="gradient-btn" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", marginTop: "1rem" }}>
          <Save size={18} /> Save & Deploy Widget Settings
        </button>
      </form>

      {/* Right Live Interactive Chat Preview */}
      <div className="glass-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)", display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800" }}>Live Chat Interactive Simulator</h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>Test your custom branding and AI responses</p>
          </div>
          <button onClick={() => setChatMessages([{ sender: "ai", text: config.welcomeMessage, time: "10:00 AM" }])} style={{ padding: "0.35rem", color: "var(--text-subtle)" }} title="Reset Preview Chat">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Mock Website Canvas Preview Container */}
        <div style={{ height: "480px", borderRadius: "var(--radius-md)", background: "#0b0f19", border: "1px solid var(--border-color)", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          
          {/* Header */}
          <div style={{ padding: "0.85rem 1rem", background: config.primaryColor, color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ fontSize: "1.2rem" }}>{config.avatar}</div>
              <div>
                <div style={{ fontWeight: "800", fontSize: "0.9rem" }}>{config.widgetName}</div>
                <div style={{ fontSize: "0.68rem", opacity: 0.85, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></span> Online | Powered by AayStyle
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem", background: "rgba(15, 23, 42, 0.9)" }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                <div
                  style={{
                    padding: "0.65rem 0.85rem",
                    borderRadius: msg.sender === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    background: msg.sender === "user" ? config.buttonColor : "var(--bg-tertiary)",
                    color: "#ffffff",
                    fontSize: "0.825rem",
                    lineHeight: 1.4
                  }}
                >
                  {msg.text}
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-subtle)", marginTop: "2px", textAlign: msg.sender === "user" ? "right" : "left" }}>
                  {msg.time}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendTestMessage} style={{ padding: "0.65rem", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)", display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              placeholder="Type a test customer message..."
              className="form-input"
              style={{ fontSize: "0.825rem" }}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
            />
            <button type="submit" style={{ background: config.buttonColor, color: "#ffffff", padding: "0.5rem 0.85rem", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center" }}>
              <Send size={16} />
            </button>
          </form>

        </div>

      </div>

      {/* Embed Code Modal */}
      <Modal isOpen={showEmbedModal} onClose={() => setShowEmbedModal(false)} title="Website Chat Embed Code">
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          Copy and paste this script right before the closing <code>&lt;/body&gt;</code> tag on your website or HTML template.
        </p>
        <pre style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)", fontSize: "0.8rem", overflowX: "auto", border: "1px solid var(--border-color)", color: "#34d399", marginBottom: "1.25rem" }}>
          {embedCodeSnippet}
        </pre>
        <button onClick={copyCode} className="gradient-btn" style={{ width: "100%", justifyContent: "center" }}>
          {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? "Copied!" : "Copy HTML Embed Code"}
        </button>
      </Modal>

    </div>
  );
};
