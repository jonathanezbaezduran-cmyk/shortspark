import { useState, useEffect } from "react";
import Head from "next/head";

const NICHES = ["AI & Technology","Fitness & Health","Finance & Crypto","Gaming","Comedy & Entertainment","Education","Beauty & Fashion","Food & Cooking","Travel","Motivation & Self-help","News & Politics","Music & Dance"];
const GUMROAD_URL = "https://zequielbaez.gumroad.com/l/eajvgh";
const FREE_LIMIT = 3;
const STORAGE_KEY = "ss_uses";
const HISTORY_KEY = "ss_history";
const TESTIMONIALS = [
  { name: "Alex R.", text: "went from 800 avg views to 47K on my last short. the hook score literally changed everything.", score: 91 },
  { name: "Maya T.", text: "I was posting blind for 6 months. first short I tested above 80 got 200K views. not joking.", score: 84 },
  { name: "Carlos V.", text: "the title variations alone are worth it. rewrote my hook and tripled my CTR.", score: 78 },
];

function getUses() {
  if (typeof window === "undefined") return 0;
  try { const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); const today=new Date().toDateString(); return d.date===today?(d.count||0):0; } catch { return 0; }
}
function incrementUses() {
  const today=new Date().toDateString(); const count=getUses()+1;
  localStorage.setItem(STORAGE_KEY,JSON.stringify({date:today,count})); return count;
}
function getHistory() {
  if(typeof window==="undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]"); } catch { return []; }
}
function saveHistory(item) {
  localStorage.setItem(HISTORY_KEY,JSON.stringify([item,...getHistory()].slice(0,20)));
}
function scoreColor(s) { return s>=75?"#22d3ee":s>=50?"#f59e0b":"#f87171"; }
function getStatusMeta(status) {
  const map={HOT:{label:"🔥 HOT",bg:"rgba(239,68,68,0.12)",color:"#f87171",border:"rgba(239,68,68,0.3)"},RISING:{label:"📈 RISING",bg:"rgba(34,211,238,0.12)",color:"#22d3ee",border:"rgba(34,211,238,0.3)"},COOLING:{label:"📉 COOLING",bg:"rgba(245,158,11,0.12)",color:"#f59e0b",border:"rgba(245,158,11,0.3)"},SATURATED:{label:"😐 SATURATED",bg:"rgba(107,114,128,0.12)",color:"#9ca3af",border:"rgba(107,114,128,0.3)"}};
  return map[status]||map.SATURATED;
}

function ScoreRing({value,size=130}) {
  const r=size/2-10,circ=2*Math.PI*r,dash=(value/100)*circ,c=size/2,color=scoreColor(value);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:"block",margin:"0 auto"}}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#1e293b" strokeWidth="9"/>
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="9" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${c} ${c})`} style={{transition:"stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)"}}/>
      <text x={c} y={c-7} textAnchor="middle" fill={color} fontSize="30" fontWeight="700" fontFamily="ui-monospace,monospace">{value}</text>
      <text x={c} y={c+14} textAnchor="middle" fill="#475569" fontSize="12" fontFamily="ui-monospace,monospace">/100</text>
    </svg>
  );
}

function Bar({label,value,color}) {
  return (
    <div style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"12px",padding:"1rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
        <span style={{fontSize:"0.68rem",color:"#64748b",letterSpacing:"0.1em"}}>{label}</span>
        <span style={{fontSize:"0.9rem",fontWeight:"700",color,fontFamily:"ui-monospace,monospace"}}>{value}</span>
      </div>
      <div style={{height:"5px",background:"#1e293b",borderRadius:"999px",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${value}%`,background:color,borderRadius:"999px",transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
    </div>
  );
}

