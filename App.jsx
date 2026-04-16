import { useState, useMemo } from "react";

const TIERS = {
  1: { label: "Platform / Data + AI", color: "#E53935" },
  2: { label: "Analytics / ML / DS", color: "#F57C00" },
  3: { label: "BI / Visualization", color: "#1E88E5" },
  4: { label: "Statistical / Technical", color: "#78909C" },
};

const THREAT_COLORS = {
  CRITICAL: "#E53935",
  HIGH: "#F57C00",
  "MEDIUM-HIGH": "#FBC02D",
  "MODERATE-HIGH": "#FBC02D",
  MODERATE: "#66BB6A",
  LOW: "#78909C",
};

const DIMENSIONS = [
  "Data Access / Integration",
  "Data Prep / Quality",
  "Model Development",
  "AutoML",
  "MLOps / Deployment",
  "GenAI / Agentic AI",
  "Governance / Responsible AI",
  "Decisioning",
  "Visualization / BI",
  "Deployment Flexibility",
  "Industry / Vertical Depth",
  "Open Source / Ecosystem",
  "Pricing / TCO Transparency",
  "Customer Sentiment",
];

const COMPETITORS = [
  {
    name: "SAS Viya",
    tier: 0,
    isSAS: true,
    threat: null,
    scores: [8, 8, 9, 7, 8, 5, 9, 10, 6, 8, 10, 5, 3, 6],
    analyst: {
      gartnerDSML: "Visionary (2025)",
      gartnerDecision: "Leader (2026)",
      forrester: "Leader — AI/ML (Q3 2024)",
      idc: "Leader — MLOps, Decision Intel",
      g2: "4.2/5 (606 reviews)",
    },
    genaiStatus: "Viya Copilot GA Dec 2025; RAM Oct 2025; Agentic AI Accelerator toolkit",
    keyMove: "Intelligent Decisioning GA (May 2025); Hazy acquisition; Viya Copilot GA",
    revenue: "$3B+ (private, profitable 40+ years)",
    threatVector: "—",
    sasAdvantage: "—",
  },
  {
    name: "Databricks",
    tier: 1,
    threat: "CRITICAL",
    scores: [9, 7, 8, 8, 9, 9, 8, 4, 5, 7, 5, 10, 6, 8],
    analyst: {
      gartnerDSML: "Leader #1 (2025)",
      gartnerDecision: "—",
      forrester: "Leader — Data Lakehouses (Q2 2024)",
      idc: "—",
      g2: "4.5/5 (661 reviews)",
    },
    genaiStatus: "Agent Bricks, Mosaic AI Gateway GA, $100M OpenAI partnership, MLflow 3.0, MCP servers",
    keyMove: "$134B valuation; Lakebase GA; Neon acquisition ($1B); IPO expected H2 2026",
    revenue: ">$5.4B ARR, 65%+ YoY",
    threatVector: "#1 DSML MQ; overwhelming momentum; GenAI/agentic leadership; developer gravity",
    sasAdvantage: "Statistical depth, decisioning, fraud/AML, on-prem, regulated industries",
  },
  {
    name: "Palantir",
    tier: 1,
    threat: "HIGH",
    scores: [8, 7, 6, 4, 7, 9, 9, 7, 5, 10, 8, 4, 2, 7],
    analyst: {
      gartnerDSML: "Not evaluated",
      gartnerDecision: "—",
      forrester: "Leader — AI/ML (Q3 2024, #1 Current Offering)",
      idc: "#1 AI Software Platform market share",
      g2: "4.3/5 (54 reviews)",
    },
    genaiStatus: "AIP Agent Studio, AIP Logic, AIP Analyst, AI FDE beta, 1,500+ AIP Bootcamps",
    keyMove: "$10B Army contract; FedRAMP High; $300-490B market cap; Q4 rev +70% YoY",
    revenue: "$4.475B FY2025 (+56% YoY)",
    threatVector: "AIP/agentic AI; government dominance; ontology-driven operational AI",
    sasAdvantage: "Statistical modeling, banking/insurance regulation, pricing, international commercial",
  },
  {
    name: "Snowflake",
    tier: 1,
    threat: "MEDIUM-HIGH",
    scores: [9, 7, 5, 5, 6, 8, 7, 2, 4, 6, 4, 8, 6, 8],
    analyst: {
      gartnerDSML: "Niche Player (2025)",
      gartnerDecision: "—",
      forrester: "—",
      idc: "Leader — Data Clean Room",
      g2: "4.5/5 (2,600+ reviews)",
    },
    genaiStatus: "Cortex Agents GA Nov 2025; Snowflake Intelligence GA Dec 2025; Cortex AI Functions",
    keyMove: "Crunchy Data acquisition (~$250M); Leader in Cloud DBMS MQ; AI = 25% of implementations",
    revenue: "$3.6B+ FY2025; ~$4B ARR",
    threatVector: "Platform gravity; Cortex AI democratizing analytics; 13,300+ customers",
    sasAdvantage: "Statistical depth, decisioning, fraud/risk, on-prem, domain expertise",
  },
  {
    name: "Dataiku",
    tier: 1,
    threat: "HIGH",
    scores: [7, 8, 8, 9, 8, 8, 9, 3, 6, 8, 5, 9, 5, 9],
    analyst: {
      gartnerDSML: "Leader (2025, 4th year)",
      gartnerDecision: "—",
      forrester: "—",
      idc: "Leader — AI Governance (2025-26)",
      g2: "4.8/5 (288 reviews); Customers' Choice",
    },
    genaiStatus: "LLM Mesh (LLM gateway), Agent Hub (Apr 2025), Safe/Quality/Cost Guard",
    keyMove: "IPO preparation (MS + Citi); #1 Product Owner use case in Gartner CC; 96% recommend",
    revenue: "$300M ARR (2024, 20% YoY)",
    threatVector: "Leader in same DSML MQ; LLM Mesh; Agent Hub; governance-first; potential IPO",
    sasAdvantage: "Statistical heritage, Intelligent Decisioning, industry solutions, enterprise scale",
  },
  {
    name: "Alteryx",
    tier: 2,
    threat: "MODERATE",
    scores: [7, 9, 5, 5, 4, 5, 5, 2, 6, 7, 3, 5, 5, 8],
    analyst: {
      gartnerDSML: "Niche Player (2025)",
      gartnerDecision: "—",
      forrester: "—",
      idc: "—",
      g2: "4.6/5 (660 reviews); 92% recommend",
    },
    genaiStatus: "AiDIN AI engine; multi-LLM support (OpenAI, Anthropic, Gemini)",
    keyMove: "Taken private $4.4B (Mar 2024); Alteryx One Platform (May 2025); new CEO",
    revenue: "Private (Clearlake/Insight)",
    threatVector: "Self-service analytics; citizen data science; ease-of-use; lower pricing",
    sasAdvantage: "Enterprise ML depth, statistical rigor, decisioning, scale, governance",
  },
  {
    name: "H2O.ai",
    tier: 2,
    threat: "MODERATE-HIGH",
    scores: [5, 4, 8, 10, 7, 8, 6, 2, 3, 8, 4, 9, 7, 6],
    analyst: {
      gartnerDSML: "Visionary (2025, 3rd year)",
      gartnerDecision: "—",
      forrester: "—",
      idc: "—",
      g2: "4.4/5 (40 reviews)",
    },
    genaiStatus: "h2oGPTe #1 GAIA benchmark (75%); agentic AI features (May 2025); sovereign AI",
    keyMove: "#1 GAIA benchmark; Dell AI Factory validation; AT&T 90% cost reduction",
    revenue: "Private ($256M total funding)",
    threatVector: "#1 GAIA benchmark; best-in-class AutoML; sovereign AI; open-source",
    sasAdvantage: "Platform breadth, decisioning, domain solutions, BI, enterprise scale",
  },
  {
    name: "Altair RapidMiner",
    tier: 2,
    threat: "HIGH",
    scores: [6, 7, 8, 8, 7, 5, 5, 2, 5, 7, 4, 7, 6, 7],
    analyst: {
      gartnerDSML: "Leader (2025, 2nd year)",
      gartnerDecision: "—",
      forrester: "—",
      idc: "—",
      g2: "4.4/5 (450+ reviews)",
    },
    genaiStatus: "AI Studio with agent frameworks; GenAI integration; SAS language execution",
    keyMove: "Siemens $10.6B acquisition (Mar 2025); native SAS code compatibility; Leader DSML MQ",
    revenue: "Siemens subsidiary ($75.9B parent)",
    threatVector: "Leader DSML MQ; native SAS language execution; $10.6B Siemens parent",
    sasAdvantage: "Domain solutions, regulatory compliance, decisioning, brand in regulated verticals",
  },
  {
    name: "Tableau",
    tier: 3,
    threat: "MODERATE-HIGH",
    scores: [5, 5, 2, 1, 2, 7, 4, 1, 10, 7, 3, 5, 5, 8],
    analyst: {
      gartnerDSML: "—",
      gartnerDecision: "—",
      forrester: "Leader — BI (Q2 2025, 'gold standard')",
      idc: "—",
      g2: "4.4/5 (9,227+ reviews)",
    },
    genaiStatus: "Tableau Next (Apr 2025); 3 agentic skills; Tableau Semantics; Tableau Agent",
    keyMove: "Tableau Next GA; Salesforce ecosystem deep integration; Agentforce-powered agents",
    revenue: "Part of Salesforce ($34.9B)",
    threatVector: "Gold standard viz; Salesforce ecosystem; agentic analytics platform",
    sasAdvantage: "Advanced analytics, ML, decisioning, fraud/risk, model governance",
  },
  {
    name: "Power BI / Fabric",
    tier: 3,
    threat: "HIGH",
    scores: [7, 6, 3, 2, 3, 8, 6, 2, 10, 6, 3, 7, 9, 8],
    analyst: {
      gartnerDSML: "Leader (Azure ML)",
      gartnerDecision: "—",
      forrester: "Leader — BI; Leader — Data Fabric; #1 GenAI in BI",
      idc: "—",
      g2: "4.5/5 (3,800+ reviews)",
    },
    genaiStatus: "Copilot GA across Fabric; #1 GenAI in Forrester BI Wave; AI-powered semantic models",
    keyMove: "30M+ MAU; $14/mo pricing; Fabric unifying DE/DW/DS/BI; Leader in Data Fabric",
    revenue: "Part of Microsoft ($245B+)",
    threatVector: "#1 ABI MQ; 30M+ MAU; $14/mo; Fabric expanding into data science",
    sasAdvantage: "Statistical modeling, decisioning, fraud/risk, vertical solutions, model governance",
  },
  {
    name: "Qlik",
    tier: 3,
    threat: "MODERATE",
    scores: [9, 8, 4, 5, 3, 5, 6, 2, 9, 7, 4, 7, 5, 7],
    analyst: {
      gartnerDSML: "—",
      gartnerDecision: "—",
      forrester: "—",
      idc: "—",
      g2: "4.5/5 (1,303 reviews)",
    },
    genaiStatus: "Qlik Answers (NLQ assistant); AutoML; Qlik Staige",
    keyMove: "Dual Gartner Leader (BI + Data Integration, 15th/10th year); Open Lakehouse GA",
    revenue: "Private (Thoma Bravo); 40,000+ customers",
    threatVector: "Dual Gartner Leader; associative engine; CDC/real-time data integration",
    sasAdvantage: "Advanced analytics, statistical depth, decisioning, ML capabilities",
  },
  {
    name: "IBM SPSS",
    tier: 4,
    threat: "LOW",
    scores: [3, 3, 5, 2, 2, 2, 2, 1, 3, 4, 3, 3, 6, 7],
    analyst: {
      gartnerDSML: "— (watsonx is Leader)",
      gartnerDecision: "—",
      forrester: "—",
      idc: "—",
      g2: "4.5/5 (922 reviews)",
    },
    genaiStatus: "AI Output Assistant (watsonx-powered) in v31; plain-language explanations only",
    keyMove: "SPSS 31 (Jun 2025); AI Output Assistant; IBM investing in watsonx not SPSS",
    revenue: "Part of IBM ($61.9B)",
    threatVector: "Academic penetration; point-and-click ease; IBM watsonx halo",
    sasAdvantage: "Cloud-native, MLOps, governance, decisioning, enterprise scale, GenAI",
  },
  {
    name: "Stata",
    tier: 4,
    threat: "LOW",
    scores: [2, 2, 7, 2, 1, 1, 1, 1, 3, 2, 3, 4, 8, 8],
    analyst: {
      gartnerDSML: "Not evaluated",
      gartnerDecision: "—",
      forrester: "—",
      idc: "—",
      g2: "4.5/5 (120+ reviews)",
    },
    genaiStatus: "None — no GenAI features announced",
    keyMove: "Stata 19 (Apr 2025): H2OML Suite (first ML capability); CATE; HDFE",
    revenue: "Private (~200 employees)",
    threatVector: "Econometrics depth; academic stronghold; affordable pricing",
    sasAdvantage: "Enterprise capabilities, cloud, AI/ML breadth, platform, governance",
  },
  {
    name: "MATLAB",
    tier: 4,
    threat: "LOW",
    scores: [3, 2, 7, 4, 4, 5, 2, 1, 6, 4, 6, 5, 5, 7],
    analyst: {
      gartnerDSML: "Niche Player (2025)",
      gartnerDecision: "—",
      forrester: "—",
      idc: "—",
      g2: "4.0/5 (453 reviews)",
    },
    genaiStatus: "MATLAB Copilot (GPT-5 mini); expanded GPU support; C/C++ codegen from Learner apps",
    keyMove: "R2025a/b with Copilot; 1,256 GPU functions; deep learning toolbox expansion",
    revenue: "Private (~6,500 employees; est. $1.5B+)",
    threatVector: "Engineering/simulation dominance; deep learning toolbox; embedded deployment",
    sasAdvantage: "Enterprise analytics, BI, decisioning, data management, non-engineering verticals",
  },
];

