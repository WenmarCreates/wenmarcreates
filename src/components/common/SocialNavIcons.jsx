import React from "react";

export const FacebookIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const XIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

export const YoutubeIcon = ({ size = 19, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill={color} stroke="none" />
  </svg>
);

export const InstagramIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2.5" />
  </svg>
);

export const LinkedinIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const SocialNavLinks = ({ className = "" }) => (
  <div 
    className={`hero-social-links ${className}`}
    style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "0.65rem",
      flexShrink: 0
    }}
  >
    <a 
      href="https://facebook.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="hero-social-btn"
      aria-label="Facebook"
      title="Facebook"
    >
      <FacebookIcon size={18} />
    </a>
    <a 
      href="https://x.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="hero-social-btn"
      aria-label="X (Twitter)"
      title="X (Twitter)"
    >
      <XIcon size={16} />
    </a>
    <a 
      href="https://youtube.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="hero-social-btn"
      aria-label="YouTube"
      title="YouTube"
    >
      <YoutubeIcon size={18} />
    </a>
    <a 
      href="https://instagram.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="hero-social-btn"
      aria-label="Instagram"
      title="Instagram"
    >
      <InstagramIcon size={17} />
    </a>
    <a 
      href="https://linkedin.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="hero-social-btn"
      aria-label="LinkedIn"
      title="LinkedIn"
    >
      <LinkedinIcon size={17} />
    </a>
  </div>
);

