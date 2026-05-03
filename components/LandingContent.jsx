import Head from "next/head";
import { useState, useEffect } from "react";

const FEATURES = [
  { icon: "⚡", title: "Score Any Hook 0-100", desc: "Get an instant viral potential score before you waste hours editing a video that won't perform." },
  { icon: "📦", title: "Batch Analyzer", desc: "Test up to 10 hooks at once, ranked from best to worst. Pick the winner in seconds." },
  { icon: "✨", title: "AI Hook Generator", desc: "Give it a topic, get back 5 viral hooks with scores and reasoning. Never stare at a blank screen again." },
  { icon: "⚔️", title: "Hook Comparator", desc: "Head-to-head testing. Two hooks enter, one wins. Backed by AI analysis, not gut feeling." },
  { icon: "📊", title: "Performance Dashboard", desc: "Track your average scores, best niches, and improvement over time. See your progress." },
  { icon: "🎯", title: "Niche Calibration", desc: "Finance hooks ≠ comedy hooks. ShortSpark scores against the right benchmarks for your niche." },
];

const PROBLEMS = [
  { stat: "200", label: "average views", color: "#f87171", desc: "Posting blind without knowing what works" },
  { stat: "10hrs", label: "wasted per video", color: "#f59e0b", desc: "Editing content the algorithm will bury" },
  { stat: "0%", label: "consistency", color: "#94a3b8", desc: "Random spikes, no clear pattern, pure luck" },
];

const SOLUTIONS = [
  { stat: "39K", label: "average views", color: "#22d3ee", desc: "Only post hooks that score above 70" },
  { stat: "2min", label: "to test a hook", color: "#a78bfa", desc: "Skip 10 hours of wasted editing" },
  { stat: "100%", label: "data-driven", color: "#22d3ee", desc: "Every post backed by viral signal analysis" },
];

