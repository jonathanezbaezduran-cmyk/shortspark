import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const [status, setStatus] = useState("Signing you in...");

  useEffect(() => {
    let cancelled = false;

    const handleAuth = async () => {
      try {
        // Wait a moment for Supabase to detect the session from URL hash
        await new Promise(r => setTimeout(r, 300));

        // Try multiple times in case session is still being set
        let session = null;
        for (let i = 0; i < 10; i++) {
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            session = data.session;
            break;
          }
          await new Promise(r => setTimeout(r, 200));
        }

        if (cancelled) return;

        if (!session) {
          setStatus("Sign in failed. Redirecting...");
          setTimeout(() => { window.location.href = "/"; }, 1200);
          return;
        }

        const user = session.user;

        // Try to ensure profile exists, but don't block on errors
        try {
          const { data: existing } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

          if (!existing) {
            await supabase.from("profiles").insert({
              id: user.id,
              display_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator",
              avatar_url: user.user_metadata?.avatar_url || null,
            });
          }
        } catch (e) {
          // Profile creation failed but auth worked, continue anyway
          console.warn("Profile setup skipped:", e);
        }

        if (!cancelled) {
          setStatus("Success! Redirecting...");
          window.location.href = "/app";
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        if (!cancelled) {
          setStatus("Something went wrong. Redirecting...");
          setTimeout(() => { window.location.href = "/"; }, 1500);
        }
      }
    };

    handleAuth();

    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020617",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#94a3b8",
      fontFamily: "ui-monospace, monospace",
      fontSize: "0.85rem",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          background: "linear-gradient(135deg,#22d3ee,#a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "pulse 1.5s ease infinite",
        }}>◈</div>
        <p>{status}</p>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>
    </div>
  );
}
