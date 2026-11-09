import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import heroNavLogoImg from "../../assets/wenmar-creates-logo.png";
import portalImg from "../../assets/portal_image.png";
import { TextRoll } from "../ui/text-roll";
import { Sparkles, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { verifyAndRecordVisitor, validateEmailQuality } from "../../lib/supabase";

export const EntryGateModal = () => {
  const { isEntryGateOpen, passEntryGate, closeEntryGate, visitorProfile } = useApp();

  const [email, setEmail] = useState(visitorProfile?.email || "");
  const [suggestedEmail, setSuggestedEmail] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const emailInputRef = useRef(null);
  const cardBorderRef = useRef(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const videoRef = useRef(null);

  // Auto-play continuous looping background video (no rewind)
  useEffect(() => {
    if (!isEntryGateOpen) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    const p = video.play();
    if (p !== undefined) p.catch(() => {});
  }, [isEntryGateOpen]);

  // Direct Backend Verification State
  const [isVerifying, setIsVerifying] = useState(false);

  // Floating label interaction states
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);

  const isEmailFloated = isEmailFocused || isEmailHovered || Boolean(email.trim());

  // Spotlight mouse-tracking rotating conic-gradient border (from info-card skill)
  const handleCardMouseMove = (e) => {
    const card = cardBorderRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);
    card.style.setProperty("--rotation", `${angle}rad`);
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    if (cardBorderRef.current) {
      cardBorderRef.current.style.setProperty("--rotation", "0deg");
    }
  };


  // Smart Gmail & Domain Typo Detection
  useEffect(() => {
    if (!email || !email.includes("@")) {
      setSuggestedEmail(null);
      return;
    }

    const parts = email.split("@");
    if (parts.length !== 2 || !parts[1]) {
      setSuggestedEmail(null);
      return;
    }

    const [user, domain] = parts;
    const lowerDomain = domain.toLowerCase().trim();

    const commonTypos = {
      "gamil.com": "gmail.com",
      "gmai.com": "gmail.com",
      "gmaill.com": "gmail.com",
      "gmial.com": "gmail.com",
      "gmal.com": "gmail.com",
      "gmaik.com": "gmail.com",
      "gmaik.con": "gmail.com",
      "gmail.con": "gmail.com",
      "gmai.con": "gmail.com",
      "gamil.con": "gmail.com",
      "gmaill.con": "gmail.com",
      "hotmial.com": "hotmail.com",
      "hotmai.com": "hotmail.com",
      "yaho.com": "yahoo.com",
      "yahooo.com": "yahoo.com",
      "outlok.com": "outlook.com",
      "outloo.com": "outlook.com",
      "iclud.com": "icloud.com"
    };

    if (commonTypos[lowerDomain]) {
      setSuggestedEmail(`${user}@${commonTypos[lowerDomain]}`);
    } else {
      setSuggestedEmail(null);
    }
  }, [email]);

  const applyCorrection = () => {
    if (suggestedEmail) {
      setEmail(suggestedEmail);
      setSuggestedEmail(null);
    }
  };

  const applyDomainChip = (domain) => {
    const username = email.includes("@") ? email.split("@")[0] : email;
    setEmail(`${username}${domain}`);
    setSuggestedEmail(null);
  };

  // Seamless Direct Backend Verification with Real-Time DNS MX Verification!
  const handleDirectAccess = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    const validation = validateEmailQuality(email.trim());
    if (!validation.valid) {
      setErrorMsg(validation.error);
      return;
    }

    setIsVerifying(true);

    try {
      const visitorName = email.trim().split("@")[0] || "Guest";

      // Register & record visitor directly in Supabase without intermediary card
      await verifyAndRecordVisitor(visitorName, email.trim());

      // Smooth direct transition into the website portfolio
      setIsExiting(true);
      setTimeout(() => {
        passEntryGate({ name: visitorName, email: email.trim() });
      }, 350);

    } catch (err) {
      console.error("Verification error:", err);
      setIsVerifying(false);
      setErrorMsg(err.message || "Could not verify credentials. Please check your email and try again.");
    }
  };



  if (!isEntryGateOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
        overflow: "hidden",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.03)" : "scale(1)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        overflowY: "auto"
      }}
    >
      {/* Background Video with Forward Looping (No Rewind) */}
      <video
        ref={videoRef}
        src="/login-bg.mp4?v=2"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          transform: "scale(1.02)",
          filter: "brightness(0.68) contrast(1.12)"
        }}
      />

      {/* Atmospheric Ambient Vignette Overlay (Clear for sharp video, subtle vignette for focus) */}
      <div 
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(18, 12, 9, 0.12) 0%, rgba(18, 12, 9, 0.55) 100%)",
          zIndex: 1,
          pointerEvents: "none"
        }}
      />

      {/* Centered Showcase: Transparent Glass Card with Video Background */}
      <div className="entry-gate-container animate-fade-in" style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>

        {/* Right Side: Transparent Glass Card with Cursor-Tracked Spotlight Border */}
        <div
          ref={cardBorderRef}
          onMouseMove={handleCardMouseMove}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={handleCardMouseLeave}
          style={{
            width: "100%",
            maxWidth: "470px",
            position: "relative",
            zIndex: 1,
            borderRadius: "26px",
            boxSizing: "border-box",
            cursor: "default"
          }}
        >
          {/* Spotlight Glowing Border (Masked to border perimeter only, inner remains 100% transparent glass) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "26px",
              padding: "2px",
              background: isCardHovered
                ? `conic-gradient(
                    from var(--rotation, 0deg),
                    rgba(244, 204, 151, 0.15) 0deg,
                    rgba(244, 204, 151, 0.5) 25deg,
                    #F4CC97 55deg,
                    #FFFFFF 85deg,
                    #FFF8EC 95deg,
                    #F4CC97 125deg,
                    rgba(244, 204, 151, 0.5) 155deg,
                    rgba(87, 51, 37, 0.1) 180deg,
                    rgba(244, 204, 151, 0.15) 360deg
                  )`
                : `conic-gradient(
                    from var(--rotation, 0deg),
                    #F4CC97 0deg,
                    #FFFFFF 35deg,
                    #F4CC97 70deg,
                    rgba(244, 204, 151, 0.45) 120deg,
                    rgba(87, 51, 37, 0.1) 160deg,
                    #F4CC97 200deg,
                    #FFFFFF 235deg,
                    #F4CC97 270deg,
                    rgba(244, 204, 151, 0.45) 320deg,
                    #F4CC97 360deg
                  )`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
              zIndex: 2
            }}
          />

          {/* Inner Card Container — Pure Transparent Glass */}
          <div
            style={{
              width: "100%",
              borderRadius: "24px",
              backgroundColor: "rgba(18, 12, 9, 0.42)",
              backdropFilter: "blur(24px) saturate(1.8)",
              WebkitBackdropFilter: "blur(24px) saturate(1.8)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 25px 60px rgba(0, 0, 0, 0.45)",
              padding: "2rem 1.85rem 1.75rem",
              boxSizing: "border-box",
              position: "relative",
              overflow: "hidden",
              zIndex: 1
            }}
          >
            {/* Ambient Interior Glow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "60%",
                height: "3px",
                background: "linear-gradient(90deg, transparent, rgba(244, 204, 151, 0.95), transparent)",
                borderRadius: "9999px"
              }}
            />

            {/* Brand Monogram (Without Circle, with dynamic glow) */}
            <div style={{ textAlign: "center", marginBottom: "0.95rem" }}>
              <img
                src={heroNavLogoImg}
                alt="Wenmar Creates Monogram"
                style={{
                  height: "46px",
                  width: "auto",
                  objectFit: "contain",
                  filter: isCardHovered
                    ? "drop-shadow(0 4px 14px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 20px rgba(254, 250, 223, 0.6))"
                    : "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 16px rgba(211, 163, 115, 0.4))",
                  transition: "filter 0.3s ease",
                  display: "inline-block"
                }}
              />
            </div>

            {/* Portal Image below logo */}
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <img
                src={portalImg}
                alt="Portal"
                style={{
                  maxWidth: "100%",
                  width: "220px",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 18px rgba(211,163,115,0.35))",
                  transition: "filter 0.3s ease"
                }}
              />
            </div>

            {/* Visitor Fill-Out Form */}
            <form onSubmit={handleDirectAccess} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                {/* Section Label with Always-Active 3D TextRoll Animation */}
                <div style={{ textAlign: "center", lineHeight: 1.05, marginBottom: "0.65rem" }}>
                  <div style={{ display: "inline-block", textAlign: "center" }}>
                    <div style={{
                      fontSize: "clamp(2.4rem, 7vw, 3.1rem)",
                      fontWeight: 900,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "#D3A373",
                      whiteSpace: "nowrap",
                      textShadow: "0 2px 20px rgba(211,163,115,0.35)",
                    }}>
                      <TextRoll
                        alwaysActive={true}
                        initialDelay={350}
                        loopInterval={2400}
                        duration={0.55}
                        getEnterDelay={(i) => i * 0.05}
                        getExitDelay={(i) => i * 0.05 + 0.15}
                        style={{
                          letterSpacing: "0.28em",
                          color: "#D3A373"
                        }}
                      >
                        ENTER THE
                      </TextRoll>
                    </div>
                    <div style={{
                      fontSize: "clamp(2.4rem, 7vw, 3.1rem)",
                      fontWeight: 900,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#FEFADF",
                      textShadow: "0 2px 28px rgba(211,163,115,0.55), 0 0 16px rgba(254,250,223,0.3)",
                      whiteSpace: "nowrap",
                    }}>
                      <TextRoll
                        alwaysActive={true}
                        initialDelay={650}
                        loopInterval={2400}
                        duration={0.55}
                        getEnterDelay={(i) => i * 0.05}
                        getExitDelay={(i) => i * 0.05 + 0.15}
                        style={{
                          letterSpacing: "0.14em",
                          color: "#FEFADF"
                        }}
                      >
                        PORTFOLIO
                      </TextRoll>
                    </div>
                  </div>
                </div>
                {/* Field: Email Address */}
                <div>
                  {/* Input container with floating label */}
                  <div
                    style={{ position: "relative" }}
                    onMouseEnter={() => setIsEmailHovered(true)}
                    onMouseLeave={() => setIsEmailHovered(false)}
                  >
                    <label
                      onClick={() => emailInputRef.current?.focus()}
                      style={{
                        position: "absolute",
                        left: isEmailFloated ? "0.85rem" : "1rem",
                        top: isEmailFloated ? "0" : "50%",
                        transform: "translateY(-50%)",
                        fontSize: isEmailFloated ? "0.74rem" : "0.93rem",
                        fontWeight: isEmailFloated ? "800" : "600",
                        color: isEmailFloated
                          ? "#FEFADF"
                          : "rgba(254, 250, 223, 0.72)",
                        backgroundColor: isEmailFloated ? "rgba(18, 12, 9, 0.85)" : "transparent",
                        padding: isEmailFloated ? "0 8px" : "0",
                        borderRadius: "6px",
                        border: isEmailFloated ? "1px solid rgba(211, 163, 115, 0.35)" : "none",
                        zIndex: 2,
                        cursor: "text",
                        userSelect: "none",
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        whiteSpace: "nowrap"
                      }}
                    >
                      <Mail size={isEmailFloated ? 13 : 15} color={isEmailFloated ? "#F4CC97" : "rgba(254, 250, 223, 0.75)"} />
                      <span>Your email address</span>
                    </label>

                    <input
                      ref={emailInputRef}
                      type="email"
                      value={email}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMsg) setErrorMsg("");
                      }}
                      className="form-input"
                      style={{
                        fontSize: "0.95rem",
                        padding: "0.85rem 1rem",
                        borderRadius: "14px",
                        border: isEmailFocused
                          ? "1.5px solid #F4CC97"
                          : suggestedEmail
                          ? "1.5px solid #F4CC97"
                          : isEmailHovered
                          ? "1.5px solid rgba(244, 204, 151, 0.85)"
                          : "1.5px solid rgba(244, 204, 151, 0.45)",
                        background: "rgba(255, 255, 255, 0.12)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        boxShadow: isEmailFocused
                          ? "0 0 0 3px rgba(244, 204, 151, 0.25), 0 4px 16px rgba(0, 0, 0, 0.25)"
                          : "0 2px 10px rgba(0, 0, 0, 0.2)",
                        color: "#FEFADF",
                        fontWeight: "600",
                        width: "100%",
                        transition: "border-color 0.2s ease, box-shadow 0.2s ease"
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Smart Gmail Typo Correction Pill */}
                {suggestedEmail && (
                  <div
                    className="animate-fade-in"
                    style={{
                      marginTop: "0.45rem",
                      background: "rgba(254, 250, 223, 0.12)",
                      border: "1px dashed #D3A373",
                      borderRadius: "10px",
                      padding: "0.45rem 0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem"
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", color: "#FEFADF", fontWeight: "700" }}>
                      💡 Did you mean <strong style={{ color: "#FFFFFF", textDecoration: "underline" }}>{suggestedEmail}</strong>?
                    </div>
                    <button
                      type="button"
                      onClick={applyCorrection}
                      style={{
                        background: "#FEFADF",
                        color: "#573325",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.25rem 0.65rem",
                        fontSize: "0.75rem",
                        fontWeight: "800",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                      }}
                    >
                      <Check size={12} color="#573325" /> Fix it
                    </button>
                  </div>
                )}

                {/* Quick Domain Autocomplete Chips */}
                {email && !email.includes("@") && (
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.45rem" }}>
                    {["@gmail.com", "@outlook.com", "@yahoo.com", "@icloud.com"].map((dom) => (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => applyDomainChip(dom)}
                        style={{
                          fontSize: "0.74rem",
                          fontWeight: "700",
                          background: "rgba(254, 250, 223, 0.12)",
                          border: "1px solid rgba(211, 163, 115, 0.45)",
                          color: "#FEFADF",
                          padding: "0.22rem 0.6rem",
                          borderRadius: "var(--radius-full)",
                          cursor: "pointer",
                          transition: "background 0.2s ease"
                        }}
                      >
                        +{dom}
                      </button>
                    ))}
                  </div>
                )}

                {/* Error Message */}
                {errorMsg && (
                  <div
                    className="animate-fade-in"
                    style={{
                      fontSize: "0.8rem",
                      color: "#fca5a5",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      background: "rgba(239, 68, 68, 0.18)",
                      padding: "0.45rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid rgba(239, 68, 68, 0.35)"
                    }}
                  >
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit Button & Direct Verification State */}
                <div style={{ marginTop: "0.35rem" }}>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    style={{
                      width: "100%",
                      padding: "0.9rem 1.5rem",
                      fontSize: "1.02rem",
                      fontWeight: "800",
                      letterSpacing: "0.04em",
                      justifyContent: "center",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      borderRadius: "14px",
                      cursor: isVerifying ? "not-allowed" : "pointer",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      backgroundColor: "#FEFADF",
                      backgroundImage: `
                        linear-gradient(135deg, #FFFFFF 0%, #FEFADF 50%, #EEDCAC 100%),
                        repeating-linear-gradient(45deg, rgba(87, 51, 37, 0.035) 0px, rgba(87, 51, 37, 0.035) 1px, transparent 1px, transparent 4px),
                        repeating-linear-gradient(-45deg, rgba(87, 51, 37, 0.02) 0px, rgba(87, 51, 37, 0.02) 2px, transparent 2px, transparent 5px)
                      `,
                      color: "#573325",
                      border: "1.5px solid rgba(211, 163, 115, 0.85)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 28px rgba(0, 0, 0, 0.38), 0 0 20px rgba(238, 220, 172, 0.4)";
                      e.currentTarget.style.borderColor = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.9)";
                      e.currentTarget.style.borderColor = "rgba(211, 163, 115, 0.85)";
                    }}
                  >
                    {isVerifying ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#573325" }}>
                        <Sparkles size={18} className="animate-spin" color="#573325" />
                        Entering Portfolio...
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#573325" }}>
                        <TextRoll
                          alwaysActive={false}
                          duration={0.45}
                          getEnterDelay={(i) => i * 0.02}
                          getExitDelay={(i) => i * 0.02 + 0.1}
                          style={{ color: "#573325", fontWeight: 800 }}
                        >
                          ENTER THE PORTFOLIO
                        </TextRoll>
                        <ArrowRight size={18} color="#573325" />
                      </span>
                    )}
                  </button>

                  {/* Warm, hospitable entry invitation below button */}
                  <p
                    style={{
                      margin: "0.85rem auto 0",
                      fontSize: "0.88rem",
                      fontWeight: 400,
                      color: "rgba(254, 250, 223, 0.78)",
                      letterSpacing: "0.025em",
                      lineHeight: 1.5,
                      textAlign: "center",
                      maxWidth: "360px",
                    }}
                  >
                    <span style={{ color: "#FEFADF", fontWeight: 600 }}>Welcome.</span> Kindly enter your email to step inside.
                  </p>
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};