const MARKET_PRIORITIES = [
  { rank: 1, dim: "GenAI / Agentic AI", weight: 10, dimIdx: 5 },
  { rank: 2, dim: "Governance / Responsible AI", weight: 9, dimIdx: 6 },
  { rank: 3, dim: "Platform Consolidation", weight: 8, dimIdx: null },
  { rank: 4, dim: "Data Quality & Trust", weight: 7, dimIdx: 1 },
  { rank: 5, dim: "Cloud / Multi-cloud / TCO", weight: 6, dimIdx: 9 },
  { rank: 6, dim: "Ease of Use / Democratization", weight: 5, dimIdx: 13 },
  { rank: 7, dim: "Semantic Layer / Interop", weight: 4, dimIdx: 11 },
];

const TIMELINE = [
  { date: "Oct 2024", vendor: "Altair/Siemens", event: "$10.6B acquisition agreement", tier: 2 },
  { date: "Nov 2024", vendor: "SAS", event: "Hazy acquisition (synthetic data)", tier: 0 },
  { date: "Dec 2024", vendor: "Databricks", event: "Series J: $10B at $62B valuation", tier: 1 },
  { date: "Dec 2024", vendor: "Palantir", event: "FedRAMP High authorization", tier: 1 },
  { date: "Mar 2025", vendor: "H2O.ai", event: "#1 GAIA benchmark (75%)", tier: 2 },
  { date: "Mar 2025", vendor: "Siemens/Altair", event: "Acquisition completed", tier: 2 },
  { date: "Apr 2025", vendor: "Tableau", event: "Tableau Next GA — agentic analytics", tier: 3 },
  { date: "Apr 2025", vendor: "Dataiku", event: "Agent Hub launched", tier: 1 },
  { date: "May 2025", vendor: "SAS", event: "Intelligent Decisioning GA; SAS Innovate", tier: 0 },
  { date: "May 2025", vendor: "Databricks", event: "Neon acquisition ($1B)", tier: 1 },
  { date: "May 2025", vendor: "Gartner", event: "SAS drops to Visionary in DSML MQ", tier: 0 },
  { date: "Jun 2025", vendor: "Databricks", event: "DAIS: Agent Bricks, Lakebase, MLflow 3.0", tier: 1 },
  { date: "Jun 2025", vendor: "Snowflake", event: "Summit: Crunchy Data acq. (~$250M)", tier: 1 },
  { date: "Jul 2025", vendor: "Palantir", event: "$10B U.S. Army Enterprise Agreement", tier: 1 },
  { date: "Sep 2025", vendor: "Databricks", event: "$100M OpenAI partnership", tier: 1 },
  { date: "Oct 2025", vendor: "SAS", event: "Retrieval Agent Manager announced", tier: 0 },
  { date: "Nov 2025", vendor: "Snowflake", event: "Cortex Agents GA", tier: 1 },
  { date: "Dec 2025", vendor: "SAS", event: "Viya Copilot GA (2025.12)", tier: 0 },
  { date: "Dec 2025", vendor: "Databricks", event: "Series L: $134B; >$4.8B rev", tier: 1 },
  { date: "Jan 2026", vendor: "Gartner", event: "SAS named Leader — Decision Intelligence MQ", tier: 0 },
  { date: "Feb 2026", vendor: "Databricks", event: "Lakebase GA; >$5.4B rev, 65%+ YoY", tier: 1 },
  { date: "Apr 2026", vendor: "SAS", event: "SAS Innovate 2026 (scheduled)", tier: 0 },
];

