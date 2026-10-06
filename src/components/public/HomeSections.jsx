import React, { useRef, useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRight, Zap, Code2, Settings, Database, ChevronUp, ChevronDown, Layers } from "lucide-react";
import wenmarSeatedImg from "../../assets/wenmar-seated.png";
import wenmarPortraitImg from "../../assets/wenmar-confident-suit.png";

/* useInView hook */
function useInView(threshold) {
  var thr = threshold !== undefined ? threshold : 0.15;
  var ref = useRef(null);
  var state = useState(false);
  var inView = state[0];
  var setInView = state[1];
  useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) { setInView(true); observer.disconnect(); }
      },
      { threshold: thr }
    );
    observer.observe(el);
    return function () { observer.disconnect(); };
  }, [thr]);
  return [ref, inView];
}

/* ── SECTION 1: PROJECTS (6 per category, 18 total) ── */
var projects = [
  /* Web dev (6 projects) */
  {
    id: "01",
    title: "SaaS Launch Platform & Funnel",
    categoryKey: "web_dev",
    category: "Web dev",
    tags: ["REACT / NEXT.JS", "STRIPE CHECKOUT", "FAST ONBOARDING"],
    description: "High-converting web application with interactive pricing calculator, instant product tour, and frictionless multi-tier subscription onboarding.",
  },
  {
    id: "02",
    title: "Agency Client Hub & Portal",
    categoryKey: "web_dev",
    category: "Web dev",
    tags: ["FULL-STACK REACT", "CLIENT DASHBOARD", "LIVE METRICS"],
    description: "Custom client portal featuring live project tracking, automated invoice generation, secure asset delivery, and multi-user team approvals.",
  },
  {
    id: "03",
    title: "Luxury Brand Commerce Engine",
    categoryKey: "web_dev",
    category: "Web dev",
    tags: ["HEADLESS COMMERCE", "CUSTOM MOTION", "SEO ENGINE"],
    description: "Bespoke digital storefront with fluid micro-interactions, sub-second product filtering, and conversion-optimized mobile checkout architecture.",
  },
  {
    id: "04",
    title: "Executive Portfolio & Booking Hub",
    categoryKey: "web_dev",
    category: "Web dev",
    tags: ["NEXT.JS APP", "DYNAMIC CMS", "INSTANT CALENDAR"],
    description: "High-end brand presence featuring custom CMS case studies, automated client vetting, and direct calendar integration.",
  },
  {
    id: "05",
    title: "Membership & Video Community Hub",
    categoryKey: "web_dev",
    category: "Web dev",
    tags: ["AUTH & ACCESS", "STREAMING UI", "RECURRING BILLING"],
    description: "Protected video learning ecosystem with member progress tracking, recurring subscription billing, and private client discussion channels.",
  },
  {
    id: "06",
    title: "Real-Time Analytics Dashboard",
    categoryKey: "web_dev",
    category: "Web dev",
    tags: ["DATA VISUALIZATION", "API ENGINE", "LIVE WEBSOCKETS"],
    description: "Executive KPI command center visualizing revenue metrics, conversion rates, and pipeline velocity with sub-second real-time sync.",
  },

  /* Automations (6 projects) */
  {
    id: "07",
    title: "Cross-Platform Workflow Engine",
    categoryKey: "automations",
    category: "Automations",
    tags: ["ZAPIER / MAKE", "API WEBHOOKS", "ZERO MANUAL WORK"],
    description: "Multi-platform business automation connecting CRM, payment gateway, Slack alerts, and Google Sheets — eliminating 35+ hours of manual work weekly.",
  },
  {
    id: "08",
    title: "Smart Lead Routing & AI Triage",
    categoryKey: "automations",
    category: "Automations",
    tags: ["AI LEAD SCORING", "INSTANT DISPATCH", "SMS / EMAIL"],
    description: "Instant qualification engine that scores inbound inquiries in under 3 seconds, routes priority leads, and fires instant customized reply sequences.",
  },
  {
    id: "09",
    title: "Automated Billing & Dunning Matrix",
    categoryKey: "automations",
    category: "Automations",
    tags: ["REVENUE RECOVERY", "WEBHOOK LISTENERS", "PAYMENT FLOWS"],
    description: "Automated recovery pipeline for failed subscription charges with smart retry schedules, customized recovery emails, and churn reduction.",
  },
  {
    id: "10",
    title: "Zero-Touch Client Onboarding Flow",
    categoryKey: "automations",
    category: "Automations",
    tags: ["AUTO INVOICING", "CONTRACT SIGNING", "DRIVE SETUP"],
    description: "Triggered onboarding workflow that issues contracts, handles initial invoicing, provisions shared drives, and queues kickoff tasks upon deal win.",
  },
  {
    id: "11",
    title: "Multi-Channel Content Distribution",
    categoryKey: "automations",
    category: "Automations",
    tags: ["CONTENT SYNC", "AIRTABLE API", "CROSS-POSTING"],
    description: "Airtable-driven automation system that formats, approves, and automatically pushes marketing assets across social channels seamlessly.",
  },
  {
    id: "12",
    title: "Enriched Inbound Prospect Pipeline",
    categoryKey: "automations",
    category: "Automations",
    tags: ["DATA ENRICHMENT", "WEBHOOKS", "CRM SYNC"],
    description: "Lead enrichment pipeline automatically appending verified contact data, company size, and revenue signals before handing off to sales reps.",
  },

  /* GHL (6 projects) */
  {
    id: "13",
    title: "Complete GHL Agency Ecosystem",
    categoryKey: "ghl",
    category: "GHL",
    tags: ["GHL ARCHITECTURE", "SNAPSHOTS", "CUSTOM PIPELINES"],
    description: "Full GoHighLevel setup with multi-stage opportunity pipelines, calendar booking workflows, tag triggers, and dynamic custom field mapping.",
  },
  {
    id: "14",
    title: "High-Converting GHL Booking Funnel",
    categoryKey: "ghl",
    category: "GHL",
    tags: ["GHL CALENDAR", "2-STEP FUNNEL", "SMS REMINDERS"],
    description: "High-ticket sales appointment funnel built inside GHL with automated round-robin routing and intelligent SMS reminders that slashed no-shows by 70%.",
  },
  {
    id: "15",
    title: "Omnichannel Lead Nurture Matrix",
    categoryKey: "ghl",
    category: "GHL",
    tags: ["GHL WORKFLOWS", "TWO-WAY SMS", "DYNAMIC TAGGING"],
    description: "Behavior-driven GoHighLevel nurture sequence adapting to contact replies across Email, SMS, Voicemail drops, and automated team reminders.",
  },
  {
    id: "16",
    title: "Reputation & 5-Star Review Machine",
    categoryKey: "ghl",
    category: "GHL",
    tags: ["REVIEW AUTOMATION", "GOOGLE REPUTATION", "SMS FUNNEL"],
    description: "Automated customer sentiment filter routing happy customers directly to Google Reviews while catching feedback before it goes public.",
  },
  {
    id: "17",
    title: "Dormant Database Reactivation Engine",
    categoryKey: "ghl",
    category: "GHL",
    tags: ["DATABASE REVIVAL", "CONVERSATION AI", "PIPELINE RECOVERY"],
    description: "GoHighLevel campaign targeting inactive subscriber lists, triggering conversational SMS replies and booking high-intent appointments.",
  },
  {
    id: "18",
    title: "Multi-Location Franchise GHL Snapshot",
    categoryKey: "ghl",
    category: "GHL",
    tags: ["MULTI-LOCATION", "CUSTOM VALUES", "CENTRALIZED CRM"],
    description: "Scalable agency snapshot deploying identical, location-customized funnels and automation sets across multiple sub-accounts in minutes.",
  },
];

