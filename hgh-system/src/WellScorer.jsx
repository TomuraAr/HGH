import { useState } from "react";

const initialForm = {
  depth: "", region: "", country: "", casingMaterial: "steel",
  wellAge: "", diameter: "", knownTemp: "", geothermalGradient: "",
  wellType: "vertical", formationRock: "sandstone",
  proximityToFaults: "unknown", wellIntegrity: "unknown",
  solarIrradiance: "moderate", distanceToGrid: "",
};

const fieldLabels = {
  depth: "Well Depth (m)", region: "Region / State", country: "Country",
  casingMaterial: "Casing Material", wellAge: "Well Age (years)",
  diameter: "Wellbore Diameter (inches)", knownTemp: "Known Bottom Temp (°C)",
  geothermalGradient: "Geothermal Gradient (°C/km)", wellType: "Well Type",
  formationRock: "Formation Rock Type", proximityToFaults: "Proximity to Faults",
  wellIntegrity: "Well Integrity", solarIrradiance: "Solar Irradiance",
  distanceToGrid: "Distance to Grid (km)",
};

const selectOptions = {
  casingMaterial: ["steel", "iron", "composite", "unknown"],
  wellType: ["vertical", "deviated", "horizontal"],
  formationRock: ["sandstone", "limestone", "granite", "shale", "basalt", "unknown"],
  proximityToFaults: ["near (<5km)", "moderate (5-20km)", "far (>20km)", "unknown"],
  wellIntegrity: ["good", "moderate", "poor", "unknown"],
  solarIrradiance: ["high (desert)", "moderate (temperate)", "low (overcast/northern)"],
};

const scoreColor = (s) => s >= 75 ? "#39ff14" : s >= 50 ? "#ffd700" : s >= 25 ? "#ff8c00" : "#ff4444";
const verdictColor = (v = "") => {
  if (v.includes("DEPLOY NOW")) return "#39ff14";
  if (v.includes("HIGH")) return "#a8ff3e";
  if (v.includes("MODERATE")) return "#ffd700";
  if (v.includes("LOW")) return "#ff8c00";
  return "#ff4444";
};

const ScoreRing = ({ score, label, color }) => {
  const r = 28, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={72} height={72} viewBox="0 0 72 72">
        <circle cx={36} cy={36} r={r} fill="none" stroke="#1a2a1a" strokeWidth={6} />
        <circle cx={36} cy={36} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 36 36)" style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x={36} y={40} textAnchor="middle" fill={color} fontSize={14} fontWeight="700" fontFamily="monospace">{score}</text>
      </svg>
      <span style={{ fontSize: 10, color: "#7a9a7a", textTransform: "uppercase", letterSpacing: 1, fontFamily: "monospace" }}>{label}</span>
    </div>
  );
};

