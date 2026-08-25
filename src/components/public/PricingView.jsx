import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Check, Sparkles, HelpCircle, ArrowRight } from "lucide-react";

export const PricingView = () => {
  const { setCurrentView, updateBillingPlan } = useApp();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "BASIC",
      monthlyPrice: "$49",
      annualPrice: "$39",
      desc: "Perfect for small local businesses starting out with AI automation.",
      features: [
        "AI Website Chat Widget",
        "AI Call Receptionist (100 mins/mo)",
        "Appointments Booking Calendar",
        "AI Knowledge Base Engine",
        "Conversation History Log",
        "Standard Email Support"
      ],
      popular: false
    },
    {
      name: "STANDARD",
      monthlyPrice: "$149",
      annualPrice: "$119",
      desc: "Everything in Basic plus verified B2B leads & cold email outreach.",
      features: [
        "Everything in Basic",
        "50 Leads Scraped / Day",
        "Verified Lead Database Access",
        "Advanced Lead Filtering",
        "Master Lead List CRM",
        "Email Campaigns (2,500/mo)",
        "AI & Manual Reply Inbox",
        "Priority 24/7 Support"
      ],
      popular: true
    },
    {
      name: "PREMIUM",
      monthlyPrice: "$399",
      annualPrice: "$319",
      desc: "For high-growth agencies & enterprises needing maximum lead scale.",
      features: [
        "Everything in Standard",
        "500 Leads Scraped / Day",
        "Advanced Lead Filtering & Scoring",
        "Advanced Multi-step Campaigns",
        "Automated AI Follow-up Sequences",
        "Advanced Analytics & Date Presets",
        "Custom Voice Neural Cloning",
        "Dedicated Account Executive"
      ],
      popular: false
    }
  ];

  const faqs = [
    { q: "Can I upgrade or downgrade my plan at any time?", a: "Yes, you can upgrade, downgrade, or cancel your subscription anytime directly in the Billing dashboard with zero penalties." },
    { q: "How does the Live Web Call AI Receptionist work?", a: "Your website visitors can start a live web call directly inside your web app or widget with instant voice AI response and zero software downloads needed." },
    { q: "Are the lead marketplace emails verified?", a: "Yes! All leads undergo real-time SMTP verification to ensure deliverability rates above 98%." },
    { q: "Is there a setup fee for training the Knowledge Base?", a: "No setup fees. You can upload PDFs, URLs, or type text into the Knowledge Base builder to index your business instantly." }
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem", display: "flex", flexDirection: "column", gap: "4rem" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "1rem" }}>
          Simple, Transparent <span className="gradient-text">Commercial Pricing</span>
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: "650px", margin: "0 auto 2rem" }}>
          Choose the tier that fits your sales volume. Scale up anytime with 14-day money-back guarantee.
        </p>

        {/* Annual / Monthly Toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.85rem", background: "var(--bg-tertiary)", padding: "0.4rem 0.6rem", borderRadius: "var(--radius-full)", border: "1px solid var(--border-color)" }}>
          <button
            onClick={() => setIsAnnual(false)}
            style={{
              padding: "0.45rem 1.1rem",
              borderRadius: "var(--radius-full)",
              background: !isAnnual ? "var(--accent-primary)" : "transparent",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: "700"
            }}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            style={{
              padding: "0.45rem 1.1rem",
              borderRadius: "var(--radius-full)",
              background: isAnnual ? "var(--accent-primary)" : "transparent",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            Annual Billing
            <span style={{ fontSize: "0.68rem", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "stretch" }}>
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: "2.2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              border: plan.popular ? "2px solid var(--accent-primary)" : "1px solid var(--border-color)",
              boxShadow: plan.popular ? "var(--shadow-glow)" : "var(--shadow-sm)"
            }}
          >
            {plan.popular && (
              <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "var(--gradient-primary)", color: "#ffffff", fontSize: "0.72rem", fontWeight: "800", padding: "0.3rem 0.9rem", borderRadius: "var(--radius-full)", letterSpacing: "0.05em" }}>
                MOST POPULAR
              </div>
            )}

            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "0.5rem" }}>{plan.name}</div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>{plan.desc}</p>
              
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "1.75rem" }}>
                <span style={{ fontSize: "2.8rem", fontWeight: "800" }} className="gradient-text">
                  {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span style={{ fontSize: "0.9rem", color: "var(--text-subtle)" }}>/ month</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                {plan.features.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.875rem", color: "var(--text-main)" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-emerald)" }}>
                      <Check size={12} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                updateBillingPlan(plan.name, isAnnual ? plan.annualPrice : plan.monthlyPrice);
                setCurrentView("billing");
              }}
              className={plan.popular ? "gradient-btn" : "btn-secondary"}
              style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}
            >
              Select {plan.name} Plan
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="glass-card" style={{ padding: "2.5rem", background: "var(--bg-secondary)" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "1.5rem", textAlign: "center" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ fontSize: "1rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <HelpCircle size={18} color="var(--accent-primary)" />
                {f.q}
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