var FILTER_OPTIONS = [
  { key: "all", label: "All Projects" },
  { key: "web_dev", label: "Web dev" },
  { key: "automations", label: "Automations" },
  { key: "ghl", label: "GHL" },
];

function ProjectCard(props) {
  var project = props.project;
  var index = props.index;
  var onSelect = props.onSelect;
  var result = useInView(0.08);
  var cardRef = result[0];
  var cardInView = result[1];

  return (
    <div
      ref={cardRef}
      className="wm-project-card wm-project-grid-card"
      onClick={function () { if (onSelect) onSelect(); }}
      style={{
        opacity: cardInView ? 1 : 0,
        transform: cardInView ? "translateY(0)" : "translateY(25px)",
        transition: "opacity 0.45s ease " + Math.min((index % 6) * 0.08, 0.4) + "s, transform 0.45s ease " + Math.min((index % 6) * 0.08, 0.4) + "s",
      }}
      role="button"
      tabIndex={0}
      onKeyDown={function (e) { if (e.key === "Enter" && onSelect) onSelect(); }}
      aria-label={"View project details for " + project.title}
    >
      <span className="wm-project-card-number">{project.id}</span>
      <div className="wm-project-card-tags">
        {project.tags.map(function (t) { return <span key={t} className="wm-project-tag">{t}</span>; })}
      </div>
      <h3 className="wm-project-card-title">{project.title}</h3>
      <p className="wm-project-card-desc">{project.description}</p>
      <div className="wm-project-card-footer">
        <span className="wm-project-cat">{project.category}</span>
        <span className="wm-project-action-link">
          <span>Consult on this</span>
          <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}

export function SectionProjects() {
  var result = useInView(0.2);
  var headRef = result[0];
  var headInView = result[1];
  var app = useApp();
  var openDemoModal = app.openDemoModal;

  var filterState = useState("all");
  var activeFilter = filterState[0];
  var setActiveFilter = filterState[1];

  var scrollRef = useRef(null);

  var filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(function (p) { return p.categoryKey === activeFilter; });

  function handleFilterChange(key) {
    setActiveFilter(key);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleScroll(direction) {
    if (scrollRef.current) {
      var scrollAmount = 300;
      scrollRef.current.scrollBy({
        top: direction === "up" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }

  return (
    <section className="wm-projects-section" id="work-section">
      <div className="wm-container">
        <div ref={headRef} className="wm-projects-header"
          style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
          <div className="wm-section-eyebrow">
            <span className="wm-eyebrow-num">01</span>
            <span className="wm-eyebrow-slash">/</span>
            <span className="wm-eyebrow-label">MY PREVIOUS PROJECTS</span>
          </div>
          <div className="wm-projects-headline-wrap">
            <h2 className="wm-projects-headline">
              work that does<br />
              <span className="text-denim-red">it&apos;s d*mn job.</span>
            </h2>
          </div>
        </div>

        {/* Architectural Slanted Container Structure */}
        <div className="wm-projects-architectural-frame">
          {/* Outside Controls Bar: Web dev, Automations, GHL floating outside above the container */}
          <div className="wm-outside-controls-bar">
            <div className="wm-outside-pills" role="tablist" aria-label="Filter projects by category">
              {FILTER_OPTIONS.filter(function (f) { return f.key !== "all"; }).map(function (f) {
                var isSelected = activeFilter === f.key;
                var count = projects.filter(function (p) { return p.categoryKey === f.key; }).length;
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={"wm-filter-pill wm-outside-pill " + (isSelected ? "is-active" : "")}
                    onClick={function () { handleFilterChange(f.key); }}
                  >
                    <span>{f.label}</span>
                    <span className="wm-filter-pill-count">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="wm-outside-nav-controls">
              <div className="wm-project-archive-count-tag">
                <span className="wm-archive-dot" />
                <span>{filteredProjects.length} PROJECTS</span>
              </div>
              {filteredProjects.length > 6 && (
                <div className="wm-projects-scroll-arrows">
                  <button
                    type="button"
                    className="wm-scroll-arrow-btn"
                    onClick={function () { handleScroll("up"); }}
                    aria-label="Scroll projects up"
                    title="Scroll up"
                  >
                    <ChevronUp size={18} />
                  </button>
                  <button
                    type="button"
                    className="wm-scroll-arrow-btn"
                    onClick={function () { handleScroll("down"); }}
                    aria-label="Scroll projects down"
                    title="Scroll down"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Unified Seamless Red Denim Container with Slanted Cutoff */}
          <div className="wm-projects-container-frame">
            {/* Architectural Border Elements that trace the exact polygon */}
            <div className="wm-architectural-borders" aria-hidden="true">
              <span className="wm-border-tab-top" />
              <div className="wm-border-slant">
                <svg viewBox="0 0 45 54" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="45" y2="54" stroke="#D3A373" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="wm-border-roof-top" />
              <span className="wm-border-left" />
              <span className="wm-border-right" />
              <span className="wm-border-bottom" />
              <div className="wm-chamfer-tl"><svg viewBox="0 0 16 16"><line x1="0" y1="16" x2="16" y2="0" stroke="#D3A373" strokeWidth="1.5" /></svg></div>
              <div className="wm-chamfer-tr"><svg viewBox="0 0 18 18"><line x1="0" y1="0" x2="18" y2="18" stroke="#D3A373" strokeWidth="1.5" /></svg></div>
              <div className="wm-chamfer-br"><svg viewBox="0 0 20 20"><line x1="20" y1="0" x2="0" y2="20" stroke="#D3A373" strokeWidth="1.5" /></svg></div>
              <div className="wm-chamfer-bl"><svg viewBox="0 0 20 20"><line x1="0" y1="0" x2="20" y2="20" stroke="#D3A373" strokeWidth="1.5" /></svg></div>
            </div>

            {/* Embedded "All Projects" Tab inside the raised peak */}
            <div className="wm-embedded-all-tab">
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === "all"}
                className={"wm-filter-pill wm-peak-pill " + (activeFilter === "all" ? "is-active" : "")}
                onClick={function () { handleFilterChange("all"); }}
              >
                <span>All Projects</span>
                <span className="wm-filter-pill-count">{projects.length}</span>
              </button>
            </div>

            {/* Project Cards Scrollable Viewport */}
            <div
              className="wm-projects-scroll-wrapper"
              ref={scrollRef}
              tabIndex={0}
              aria-label="Scrollable list of projects"
            >
              <div className="wm-projects-grid-viewport">
                {filteredProjects.map(function (p, i) {
                  return (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      index={i}
                      onSelect={openDemoModal}
                    />
                  );
                })}
              </div>
            </div>

            {filteredProjects.length > 6 && (
              <div className="wm-projects-scroll-hint">
                <span className="wm-scroll-hint-text">
                  Showing 6 cards in viewport • Scroll to explore all {filteredProjects.length} projects
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 2: ABOUT ── */
export function SectionAbout() {
  var r1 = useInView(0.2); var headRef = r1[0]; var headInView = r1[1];
  var r2 = useInView(0.15); var bodyRef = r2[0]; var bodyInView = r2[1];
  var app = useApp();
  var openDemoModal = app.openDemoModal;
  return (
    <section className="wm-about-section" id="about-section">
      <div className="wm-container">
        <div ref={headRef} className="wm-section-eyebrow"
          style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateX(0)" : "translateX(-20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
          <span className="wm-eyebrow-num" style={{ color: "#920000" }}>02</span>
          <span className="wm-eyebrow-slash" style={{ color: "#920000" }}>/</span>
          <span className="wm-eyebrow-label" style={{ color: "#573325" }}>BEHIND THE WORK</span>
        </div>
        <h2 className="wm-about-headline"
          style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateY(0)" : "translateY(25px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}>
          i don&apos;t just make it look good.<br />
          <span className="text-denim-red">I make it make money.</span>
        </h2>
        <div ref={bodyRef} className="wm-about-body"
          style={{ opacity: bodyInView ? 1 : 0, transform: bodyInView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }}>
          <div className="wm-about-text-col">
            <p className="wm-about-para">I&apos;m <strong style={{ color: "#920000" }}>Wenmar</strong>, a web developer, automation engineer, and GHL specialist helping businesses turn ideas into websites, systems, and automations that actually work.</p>
            <p className="wm-about-para">I work where <strong style={{ color: "#111111" }}>development, automation, and business strategy</strong> meet.</p>
            <p className="wm-about-para">That means I&apos;m not just here to build a website and hand you the keys. I think about the customer journey, the workflow, the follow-up, the automation, and everything happening behind the screen.</p>
            <p className="wm-about-para wm-about-bold">If it can be built better, automated smarter, or made more effective, I&apos;ll find a way.</p>
            <div className="wm-about-stats">
              <div className="wm-about-stat"><span className="wm-stat-num">3+</span><span className="wm-stat-label">Years Building</span></div>
              <div className="wm-about-stat"><span className="wm-stat-num">40+</span><span className="wm-stat-label">Projects Delivered</span></div>
              <div className="wm-about-stat"><span className="wm-stat-num">∞</span><span className="wm-stat-label">Hours Automated</span></div>
            </div>
            <button onClick={openDemoModal} className="wm-about-cta">
              <span>Let&apos;s talk about your project</span>
              <span className="wm-about-cta-arrow"><ArrowRight size={15} /></span>
            </button>
          </div>
          <div className="wm-about-photo-col">
            <div className="wm-about-photo-viewport">
              <img
                src={wenmarPortraitImg}
                alt="Wenmar — Web Developer &amp; Automation Engineer"
                className="wm-about-photo"
              />
            </div>
            <div className="wm-about-annotation wm-about-annotation-left">
              <span>AUTOMATION<br />ENGINEER</span>
              <svg width="44" height="8" viewBox="0 0 44 8" style={{ flexShrink: 0 }}>
                <line x1="0" y1="4" x2="38" y2="4" stroke="#111111" strokeWidth="1" />
                <polygon points="36,1.5 42,4 36,6.5" fill="#111111" />
              </svg>
            </div>
            <div className="wm-about-annotation wm-about-annotation-right">
              <svg width="44" height="8" viewBox="0 0 44 8" style={{ flexShrink: 0 }}>
                <polygon points="8,1.5 2,4 8,6.5" fill="#111111" />
                <line x1="6" y1="4" x2="44" y2="4" stroke="#111111" strokeWidth="1" />
              </svg>
              <span>WEB<br />ARCHITECT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 3: SERVICES ── */
var services = [
  {
    id: "A",
    title: "web app development",
    subtitle: "When you need something built from scratch.",
    body: "Custom React applications, dashboards, client portals, internal tools, and full-stack web systems built to perform at scale.",
    tag: "DESIGN / BUILD / DEPLOY",
    Icon: Code2,
    accent: "#920000",
    accentText: "#920000",
    accentBorder: "rgba(146, 0, 0, 0.4)"
  },
  {
    id: "B",
    title: "business automation",
    subtitle: "Stop doing manually what a system can handle.",
    body: "Connecting your CRM, email, payments, and ops tools with smart automations that run while you sleep using Make, Zapier, and custom scripts.",
    tag: "STRATEGY / WORKFLOW / INTEGRATE",
    Icon: Zap,
    accent: "#D3A373",
    accentText: "#9E6932",
    accentBorder: "rgba(158, 105, 50, 0.4)"
  },
  {
    id: "C",
    title: "GHL CRM systems",
    subtitle: "GoHighLevel is powerful. Let's unlock all of it.",
    body: "Full GHL buildouts — pipelines, automations, sub-accounts, white-label setup, membership portals, and conversion-optimised funnels built inside GHL.",
    tag: "CRM / FUNNELS / AUTOMATIONS",
    Icon: Settings,
    accent: "#C85A32",
    accentText: "#B04820",
    accentBorder: "rgba(176, 72, 32, 0.4)"
  }
];

function ServiceCard(props) {
  var service = props.service;
  var index = props.index;
  var r = useInView(0.12); var ref = r[0]; var inView = r[1];
  return (
    <div
      ref={ref}
      className="wm-service-card-wrapper"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(35px)",
        transition: "opacity 0.55s ease " + (index * 0.12) + "s, transform 0.55s ease " + (index * 0.12) + "s"
      }}
    >
      {/* Top-Left Solid Geometric Corner Accent */}
      <div
        className="wm-service-corner-tl"
        style={{ backgroundColor: service.accent }}
        aria-hidden="true"
      />

      {/* Bottom-Right Wireframe Geometric Corner Accent */}
      <div
        className="wm-service-corner-br"
        style={{ borderColor: service.accent }}
        aria-hidden="true"
      />

      {/* Main Central Foreground Card */}
      <div className="wm-service-card">
        <div className="wm-service-icon-wrap" style={{ color: service.accent }}>
          <service.Icon size={46} strokeWidth={1.8} />
        </div>
        <h3 className="wm-service-title" style={{ color: service.accentText }}>
          {service.title}
        </h3>
        <p className="wm-service-subtitle">{service.subtitle}</p>
        <p className="wm-service-body">{service.body}</p>
        <div className="wm-service-tag-row">
          <span
            className="wm-service-tag"
            style={{
              color: service.accentText,
              borderColor: service.accentBorder
            }}
          >
            {service.tag}
          </span>
        </div>
      </div>
    </div>
  );
}

export function SectionServices() {
  var r = useInView(0.2); var headRef = r[0]; var headInView = r[1];
  return (
    <section className="wm-services-section" id="services-section">
      <div className="wm-container">
        <div ref={headRef} style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateY(0)" : "translateY(25px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
          <div className="wm-section-eyebrow wm-eyebrow-light">
            <span className="wm-eyebrow-num">03</span>
            <span className="wm-eyebrow-slash">/</span>
            <span className="wm-eyebrow-label">WHAT I DO</span>
          </div>
          <h2 className="wm-services-headline">
            tools change.<br />
            <span className="wm-services-headline-accent">outcomes don&apos;t.</span>
          </h2>
        </div>
        <div className="wm-services-grid">
          {services.map(function (s, i) { return <ServiceCard key={s.id} service={s} index={i} />; })}
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 4: PROCESS (CREATES Framework) ── */
var steps = [
  {
    num: "01",
    letter: "C",
    title: "Clarify",
    body: "Understand the business, the problem, the users, and what actually needs to be built."
  },
  {
    num: "02",
    letter: "R",
    title: "Research",
    body: "Study the market, workflows, competitors, tools, and opportunities before writing code."
  },
  {
    num: "03",
    letter: "E",
    title: "Engineer",
    body: "Build the website, systems, integrations, and automations around the actual business requirements."
  },
  {
    num: "04",
    letter: "A",
    title: "Automate",
    body: "Remove repetitive work by connecting tools, data, communication, and processes."
  },
  {
    num: "05",
    letter: "T",
    title: "Test",
    body: "Break things before customers do. Test the UX, forms, integrations, automations, responsiveness, and edge cases."
  },
  {
    num: "06",
    letter: "E",
    title: "Enhance",
    body: "Optimize what is already working. Improve speed, conversion, usability, and efficiency."
  },
  {
    num: "07",
    letter: "S",
    title: "Scale",
    body: "Create systems that can handle more customers, leads, data, and business without creating more manual work."
  }
];

function ProcessStep(props) {
  var step = props.step;
  var isLast = props.isLast;
  var stepRef = props.stepRef;
  return (
    <div ref={stepRef} className="wm-process-step-wrap">
      <div className="wm-process-step">
        <div className="wm-process-num-col">
          <span className="wm-process-big-num">{step.num}</span>
        </div>
        <div className="wm-process-text-col">
          <h3 className="wm-process-title">
            <span className="wm-process-title-letter">{step.letter}</span>
            <span className="wm-process-title-dash"> — </span>
            <span>{step.title}</span>
          </h3>
          <p className="wm-process-body">{step.body}</p>
        </div>
      </div>
      {!isLast && <div className="wm-process-divider" />}
    </div>
  );
}

export function SectionProcess() {
  var r = useInView(0.2); var headRef = r[0]; var headInView = r[1];
  var stepRefs = useRef([]);

  useEffect(function () {
    var ticking = false;
    function updateFade() {
      ticking = false;
      var focalY = window.innerHeight * 0.44;

      steps.forEach(function (_, i) {
        var el = stepRefs.current[i];
        if (!el) return;
        var rect = el.getBoundingClientRect();
        var stepCenter = rect.top + rect.height * 0.5;

        if (stepCenter < focalY) {
          // Upper text moving past focal point: fade away as if switching
          var distAbove = focalY - stepCenter;
          if (distAbove <= 25) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0px)";
            el.style.filter = "none";
            el.style.pointerEvents = "auto";
          } else if (distAbove >= 170) {
            // Completely dissolved
            el.style.opacity = "0";
            el.style.transform = "translateY(-22px)";
            el.style.filter = "blur(3px)";
            el.style.pointerEvents = "none";
          } else {
            var progress = (distAbove - 25) / 145; // 0 to 1
            var op = Math.max(0, 1 - progress);
            var ty = -progress * 22;
            var blurPx = progress * 2.5;
            el.style.opacity = op.toFixed(3);
            el.style.transform = "translateY(" + ty.toFixed(1) + "px)";
            el.style.filter = blurPx > 0.4 ? "blur(" + blurPx.toFixed(1) + "px)" : "none";
            el.style.pointerEvents = op < 0.1 ? "none" : "auto";
          }
        } else {
          // At or below focal point: upcoming items softly previewed
          var distBelow = stepCenter - focalY;
          if (distBelow <= 65) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0px)";
            el.style.filter = "none";
            el.style.pointerEvents = "auto";
          } else {
            var progressBelow = Math.min(1, (distBelow - 65) / 220);
            var opBelow = 1 - progressBelow * 0.82;
            var finalOp = Math.max(0.18, opBelow);
            el.style.opacity = finalOp.toFixed(3);
            el.style.transform = "translateY(0px)";
            el.style.filter = "none";
            el.style.pointerEvents = "auto";
          }
        }
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateFade);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateFade();

    return function () {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="wm-process-section" id="process-section">
      <div className="wm-container">
        <div ref={headRef} className="wm-process-header" style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateY(0)" : "translateY(25px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
          <div className="wm-section-eyebrow">
            <span className="wm-eyebrow-num" style={{ color: "#920000" }}>04</span>
            <span className="wm-eyebrow-slash" style={{ color: "#920000" }}>/</span>
            <span className="wm-eyebrow-label" style={{ color: "#573325" }}>HOW I WORK</span>
          </div>
          <h2 className="wm-process-section-headline">
            every project follows<br />
            <span className="text-denim-red">the same logic.</span>
          </h2>
        </div>

        <div className="wm-process-list">
          {steps.map(function (s, i) {
            return (
              <ProcessStep
                key={s.letter + "-" + i}
                step={s}
                index={i}
                isLast={i === steps.length - 1}
                stepRef={function (el) { stepRefs.current[i] = el; }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 5: RESULTS ── */
var results = [
  { num: "40+", label: "projects built", sub: "Web apps, funnels, GHL systems, automations" },
  { num: "80%", label: "manual work eliminated", sub: "Average across automation projects" },
  { num: "3x", label: "faster launch timelines", sub: "Compared to traditional agency timelines" },
  { num: "24/7", label: "systems running", sub: "Automations that work while you sleep" },
];

function ResultItem(props) {
  var r = props.r;
  var i = props.i;
  var rv = useInView(0.15); var rRef = rv[0]; var rInView = rv[1];
  return (
    <div ref={rRef} className="wm-result-item"
      style={{ opacity: rInView ? 1 : 0, transform: rInView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.55s ease " + (i * 0.1) + "s, transform 0.55s ease " + (i * 0.1) + "s" }}>
      <span className="wm-result-num">{r.num}</span>
      <span className="wm-result-label">{r.label}</span>
      <span className="wm-result-sub">{r.sub}</span>
    </div>
  );
}

export function SectionResults() {
  var rv = useInView(0.2); var ref = rv[0]; var inView = rv[1];
  return (
    <section className="wm-results-section" id="results-section">
      <div className="wm-container">
        <div ref={ref} style={{ opacity: inView ? 1 : 0, transition: "opacity 0.7s ease" }}>
          <div className="wm-section-eyebrow wm-eyebrow-light">
            <span className="wm-eyebrow-num">05</span>
            <span className="wm-eyebrow-slash">/</span>
            <span className="wm-eyebrow-label">THE RESULTS</span>
          </div>
          <h2 className="wm-results-headline">
            design means nothing<br />
            <span className="wm-results-accent">if it doesn&apos;t move the needle.</span>
          </h2>
        </div>
        <div className="wm-results-grid">
          {results.map(function (r, i) { return <ResultItem key={i} r={r} i={i} />; })}
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 6: CTA ── */
export function SectionCTA() {
  var app = useApp();
  var openDemoModal = app.openDemoModal;
  var rv = useInView(0.2); var ref = rv[0]; var inView = rv[1];
  return (
    <section className="wm-cta-section" id="cta-section">
      <div className="wm-cta-watermark" aria-hidden="true">LET&apos;S BUILD</div>
      <div className="wm-cta-photo-wrap">
        <img src={wenmarSeatedImg} alt="" className="wm-cta-photo" />
      </div>
      <div className="wm-container wm-cta-inner">
        <div ref={ref} className="wm-cta-content"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          <h2 className="wm-cta-headline">
            got a business worth building?<br />
            <span className="text-denim-red">let&apos;s build the system.</span>
          </h2>
          <p className="wm-cta-sub">You&apos;ve already done the hard part — building an offer people need. Now let&apos;s give it web infrastructure that actually supports the business behind it.</p>
          <button onClick={openDemoModal} className="wm-cta-btn">
            <span>work with me</span>
            <ArrowRight size={17} />
          </button>
          <p className="wm-cta-microcopy">WEB APPS / AUTOMATION / GHL SYSTEMS</p>
          <p className="wm-cta-availability">Philippines • Available Worldwide</p>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
export function SiteFooter() {
  return (
    <footer className="wm-footer">
      <div className="wm-container wm-footer-inner">
        <div className="wm-footer-left">
          <span className="wm-footer-brand">WENMARCREATES</span>
          <span className="wm-footer-tagline">Built with intent. Delivered with precision.</span>
        </div>
        <div className="wm-footer-right">
          <a href="mailto:hello@wenmarcreates.com" className="wm-footer-link">hello@wenmarcreates.com</a>
          <span className="wm-footer-copy">© {new Date().getFullYear()} WenmarCreates. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

/* ── BUNDLE ── */
export function HomeSections() {
  return (
    <>
      <SectionProjects />
      <SectionAbout />
      <SectionServices />
      <SectionProcess />
      <SectionResults />
      <SectionCTA />
      <SiteFooter />
    </>
  );
}
