import { useState, useEffect } from "react";
import Head from "next/head";

const NICHES = [
  "AI & Technology","Fitness & Health","Finance & Crypto",
  "Gaming","Comedy & Entertainment","Education",
  "Beauty & Fashion","Food & Cooking","Travel",
  "Motivation & Self-help","News & Politics","Music & Dance"
];

const FREE_LIMIT = 3;
const STORAGE_KEY = "ss_uses";

function getUses() {
  if (typeof window === "undefined") return 0;
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const today = new Date().toDateString();
    return d.date === today ? (d.count || 0) : 0;
  } catch { return 0; }
}

function incrementUses() {
  const today = new Date().toDateString();
  const count = getUses() + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count }));
  return count;
}

function scoreColor(s) {
  if (s >= 75) return "#22d3ee";
  if (s >= 50) return "#f59e0b";
  return "#f87171";
}

function getStatusMeta(status) {
  const map = {
    HOT:       { label: "🔥 HOT",       bg:"rgba(239,68,68,0.12)",   color:"#f87171", border:"rgba(239,68,68,0.3)"  },
    RISING:    { label: "📈 RISING",    bg:"rgba(34,211,238,0.12)",  color:"#22d3ee", border:"rgba(34,211,238,0.3)" },
    COOLING:   { label: "📉 COOLING",   bg:"rgba(245,158,11,0.12)",  color:"#f59e0b", border:"rgba(245,158,11,0.3)" },
    SATURATED: { label: "😐 SATURATED", bg:"rgba(107,114,128,0.12)", color:"#9ca3af", border:"rgba(107,114,128,0.3)"},
  };
  return map[status] || map.SATURATED;
}

function ScoreRing({ value, size = 130 }) {
  const r = size/2 - 10, circ = 2*Math.PI*r, dash = (value/100)*circ, c = size/2;
  const color = scoreColor(value);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:"block",margin:"0 auto"}}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#1e293b" strokeWidth="9"/>
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="9"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`}
        style={{transition:"stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)"}}/>
      <text x={c} y={c-7} textAnchor="middle" fill={color} fontSize="30" fontWeight="700" fontFamily="ui-monospace,monospace">{value}</text>
      <text x={c} y={c+14} textAnchor="middle" fill="#475569" fontSize="12" fontFamily="ui-monospace,monospace">/100</text>
    </svg>
  );
}

function Bar({ label, value, color }) {
  return (
    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:"12px",padding:"1rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px",alignItems:"center"}}>
        <span style={{fontSize:"0.68rem",color:"#64748b",letterSpacing:"0.1em"}}>{label}</span>
        <span style={{fontSize:"0.9rem",fontWeight:"700",color,fontFamily:"ui-monospace,monospace"}}>{value}</span>
      </div>
      <div style={{height:"5px",background:"#1e293b",borderRadius:"999px",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${value}%`,background:color,borderRadius:"999px",transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
    </div>
  );
}

function Paywall({ onUpgrade }) {
  const [loading, setLoading] = useState(false);
  const go = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/create-checkout", { method:"POST", headers:{"Content-Type":"application/json"} });
      const d = await r.json();
      if (d.url) window.location.href = d.url;
    } catch { setLoading(false); }
  };
  return (
    <div style={{background:"#0f172a",border:"1px solid rgba(34,211,238,0.3)",borderRadius:"16px",padding:"2.5rem 2rem",textAlign:"center",marginTop:"1rem"}}>
      <div style={{fontSize:"2rem",marginBottom:"1rem"}}>⚡</div>
      <h2 style={{color:"#22d3ee",fontSize:"1.2rem",fontWeight:"700",margin:"0 0 0.5rem",fontFamily:"ui-monospace,monospace",letterSpacing:"-0.02em"}}>Free analyses used up</h2>
      <p style={{color:"#64748b",fontSize:"0.85rem",lineHeight:"1.7",margin:"0 0 1.75rem"}}>
        You&apos;ve used your {FREE_LIMIT} free daily analyses.<br/>
        Upgrade to <strong style={{color:"#e2e8f0"}}>ShortSpark Pro</strong> for unlimited analyses, priority speed, and new features every week.
      </p>
      <button onClick={go} disabled={loading} style={{
        background:"#22d3ee",color:"#020817",border:"none",borderRadius:"10px",
        padding:"0.75rem 2rem",fontFamily:"ui-monospace,monospace",fontSize:"0.9rem",
        fontWeight:"700",cursor:"pointer",letterSpacing:"0.05em",transition:"opacity 0.2s",
        opacity: loading ? 0.7 : 1
      }}>
        {loading ? "Redirecting…" : "Upgrade to Pro — $9/month"}
      </button>
      <p style={{color:"#334155",fontSize:"0.7rem",marginTop:"0.75rem"}}>Cancel anytime · Secure payment via Stripe</p>
    </div>
  );
}

