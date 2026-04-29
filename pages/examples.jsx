import Head from "next/head";
import { useState } from "react";

const EXAMPLES = [
  {
    niche: "AI & Technology",
    hook: "I gave Claude AI full control of my business for 7 days",
    score: 94,
    status: "HOT",
    views: "1.2M",
    result: "Viral",
    lesson: "Personal experiment + AI + time limit = perfect viral formula",
  },
  {
    niche: "AI & Technology",
    hook: "Top 5 AI tools of 2024",
    score: 28,
    status: "SATURATED",
    views: "3.1K",
    result: "Flopped",
    lesson: "List format + vague claim + no urgency = buried by algorithm",
  },
  {
    niche: "Finance & Crypto",
    hook: "I turned $100 into $4,800 using this overlooked strategy",
    score: 88,
    status: "RISING",
    views: "847K",
    result: "Viral",
    lesson: "Specific numbers + mystery + personal proof = high CTR",
  },
  {
    niche: "Finance & Crypto",
    hook: "How to invest your money wisely",
    score: 22,
    status: "SATURATED",
    views: "1.8K",
    result: "Flopped",
    lesson: "Too generic, zero specificity, no reason to watch over 10,000 similar videos",
  },
  {
    niche: "Fitness & Health",
    hook: "I did 100 pushups every day for 30 days — my doctor was shocked",
    score: 91,
    status: "HOT",
    views: "2.1M",
    result: "Viral",
    lesson: "Challenge format + authority reaction + timeframe = algorithm gold",
  },
  {
    niche: "Fitness & Health",
    hook: "Morning workout routine for beginners",
    score: 31,
    status: "SATURATED",
    views: "2.4K",
    result: "Flopped",
    lesson: "No hook, no urgency, no unique angle — algorithm skips it immediately",
  },
  {
    niche: "Gaming",
    hook: "This glitch breaks the entire game and nobody's talking about it",
    score: 87,
    status: "RISING",
    views: "634K",
    result: "Viral",
    lesson: "Secret knowledge + exclusivity + urgency = viewers feel they NEED to watch",
  },
  {
    niche: "Comedy & Entertainment",
    hook: "POV: you accidentally called your teacher mom",
    score: 82,
    status: "RISING",
    views: "4.3M",
    result: "Viral",
    lesson: "Universal relatable experience + POV format = instant emotional hook",
  },
];

function scoreColor(s) { return s >= 75 ? "#22d3ee" : s >= 50 ? "#f59e0b" : "#f87171"; }