function Timer() {
  const [t,setT]=useState({h:23,m:47,s:0});
  useEffect(()=>{const i=setInterval(()=>setT(t=>{let{h,m,s}=t;s--;if(s<0){s=59;m--;}if(m<0){m=59;h--;}if(h<0){h=23;m=59;s=59;}return{h,m,s};}),1000);return()=>clearInterval(i);},[]);
  const pad=n=>String(n).padStart(2,"0");
  return (
    <div style={{display:"flex",gap:"6px",justifyContent:"center",marginBottom:"1rem"}}>
      {[["h",t.h],["m",t.m],["s",t.s]].map(([l,v])=>(
        <div key={l} style={{background:"#020817",border:"1px solid rgba(34,211,238,0.3)",borderRadius:"8px",padding:"6px 10px",textAlign:"center",minWidth:"48px"}}>
          <div style={{color:"#22d3ee",fontSize:"1.1rem",fontWeight:"700",fontFamily:"ui-monospace,monospace"}}>{pad(v)}</div>
          <div style={{color:"#334155",fontSize:"0.6rem",letterSpacing:"0.1em"}}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function UserCounter() {
  const [count,setCount]=useState(()=>Math.floor(Math.random()*400)+2800);
  useEffect(()=>{const i=setInterval(()=>setCount(c=>c+Math.floor(Math.random()*3)),4000);return()=>clearInterval(i);},[]);
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginBottom:"6px"}}>
      <div style={{display:"flex"}}>{["#f87171","#22d3ee","#a78bfa","#f59e0b"].map((c,i)=><div key={i} style={{width:"18px",height:"18px",borderRadius:"50%",background:c,border:"2px solid #020817",marginLeft:i>0?"-5px":"0"}}/>)}</div>
      <span style={{color:"#64748b",fontSize:"0.72rem"}}><span style={{color:"#22d3ee",fontWeight:"700"}}>{count.toLocaleString()}</span> creators analyzed today</span>
    </div>
  );
}

function ShareButton({result,topic}) {
  const [shared,setShared]=useState(false);
  const share=()=>{
    const text=`🚀 My YouTube Short scored ${result.viral_score}/100 on ShortSpark!\n\nTopic: "${topic}"\nStatus: ${result.trending_status} · Est. views: ${result.estimated_views}\n\nTest your hook free 👉 shortspark.vercel.app`;
    if(navigator.share){navigator.share({text});}else{navigator.clipboard?.writeText(text);setShared(true);setTimeout(()=>setShared(false),2000);}
  };
  return <button onClick={share} style={{background:"rgba(34,211,238,0.08)",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"8px",padding:"0.45rem 0.9rem",color:"#22d3ee",fontFamily:"inherit",fontSize:"0.72rem",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",gap:"5px"}}>{shared?"✓ Copied!":"↗ Share score"}</button>;
}

function HistoryDashboard({history, onReuse}) {
  if(history.length===0) return null;
  const avg=Math.round(history.reduce((s,h)=>s+h.score,0)/history.length);
  const best=history.reduce((b,h)=>h.score>b.score?h:b,history[0]);
  const nicheCounts=history.reduce((acc,h)=>{acc[h.niche]=(acc[h.niche]||0)+1;return acc;},{});
  const topNiche=Object.entries(nicheCounts).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—";
  const hotCount=history.filter(h=>h.status==="HOT"||h.status==="RISING").length;

  return (
    <div style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"14px",padding:"1.25rem 1.5rem",marginBottom:"0.85rem"}}>
      <span style={{fontSize:"0.68rem",color:"#475569",letterSpacing:"0.12em",marginBottom:"1rem",display:"block"}}>📊 YOUR PERFORMANCE DASHBOARD</span>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"0.6rem",marginBottom:"1rem"}}>
        {[
          {label:"AVG SCORE",value:avg,color:scoreColor(avg),suffix:""},
          {label:"BEST SCORE",value:best.score,color:"#22d3ee",suffix:""},
          {label:"HOT/RISING",value:hotCount,color:"#f87171",suffix:`/${history.length}`},
          {label:"TOP NICHE",value:topNiche.split(" ")[0],color:"#a78bfa",suffix:""},
        ].map((stat,i)=>(
          <div key={i} style={{background:"#020817",border:"1px solid #1e293b",borderRadius:"10px",padding:"0.75rem",textAlign:"center"}}>
            <div style={{fontSize:"0.6rem",color:"#475569",letterSpacing:"0.1em",marginBottom:"4px"}}>{stat.label}</div>
            <div style={{fontSize:"1.2rem",fontWeight:"700",color:stat.color,fontFamily:"ui-monospace,monospace"}}>{stat.value}<span style={{fontSize:"0.7rem",color:"#475569"}}>{stat.suffix}</span></div>
          </div>
        ))}
      </div>

      {/* Score trend mini chart */}
      <div style={{marginBottom:"0.75rem"}}>
        <div style={{fontSize:"0.65rem",color:"#475569",letterSpacing:"0.1em",marginBottom:"6px"}}>SCORE TREND (last {Math.min(history.length,10)})</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:"3px",height:"40px"}}>
          {history.slice(0,10).reverse().map((h,i)=>(
            <div key={i} style={{flex:1,background:scoreColor(h.score),borderRadius:"3px 3px 0 0",height:`${(h.score/100)*40}px`,minHeight:"4px",opacity:0.8,transition:"height 0.3s"}} title={`${h.score} — ${h.topic.slice(0,30)}`}/>
          ))}
        </div>
      </div>

      <div style={{fontSize:"0.65rem",color:"#334155",letterSpacing:"0.08em",marginBottom:"0.5rem"}}>RECENT ANALYSES — click to reuse</div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",maxHeight:"180px",overflowY:"auto"}}>
        {history.map((h,i)=>(
          <div key={i} style={{background:"#020817",border:"1px solid #1e293b",borderRadius:"7px",padding:"0.5rem 0.75rem",display:"flex",alignItems:"center",gap:"0.6rem",cursor:"pointer",transition:"background 0.15s"}}
            onClick={()=>onReuse&&onReuse(h.topic,h.niche)}>
            <span style={{color:scoreColor(h.score),fontSize:"0.8rem",fontWeight:"700",fontFamily:"ui-monospace,monospace",flexShrink:0,minWidth:"24px"}}>{h.score}</span>
            <span style={{color:"#e2e8f0",fontSize:"0.75rem",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.topic}</span>
            <span style={{color:"#334155",fontSize:"0.65rem",flexShrink:0}}>{h.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BatchAnalyzer({niche}) {
  const [raw,setRaw]=useState("");
  const [results,setResults]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [copied,setCopied]=useState(null);

  const analyze=async()=>{
    const hooks=raw.split("\n").map(h=>h.trim()).filter(Boolean);
    if(hooks.length===0) return;
    if(hooks.length>10){setError("Max 10 hooks at once");return;}
    setLoading(true);setError(null);setResults(null);
    try{
      const res=await fetch("/api/batch",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hooks,niche})});
      const data=await res.json();
      if(data.error) throw new Error(data.error);
      setResults(data.results||[]);
    }catch(e){setError(e.message||"Failed. Try again.");}
    finally{setLoading(false);}
  };

  const copy=(text,i)=>{navigator.clipboard?.writeText(text).then(()=>{setCopied(i);setTimeout(()=>setCopied(null),1800);});};

  return (
    <div style={{background:"#0a0f1e",border:"1px solid rgba(34,211,238,0.15)",borderRadius:"14px",padding:"1.25rem 1.5rem",marginBottom:"0.85rem"}}>
      <span style={{fontSize:"0.68rem",color:"#22d3ee",letterSpacing:"0.12em",marginBottom:"0.5rem",display:"block"}}>📦 BATCH ANALYZER — paste up to 10 hooks, one per line</span>
      <p style={{color:"#334155",fontSize:"0.7rem",marginBottom:"0.85rem"}}>All ranked by viral score in seconds. Pro feature — unlimited batches.</p>
      <textarea value={raw} onChange={e=>setRaw(e.target.value)} placeholder={"I tried this for 30 days and it changed everything\nTop 5 things nobody tells you about investing\nPOV: you accidentally sent that text to your boss\nThe hack that 10x'd my channel in 2 weeks\nHow to lose weight fast"}
        rows={6} style={{width:"100%",background:"#020817",border:"1px solid #1e293b",borderRadius:"10px",padding:"0.75rem 1rem",color:"#f1f5f9",fontSize:"0.82rem",resize:"vertical",fontFamily:"inherit",lineHeight:"1.7",marginBottom:"0.75rem"}}/>
      {error&&<p style={{color:"#f87171",fontSize:"0.78rem",marginBottom:"0.6rem"}}>⚠ {error}</p>}
      <button onClick={analyze} disabled={!raw.trim()||loading}
        style={{background:raw.trim()&&!loading?"linear-gradient(135deg,#22d3ee,#a78bfa)":"#1e293b",color:raw.trim()&&!loading?"#020817":"#475569",border:"none",borderRadius:"10px",padding:"0.65rem 1.5rem",fontFamily:"inherit",fontSize:"0.82rem",fontWeight:"800",cursor:raw.trim()&&!loading?"pointer":"not-allowed",letterSpacing:"0.06em",width:"100%"}}>
        {loading?"Analyzing all hooks...":"📦 Analyze All Hooks"}
      </button>

      {results&&(
        <div style={{marginTop:"1rem",display:"flex",flexDirection:"column",gap:"0.6rem"}}>
          <div style={{fontSize:"0.65rem",color:"#475569",letterSpacing:"0.1em",marginBottom:"2px"}}>RANKED BY VIRAL POTENTIAL</div>
          {results.map((r,i)=>(
            <div key={i} style={{background:"#020817",border:`1px solid ${i===0?"rgba(34,211,238,0.3)":"#1e293b"}`,borderRadius:"10px",padding:"0.85rem 1rem",position:"relative"}}>
              {i===0&&<span style={{position:"absolute",top:"8px",right:"10px",fontSize:"0.68rem",color:"#22d3ee",fontWeight:"700"}}>🏆 TOP PICK</span>}
              <div style={{display:"flex",alignItems:"flex-start",gap:"0.85rem"}}>
                <div style={{textAlign:"center",flexShrink:0,minWidth:"36px"}}>
                  <div style={{fontSize:"1.4rem",fontWeight:"800",color:scoreColor(r.viral_score),fontFamily:"ui-monospace,monospace",lineHeight:1}}>{r.viral_score}</div>
                  <div style={{fontSize:"0.58rem",color:"#475569"}}>/100</div>
                </div>
                <div style={{flex:1}}>
                  <p style={{color:"#e2e8f0",fontSize:"0.83rem",fontWeight:"600",marginBottom:"5px",lineHeight:"1.4",paddingRight:"60px"}}>{r.hook}</p>
                  <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"6px"}}>
                    {(()=>{const m=getStatusMeta(r.trending_status);return <span style={{fontSize:"0.65rem",padding:"2px 8px",borderRadius:"999px",background:m.bg,color:m.color,border:`1px solid ${m.border}`,fontWeight:"600"}}>{m.label}</span>;})()}
                    <span style={{fontSize:"0.65rem",padding:"2px 8px",borderRadius:"999px",background:"rgba(34,211,238,0.08)",color:"#22d3ee",border:"1px solid rgba(34,211,238,0.15)"}}>~{r.estimated_views} views</span>
                  </div>
                  <p style={{color:"#64748b",fontSize:"0.73rem",lineHeight:"1.5",marginBottom: r.fix?"6px":"0"}}>{r.verdict}</p>
                  {r.fix&&<p style={{color:"#f59e0b",fontSize:"0.72rem",lineHeight:"1.5"}}>💡 Fix: {r.fix}</p>}
                </div>
                <button onClick={()=>copy(r.hook,i)} style={{flexShrink:0,background:"transparent",border:"1px solid #1e293b",borderRadius:"6px",padding:"4px 8px",color:copied===i?"#22d3ee":"#475569",fontFamily:"inherit",fontSize:"0.65rem",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap",alignSelf:"flex-start"}}>
                  {copied===i?"✓":"copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HookGenerator({niche}) {
  const [topic,setTopic]=useState("");
  const [hooks,setHooks]=useState(null);
  const [loading,setLoading]=useState(false);
  const [copied,setCopied]=useState(null);
  const generate=async()=>{
    const t=topic.trim();if(!t||loading)return;
    setLoading(true);setHooks(null);
    try{const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:t,niche,mode:"generate"})});const data=await res.json();setHooks(data.hooks||[]);}
    catch(e){console.error(e);}finally{setLoading(false);}
  };
  const copy=(text,i)=>{navigator.clipboard?.writeText(text).then(()=>{setCopied(i);setTimeout(()=>setCopied(null),1800);});};
  return (
    <div style={{background:"#0a0f1e",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"14px",padding:"1.25rem 1.5rem",marginBottom:"0.85rem"}}>
      <span style={{fontSize:"0.68rem",color:"#a78bfa",letterSpacing:"0.12em",marginBottom:"0.5rem",display:"block"}}>✨ HOOK GENERATOR — give me a topic, I&apos;ll write 5 viral hooks</span>
      <p style={{color:"#334155",fontSize:"0.7rem",marginBottom:"0.85rem"}}>Each hook comes with a score and why it works.</p>
      <div style={{display:"flex",gap:"0.6rem"}}>
        <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")generate();}} placeholder="e.g. 'morning routine', 'AI tools', 'crypto crash'..."
          style={{flex:1,background:"#020817",border:"1px solid #1e293b",borderRadius:"8px",padding:"0.6rem 0.85rem",color:"#f1f5f9",fontSize:"0.85rem",fontFamily:"inherit"}}/>
        <button onClick={generate} disabled={!topic.trim()||loading}
          style={{background:topic.trim()&&!loading?"linear-gradient(135deg,#a78bfa,#22d3ee)":"#1e293b",color:topic.trim()&&!loading?"#020817":"#475569",border:"none",borderRadius:"8px",padding:"0.6rem 1.1rem",fontFamily:"inherit",fontSize:"0.8rem",fontWeight:"800",cursor:topic.trim()&&!loading?"pointer":"not-allowed",whiteSpace:"nowrap"}}>
          {loading?"Generating...":"✨ Generate"}
        </button>
      </div>
      {hooks&&(
        <div style={{marginTop:"1rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
          {hooks.map((h,i)=>(
            <div key={i} onClick={()=>copy(h.hook,i)} style={{background:"#020817",border:`1px solid ${copied===i?"rgba(167,139,250,0.5)":"#1e293b"}`,borderRadius:"8px",padding:"0.75rem 1rem",cursor:"pointer",transition:"border 0.2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                <span style={{color:scoreColor(h.score),fontSize:"0.75rem",fontWeight:"700",fontFamily:"ui-monospace,monospace"}}>{h.score}/100</span>
                <span style={{color:copied===i?"#a78bfa":"#334155",fontSize:"0.68rem"}}>{copied===i?"✓ copied":"copy"}</span>
              </div>
              <p style={{color:"#e2e8f0",fontSize:"0.83rem",lineHeight:"1.5",margin:"0 0 4px"}}>{h.hook}</p>
              <p style={{color:"#475569",fontSize:"0.72rem",margin:0}}>{h.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CompareMode({niche}) {
  const [hooks,setHooks]=useState(["",""]);
  const [results,setResults]=useState([null,null]);
  const [loading,setLoading]=useState([false,false]);
  const analyze=async(idx)=>{
    const t=hooks[idx].trim();if(!t)return;
    const nl=[...loading];nl[idx]=true;setLoading(nl);
    try{const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:t,niche})});const data=await res.json();const nr=[...results];nr[idx]=data;setResults(nr);}
    finally{const nl2=[...loading];nl2[idx]=false;setLoading(nl2);}
  };
  const winner=results[0]&&results[1]?(results[0].viral_score>=results[1].viral_score?0:1):null;
  return (
    <div style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"14px",padding:"1.25rem 1.5rem",marginBottom:"0.85rem"}}>
      <span style={{fontSize:"0.68rem",color:"#475569",letterSpacing:"0.12em",marginBottom:"0.85rem",display:"block"}}>⚔️ COMPARE TWO HOOKS — pick the winner before posting</span>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
        {[0,1].map(idx=>(
          <div key={idx}>
            <textarea value={hooks[idx]} onChange={e=>{const h=[...hooks];h[idx]=e.target.value;setHooks(h);}} placeholder={`Hook ${idx+1}...`} rows={2}
              style={{width:"100%",boxSizing:"border-box",background:"#020817",border:`1px solid ${winner===idx?"rgba(34,211,238,0.5)":"#1e293b"}`,borderRadius:"8px",padding:"0.6rem 0.75rem",color:"#f1f5f9",fontSize:"0.8rem",resize:"none",fontFamily:"inherit"}}/>
            <button onClick={()=>analyze(idx)} disabled={!hooks[idx].trim()||loading[idx]}
              style={{width:"100%",marginTop:"6px",background:hooks[idx].trim()?"linear-gradient(135deg,#22d3ee,#a78bfa)":"#1e293b",color:hooks[idx].trim()?"#020817":"#475569",border:"none",borderRadius:"8px",padding:"0.45rem",fontFamily:"inherit",fontSize:"0.75rem",fontWeight:"700",cursor:hooks[idx].trim()?"pointer":"not-allowed"}}>
              {loading[idx]?"Scanning...":"Analyze"}
            </button>
            {results[idx]&&(
              <div style={{marginTop:"8px",textAlign:"center",padding:"0.75rem",background:"#020817",border:`1px solid ${winner===idx?"rgba(34,211,238,0.4)":"#1e293b"}`,borderRadius:"8px"}}>
                <div style={{fontSize:"1.6rem",fontWeight:"700",color:scoreColor(results[idx].viral_score),fontFamily:"ui-monospace,monospace"}}>{results[idx].viral_score}</div>
                <div style={{fontSize:"0.65rem",color:"#475569",marginBottom:"4px"}}>viral score</div>
                {winner===idx&&<div style={{fontSize:"0.72rem",color:"#22d3ee",fontWeight:"700"}}>🏆 WINNER</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Paywall() {
  return (
    <div style={{background:"linear-gradient(135deg,rgba(34,211,238,0.04),rgba(167,139,250,0.04))",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"16px",padding:"2rem",textAlign:"center",marginTop:"1rem"}}>
      <div style={{fontSize:"1.8rem",marginBottom:"0.5rem"}}>⚡</div>
      <h2 style={{color:"#f1f5f9",fontSize:"1.1rem",fontWeight:"700",margin:"0 0 0.4rem",fontFamily:"ui-monospace,monospace"}}>Free analyses used up</h2>
      <p style={{color:"#64748b",fontSize:"0.82rem",lineHeight:"1.7",margin:"0 0 1rem"}}>Upgrade to <strong style={{color:"#22d3ee"}}>ShortSpark Pro</strong> for unlimited analyses, batch analyzer, hook generator, and history dashboard.</p>
      <p style={{color:"#f59e0b",fontSize:"0.72rem",letterSpacing:"0.1em",marginBottom:"0.5rem"}}>⏰ LAUNCH OFFER EXPIRES IN</p>
      <Timer/>
      <button onClick={()=>window.location.href=GUMROAD_URL} style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020817",border:"none",borderRadius:"10px",padding:"0.85rem 2rem",fontFamily:"ui-monospace,monospace",fontSize:"0.9rem",fontWeight:"800",cursor:"pointer",letterSpacing:"0.05em",width:"100%",marginBottom:"0.75rem"}}>
        Unlock Pro — $9/month
      </button>
      <p style={{color:"#334155",fontSize:"0.68rem",marginBottom:"1.5rem"}}>Cancel anytime · Secure payment via Gumroad</p>
      <div style={{borderTop:"1px solid #1e293b",paddingTop:"1.5rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        {TESTIMONIALS.map((t,i)=>(
          <div key={i} style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"10px",padding:"0.85rem 1rem",textAlign:"left",display:"flex",gap:"0.75rem"}}>
            <div style={{background:`hsl(${i*80+180},60%,55%)`,borderRadius:"50%",width:"30px",height:"30px",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:"700",color:"#020817"}}>{t.name[0]}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                <span style={{color:"#e2e8f0",fontSize:"0.78rem",fontWeight:"600"}}>{t.name}</span>
                <span style={{color:"#22d3ee",fontSize:"0.7rem",fontFamily:"ui-monospace,monospace"}}>scored {t.score}/100</span>
              </div>
              <p style={{color:"#64748b",fontSize:"0.75rem",lineHeight:"1.5",margin:0}}>{t.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShortSpark() {
  const [topic,setTopic]=useState("");
  const [niche,setNiche]=useState("AI & Technology");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState(null);
  const [copied,setCopied]=useState(null);
  const [usesLeft,setUsesLeft]=useState(FREE_LIMIT);
  const [showPaywall,setShowPaywall]=useState(false);
  const [banner,setBanner]=useState(null);
  const [history,setHistory]=useState([]);
  const [activeTab,setActiveTab]=useState("analyze");

  useEffect(()=>{
    setUsesLeft(FREE_LIMIT-getUses());
    setHistory(getHistory());
    const p=new URLSearchParams(window.location.search);
    if(p.get("success")==="true") setBanner({type:"success",msg:"🎉 Welcome to Pro! Unlimited analyses unlocked."});
    if(p.get("canceled")==="true") setBanner({type:"warn",msg:"Payment canceled. You can try again anytime."});
    // expose reuse function for history dashboard
    window._ss_reuse=undefined;
  },[]);

  const analyze=async()=>{
    const t=topic.trim();if(!t||loading)return;
    if(getUses()>=FREE_LIMIT){setShowPaywall(true);return;}
    setLoading(true);setError(null);setResult(null);setShowPaywall(false);
    try{
      const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:t,niche})});
      const data=await res.json();
      if(data.error) throw new Error(data.error);
      const newUses=incrementUses();setUsesLeft(FREE_LIMIT-newUses);setResult(data);
      saveHistory({topic:t,niche,score:data.viral_score,status:data.trending_status,date:new Date().toLocaleDateString()});
      setHistory(getHistory());
    }catch(e){setError(e.message||"Analysis failed. Try again.");}
    finally{setLoading(false);}
  };

  const copyTitle=(text,idx)=>{navigator.clipboard?.writeText(text).then(()=>{setCopied(idx);setTimeout(()=>setCopied(null),1800);});};

  const card={background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"14px",padding:"1.25rem 1.5rem"};
  const lbl={fontSize:"0.68rem",color:"#475569",letterSpacing:"0.12em",marginBottom:"0.75rem",display:"block"};

  const tabs=[
    {id:"analyze",label:"⚡ Analyze"},
    {id:"batch",label:"📦 Batch"},
    {id:"generate",label:"✨ Generator"},
    {id:"compare",label:"⚔️ Compare"},
    {id:"dashboard",label:"📊 Dashboard"},
  ];

  return (
    <>
      <Head>
        <title>ShortSpark — Viral Predictor for YouTube Shorts</title>
        <meta name="description" content="Score your YouTube Shorts hook 0-100 before posting. AI-powered analysis for creators."/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%2322d3ee'/><stop offset='100%25' stop-color='%23a78bfa'/></linearGradient></defs><polygon points='16,2 20,12 30,12 22,19 25,29 16,23 7,29 10,19 2,12 12,12' fill='url(%23g)'/></svg>"/>
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#020817;color:#f1f5f9;font-family:'ui-monospace','SFMono-Regular',monospace}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        textarea:focus,select:focus,input:focus{outline:1px solid #22d3ee!important;border-color:#22d3ee!important}
        textarea::placeholder,input::placeholder{color:#334155}
        .ss-btn:hover{opacity:0.85}.ss-btn:active{transform:scale(0.97)}
        .title-row:hover{background:#1e293b!important;cursor:pointer}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0a0f1e}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}
      `}</style>

      <div style={{maxWidth:"700px",margin:"0 auto",padding:"2rem 1rem 4rem"}}>

        {banner&&<div style={{background:banner.type==="success"?"rgba(34,211,238,0.08)":"rgba(245,158,11,0.08)",border:`1px solid ${banner.type==="success"?"rgba(34,211,238,0.3)":"rgba(245,158,11,0.3)"}`,borderRadius:"10px",padding:"0.75rem 1rem",marginBottom:"1rem",color:banner.type==="success"?"#22d3ee":"#f59e0b",fontSize:"0.82rem",textAlign:"center"}}>{banner.msg}</div>}

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"12px",marginBottom:"8px",animation:"float 3s ease-in-out infinite"}}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient></defs>
              <polygon points="17,2 21,13 32,13 23,20 27,31 17,24 7,31 11,20 2,13 13,13" fill="url(#sg)"/>
            </svg>
            <span style={{fontSize:"2.1rem",fontWeight:"800",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.03em"}}>ShortSpark</span>
          </div>
          <p style={{color:"#475569",fontSize:"0.72rem",letterSpacing:"0.18em",marginBottom:"0.6rem"}}>VIRAL PREDICTION ENGINE FOR YOUTUBE SHORTS · 2026</p>
          <UserCounter/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem",marginTop:"6px"}}>
            {usesLeft>0&&<p style={{color:"#334155",fontSize:"0.7rem"}}>{usesLeft} free {usesLeft===1?"analysis":"analyses"} remaining today</p>}
            <a href="/examples" style={{color:"#475569",fontSize:"0.7rem",textDecoration:"none",borderBottom:"1px dashed #334155"}}>See real examples →</a>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:"0.35rem",marginBottom:"1rem",background:"#0a0f1e",padding:"4px",borderRadius:"12px",border:"1px solid #1e293b",overflowX:"auto"}}>
          {tabs.map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
              style={{flex:"0 0 auto",background:activeTab===tab.id?"linear-gradient(135deg,rgba(34,211,238,0.15),rgba(167,139,250,0.15))":"transparent",border:activeTab===tab.id?"1px solid rgba(34,211,238,0.2)":"1px solid transparent",borderRadius:"8px",padding:"0.5rem 0.75rem",color:activeTab===tab.id?"#22d3ee":"#475569",fontFamily:"inherit",fontSize:"0.7rem",fontWeight:"700",cursor:"pointer",transition:"all 0.2s",letterSpacing:"0.03em",whiteSpace:"nowrap"}}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Niche selector — always visible */}
        <div style={{marginBottom:"0.85rem"}}>
          <select value={niche} onChange={e=>setNiche(e.target.value)} style={{width:"100%",background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"10px",padding:"0.55rem 0.85rem",color:"#94a3b8",fontSize:"0.82rem",fontFamily:"inherit",cursor:"pointer"}}>
            {NICHES.map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {activeTab==="batch"&&<BatchAnalyzer niche={niche}/>}
        {activeTab==="generate"&&<HookGenerator niche={niche}/>}
        {activeTab==="compare"&&<CompareMode niche={niche}/>}
        {activeTab==="dashboard"&&<HistoryDashboard history={history} onReuse={(t,n)=>{setTopic(t);setNiche(n);setActiveTab("analyze");setResult(null);}}/>}

        {/* Analyze Tab */}
        {activeTab==="analyze"&&(
          <>
            <div style={{...card,marginBottom:"1rem",padding:"1.5rem",background:"linear-gradient(135deg,rgba(34,211,238,0.03),rgba(167,139,250,0.02))",border:"1px solid rgba(34,211,238,0.12)"}}>
              <span style={lbl}>YOUR SHORTS TOPIC OR HOOK</span>
              <textarea value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)analyze();}}
                placeholder={'"I let AI control my life for 24 hours and this happened"'}
                rows={3} style={{width:"100%",background:"#020817",border:"1px solid #1e293b",borderRadius:"10px",padding:"0.75rem 1rem",color:"#f1f5f9",fontSize:"0.9rem",resize:"vertical",fontFamily:"inherit",lineHeight:"1.6"}}/>
              <button className="ss-btn" onClick={analyze} disabled={loading}
                style={{width:"100%",marginTop:"1rem",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020817",border:"none",borderRadius:"10px",padding:"0.8rem",fontFamily:"inherit",fontSize:"0.88rem",fontWeight:"800",cursor:"pointer",letterSpacing:"0.08em",transition:"all 0.18s",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",opacity:!topic.trim()||loading?0.5:1}}>
                {loading?<><svg width="16" height="16" viewBox="0 0 16 16" style={{animation:"spin 0.8s linear infinite"}}><circle cx="8" cy="8" r="6" fill="none" stroke="#020817" strokeWidth="2" strokeOpacity="0.3"/><path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#020817" strokeWidth="2" strokeLinecap="round"/></svg>SCANNING…</>:"⚡ ANALYZE HOOK"}
              </button>
              <p style={{fontSize:"0.68rem",color:"#334155",marginTop:"0.5rem"}}>Ctrl+Enter to analyze</p>
            </div>

            {error&&<div style={{...card,border:"1px solid rgba(239,68,68,0.35)",background:"rgba(239,68,68,0.06)",marginBottom:"1rem",color:"#f87171",fontSize:"0.85rem",textAlign:"center"}}>⚠ {error}</div>}
            {showPaywall&&<Paywall/>}
            {loading&&<div style={{textAlign:"center",padding:"3rem 0",animation:"pulse 1.5s ease infinite"}}><div style={{fontSize:"1.5rem",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:"0.75rem"}}>◈ ◈ ◈</div><p style={{color:"#475569",fontSize:"0.75rem",letterSpacing:"0.15em"}}>READING VIRAL PATTERNS…</p></div>}

            {result&&(
              <div style={{display:"flex",flexDirection:"column",gap:"0.85rem",animation:"fadeUp 0.5s ease"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"0.85rem"}}>
                  <div style={{...card,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,rgba(34,211,238,0.04),rgba(167,139,250,0.04))"}}>
                    <span style={lbl}>VIRAL SCORE</span>
                    <ScoreRing value={result.viral_score}/>
                    <span style={{marginTop:"8px",fontSize:"0.72rem",color:scoreColor(result.viral_score),letterSpacing:"0.08em"}}>{result.viral_score>=75?"HIGH POTENTIAL":result.viral_score>=50?"MODERATE":"LOW — NEEDS WORK"}</span>
                  </div>
                  <div style={card}>
                    <span style={lbl}>KEY INSIGHT</span>
                    <p style={{color:"#e2e8f0",fontSize:"0.88rem",lineHeight:"1.65",marginBottom:"1rem"}}>{result.one_liner}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                      {(()=>{const m=getStatusMeta(result.trending_status);return <span style={{fontSize:"0.72rem",padding:"4px 10px",borderRadius:"999px",background:m.bg,color:m.color,border:`1px solid ${m.border}`,fontWeight:"600"}}>{m.label}</span>;})()}
                      <span style={{fontSize:"0.72rem",padding:"4px 10px",borderRadius:"999px",background:"rgba(255,255,255,0.04)",color:"#94a3b8",border:"1px solid #1e293b"}}>Competition: {result.competition_level}</span>
                      <span style={{fontSize:"0.72rem",padding:"4px 10px",borderRadius:"999px",background:"rgba(34,211,238,0.08)",color:"#22d3ee",border:"1px solid rgba(34,211,238,0.2)"}}>~{result.estimated_views} views</span>
                    </div>
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.85rem"}}>
                  <Bar label="HOOK STRENGTH" value={result.hook_strength} color="#a78bfa"/>
                  <Bar label="VIRAL POTENTIAL" value={result.viral_score} color="#22d3ee"/>
                  <Bar label="THUMBNAIL SCORE" value={result.thumbnail_score||70} color="#f59e0b"/>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem"}}>
                  <div style={card}>
                    <span style={lbl}>⏱ OPTIMAL LENGTH</span>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                      <span style={{fontSize:"1.4rem"}}>🎬</span>
                      <span style={{color:"#22d3ee",fontSize:"1rem",fontWeight:"700",fontFamily:"ui-monospace,monospace"}}>{result.optimal_length||"30-45 seconds"}</span>
                    </div>
                    <p style={{color:"#475569",fontSize:"0.7rem",marginTop:"6px"}}>Recommended for this niche</p>
                  </div>
                  <div style={card}>
                    <span style={lbl}># BEST HASHTAGS</span>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                      {(result.hashtags||[]).map((tag,i)=>(
                        <span key={i} onClick={()=>navigator.clipboard?.writeText(tag)} style={{fontSize:"0.7rem",padding:"3px 8px",borderRadius:"999px",background:"rgba(167,139,250,0.08)",color:"#a78bfa",border:"1px solid rgba(167,139,250,0.2)",cursor:"pointer"}}>#{tag.replace(/^#/,"")}</span>
                      ))}
                    </div>
                    <p style={{color:"#475569",fontSize:"0.68rem",marginTop:"6px"}}>Click to copy</p>
                  </div>
                </div>

                <div style={card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}>
                    <span style={{...lbl,marginBottom:0}}>⚡ OPTIMIZED TITLES</span>
                    <ShareButton result={result} topic={topic}/>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                    {result.title_variations.map((t,i)=>(
                      <div key={i} className="title-row" onClick={()=>copyTitle(t,i)} style={{background:"#020817",border:"1px solid #1e293b",borderRadius:"8px",padding:"0.7rem 0.9rem",display:"flex",alignItems:"center",gap:"0.75rem",transition:"background 0.15s"}}>
                        <span style={{color:"#22d3ee",fontSize:"0.7rem",fontWeight:"700",flexShrink:0}}>T{i+1}</span>
                        <span style={{color:"#e2e8f0",fontSize:"0.85rem",flex:1}}>{t}</span>
                        <span style={{color:copied===i?"#22d3ee":"#334155",fontSize:"0.7rem",flexShrink:0,transition:"color 0.2s"}}>{copied===i?"✓ copied":"copy"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem"}}>
                  <div style={card}>
                    <span style={lbl}>✅ STRENGTHS</span>
                    {result.strengths.map((s,i)=><div key={i} style={{display:"flex",gap:"0.55rem",marginBottom:"0.55rem"}}><span style={{color:"#22d3ee",flexShrink:0}}>▸</span><span style={{color:"#cbd5e1",fontSize:"0.8rem",lineHeight:"1.6"}}>{s}</span></div>)}
                  </div>
                  <div style={card}>
                    <span style={lbl}>⚠️ WEAKNESSES</span>
                    {result.weaknesses.map((w,i)=><div key={i} style={{display:"flex",gap:"0.55rem",marginBottom:"0.55rem"}}><span style={{color:"#f59e0b",flexShrink:0}}>▸</span><span style={{color:"#cbd5e1",fontSize:"0.8rem",lineHeight:"1.6"}}>{w}</span></div>)}
                  </div>
                </div>

                <div style={card}>
                  <span style={lbl}>💡 HOW TO MAXIMIZE VIRAL REACH</span>
                  {result.improvements.map((imp,i)=>(
                    <div key={i} style={{display:"flex",gap:"0.75rem",alignItems:"flex-start",background:"#020817",border:"1px solid #1e293b",padding:"0.7rem 0.9rem",borderRadius:"8px",marginBottom:"0.55rem"}}>
                      <span style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020817",borderRadius:"4px",padding:"0px 6px",fontSize:"0.68rem",fontWeight:"800",flexShrink:0,lineHeight:"1.7"}}>{i+1}</span>
                      <span style={{color:"#e2e8f0",fontSize:"0.83rem",lineHeight:"1.6"}}>{imp}</span>
                    </div>
                  ))}
                </div>

                <div style={card}>
                  <span style={lbl}>🕐 BEST POSTING WINDOWS</span>
                  <div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap"}}>
                    {result.best_times.map((t,i)=><span key={i} style={{background:"#020817",border:"1px solid #1e293b",borderRadius:"8px",padding:"0.5rem 1rem",color:"#a78bfa",fontSize:"0.82rem"}}>{t}</span>)}
                  </div>
                </div>

                {usesLeft<=1&&(
                  <div style={{background:"linear-gradient(135deg,rgba(34,211,238,0.05),rgba(167,139,250,0.05))",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"12px",padding:"1.25rem 1.5rem",textAlign:"center"}}>
                    <p style={{color:"#e2e8f0",fontSize:"0.85rem",marginBottom:"0.5rem",fontWeight:"600"}}>{usesLeft===0?"No free analyses left today.":"Last free analysis today."}</p>
                    <p style={{color:"#64748b",fontSize:"0.78rem",marginBottom:"1rem"}}>Upgrade for unlimited + batch analyzer + generator</p>
                    <button className="ss-btn" onClick={()=>window.location.href=GUMROAD_URL} style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020817",border:"none",borderRadius:"8px",padding:"0.6rem 1.5rem",fontFamily:"inherit",fontSize:"0.82rem",fontWeight:"800",cursor:"pointer",letterSpacing:"0.05em"}}>
                      Unlock Pro — $9/month
                    </button>
                  </div>
                )}

                <div style={{textAlign:"center",paddingTop:"0.5rem"}}>
                  <p style={{color:"#1e293b",fontSize:"0.7rem",letterSpacing:"0.1em"}}>SHORTSPARK · POWERED BY CLAUDE AI · SHORTSPARK.NET</p>
                </div>
              </div>
            )}

            {!result&&!loading&&!error&&!showPaywall&&(
              <div style={{textAlign:"center",padding:"3rem 0"}}>
                <div style={{fontSize:"3rem",marginBottom:"1rem",opacity:0.15,animation:"float 3s ease-in-out infinite"}}>◈</div>
                <p style={{fontSize:"0.75rem",letterSpacing:"0.15em",color:"#334155",marginBottom:"0.75rem"}}>ENTER A TOPIC ABOVE TO SCAN ITS VIRAL POTENTIAL</p>
                <a href="/examples" style={{color:"#475569",fontSize:"0.72rem",textDecoration:"none",borderBottom:"1px dashed #334155"}}>See real examples of viral vs flopped hooks →</a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
