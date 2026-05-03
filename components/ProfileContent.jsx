import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "../lib/supabase";

const NICHES = ["AI & Technology","Fitness & Health","Finance & Crypto","Gaming","Comedy & Entertainment","Education","Beauty & Fashion","Food & Cooking","Travel","Motivation & Self-help","News & Politics","Music & Dance"];

export default function Profile() {
  const router = useRouter();
  const [mounted,setMounted]=useState(false);
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [profile,setProfile]=useState({display_name:"",niche:"AI & Technology",show_in_feed:true,show_score:true,show_niche:true});

  useEffect(()=>{
    setMounted(true);
    const load=async()=>{
      const {data:{session}}=await supabase.auth.getSession();
      if(!session){router.replace("/");return;}
      setUser(session.user);
      const {data}=await supabase.from("profiles").select("*").eq("id",session.user.id).single();
      if(data) setProfile({display_name:data.display_name||"",niche:data.niche||"AI & Technology",show_in_feed:data.show_in_feed??true,show_score:data.show_score??true,show_niche:data.show_niche??true});
      setLoading(false);
    };
    load();
  },[router]);

  const save=async()=>{
    if(!user)return;
    setSaving(true);setSaved(false);
    await supabase.from("profiles").update({display_name:profile.display_name||"Creator",niche:profile.niche,show_in_feed:profile.show_in_feed,show_score:profile.show_score,show_niche:profile.show_niche}).eq("id",user.id);
    setSaving(false);setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };

  const signOut=async()=>{
    await supabase.auth.signOut();
    router.replace("/");
  };

  if(!mounted || loading) return <div style={{minHeight:"100vh",background:"#020617",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontFamily:"ui-monospace,monospace"}}>Loading...</div>;

  const card={background:"rgba(15,23,42,0.4)",border:"1px solid #1e293b",borderRadius:"14px",padding:"1.5rem",backdropFilter:"blur(8px)"};
  const lbl={fontSize:"0.7rem",color:"#475569",letterSpacing:"0.12em",marginBottom:"0.5rem",display:"block"};

  return (
    <>
      <Head><title>Profile · ShortSpark</title></Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#020617;color:#f1f5f9;font-family:'ui-monospace',monospace;min-height:100vh}
        body::before{content:"";position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle at 20% 20%,rgba(34,211,238,0.06),transparent 50%),radial-gradient(circle at 80% 80%,rgba(167,139,250,0.05),transparent 50%);pointer-events:none;z-index:0}
        input:focus,select:focus{outline:1px solid #22d3ee!important;border-color:#22d3ee!important}
        .toggle{position:relative;width:44px;height:24px;background:#1e293b;border-radius:999px;cursor:pointer;transition:background 0.2s;flex-shrink:0}
        .toggle.on{background:linear-gradient(135deg,#22d3ee,#a78bfa)}
        .toggle::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;background:#020617;border-radius:50%;transition:transform 0.2s}
        .toggle.on::after{transform:translateX(20px)}
      `}</style>
      <div style={{maxWidth:"600px",margin:"0 auto",padding:"2rem 1rem 4rem",position:"relative",zIndex:1}}>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"2rem"}}>
          <a href="/app" style={{color:"#94a3b8",textDecoration:"none",fontSize:"0.85rem",display:"flex",alignItems:"center",gap:"6px"}}>← Back to app</a>
          <button onClick={signOut} style={{background:"transparent",border:"1px solid #1e293b",borderRadius:"8px",padding:"0.4rem 0.85rem",color:"#94a3b8",fontFamily:"inherit",fontSize:"0.75rem",cursor:"pointer"}}>Sign out</button>
        </div>

        <h1 style={{fontSize:"1.6rem",fontWeight:"800",marginBottom:"0.5rem",letterSpacing:"-0.02em"}}>Your Profile</h1>
        <p style={{color:"#475569",fontSize:"0.85rem",marginBottom:"2rem"}}>Customize how you appear to other creators</p>

        {/* User card */}
        <div style={{...card,marginBottom:"1rem",display:"flex",alignItems:"center",gap:"1rem"}}>
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} style={{width:"48px",height:"48px",borderRadius:"50%"}} alt=""/>
          ) : (
            <div style={{width:"48px",height:"48px",borderRadius:"50%",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",color:"#020617",fontWeight:"800"}}>{user?.email?.[0]?.toUpperCase()||"?"}</div>
          )}
          <div>
            <div style={{color:"#e2e8f0",fontSize:"0.9rem",fontWeight:"600"}}>{user?.email}</div>
            <div style={{color:"#475569",fontSize:"0.72rem"}}>Signed in with Google</div>
          </div>
        </div>

        {/* Display name */}
        <div style={{...card,marginBottom:"1rem"}}>
          <span style={lbl}>DISPLAY NAME</span>
          <input value={profile.display_name} onChange={e=>setProfile({...profile,display_name:e.target.value})} placeholder="Your creator name" maxLength={40}
            style={{width:"100%",background:"#020617",border:"1px solid #1e293b",borderRadius:"10px",padding:"0.65rem 0.9rem",color:"#f1f5f9",fontSize:"0.88rem",fontFamily:"inherit"}}/>
          <p style={{fontSize:"0.7rem",color:"#475569",marginTop:"6px"}}>How you appear in the live activity feed</p>
        </div>

        {/* Niche */}
        <div style={{...card,marginBottom:"1rem"}}>
          <span style={lbl}>DEFAULT NICHE</span>
          <select value={profile.niche} onChange={e=>setProfile({...profile,niche:e.target.value})}
            style={{width:"100%",background:"#020617",border:"1px solid #1e293b",borderRadius:"10px",padding:"0.65rem 0.9rem",color:"#f1f5f9",fontSize:"0.88rem",fontFamily:"inherit",cursor:"pointer"}}>
            {NICHES.map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {/* Privacy */}
        <div style={{...card,marginBottom:"1.5rem"}}>
          <span style={{...lbl,marginBottom:"1rem"}}>PRIVACY · WHAT OTHERS SEE</span>

          {[
            {key:"show_in_feed",title:"Show me in live activity feed",desc:"Other creators can see when you analyze hooks"},
            {key:"show_score",title:"Show my scores",desc:"Display your viral scores in the feed"},
            {key:"show_niche",title:"Show my niche",desc:"Display which niche you're working in"},
          ].map(opt=>(
            <div key={opt.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",padding:"0.85rem 0",borderBottom:opt.key==="show_niche"?"none":"1px solid #1e293b"}}>
              <div style={{flex:1}}>
                <div style={{color:"#e2e8f0",fontSize:"0.85rem",marginBottom:"3px"}}>{opt.title}</div>
                <div style={{color:"#475569",fontSize:"0.72rem"}}>{opt.desc}</div>
              </div>
              <div className={`toggle ${profile[opt.key]?"on":""}`} onClick={()=>setProfile({...profile,[opt.key]:!profile[opt.key]})}/>
            </div>
          ))}
        </div>

        <button onClick={save} disabled={saving}
          style={{width:"100%",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020617",border:"none",borderRadius:"10px",padding:"0.85rem",fontFamily:"inherit",fontSize:"0.9rem",fontWeight:"800",cursor:"pointer",letterSpacing:"0.05em",opacity:saving?0.7:1}}>
          {saving?"Saving...":saved?"✓ Saved":"Save changes"}
        </button>
      </div>
    </>
  );
}
