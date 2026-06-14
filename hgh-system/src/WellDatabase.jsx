import { useState, useEffect } from "react";

const initialForm = {
  wellId: "", depth: "", region: "", country: "", casingMaterial: "steel",
  wellAge: "", diameter: "", knownTemp: "", geothermalGradient: "",
  wellType: "vertical", formationRock: "sandstone",
  proximityToFaults: "unknown", wellIntegrity: "unknown",
  solarIrradiance: "moderate", distanceToGrid: "",
};

const fieldLabels = {
  wellId:"Well ID",depth:"Depth (m)",region:"Region",country:"Country",
  casingMaterial:"Casing",wellAge:"Age (yrs)",diameter:"Diameter (in)",
  knownTemp:"Bottom Temp (°C)",geothermalGradient:"Geo Gradient (°C/km)",
  wellType:"Well Type",formationRock:"Rock Type",proximityToFaults:"Fault Proximity",
  wellIntegrity:"Integrity",solarIrradiance:"Solar",distanceToGrid:"Grid Dist (km)",
};

const selectOptions = {
  casingMaterial:["steel","iron","composite","unknown"],
  wellType:["vertical","deviated","horizontal"],
  formationRock:["sandstone","limestone","granite","shale","basalt","unknown"],
  proximityToFaults:["near (<5km)","moderate (5-20km)","far (>20km)","unknown"],
  wellIntegrity:["good","moderate","poor","unknown"],
  solarIrradiance:["high (desert)","moderate (temperate)","low (overcast/northern)"],
};

const sc = (s) => s>=75?"#39ff14":s>=50?"#ffd700":s>=25?"#ff8c00":"#ff4444";
const vc = (v="") => v.includes("DEPLOY NOW")?"#39ff14":v.includes("HIGH")?"#a8ff3e":v.includes("MODERATE")?"#ffd700":v.includes("LOW")?"#ff8c00":"#ff4444";