export default function ShortSpark() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche]  = useState("AI & Technology");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);
  const [copied, setCopied]   = useState(null);
  const [usesLeft, setUsesLeft] = useState(FREE_LIMIT);
  const [showPaywall, setShowPaywall] = useState(false);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    setUsesLeft(FREE_LIMIT - getUses());
    const p = new URLSearchParams(window.location.search);
    if (p.get("success") === "true") setBanner({ type:"success", msg:"🎉 Welcome to Pro! Unlimited analyses unlocked." });
    if (p.get("canceled") === "true") setBanner({ type:"warn", msg:"Payment canceled. You can try again anytime." });
  }, []);

  const analyze = async () => {
    const t = topic.trim();
    if (!t || loading) return;
    const uses = getUses();
    if (uses >= FREE_LIMIT) { setShowPaywall(true); return; }

    setLoading(true); setError(null); setResult(null); setShowPaywall(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ topic: t, niche }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const newUses = incrementUses();
      setUsesLeft(FREE_LIMIT - newUses);
      setResult(data);
    } catch(e) {
      setError(e.message || "Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyTitle = (text, idx) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  const card = { background:"#0f172a",border:"1px solid #1e293b",borderRadius:"14px",padding:"1.25rem 1.5rem" };
  const lbl  = { fontSize:"0.68rem",color:"#475569",letterSpacing:"0.12em",marginBottom:"0.75rem",display:"block" };

  return (
    <>
      <Head>
        <title>ShortSpark — Viral Predictor for YouTube Shorts</title>
        <meta name="description" content="Predict the viral score of your YouTube Shorts before you post. AI-powered analysis for creators."/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><polygon points='16,2 20,12 30,12 22,19 25,29 16,23 7,29 10,19 2,12 12,12' fill='%2322d3ee'/></svg>"/>
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#020817;color:#f1f5f9;font-family:'ui-monospace','SFMono-Regular',monospace}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        textarea:focus,select:focus{outline:1px solid #22d3ee!important;border-color:#22d3ee!important}
        textarea::placeholder{color:#334155}
        .ss-btn:hover{opacity:0.85}
        .ss-btn:active{transform:scale(0.97)}
        .title-row:hover{background:#1e293b!important;cursor:pointer}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#0f172a}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}
      `}</style>

      <div style={{maxWidth:"700px",margin:"0 auto",padding:"2rem 1rem 4rem"}}>

        {/* Banner */}
        {banner && (
          <div style={{background: banner.type==="success" ? "rgba(34,211,238,0.08)" : "rgba(245,158,11,0.08)",
            border:`1px solid ${banner.type==="success" ? "rgba(34,211,238,0.3)" : "rgba(245,158,11,0.3)"}`,
            borderRadius:"10px",padding:"0.75rem 1rem",marginBottom:"1rem",
            color: banner.type==="success" ? "#22d3ee" : "#f59e0b",fontSize:"0.82rem",textAlign:"center"}}>
            {banner.msg}
          </div>
        )}

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 17,11 26,11 19,17 22,26 14,20 6,26 9,17 2,11 11,11" fill="#22d3ee" opacity="0.9"/>
            </svg>
            <span style={{fontSize:"1.9rem",fontWeight:"800",color:"#22d3ee",letterSpacing:"-0.03em"}}>ShortSpark</span>
          </div>
          <p style={{color:"#475569",fontSize:"0.72rem",letterSpacing:"0.18em"}}>VIRAL PREDICTION ENGINE FOR YOUTUBE SHORTS · 2026</p>
          {usesLeft > 0 && (
            <p style={{color:"#334155",fontSize:"0.7rem",marginTop:"6px"}}>
              {usesLeft} free {usesLeft===1?"analysis":"analyses"} remaining today
            </p>
          )}
        </div>

        {/* Input Card */}
        <div style={{...card,marginBottom:"1rem",padding:"1.5rem"}}>
          <span style={lbl}>YOUR SHORTS TOPIC OR HOOK</span>
          <textarea value={topic} onChange={e=>setTopic(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&e.ctrlKey) analyze(); }}
            placeholder={'"I let AI control my life for 24 hours and this happened"'}
            rows={3}
            style={{width:"100%",background:"#020817",border:"1px solid #1e293b",borderRadius:"10px",
              padding:"0.75rem 1rem",color:"#f1f5f9",fontSize:"0.9rem",resize:"vertical",
              fontFamily:"inherit",lineHeight:"1.6"}}/>

          <div style={{display:"flex",gap:"0.75rem",marginTop:"1rem",alignItems:"flex-end"}}>
            <div style={{flex:1}}>
              <span style={{...lbl,marginBottom:"0.4rem"}}>NICHE</span>
              <select value={niche} onChange={e=>setNiche(e.target.value)}
                style={{width:"100%",background:"#020817",border:"1px solid #1e293b",
                  borderRadius:"10px",padding:"0.6rem 0.85rem",color:"#f1f5f9",
                  fontSize:"0.85rem",fontFamily:"inherit",cursor:"pointer"}}>
                {NICHES.map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <button className="ss-btn" onClick={analyze} disabled={!topic.trim()||loading}
              style={{background:topic.trim()&&!loading?"#22d3ee":"#1e293b",
                color:topic.trim()&&!loading?"#020817":"#475569",
                border:"none",borderRadius:"10px",padding:"0.62rem 1.4rem",
                fontFamily:"inherit",fontSize:"0.82rem",fontWeight:"700",
                cursor:topic.trim()&&!loading?"pointer":"not-allowed",
                letterSpacing:"0.08em",transition:"all 0.18s",
                display:"flex",alignItems:"center",gap:"8px",whiteSpace:"nowrap",flexShrink:0}}>
              {loading ? <>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{animation:"spin 0.8s linear infinite"}}>
                  <circle cx="8" cy="8" r="6" fill="none" stroke="#0f172a" strokeWidth="2" strokeOpacity="0.3"/>
                  <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round"/>
                </svg>SCANNING…
              </> : "⚡ ANALYZE"}
            </button>
          </div>
          <p style={{fontSize:"0.68rem",color:"#334155",marginTop:"0.5rem"}}>Ctrl+Enter to analyze</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{...card,border:"1px solid rgba(239,68,68,0.35)",background:"rgba(239,68,68,0.06)",
            marginBottom:"1rem",color:"#f87171",fontSize:"0.85rem",textAlign:"center"}}>
            ⚠ {error}
          </div>
        )}

        {/* Paywall */}
        {showPaywall && <Paywall/>}

        {/* Loading */}
        {loading && (
          <div style={{textAlign:"center",padding:"3rem 0",animation:"pulse 1.5s ease infinite"}}>
            <div style={{fontSize:"1.5rem",color:"#22d3ee",marginBottom:"0.75rem"}}>◈ ◈ ◈</div>
            <p style={{color:"#475569",fontSize:"0.75rem",letterSpacing:"0.15em"}}>READING VIRAL PATTERNS…</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{display:"flex",flexDirection:"column",gap:"0.85rem",animation:"fadeUp 0.5s ease"}}>

            <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"0.85rem"}}>
              <div style={{...card,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <span style={lbl}>VIRAL SCORE</span>
                <ScoreRing value={result.viral_score}/>
                <span style={{marginTop:"8px",fontSize:"0.72rem",color:scoreColor(result.viral_score),letterSpacing:"0.08em"}}>
                  {result.viral_score>=75?"HIGH POTENTIAL":result.viral_score>=50?"MODERATE":"LOW — NEEDS WORK"}
                </span>
              </div>
              <div style={card}>
                <span style={lbl}>KEY INSIGHT</span>
                <p style={{color:"#e2e8f0",fontSize:"0.9rem",lineHeight:"1.65",marginBottom:"1rem"}}>{result.one_liner}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                  {(()=>{const m=getStatusMeta(result.trending_status);return(
                    <span style={{fontSize:"0.72rem",padding:"4px 10px",borderRadius:"999px",
                      background:m.bg,color:m.color,border:`1px solid ${m.border}`,fontWeight:"600"}}>
                      {m.label}
                    </span>
                  )})()}
                  <span style={{fontSize:"0.72rem",padding:"4px 10px",borderRadius:"999px",
                    background:"rgba(255,255,255,0.04)",color:"#94a3b8",border:"1px solid #1e293b"}}>
                    Competition: {result.competition_level}
                  </span>
                  <span style={{fontSize:"0.72rem",padding:"4px 10px",borderRadius:"999px",
                    background:"rgba(34,211,238,0.08)",color:"#22d3ee",border:"1px solid rgba(34,211,238,0.2)"}}>
                    ~{result.estimated_views} views
                  </span>
                </div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem"}}>
              <Bar label="HOOK STRENGTH" value={result.hook_strength} color="#a78bfa"/>
              <Bar label="VIRAL POTENTIAL" value={result.viral_score} color="#22d3ee"/>
            </div>

            <div style={card}>
              <span style={lbl}>⚡ OPTIMIZED TITLES — click to copy</span>
              <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                {result.title_variations.map((t,i)=>(
                  <div key={i} className="title-row" onClick={()=>copyTitle(t,i)}
                    style={{background:"#020817",border:"1px solid #1e293b",borderRadius:"8px",
                      padding:"0.7rem 0.9rem",display:"flex",alignItems:"center",gap:"0.75rem",transition:"background 0.15s"}}>
                    <span style={{color:"#22d3ee",fontSize:"0.7rem",fontWeight:"700",flexShrink:0,letterSpacing:"0.05em"}}>T{i+1}</span>
                    <span style={{color:"#e2e8f0",fontSize:"0.85rem",flex:1}}>{t}</span>
                    <span style={{color:copied===i?"#22d3ee":"#334155",fontSize:"0.7rem",flexShrink:0,transition:"color 0.2s"}}>
                      {copied===i?"✓ copied":"copy"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem"}}>
              <div style={card}>
                <span style={lbl}>✅ STRENGTHS</span>
                <div style={{display:"flex",flexDirection:"column",gap:"0.55rem"}}>
                  {result.strengths.map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:"0.55rem",alignItems:"flex-start"}}>
                      <span style={{color:"#22d3ee",flexShrink:0,lineHeight:"1.6"}}>▸</span>
                      <span style={{color:"#cbd5e1",fontSize:"0.8rem",lineHeight:"1.6"}}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={card}>
                <span style={lbl}>⚠️ WEAKNESSES</span>
                <div style={{display:"flex",flexDirection:"column",gap:"0.55rem"}}>
                  {result.weaknesses.map((w,i)=>(
                    <div key={i} style={{display:"flex",gap:"0.55rem",alignItems:"flex-start"}}>
                      <span style={{color:"#f59e0b",flexShrink:0,lineHeight:"1.6"}}>▸</span>
                      <span style={{color:"#cbd5e1",fontSize:"0.8rem",lineHeight:"1.6"}}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={card}>
              <span style={lbl}>💡 HOW TO MAXIMIZE VIRAL REACH</span>
              <div style={{display:"flex",flexDirection:"column",gap:"0.55rem"}}>
                {result.improvements.map((imp,i)=>(
                  <div key={i} style={{display:"flex",gap:"0.75rem",alignItems:"flex-start",
                    background:"#020817",border:"1px solid #1e293b",padding:"0.7rem 0.9rem",borderRadius:"8px"}}>
                    <span style={{background:"#22d3ee",color:"#020817",borderRadius:"4px",
                      padding:"0px 6px",fontSize:"0.68rem",fontWeight:"800",flexShrink:0,lineHeight:"1.7"}}>{i+1}</span>
                    <span style={{color:"#e2e8f0",fontSize:"0.83rem",lineHeight:"1.6"}}>{imp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <span style={lbl}>🕐 BEST POSTING WINDOWS</span>
              <div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap"}}>
                {result.best_times.map((t,i)=>(
                  <span key={i} style={{background:"#020817",border:"1px solid #1e293b",
                    borderRadius:"8px",padding:"0.5rem 1rem",color:"#a78bfa",fontSize:"0.82rem"}}>{t}</span>
                ))}
              </div>
            </div>

            {usesLeft <= 1 && (
              <div style={{background:"rgba(34,211,238,0.05)",border:"1px solid rgba(34,211,238,0.2)",
                borderRadius:"12px",padding:"1.25rem 1.5rem",textAlign:"center"}}>
                <p style={{color:"#22d3ee",fontSize:"0.82rem",marginBottom:"0.75rem"}}>
                  {usesLeft===0?"You've used all free analyses for today.":"Last free analysis today."}
                </p>
                <button className="ss-btn" onClick={async()=>{
                  const r=await fetch("/api/create-checkout",{method:"POST",headers:{"Content-Type":"application/json"}});
                  const d=await r.json(); if(d.url)window.location.href=d.url;
                }} style={{background:"#22d3ee",color:"#020817",border:"none",borderRadius:"8px",
                  padding:"0.55rem 1.25rem",fontFamily:"inherit",fontSize:"0.8rem",
                  fontWeight:"700",cursor:"pointer",letterSpacing:"0.05em"}}>
                  Unlock Pro — $9/month
                </button>
              </div>
            )}

            <div style={{textAlign:"center",paddingTop:"0.5rem"}}>
              <p style={{color:"#334155",fontSize:"0.7rem",letterSpacing:"0.1em"}}>
                SHORTSPARK · POWERED BY CLAUDE AI · SHORTSPARK.NET
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result&&!loading&&!error&&!showPaywall&&(
          <div style={{textAlign:"center",padding:"3rem 0",color:"#1e293b"}}>
            <div style={{fontSize:"3rem",marginBottom:"1rem",opacity:0.4}}>◈</div>
            <p style={{fontSize:"0.75rem",letterSpacing:"0.15em",color:"#334155"}}>
              ENTER A TOPIC ABOVE TO SCAN ITS VIRAL POTENTIAL
            </p>
          </div>
        )}
      </div>
    </>
  );
}
