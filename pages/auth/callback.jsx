import dynamic from "next/dynamic";

const CallbackContent = dynamic(() => import("../../components/CallbackContent"), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: "100vh",
      background: "#020617",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#475569",
      fontFamily: "ui-monospace, monospace",
    }}>Signing in...</div>
  ),
});

export default function CallbackPage() {
  return <CallbackContent />;
}
