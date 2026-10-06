import React, { useEffect, useRef } from "react";

// Real, universally recognized tech, commerce & automation brand logos
const BRAND_LOGOS = [
  {
    id: "shopify",
    name: "Shopify",
    category: "Commerce Engine",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.78 6.46a.8.8 0 0 0-.67-.2l-2.4.45c-.2-.68-.62-1.74-1.42-2.33C14.15 3.52 13 3.6 12.3 3.84c-.33.12-.55.24-.55.24s-.2-.17-.46-.3c-.8-.4-1.83-.43-2.65-.08-.94.4-1.57 1.34-1.86 2.22l-2.73.5a.8.8 0 0 0-.64.67l-2.1 13.43a.8.8 0 0 0 .78.92h14.5a.8.8 0 0 0 .79-.92l-2.09-13.43c0-.21-.1-.4-.25-.53zM12.64 5.3c.48-.18 1.18-.21 1.83.25.54.39.84 1.13.99 1.74l-2.92.55c.02-.75.05-1.95.1-2.54zm-2.82.72c.2-.59.66-1.22 1.33-1.47.16-.06.33-.1.49-.12-.04.48-.07 1.4-.08 2.07l-2.15.4c.12-.4.26-.67.41-.88zm-2.4 1.8 1.8-.34c.03.65.09 1.63.17 2.45L7.26 10l.16-2.18zm5.2 12.18c-2.38 0-3.34-1.42-3.34-2.44 0-1.76 1.94-2.17 3.29-2.42 1.05-.2 1.48-.48 1.48-.96 0-.64-.52-1.02-1.35-1.02-.98 0-1.47.53-1.53 1.13l-1.63-.3c.22-1.25 1.25-2.22 3.12-2.22 1.8 0 3.03.92 3.03 2.4 0 1.67-1.49 2.1-2.97 2.37-1.12.2-1.8.44-1.8 1.04 0 .61.64.98 1.54.98 1.1 0 1.76-.56 1.92-1.23l1.55.45c-.38 1.3-1.55 2.24-3.3 2.24z"/>
      </svg>
    )
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Financial Infrastructure",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.54 12.832.54 6.74.54 2.82 3.738 2.82 8.766c0 5.433 5.372 6.84 8.795 8.16 2.386.918 3.356 1.64 3.356 2.651 0 .977-.872 1.512-2.263 1.512-2.392 0-5.32-1.144-7.218-2.296l-.914 5.613c1.782 1.033 4.887 1.694 8.077 1.694 6.29 0 10.38-2.955 10.38-8.196 0-5.528-5.374-7.147-9.057-8.754z"/>
      </svg>
    )
  },
  {
    id: "ghl",
    name: "GoHighLevel",
    category: "CRM & Automations",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    id: "zapier",
    name: "Zapier",
    category: "Workflow Automation",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.875 0h2.25v8.625h-2.25V0zm0 15.375h2.25V24h-2.25v-8.625zM0 10.875h8.625v2.25H0v-2.25zm15.375 0H24v2.25h-8.625v-2.25zM4.382 3.033l1.591-1.591 6.099 6.099-1.591 1.591-6.099-6.099zm13.546 13.546l1.591-1.591 6.099 6.099-1.591 1.591-6.099-6.099zm-1.591-15.137l1.591 1.591-6.099 6.099-1.591-1.591 6.099-6.099zM2.791 19.387l1.591-1.591 6.099 6.099-1.591 1.591-6.099-6.099z"/>
      </svg>
    )
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Inbound Marketing",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.885 8.192a3.81 3.81 0 0 0-3.327-2.023c-.354 0-.69.054-1.01.144V3.886A2.887 2.887 0 1 0 12.062 1v5.32c-.31-.087-.639-.14-.981-.14a3.818 3.818 0 0 0-3.33 2.012 3.8 3.8 0 0 0-.256 3.092l-4.7 4.7a2.384 2.384 0 1 0 1.69 1.69l4.72-4.72a3.834 3.834 0 0 0 3.064.24V19.5a2.5 2.5 0 1 0 2.484 0v-4.3a3.834 3.834 0 0 0 3.832-3.82c0-1.222-.572-2.313-1.464-3.008zM12 10.825a1.825 1.825 0 1 1 0-3.65 1.825 1.825 0 0 1 0 3.65z"/>
      </svg>
    )
  },
  {
    id: "webflow",
    name: "Webflow",
    category: "Visual Development",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.998 6.425a6.438 6.438 0 0 0-4.889-2.378c-3.111 0-5.111 2.022-6.111 4.511-1-.444-2.111-.711-3.222-.711-3.556 0-5.778 2.578-6.667 6.133l4.333.622c.444-1.867 1.444-3.111 2.889-3.111.889 0 1.556.444 1.889 1.289l-4.111 7.156h4.556l2.111-4.044 2 4.044h4.444l-3.333-6.4 1.333-2.489c.333-.622.889-1.022 1.667-1.022.889 0 1.556.533 1.889 1.467l-2.667 5.156h4.444l2.444-10.222z"/>
      </svg>
    )
  },
  {
    id: "openai",
    name: "OpenAI",
    category: "Generative AI",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.937a4.485 4.485 0 0 1 2.366-1.973V12.6a.766.766 0 0 0 .388.677l5.815 3.355-2.02 1.169a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 8.937zm16.899 3.02l-5.842-3.37 2.02-1.164a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.403-.684zm2.015-3.024l-.14-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.709 9.455V7.123a.08.08 0 0 1 .033-.061l4.84-2.796a4.5 4.5 0 0 1 6.673 4.743zM8.306 13.88l2.03-1.17 4.195 2.42-2.03 1.172-4.196-2.422zm1.66-4.945l4.196-2.42 2.03 1.17-4.196 2.42-2.03-1.17zm4.196 3.65l-2.03-1.17v-4.843l2.03 1.172v4.841z"/>
      </svg>
    )
  },
  {
    id: "notion",
    name: "Notion",
    category: "Knowledge OS",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.644c-.466-.373-.98-.653-2.146-.56L2.92 2.063c-.42.047-.513.28-.373.42l1.912 1.725zm-.28 3.545v13.541c0 .746.42 1.026 1.213.98l14.195-.84c.793-.047.933-.513.933-1.026V6.867c0-.56-.233-.84-.746-.793L5.066 6.96c-.607.047-.887.28-.887.793zm13.122 1.353c.093.42 0 .84-.42.887l-1.073.233v8.724c-.56.326-1.26.513-1.726.513-.793 0-1.073-.233-1.726-1.073l-4.246-6.625v6.392l1.493.373s0 .7-.887.7l-2.66-.046c-.093-.327.14-.654.513-.747l1.167-.327V9.76l-1.447-.14c-.093-.373.14-.793.653-.84l2.94-.187 4.526 6.812V9.34l-1.353-.14c-.093-.42.233-.747.747-.793l2.566-.14z"/>
      </svg>
    )
  },
  {
    id: "slack",
    name: "Slack",
    category: "Team Messaging",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    )
  },
  {
    id: "figma",
    name: "Figma",
    category: "Interface Design",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm-8 8a4 4 0 0 1 4-4h4v4a4 4 0 0 1-8 0zm0-8a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zm0-8a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zm8-4h4a4 4 0 1 1 0 8h-4V0z"/>
      </svg>
    )
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Backend & Database",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.32 14.242a.792.792 0 0 0 .616 1.284H12v8.958a.396.396 0 0 0 .716.233l10.964-14.079a.792.792 0 0 0-.616-1.284z"/>
      </svg>
    )
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "Frontend Cloud",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 22.525H0l12-21.05 12 21.05z" />
      </svg>
    )
  }
];

