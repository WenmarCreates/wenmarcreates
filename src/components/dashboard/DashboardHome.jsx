import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  PhoneCall,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight
} from "lucide-react";
import {
  LeadGrowthChart,
  AppointmentsBarChart,
  CampaignPerformanceChart,
  ChannelDonutChart
} from "../common/CustomCharts";

export const DashboardHome = () => {
  const { setCurrentView, leads, masterLeads, appointments, campaigns, conversations, analytics } = useApp();

  const stats = [
    { title: "Total Leads", val: "1,240", change: "+14.2%", icon: Users, color: "#6366f1" },
    { title: "New Leads", val: `${leads.length}`, change: "+8.5%", icon: UserPlus, color: "#8b5cf6" },
    { title: "Appointments", val: "148", change: "+24.0%", icon: Calendar, color: "#06b6d4" },
    { title: "Upcoming Bookings", val: `${appointments.filter(a => a.status === "Upcoming").length}`, change: "Next 7 Days", icon: Clock, color: "#10b981" },
    { title: "Emails Sent", val: "4,890", change: "+12.4%", icon: Mail, color: "#f59e0b" },
    { title: "Emails Replied", val: "612", change: "12.5% Rate", icon: Mail, color: "#10b981" },
    { title: "Chat Conversations", val: "890", change: "+32.1%", icon: MessageSquare, color: "#6366f1" },
    { title: "Receptionist Calls", val: "412", change: "99.2% Resolved", icon: PhoneCall, color: "#8b5cf6" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          background: "var(--gradient-glow)",
          border: "1px solid var(--border-highlight)",
          padding: "1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.4rem" }}>
            Welcome Back, <span className="gradient-text">Apex Digital</span> 👋
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Your AI Knowledge Base is active. Chat Widget and AI Call Receptionist are processing customer inquiries 24/7.
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button onClick={() => setCurrentView("leads")} className="btn-secondary" style={{ fontSize: "0.85rem" }}>
            <Search size={16} /> Sourcing Leads
          </button>
          <button onClick={() => setCurrentView("campaigns")} className="gradient-btn" style={{ fontSize: "0.85rem" }}>
            <Plus size={16} /> New Email Campaign
          </button>
        </div>
      </div>

      {/* 8 Stats Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.2rem" }}>
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: "600", color: "var(--text-subtle)", textTransform: "uppercase" }}>{st.title}</span>
                <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-sm)", background: `${st.color}22`, color: st.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>{st.val}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: st.color, fontWeight: "700" }}>
                <TrendingUp size={14} />
                <span>{st.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1: Lead Growth & Appointments */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        
        {/* Lead Growth Chart */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "800" }}>Lead Growth Trend</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>New marketplace leads acquired daily</p>
            </div>
            <button onClick={() => setCurrentView("analytics")} style={{ fontSize: "0.78rem", color: "var(--accent-primary)", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              View Details <ArrowUpRight size={14} />
            </button>
          </div>
          <LeadGrowthChart data={analytics.leadGrowthData} />
        </div>

        {/* Appointments Distribution */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "800" }}>Appointments Booked</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>Weekly calendar booking breakdown</p>
            </div>
            <button onClick={() => setCurrentView("appointments")} style={{ fontSize: "0.78rem", color: "var(--accent-primary)", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              Calendar <ArrowUpRight size={14} />
            </button>
          </div>
          <AppointmentsBarChart />
        </div>

      </div>

      {/* Charts Row 2: Campaign Performance & Channel Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        
        {/* Campaign Performance */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "800" }}>Email Campaign Performance</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>Opens, Clicks & Reply conversion rates</p>
            </div>
            <button onClick={() => setCurrentView("campaigns")} style={{ fontSize: "0.78rem", color: "var(--accent-primary)", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              Outreach <ArrowUpRight size={14} />
            </button>
          </div>
          <CampaignPerformanceChart data={analytics.campaignPerformance} />
        </div>

        {/* Channel Conversations */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "800" }}>Omnichannel Breakdown</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>AI interactions by channel</p>
            </div>
            <button onClick={() => setCurrentView("messages")} style={{ fontSize: "0.78rem", color: "var(--accent-primary)", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              Inbox <ArrowUpRight size={14} />
            </button>
          </div>
          <ChannelDonutChart />
        </div>

      </div>

      {/* Recent Activity Table Preview */}
      <div className="glass-card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "800" }}>Recent AI Platform Activity</h3>
          <button onClick={() => setCurrentView("conversations")} style={{ fontSize: "0.78rem", color: "var(--accent-primary)", fontWeight: "700" }}>
            Full History →
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Lead / Contact</th>
                <th>Channel</th>
                <th>Action Taken</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {conversations.slice(0, 4).map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: "700" }}>{c.leadName}</td>
                  <td>
                    <span className="badge badge-primary">{c.channel}</span>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{c.lastMsg}</td>
                  <td style={{ color: "var(--text-subtle)", fontSize: "0.8rem" }}>{c.timestamp}</td>
                  <td>
                    <span className="badge badge-success">Processed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