function ScoreBar({ score, max = 10, highlight = false, isSAS = false }) {
  const pct = (score / max) * 100;
  const bg = isSAS
    ? "linear-gradient(90deg, #00B4D8, #0077B6)"
    : highlight
    ? "linear-gradient(90deg, #F57C00, #E53935)"
    : "linear-gradient(90deg, #4a5568, #2d3748)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 90 }}>
      <div
        style={{
          width: 60,
          height: 7,
          background: "#1a1a2e",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: bg,
            borderRadius: 4,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: isSAS ? "#00B4D8" : "#a0aec0",
          fontFamily: "'JetBrains Mono', monospace",
          minWidth: 18,
        }}
      >
        {score}
      </span>
    </div>
  );
}

function ThreatBadge({ level }) {
  if (!level) return null;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.05em",
        color: "#0a0a1a",
        background: THREAT_COLORS[level] || "#78909C",
        textTransform: "uppercase",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {level}
    </span>
  );
}

function TierBadge({ tier }) {
  const t = TIERS[tier];
  if (!t) return <span style={{ fontSize: 10, color: "#00B4D8", fontWeight: 700 }}>SAS VIYA</span>;
  return (
    <span
      style={{
        fontSize: 10,
        color: t.color,
        fontWeight: 600,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      T{tier}
    </span>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 18px",
        background: active ? "#00B4D8" : "transparent",
        color: active ? "#0a0a1a" : "#a0aec0",
        border: active ? "none" : "1px solid #1e293b",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        letterSpacing: "0.02em",
        fontFamily: "'JetBrains Mono', monospace",
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}

function MatrixView({ competitors, sortDim, onSortDim }) {
  const sorted = useMemo(() => {
    if (sortDim === null) return competitors;
    return [...competitors].sort((a, b) => b.scores[sortDim] - a.scores[sortDim]);
  }, [competitors, sortDim]);

  return (
    <div style={{ overflowX: "auto", paddingBottom: 12 }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          fontSize: 11,
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "8px 10px",
                color: "#64748b",
                fontWeight: 600,
                fontSize: 10,
                position: "sticky",
                left: 0,
                background: "#0a0a1a",
                zIndex: 2,
                borderBottom: "1px solid #1e293b",
                minWidth: 130,
              }}
            >
              VENDOR
            </th>
            {DIMENSIONS.map((d, i) => (
              <th
                key={d}
                onClick={() => onSortDim(sortDim === i ? null : i)}
                style={{
                  textAlign: "center",
                  padding: "8px 4px",
                  color: sortDim === i ? "#00B4D8" : "#64748b",
                  fontWeight: 600,
                  fontSize: 9,
                  cursor: "pointer",
                  borderBottom: "1px solid #1e293b",
                  whiteSpace: "nowrap",
                  minWidth: 68,
                  userSelect: "none",
                  letterSpacing: "0.02em",
                  transition: "color 0.2s",
                }}
              >
                {d.split(" / ")[0]}
                {sortDim === i ? " ▼" : ""}
              </th>
            ))}
            <th
              style={{
                textAlign: "center",
                padding: "8px 6px",
                color: "#64748b",
                fontWeight: 600,
                fontSize: 9,
                borderBottom: "1px solid #1e293b",
                minWidth: 50,
              }}
            >
              AVG
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => {
            const avg = (c.scores.reduce((a, b) => a + b, 0) / c.scores.length).toFixed(1);
            return (
              <tr
                key={c.name}
                style={{
                  background: c.isSAS ? "rgba(0,180,216,0.06)" : "transparent",
                }}
              >
                <td
                  style={{
                    padding: "7px 10px",
                    position: "sticky",
                    left: 0,
                    background: c.isSAS ? "rgba(0,180,216,0.08)" : "#0a0a1a",
                    zIndex: 1,
                    borderBottom: "1px solid #111827",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <TierBadge tier={c.tier} />
                  <span
                    style={{
                      fontWeight: c.isSAS ? 700 : 500,
                      color: c.isSAS ? "#00B4D8" : "#e2e8f0",
                      fontSize: 11,
                    }}
                  >
                    {c.name}
                  </span>
                  {c.threat && <ThreatBadge level={c.threat} />}
                </td>
                {c.scores.map((s, i) => {
                  const isBest = sorted.every((other) => s >= other.scores[i]);
                  const isWorst = sorted.every((other) => s <= other.scores[i]);
                  return (
                    <td
                      key={i}
                      style={{
                        textAlign: "center",
                        padding: "7px 4px",
                        borderBottom: "1px solid #111827",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 26,
                          height: 26,
                          borderRadius: 5,
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: "'JetBrains Mono', monospace",
                          background:
                            s >= 9
                              ? "rgba(0,180,216,0.18)"
                              : s >= 7
                              ? "rgba(102,187,106,0.12)"
                              : s <= 3
                              ? "rgba(229,57,53,0.1)"
                              : "transparent",
                          color:
                            c.isSAS && s >= 8
                              ? "#00B4D8"
                              : s >= 9
                              ? "#00B4D8"
                              : s >= 7
                              ? "#66BB6A"
                              : s <= 3
                              ? "#E53935"
                              : "#94a3b8",
                        }}
                      >
                        {s}
                      </span>
                    </td>
                  );
                })}
                <td
                  style={{
                    textAlign: "center",
                    padding: "7px 6px",
                    borderBottom: "1px solid #111827",
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: c.isSAS ? "#00B4D8" : "#e2e8f0",
                    fontSize: 12,
                  }}
                >
                  {avg}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CompetitorCard({ comp, sasScores }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 10,
        padding: 16,
        border: comp.isSAS ? "1px solid rgba(0,180,216,0.3)" : "1px solid #1e293b",
        transition: "border-color 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <TierBadge tier={comp.tier} />
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: comp.isSAS ? "#00B4D8" : "#e2e8f0",
              }}
            >
              {comp.name}
            </span>
            {comp.threat && <ThreatBadge level={comp.threat} />}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {comp.revenue}
          </div>
        </div>
        <div
          style={{
            textAlign: "right",
            fontSize: 10,
            color: "#94a3b8",
            lineHeight: 1.5,
          }}
        >
          <div>{comp.analyst.gartnerDSML !== "—" && `DSML: ${comp.analyst.gartnerDSML}`}</div>
          <div>{comp.analyst.g2 && `G2: ${comp.analyst.g2}`}</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3px 16px",
          marginBottom: 10,
        }}
      >
        {DIMENSIONS.map((d, i) => {
          const delta = comp.scores[i] - sasScores[i];
          return (
            <div
              key={d}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "3px 0",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "#94a3b8",
                  maxWidth: 110,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {d.split(" / ")[0]}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ScoreBar score={comp.scores[i]} isSAS={comp.isSAS} highlight={delta > 0 && !comp.isSAS} />
                {!comp.isSAS && delta !== 0 && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: delta > 0 ? "#E53935" : "#66BB6A",
                      fontFamily: "'JetBrains Mono', monospace",
                      minWidth: 22,
                    }}
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "transparent",
          border: "1px solid #1e293b",
          color: "#64748b",
          padding: "4px 10px",
          borderRadius: 4,
          fontSize: 10,
          cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          width: "100%",
        }}
      >
        {expanded ? "COLLAPSE ▲" : "EXPAND — GenAI, Analyst, Key Moves ▼"}
      </button>

      {expanded && (
        <div style={{ marginTop: 10, fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: "#64748b", fontWeight: 700, fontSize: 10 }}>GENAI STATUS: </span>
            {comp.genaiStatus}
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: "#64748b", fontWeight: 700, fontSize: 10 }}>KEY MOVE: </span>
            {comp.keyMove}
          </div>
          {!comp.isSAS && (
            <>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: "#E53935", fontWeight: 700, fontSize: 10 }}>THREAT VECTOR: </span>
                {comp.threatVector}
              </div>
              <div>
                <span style={{ color: "#66BB6A", fontWeight: 700, fontSize: 10 }}>SAS ADVANTAGE: </span>
                {comp.sasAdvantage}
              </div>
            </>
          )}
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 4,
              fontSize: 10,
            }}
          >
            {Object.entries(comp.analyst).map(([k, v]) =>
              v && v !== "—" ? (
                <div key={k}>
                  <span style={{ color: "#475569" }}>{k}: </span>
                  <span style={{ color: "#cbd5e1" }}>{v}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineView({ events, tierFilter }) {
  const filtered = tierFilter === "all" ? events : events.filter((e) => e.tier === (tierFilter === "sas" ? 0 : parseInt(tierFilter)));
  return (
    <div style={{ position: "relative", paddingLeft: 20 }}>
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 0,
          bottom: 0,
          width: 2,
          background: "linear-gradient(180deg, #00B4D8, #1e293b)",
          borderRadius: 2,
        }}
      />
      {filtered.map((e, i) => {
        const isSAS = e.vendor === "SAS" || e.vendor === "Gartner";
        const tierObj = TIERS[e.tier];
        const dotColor = e.tier === 0 ? "#00B4D8" : tierObj?.color || "#64748b";
        return (
          <div key={i} style={{ position: "relative", marginBottom: 14, paddingLeft: 18 }}>
            <div
              style={{
                position: "absolute",
                left: -1,
                top: 5,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: dotColor,
                border: `2px solid ${dotColor}`,
                boxShadow: isSAS ? `0 0 8px ${dotColor}` : "none",
              }}
            />
            <div
              style={{
                fontSize: 10,
                color: "#64748b",
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 2,
              }}
            >
              {e.date}
            </div>
            <div style={{ fontSize: 12, color: "#e2e8f0" }}>
              <span style={{ color: dotColor, fontWeight: 700 }}>{e.vendor}</span>{" "}
              <span style={{ color: "#94a3b8" }}>— {e.event}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PriorityRadar({ sasScores, competitors }) {
  const priorityDims = MARKET_PRIORITIES.filter((p) => p.dimIdx !== null);
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: "#64748b",
          marginBottom: 12,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        SAS Viya scores on dimensions analysts/buyers weight most heavily
      </div>
      {priorityDims.map((p) => {
        const sasScore = sasScores[p.dimIdx];
        const maxCompScore = Math.max(...competitors.filter((c) => !c.isSAS).map((c) => c.scores[p.dimIdx]));
        const maxCompName = competitors.find((c) => !c.isSAS && c.scores[p.dimIdx] === maxCompScore)?.name;
        const gap = sasScore - maxCompScore;
        return (
          <div key={p.dim} style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <span style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 600 }}>
                #{p.rank} {p.dim}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: gap >= 0 ? "#66BB6A" : "#E53935",
                }}
              >
                SAS {sasScore}/10 {gap >= 0 ? "▲" : "▼"} vs {maxCompName} ({maxCompScore})
              </span>
            </div>
            <div
              style={{
                position: "relative",
                height: 8,
                background: "#1a1a2e",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  height: "100%",
                  width: `${(maxCompScore / 10) * 100}%`,
                  background: "rgba(229,57,53,0.25)",
                  borderRadius: 4,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  height: "100%",
                  width: `${(sasScore / 10) * 100}%`,
                  background: "linear-gradient(90deg, #00B4D8, #0077B6)",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("matrix");
  const [tierFilter, setTierFilter] = useState("all");
  const [sortDim, setSortDim] = useState(null);
  const [timelineTier, setTimelineTier] = useState("all");

  const sasComp = COMPETITORS.find((c) => c.isSAS);
  const sasScores = sasComp.scores;

  const filtered = useMemo(() => {
    if (tierFilter === "all") return COMPETITORS;
    if (tierFilter === "sas") return COMPETITORS.filter((c) => c.isSAS);
    return COMPETITORS.filter((c) => c.isSAS || c.tier === parseInt(tierFilter));
  }, [tierFilter]);

  return (
    <div
      style={{
        background: "#0a0a1a",
        color: "#e2e8f0",
        minHeight: "100vh",
        fontFamily:
          "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "20px 16px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 4,
              height: 28,
              background: "linear-gradient(180deg, #00B4D8, #0077B6)",
              borderRadius: 2,
            }}
          />
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            SAS Viya Competitive Intelligence
          </h1>
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
            fontFamily: "'JetBrains Mono', monospace",
            marginLeft: 14,
          }}
        >
          15 vendors &middot; 14 dimensions &middot; 4 analyst frameworks &middot; Oct 2024 — Apr 2026
          &nbsp;&middot;&nbsp; INTERNAL — Marketing & Product Strategy
        </div>
      </div>

      {/* Quick stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {[
          { label: "DSML MQ 2025", value: "Visionary", sub: "dropped from Leader", color: "#F57C00" },
          { label: "Decision Intel MQ", value: "Leader", sub: "inaugural 2026", color: "#66BB6A" },
          { label: "Forrester AI/ML", value: "Leader", sub: "Q3 2024", color: "#66BB6A" },
          { label: "#1 Threat", value: "Databricks", sub: "$134B · DSML #1", color: "#E53935" },
          { label: "Key Gap", value: "GenAI 5/10", sub: "vs. best-in-class 9/10", color: "#E53935" },
          { label: "Key Moat", value: "Decisioning 10", sub: "no competitor > 7", color: "#00B4D8" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "#111827",
              borderRadius: 8,
              padding: "10px 12px",
              borderLeft: `3px solid ${s.color}`,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#64748b",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                letterSpacing: "0.05em",
                marginBottom: 3,
              }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Nav tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <Tab label="Capability Matrix" active={tab === "matrix"} onClick={() => setTab("matrix")} />
        <Tab label="Competitor Cards" active={tab === "cards"} onClick={() => setTab("cards")} />
        <Tab label="Market Priority Gaps" active={tab === "gaps"} onClick={() => setTab("gaps")} />
        <Tab label="Timeline" active={tab === "timeline"} onClick={() => setTab("timeline")} />
      </div>

      {/* Tier filter (shared for matrix + cards) */}
      {(tab === "matrix" || tab === "cards") && (
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          {[
            { key: "all", label: "All" },
            { key: "1", label: "T1: Platforms" },
            { key: "2", label: "T2: Analytics/ML" },
            { key: "3", label: "T3: BI/Viz" },
            { key: "4", label: "T4: Statistical" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setTierFilter(f.key)}
              style={{
                padding: "4px 10px",
                background: tierFilter === f.key ? "#1e293b" : "transparent",
                color: tierFilter === f.key ? "#e2e8f0" : "#64748b",
                border: "1px solid #1e293b",
                borderRadius: 4,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Matrix View */}
      {tab === "matrix" && (
        <div>
          <div style={{ fontSize: 10, color: "#475569", marginBottom: 8 }}>
            Click any column header to sort. Scores 1–10. <span style={{ color: "#00B4D8" }}>Blue</span> = SAS strengths. <span style={{ color: "#E53935" }}>Red</span> = SAS gaps.
          </div>
          <MatrixView competitors={filtered} sortDim={sortDim} onSortDim={setSortDim} />
        </div>
      )}

      {/* Cards View */}
      {tab === "cards" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: 12,
          }}
        >
          {filtered.map((c) => (
            <CompetitorCard key={c.name} comp={c} sasScores={sasScores} />
          ))}
        </div>
      )}

      {/* Gaps View */}
      {tab === "gaps" && (
        <div style={{ maxWidth: 700 }}>
          <PriorityRadar sasScores={sasScores} competitors={COMPETITORS} />
          <div
            style={{
              marginTop: 20,
              background: "#111827",
              borderRadius: 8,
              padding: 14,
              border: "1px solid #1e293b",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#E53935",
                marginBottom: 8,
              }}
            >
              Critical Watch Items
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7 }}>
              <div style={{ marginBottom: 6 }}>
                <strong style={{ color: "#F57C00" }}>Databricks IPO (H2 2026):</strong> Will amplify competitive pressure; prepare retention materials before S-1.
              </div>
              <div style={{ marginBottom: 6 }}>
                <strong style={{ color: "#F57C00" }}>Dataiku IPO (H1 2026):</strong> Direct DSML Leader competitor going public while SAS is Visionary — acute narrative risk.
              </div>
              <div style={{ marginBottom: 6 }}>
                <strong style={{ color: "#F57C00" }}>Altair RapidMiner + SAS code execution:</strong> Explicit SAS migration play backed by $10.6B Siemens.
              </div>
              <div style={{ marginBottom: 6 }}>
                <strong style={{ color: "#F57C00" }}>Microsoft Fabric data science expansion:</strong> 30M+ Power BI users = largest "good enough" analytics threat.
              </div>
              <div>
                <strong style={{ color: "#F57C00" }}>Palantir financial services push via Accenture/Deloitte:</strong> Could enter SAS's regulatory analytics stronghold.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {tab === "timeline" && (
        <div style={{ maxWidth: 650 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {[
              { key: "all", label: "All" },
              { key: "sas", label: "SAS" },
              { key: "1", label: "T1" },
              { key: "2", label: "T2" },
              { key: "3", label: "T3" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setTimelineTier(f.key)}
                style={{
                  padding: "4px 10px",
                  background: timelineTier === f.key ? "#1e293b" : "transparent",
                  color: timelineTier === f.key ? "#e2e8f0" : "#64748b",
                  border: "1px solid #1e293b",
                  borderRadius: 4,
                  fontSize: 10,
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <TimelineView events={TIMELINE} tierFilter={timelineTier} />
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: 30,
          paddingTop: 14,
          borderTop: "1px solid #1e293b",
          fontSize: 9,
          color: "#475569",
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1.6,
        }}
      >
        Sources: Gartner MQ DSML 2024/2025, Gartner MQ Decision Intelligence 2026, Gartner MQ ABI 2025,
        Gartner MQ Cloud DBMS 2025, Forrester Wave AI/ML Q3 2024, Forrester Wave BI Q2 2025,
        IDC MarketScape MLOps 2024, IDC MarketScape AI Governance 2025–26, G2 &amp; Gartner Peer Insights,
        vendor press releases, SEC filings, CNBC, TechTarget, TechCrunch. Compiled Apr 2026.
        Scores reflect synthesized analyst positioning, product assessment, and customer sentiment — not raw analyst scores.
      </div>
    </div>
  );
}
