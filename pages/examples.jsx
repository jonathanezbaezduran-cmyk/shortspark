import dynamic from "next/dynamic";

const ExamplesContent = dynamic(() => import("../components/ExamplesContent"), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: "100vh",
      background: "#020617",
    }}/>
  ),
});

export default function ExamplesPage() {
  return <ExamplesContent />;
}
