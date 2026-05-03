import dynamic from "next/dynamic";

const LandingContent = dynamic(() => import("../components/LandingContent"), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: "100vh",
      background: "#020617",
    }}/>
  ),
});

export default function HomePage() {
  return <LandingContent />;
}