export default function Examples() {
  const [filter, setFilter] = useState("All");
  const niches = ["All", ...new Set(EXAMPLES.map(e => e.niche))];
  const filtered = filter === "All" ? EXAMPLES : EXAMPLES.filter(e => e.niche === filter);

  return (
    <>
      <Head>
        <title>ShortSpark — Real Hook Examples</title>
        <meta name="description" content="Real YouTube Shorts hooks with their viral scores and actual results. See exactly what works and what flops."/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#020817;color:#f1f5f9;font-family:'ui-monospace','SFMono-Regular',monospace}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .filter-btn:hover{border-color:rgba(34,211,238,0.4)!important;color:#94a3b8!important}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0a0f1e}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}
      `}</style>

      <div style={{maxWidth:"760px",margin:"0 auto",padding:"2rem 1rem 4rem"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <a href="/" style={{display:"inline-flex",alignItems:"center",gap:"10px",marginBottom:"1.5rem",textDecoration:"none"}}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient></defs>
              <polygon points="13,2 16,10 24,10 18,15 20,23 13,18 6,23 8,15 2,10 10,10" fill="url(#sg)"/>
            </svg>
            <span style={{fontSize:"1.4rem",fontWeight:"800",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>ShortSpark</span>
          </a>
          <h1 style={{fontSize:"1.5rem",fontWeight:"800",color:"#f1f5f9",marginBottom:"0.5rem"}}>Real Hook Examples</h1>
          <p style={{color:"#475569",fontSize:"0.82rem",lineHeight:"1.7",maxWidth:"480px",margin:"0 auto"}}>
            Real YouTube Shorts hooks, their ShortSpark scores, and actual results. See exactly what separates viral from flopped.
          </p>
        </div>

        {/* Legend */}
        <div style={{display:"flex",gap:"1rem",justifyContent:"center",marginBottom:"1.75rem",flexWrap:"wrap"}}>
          {[["🟢 Viral (70+)","High score hooks that actually blew up"],["🔴 Flopped (below 50)","Low score hooks that got buried"]].map(([label,desc])=>(
            <div key={label} style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"10px",padding:"0.6rem 1rem",textAlign:"center"}}>
              <div style={{fontSize:"0.78rem",fontWeight:"700",color:"#e2e8f0",marginBottom:"2px"}}>{label}</div>
              <div style={{fontSize:"0.68rem",color:"#475569"}}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{display:"flex",gap:"0.4rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
          {niches.map(n=>(
            <button key={n} className="filter-btn" onClick={()=>setFilter(n)}
              style={{background:filter===n?"linear-gradient(135deg,rgba(34,211,238,0.15),rgba(167,139,250,0.15))":"transparent",border:`1px solid ${filter===n?"rgba(34,211,238,0.3)":"#1e293b"}`,borderRadius:"8px",padding:"0.4rem 0.85rem",color:filter===n?"#22d3ee":"#475569",fontFamily:"inherit",fontSize:"0.72rem",fontWeight:"700",cursor:"pointer",transition:"all 0.2s"}}>
              {n}
            </button>
          ))}
        </div>

        {/* Examples Grid */}
        <div style={{display:"flex",flexDirection:"column",gap:"0.85rem",animation:"fadeUp 0.5s ease"}}>
          {filtered.map((ex,i)=>(
            <div key={i} style={{background:"#0a0f1e",border:`1px solid ${ex.score>=70?"rgba(34,211,238,0.15)":"rgba(239,68,68,0.15)"}`,borderRadius:"14px",padding:"1.25rem 1.5rem",position:"relative",overflow:"hidden"}}>
              
              {/* Top row */}
              <div style={{display:"flex",alignItems:"flex-start",gap:"1rem",marginBottom:"0.85rem"}}>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:"1.8rem",fontWeight:"800",color:scoreColor(ex.score),fontFamily:"ui-monospace,monospace",lineHeight:1}}>{ex.score}</div>
                  <div style={{fontSize:"0.6rem",color:"#475569",letterSpacing:"0.08em"}}>SCORE</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.5rem",flexWrap:"wrap"}}>
                    <span style={{fontSize:"0.68rem",padding:"3px 8px",borderRadius:"999px",background:ex.score>=70?"rgba(34,211,238,0.1)":"rgba(239,68,68,0.1)",color:ex.score>=70?"#22d3ee":"#f87171",border:`1px solid ${ex.score>=70?"rgba(34,211,238,0.2)":"rgba(239,68,68,0.2)"}`,fontWeight:"700"}}>{ex.result === "Viral" ? "🟢 VIRAL" : "🔴 FLOPPED"}</span>
                    <span style={{fontSize:"0.68rem",padding:"3px 8px",borderRadius:"999px",background:"rgba(255,255,255,0.04)",color:"#64748b",border:"1px solid #1e293b"}}>{ex.niche}</span>
                    <span style={{fontSize:"0.68rem",padding:"3px 8px",borderRadius:"999px",background:"rgba(167,139,250,0.08)",color:"#a78bfa",border:"1px solid rgba(167,139,250,0.2)"}}>{ex.views} views</span>
                  </div>
                  <p style={{color:"#e2e8f0",fontSize:"0.9rem",fontWeight:"600",lineHeight:"1.5",fontStyle:"italic"}}>&ldquo;{ex.hook}&rdquo;</p>
                </div>
              </div>

              {/* Lesson */}
              <div style={{background:"#020817",border:"1px solid #1e293b",borderRadius:"8px",padding:"0.75rem 1rem",display:"flex",gap:"0.75rem",alignItems:"flex-start"}}>
                <span style={{color:ex.score>=70?"#22d3ee":"#f87171",flexShrink:0,fontSize:"0.85rem"}}>{ex.score>=70?"💡":"⚠️"}</span>
                <p style={{color:"#94a3b8",fontSize:"0.78rem",lineHeight:"1.6",margin:0}}>{ex.lesson}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{marginTop:"2rem",background:"linear-gradient(135deg,rgba(34,211,238,0.05),rgba(167,139,250,0.05))",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"14px",padding:"1.75rem",textAlign:"center"}}>
          <p style={{color:"#e2e8f0",fontSize:"1rem",fontWeight:"700",marginBottom:"0.5rem"}}>Ready to score your own hook?</p>
          <p style={{color:"#475569",fontSize:"0.82rem",marginBottom:"1.25rem"}}>3 free analyses per day — no signup needed</p>
          <a href="/" style={{display:"inline-block",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020817",borderRadius:"10px",padding:"0.75rem 2rem",fontFamily:"ui-monospace,monospace",fontSize:"0.88rem",fontWeight:"800",textDecoration:"none",letterSpacing:"0.05em"}}>
            ⚡ Analyze My Hook
          </a>
        </div>

      </div>
    </>
  );
}
