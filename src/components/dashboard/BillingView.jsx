import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CreditCard, Check, Sparkles, AlertCircle, ArrowRight, XCircle, ShieldCheck, RefreshCw, Lock } from "lucide-react";
import { Modal } from "../common/Modal";

export const BillingView = () => {
  const { billing, updateBillingPlan, addToast } = useApp();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateCardModal, setShowUpdateCardModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("Too expensive for current volume");
  const [isCancelled, setIsCancelled] = useState(false);

  // Card State
  const [cardDetails, setCardDetails] = useState({
    name: "APEX DIGITAL INC",
    number: "•••• •••• •••• 4242",
    expiry: "12/28",
    cvv: "•••",
    brand: "VISA"
  });

  const planTiers = [
    {
      name: "Basic",
      price: "$49/mo",
      desc: "Small business AI starter package",
      features: [
        "AI Website Chat Widget",
        "AI Call Receptionist",
        "Appointments Booking",
        "AI Knowledge Base Engine",
        "Conversation History"
      ]
    },
    {
      name: "Standard",
      price: "$149/mo",
      desc: "Our most popular growth plan with leads & email campaigns",
      features: [
        "Everything in Basic",
        "50 Leads Scraped / Day",
        "Verified Lead Database Access",
        "Advanced Lead Filtering",
        "Master Lead List CRM",
        "Email Outreach Campaigns",
        "AI & Manual Reply Inbox"
      ]
    },
    {
      name: "Premium",
      price: "$399/mo",
      desc: "For high-volume enterprise outreach & custom voice engines",
      features: [
        "Everything in Standard",
        "500 Leads Scraped / Day",
        "Advanced Lead Filtering & Scoring",
        "Multi-step Advanced Campaigns",
        "Automated AI Follow-up Sequences",
        "Advanced Analytics & Preset Reports",
        "Dedicated Account Manager"
      ]
    }
  ];

  const handleConfirmCancel = () => {
    setIsCancelled(true);
    setShowCancelModal(false);
    addToast(
      "Subscription Cancelled",
      `Your ${billing.currentPlan} plan will remain active until ${billing.nextBillingDate}. No further charges will occur.`,
      "warning"
    );
  };

  const handleUpdateCardSubmit = (e) => {
    e.preventDefault();
    setShowUpdateCardModal(false);
    addToast("Payment Method Updated", "Your default credit card was updated successfully.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* 2-COLUMN TOP BANNER: Current Plan Summary (Left) + Virtual Credit Card (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        
        {/* LEFT CARD: Active Subscription Info & Cancel Button */}
        <div className="glass-card" style={{ padding: "2rem", background: "var(--bg-secondary)", border: "1px solid var(--border-highlight)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)" }}>Active Subscription</h2>
              <span className={`badge ${isCancelled ? "badge-danger" : "badge-success"}`} style={{ fontSize: "0.825rem", padding: "0.35rem 0.8rem" }}>
                <Sparkles size={14} /> {isCancelled ? "Cancellation Pending" : `${billing.currentPlan} Active`}
              </span>
            </div>
            
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "0.35rem" }}>
              {billing.amount} <span style={{ fontSize: "0.9rem", color: "var(--text-subtle)", fontWeight: "600" }}>/ {billing.billingCycle}</span>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              {isCancelled ? (
                <>Your subscription will expire on <strong>{billing.nextBillingDate}</strong>. You can reactivate anytime.</>
              ) : (
                <>Renews automatically on <strong>{billing.nextBillingDate}</strong>. Includes 50 daily lead credits & WebRTC voice assistant.</>
              )}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
            {!isCancelled ? (
              <button 
                onClick={() => setShowCancelModal(true)} 
                style={{ 
                  padding: "0.6rem 1.25rem", 
                  borderRadius: "var(--radius-md)", 
                  background: "rgba(244, 63, 94, 0.15)", 
                  color: "var(--accent-rose)", 
                  border: "1px solid rgba(244, 63, 94, 0.3)", 
                  fontSize: "0.85rem", 
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <XCircle size={16} /> Cancel Subscription
              </button>
            ) : (
              <button 
                onClick={() => {
                  setIsCancelled(false);
                  addToast("Subscription Restored", `Re-activated ${billing.currentPlan} plan subscription.`);
                }} 
                className="btn-denim"
                style={{ fontSize: "0.85rem", padding: "0.6rem 1.25rem" }}
              >
                <RefreshCw size={16} /> Reactivate Subscription
              </button>
            )}
          </div>
        </div>

        {/* RIGHT CARD: Visual Virtual Credit Card Display */}
        <div className="glass-card" style={{ padding: "2rem", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-main)" }}>Saved Payment Method</h3>
            <button 
              onClick={() => setShowUpdateCardModal(true)}
              className="btn-secondary"
              style={{ fontSize: "0.78rem", padding: "0.35rem 0.75rem" }}
            >
              Update Card
            </button>
          </div>

          {/* ULTRA-PREMIUM VIRTUAL CREDIT CARD VISUAL */}
          <div 
            style={{ 
              borderRadius: "18px", 
              padding: "1.4rem 1.5rem", 
              width: "100%",
              maxWidth: "350px",
              height: "215px",
              margin: "0 auto",
              background: "#1c120c",
              backgroundImage: `
                radial-gradient(circle at 85% 15%, rgba(211, 163, 115, 0.4) 0%, transparent 55%),
                linear-gradient(135deg, rgba(87, 51, 37, 0.95) 0%, rgba(28, 18, 12, 0.98) 60%, rgba(211, 163, 115, 0.3) 100%),
                repeating-linear-gradient(45deg, rgba(254, 250, 223, 0.05) 0px, rgba(254, 250, 223, 0.05) 1px, transparent 1px, transparent 4px),
                repeating-linear-gradient(-45deg, rgba(254, 250, 223, 0.03) 0px, rgba(254, 250, 223, 0.03) 2px, transparent 2px, transparent 5px)
              `,
              color: "#FEFADF", 
              boxShadow: "0 18px 40px rgba(28, 18, 12, 0.45), inset 0 1px 1px rgba(254, 250, 223, 0.35)", 
              border: "1px solid rgba(211, 163, 115, 0.45)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Specular Light Flare Overlay */}
            <div 
              style={{ 
                position: "absolute", 
                top: "-50%", 
                left: "-50%", 
                width: "200%", 
                height: "200%", 
                background: "radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)", 
                pointerEvents: "none" 
              }} 
            />

            {/* Top Row: Brand & Wireless Symbol */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: "900", letterSpacing: "1.5px", color: "#D3A373", textTransform: "uppercase", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                AayStyle Commercial Card
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Wireless Contactless Icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D3A373" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
                </svg>
              </div>
            </div>

            {/* Middle Row: EMV Chip & Metallic Details */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", zIndex: 1, margin: "0.25rem 0" }}>
              {/* EMV Microchip */}
              <div 
                style={{ 
                  width: "44px", 
                  height: "32px", 
                  borderRadius: "6px", 
                  background: "linear-gradient(135deg, #f5d061 0%, #e6b847 40%, #b8860b 100%)", 
                  border: "1px solid rgba(87, 51, 37, 0.6)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.4)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <div style={{ width: "70%", height: "1px", background: "rgba(87, 51, 37, 0.5)", position: "absolute", top: "33%" }}></div>
                <div style={{ width: "70%", height: "1px", background: "rgba(87, 51, 37, 0.5)", position: "absolute", bottom: "33%" }}></div>
                <div style={{ width: "1px", height: "100%", background: "rgba(87, 51, 37, 0.5)", position: "absolute", left: "50%" }}></div>
              </div>

              {/* NFC Pay Icon Badge */}
              <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "rgba(254, 250, 223, 0.65)", letterSpacing: "1px" }}>
                NFC READY
              </div>
            </div>

            {/* Embossed Card Number */}
            <div 
              style={{ 
                fontFamily: "'Courier New', Courier, monospace", 
                fontSize: "1.35rem", 
                fontWeight: "800", 
                letterSpacing: "4px", 
                color: "#FEFADF", 
                textShadow: "0 2px 4px rgba(0,0,0,0.9), 0 0 2px rgba(211, 163, 115, 0.5)",
                zIndex: 1
              }}
            >
              {cardDetails.number}
            </div>

            {/* Bottom Row: Holder, Expiry & Visa Logo */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 1 }}>
              <div>
                <div style={{ fontSize: "0.625rem", color: "#D3A373", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>CARDHOLDER</div>
                <div style={{ fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", color: "#FEFADF", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                  {cardDetails.name}
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.625rem", color: "#D3A373", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>EXPIRES</div>
                <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#FEFADF", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                  {cardDetails.expiry}
                </div>
              </div>

              {/* VISA Metallic Logo */}
              <div style={{ fontSize: "1.25rem", fontWeight: "900", fontStyle: "italic", letterSpacing: "1px", color: "#FEFADF", textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}>
                VISA
              </div>
            </div>

          </div>

          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "var(--text-subtle)" }}>
            <ShieldCheck size={16} color="var(--accent-emerald)" />
            <span>Stripe Encrypted • 256-Bit SSL PCI Compliance</span>
          </div>
        </div>

      </div>

      {/* Usage Indicators */}
      <div className="glass-card" style={{ padding: "1.75rem", background: "var(--bg-secondary)" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "1.25rem" }}>Plan Limits & Daily Usage</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.4rem" }}>
              <span>Leads Scraped Today</span>
              <span>{billing.usage.leadsToday} / {billing.usage.leadsLimit}</span>
            </div>
            <div style={{ height: "10px", borderRadius: "var(--radius-full)", background: "var(--bg-tertiary)", overflow: "hidden" }}>
              <div style={{ width: `${(billing.usage.leadsToday / billing.usage.leadsLimit) * 100}%`, height: "100%", background: "#573325" }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.4rem" }}>
              <span>AI Web Voice Call Minutes</span>
              <span>{billing.usage.aiCallsThisMonth} / {billing.usage.aiCallsLimit} mins</span>
            </div>
            <div style={{ height: "10px", borderRadius: "var(--radius-full)", background: "var(--bg-tertiary)", overflow: "hidden" }}>
              <div style={{ width: `${(billing.usage.aiCallsThisMonth / billing.usage.aiCallsLimit) * 100}%`, height: "100%", background: "var(--accent-primary)" }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.4rem" }}>
              <span>Cold Emails Sent</span>
              <span>{billing.usage.emailCampaignsSent} / {billing.usage.emailLimit}</span>
            </div>
            <div style={{ height: "10px", borderRadius: "var(--radius-full)", background: "var(--bg-tertiary)", overflow: "hidden" }}>
              <div style={{ width: `${(billing.usage.emailCampaignsSent / billing.usage.emailLimit) * 100}%`, height: "100%", background: "var(--accent-emerald)" }}></div>
            </div>
          </div>

        </div>
      </div>

      {/* Plan Tiers Selection */}
      <h3 style={{ fontSize: "1.2rem", fontWeight: "800" }}>Upgrade or Switch Subscription Tier</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem" }}>
        {planTiers.map((tier, idx) => {
          const isCurrent = billing.currentPlan.toLowerCase() === tier.name.toLowerCase();

          return (
            <div key={idx} className="glass-card" style={{ padding: "1.75rem", background: "var(--bg-secondary)", border: isCurrent ? "2px solid #573325" : "1px solid var(--border-color)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.25rem" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "800" }}>{tier.name}</h4>
                  {isCurrent && <span className="badge badge-primary">Current Plan</span>}
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "0.5rem" }}>{tier.price}</div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginBottom: "1rem" }}>{tier.desc}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {tier.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem" }}>
                      <Check size={14} color="var(--accent-emerald)" /> {f}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  updateBillingPlan(tier.name, tier.price);
                  setIsCancelled(false);
                }}
                disabled={isCurrent}
                className={isCurrent ? "btn-secondary" : "btn-denim"}
                style={{ width: "100%", justifyContent: "center", padding: "0.65rem" }}
              >
                {isCurrent ? "Active Plan" : `Switch to ${tier.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* CANCEL SUBSCRIPTION RETENTION MODAL */}
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Subscription">
        <div style={{ padding: "0.5rem 0" }}>
          
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem" }}>
              <AlertCircle size={28} />
            </div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: "800" }}>Are you sure you want to cancel?</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
              You will lose access to 50 daily lead scrapes, WebRTC voice calls, and automated email campaigns at the end of your billing cycle.
            </p>
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label className="form-label" style={{ fontWeight: "700" }}>Please select a reason for cancelling:</label>
            <select 
              className="form-select"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            >
              <option>Too expensive for current volume</option>
              <option>Missing a specific feature</option>
              <option>Switching to another platform</option>
              <option>Temporarily pausing business operations</option>
              <option>Technical difficulty setting up</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
            <button 
              onClick={handleConfirmCancel} 
              style={{ width: "100%", padding: "0.75rem", background: "var(--accent-rose)", color: "#ffffff", border: "none", borderRadius: "var(--radius-md)", fontWeight: "800", cursor: "pointer" }}
            >
              Confirm Cancel Subscription
            </button>

            <button 
              onClick={() => setShowCancelModal(false)} 
              className="btn-denim" 
              style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}
            >
              Keep My Active Subscription
            </button>
          </div>

        </div>
      </Modal>

      {/* UPDATE CREDIT CARD MODAL */}
      <Modal isOpen={showUpdateCardModal} onClose={() => setShowUpdateCardModal(false)} title="Update Credit Card Payment Method">
        <form onSubmit={handleUpdateCardSubmit}>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Cardholder Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Card Number</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                required
                className="form-input"
                placeholder="4242 •••• •••• 4242"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              />
              <CreditCard size={18} color="var(--text-subtle)" style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          <div className="form-row" style={{ marginBottom: "1.5rem" }}>
            <div className="form-group">
              <label className="form-label">Expiry Date (MM/YY)</label>
              <input
                type="text"
                required
                placeholder="12/28"
                className="form-input"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">CVV Security Code</label>
              <input
                type="password"
                required
                maxLength="4"
                placeholder="123"
                className="form-input"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-denim" style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}>
            <Lock size={16} /> Save New Credit Card Method
          </button>
        </form>
      </Modal>

    </div>
  );
};
