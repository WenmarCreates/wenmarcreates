import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { BarChart3, TrendingUp, Calendar, Filter, Users, Mail, PhoneCall, MessageSquare, ArrowUpRight } from "lucide-react";
import { LeadGrowthChart, AppointmentsBarChart, CampaignPerformanceChart, ChannelDonutChart } from "../common/CustomCharts";

export const AnalyticsView = () => {
  const { analytics } = useApp();
  const [selectedPreset, setSelectedPreset] = useState("30 Days");

  const statItems = [
    { title: "Total Leads Acquired", val: "1,240", change: "+18.4%", icon: Users },
    { title: "Emails Sent", val: "4,890", change: "+12.1%", icon: Mail },
    { title: "Emails Opened", val: "3,420", change: "70.0% Open Rate", icon: Mail },
    { title: "Emails Replied", val: "612", change: "12.5% Reply Rate", icon: Mail },
    { title: "Appointments Booked", val: "148", change: "+24.0%", icon: Calendar },
    { title: "Conversion Rate", val: "4.8%", change: "+1.2%", icon: TrendingUp },
    { title: "Chat Conversations", val: "890", change: "+32.0%", icon: MessageSquare },
    { title: "AI Voice Calls", val: "412", change: "99.2% Resolved", icon: PhoneCall }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Header Bar & Date Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>Advanced Platform Analytics</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>
            Conversion metrics, cold email performance, and AI reception audit.
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", background: "var(--bg-tertiary)", padding: "0.35rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          {["Today", "7 Days", "30 Days", "90 Days"].map((preset) => (
            <button
              key={preset}
              onClick={() => setSelectedPreset(preset)}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "var(--radius-sm)",
                background: selectedPreset === preset ? "var(--accent-primary)" : "transparent",
                color: selectedPreset === preset ? "#ffffff" : "var(--text-muted)",
                fontSize: "0.825rem",
                fontWeight: selectedPreset === preset ? "700" : "500"
              }}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics 8 Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.2rem" }}>
        {statItems.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: "1.25rem", background: "var(--bg-secondary)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: "600", textTransform: "uppercase" }}>{st.title}</span>
                <Icon size={16} color="var(--accent-primary)" />
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "800" }}>{st.val}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--accent-emerald)", fontWeight: "700" }}>{st.change}</div>
            </div>
          );
        })}
      </div>

      {/* Interactive SVG Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        
        <div className="glass-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "1rem" }}>Lead Acquisition Trend ({selectedPreset})</h3>
          <LeadGrowthChart data={analytics.leadGrowthData} />
        </div>

        <div className="glass-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "1rem" }}>Appointments Booked</h3>
          <AppointmentsBarChart />
        </div>

      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        
        <div className="glass-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "1.25rem" }}>Cold Email Funnel Conversion</h3>
          <CampaignPerformanceChart data={analytics.campaignPerformance} />
        </div>

        <div className="glass-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "1.25rem" }}>Channel Volume Share</h3>
          <ChannelDonutChart />
        </div>

      </div>

    </div>
  );
};
