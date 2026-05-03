import dynamic from "next/dynamic";

const ProfileContent = dynamic(() => import("../components/ProfileContent"), {
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
    }}>Loading profile...</div>
  ),
});

export default function ProfilePage() {
  return <ProfileContent />;
}