export default function WellScorer() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("input");

  const buildPrompt = () => `You are the HGH AI Well Scoring Engine for a hybrid system using MWCNT nanofluid coaxial extraction, parabolic trough solar superheating, and truck-mounted TEG arrays on abandoned oil wells.

Well Data: Depth: ${form.depth||"unknown"}m, Location: ${form.region||"unknown"}, ${form.country||"unknown"}, Casing: ${form.casingMaterial}, Age: ${form.wellAge||"unknown"}yrs, Diameter: ${form.diameter||"unknown"}in, Bottom Temp: ${form.knownTemp||"unknown"}°C, Geo Gradient: ${form.geothermalGradient||"unknown"}°C/km, Type: ${form.wellType}, Rock: ${form.formationRock}, Faults: ${form.proximityToFaults}, Integrity: ${form.wellIntegrity}, Solar: ${form.solarIrradiance}, Grid: ${form.distanceToGrid||"unknown"}km

Return ONLY valid JSON no markdown:
{"overallScore":<0-100>,"thermalScore":<0-100>,"integrityScore":<0-100>,"solarScore":<0-100>,"deploymentScore":<0-100>,"verdict":"<DEPLOY NOW|HIGH POTENTIAL|MODERATE POTENTIAL|LOW POTENTIAL|DO NOT DEPLOY>","estimatedSurfaceTemp":"<range>","estimatedPowerOutput":"<kW range>","paybackEstimate":"<years>","topRisks":["<r1>","<r2>","<r3>"],"topStrengths":["<s1>","<s2>","<s3>"],"recommendation":"<2-3 sentences>","nanofluidNote":"<1 sentence>","solarBoostNote":"<1 sentence>"}`;

  const runAnalysis = async () => {
    setLoading(true); setError(null); setResult(null); setActiveTab("result");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: buildPrompt() }] }),
      });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setResult(parsed);
    } catch (e) {
      setError("Analysis failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ color: "#c8e6c8", fontFamily: "'Space Mono','Courier New',monospace" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        input,select{background:#0d1a0d!important;color:#c8e6c8!important;border:1px solid #1e3a1e!important;border-radius:3px!important;padding:7px 9px!important;font-family:'Space Mono',monospace!important;font-size:11px!important;width:100%!important;outline:none!important;}
        input:focus,select:focus{border-color:#39ff14!important;}
        input::placeholder{color:#2a4a2a!important;}
        select option{background:#0d1a0d;}
        .tab{cursor:pointer;padding:8px 20px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;border:1px solid #1e3a1e;background:transparent;color:#3a6a3a;transition:all 0.2s;}
        .tab.active{background:#0d1a0d;color:#39ff14;border-color:#39ff14;}
        .s-hdr{font-size:8px;letter-spacing:3px;text-transform:uppercase;color:#39ff14;border-bottom:1px solid #1e3a1e;padding-bottom:6px;margin-bottom:12px;}
        .f-lbl{font-size:8px;letter-spacing:1px;text-transform:uppercase;color:#3a6a3a;margin-bottom:3px;}
        .run-btn{width:100%;padding:12px;background:linear-gradient(135deg,#0d2a0d,#1a3a1a);border:1px solid #39ff14;color:#39ff14;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;margin-top:8px;}
        .run-btn:hover:not(:disabled){box-shadow:0 0 16px rgba(57,255,20,0.15);}
        .run-btn:disabled{opacity:0.4;cursor:not-allowed;}
        .note{background:#0a150a;border:1px solid #1e3a1e;padding:10px 12px;font-size:11px;line-height:1.6;color:#8aaa8a;border-radius:3px;margin-bottom:8px;}
      `}</style>

      <div style={{ display: "flex", borderBottom: "1px solid #1e3a1e", padding: "0 20px" }}>
        <button className={`tab ${activeTab === "input" ? "active" : ""}`} onClick={() => setActiveTab("input")}>Well Data</button>
        <button className={`tab ${activeTab === "result" ? "active" : ""}`} onClick={() => setActiveTab("result")}>Analysis</button>
      </div>

      <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
        {activeTab === "input" && (
          <div style={{ animation: "fadeIn 0.3s" }}>
            {["Location & Structure", "Thermal Data", "Surface & Deployment"].map((section, si) => {
              const groups = [
                ["depth","country","region","wellAge","diameter","wellType"],
                ["knownTemp","geothermalGradient","formationRock","proximityToFaults"],
                ["casingMaterial","wellIntegrity","solarIrradiance","distanceToGrid"],
              ][si];
              return (
                <div key={section} style={{ marginBottom: 16 }}>
                  <div className="s-hdr">{section}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {groups.map(key => (
                      <div key={key} style={{ marginBottom: 4 }}>
                        <div className="f-lbl">{fieldLabels[key]}</div>
                        {selectOptions[key] ? (
                          <select name={key} value={form[key]} onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}>
                            {selectOptions[key].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input name={key} value={form[key]} onChange={e => setForm({ ...form, [e.target.name]: e.target.value })} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <button className="run-btn" onClick={runAnalysis} disabled={loading}>
              {loading ? "▸ Analyzing..." : "▸ Run HGH Analysis"}
            </button>
          </div>
        )}

        {activeTab === "result" && (
          <div style={{ animation: "fadeIn 0.3s" }}>
            {loading && (
              <div style={{ textAlign: "center", padding: 60, color: "#3a6a3a" }}>
                <div style={{ fontSize: 24, animation: "spin 1s linear infinite", display: "inline-block", marginBottom: 12 }}>◎</div>
                <div style={{ fontSize: 10, letterSpacing: 2 }}>ANALYZING WELL...</div>
              </div>
            )}
            {error && <div style={{ background: "#1a0808", border: "1px solid #ff4444", padding: 12, color: "#ff6b6b", fontSize: 11 }}>{error}</div>}
            {!result && !loading && !error && (
              <div style={{ textAlign: "center", padding: 60, color: "#3a6a3a" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
                <div style={{ fontSize: 10, letterSpacing: 2 }}>ENTER WELL DATA AND RUN ANALYSIS</div>
              </div>
            )}
            {result && (
              <div style={{ animation: "fadeIn 0.4s" }}>
                <div style={{ border: `1px solid ${verdictColor(result.verdict)}`, background: "#0a120a", padding: "16px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 3 }}>
                  <div>
                    <div style={{ fontSize: 8, letterSpacing: 3, color: "#3a6a3a", marginBottom: 4 }}>DEPLOYMENT VERDICT</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: verdictColor(result.verdict), fontFamily: "'Space Grotesk',sans-serif" }}>{result.verdict}</div>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: scoreColor(result.overallScore), fontFamily: "'Space Grotesk',sans-serif" }}>
                    {result.overallScore}<span style={{ fontSize: 12, color: "#3a6a3a" }}>/100</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-around", background: "#0a120a", border: "1px solid #1e3a1e", padding: "16px 8px", marginBottom: 16, borderRadius: 3 }}>
                  {[["thermalScore","Thermal"],["integrityScore","Integrity"],["solarScore","Solar"],["deploymentScore","Deploy"]].map(([k,l]) => (
                    <ScoreRing key={k} score={result[k]} label={l} color={scoreColor(result[k])} />
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[["Est. Surface Temp", result.estimatedSurfaceTemp],["Est. Power Output", result.estimatedPowerOutput],["Payback Period", result.paybackEstimate]].map(([l, v]) => (
                    <div key={l} style={{ background: "#0a120a", border: "1px solid #1e3a1e", padding: 12, borderRadius: 3, textAlign: "center" }}>
                      <div style={{ fontSize: 8, color: "#3a6a3a", letterSpacing: 1, marginBottom: 4 }}>{l.toUpperCase()}</div>
                      <div style={{ fontSize: 12, color: "#39ff14", fontWeight: 700 }}>{v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  <div>
                    <div className="s-hdr">Strengths</div>
                    {result.topStrengths?.map((s, i) => <div key={i} style={{ borderLeft: "2px solid #39ff14", paddingLeft: 8, marginBottom: 6, fontSize: 10, color: "#8aaa8a", lineHeight: 1.5 }}>{s}</div>)}
                  </div>
                  <div>
                    <div className="s-hdr">Risks</div>
                    {result.topRisks?.map((r, i) => <div key={i} style={{ borderLeft: "2px solid #ff6b6b", paddingLeft: 8, marginBottom: 6, fontSize: 10, color: "#8aaa8a", lineHeight: 1.5 }}>{r}</div>)}
                  </div>
                </div>

                <div className="s-hdr">Recommendation</div>
                <div className="note">{result.recommendation}</div>
                <div style={{ fontSize: 8, letterSpacing: 1, color: "#3a6a3a", marginBottom: 3 }}>MWCNT NANOFLUID</div>
                <div className="note">{result.nanofluidNote}</div>
                <div style={{ fontSize: 8, letterSpacing: 1, color: "#3a6a3a", marginBottom: 3 }}>SOLAR BOOST</div>
                <div className="note">{result.solarBoostNote}</div>

                <button className="run-btn" onClick={() => setActiveTab("input")} style={{ marginTop: 8 }}>← Analyze Another Well</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
