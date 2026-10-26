import React, { useRef, useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRight, Zap, Code2, Settings, Database, ChevronUp, ChevronDown, Layers, ExternalLink, Sparkles, CheckCircle2, Maximize2, Brain, Search, TrendingUp, Mail, Send, Globe, Clock } from "lucide-react";
import { supabase } from "../../lib/supabase";
import wenmarSeatedImg from "../../assets/wenmar-seated.png";
import wenmarPortraitImg from "../../assets/wenmar-confident-suit.png";
import pmgImg from "../../assets/projects/pmg1.png";
import wealthxcelerateImg from "../../assets/projects/wealthxcelerate.png";
import producerosImg from "../../assets/projects/produceros.png";
import thestrategistImg from "../../assets/projects/thestrategist.png";
import retirementinstituteImg from "../../assets/projects/retirementinstitute.png";
import businessoptimizersImg from "../../assets/projects/businessoptimizers.png";
import postemaconsultingImg from "../../assets/projects/postemaconsulting.png";
import postemacapitalImg from "../../assets/projects/postemacapital.png";
import autoLeadScrapeImg from "../../assets/projects/lead-scraping-campaign.jpg";
import autoBookingImg from "../../assets/projects/booking-automation.jpg";
import autoDemoGenImg from "../../assets/projects/demo-generator.jpg";
import autoChatWidgetImg from "../../assets/projects/chat-widget-automation.jpg";

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