const ScoreBar = ({score,label}) => (
  <div style={{marginBottom:6}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#3a6a3a",marginBottom:3}}>
      <span>{label.toUpperCase()}</span><span style={{color:sc(score)}}>{score}</span>
    </div>
    <div style={{height:3,background:"#1a2a1a",borderRadius:2}}>
      <div style={{height:3,width:`${score}%`,background:sc(score),borderRadius:2,transition:"width 0.8s ease"}}/>
    </div>
  </div>
);

export default function WellDatabase() {
  const [wells, setWells] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [view, setView] = useState("fleet");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [intelLoading, setIntelLoading] = useState(false);
  const [intel, setIntel] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hgh-wells-v1");
      if (raw) setWells(JSON.parse(raw));
    } catch(e) {}
  }, []);

  const save = (w) => {
    try { localStorage.setItem("hgh-wells-v1", JSON.stringify(w)); setSaved("Saved ✓"); setTimeout(()=>setSaved(""),2000); }
    catch(e) { setSaved("Save failed"); }
  };

  const buildPrompt = (f) => `You are the HGH AI Well Scoring Engine for a hybrid system using MWCNT nanofluid coaxial extraction, parabolic trough solar superheating, truck-mounted TEG arrays on abandoned oil wells.
Well: ID:${f.wellId||"unnamed"}, Depth:${f.depth||"?"}m, Location:${f.region||"?"},${f.country||"?"}, Casing:${f.casingMaterial}, Age:${f.wellAge||"?"}yrs, Dia:${f.diameter||"?"}in, Temp:${f.knownTemp||"?"}°C, Gradient:${f.geothermalGradient||"?"}°C/km, Type:${f.wellType}, Rock:${f.formationRock}, Faults:${f.proximityToFaults}, Integrity:${f.wellIntegrity}, Solar:${f.solarIrradiance}, Grid:${f.distanceToGrid||"?"}km
Return ONLY valid JSON:
{"overallScore":<0-100>,"thermalScore":<0-100>,"integrityScore":<0-100>,"solarScore":<0-100>,"deploymentScore":<0-100>,"verdict":"<DEPLOY NOW|HIGH POTENTIAL|MODERATE POTENTIAL|LOW POTENTIAL|DO NOT DEPLOY>","estimatedSurfaceTemp":"<range>","estimatedPowerOutput":"<kW>","paybackEstimate":"<yrs>","topRisks":["r1","r2","r3"],"topStrengths":["s1","s2","s3"],"recommendation":"<2-3 sentences>","nanofluidNote":"<1 sentence>","solarBoostNote":"<1 sentence>"}`;

  const buildIntelPrompt = (ws) => `You are HGH Fleet Intelligence. Analyze ${ws.length} wells: ${JSON.stringify(ws.map(w=>({id:w.form.wellId||"unnamed",country:w.form.country,depth:w.form.depth,score:w.result.overallScore,verdict:w.result.verdict,rock:w.form.formationRock,solar:w.form.solarIrradiance})))}
Return ONLY valid JSON:
{"avgScore":<num>,"topWell":"<id>","bestCountry":"<country>","bestRock":"<rock>","fleetInsight":"<2-3 sentences>","deployPriority":["id1","id2","id3"],"avoidPattern":"<1 sentence>","nextBestAction":"<1 sentence>"}`;

  const callAPI = async (prompt) => {
    const res = await fetch("/api/analyze", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:prompt}]}),
    });
    const data = await res.json();
    const raw = data.content?.map(i=>i.text||"").join("")||"";
    return JSON.parse(raw.replace(/```json|```/g,"").trim());
  };

  const analyzeWell = async () => {
    setLoading(true); setError(null);
    try {
      const result = await callAPI(buildPrompt(form));
      const newWell = {id:Date.now(),timestamp:new Date().toISOString(),form:{...form},result};
      const updated = [newWell,...wells];
      setWells(updated); save(updated);
      setSelected(newWell); setView("detail"); setForm(initialForm);
    } catch(e) { setError("Analysis failed. Try again."); }
    setLoading(false);
  };

  const runIntel = async () => {
    setIntelLoading(true);
    try { setIntel(await callAPI(buildIntelPrompt(wells))); setView("intel"); }
    catch(e) { setError("Fleet analysis failed."); }
    setIntelLoading(false);
  };

  const del = (id) => {
    const updated = wells.filter(w=>w.id!==id);
    setWells(updated); save(updated);
    if(selected?.id===id){setSelected(null);setView("fleet");}
  };

  const avg = wells.length ? Math.round(wells.reduce((a,w)=>a+w.result.overallScore,0)/wells.length) : 0;
  const ready = wells.filter(w=>w.result.verdict.includes("DEPLOY")||w.result.verdict.includes("HIGH")).length;

  return (
    <div style={{color:"#c8e6c8",fontFamily:"'Space Mono','Courier New',monospace"}}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        input,select{background:#0d1a0d!important;color:#c8e6c8!important;border:1px solid #1e3a1e!important;border-radius:3px!important;padding:6px 8px!important;font-family:'Space Mono',monospace!important;font-size:11px!important;width:100%!important;outline:none!important;}
        input:focus,select:focus{border-color:#39ff14!important;}
        input::placeholder{color:#2a4a2a!important;}
        select option{background:#0d1a0d;}
        .nb{background:transparent;border:none;color:#3a6a3a;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;padding:9px 14px;border-bottom:2px solid transparent;transition:all 0.2s;}
        .nb.act{color:#39ff14;border-bottom-color:#39ff14;}
        .nb:hover:not(.act){color:#7aaa7a;}
        .nb:disabled{opacity:0.3;cursor:not-allowed;}
        .wr{display:flex;align-items:center;padding:10px 14px;border-bottom:1px solid #0d1a0d;cursor:pointer;transition:background 0.15s;gap:10px;}
        .wr:hover{background:#0a120a;}
        .wr.sel{background:#0d1a0d;border-left:2px solid #39ff14;}
        .shdr{font-size:8px;letter-spacing:3px;text-transform:uppercase;color:#39ff14;border-bottom:1px solid #1e3a1e;padding-bottom:6px;margin-bottom:10px;}
        .flbl{font-size:8px;letter-spacing:1px;text-transform:uppercase;color:#3a6a3a;margin-bottom:3px;}
        .rbtn{width:100%;padding:11px;background:linear-gradient(135deg,#0d2a0d,#1a3a1a);border:1px solid #39ff14;color:#39ff14;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;margin-top:6px;}
        .rbtn:hover:not(:disabled){box-shadow:0 0 16px rgba(57,255,20,0.12);}
        .rbtn:disabled{opacity:0.4;cursor:not-allowed;}
        .ic{background:#0a120a;border:1px solid #1e3a1e;padding:10px 12px;font-size:11px;line-height:1.6;color:#8aaa8a;border-radius:3px;margin-bottom:8px;}
        .tag{display:inline-block;padding:2px 7px;border-radius:2px;font-size:8px;letter-spacing:1px;}
        .dbtn{background:transparent;border:none;color:#2a3a2a;cursor:pointer;font-size:14px;padding:2px 6px;transition:color 0.2s;}
        .dbtn:hover{color:#ff4444;}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:#080f08;} ::-webkit-scrollbar-thumb{background:#1e3a1e;}
      `}</style>

      {/* Stats strip */}
      {wells.length>0 && (
        <div style={{display:"flex",borderBottom:"1px solid #1e3a1e",padding:"0 16px",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex"}}>
            {[["Wells",wells.length,null],["Avg Score",avg,sc(avg)],["Deploy Ready",ready,ready>0?"#39ff14":"#3a6a3a"]].map(([l,v,c])=>(
              <div key={l} style={{padding:"7px 16px",borderRight:"1px solid #1e3a1e",textAlign:"center"}}>
                <div style={{fontSize:15,fontWeight:700,color:c||"#c8e6c8",fontFamily:"'Space Grotesk',sans-serif"}}>{v}</div>
                <div style={{fontSize:7,color:"#3a6a3a",letterSpacing:1}}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
          {saved && <span style={{fontSize:9,color:"#39ff14",letterSpacing:1}}>{saved}</span>}
        </div>
      )}

      {/* Nav */}
      <div style={{display:"flex",borderBottom:"1px solid #1e3a1e",padding:"0 16px"}}>
        <button className={`nb ${view==="fleet"?"act":""}`} onClick={()=>setView("fleet")}>Fleet</button>
        <button className={`nb ${view==="add"?"act":""}`} onClick={()=>setView("add")}>+ Add Well</button>
        {selected && <button className={`nb ${view==="detail"?"act":""}`} onClick={()=>setView("detail")}>Detail</button>}
        {wells.length>=2 && <button className={`nb ${view==="intel"?"act":""}`} onClick={runIntel} disabled={intelLoading}>{intelLoading?"Analyzing...":"Fleet Intel"}</button>}
      </div>

      <div style={{padding:"16px 20px",maxWidth:700,margin:"0 auto",minHeight:"60vh",overflowY:"auto"}}>
        {error && <div style={{background:"#1a0808",border:"1px solid #ff4444",padding:10,color:"#ff6b6b",fontSize:10,marginBottom:12,borderRadius:3}}>{error}</div>}

        {/* FLEET */}
        {view==="fleet" && (
          <div style={{animation:"fadeIn 0.3s"}}>
            {wells.length===0 ? (
              <div style={{textAlign:"center",padding:"50px 0",color:"#3a6a3a"}}>
                <div style={{fontSize:28,marginBottom:10}}>◎</div>
                <div style={{fontSize:10,letterSpacing:2}}>NO WELLS LOGGED</div>
                <button className="rbtn" style={{width:"auto",padding:"10px 24px",marginTop:14}} onClick={()=>setView("add")}>+ Add First Well</button>
              </div>
            ) : wells.map(w=>(
              <div key={w.id} className={`wr ${selected?.id===w.id?"sel":""}`} onClick={()=>{setSelected(w);setView("detail");}}>
                <div style={{minWidth:44,textAlign:"center"}}>
                  <div style={{fontSize:17,fontWeight:700,color:sc(w.result.overallScore),fontFamily:"'Space Grotesk',sans-serif"}}>{w.result.overallScore}</div>
                  <div style={{fontSize:7,color:"#3a6a3a"}}>SCORE</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>{w.form.wellId||`Well #${w.id}`}</div>
                  <div style={{fontSize:9,color:"#3a6a3a"}}>{[w.form.region,w.form.country].filter(Boolean).join(", ")||"Unknown location"} · {w.form.depth?`${w.form.depth}m`:"depth unknown"}</div>
                </div>
                <span className="tag" style={{background:`${vc(w.result.verdict)}18`,color:vc(w.result.verdict),border:`1px solid ${vc(w.result.verdict)}35`}}>
                  {w.result.verdict.split(" ")[0]}
                </span>
                <button className="dbtn" onClick={e=>{e.stopPropagation();del(w.id);}}>×</button>
              </div>
            ))}
          </div>
        )}

        {/* ADD */}
        {view==="add" && (
          <div style={{animation:"fadeIn 0.3s"}}>
            <div className="shdr">New Well</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {Object.keys(initialForm).map(key=>(
                <div key={key} style={{marginBottom:4}}>
                  <div className="flbl">{fieldLabels[key]}</div>
                  {selectOptions[key]?(
                    <select name={key} value={form[key]} onChange={e=>setForm({...form,[e.target.name]:e.target.value})}>
                      {selectOptions[key].map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  ):(
                    <input name={key} value={form[key]} onChange={e=>setForm({...form,[e.target.name]:e.target.value})} placeholder={key==="wellId"?"e.g. TX-447":""} />
                  )}
                </div>
              ))}
            </div>
            <button className="rbtn" onClick={analyzeWell} disabled={loading}>
              {loading?"▸ Analyzing...":"▸ Score & Save to Database"}
            </button>
          </div>
        )}

        {/* DETAIL */}
        {view==="detail" && selected && (
          <div style={{animation:"fadeIn 0.3s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <div style={{fontSize:17,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{selected.form.wellId||`Well #${selected.id}`}</div>
                <div style={{fontSize:9,color:"#3a6a3a",marginTop:2}}>{[selected.form.region,selected.form.country].filter(Boolean).join(", ")} · {new Date(selected.timestamp).toLocaleDateString()}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:700,color:sc(selected.result.overallScore),fontFamily:"'Space Grotesk',sans-serif"}}>{selected.result.overallScore}<span style={{fontSize:11,color:"#3a6a3a"}}>/100</span></div>
                <span className="tag" style={{background:`${vc(selected.result.verdict)}15`,color:vc(selected.result.verdict)}}>{selected.result.verdict}</span>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[["Surface Temp",selected.result.estimatedSurfaceTemp],["Power Output",selected.result.estimatedPowerOutput],["Payback",selected.result.paybackEstimate]].map(([l,v])=>(
                <div key={l} style={{background:"#0a120a",border:"1px solid #1e3a1e",padding:10,borderRadius:3,textAlign:"center"}}>
                  <div style={{fontSize:7,color:"#3a6a3a",letterSpacing:1,marginBottom:4}}>{l.toUpperCase()}</div>
                  <div style={{fontSize:11,color:"#39ff14",fontWeight:700}}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{background:"#0a120a",border:"1px solid #1e3a1e",padding:12,borderRadius:3,marginBottom:12}}>
              <div className="shdr">Sub-scores</div>
              {[["thermalScore","Thermal"],["integrityScore","Integrity"],["solarScore","Solar"],["deploymentScore","Deployment"]].map(([k,l])=>(
                <ScoreBar key={k} score={selected.result[k]} label={l}/>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div>
                <div className="shdr">Strengths</div>
                {selected.result.topStrengths?.map((s,i)=><div key={i} style={{borderLeft:"2px solid #39ff14",paddingLeft:8,marginBottom:5,fontSize:10,color:"#8aaa8a",lineHeight:1.5}}>{s}</div>)}
              </div>
              <div>
                <div className="shdr">Risks</div>
                {selected.result.topRisks?.map((r,i)=><div key={i} style={{borderLeft:"2px solid #ff6b6b",paddingLeft:8,marginBottom:5,fontSize:10,color:"#8aaa8a",lineHeight:1.5}}>{r}</div>)}
              </div>
            </div>

            <div className="ic">{selected.result.recommendation}</div>
            <div style={{fontSize:8,color:"#3a6a3a",letterSpacing:1,marginBottom:3}}>MWCNT NANOFLUID</div>
            <div className="ic">{selected.result.nanofluidNote}</div>
            <div style={{fontSize:8,color:"#3a6a3a",letterSpacing:1,marginBottom:3}}>SOLAR BOOST</div>
            <div className="ic">{selected.result.solarBoostNote}</div>
          </div>
        )}

        {/* INTEL */}
        {view==="intel" && intel && (
          <div style={{animation:"fadeIn 0.3s"}}>
            <div className="shdr">Fleet Intelligence — {wells.length} Wells</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[["Fleet Avg",intel.avgScore,sc(intel.avgScore)],["Best Country",intel.bestCountry||"—",null],["Best Rock",intel.bestRock||"—",null]].map(([l,v,c])=>(
                <div key={l} style={{background:"#0a120a",border:"1px solid #1e3a1e",padding:10,borderRadius:3,textAlign:"center"}}>
                  <div style={{fontSize:7,color:"#3a6a3a",letterSpacing:1,marginBottom:4}}>{l.toUpperCase()}</div>
                  <div style={{fontSize:12,fontWeight:700,color:c||"#c8e6c8"}}>{v}</div>
                </div>
              ))}
            </div>
            <div className="ic" style={{borderLeft:"2px solid #39ff14"}}><div style={{fontSize:7,color:"#39ff14",letterSpacing:2,marginBottom:5}}>FLEET INSIGHT</div>{intel.fleetInsight}</div>
            {intel.deployPriority?.length>0 && (
              <div style={{marginBottom:12}}>
                <div className="shdr">Deploy Priority</div>
                {intel.deployPriority.map((id,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 12px",background:"#0a120a",border:"1px solid #1e3a1e",marginBottom:4,borderRadius:3}}>
                    <span style={{fontSize:12,color:"#39ff14",fontWeight:700,minWidth:20}}>#{i+1}</span>
                    <span style={{fontSize:11}}>{id}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="ic" style={{borderLeft:"2px solid #ff6b6b"}}><div style={{fontSize:7,color:"#ff6b6b",letterSpacing:2,marginBottom:5}}>AVOID PATTERN</div>{intel.avoidPattern}</div>
            <div className="ic" style={{borderLeft:"2px solid #39ff14"}}><div style={{fontSize:7,color:"#39ff14",letterSpacing:2,marginBottom:5}}>NEXT ACTION</div>{intel.nextBestAction}</div>
          </div>
        )}
      </div>
    </div>
  );
}
