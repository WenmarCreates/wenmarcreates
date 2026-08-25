import React from "react";

// 1. Lead Growth Area Chart
export const LeadGrowthChart = ({ data }) => {
  if (!data || !data.length) return null;

  const width = 500;
  const height = 200;
  const padding = 30;

  const maxVal = Math.max(...data.map((d) => d.leads), 10);
  const minVal = 0;

  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.leads - minVal) / (maxVal - minVal)) * (height - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`, "");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D3A373" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D3A373" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D3A373" />
            <stop offset="100%" stopColor="#573325" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const y = height - padding - ratio * (height - padding * 2);
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="var(--border-color)"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#areaGradient)" />

        {/* Line stroke */}
        <path d={pathD} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" />

        {/* Data points */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="5" fill="#D3A373" stroke="#573325" strokeWidth="2" />
            <text x={pt.x} y={height - 8} fill="var(--text-subtle)" fontSize="10" textAnchor="middle" fontWeight="700">
              {pt.day}
            </text>
            <text x={pt.x} y={pt.y - 10} fill="var(--text-main)" fontSize="10" fontWeight="800" textAnchor="middle">
              {pt.leads}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// 2. Appointments Bar Chart
export const AppointmentsBarChart = () => {
  const barData = [
    { day: "Mon", count: 18, color: "#D3A373" },
    { day: "Tue", count: 28, color: "#D3A373" },
    { day: "Wed", count: 42, color: "#573325" },
    { day: "Thu", count: 35, color: "#D3A373" },
    { day: "Fri", count: 29, color: "#D3A373" },
    { day: "Sat", count: 12, color: "#EEDCAC" },
    { day: "Sun", count: 8, color: "#EEDCAC" }
  ];

  const maxVal = 50;
  const height = 180;

  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: `${height}px`, gap: "0.5rem", padding: "1rem 0.5rem 0" }}>
      {barData.map((item, idx) => {
        const barHeight = (item.count / maxVal) * (height - 40);
        return (
          <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--text-main)" }}>{item.count}</span>
            <div
              style={{
                width: "80%",
                maxWidth: "32px",
                height: `${barHeight}px`,
                background: item.color,
                borderRadius: "6px 6px 0 0",
                boxShadow: `0 4px 12px ${item.color}44`,
                transition: "height 0.3s ease"
              }}
            ></div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: "700" }}>{item.day}</span>
          </div>
        );
      })}
    </div>
  );
};

// 3. Campaign Performance Multi-bar Chart
export const CampaignPerformanceChart = ({ data }) => {
  if (!data) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {data.map((camp, idx) => (
        <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.825rem", fontWeight: "700" }}>
            <span>{camp.name}</span>
            <span style={{ color: "var(--text-muted)" }}>{camp.reply} replies ({Math.round((camp.reply / camp.sent) * 100)}%)</span>
          </div>
          <div style={{ display: "flex", height: "10px", width: "100%", borderRadius: "var(--radius-full)", overflow: "hidden", background: "var(--bg-tertiary)" }}>
            <div style={{ width: `${(camp.open / camp.sent) * 100}%`, background: "#D3A373" }} title="Opens"></div>
            <div style={{ width: `${(camp.click / camp.sent) * 100}%`, background: "#573325" }} title="Clicks"></div>
            <div style={{ width: `${(camp.reply / camp.sent) * 100}%`, background: "#059669" }} title="Replies"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 4. Channel Distribution Donut Chart
export const ChannelDonutChart = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", flexWrap: "wrap", gap: "1.5rem" }}>
      <svg width="140" height="140" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="38" fill="none" stroke="var(--bg-tertiary)" strokeWidth="14" />
        {/* Chat - 45% */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="#D3A373" strokeWidth="14" strokeDasharray="107 132" strokeDashoffset="0" />
        {/* Voice AI - 30% */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="#573325" strokeWidth="14" strokeDasharray="71 168" strokeDashoffset="-107" />
        {/* Email - 15% */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="#d97706" strokeWidth="14" strokeDasharray="35 204" strokeDashoffset="-178" />
        {/* Social - 10% */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="#059669" strokeWidth="14" strokeDasharray="24 215" strokeDashoffset="-213" />
        <text x="50" y="47" textAnchor="middle" fill="var(--text-main)" fontSize="14" fontWeight="800">890</text>
        <text x="50" y="62" textAnchor="middle" fill="var(--text-subtle)" fontSize="8" fontWeight="700">TOTAL CHATS</text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem", fontWeight: "700" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#D3A373" }}></div>
          <span>Website Chat (45%)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#573325" }}></div>
          <span>Voice AI Calls (30%)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#d97706" }}></div>
          <span>Cold Email (15%)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#059669" }}></div>
          <span>Social DMs (10%)</span>
        </div>
      </div>
    </div>
  );
};
