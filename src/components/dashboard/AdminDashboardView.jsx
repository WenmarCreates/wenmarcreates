import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ShieldCheck, Users, Building2, CreditCard, Search, BookOpen, MessageSquare, PhoneCall, Calendar, Mail, CheckCircle2 } from "lucide-react";

export const AdminDashboardView = () => {
  const { adminData, addToast } = useApp();
  const [activeAdminTab, setActiveAdminTab] = useState("users");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Super Admin Top Banner */}
      <div className="glass-card" style={{ padding: "1.75rem", background: "var(--bg-secondary)", borderLeft: "4px solid var(--accent-rose)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={22} color="var(--accent-rose)" />
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>Super Admin Control Panel</h2>
            <span className="badge badge-danger">Root Level Access</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "0.2rem" }}>
            Platform health monitoring, tenant business overrides, subscription MRR tracking, and AI system prompts.
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--accent-emerald)" }}>{adminData.monthlyRecurringRevenue}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>Monthly Recurring Revenue (MRR)</div>
        </div>
      </div>

      {/* Admin Quick Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.2rem" }}>
        <div className="glass-card" style={{ padding: "1.25rem", background: "var(--bg-secondary)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: "600", textTransform: "uppercase" }}>ACTIVE USERS</div>
          <div style={{ fontSize: "1.6rem", fontWeight: "800", marginTop: "0.2rem" }}>{adminData.activeUsers}</div>
        </div>
        <div className="glass-card" style={{ padding: "1.25rem", background: "var(--bg-secondary)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: "600", textTransform: "uppercase" }}>TENANT BUSINESSES</div>
          <div style={{ fontSize: "1.6rem", fontWeight: "800", marginTop: "0.2rem" }}>{adminData.totalBusinesses}</div>
        </div>
        <div className="glass-card" style={{ padding: "1.25rem", background: "var(--bg-secondary)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: "600", textTransform: "uppercase" }}>PAID SUBSCRIPTIONS</div>
          <div style={{ fontSize: "1.6rem", fontWeight: "800", marginTop: "0.2rem" }}>{adminData.activeSubscriptions}</div>
        </div>
        <div className="glass-card" style={{ padding: "1.25rem", background: "var(--bg-secondary)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: "600", textTransform: "uppercase" }}>SYSTEM UPTIME SLA</div>
          <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--accent-emerald)", marginTop: "0.2rem" }}>99.98%</div>
        </div>
      </div>

      {/* Module Overview Navigation Grid */}
      <div className="glass-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "1rem" }}>Platform Modules Overview</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { id: "users", label: "Users & Accounts", icon: Users, count: "342 Accounts" },
            { id: "businesses", label: "Tenant Businesses", icon: Building2, count: "128 Active" },
            { id: "plans", label: "Plans & Subscriptions", icon: CreditCard, count: "3 Tiers" },
            { id: "leads", label: "Global Lead DB", icon: Search, count: "1.2M Leads" },
            { id: "campaigns", label: "Email Campaign Engine", icon: Mail, count: "4,890 Sent" },
            { id: "appointments", label: "Global Appointments", icon: Calendar, count: "148 Booked" },
            { id: "kb", label: "Knowledge Base Vectors", icon: BookOpen, count: "128 Stores" },
            { id: "chat", label: "Active Chat Widgets", icon: MessageSquare, count: "112 Live" },
            { id: "receptionist", label: "AI Voice Lines", icon: PhoneCall, count: "98 Lines" }
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = activeAdminTab === m.id;

            return (
              <div
                key={m.id}
                onClick={() => setActiveAdminTab(m.id)}
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  background: isSelected ? "var(--accent-primary)" : "var(--bg-tertiary)",
                  color: isSelected ? "#ffffff" : "var(--text-main)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                  transition: "all var(--transition-fast)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Icon size={18} />
                  <span style={{ fontSize: "0.68rem", opacity: 0.85 }}>{m.count}</span>
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: "700" }}>{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Admin View Data Table */}
      <div className="glass-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "1rem" }}>
          Managing Platform Module: <span style={{ color: "var(--accent-primary)", textTransform: "capitalize" }}>{activeAdminTab}</span>
        </h3>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User / Tenant Name</th>
                <th>Business Account</th>
                <th>Plan Tier</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Global Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminData.usersList.map((usr) => (
                <tr key={usr.id}>
                  <td style={{ fontWeight: "700" }}>{usr.name}</td>
                  <td>{usr.business}</td>
                  <td>
                    <span className="badge badge-primary">{usr.plan}</span>
                  </td>
                  <td>
                    <span className="badge badge-success">{usr.status}</span>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>{usr.joined}</td>
                  <td>
                    <button
                      onClick={() => addToast("Admin Override", `Modified privileges for ${usr.name}`)}
                      className="btn-secondary"
                      style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                    >
                      Manage Account
                    </button>
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
