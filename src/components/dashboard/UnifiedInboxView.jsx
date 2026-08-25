import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  MessageSquare, PhoneCall, Mail, Share2, Sparkles, Send, Bot, User, CheckCircle2, 
  Filter, Layers, MessageCircle, Globe
} from "lucide-react";

export const UnifiedInboxView = () => {
  const { conversations, addConversationMessage, addToast } = useApp();
  const [selectedChannelFilter, setSelectedChannelFilter] = useState("ALL");
  const [selectedConvId, setSelectedConvId] = useState(conversations[0]?.id || "conv-1");
  const [replyText, setReplyText] = useState("");

  const channelFilters = [
    { id: "ALL", label: "All Inbox", icon: Layers },
    { id: "Chat", label: "Chat Widget", icon: MessageSquare },
    { id: "Email", label: "Email Outreach", icon: Mail },
    { id: "WhatsApp", label: "WhatsApp", icon: MessageCircle },
    { id: "Instagram", label: "Instagram DMs", icon: Share2 },
    { id: "Facebook", label: "Facebook", icon: Share2 },
    { id: "Voice", label: "Web Voice Calls", icon: PhoneCall },
    { id: "LinkedIn", label: "LinkedIn DMs", icon: Share2 }
  ];

  const allConvs = conversations || [];
  const filteredConversations = allConvs.filter((conv) => {
    if (selectedChannelFilter === "ALL") return true;
    return conv?.channel?.toLowerCase() === selectedChannelFilter.toLowerCase();
  });

  const activeConv = filteredConversations.find((c) => c.id === selectedConvId) || filteredConversations[0] || allConvs[0];

  const handleManualReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;
    addConversationMessage(activeConv.id, replyText, "user");
    setReplyText("");
    addToast("Reply Sent", `Manual message dispatched to ${activeConv.leadName} via ${activeConv.channel}.`);
  };

  const handleAIReply = () => {
    if (!activeConv) return;
    addToast("AI Assistant", "Generating intelligent context-aware reply...", "info");
    setTimeout(() => {
      const aiReplyText = `[AI Auto-Response] Thanks for reaching out via ${activeConv.channel}! Based on your query, our team can schedule a live demonstration or answer any pricing questions immediately.`;
      addConversationMessage(activeConv.id, aiReplyText, "ai");
      addToast("AI Reply Sent", "AI generated response dispatched successfully!");
    }, 900);
  };

  const getChannelBadge = (channel) => {
    switch (channel) {
      case "Chat": return { color: "#6366f1", icon: MessageSquare };
      case "Voice": return { color: "#8b5cf6", icon: PhoneCall };
      case "Email": return { color: "#06b6d4", icon: Mail };
      case "WhatsApp": return { color: "#10b981", icon: MessageCircle };
      case "Instagram": return { color: "#ec4899", icon: Share2 };
      case "Facebook": return { color: "#3b82f6", icon: Share2 };
      case "LinkedIn": return { color: "#0284c7", icon: Share2 };
      default: return { color: "#D3A373", icon: Share2 };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      {/* CHANNEL FILTER TABS (Click to filter & view ONLY selected social channel) */}
      <div 
        className="glass-card" 
        style={{ 
          padding: "0.75rem 1rem", 
          background: "var(--bg-secondary)", 
          display: "flex", 
          alignItems: "center", 
          gap: "0.5rem", 
          overflowX: "auto",
          border: "1px solid var(--border-color)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", paddingRight: "0.75rem", borderRight: "1px solid var(--border-color)", fontSize: "0.8rem", fontWeight: "800", color: "var(--text-subtle)", whiteSpace: "nowrap" }}>
          <Filter size={14} color="var(--accent-primary)" /> Filter Channel:
        </div>

        {channelFilters.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedChannelFilter === tab.id;
          const count = tab.id === "ALL" ? allConvs.length : allConvs.filter(c => c?.channel?.toLowerCase() === tab.id.toLowerCase()).length;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedChannelFilter(tab.id);
                const firstMatched = conversations.find(c => tab.id === "ALL" || c.channel.toLowerCase() === tab.id.toLowerCase());
                if (firstMatched) setSelectedConvId(firstMatched.id);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.45rem 0.9rem",
                borderRadius: "var(--radius-full)",
                background: isActive ? "#573325" : "var(--bg-tertiary)",
                color: isActive ? "#FEFADF" : "var(--text-main)",
                fontSize: "0.825rem",
                fontWeight: isActive ? "800" : "600",
                whiteSpace: "nowrap",
                transition: "all var(--transition-fast)",
                border: isActive ? "1px solid rgba(211, 163, 115, 0.5)" : "1px solid transparent",
                boxShadow: isActive ? "0 2px 8px rgba(87, 51, 37, 0.2)" : "none"
              }}
            >
              <Icon size={14} color={isActive ? "#D3A373" : "var(--accent-primary)"} />
              <span>{tab.label}</span>
              <span 
                style={{ 
                  fontSize: "0.68rem", 
                  padding: "0.1rem 0.4rem", 
                  borderRadius: "var(--radius-full)", 
                  background: isActive ? "rgba(211, 163, 115, 0.25)" : "var(--bg-secondary)",
                  color: isActive ? "#FEFADF" : "var(--text-subtle)",
                  fontWeight: "800"
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* MAIN INBOX GRID */}
      <div className="glass-card" style={{ display: "grid", gridTemplateColumns: "340px 1fr", height: "70vh", minHeight: "560px", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        
        {/* Left Conversations List Panel */}
        <div style={{ borderRight: "1px solid var(--border-color)", display: "flex", flexDirection: "column", background: "var(--bg-tertiary)" }}>
          <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "800" }}>
                {selectedChannelFilter === "ALL" ? "All Messages" : `${selectedChannelFilter} Inbox`}
              </h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>
                Showing {filteredConversations.length} conversation thread{filteredConversations.length !== 1 ? "s" : ""}
              </p>
            </div>
            {selectedChannelFilter !== "ALL" && (
              <button 
                onClick={() => setSelectedChannelFilter("ALL")}
                style={{ fontSize: "0.72rem", color: "var(--accent-primary)", fontWeight: "700", cursor: "pointer" }}
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Conversations List */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const badgeInfo = getChannelBadge(conv.channel);
                const Icon = badgeInfo.icon;
                const isSelected = conv.id === selectedConvId;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    style={{
                      padding: "0.9rem 1rem",
                      borderBottom: "1px solid var(--border-color)",
                      cursor: "pointer",
                      background: isSelected ? "var(--bg-secondary)" : "transparent",
                      borderLeft: isSelected ? "4px solid #573325" : "4px solid transparent",
                      transition: "background var(--transition-fast)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-main)" }}>{conv.leadName}</span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-subtle)" }}>{conv.timestamp}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
                      <span className="badge" style={{ background: `${badgeInfo.color}22`, color: badgeInfo.color, fontSize: "0.68rem", padding: "0.15rem 0.45rem", fontWeight: "700" }}>
                        <Icon size={12} /> {conv.channel}
                      </span>
                      {conv.unread && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent-rose)" }}></span>}
                    </div>

                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {conv.lastMsg}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-subtle)", fontSize: "0.85rem" }}>
                No active conversations found for {selectedChannelFilter}.
              </div>
            )}
          </div>
        </div>

        {/* Right Conversation Window Panel */}
        {activeConv ? (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-secondary)" }}>
            
            {/* Thread Header */}
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-tertiary)" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800" }}>{activeConv.leadName}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "var(--text-subtle)" }}>
                  <span>Channel: <strong style={{ color: "var(--text-main)" }}>{activeConv.channel}</strong></span> • <span>Sync Status: Live AI Auto-Reply</span>
                </div>
              </div>

              <button onClick={handleAIReply} className="btn-denim" style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}>
                <Sparkles size={16} /> Generate AI Response
              </button>
            </div>

            {/* Message Transcripts */}
            <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {activeConv?.history?.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginBottom: "0.2rem", textAlign: msg.sender === "user" ? "right" : "left" }}>
                    {msg.sender === "user" ? "Customer / Lead" : "AayStyle AI Agent"} ({msg.time})
                  </div>
                  <div
                    style={{
                      padding: "0.8rem 1rem",
                      borderRadius: msg.sender === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                      background: msg.sender === "user" ? "#573325" : "var(--bg-tertiary)",
                      color: msg.sender === "user" ? "#FEFADF" : "var(--text-main)",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      border: "1px solid var(--border-color)",
                      boxShadow: "var(--shadow-sm)"
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Action Form */}
            <form onSubmit={handleManualReply} style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border-color)", background: "var(--bg-tertiary)", display: "flex", gap: "0.75rem" }}>
              <input
                type="text"
                placeholder={`Type a manual reply to send over ${activeConv.channel}...`}
                className="form-input"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button type="submit" className="btn-denim" style={{ padding: "0.65rem 1.25rem", whiteSpace: "nowrap" }}>
                <Send size={16} /> Reply on {activeConv.channel}
              </button>
            </form>

          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "var(--text-subtle)" }}>
            Select a conversation to view messages.
          </div>
        )}

      </div>

    </div>
  );
};