export const BrandMarquee = () => {
  // Duplicate list twice to ensure seamless, infinite CSS animation loop
  const duplicatedLogos = [...BRAND_LOGOS, ...BRAND_LOGOS];
  const velocityTrackRef = useRef(null);

  useEffect(() => {
    let lastScrollY = window.scrollY || 0;
    let velocityOffset = 0;
    let targetOffset = 0;
    let animId;

    const onScroll = () => {
      const currentScrollY = window.scrollY || 0;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // When scrolling down, shift slightly left (-delta * 0.4); when scrolling up, shift right
      targetOffset += delta * -0.4;
      // Clamp within subtle, comfortable bounds (-90px to +90px)
      targetOffset = Math.max(-90, Math.min(90, targetOffset));
    };

    const updateInertia = () => {
      // Smooth lerping with momentum decay back to rest
      velocityOffset += (targetOffset - velocityOffset) * 0.085;
      targetOffset *= 0.93; // Exponential decay

      if (velocityTrackRef.current) {
        velocityTrackRef.current.style.transform = `translate3d(${velocityOffset.toFixed(2)}px, 0, 0)`;
      }

      animId = requestAnimationFrame(updateInertia);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    animId = requestAnimationFrame(updateInertia);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="brand-marquee-section" aria-label="Partner Brands and Social Proof">
      <div className="brand-marquee-inner">
        {/* Header Statement: 3-line layout */}
        <div className="brand-marquee-header">
          <h2 className="brand-marquee-title">
            Creating with <span className="brand-marquee-highlight">50+</span><br />
            brands built to grow
          </h2>

          <p className="brand-marquee-subtitle">
            <span>And counting</span>
            <span className="brand-marquee-sparkle" aria-hidden="true">✦</span>
          </p>
        </div>

        {/* Continuous Infinite Logo Marquee with Scroll-Velocity Inertia Wrapper */}
        <div className="brand-marquee-mask">
          <div 
            ref={velocityTrackRef} 
            style={{ display: "flex", width: "100%", willChange: "transform" }}
          >
            <div className="brand-marquee-track">
              {duplicatedLogos.map((brand, index) => (
                <div 
                  key={`${brand.id}-${index}`} 
                  className="brand-marquee-item"
                  title={brand.name}
                >
                  <span className="brand-marquee-icon" aria-hidden="true">
                    {brand.icon}
                  </span>
                  <span className="brand-marquee-name">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
