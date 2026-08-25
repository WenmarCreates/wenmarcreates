import React from "react";
import { useApp } from "../../context/AppContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.75rem",
        right: "1.75rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.65rem",
        maxWidth: "380px",
        pointerEvents: "none"
      }}
    >
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderColor = "rgba(16, 185, 129, 0.4)";
        let iconColor = "var(--accent-emerald)";

        if (toast.type === "info") {
          Icon = Info;
          borderColor = "rgba(99, 102, 241, 0.4)";
          iconColor = "var(--accent-primary)";
        } else if (toast.type === "warning" || toast.type === "error") {
          Icon = AlertCircle;
          borderColor = "rgba(244, 63, 94, 0.4)";
          iconColor = "var(--accent-rose)";
        }

        return (
          <div
            key={toast.id}
            className="glass-card animate-fade-in"
            style={{
              padding: "0.85rem 1rem",
              background: "var(--bg-secondary)",
              borderLeft: `4px solid ${iconColor}`,
              borderTop: "1px solid var(--border-color)",
              borderRight: "1px solid var(--border-color)",
              borderBottom: "1px solid var(--border-color)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              pointerEvents: "auto"
            }}
          >
            <Icon size={20} color={iconColor} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-main)" }}>
                {toast.title}
              </div>
              {toast.message && (
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: "var(--text-subtle)", padding: "2px" }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
