import React, { useEffect, useRef } from "react";

// Official tech stack, AI engines & automation tools used
const BRAND_LOGOS = [
  {
    id: "react",
    name: "React",
    category: "Frontend UI",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </g>
      </svg>
    )
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "React Framework",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.665 21.978A11.94 11.94 0 0 1 12 24C5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251zm-3.332-8.533l1.6 2.061V7.2h-1.6z" />
      </svg>
    )
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Type-Safe Language",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75q.918 0 1.627.111a6.4 6.4 0 0 1 1.306.34v2.458a4 4 0 0 0-.643-.361a5 5 0 0 0-.717-.26a5.5 5.5 0 0 0-1.426-.2q-.45 0-.819.086a2.1 2.1 0 0 0-.623.242q-.254.156-.393.374a.9.9 0 0 0-.14.49q0 .294.156.529q.156.234.443.444c.287.21.423.276.696.41q.41.203.926.416q.705.296 1.266.628q.561.333.963.753q.402.418.614.957q.213.538.214 1.253q0 .986-.373 1.656a3 3 0 0 1-1.012 1.085a4.4 4.4 0 0 1-1.487.596q-.85.18-1.79.18a10 10 0 0 1-1.84-.164a5.5 5.5 0 0 1-1.512-.493v-2.63a5.03 5.03 0 0 0 3.237 1.2q.5 0 .872-.09q.373-.09.623-.25q.249-.162.373-.38a1.02 1.02 0 0 0-.074-1.089a2.1 2.1 0 0 0-.537-.5a5.6 5.6 0 0 0-.807-.444a28 28 0 0 0-1.007-.436q-1.377-.575-2.053-1.405t-.676-2.005q0-.92.369-1.582q.368-.662 1.004-1.089a4.5 4.5 0 0 1 1.47-.629a7.5 7.5 0 0 1 1.77-.201m-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
      </svg>
    )
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Utility Styling",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 4.8q-4.8 0-6 4.8q1.8-2.4 4.2-1.8c.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12q4.8 0 6-4.8q-1.8 2.4-4.2 1.8c-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8m-6 7.2q-4.8 0-6 4.8q1.8-2.4 4.2-1.8c.913.228 1.565.89 2.288 1.624c1.177 1.194 2.538 2.576 5.512 2.576q4.8 0 6-4.8q-1.8 2.4-4.2 1.8c-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12" />
      </svg>
    )
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Database & Backend",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.32 14.242a.792.792 0 0 0 .616 1.284H12v8.958a.396.396 0 0 0 .716.233l10.964-14.079a.792.792 0 0 0-.616-1.284z" />
      </svg>
    )
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Core Engine",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0h24v24H0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873c-.736-.345-1.554-.585-1.797-1.14c-.091-.33-.105-.51-.046-.705c.15-.646.915-.84 1.515-.66c.39.12.75.42.976.9c1.034-.676 1.034-.676 1.755-1.125c-.27-.42-.404-.601-.586-.78c-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005c-1.14 1.291-.811 3.541.569 4.471c1.365 1.02 3.361 1.244 3.616 2.205c.24 1.17-.87 1.545-1.966 1.41c-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109c1.74 1.756 6.09 1.666 6.871-1.004c.029-.09.24-.705.074-1.65zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805c0 1.232.063 2.363-.138 2.711c-.33.689-1.18.601-1.566.48c-.396-.196-.597-.466-.83-.855c-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517c.855.51 2.004.675 3.207.405c.783-.226 1.458-.691 1.811-1.411c.51-.93.402-2.07.397-3.346c.012-2.054 0-4.109 0-6.179z" />
      </svg>
    )
  },
  {
    id: "antigravity",
    name: "Antigravity IDE",
    category: "Agentic IDE",
    icon: (
      <svg width="22" height="22" viewBox="10 15 90 85" fill="currentColor">
        <path d="M89.6992 93.695C94.3659 97.195 101.366 94.8617 94.9492 88.445C75.6992 69.7783 79.7825 18.445 55.8659 18.445C31.9492 18.445 36.0325 69.7783 16.7825 88.445C9.78251 95.445 17.3658 97.195 22.0325 93.695C40.1159 81.445 38.9492 59.8617 55.8659 59.8617C72.7825 59.8617 71.6159 81.445 89.6992 93.695Z" />
      </svg>
    )
  },
  {
    id: "claudecode",
    name: "Claude Code",
    category: "Anthropic AI",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="m4.714 15.956l4.718-2.648l.079-.23l-.08-.128h-.23l-.79-.048l-2.695-.073l-2.337-.097l-2.265-.122l-.57-.121l-.535-.704l.055-.353l.48-.321l.685.06l1.518.104l2.277.157l1.651.098l2.447.255h.389l.054-.158l-.133-.097l-.103-.098l-2.356-1.596l-2.55-1.688l-1.336-.972l-.722-.491L2 6.223l-.158-1.008l.656-.722l.88.06l.224.061l.893.686l1.906 1.476l2.49 1.833l.364.304l.146-.104l.018-.072l-.164-.274l-1.354-2.446l-1.445-2.49l-.644-1.032l-.17-.619a3 3 0 0 1-.103-.729L6.287.133L6.7 0l.995.134l.42.364l.619 1.415L9.735 4.14l1.555 3.03l.455.898l.243.832l.09.255h.159V9.01l.127-1.706l.237-2.095l.23-2.695l.08-.76l.376-.91l.747-.492l.583.28l.48.685l-.067.444l-.286 1.851l-.558 2.903l-.365 1.942h.213l.243-.242l.983-1.306l1.652-2.064l.728-.82l.85-.904l.547-.431h1.032l.759 1.129l-.34 1.166l-1.063 1.347l-.88 1.142l-1.263 1.7l-.79 1.36l.074.11l.188-.02l2.853-.606l1.542-.28l1.84-.315l.832.388l.09.395l-.327.807l-1.967.486l-2.307.462l-3.436.813l-.043.03l.049.061l1.548.146l.662.036h1.62l3.018.225l.79.522l.473.638l-.08.485l-1.213.62l-1.64-.389l-3.825-.91l-1.31-.329h-.183v.11l1.093 1.068l2.003 1.81l2.508 2.33l.127.578l-.321.455l-.34-.049l-2.204-1.657l-.85-.747l-1.925-1.62h-.127v.17l.443.649l2.343 3.521l.122 1.08l-.17.353l-.607.213l-.668-.122l-1.372-1.924l-1.415-2.168l-1.141-1.943l-.14.08l-.674 7.254l-.316.37l-.728.28l-.607-.461l-.322-.747l.322-1.476l.388-1.924l.316-1.53l.285-1.9l.17-.632l-.012-.042l-.14.018l-1.432 1.967l-2.18 2.945l-1.724 1.845l-.413.164l-.716-.37l.066-.662l.401-.589l2.386-3.036l1.439-1.882l.929-1.086l-.006-.158h-.055L4.138 18.56l-1.13.146l-.485-.456l.06-.746l.231-.243l1.907-1.312Z" />
      </svg>
    )
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "Google Multimodal",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68q.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58a12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68q-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96q2.19.93 3.81 2.55t2.55 3.81" />
      </svg>
    )
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    category: "Autonomous Agent",
    icon: (
      <svg width="22" height="22" viewBox="0 0 120 120" fill="currentColor">
        <path d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z" />
        <path d="M22 42C12 42 4 52 4 64c0 14 10 24 22 24 4 0 8-1 11-3-3-5-5-11-5-17 0-9 4-17 10-23-4-3-8-5-13-5zM98 42c-5 0-9 2-13 5 6 6 10 14 10 23 0 6-2 12-5 17 3 2 7 3 11 3 12 0 22-10 22-24 0-12-8-22-22-22z" />
      </svg>
    )
  },
  {
    id: "googlestitch",
    name: "Google Stitch",
    category: "AI Design Canvas",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h16M4 16h16M8 4v16M16 4v16" />
        <circle cx="8" cy="8" r="1.75" fill="currentColor" stroke="none" />
        <circle cx="16" cy="8" r="1.75" fill="currentColor" stroke="none" />
        <circle cx="8" cy="16" r="1.75" fill="currentColor" stroke="none" />
        <circle cx="16" cy="16" r="1.75" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    id: "gohighlevel",
    name: "GoHighLevel",
    category: "CRM & Funnels",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 19V11l4.5-3.5v11.5H3zm6.5 0V7l4.5-3.5V19h-4.5zm6.5 0V3.5L20.5 7V19H16z" />
      </svg>
    )
  },
  {
    id: "ditlead",
    name: "DitLead",
    category: "Outreach & Warmup",
    icon: (
      <svg width="22" height="22" viewBox="30 30 140 140" fill="currentColor">
        <path d="M163 147.944C163 151.481 160.95 152.334 158.465 149.83L124.083 115.445C121.365 112.4 119.766 108.519 119.548 104.443V42.4398C119.555 40.734 120.236 39.1002 121.442 37.8941C122.648 36.6879 124.282 36.0072 125.988 36H156.515C158.223 36.0048 159.859 36.6845 161.067 37.8909C162.275 39.0973 162.957 40.7325 162.964 42.4398L163 147.944ZM49.1778 40.5532C46.6746 38.0498 47.5181 36.0181 51.0643 36.0181H100.901C102.607 36.0229 104.243 36.7029 105.449 37.9096C106.656 39.1162 107.336 40.7515 107.341 42.4579V92.3436C107.341 95.89 105.291 96.7336 102.806 94.2303L49.1778 40.5532ZM149.849 158.465C152.352 160.968 151.509 163 147.963 163H98.1261C96.4197 162.995 94.7846 162.315 93.578 161.109C92.3715 159.902 91.6914 158.267 91.6866 156.56V106.674C91.6866 103.137 93.7363 102.285 96.2214 104.788L149.849 158.465ZM36.0361 51.0836C36.0361 47.5372 38.0767 46.6937 40.5708 49.197L74.9535 83.582C77.6726 86.623 79.2724 90.5011 79.4882 94.5749V156.56C79.4834 158.267 78.8034 159.902 77.5968 161.109C76.3902 162.315 74.7551 162.995 73.0488 163H42.4392C40.7321 162.998 39.0956 162.318 37.8885 161.111C36.6814 159.904 36.0024 158.267 36 156.56L36.0361 51.0836Z" />
      </svg>
    )
  },
  {
    id: "zeroworks",
    name: "ZeroWork",
    category: "Browser TaskBots",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4M8 16h.01M16 16h.01" />
        <path d="M8 12l8 8" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Inbound & CRM",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.885 8.192a3.81 3.81 0 0 0-3.327-2.023c-.354 0-.69.054-1.01.144V3.886A2.887 2.887 0 1 0 12.062 1v5.32c-.31-.087-.639-.14-.981-.14a3.818 3.818 0 0 0-3.33 2.012 3.8 3.8 0 0 0-.256 3.092l-4.7 4.7a2.384 2.384 0 1 0 1.69 1.69l4.72-4.72a3.834 3.834 0 0 0 3.064.24V19.5a2.5 2.5 0 1 0 2.484 0v-4.3a3.834 3.834 0 0 0 3.832-3.82c0-1.222-.572-2.313-1.464-3.008zM12 10.825a1.825 1.825 0 1 1 0-3.65 1.825 1.825 0 0 1 0 3.65z" />
      </svg>
    )
  },
  {
    id: "n8n",
    name: "n8n",
    category: "Workflow Logic",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.474 5.684a2.53 2.53 0 0 0-2.447 1.895H16.13a2.526 2.526 0 0 0-2.492 2.11l-.103.624a1.26 1.26 0 0 1-1.246 1.055h-1.001a2.527 2.527 0 0 0-4.893 0H4.973a2.527 2.527 0 1 0 0 1.264h1.422a2.527 2.527 0 0 0 4.894 0h1a1.26 1.26 0 0 1 1.247 1.055l.103.623a2.526 2.526 0 0 0 2.492 2.111h.37a2.527 2.527 0 1 0 0-1.263h-.37a1.26 1.26 0 0 1-1.246-1.056l-.103-.623A2.52 2.52 0 0 0 13.96 12a2.52 2.52 0 0 0 .82-1.48l.104-.622a1.26 1.26 0 0 1 1.246-1.056h2.896a2.527 2.527 0 1 0 2.447-3.158m0 1.263a1.263 1.263 0 0 1 1.263 1.263a1.263 1.263 0 0 1-1.263 1.264A1.263 1.263 0 0 1 20.21 8.21a1.263 1.263 0 0 1 1.264-1.263m-18.948 3.79A1.263 1.263 0 0 1 3.79 12a1.263 1.263 0 0 1-1.264 1.263A1.263 1.263 0 0 1 1.263 12a1.263 1.263 0 0 1 1.263-1.263m6.316 0A1.263 1.263 0 0 1 10.105 12a1.263 1.263 0 0 1-1.263 1.263A1.263 1.263 0 0 1 7.58 12a1.263 1.263 0 0 1 1.263-1.263m10.106 3.79a1.263 1.263 0 0 1 1.263 1.263a1.263 1.263 0 0 1-1.263 1.263a1.263 1.263 0 0 1-1.264-1.263a1.263 1.263 0 0 1 1.263-1.264" />
      </svg>
    )
  },
  {
    id: "zapier",
    name: "Zapier",
    category: "API Connectors",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.875 0h2.25v8.625h-2.25V0zm0 15.375h2.25V24h-2.25v-8.625zM0 10.875h8.625v2.25H0v-2.25zm15.375 0H24v2.25h-8.625v-2.25zM4.382 3.033l1.591-1.591 6.099 6.099-1.591 1.591-6.099-6.099zm13.546 13.546l1.591-1.591 6.099 6.099-1.591 1.591-6.099-6.099zm-1.591-15.137l1.591 1.591-6.099 6.099-1.591-1.591 6.099-6.099zM2.791 19.387l1.591-1.591 6.099 6.099-1.591 1.591-6.099-6.099z" />
      </svg>
    )
  },
  {
    id: "notion",
    name: "Notion",
    category: "Knowledge OS",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.644c-.466-.373-.98-.653-2.146-.56L2.92 2.063c-.42.047-.513.28-.373.42l1.912 1.725zm-.28 3.545v13.541c0 .746.42 1.026 1.213.98l14.195-.84c.793-.047.933-.513.933-1.026V6.867c0-.56-.233-.84-.746-.793L5.066 6.96c-.607.047-.887.28-.887.793zm13.122 1.353c.093.42 0 .84-.42.887l-1.073.233v8.724c-.56.326-1.26.513-1.726.513-.793 0-1.073-.233-1.726-1.073l-4.246-6.625v6.392l1.493.373s0 .7-.887.7l-2.66-.046c-.093-.327.14-.654.513-.747l1.167-.327V9.76l-1.447-.14c-.093-.373.14-.793.653-.84l2.94-.187 4.526 6.812V9.34l-1.353-.14c-.093-.42.233-.747.747-.793l2.566-.14z" />
      </svg>
    )
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Financial Engine",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.54 12.832.54 6.74.54 2.82 3.738 2.82 8.766c0 5.433 5.372 6.84 8.795 8.16 2.386.918 3.356 1.64 3.356 2.651 0 .977-.872 1.512-2.263 1.512-2.392 0-5.32-1.144-7.218-2.296l-.914 5.613c1.782 1.033 4.887 1.694 8.077 1.694 6.29 0 10.38-2.955 10.38-8.196 0-5.528-5.374-7.147-9.057-8.754z" />
      </svg>
    )
  },
  {
    id: "figma",
    name: "Figma",
    category: "UI/UX Design",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm-8 8a4 4 0 0 1 4-4h4v4a4 4 0 0 1-8 0zm0-8a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zm0-8a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zm8-4h4a4 4 0 1 1 0 8h-4V0z" />
      </svg>
    )
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "Deployment Cloud",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 22.525H0l12-21.05 12 21.05z" />
      </svg>
    )
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "E-Commerce",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.78 6.46a.8.8 0 0 0-.67-.2l-2.4.45c-.2-.68-.62-1.74-1.42-2.33C14.15 3.52 13 3.6 12.3 3.84c-.33.12-.55.24-.55.24s-.2-.17-.46-.3c-.8-.4-1.83-.43-2.65-.08-.94.4-1.57 1.34-1.86 2.22l-2.73.5a.8.8 0 0 0-.64.67l-2.1 13.43a.8.8 0 0 0 .78.92h14.5a.8.8 0 0 0 .79-.92l-2.09-13.43c0-.21-.1-.4-.25-.53zM12.64 5.3c.48-.18 1.18-.21 1.83.25.54.39.84 1.13.99 1.74l-2.92.55c.02-.75.05-1.95.1-2.54zm-2.82.72c.2-.59.66-1.22 1.33-1.47.16-.06.33-.1.49-.12-.04.48-.07 1.4-.08 2.07l-2.15.4c.12-.4.26-.67.41-.88zm-2.4 1.8 1.8-.34c.03.65.09 1.63.17 2.45L7.26 10l.16-2.18zm5.2 12.18c-2.38 0-3.34-1.42-3.34-2.44 0-1.76 1.94-2.17 3.29-2.42 1.05-.2 1.48-.48 1.48-.96 0-.64-.52-1.02-1.35-1.02-.98 0-1.47.53-1.53 1.13l-1.63-.3c.22-1.25 1.25-2.22 3.12-2.22 1.8 0 3.03.92 3.03 2.4 0 1.67-1.49 2.1-2.97 2.37-1.12.2-1.8.44-1.8 1.04 0 .61.64.98 1.54.98 1.1 0 1.76-.56 1.92-1.23l1.55.45c-.38 1.3-1.55 2.24-3.3 2.24z" />
      </svg>
    )
  },
  {
    id: "make",
    name: "Make",
    category: "Workflow Automation",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.38 3.498c-.27 0-.511.19-.566.465L9.85 18.986a.58.58 0 0 0 .453.678l4.095.826a.58.58 0 0 0 .682-.455l2.963-15.021a.58.58 0 0 0-.453-.678l-4.096-.826a.6.6 0 0 0-.113-.012zm-5.876.098a.58.58 0 0 0-.516.318L.062 17.697a.575.575 0 0 0 .256.774l3.733 1.877a.58.58 0 0 0 .775-.258l6.926-13.781a.577.577 0 0 0-.256-.776L7.762 3.658a.6.6 0 0 0-.258-.062m11.74.115a.576.576 0 0 0-.576.576v15.426c0 .318.258.578.576.578h4.178a.58.58 0 0 0 .578-.578V4.287a.58.58 0 0 0-.578-.576Z" />
      </svg>
    )
  },
  {
    id: "codex",
    name: "Codex",
    category: "AI Code Engine",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.282 9.821a6 6 0 0 0-.516-4.91a6.05 6.05 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a6 6 0 0 0-3.998 2.9a6.05 6.05 0 0 0 .743 7.097a5.98 5.98 0 0 0 .51 4.911a6.05 6.05 0 0 0 6.515 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.772-4.206a6 6 0 0 0 3.997-2.9a6.06 6.06 0 0 0-.747-7.073M13.26 22.43a4.48 4.48 0 0 1-2.876-1.04l.141-.081l4.779-2.758a.8.8 0 0 0 .392-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494M3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085l4.783 2.759a.77.77 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646M2.34 7.896a4.5 4.5 0 0 1 2.366-1.973V11.6a.77.77 0 0 0 .388.677l5.815 3.354l-2.02 1.168a.08.08 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.08.08 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667m2.01-3.023l-.141-.085l-4.774-2.782a.78.78 0 0 0-.785 0L9.409 9.23V6.897a.07.07 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.8.8 0 0 0-.393.681zm1.097-2.365l2.602-1.5l2.607 1.5v2.999l-2.597 1.5l-2.607-1.5Z" />
      </svg>
    )
  }
];