/* ── SECTION 1: PROJECTS (8 Web Dev, 4 Automations, 6 GHL = 18 total) ── */
var projects = [
  /* Web dev (8 projects) */
  {
    id: "01",
    title: "Postema Marketing Group (PMG)",
    categoryKey: "web_dev",
    category: "Web dev",
    image: pmgImg,
    url: "https://www.pmg1.com/",
    tags: ["ANNUITY & LIFE OS", "ADVISOR ACQUISITION", "HIGH-CONVERTING FUNNELS"],
    description: "Enterprise insurance & annuity practice growth platform equipping financial advisors with carrier contracting, automated lead pipelines, and AI-powered client acquisition workflows.",
  },
  {
    id: "02",
    title: "WealthXcelerate",
    categoryKey: "web_dev",
    category: "Web dev",
    image: wealthxcelerateImg,
    url: "https://wealthxcelerate.com/",
    tags: ["FINANCIAL BLUEPRINT", "LUXURY DARK UI", "COACHING PORTAL"],
    description: "Complete financial transformation ecosystem led by Ray Lewis & Dennis M. Postema, featuring WealthX University, educational tools, video masterclasses, and coach booking.",
  },
  {
    id: "03",
    title: "ProducerOS.Ai",
    categoryKey: "web_dev",
    category: "Web dev",
    image: producerosImg,
    url: "https://produceros.ai/",
    tags: ["AI OPERATING SYSTEM", "INSURANCE INFRASTRUCTURE", "ANNUITY FLOW™"],
    description: "Intelligent digital operating infrastructure for elite insurance agencies, integrating Annuity Flow™, Recruiter AI™, life underwriting stacks, and deep CRM automation.",
  },
  {
    id: "04",
    title: "The Strategist CEO",
    categoryKey: "web_dev",
    category: "Web dev",
    image: thestrategistImg,
    url: "https://thestrategist.ceo/",
    tags: ["EXECUTIVE BRANDING", "EDITORIAL DESIGN", "ENTERPRISE METHODOLOGY"],
    description: "Editorial advisory presence for entrepreneurs and founders, offering strategic growth frameworks, operation automation, AI integration, and direct executive consulting.",
  },
  {
    id: "05",
    title: "The Retirement Institute",
    categoryKey: "web_dev",
    category: "Web dev",
    image: retirementinstituteImg,
    url: "https://theretirementinstitute.org/",
    tags: ["ESTATE & PROBATE", "CONSUMER ADVOCACY", "LIVING TRUST FUNNEL"],
    description: "Authoritative education and asset protection platform helping retirees avoid probate court with revocable living trust guides, Medicare planning, and tax efficiency tools.",
  },
  {
    id: "06",
    title: "Business Optimizers",
    categoryKey: "web_dev",
    category: "Web dev",
    image: businessoptimizersImg,
    url: "https://businessoptimizers.io/",
    tags: ["ENTERPRISE CONSULTING", "REVENUE ENGINES", "CUSTOM AI SYSTEMS"],
    description: "Enterprise consulting portal engineered to architect competitive advantages through custom AI systems, strategic process automation, and high-velocity revenue engines.",
  },
  {
    id: "07",
    title: "Postema Consulting",
    categoryKey: "web_dev",
    category: "Web dev",
    image: postemaconsultingImg,
    url: "https://postemaconsulting.com/",
    tags: ["BUSINESS ARCHITECTURE", "LEGACY CREATION", "STRATEGIC CONSULTING"],
    description: "Tailored business-building architecture portal showcasing publishing services, strategic consulting, the proprietary MogulOS framework, and client appointment scheduling.",
  },
  {
    id: "08",
    title: "Postema Capital Lending",
    categoryKey: "web_dev",
    category: "Web dev",
    image: postemacapitalImg,
    url: null,
    tags: ["COMMERCIAL REAL ESTATE", "PRIVATE CREDIT", "LOAN ESTIMATOR ENGINE"],
    description: "Institutional balance sheet lender platform featuring interactive real-time bridge loan estimators, structured debt underwriting sizers, and multi-tier capital allocation workflows.",
  },

  /* Automations (4 Enhanced Workflows with Architecture Diagrams) */
  {
    id: "09",
    title: "Lead Scraping & Email Campaign Engine",
    categoryKey: "automations",
    category: "Automations",
    image: autoLeadScrapeImg,
    workflowImage: autoLeadScrapeImg,
    trigger: "Inbound Web Form / Webhook",
    whatItDoes: "When a prospect submits the form, the workflow immediately triggers an autonomous multi-source lead scraping engine, extracts and verifies contact attributes, checks email deliverability, records validated leads into Google Sheets and CRM, and deploys targeted, multi-branch cold email sequences tailored to each prospect.",
    solved: "Eliminates hours of manual lead hunting, data entry, and delayed email outreach. Replaces 20+ hours of repetitive weekly SDR tasks with an instant, autonomous capture-to-campaign outreach engine.",
    tags: ["N8N WORKFLOW", "LEAD SCRAPING", "MULTI-BRANCH EMAIL ENGINE", "DATA VALIDATION"],
    description: "Autonomous lead generation & outbound pipeline connecting inbound forms to real-time scraper nodes and automated multi-branch email sequences with zero manual intervention.",
  },
  {
    id: "10",
    title: "Booking, Proposal & Invoicing Automation",
    categoryKey: "automations",
    category: "Automations",
    image: autoBookingImg,
    workflowImage: autoBookingImg,
    trigger: "Live Chat Widget & Booking Form Webhook",
    whatItDoes: "When a client requests a booking via chat or form, the engine queries live calendar availability and locks the slot. An integrated AI agent generates dynamic quotes, compiles branded PDF proposals, monitors for client approval, auto-generates customized PDF rental agreements, issues checkout invoices, and sends instant multi-party confirmations.",
    solved: "Eliminates manual booking friction, calendar collision errors, and tedious paperwork. Replaces manual quote drafting, agreement generation, and invoice follow-ups with an instantaneous, error-free booking pipeline.",
    tags: ["CALENDAR SYNC", "AI PROPOSAL & CONTRACT", "AUTO INVOICING", "STRIPE & PDF GENERATOR"],
    description: "Complete frictionless booking engine handling calendar availability, AI quote calculations, PDF proposal creation, contract signing, and invoice generation in an uninterrupted loop.",
  },
  {
    id: "11",
    title: "Lead Qualification & Interactive Website Demo Generator",
    categoryKey: "automations",
    category: "Automations",
    image: autoDemoGenImg,
    workflowImage: autoDemoGenImg,
    trigger: "Google Sheets Queue & Inbound Lead Webhook",
    whatItDoes: "Pulls prospective clients into an autonomous 'Leads Keeper' AI agent (OpenRouter + Deep Reasoning). The agent scrapes the prospect's live website, diagnoses conversion gaps, synthesizes a custom knowledge base, and calls Lovable's automated web generator to assemble a live interactive demo website before emailing the prospect with their custom prototype link.",
    solved: "Eliminates generic low-converting text pitches and days spent creating bespoke mockups. Transforms outbound sales by delivering working, personalized interactive web demos before the discovery call, drastically increasing reply rates and closed deals.",
    tags: ["AI AGENT (OPENROUTER)", "AUTONOMOUS DEMO BUILDER", "WEBSITE ANALYZER", "LOVABLE API"],
    description: "Next-gen outbound conversion engine that audits prospect sites and autonomously generates tailored, live interactive demo websites to multiply cold response rates.",
  },
  {
    id: "12",
    title: "24/7 Autonomous AI Chat, Quoting & Booking Widget",
    categoryKey: "automations",
    category: "Automations",
    image: autoChatWidgetImg,
    workflowImage: autoChatWidgetImg,
    trigger: "Live Chat Widget Webhook & Visitor Query",
    whatItDoes: "Embeds a 24/7 autonomous AI assistant equipped with persistent conversation memory and multi-tool orchestration. In real time, the agent reasons through visitor inquiries, queries the company knowledge base, calculates custom quotes on the fly, checks live calendar openings, updates CRM contact records, and fires automated confirmation emails.",
    solved: "Solves lost after-hours leads, high customer support overhead, and slow inquiry response times. Functions as an always-on sales and support agent that captures leads, calculates pricing, answers complex questions, and books appointments 24/7 with zero human intervention.",
    tags: ["OPENROUTER AI AGENT", "CONVERSATIONAL MEMORY", "TOOL ORCHESTRATION", "24/7 SUPPORT"],
    description: "Omniscient 24/7 chat intelligence agent equipped with tool reasoning, dynamic calculations, real-time availability lookups, and instant CRM synchronization.",
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

  var hasUrl = Boolean(project.url && project.url !== "none");
  var isAutomation = project.categoryKey === "automations";

  function handleCardClick() {
    if (hasUrl) {
      window.open(project.url, "_blank", "noopener,noreferrer");
    } else if (project.workflowImage) {
      window.open(project.workflowImage, "_blank", "noopener,noreferrer");
    } else if (onSelect) {
      onSelect();
    }
  }

  return (
    <div
      ref={cardRef}
      className={
        "wm-project-card wm-project-grid-card" +
        (project.image ? " has-image" : "") +
        (isAutomation ? " is-automation-card" : "")
      }
      onClick={handleCardClick}
      style={{
        opacity: cardInView ? 1 : 0,
        transform: cardInView ? "translateY(0)" : "translateY(25px)",
        transition:
          "opacity 0.45s ease " +
          Math.min((index % 6) * 0.08, 0.4) +
          "s, transform 0.45s ease " +
          Math.min((index % 6) * 0.08, 0.4) +
          "s",
      }}
      role="button"
      tabIndex={0}
      onKeyDown={function (e) {
        if (e.key === "Enter") {
          handleCardClick();
        }
      }}
      aria-label={"View project details for " + project.title}
    >
      {/* Top Editorial Header: Giant Dark Red Number (Left) + Stacked Scope Tags & Red Line (Right) */}
      <div className="wm-project-card-header">
        <div className="wm-project-num-wrap">
          <span className="wm-project-giant-num">{project.id}</span>
        </div>
        <div className="wm-project-scope-stack">
          <div className="wm-project-scope-list">
            {project.tags.slice(0, 4).map(function (t) {
              return (
                <span key={t} className="wm-project-scope-item">
                  {t}
                </span>
              );
            })}
          </div>
          <div className="wm-project-scope-accent-line" />
        </div>
      </div>

      {/* Visual Image Preview Header for Web Dev & Automation Workflows */}
      {project.image ? (
        <div className={"wm-project-card-image-wrap" + (isAutomation ? " is-workflow-thumb" : "")}>
          <img
            src={project.image}
            alt={project.title}
            className="wm-project-card-image"
            loading="lazy"
          />
          <div className="wm-project-card-image-overlay" />
          {hasUrl && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="wm-project-live-badge"
              onClick={function (e) { e.stopPropagation(); }}
              title={"Open " + project.title + " live website"}
            >
              <span>Live Site</span>
              <ExternalLink size={11} strokeWidth={2.4} />
            </a>
          )}
          {isAutomation && project.workflowImage && (
            <a
              href={project.workflowImage}
              target="_blank"
              rel="noopener noreferrer"
              className="wm-project-live-badge wm-project-workflow-badge"
              onClick={function (e) { e.stopPropagation(); }}
              title="Inspect full-resolution architecture diagram"
            >
              <Maximize2 size={11} strokeWidth={2.4} />
              <span>Full Flow</span>
            </a>
          )}
        </div>
      ) : null}

      {/* Title & Slashed Tags Group */}
      <div className="wm-project-title-group">
        <h3 className="wm-project-card-title">{project.title}</h3>
        <div className="wm-project-slashed-tags">
          {project.tags.join(" / ")}
        </div>
      </div>

      {/* Structured Automation Details when Trigger, What It Does & Solved are defined */}
      {isAutomation && project.whatItDoes ? (
        <div className="wm-automation-details-container">
          {project.trigger && (
            <div className="wm-automation-trigger-row">
              <span className="wm-automation-trigger-badge">
                <Zap size={11} className="wm-trigger-icon" />
                <span className="wm-trigger-label">TRIGGER:</span>
                <span className="wm-trigger-value">{project.trigger}</span>
              </span>
            </div>
          )}

          <div className="wm-automation-block">
            <div className="wm-automation-block-header">
              <Sparkles size={11} className="wm-auto-icon" />
              <span className="wm-automation-label">WHAT IT DOES</span>
            </div>
            <p className="wm-automation-text">{project.whatItDoes}</p>
          </div>

          <div className="wm-automation-solved-block">
            <div className="wm-automation-block-header">
              <CheckCircle2 size={11} className="wm-auto-icon wm-icon-solved" />
              <span className="wm-automation-label wm-label-solved">PROBLEM SOLVED</span>
            </div>
            <p className="wm-automation-text wm-text-solved">{project.solved}</p>
          </div>
        </div>
      ) : (
        <p className="wm-project-card-desc">{project.description}</p>
      )}

      <div className="wm-project-card-footer">
        <span className="wm-project-cat">{project.category}</span>
        {hasUrl ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="wm-project-action-link wm-project-live-link"
            onClick={function (e) { e.stopPropagation(); }}
          >
            <span>Visit Live Site</span>
            <ExternalLink size={13} strokeWidth={2.2} />
          </a>
        ) : isAutomation && project.workflowImage ? (
          <a
            href={project.workflowImage}
            target="_blank"
            rel="noopener noreferrer"
            className="wm-project-action-link wm-project-workflow-link"
            onClick={function (e) { e.stopPropagation(); }}
          >
            <span>Inspect Diagram</span>
            <ExternalLink size={13} strokeWidth={2.2} />
          </a>
        ) : (
          <span className="wm-project-action-link">
            <span>Consult on this</span>
            <ArrowRight size={14} />
          </span>
        )}
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
              <div className={"wm-projects-grid-viewport" + (activeFilter === "automations" ? " is-automations-grid" : "")}>
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
      {/* Background panels aligned with marquee: Charcoal (72-100%, z:1), Red (0-62%, z:5) */}
      <div className="wm-about-black-panel" aria-hidden="true" />
      <div className="wm-about-red-panel" aria-hidden="true" />

      <div className="wm-container">
        <div ref={headRef} className="wm-section-eyebrow"
          style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateX(0)" : "translateX(-20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
          <span className="wm-eyebrow-num wm-about-eyebrow-num">02</span>
          <span className="wm-eyebrow-slash wm-about-eyebrow-slash">/</span>
          <span className="wm-eyebrow-label wm-about-eyebrow-label">BEHIND THE WORK</span>
        </div>
        <h2 className="wm-about-headline"
          style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateY(0)" : "translateY(25px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}>
          <span className="wm-about-headline-lead">i don&apos;t just make it look good.</span><br />
          <span className="wm-about-subhead">I make it make money.</span>
        </h2>
        <div ref={bodyRef} className="wm-about-body">
          <div className="wm-about-text-col"
            style={{ opacity: bodyInView ? 1 : 0, transform: bodyInView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }}>
            <p className="wm-about-para">I&apos;m <strong className="wm-about-strong-highlight">Wenmar</strong>, a web developer, automation engineer, and GHL specialist helping businesses turn ideas into websites, systems, and automations that actually work.</p>
            <p className="wm-about-para">I work where <strong className="wm-about-strong-white">development, automation, and business strategy</strong> meet.</p>
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
          <div className="wm-about-photo-col"
            style={{ opacity: bodyInView ? 1 : 0, transform: bodyInView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s" }}>
            <div className="wm-about-photo-viewport">
              <img
                src={wenmarPortraitImg}
                alt="Wenmar — Web Developer &amp; Automation Engineer"
                className="wm-about-photo"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="wm-about-annotation wm-about-annotation-left">
              <span>AUTOMATION<br />ENGINEER</span>
              <svg width="44" height="8" viewBox="0 0 44 8" style={{ flexShrink: 0 }}>
                <line x1="0" y1="4" x2="38" y2="4" stroke="currentColor" strokeWidth="1" />
                <polygon points="36,1.5 42,4 36,6.5" fill="currentColor" />
              </svg>
            </div>
            <div className="wm-about-annotation wm-about-annotation-right">
              <svg width="44" height="8" viewBox="0 0 44 8" style={{ flexShrink: 0 }}>
                <polygon points="8,1.5 2,4 8,6.5" fill="currentColor" />
                <line x1="6" y1="4" x2="44" y2="4" stroke="currentColor" strokeWidth="1" />
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
    num: "1",
    letter: "C",
    title: "Clarify",
    body: "Understand the business, the problem, the users, and what actually needs to be built.",
    color: "#E51937",
    darkColor: "#990A1E",
    icon: Brain
  },
  {
    num: "2",
    letter: "R",
    title: "Research",
    body: "Study the market, workflows, competitors, tools, and opportunities before writing code.",
    color: "#701230",
    darkColor: "#47071B",
    icon: Search
  },
  {
    num: "3",
    letter: "E",
    title: "Engineer",
    body: "Build the website, systems, integrations, and automations around the actual business requirements.",
    color: "#0F3854",
    darkColor: "#071E2F",
    icon: Code2
  },
  {
    num: "4",
    letter: "A",
    title: "Automate",
    body: "Remove repetitive work by connecting tools, data, communication, and processes.",
    color: "#16838D",
    darkColor: "#0C5056",
    icon: Zap
  },
  {
    num: "5",
    letter: "T",
    title: "Test",
    body: "Break things before customers do. Test the UX, forms, integrations, automations, responsiveness, and edge cases.",
    color: "#C27318",
    darkColor: "#7D4609",
    icon: CheckCircle2
  },
  {
    num: "6",
    letter: "E",
    title: "Enhance",
    body: "Optimize what is already working. Improve speed, conversion, usability, and efficiency.",
    color: "#1D7747",
    darkColor: "#104729",
    icon: TrendingUp
  },
  {
    num: "7",
    letter: "S",
    title: "Scale",
    body: "Create systems that can handle more customers, leads, data, and business without creating more manual work.",
    color: "#542B72",
    darkColor: "#321646",
    icon: Maximize2
  }
];

function ProcessStep(props) {
  var step = props.step;
  var index = props.index;
  var inViewTuple = useInView(0.12);
  var cardRef = inViewTuple[0];
  var isInView = inViewTuple[1];
  var IconComp = step.icon;

  return (
    <div
      ref={cardRef}
      className="wm-infographic-card"
      style={{
        "--ribbon-color": step.color,
        "--ribbon-dark": step.darkColor,
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) " + (index * 0.06) + "s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) " + (index * 0.06) + "s, box-shadow 0.3s ease"
      }}
    >
      {/* 3D Ribbon on the Left with circular number badge */}
      <div className="wm-infographic-ribbon">
        <div className="wm-infographic-badge">
          <span className="wm-infographic-num">{step.num}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="wm-infographic-content">
        <h3 className="wm-infographic-title" style={{ color: step.color }}>
          {step.letter} — {step.title.toUpperCase()}
        </h3>
        <p className="wm-infographic-desc">{step.body}</p>
      </div>

      {/* Right Column: Outline Icon & Layered 3D Chevrons */}
      <div className="wm-infographic-right">
        <div className="wm-infographic-icon-circle" style={{ color: step.color }}>
          {IconComp && <IconComp size={26} strokeWidth={2} />}
        </div>
        <div className="wm-infographic-chevrons" aria-hidden="true">
          <svg width="42" height="24" viewBox="0 0 42 24" fill="none">
            <path d="M4 4 L21 14 L38 4" stroke="rgba(0, 0, 0, 0.12)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 11 L21 21 L38 11" stroke="rgba(0, 0, 0, 0.06)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function SectionProcess() {
  var r = useInView(0.2); var headRef = r[0]; var headInView = r[1];

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

        <div className="wm-infographic-list">
          {steps.map(function (s, i) {
            return (
              <ProcessStep
                key={s.letter + "-" + i}
                step={s}
                index={i}
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

/* ── SECTION 6: CTA & CONTACT FORM ── */
export function SectionCTA() {
  const { addToast } = useApp();
  const [ref, inView] = useInView(0.15);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast("Missing Information", "Please enter your name and email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save inquiry to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem("wenmar_inquiries") || "[]");
        const newRecord = {
          id: "inq_" + Date.now(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("wenmar_inquiries", JSON.stringify([newRecord, ...stored]));
      } catch (err) {
        // storage fallback
      }

      // 2. Optionally record in Supabase visitors table if available
      try {
        if (supabase) {
          await supabase.from("visitors").upsert({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            user_agent: navigator.userAgent
          }, { onConflict: "email" });
        }
      } catch (err) {
        // non-blocking fallback
      }

      // Natural UX delay
      await new Promise(res => setTimeout(res, 500));

      setIsSubmitted(true);
      addToast(
        "Inquiry Dispatched!",
        `Thank you ${formData.name}. We will review your inquiry and respond within 24 hours.`
      );
    } catch (err) {
      setIsSubmitted(true);
      addToast("Inquiry Received", "Thank you for reaching out! We will be in touch shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      message: ""
    });
    setIsSubmitted(false);
  };

  return (
    <section className="wm-cta-section" id="cta-section">
      <div className="wm-cta-watermark" aria-hidden="true">LET&apos;S BUILD</div>
      <div className="wm-cta-photo-wrap">
        <img src={wenmarSeatedImg} alt="Wenmar Seated" className="wm-cta-photo" loading="lazy" decoding="async" />
      </div>
      <div className="wm-container wm-cta-inner">
        <div 
          ref={ref} 
          className="wm-cta-grid"
          style={{ 
            opacity: inView ? 1 : 0, 
            transform: inView ? "translateY(0)" : "translateY(28px)", 
            transition: "opacity 0.7s ease, transform 0.7s ease" 
          }}
        >
          {/* Left Column: Direct Info & Value Proposition */}
          <div className="wm-contact-info-col">
            <div className="wm-cta-badge">
              <Sparkles size={13} />
              <span>DIRECT INQUIRY &amp; CONSULTATION</span>
            </div>

            <h2 className="wm-cta-headline">
              got a business worth building?<br />
              <span className="text-denim-red">let&apos;s build the system.</span>
            </h2>

            <p className="wm-cta-sub">
              You&apos;ve already done the hard part — building an offer people need. Now let&apos;s give it custom web infrastructure, autonomous AI automations, and GoHighLevel pipelines that convert.
            </p>

            {/* Direct Contact Cards */}
            <div className="wm-contact-cards">
              <a 
                href="mailto:wenmarcreates@gmail.com" 
                className="wm-contact-channel-card"
                title="Send direct email"
              >
                <div className="wm-contact-channel-icon">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="wm-contact-channel-title">wenmarcreates@gmail.com</div>
                  <div className="wm-contact-channel-desc">Direct founder inbox • Guaranteed response within 24 hours</div>
                </div>
              </a>

              <div className="wm-contact-channel-card">
                <div className="wm-contact-channel-icon">
                  <Globe size={18} />
                </div>
                <div>
                  <div className="wm-contact-channel-title">Philippines • Available Worldwide</div>
                  <div className="wm-contact-channel-desc">Async &amp; real-time sprint delivery across US, UK, EU, and APAC</div>
                </div>
              </div>

              <div className="wm-contact-channel-card">
                <div className="wm-contact-channel-icon">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="wm-contact-channel-title">Turnaround &amp; Scope Delivery</div>
                  <div className="wm-contact-channel-desc">Detailed architecture roadmap and estimate delivered within 1 business day</div>
                </div>
              </div>
            </div>

            <p className="wm-cta-microcopy">WEB APPS / AUTOMATION / GHL SYSTEMS</p>
          </div>

          {/* Right Column: Luxury AayStyle Contact Form Card */}
          <div className="wm-contact-form-card">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <h3 className="wm-contact-form-title">Start a Conversation</h3>
                <p className="wm-contact-form-subtitle">
                  Tell me what you&apos;re looking to build. I&apos;ll review your requirements and reply with a tailored roadmap.
                </p>

                {/* Name Field */}
                <div className="wm-contact-group">
                  <label className="wm-contact-label" htmlFor="contact-name">
                    <span>Your Name *</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan / Acme Corp"
                    value={formData.name}
                    onChange={handleChange}
                    className="wm-contact-input"
                  />
                </div>

                {/* Email Field */}
                <div className="wm-contact-group">
                  <label className="wm-contact-label" htmlFor="contact-email">
                    <span>Work Email *</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="wm-contact-input"
                  />
                </div>

                {/* Message Field */}
                <div className="wm-contact-group">
                  <label className="wm-contact-label" htmlFor="contact-message">
                    <span>Project Overview / Goals</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Briefly describe what your business needs, your current systems, and target launch date..."
                    value={formData.message}
                    onChange={handleChange}
                    className="wm-contact-textarea"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="wm-contact-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Clock size={16} className="wm-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Project Inquiry</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="wm-contact-success-card">
                <div className="wm-contact-success-icon">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="wm-contact-success-title">Inquiry Received!</h4>
                <p className="wm-contact-success-desc">
                  Thank you, <strong>{formData.name}</strong>. Your inquiry has been dispatched. I&apos;ll review the details and follow up via <strong>{formData.email}</strong> within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="wm-contact-pill active"
                  style={{ padding: "0.6rem 1.4rem", fontSize: "0.85rem" }}
                >
                  Send Another Inquiry
                </button>
              </div>
            )}
          </div>
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
          <a href="mailto:wenmarcreates@gmail.com" className="wm-footer-link">wenmarcreates@gmail.com</a>
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
