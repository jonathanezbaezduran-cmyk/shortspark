import dynamic from "next/dynamic";

const AppContent = dynamic(() => import("../components/AppContent"), {
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
      fontSize: "0.85rem",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          background: "linear-gradient(135deg,#22d3ee,#a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>◈</div>
        <p>Loading ShortSpark...</p>
      </div>
    </div>
  ),
});

export default function AppPage() {
  return <AppContent />;
}
