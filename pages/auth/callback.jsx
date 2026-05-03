import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        // Ensure profile exists
        const user = data.session.user;
        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existing) {
          await supabase.from("profiles").insert({
            id: user.id,
            display_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator",
            avatar_url: user.user_metadata?.avatar_url || null,
          });
        }
        router.replace("/app");
      } else {
        router.replace("/?error=auth");
      }
    };
    handleAuth();
  }, [router]);

  return (
    <div style={{
      minHeight:"100vh",
      background:"#020617",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      color:"#94a3b8",
      fontFamily:"ui-monospace, monospace",
      fontSize:"0.85rem",
    }}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"2rem",marginBottom:"1rem",background:"linear-gradient(135deg,#22d3ee,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>◈</div>
        <p>Signing you in...</p>
      </div>
    </div>
  );
}
