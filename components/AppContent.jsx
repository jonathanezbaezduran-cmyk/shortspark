import { useState, useEffect } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";

const NICHES = ["AI & Technology","Fitness & Health","Finance & Crypto","Gaming","Comedy & Entertainment","Education","Beauty & Fashion","Food & Cooking","Travel","Motivation & Self-help","News & Politics","Music & Dance"];
const GUMROAD_URL = "https://shortspark.gumroad.com/l/eajvgh";
const FREE_LIMIT = 3;
const STORAGE_KEY = "ss_uses";

const ACHIEVEMENTS = [
  { id: "first", icon: "🎯", title: "First Hook", desc: "Analyze your first hook" },
  { id: "viral", icon: "🚀", title: "Viral Hunter", desc: "Score 80+ on a hook" },
  { id: "perfect", icon: "💎", title: "Perfect Score", desc: "Hit a 95+ score" },
  { id: "explorer", icon: "🗺️", title: "Niche Explorer", desc: "Try 5 different niches" },
  { id: "consistent", icon: "🔥", title: "Consistency King", desc: "3-day streak" },
  { id: "veteran", icon: "👑", title: "Veteran", desc: "Analyze 25 hooks" },
];

function checkAchievements(stats) {
  const earned = [];
  if (stats.history >= 1) earned.push("first");
  if (stats.bestScore >= 80) earned.push("viral");
  if (stats.bestScore >= 95) earned.push("perfect");
  if (stats.uniqueNiches >= 5) earned.push("explorer");
  if (stats.streak >= 3) earned.push("consistent");
  if (stats.history >= 25) earned.push("veteran");
  return earned;
}

function getUses() { if(typeof window==="undefined") return 0; try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");const today=new Date().toDateString();return d.date===today?(d.count||0):0;}catch{return 0;}}
function incrementUses() { const today=new Date().toDateString();const count=getUses()+1;localStorage.setItem(STORAGE_KEY,JSON.stringify({date:today,count}));return count;}
function scoreColor(s) { return s>=75?"#22d3ee":s>=50?"#f59e0b":"#f87171"; }
function getStatusMeta(status) { const map={HOT:{label:"🔥 HOT",bg:"rgba(239,68,68,0.12)",color:"#f87171",border:"rgba(239,68,68,0.3)"},RISING:{label:"📈 RISING",bg:"rgba(34,211,238,0.12)",color:"#22d3ee",border:"rgba(34,211,238,0.3)"},COOLING:{label:"📉 COOLING",bg:"rgba(245,158,11,0.12)",color:"#f59e0b",border:"rgba(245,158,11,0.3)"},SATURATED:{label:"😐 SATURATED",bg:"rgba(107,114,128,0.12)",color:"#9ca3af",border:"rgba(107,114,128,0.3)"}};return map[status]||map.SATURATED;}

function ScoreRing({value,size=130}) {
  const r=size/2-10,circ=2*Math.PI*r,dash=(value/100)*circ,c=size/2,color=scoreColor(value);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:"block",margin:"0 auto"}}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#1e293b" strokeWidth="9"/>
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="9" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${c} ${c})`} style={{transition:"stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)",filter:`drop-shadow(0 0 12px ${color}66)`}}/>
      <text x={c} y={c-7} textAnchor="middle" fill={color} fontSize="30" fontWeight="700" fontFamily="ui-monospace,monospace">{value}</text>
      <text x={c} y={c+14} textAnchor="middle" fill="#475569" fontSize="12" fontFamily="ui-monospace,monospace">/100</text>
    </svg>
  );
}

function Bar({label,value,color}) {
  return (
    <div style={{background:"rgba(15,23,42,0.5)",border:"1px solid #1e293b",borderRadius:"12px",padding:"1rem 1.25rem",backdropFilter:"blur(8px)"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
        <span style={{fontSize:"0.68rem",color:"#64748b",letterSpacing:"0.1em"}}>{label}</span>
        <span style={{fontSize:"0.9rem",fontWeight:"700",color,fontFamily:"ui-monospace,monospace"}}>{value}</span>
      </div>
      <div style={{height:"5px",background:"#1e293b",borderRadius:"999px",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${value}%`,background:color,borderRadius:"999px",transition:"width 1.2s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 12px ${color}99`}}/>
      </div>
    </div>
  );
}

function timeAgo(d) {
  const sec=Math.floor((Date.now()-new Date(d).getTime())/1000);
  if(sec<60) return `${sec}s ago`;
  if(sec<3600) return `${Math.floor(sec/60)}m ago`;
  if(sec<86400) return `${Math.floor(sec/3600)}h ago`;
  return `${Math.floor(sec/86400)}d ago`;
}