const FAQS = [
  { q: "Is this just ChatGPT with extra steps?", a: "No. ShortSpark uses niche-specific calibration, saturation detection, and trending velocity signals built specifically for YouTube Shorts. ChatGPT gives you text — ShortSpark gives you a decision." },
  { q: "Will it work for my niche?", a: "Yes. The model calibrates scores per niche — a finance hook gets benchmarked against finance content, not gaming. We support 12+ niches and counting." },
  { q: "How accurate is the score?", a: "Scores are based on patterns from analyzing thousands of viral and flopped Shorts. Use them as strong signal, not absolute truth — but creators report 3-10x better consistency after using it." },
  { q: "Can I cancel anytime?", a: "Yes. One click in Gumroad, no questions asked. No contracts, no annual commits." },
  { q: "Why is the free version limited?", a: "Each analysis uses real AI compute that costs money. 3 free analyses per day lets you test the value without us going bankrupt 😅" },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    // If Supabase dropped the access_token at the root, forward it to the callback handler
    if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
      window.location.replace("/auth/callback" + window.location.hash);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <>
      <Head>
        <title>ShortSpark — Predict Viral YouTube Shorts Before You Post</title>
        <meta name="description" content="Score your YouTube Shorts hook 0-100 before posting. AI-powered viral prediction for creators serious about consistency."/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%2322d3ee'/><stop offset='100%25' stop-color='%23a78bfa'/></linearGradient></defs><polygon points='16,2 20,12 30,12 22,19 25,29 16,23 7,29 10,19 2,12 12,12' fill='url(%23g)'/></svg>"/>
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#020617;color:#f1f5f9;font-family:'ui-monospace','SFMono-Regular',monospace;overflow-x:hidden}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes glow{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideInL{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideInR{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        .reveal{animation:fadeUp 0.8s cubic-bezier(.4,0,.2,1) both}
        .feature-card{transition:all 0.3s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden}
        .feature-card:hover{transform:translateY(-4px);border-color:rgba(34,211,238,0.3)!important}
        .feature-card::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(34,211,238,0.05),transparent);transition:left 0.6s}
        .feature-card:hover::before{left:100%}
        .cta-btn{position:relative;overflow:hidden;transition:all 0.3s}
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(34,211,238,0.3)}
        .cta-btn:active{transform:translateY(0)}
        .nav-link{transition:color 0.2s;position:relative}
        .nav-link:hover{color:#22d3ee!important}
        .nav-link::after{content:"";position:absolute;bottom:-4px;left:0;width:0;height:1px;background:linear-gradient(90deg,#22d3ee,#a78bfa);transition:width 0.3s}
        .nav-link:hover::after{width:100%}
        .glow-orb{position:fixed;width:600px;height:600px;border-radius:50%;filter:blur(120px);pointer-events:none;z-index:0;transition:transform 0.4s ease-out}
        .faq-item{transition:all 0.3s;cursor:pointer}
        .faq-item:hover{border-color:rgba(34,211,238,0.3)!important;background:rgba(15,23,42,0.6)!important}
        ::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#22d3ee,#a78bfa);border-radius:4px}
      `}</style>

      {/* Animated background orbs */}
      <div className="glow-orb" style={{
        background: "rgba(34,211,238,0.15)",
        top: "10%", left: "10%",
        transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`
      }}/>
      <div className="glow-orb" style={{
        background: "rgba(167,139,250,0.12)",
        top: "50%", right: "10%",
        transform: `translate(${-mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`
      }}/>

      {/* Sticky Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "1rem 2rem",
        background: scrolled ? "rgba(2,6,23,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        transition: "all 0.3s",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <a href="#top" style={{display:"flex",alignItems:"center",gap:"10px",textDecoration:"none"}}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <defs><linearGradient id="navg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient></defs>
            <polygon points="14,2 17,11 26,11 19,17 22,26 14,20 6,26 9,17 2,11 11,11" fill="url(#navg)"/>
          </svg>
          <span style={{fontSize:"1.15rem",fontWeight:"800",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.02em"}}>ShortSpark</span>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:"2rem"}}>
          <a href="#features" className="nav-link" style={{color:"#94a3b8",textDecoration:"none",fontSize:"0.82rem"}}>Features</a>
          <a href="#pricing" className="nav-link" style={{color:"#94a3b8",textDecoration:"none",fontSize:"0.82rem"}}>Pricing</a>
          <a href="/examples" className="nav-link" style={{color:"#94a3b8",textDecoration:"none",fontSize:"0.82rem"}}>Examples</a>
          <a href="/app" className="cta-btn" style={{
            background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020617",
            padding:"0.55rem 1.2rem",borderRadius:"8px",textDecoration:"none",
            fontSize:"0.78rem",fontWeight:"800",letterSpacing:"0.05em"
          }}>
            Try Free →
          </a>
        </div>
      </nav>

      <main id="top" style={{position:"relative",zIndex:1}}>

        {/* HERO */}
        <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"6rem 2rem 4rem",position:"relative"}}>
          <div style={{maxWidth:"900px",textAlign:"center"}}>

            <div className="reveal" style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"6px 16px",borderRadius:"999px",background:"rgba(34,211,238,0.08)",border:"1px solid rgba(34,211,238,0.2)",marginBottom:"2rem"}}>
              <span style={{width:"6px",height:"6px",borderRadius:"50%",background:"#22d3ee",animation:"glow 2s ease infinite"}}/>
              <span style={{color:"#22d3ee",fontSize:"0.72rem",letterSpacing:"0.1em"}}>3,022 CREATORS USING SHORTSPARK TODAY</span>
            </div>

            <h1 className="reveal" style={{
              fontSize:"clamp(2.5rem, 6vw, 5rem)",
              fontWeight:"800",
              lineHeight:"1.05",
              letterSpacing:"-0.04em",
              marginBottom:"1.5rem",
              animationDelay:"0.1s"
            }}>
              <span style={{color:"#f1f5f9"}}>Stop posting Shorts</span><br/>
              <span style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"200% auto",animation:"shimmer 4s linear infinite"}}>that nobody watches.</span>
            </h1>

            <p className="reveal" style={{
              fontSize:"clamp(1rem, 1.5vw, 1.2rem)",
              color:"#94a3b8",
              lineHeight:"1.7",
              maxWidth:"640px",
              margin:"0 auto 2.5rem",
              animationDelay:"0.2s"
            }}>
              ShortSpark scores your hook <strong style={{color:"#f1f5f9"}}>0-100 before you post</strong>. AI-powered viral prediction for YouTube Shorts. No more guessing which videos will hit 80K views and which will die at 200.
            </p>

            <div className="reveal" style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap",animationDelay:"0.3s"}}>
              <a href="/app" className="cta-btn" style={{
                background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020617",
                padding:"1rem 2.5rem",borderRadius:"12px",textDecoration:"none",
                fontSize:"0.95rem",fontWeight:"800",letterSpacing:"0.05em",
                display:"inline-flex",alignItems:"center",gap:"8px"
              }}>
                ⚡ Sign In Free
              </a>
              <a href="#features" style={{
                background:"transparent",color:"#cbd5e1",
                padding:"1rem 2rem",borderRadius:"12px",textDecoration:"none",
                fontSize:"0.95rem",fontWeight:"700",letterSpacing:"0.05em",
                border:"1px solid #1e293b",
                transition:"all 0.2s"
              }}>
                See How It Works ↓
              </a>
            </div>

            <p className="reveal" style={{color:"#475569",fontSize:"0.78rem",marginTop:"2rem",animationDelay:"0.4s"}}>
              Free with Google · No credit card · Cancel anytime
            </p>

          </div>
        </section>

        {/* PROBLEM → SOLUTION */}
        <section style={{padding:"6rem 2rem",position:"relative"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:"4rem"}}>
              <p style={{color:"#22d3ee",fontSize:"0.78rem",letterSpacing:"0.18em",marginBottom:"1rem"}}>THE PROBLEM</p>
              <h2 style={{fontSize:"clamp(2rem, 4vw, 3rem)",fontWeight:"800",lineHeight:"1.15",letterSpacing:"-0.03em",marginBottom:"1rem"}}>
                Same effort. <span style={{color:"#f87171"}}>Wildly different results.</span>
              </h2>
              <p style={{color:"#94a3b8",fontSize:"1.05rem",maxWidth:"600px",margin:"0 auto"}}>
                You spend 10 hours editing. The algorithm gives you 200 views. Your last video — 80K. Why?
              </p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem",marginBottom:"4rem"}}>
              {PROBLEMS.map((p,i) => (
                <div key={i} style={{
                  background:"rgba(15,23,42,0.4)",
                  border:"1px solid #1e293b",
                  borderRadius:"16px",
                  padding:"2rem",
                  textAlign:"center",
                  backdropFilter:"blur(8px)"
                }}>
                  <div style={{fontSize:"3.5rem",fontWeight:"800",color:p.color,fontFamily:"ui-monospace,monospace",lineHeight:1,marginBottom:"0.5rem"}}>{p.stat}</div>
                  <p style={{color:"#cbd5e1",fontSize:"0.9rem",fontWeight:"600",marginBottom:"0.75rem"}}>{p.label}</p>
                  <p style={{color:"#64748b",fontSize:"0.82rem",lineHeight:"1.6"}}>{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Arrow divider */}
            <div style={{textAlign:"center",margin:"3rem 0",fontSize:"2rem",color:"#22d3ee"}}>↓</div>

            <div style={{textAlign:"center",marginBottom:"3rem"}}>
              <p style={{color:"#a78bfa",fontSize:"0.78rem",letterSpacing:"0.18em",marginBottom:"1rem"}}>WITH SHORTSPARK</p>
              <h2 style={{fontSize:"clamp(2rem, 4vw, 3rem)",fontWeight:"800",lineHeight:"1.15",letterSpacing:"-0.03em"}}>
                Predictable. <span style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Data-backed.</span>
              </h2>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem"}}>
              {SOLUTIONS.map((s,i) => (
                <div key={i} style={{
                  background:"linear-gradient(135deg,rgba(34,211,238,0.04),rgba(167,139,250,0.04))",
                  border:"1px solid rgba(34,211,238,0.15)",
                  borderRadius:"16px",
                  padding:"2rem",
                  textAlign:"center",
                  backdropFilter:"blur(8px)"
                }}>
                  <div style={{fontSize:"3.5rem",fontWeight:"800",color:s.color,fontFamily:"ui-monospace,monospace",lineHeight:1,marginBottom:"0.5rem"}}>{s.stat}</div>
                  <p style={{color:"#e2e8f0",fontSize:"0.9rem",fontWeight:"600",marginBottom:"0.75rem"}}>{s.label}</p>
                  <p style={{color:"#94a3b8",fontSize:"0.82rem",lineHeight:"1.6"}}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{padding:"6rem 2rem",position:"relative"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:"4rem"}}>
              <p style={{color:"#22d3ee",fontSize:"0.78rem",letterSpacing:"0.18em",marginBottom:"1rem"}}>HOW IT WORKS</p>
              <h2 style={{fontSize:"clamp(2rem, 4vw, 3rem)",fontWeight:"800",lineHeight:"1.15",letterSpacing:"-0.03em",marginBottom:"1rem"}}>
                Six tools to <span style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>master the algorithm</span>
              </h2>
              <p style={{color:"#94a3b8",fontSize:"1.05rem",maxWidth:"600px",margin:"0 auto"}}>
                Everything you need to never post a flop again.
              </p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"1.25rem"}}>
              {FEATURES.map((f,i) => (
                <div key={i} className="feature-card" style={{
                  background:"rgba(15,23,42,0.4)",
                  border:"1px solid #1e293b",
                  borderRadius:"16px",
                  padding:"1.75rem",
                  backdropFilter:"blur(8px)"
                }}>
                  <div style={{fontSize:"2rem",marginBottom:"1rem"}}>{f.icon}</div>
                  <h3 style={{color:"#f1f5f9",fontSize:"1.05rem",fontWeight:"700",marginBottom:"0.6rem",letterSpacing:"-0.01em"}}>{f.title}</h3>
                  <p style={{color:"#94a3b8",fontSize:"0.85rem",lineHeight:"1.65"}}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" style={{padding:"6rem 2rem",position:"relative"}}>
          <div style={{maxWidth:"1000px",margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:"4rem"}}>
              <p style={{color:"#a78bfa",fontSize:"0.78rem",letterSpacing:"0.18em",marginBottom:"1rem"}}>PRICING</p>
              <h2 style={{fontSize:"clamp(2rem, 4vw, 3rem)",fontWeight:"800",lineHeight:"1.15",letterSpacing:"-0.03em",marginBottom:"1rem"}}>
                Simple. <span style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Honest.</span>
              </h2>
              <p style={{color:"#94a3b8",fontSize:"1.05rem"}}>
                Free to start. $9 to unlock everything.
              </p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"1.5rem",maxWidth:"800px",margin:"0 auto"}}>

              {/* Free Plan */}
              <div style={{
                background:"rgba(15,23,42,0.4)",
                border:"1px solid #1e293b",
                borderRadius:"20px",
                padding:"2.25rem 2rem",
                backdropFilter:"blur(8px)"
              }}>
                <p style={{color:"#94a3b8",fontSize:"0.78rem",letterSpacing:"0.12em",marginBottom:"0.75rem"}}>FREE</p>
                <div style={{display:"flex",alignItems:"baseline",gap:"6px",marginBottom:"1.5rem"}}>
                  <span style={{fontSize:"2.5rem",fontWeight:"800",color:"#f1f5f9",fontFamily:"ui-monospace,monospace"}}>$0</span>
                  <span style={{color:"#475569",fontSize:"0.85rem"}}>/forever</span>
                </div>
                <p style={{color:"#94a3b8",fontSize:"0.85rem",marginBottom:"2rem",lineHeight:"1.6"}}>Perfect for testing the value before committing.</p>
                <ul style={{listStyle:"none",marginBottom:"2rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                  {["3 hook analyses every 24 hours","Full feature access","Sign in with Google","Examples library access"].map((item,i) => (
                    <li key={i} style={{display:"flex",gap:"0.6rem",alignItems:"flex-start",color:"#cbd5e1",fontSize:"0.85rem",lineHeight:"1.6"}}>
                      <span style={{color:"#22d3ee",flexShrink:0}}>✓</span>{item}
                    </li>
                  ))}
                </ul>
                <a href="/app" style={{
                  display:"block",textAlign:"center",
                  background:"transparent",color:"#cbd5e1",
                  padding:"0.85rem",borderRadius:"10px",textDecoration:"none",
                  fontSize:"0.85rem",fontWeight:"700",letterSpacing:"0.05em",
                  border:"1px solid #334155",
                  transition:"all 0.2s"
                }}>
                  Start Free →
                </a>
              </div>

              {/* Pro Plan */}
              <div style={{
                background:"linear-gradient(135deg,rgba(34,211,238,0.08),rgba(167,139,250,0.08))",
                border:"1px solid rgba(34,211,238,0.3)",
                borderRadius:"20px",
                padding:"2.25rem 2rem",
                position:"relative",
                backdropFilter:"blur(8px)",
                boxShadow:"0 20px 80px rgba(34,211,238,0.1)"
              }}>
                <div style={{
                  position:"absolute",top:"-12px",right:"24px",
                  background:"linear-gradient(135deg,#22d3ee,#a78bfa)",
                  color:"#020617",fontSize:"0.65rem",fontWeight:"800",
                  padding:"4px 10px",borderRadius:"999px",letterSpacing:"0.08em"
                }}>
                  MOST POPULAR
                </div>
                <p style={{color:"#22d3ee",fontSize:"0.78rem",letterSpacing:"0.12em",marginBottom:"0.75rem"}}>PRO</p>
                <div style={{display:"flex",alignItems:"baseline",gap:"6px",marginBottom:"1.5rem"}}>
                  <span style={{fontSize:"2.5rem",fontWeight:"800",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"ui-monospace,monospace"}}>$9</span>
                  <span style={{color:"#475569",fontSize:"0.85rem"}}>/month</span>
                </div>
                <p style={{color:"#94a3b8",fontSize:"0.85rem",marginBottom:"2rem",lineHeight:"1.6"}}>For creators who post regularly and want consistency.</p>
                <ul style={{listStyle:"none",marginBottom:"2rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                  {[
                    "Unlimited hook analyses",
                    "Batch analyzer (up to 10 at once)",
                    "AI hook generator",
                    "Hook comparator",
                    "Performance dashboard with trends",
                    "Priority response speed",
                    "All future features included"
                  ].map((item,i) => (
                    <li key={i} style={{display:"flex",gap:"0.6rem",alignItems:"flex-start",color:"#e2e8f0",fontSize:"0.85rem",lineHeight:"1.6"}}>
                      <span style={{color:"#22d3ee",flexShrink:0,fontWeight:"700"}}>✓</span>{item}
                    </li>
                  ))}
                </ul>
                <a href="https://shortspark.gumroad.com/l/eajvgh" className="cta-btn" style={{
                  display:"block",textAlign:"center",
                  background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020617",
                  padding:"0.95rem",borderRadius:"10px",textDecoration:"none",
                  fontSize:"0.9rem",fontWeight:"800",letterSpacing:"0.05em"
                }}>
                  Upgrade to Pro
                </a>
                <p style={{textAlign:"center",color:"#475569",fontSize:"0.7rem",marginTop:"0.75rem"}}>Cancel anytime · Secure via Gumroad</p>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{padding:"6rem 2rem",position:"relative"}}>
          <div style={{maxWidth:"800px",margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:"3rem"}}>
              <p style={{color:"#22d3ee",fontSize:"0.78rem",letterSpacing:"0.18em",marginBottom:"1rem"}}>FAQ</p>
              <h2 style={{fontSize:"clamp(2rem, 4vw, 3rem)",fontWeight:"800",lineHeight:"1.15",letterSpacing:"-0.03em"}}>
                Questions? <span style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Answers.</span>
              </h2>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"0.85rem"}}>
              {FAQS.map((faq,i) => (
                <div key={i} className="faq-item" onClick={()=>setOpenFaq(openFaq===i?null:i)}
                  style={{
                    background:"rgba(15,23,42,0.4)",
                    border:"1px solid #1e293b",
                    borderRadius:"14px",
                    padding:"1.25rem 1.5rem",
                    backdropFilter:"blur(8px)"
                  }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem"}}>
                    <h3 style={{color:"#f1f5f9",fontSize:"0.95rem",fontWeight:"700",margin:0,letterSpacing:"-0.01em"}}>{faq.q}</h3>
                    <span style={{color:"#22d3ee",fontSize:"1.2rem",transform:openFaq===i?"rotate(45deg)":"rotate(0)",transition:"transform 0.3s",flexShrink:0}}>+</span>
                  </div>
                  {openFaq===i && (
                    <p style={{color:"#94a3b8",fontSize:"0.85rem",lineHeight:"1.7",marginTop:"0.85rem",animation:"fadeUp 0.3s ease"}}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{padding:"6rem 2rem",position:"relative"}}>
          <div style={{maxWidth:"800px",margin:"0 auto",textAlign:"center"}}>
            <div style={{
              background:"linear-gradient(135deg,rgba(34,211,238,0.06),rgba(167,139,250,0.06))",
              border:"1px solid rgba(34,211,238,0.2)",
              borderRadius:"24px",
              padding:"4rem 2rem",
              backdropFilter:"blur(8px)"
            }}>
              <h2 style={{fontSize:"clamp(1.75rem, 3.5vw, 2.5rem)",fontWeight:"800",lineHeight:"1.2",letterSpacing:"-0.03em",marginBottom:"1rem"}}>
                Stop guessing.<br/>
                <span style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Start measuring.</span>
              </h2>
              <p style={{color:"#94a3b8",fontSize:"1rem",marginBottom:"2rem",maxWidth:"500px",margin:"0 auto 2rem"}}>
                Three free analyses every 24 hours. Sign in with Google in seconds.
              </p>
              <a href="/app" className="cta-btn" style={{
                display:"inline-block",
                background:"linear-gradient(135deg,#22d3ee,#a78bfa)",color:"#020617",
                padding:"1rem 2.5rem",borderRadius:"12px",textDecoration:"none",
                fontSize:"0.95rem",fontWeight:"800",letterSpacing:"0.05em"
              }}>
                ⚡ Try ShortSpark Free
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{padding:"3rem 2rem 4rem",borderTop:"1px solid #1e293b",position:"relative"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient></defs>
                <polygon points="10,2 12,8 19,8 13,12 16,19 10,15 4,19 7,12 1,8 8,8" fill="url(#fg)"/>
              </svg>
              <span style={{color:"#475569",fontSize:"0.78rem",letterSpacing:"0.05em"}}>SHORTSPARK · 2026 · POWERED BY CLAUDE AI</span>
            </div>
            <div style={{display:"flex",gap:"1.5rem"}}>
              <a href="/examples" style={{color:"#475569",textDecoration:"none",fontSize:"0.78rem"}}>Examples</a>
              <a href="/app" style={{color:"#475569",textDecoration:"none",fontSize:"0.78rem"}}>App</a>
              <a href="https://shortspark.gumroad.com/l/eajvgh" style={{color:"#475569",textDecoration:"none",fontSize:"0.78rem"}}>Pro</a>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
