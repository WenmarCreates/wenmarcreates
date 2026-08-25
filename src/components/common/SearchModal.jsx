import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Search, X, ArrowRight, LayoutDashboard, Users, Mail, PhoneCall, BookOpen, CreditCard } from "lucide-react";

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, setCurrentView, leads, campaigns } = useApp();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const quickNav = [
    { label: "Executive Dashboard", view: "dashboard", icon: LayoutDashboard },
    { label: "AI Knowledge Base", view: "knowledge-base", icon: BookOpen },
    { label: "Live Web Call AI Receptionist", view: "ai-receptionist", icon: PhoneCall },
    { label: "Launch Campaign", view: "leads", icon: Users },
    { label: "Email Campaigns & Status", view: "campaigns", icon: Mail },
    { label: "Automation", view: "master-leads", icon: CreditCard }
  ];

  const filteredNav = quickNav.filter(n => n.label.toLowerCase().includes(query.toLowerCase()));
  const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(query.toLowerCase()) || l.industry.toLowerCase().includes(query.toLowerCase())).slice(0, 4);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(57, 33, 25, 0.65)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh"
      }}
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "640px",
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "1px solid var(--border-highlight)",
          boxShadow: "var(--shadow-lg)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)", gap: "0.75rem" }}>
          <Search size={20} color="var(--accent-primary)" />
          <input
            type="text"
            placeholder="Search views, business leads, campaigns, or settings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-main)",
              fontSize: "1.05rem"
            }}
          />
          <button onClick={() => setIsSearchOpen(false)} style={{ color: "var(--text-subtle)", padding: "4px" }}>
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ padding: "1.25rem", maxHeight: "60vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Views Section */}
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--text-subtle)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Quick Navigation
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      setCurrentView(item.view);
                      setIsSearchOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-tertiary)",
                      color: "var(--text-main)",
                      fontSize: "0.85rem",
                      textAlign: "left"
                    }}
                  >
                    <Icon size={16} color="var(--accent-primary)" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Leads Section */}
          {filteredLeads.length > 0 && (
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--text-subtle)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Matching Leads
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setCurrentView("leads");
                      setIsSearchOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.6rem 0.85rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-tertiary)",
                      cursor: "pointer"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: "700" }}>{lead.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>{lead.industry} • {lead.city}, {lead.state}</div>
                    </div>
                    <span className="badge badge-primary">Score: {lead.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{ padding: "0.75rem 1.25rem", background: "var(--bg-tertiary)", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-subtle)" }}>
          <span>Press ESC to close</span>
          <span>AayStyle Search Engine</span>
        </div>

      </div>
    </div>
  );
};
