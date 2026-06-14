import { useState } from "react";
import WellScorer from "./WellScorer.jsx";
import WellDatabase from "./WellDatabase.jsx";

export default function App() {
  const [page, setPage] = useState("scorer");

  return (
    <div style={{ minHeight: "100vh", background: "#080f08" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@300;400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
      `}</style>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px", borderBottom: "1px solid #1e3a1e",
        background: "#080f08", position: "sticky", top: 0, zIndex: 100
      }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 4, color: "#39ff14" }}>
          HGH SYSTEM
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {["scorer", "database"].map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              background: page === p ? "#0d1a0d" : "transparent",
              border: `1px solid ${page === p ? "#39ff14" : "#1e3a1e"}`,
              color: page === p ? "#39ff14" : "#3a6a3a",
              fontFamily: "'Space Mono',monospace", fontSize: 9,
              letterSpacing: 2, textTransform: "uppercase",
              padding: "6px 14px", cursor: "pointer"
            }}>
              {p === "scorer" ? "Score Well" : "Database"}
            </button>
          ))}
        </div>
      </div>
      {page === "scorer" ? <WellScorer /> : <WellDatabase />}
    </div>
  );
}