function LiveActivityFeed() {
  const [feed,setFeed]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const fetchFeed=async()=>{
      const {data}=await supabase
        .from("analyses")
        .select(`id,topic,niche,score,status,created_at,user_id,profiles!inner(display_name,show_in_feed,show_score,show_niche)`)
        .order("created_at",{ascending:false})
        .limit(8);
      if(data){
        const filtered=data.filter(a=>a.profiles.show_in_feed);
        setFeed(filtered);
      }
      setLoading(false);
    };
    fetchFeed();

    // Subscribe to new analyses
    const channel=supabase.channel("public:analyses").on("postgres_changes",{event:"INSERT",schema:"public",table:"analyses"},async(payload)=>{
      const {data:profile}=await supabase.from("profiles").select("display_name,show_in_feed,show_score,show_niche").eq("id",payload.new.user_id).single();
      if(profile?.show_in_feed){
        setFeed(prev=>[{...payload.new,profiles:profile},...prev].slice(0,8));
      }
    }).subscribe();

    return()=>{supabase.removeChannel(channel);};
  },[]);

  return (
    <div style={{background:"rgba(15,23,42,0.4)",border:"1px solid #1e293b",borderRadius:"14px",padding:"1.1rem 1.25rem",backdropFilter:"blur(8px)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.85rem"}}>
        <span style={{fontSize:"0.66rem",color:"#475569",letterSpacing:"0.12em"}}>📡 LIVE ACTIVITY</span>
        <span style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"0.62rem",color:"#22d3ee"}}>
          <span style={{width:"6px",height:"6px",borderRadius:"50%",background:"#22d3ee",animation:"pulse 1.5s ease infinite"}}/>
          live
        </span>
      </div>
      {loading && <div style={{color:"#475569",fontSize:"0.72rem",textAlign:"center",padding:"0.5rem 0"}}>Loading...</div>}
      {!loading && feed.length===0 && <div style={{color:"#475569",fontSize:"0.72rem",textAlign:"center",padding:"0.75rem 0",lineHeight:"1.5"}}>No activity yet.<br/>Be the first to analyze a hook!</div>}
      <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",maxHeight:"260px",overflowY:"auto"}}>
        {feed.map((item)=>{
          const name=item.profiles.display_name||"Creator";
          const showScore=item.profiles.show_score;
          const showNiche=item.profiles.show_niche;
          return (
            <div key={item.id} style={{fontSize:"0.7rem",color:"#94a3b8",lineHeight:"1.5",animation:"slideIn 0.4s ease",borderBottom:"1px solid rgba(30,41,59,0.5)",paddingBottom:"6px"}}>
              <span style={{color:"#22d3ee",fontWeight:"600"}}>{name}</span> {showScore?<>scored <span style={{color:scoreColor(item.score),fontWeight:"700"}}>{item.score}</span></>:"analyzed a hook"}{showNiche?<> in {item.niche}</>:""}
              <div style={{color:"#475569",fontSize:"0.62rem",marginTop:"2px"}}>{timeAgo(item.created_at)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatsCard({stats}) {
  return (
    <div style={{background:"rgba(15,23,42,0.4)",border:"1px solid #1e293b",borderRadius:"14px",padding:"1.1rem 1.25rem",backdropFilter:"blur(8px)"}}>
      <span style={{fontSize:"0.66rem",color:"#475569",letterSpacing:"0.12em",marginBottom:"0.85rem",display:"block"}}>📊 YOUR STATS</span>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
        <div style={{background:"rgba(2,6,23,0.5)",borderRadius:"10px",padding:"0.6rem",textAlign:"center"}}>
          <div style={{fontSize:"1.3rem",fontWeight:"700",color:scoreColor(stats.avg)||"#475569",fontFamily:"ui-monospace,monospace"}}>{stats.avg||"—"}</div>
          <div style={{fontSize:"0.6rem",color:"#475569",letterSpacing:"0.05em"}}>AVG</div>
        </div>
        <div style={{background:"rgba(2,6,23,0.5)",borderRadius:"10px",padding:"0.6rem",textAlign:"center"}}>
          <div style={{fontSize:"1.3rem",fontWeight:"700",color:"#22d3ee",fontFamily:"ui-monospace,monospace"}}>{stats.bestScore||"—"}</div>
          <div style={{fontSize:"0.6rem",color:"#475569",letterSpacing:"0.05em"}}>BEST</div>
        </div>
        <div style={{background:"rgba(2,6,23,0.5)",borderRadius:"10px",padding:"0.6rem",textAlign:"center"}}>
          <div style={{fontSize:"1.3rem",fontWeight:"700",color:"#a78bfa",fontFamily:"ui-monospace,monospace"}}>{stats.history}</div>
          <div style={{fontSize:"0.6rem",color:"#475569",letterSpacing:"0.05em"}}>HOOKS</div>
        </div>
        <div style={{background:"rgba(2,6,23,0.5)",borderRadius:"10px",padding:"0.6rem",textAlign:"center"}}>
          <div style={{fontSize:"1.3rem",fontWeight:"700",color:"#f59e0b",fontFamily:"ui-monospace,monospace"}}>{stats.streak}🔥</div>
          <div style={{fontSize:"0.6rem",color:"#475569",letterSpacing:"0.05em"}}>STREAK</div>
        </div>
      </div>
    </div>
  );
}

function TrendingFeed({niche}) {
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(false);
  const fetchTrending=async()=>{setLoading(true);setData(null);try{const res=await fetch("/api/trending",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({niche})});const d=await res.json();setData(d.trending||[]);}catch(e){console.error(e);}finally{setLoading(false);}};
  useEffect(()=>{fetchTrending();},[niche]);
  return (
    <div style={{background:"rgba(15,23,42,0.4)",border:"1px solid #1e293b",borderRadius:"14px",padding:"1.1rem 1.25rem",backdropFilter:"blur(8px)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.85rem"}}>
        <span style={{fontSize:"0.66rem",color:"#475569",letterSpacing:"0.12em"}}>🌡️ TRENDING NOW</span>
        <button onClick={fetchTrending} disabled={loading} style={{background:"transparent",border:"none",color:"#22d3ee",fontSize:"0.65rem",cursor:loading?"wait":"pointer",fontFamily:"inherit"}}>{loading?"...":"↻ refresh"}</button>
      </div>
      {loading&&<div style={{textAlign:"center",padding:"1rem",color:"#475569",fontSize:"0.7rem"}}>Scanning...</div>}
      {data&&(
        <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
          {data.slice(0,4).map((t,i)=>(
            <div key={i} style={{background:"rgba(2,6,23,0.5)",border:"1px solid #1e293b",borderRadius:"8px",padding:"0.55rem 0.75rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"3px"}}>
                <span style={{fontSize:"0.62rem",color:"#22d3ee"}}>{t.velocity}</span>
                <span style={{fontSize:"0.62rem",color:"#475569"}}>{t.heat}/100</span>
              </div>
              <p style={{color:"#cbd5e1",fontSize:"0.74rem",lineHeight:"1.4",margin:"0 0 3px"}}>{t.topic}</p>
              <p style={{color:"#475569",fontSize:"0.6rem",margin:0}}>⏱ {t.window}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AchievementsCard({earnedIds}) {
  return (
    <div style={{background:"rgba(15,23,42,0.4)",border:"1px solid #1e293b",borderRadius:"14px",padding:"1.1rem 1.25rem",backdropFilter:"blur(8px)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.85rem"}}>
        <span style={{fontSize:"0.66rem",color:"#475569",letterSpacing:"0.12em"}}>🏆 ACHIEVEMENTS</span>
        <span style={{fontSize:"0.62rem",color:"#a78bfa"}}>{earnedIds.length}/{ACHIEVEMENTS.length}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.4rem"}}>
        {ACHIEVEMENTS.map(a=>{
          const got=earnedIds.includes(a.id);
          return (
            <div key={a.id} title={`${a.title} — ${a.desc}`} style={{background:"rgba(2,6,23,0.5)",border:`1px solid ${got?"rgba(34,211,238,0.3)":"#1e293b"}`,borderRadius:"8px",padding:"0.5rem",textAlign:"center",opacity:got?1:0.35,filter:got?"none":"grayscale(1)",transition:"all 0.3s",cursor:"help"}}>
              <div style={{fontSize:"1.3rem",marginBottom:"2px"}}>{a.icon}</div>
              <div style={{fontSize:"0.55rem",color:got?"#cbd5e1":"#475569",lineHeight:"1.2"}}>{a.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sidebar({stats,earned,niche}) {
  return (
    <aside style={{display:"flex",flexDirection:"column",gap:"0.85rem",position:"sticky",top:"1rem"}}>
      <StatsCard stats={stats}/>
      <LiveActivityFeed/>
      <TrendingFeed niche={niche}/>
      <AchievementsCard earnedIds={earned}/>
    </aside>
  );
}

function Timer() {
  const [t,setT]=useState({h:23,m:47,s:0});
  useEffect(()=>{const i=setInterval(()=>setT(t=>{let{h,m,s}=t;s--;if(s<0){s=59;m--;}if(m<0){m=59;h--;}if(h<0){h=23;m=59;s=59;}return{h,m,s};}),1000);return()=>clearInterval(i);},[]);
  const pad=n=>String(n).padStart(2,"0");
  return (<div style={{display:"flex",gap:"6px",justifyContent:"center",marginBottom:"1rem"}}>{[["h",t.h],["m",t.m],["s",t.s]].map(([l,v])=>(<div key={l} style={{background:"#020817",border:"1px solid rgba(34,211,238,0.3)",borderRadius:"8px",padding:"6px 10px",textAlign:"center",minWidth:"48px"}}><div style={{color:"#22d3ee",fontSize:"1.1rem",fontWeight:"700",fontFamily:"ui-monospace,monospace"}}>{pad(v)}</div><div style={{color:"#334155",fontSize:"0.6rem"}}>{l}</div></div>))}</div>);
}

function Paywall() {
  return (
    <div style={{background:"linear-gradient(135deg,rgba(34,211,238,0.04),rgba(167,139,250,0.04))",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"16px",padding:"2rem",textAlign:"center",marginTop:"1rem"}}>
      <div style={{fontSize:"1.8rem",marginBottom:"0.5rem"}}>⚡</div>
      <h2 style={{color:"#f1f5f9",fontSize:"1.1rem",fontWeight:"700",margin:"0 0 0.4rem"}}>Free analyses used up</h2>
      <p style={{color:"#64748b",fontSize:"0.82rem",lineHeight:"1.7",margin:"0 0 1rem"}}>Upgrade to <strong style={{color:"#22d3ee"}}>ShortSpark Pro</strong> for unlimited everything.</p>
      <p style={{color:"#f59e0b",fontSize:"0.72rem",letterSpacing:"0.1em",marginBottom:"0.5rem"}}>⏰ LAUNCH OFFER EXPIRES IN</p>
      <Timer/>
      <button onClick={()=>window.location.href=GUMROAD_URL} style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020617",border:"none",borderRadius:"10px",padding:"0.85rem 2rem",fontFamily:"inherit",fontSize:"0.9rem",fontWeight:"800",cursor:"pointer",letterSpacing:"0.05em",width:"100%"}}>Unlock Pro — $9/month</button>
    </div>
  );
}

function ShareButton({result,topic}) {
  const [shared,setShared]=useState(false);
  const share=()=>{const text=`🚀 My YouTube Short scored ${result.viral_score}/100 on ShortSpark!\n\nTopic: "${topic}"\nStatus: ${result.trending_status} · Est. views: ${result.estimated_views}\n\nTest your hook free 👉 shortspark.net`;if(navigator.share){navigator.share({text});}else{navigator.clipboard?.writeText(text);setShared(true);setTimeout(()=>setShared(false),2000);}};
  return <button onClick={share} style={{background:"rgba(34,211,238,0.08)",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"8px",padding:"0.45rem 0.9rem",color:"#22d3ee",fontFamily:"inherit",fontSize:"0.72rem",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",gap:"5px"}}>{shared?"✓ Copied!":"↗ Share"}</button>;
}

function BatchAnalyzer({niche}) {
  const [raw,setRaw]=useState("");const [results,setResults]=useState(null);const [loading,setLoading]=useState(false);const [error,setError]=useState(null);const [copied,setCopied]=useState(null);
  const analyze=async()=>{const hooks=raw.split("\n").map(h=>h.trim()).filter(Boolean);if(hooks.length===0)return;if(hooks.length>10){setError("Max 10 hooks");return;}setLoading(true);setError(null);setResults(null);try{const res=await fetch("/api/batch",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hooks,niche})});const data=await res.json();if(data.error)throw new Error(data.error);setResults(data.results||[]);}catch(e){setError(e.message);}finally{setLoading(false);}};
  const copy=(text,i)=>{navigator.clipboard?.writeText(text).then(()=>{setCopied(i);setTimeout(()=>setCopied(null),1800);});};
  return (
    <div style={{background:"rgba(15,23,42,0.4)",border:"1px solid rgba(34,211,238,0.15)",borderRadius:"14px",padding:"1.25rem 1.5rem",marginBottom:"0.85rem",backdropFilter:"blur(8px)"}}>
      <span style={{fontSize:"0.68rem",color:"#22d3ee",letterSpacing:"0.12em",marginBottom:"0.5rem",display:"block"}}>📦 BATCH ANALYZER — paste up to 10 hooks</span>
      <textarea value={raw} onChange={e=>setRaw(e.target.value)} placeholder={"hook 1\nhook 2..."} rows={6} style={{width:"100%",background:"rgba(2,6,23,0.6)",border:"1px solid #1e293b",borderRadius:"10px",padding:"0.75rem 1rem",color:"#f1f5f9",fontSize:"0.82rem",resize:"vertical",fontFamily:"inherit",lineHeight:"1.7",marginBottom:"0.75rem"}}/>
      {error&&<p style={{color:"#f87171",fontSize:"0.78rem",marginBottom:"0.6rem"}}>⚠ {error}</p>}
      <button onClick={analyze} disabled={!raw.trim()||loading} style={{background:raw.trim()&&!loading?"linear-gradient(135deg,#22d3ee,#a78bfa)":"#1e293b",color:raw.trim()&&!loading?"#020817":"#475569",border:"none",borderRadius:"10px",padding:"0.65rem 1.5rem",fontFamily:"inherit",fontSize:"0.82rem",fontWeight:"800",cursor:raw.trim()&&!loading?"pointer":"not-allowed",letterSpacing:"0.06em",width:"100%"}}>{loading?"Analyzing...":"📦 Analyze All"}</button>
      {results&&(
        <div style={{marginTop:"1rem",display:"flex",flexDirection:"column",gap:"0.6rem"}}>
          {results.map((r,i)=>(
            <div key={i} style={{background:"rgba(2,6,23,0.6)",border:`1px solid ${i===0?"rgba(34,211,238,0.3)":"#1e293b"}`,borderRadius:"10px",padding:"0.85rem 1rem",position:"relative"}}>
              {i===0&&<span style={{position:"absolute",top:"8px",right:"10px",fontSize:"0.68rem",color:"#22d3ee",fontWeight:"700"}}>🏆 TOP</span>}
              <div style={{display:"flex",alignItems:"flex-start",gap:"0.85rem"}}>
                <div style={{textAlign:"center",flexShrink:0,minWidth:"36px"}}><div style={{fontSize:"1.4rem",fontWeight:"800",color:scoreColor(r.viral_score),fontFamily:"ui-monospace,monospace"}}>{r.viral_score}</div></div>
                <div style={{flex:1}}>
                  <p style={{color:"#e2e8f0",fontSize:"0.83rem",fontWeight:"600",marginBottom:"5px",paddingRight:"50px"}}>{r.hook}</p>
                  <p style={{color:"#64748b",fontSize:"0.73rem",lineHeight:"1.5",marginBottom:r.fix?"6px":0}}>{r.verdict}</p>
                  {r.fix&&<p style={{color:"#f59e0b",fontSize:"0.72rem",lineHeight:"1.5"}}>💡 {r.fix}</p>}
                </div>
                <button onClick={()=>copy(r.hook,i)} style={{flexShrink:0,background:"transparent",border:"1px solid #1e293b",borderRadius:"6px",padding:"4px 8px",color:copied===i?"#22d3ee":"#475569",fontFamily:"inherit",fontSize:"0.65rem",cursor:"pointer"}}>{copied===i?"✓":"copy"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HookGenerator({niche}) {
  const [topic,setTopic]=useState("");const [hooks,setHooks]=useState(null);const [loading,setLoading]=useState(false);const [copied,setCopied]=useState(null);
  const generate=async()=>{const t=topic.trim();if(!t||loading)return;setLoading(true);setHooks(null);try{const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:t,niche,mode:"generate"})});const data=await res.json();setHooks(data.hooks||[]);}catch(e){console.error(e);}finally{setLoading(false);}};
  const copy=(text,i)=>{navigator.clipboard?.writeText(text).then(()=>{setCopied(i);setTimeout(()=>setCopied(null),1800);});};
  return (
    <div style={{background:"rgba(15,23,42,0.4)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"14px",padding:"1.25rem 1.5rem",marginBottom:"0.85rem",backdropFilter:"blur(8px)"}}>
      <span style={{fontSize:"0.68rem",color:"#a78bfa",letterSpacing:"0.12em",marginBottom:"0.5rem",display:"block"}}>✨ HOOK GENERATOR</span>
      <div style={{display:"flex",gap:"0.6rem"}}>
        <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")generate();}} placeholder="e.g. 'morning routine'..." style={{flex:1,background:"rgba(2,6,23,0.6)",border:"1px solid #1e293b",borderRadius:"8px",padding:"0.6rem 0.85rem",color:"#f1f5f9",fontSize:"0.85rem",fontFamily:"inherit"}}/>
        <button onClick={generate} disabled={!topic.trim()||loading} style={{background:topic.trim()&&!loading?"linear-gradient(135deg,#a78bfa,#22d3ee)":"#1e293b",color:topic.trim()&&!loading?"#020617":"#475569",border:"none",borderRadius:"8px",padding:"0.6rem 1.1rem",fontFamily:"inherit",fontSize:"0.8rem",fontWeight:"800",cursor:topic.trim()&&!loading?"pointer":"not-allowed",whiteSpace:"nowrap"}}>{loading?"...":"✨ Generate"}</button>
      </div>
      {hooks&&(
        <div style={{marginTop:"1rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
          {hooks.map((h,i)=>(
            <div key={i} onClick={()=>copy(h.hook,i)} style={{background:"rgba(2,6,23,0.6)",border:`1px solid ${copied===i?"rgba(167,139,250,0.5)":"#1e293b"}`,borderRadius:"8px",padding:"0.75rem 1rem",cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}><span style={{color:scoreColor(h.score),fontSize:"0.75rem",fontWeight:"700",fontFamily:"ui-monospace,monospace"}}>{h.score}/100</span><span style={{color:copied===i?"#a78bfa":"#334155",fontSize:"0.68rem"}}>{copied===i?"✓":"copy"}</span></div>
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
  const [hooks,setHooks]=useState(["",""]);const [results,setResults]=useState([null,null]);const [loading,setLoading]=useState([false,false]);
  const analyze=async(idx)=>{const t=hooks[idx].trim();if(!t)return;const nl=[...loading];nl[idx]=true;setLoading(nl);try{const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:t,niche})});const data=await res.json();const nr=[...results];nr[idx]=data;setResults(nr);}finally{const nl2=[...loading];nl2[idx]=false;setLoading(nl2);}};
  const winner=results[0]&&results[1]?(results[0].viral_score>=results[1].viral_score?0:1):null;
  return (
    <div style={{background:"rgba(15,23,42,0.4)",border:"1px solid #1e293b",borderRadius:"14px",padding:"1.25rem 1.5rem",marginBottom:"0.85rem",backdropFilter:"blur(8px)"}}>
      <span style={{fontSize:"0.68rem",color:"#475569",letterSpacing:"0.12em",marginBottom:"0.85rem",display:"block"}}>⚔️ COMPARE TWO HOOKS</span>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
        {[0,1].map(idx=>(
          <div key={idx}>
            <textarea value={hooks[idx]} onChange={e=>{const h=[...hooks];h[idx]=e.target.value;setHooks(h);}} placeholder={`Hook ${idx+1}...`} rows={2} style={{width:"100%",boxSizing:"border-box",background:"rgba(2,6,23,0.6)",border:`1px solid ${winner===idx?"rgba(34,211,238,0.5)":"#1e293b"}`,borderRadius:"8px",padding:"0.6rem 0.75rem",color:"#f1f5f9",fontSize:"0.8rem",resize:"none",fontFamily:"inherit"}}/>
            <button onClick={()=>analyze(idx)} disabled={!hooks[idx].trim()||loading[idx]} style={{width:"100%",marginTop:"6px",background:hooks[idx].trim()?"linear-gradient(135deg,#22d3ee,#a78bfa)":"#1e293b",color:hooks[idx].trim()?"#020817":"#475569",border:"none",borderRadius:"8px",padding:"0.45rem",fontFamily:"inherit",fontSize:"0.75rem",fontWeight:"700",cursor:hooks[idx].trim()?"pointer":"not-allowed"}}>{loading[idx]?"...":"Analyze"}</button>
            {results[idx]&&(<div style={{marginTop:"8px",textAlign:"center",padding:"0.75rem",background:"rgba(2,6,23,0.6)",border:`1px solid ${winner===idx?"rgba(34,211,238,0.4)":"#1e293b"}`,borderRadius:"8px"}}><div style={{fontSize:"1.6rem",fontWeight:"700",color:scoreColor(results[idx].viral_score),fontFamily:"ui-monospace,monospace"}}>{results[idx].viral_score}</div>{winner===idx&&<div style={{fontSize:"0.72rem",color:"#22d3ee",fontWeight:"700"}}>🏆 WINNER</div>}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function SignInModal() {
  const handleGoogle=async()=>{
    const{error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:"https://shortspark.net/auth/callback"}});
    if(error) console.error(error);
  };
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(2,6,23,0.85)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div style={{background:"rgba(15,23,42,0.95)",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"20px",padding:"2.5rem",maxWidth:"400px",width:"100%",textAlign:"center",backdropFilter:"blur(20px)"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:"10px",marginBottom:"1.5rem"}}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient></defs>
            <polygon points="16,2 20,12 30,12 22,19 25,29 16,23 7,29 10,19 2,12 12,12" fill="url(#mg)"/>
          </svg>
          <span style={{fontSize:"1.3rem",fontWeight:"800",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>ShortSpark</span>
        </div>
        <h2 style={{fontSize:"1.3rem",fontWeight:"800",marginBottom:"0.5rem",color:"#f1f5f9"}}>Sign in to continue</h2>
        <p style={{color:"#94a3b8",fontSize:"0.85rem",lineHeight:"1.6",marginBottom:"2rem"}}>Save your hooks, track your streak, unlock achievements, and join the live activity feed.</p>
        <button onClick={handleGoogle} style={{width:"100%",background:"#fff",color:"#020617",border:"none",borderRadius:"10px",padding:"0.85rem",fontFamily:"inherit",fontSize:"0.88rem",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",letterSpacing:"0.02em"}}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
          Continue with Google
        </button>
        <p style={{color:"#475569",fontSize:"0.7rem",marginTop:"1rem"}}>Free forever · No credit card required</p>
      </div>
    </div>
  );
}

export default function App() {
  const [mounted,setMounted]=useState(false);
  const [user,setUser]=useState(null);
  const [topic,setTopic]=useState("");
  const [niche,setNiche]=useState("AI & Technology");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState(null);
  const [copied,setCopied]=useState(null);
  const [usesLeft,setUsesLeft]=useState(FREE_LIMIT);
  const [showPaywall,setShowPaywall]=useState(false);
  const [history,setHistory]=useState([]);
  const [streak,setStreak]=useState({count:0});
  const [activeTab,setActiveTab]=useState("analyze");
  const [showAchievement,setShowAchievement]=useState(null);
  const [earnedAchievements,setEarnedAchievements]=useState([]);

  // Auth - only run on client after mount
  useEffect(()=>{
    setMounted(true);
    supabase.auth.getSession().then(({data:{session}})=>{setUser(session?.user||null);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{setUser(session?.user||null);});
    return()=>subscription.unsubscribe();
  },[]);

  // Load user data when logged in
  useEffect(()=>{
    if(!user) return;
    const load=async()=>{
      // History
      const {data:analyses}=await supabase.from("analyses").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(30);
      setHistory(analyses||[]);
      // Streak
      const {data:s}=await supabase.from("streaks").select("*").eq("user_id",user.id).single();
      if(s) setStreak({count:s.count,lastDate:s.last_date});
      // Achievements
      const {data:ach}=await supabase.from("achievements").select("achievement_id").eq("user_id",user.id);
      setEarnedAchievements((ach||[]).map(a=>a.achievement_id));
      // Niche from profile
      const {data:profile}=await supabase.from("profiles").select("niche").eq("id",user.id).single();
      if(profile?.niche) setNiche(profile.niche);
    };
    load();
    setUsesLeft(FREE_LIMIT-getUses());
  },[user]);

  const updateStreak=async()=>{
    if(!user) return {count:0};
    const today=new Date().toISOString().split("T")[0];
    const yesterday=new Date(Date.now()-86400000).toISOString().split("T")[0];
    const {data:current}=await supabase.from("streaks").select("*").eq("user_id",user.id).single();
    let newCount=1;
    if(current){
      if(current.last_date===today) return {count:current.count};
      if(current.last_date===yesterday) newCount=current.count+1;
    }
    await supabase.from("streaks").upsert({user_id:user.id,count:newCount,last_date:today,updated_at:new Date().toISOString()});
    return {count:newCount};
  };

  const analyze=async()=>{
    const t=topic.trim();if(!t||loading)return;
    if(!user){return;} // shouldn't happen, sign in modal blocks
    if(getUses()>=FREE_LIMIT){setShowPaywall(true);return;}
    setLoading(true);setError(null);setResult(null);setShowPaywall(false);
    try{
      const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:t,niche})});
      const data=await res.json();
      if(data.error) throw new Error(data.error);

      const newUses=incrementUses();setUsesLeft(FREE_LIMIT-newUses);
      setResult(data);

      // Save to Supabase
      const {data:saved}=await supabase.from("analyses").insert({user_id:user.id,topic:t,niche,score:data.viral_score,status:data.trending_status}).select().single();
      if(saved) setHistory(prev=>[saved,...prev].slice(0,30));

      // Update streak
      const newStreak=await updateStreak();
      setStreak(newStreak);

      // Check achievements
      const newHistory=[...history,{score:data.viral_score,niche}];
      const stats={history:newHistory.length,bestScore:Math.max(...newHistory.map(h=>h.score)),uniqueNiches:new Set(newHistory.map(h=>h.niche)).size,streak:newStreak.count};
      const newlyEarned=checkAchievements(stats).filter(id=>!earnedAchievements.includes(id));
      if(newlyEarned.length){
        const toInsert=newlyEarned.map(id=>({user_id:user.id,achievement_id:id}));
        await supabase.from("achievements").insert(toInsert);
        setEarnedAchievements(prev=>[...prev,...newlyEarned]);
        const first=ACHIEVEMENTS.find(a=>a.id===newlyEarned[0]);
        setShowAchievement(first);
        setTimeout(()=>setShowAchievement(null),4000);
      }
    }catch(e){setError(e.message||"Analysis failed.");}
    finally{setLoading(false);}
  };

  const copyTitle=(text,idx)=>{navigator.clipboard?.writeText(text).then(()=>{setCopied(idx);setTimeout(()=>setCopied(null),1800);});};
  const signOut=async()=>{await supabase.auth.signOut();window.location.href="/";};

  const stats={
    avg:history.length?Math.round(history.reduce((s,h)=>s+h.score,0)/history.length):0,
    bestScore:history.length?Math.max(...history.map(h=>h.score)):0,
    history:history.length,
    streak:streak.count,
    uniqueNiches:new Set(history.map(h=>h.niche)).size,
  };

  const card={background:"rgba(15,23,42,0.4)",border:"1px solid #1e293b",borderRadius:"14px",padding:"1.25rem 1.5rem",backdropFilter:"blur(8px)"};
  const lbl={fontSize:"0.68rem",color:"#475569",letterSpacing:"0.12em",marginBottom:"0.75rem",display:"block"};
  const tabs=[{id:"analyze",label:"⚡ Analyze"},{id:"batch",label:"📦 Batch"},{id:"generate",label:"✨ Generator"},{id:"compare",label:"⚔️ Compare"}];

  // Don't render anything dynamic until mounted on client (prevents hydration errors)
  if(!mounted) return <div style={{minHeight:"100vh",background:"#020617"}}/>;

  return (
    <>
      <Head><title>ShortSpark — Viral Predictor</title><meta name="viewport" content="width=device-width, initial-scale=1"/></Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#020617;color:#f1f5f9;font-family:'ui-monospace',monospace;min-height:100vh}
        body::before{content:"";position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle at 20% 20%,rgba(34,211,238,0.08),transparent 50%),radial-gradient(circle at 80% 80%,rgba(167,139,250,0.06),transparent 50%);pointer-events:none;z-index:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounceIn{0%{opacity:0;transform:scale(0.5)}60%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}
        textarea:focus,select:focus,input:focus{outline:1px solid #22d3ee!important;border-color:#22d3ee!important}
        textarea::placeholder,input::placeholder{color:#334155}
        .ss-btn:hover{opacity:0.9}.ss-btn:active{transform:scale(0.97)}
        .title-row:hover{background:rgba(30,41,59,0.6)!important;cursor:pointer}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#22d3ee,#a78bfa);border-radius:3px}
        @media (max-width: 1024px){.layout-grid{grid-template-columns:1fr!important}aside{position:static!important}}
      `}</style>

      {!user && <SignInModal/>}

      {showAchievement&&(
        <div style={{position:"fixed",top:"2rem",right:"2rem",zIndex:1000,background:"linear-gradient(135deg,rgba(34,211,238,0.15),rgba(167,139,250,0.15))",border:"1px solid rgba(34,211,238,0.4)",borderRadius:"14px",padding:"1rem 1.25rem",backdropFilter:"blur(12px)",animation:"bounceIn 0.5s cubic-bezier(.4,0,.2,1)",minWidth:"260px"}}>
          <div style={{display:"flex",gap:"0.85rem",alignItems:"center"}}>
            <div style={{fontSize:"2rem"}}>{showAchievement.icon}</div>
            <div>
              <div style={{color:"#22d3ee",fontSize:"0.65rem",letterSpacing:"0.12em",marginBottom:"3px"}}>UNLOCKED</div>
              <div style={{color:"#f1f5f9",fontSize:"0.95rem",fontWeight:"700"}}>{showAchievement.title}</div>
              <div style={{color:"#94a3b8",fontSize:"0.72rem",marginTop:"2px"}}>{showAchievement.desc}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{maxWidth:"1280px",margin:"0 auto",padding:"1.5rem 1rem 4rem",position:"relative",zIndex:1,filter:!user?"blur(4px)":"none",pointerEvents:!user?"none":"auto"}}>

        {/* Top nav */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
          <a href="/" style={{display:"flex",alignItems:"center",gap:"10px",textDecoration:"none"}}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient></defs>
              <polygon points="14,2 17,11 26,11 19,17 22,26 14,20 6,26 9,17 2,11 11,11" fill="url(#lg)"/>
            </svg>
            <span style={{fontSize:"1.2rem",fontWeight:"800",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.02em"}}>ShortSpark</span>
          </a>
          <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
            <span style={{color:"#475569",fontSize:"0.72rem"}}>{usesLeft>0?`${usesLeft} free left`:"limit reached"}</span>
            <a href="/examples" style={{color:"#94a3b8",fontSize:"0.78rem",textDecoration:"none"}}>Examples</a>
            {user && (
              <a href="/profile" style={{display:"flex",alignItems:"center",gap:"6px",textDecoration:"none"}}>
                {user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} style={{width:"28px",height:"28px",borderRadius:"50%"}} alt=""/> : <div style={{width:"28px",height:"28px",borderRadius:"50%",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",color:"#020617",fontWeight:"800",fontSize:"0.72rem"}}>{(user.email?.[0]||"?").toUpperCase()}</div>}
              </a>
            )}
          </div>
        </div>

        <div className="layout-grid" style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:"1.5rem"}}>

          <div>
            <div style={{marginBottom:"1rem",display:"flex",gap:"0.75rem",alignItems:"center"}}>
              <select value={niche} onChange={e=>setNiche(e.target.value)} style={{flex:"0 0 auto",background:"rgba(15,23,42,0.5)",border:"1px solid #1e293b",borderRadius:"10px",padding:"0.55rem 0.85rem",color:"#94a3b8",fontSize:"0.8rem",fontFamily:"inherit",cursor:"pointer",backdropFilter:"blur(8px)"}}>
                {NICHES.map(n=><option key={n} value={n}>{n}</option>)}
              </select>
              <div style={{flex:1,display:"flex",gap:"0.3rem",background:"rgba(15,23,42,0.5)",padding:"4px",borderRadius:"10px",border:"1px solid #1e293b",backdropFilter:"blur(8px)",overflowX:"auto"}}>
                {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{flex:"1 1 auto",background:activeTab===tab.id?"linear-gradient(135deg,rgba(34,211,238,0.18),rgba(167,139,250,0.18))":"transparent",border:activeTab===tab.id?"1px solid rgba(34,211,238,0.25)":"1px solid transparent",borderRadius:"7px",padding:"0.45rem 0.7rem",color:activeTab===tab.id?"#22d3ee":"#475569",fontFamily:"inherit",fontSize:"0.7rem",fontWeight:"700",cursor:"pointer",whiteSpace:"nowrap"}}>{tab.label}</button>))}
              </div>
            </div>

            {activeTab==="batch"&&<BatchAnalyzer niche={niche}/>}
            {activeTab==="generate"&&<HookGenerator niche={niche}/>}
            {activeTab==="compare"&&<CompareMode niche={niche}/>}

            {activeTab==="analyze"&&(<>
              <div style={{...card,marginBottom:"1rem",padding:"1.5rem",background:"linear-gradient(135deg,rgba(34,211,238,0.04),rgba(167,139,250,0.03))",border:"1px solid rgba(34,211,238,0.15)"}}>
                <span style={lbl}>YOUR SHORTS TOPIC OR HOOK</span>
                <textarea value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)analyze();}} placeholder={'"I let AI control my life for 24 hours"'} rows={3} style={{width:"100%",background:"rgba(2,6,23,0.6)",border:"1px solid #1e293b",borderRadius:"10px",padding:"0.75rem 1rem",color:"#f1f5f9",fontSize:"0.9rem",resize:"vertical",fontFamily:"inherit",lineHeight:"1.6"}}/>
                <button className="ss-btn" onClick={analyze} disabled={loading} style={{width:"100%",marginTop:"1rem",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020617",border:"none",borderRadius:"10px",padding:"0.85rem",fontFamily:"inherit",fontSize:"0.9rem",fontWeight:"800",cursor:"pointer",letterSpacing:"0.08em",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",opacity:!topic.trim()||loading?0.5:1,boxShadow:"0 8px 24px rgba(34,211,238,0.2)"}}>
                  {loading?<><svg width="16" height="16" viewBox="0 0 16 16" style={{animation:"spin 0.8s linear infinite"}}><circle cx="8" cy="8" r="6" fill="none" stroke="#020617" strokeWidth="2" strokeOpacity="0.3"/><path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#020617" strokeWidth="2" strokeLinecap="round"/></svg>SCANNING…</>:"⚡ ANALYZE HOOK"}
                </button>
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
                      <span style={{marginTop:"8px",fontSize:"0.72rem",color:scoreColor(result.viral_score),letterSpacing:"0.08em"}}>{result.viral_score>=75?"HIGH POTENTIAL":result.viral_score>=50?"MODERATE":"LOW"}</span>
                    </div>
                    <div style={card}>
                      <span style={lbl}>KEY INSIGHT</span>
                      <p style={{color:"#e2e8f0",fontSize:"0.88rem",lineHeight:"1.65",marginBottom:"1rem"}}>{result.one_liner}</p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                        {(()=>{const m=getStatusMeta(result.trending_status);return <span style={{fontSize:"0.72rem",padding:"4px 10px",borderRadius:"999px",background:m.bg,color:m.color,border:`1px solid ${m.border}`,fontWeight:"600"}}>{m.label}</span>;})()}
                        <span style={{fontSize:"0.72rem",padding:"4px 10px",borderRadius:"999px",background:"rgba(255,255,255,0.04)",color:"#94a3b8",border:"1px solid #1e293b"}}>{result.competition_level}</span>
                        <span style={{fontSize:"0.72rem",padding:"4px 10px",borderRadius:"999px",background:"rgba(34,211,238,0.08)",color:"#22d3ee",border:"1px solid rgba(34,211,238,0.2)"}}>~{result.estimated_views}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.85rem"}}>
                    <Bar label="HOOK STRENGTH" value={result.hook_strength} color="#a78bfa"/>
                    <Bar label="VIRAL POTENTIAL" value={result.viral_score} color="#22d3ee"/>
                    <Bar label="THUMBNAIL" value={result.thumbnail_score||70} color="#f59e0b"/>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem"}}>
                    <div style={card}><span style={lbl}>⏱ OPTIMAL LENGTH</span><div style={{display:"flex",alignItems:"center",gap:"10px"}}><span style={{fontSize:"1.4rem"}}>🎬</span><span style={{color:"#22d3ee",fontSize:"1rem",fontWeight:"700",fontFamily:"ui-monospace,monospace"}}>{result.optimal_length||"30-45s"}</span></div></div>
                    <div style={card}><span style={lbl}># HASHTAGS</span><div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>{(result.hashtags||[]).map((tag,i)=>(<span key={i} onClick={()=>navigator.clipboard?.writeText(tag)} style={{fontSize:"0.7rem",padding:"3px 8px",borderRadius:"999px",background:"rgba(167,139,250,0.08)",color:"#a78bfa",border:"1px solid rgba(167,139,250,0.2)",cursor:"pointer"}}>#{tag.replace(/^#/,"")}</span>))}</div></div>
                  </div>

                  <div style={card}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}><span style={{...lbl,marginBottom:0}}>⚡ OPTIMIZED TITLES</span><ShareButton result={result} topic={topic}/></div>
                    {result.title_variations.map((t,i)=>(<div key={i} className="title-row" onClick={()=>copyTitle(t,i)} style={{background:"rgba(2,6,23,0.6)",border:"1px solid #1e293b",borderRadius:"8px",padding:"0.7rem 0.9rem",display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.4rem"}}><span style={{color:"#22d3ee",fontSize:"0.7rem",fontWeight:"700",flexShrink:0}}>T{i+1}</span><span style={{color:"#e2e8f0",fontSize:"0.85rem",flex:1}}>{t}</span><span style={{color:copied===i?"#22d3ee":"#334155",fontSize:"0.7rem"}}>{copied===i?"✓ copied":"copy"}</span></div>))}
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem"}}>
                    <div style={card}><span style={lbl}>✅ STRENGTHS</span>{result.strengths.map((s,i)=><div key={i} style={{display:"flex",gap:"0.55rem",marginBottom:"0.55rem"}}><span style={{color:"#22d3ee",flexShrink:0}}>▸</span><span style={{color:"#cbd5e1",fontSize:"0.8rem",lineHeight:"1.6"}}>{s}</span></div>)}</div>
                    <div style={card}><span style={lbl}>⚠️ WEAKNESSES</span>{result.weaknesses.map((w,i)=><div key={i} style={{display:"flex",gap:"0.55rem",marginBottom:"0.55rem"}}><span style={{color:"#f59e0b",flexShrink:0}}>▸</span><span style={{color:"#cbd5e1",fontSize:"0.8rem",lineHeight:"1.6"}}>{w}</span></div>)}</div>
                  </div>

                  <div style={card}><span style={lbl}>💡 IMPROVEMENTS</span>{result.improvements.map((imp,i)=>(<div key={i} style={{display:"flex",gap:"0.75rem",alignItems:"flex-start",background:"rgba(2,6,23,0.6)",border:"1px solid #1e293b",padding:"0.7rem 0.9rem",borderRadius:"8px",marginBottom:"0.55rem"}}><span style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020617",borderRadius:"4px",padding:"0px 6px",fontSize:"0.68rem",fontWeight:"800"}}>{i+1}</span><span style={{color:"#e2e8f0",fontSize:"0.83rem",lineHeight:"1.6"}}>{imp}</span></div>))}</div>

                  <div style={card}><span style={lbl}>🕐 BEST POSTING WINDOWS</span><div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap"}}>{result.best_times.map((t,i)=><span key={i} style={{background:"rgba(2,6,23,0.6)",border:"1px solid #1e293b",borderRadius:"8px",padding:"0.5rem 1rem",color:"#a78bfa",fontSize:"0.82rem"}}>{t}</span>)}</div></div>
                </div>
              )}

              {!result&&!loading&&!error&&!showPaywall&&(
                <div style={{textAlign:"center",padding:"3rem 0"}}>
                  <div style={{fontSize:"3rem",marginBottom:"1rem",opacity:0.15,animation:"float 3s ease-in-out infinite"}}>◈</div>
                  <p style={{fontSize:"0.75rem",letterSpacing:"0.15em",color:"#334155"}}>ENTER A TOPIC TO SCAN ITS VIRAL POTENTIAL</p>
                </div>
              )}
            </>)}
          </div>

          <Sidebar stats={stats} earned={earnedAchievements} niche={niche}/>
        </div>
      </div>
    </>
  );
}