export const BrandMarquee = () => {
  // Duplicate list twice to ensure seamless, infinite CSS animation loop
  const duplicatedLogos = [...BRAND_LOGOS, ...BRAND_LOGOS];
  const sectionRef = useRef(null);
  const velocityTrackRef = useRef(null);

  useEffect(() => {
    let lastScrollY = window.scrollY || 0;
    let velocityOffset = 0;
    let targetOffset = 0;
    let animId = null;
    let isVisible = true;
    let isRunning = false;

    const startLoop = () => {
      if (!isRunning && isVisible) {
        isRunning = true;
        animId = requestAnimationFrame(updateInertia);
      }
    };

    const stopLoop = () => {
      isRunning = false;
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const onScroll = () => {
      if (!isVisible) return;
      const currentScrollY = window.scrollY || 0;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // When scrolling down, shift slightly left (-delta * 0.4); when scrolling up, shift right
      targetOffset += delta * -0.4;
      // Clamp within subtle, comfortable bounds (-90px to +90px)
      targetOffset = Math.max(-90, Math.min(90, targetOffset));
      startLoop();
    };

    const updateInertia = () => {
      if (!isVisible) {
        stopLoop();
        return;
      }

      // Smooth lerping with momentum decay back to rest
      velocityOffset += (targetOffset - velocityOffset) * 0.085;
      targetOffset *= 0.93; // Exponential decay

      if (velocityTrackRef.current) {
        velocityTrackRef.current.style.transform = `translate3d(${velocityOffset.toFixed(2)}px, 0, 0)`;
      }

      // If motion has settled close to zero, sleep the loop to save CPU & battery
      if (Math.abs(velocityOffset) < 0.04 && Math.abs(targetOffset) < 0.04) {
        if (velocityTrackRef.current) {
          velocityTrackRef.current.style.transform = "translate3d(0px, 0, 0)";
        }
        velocityOffset = 0;
        targetOffset = 0;
        stopLoop();
      } else {
        animId = requestAnimationFrame(updateInertia);
      }
    };

    // Pause entirely when outside viewport
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible) {
        stopLoop();
      }
    }, { rootMargin: "100px 0px" });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      stopLoop();
    };
  }, []);

  return (
    <section ref={sectionRef} className="brand-marquee-section" aria-label="Tools and Technologies Stack">
      <div className="brand-marquee-inner">
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
                  title={`${brand.name} • ${brand.category}`}
                >
                  <span className="brand-marquee-icon-box" aria-hidden="true">
                    <span className="brand-marquee-icon">
                      {brand.icon}
                    </span>
                  </span>
                  <div className="brand-marquee-meta">
                    <span className="brand-marquee-name">{brand.name}</span>
                    <span className="brand-marquee-category">{brand.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

