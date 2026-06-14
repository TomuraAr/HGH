// app/page.js
'use html';
'use client';
import { useState } from 'react';
import { Shield, Flame, Sun, Truck, CheckCircle, AlertTriangle, Cpu, Zap } from 'lucide-react';

export default function EngineDashboard() {
  const [inputs, setInputs] = useState({
    location: 'Port Harcourt', depth: '3500', age: '12', diameter: '9.625', wellType: 'Abandoned Oil Well',
    knownTemp: '165', geoGradient: '35', formationRock: 'Sandstone',
    solarIrradiance: '5.8', gridDistance: '3.2', integrity: '8',
    nanofluidConcentration: '0.5', troughEfficiency: '72', operationalDays: '330'
  });

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const runAnalysis = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error("Simulation engine integration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      
      {/* Visual Navigation Bar Area */}
      <header className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
              PROJECT HGH // GRID MODELER
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">HYBRID GRADIENT COAXIAL HARVESTER ANALYTICS CORE</p>
          </div>
        </div>
      </header>

      {/* Main Framework Grid Splits */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Control Input Deck (Form) */}
        <form onSubmit={runAnalysis} className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-200">14-Vector Simulation Parameters</h2>
            <p className="text-xs text-slate-500">Configure geological and hardware arrays below.</p>
          </div>
          
          {/* Group 1: Mechanical Well Profile */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">Well Architecture</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Geographic Location / Basin Context</label>
                <input type="text" name="location" value={inputs.location} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Structural Classification</label>
                <input type="text" name="wellType" value={inputs.wellType} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Measured Depth (m)</label>
                <input type="number" name="depth" value={inputs.depth} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Casing Age (Years)</label>
                <input type="number" name="age" value={inputs.age} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Inner Diameter (in)</label>
                <input type="number" step="0.001" name="diameter" value={inputs.diameter} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
            </div>
          </div>

          {/* Group 2: Geothermal Subsurface */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">Thermodynamic Subsurface Matrix</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Reservoir Temp (°C)</label>
                <input type="number" name="knownTemp" value={inputs.knownTemp} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Geothermal Gradient (°C/km)</label>
                <input type="number" name="geoGradient" value={inputs.geoGradient} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Lithological Rock Matrix Composition</label>
                <input type="text" name="formationRock" value={inputs.formationRock} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
            </div>
          </div>

          {/* Group 3: Solar & Surface Logistics */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-500">Advanced Materials & Logistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Irradiance (kWh/m²/d)</label>
                <input type="number" step="0.1" name="solarIrradiance" value={inputs.solarIrradiance} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Grid Proximity (km)</label>
                <input type="number" step="0.1" name="gridDistance" value={inputs.gridDistance} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">MWCNT Loading (%)</label>
                <input type="number" step="0.01" name="nanofluidConcentration" value={inputs.nanofluidConcentration} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Trough Optical Eff (%)</label>
                <input type="number" name="troughEfficiency" value={inputs.troughEfficiency} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Mechanical Integrity Profile Score (1-10)</label>
                <input type="number" min="1" max="10" name="integrity" value={inputs.integrity} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-black tracking-wide rounded-lg transition-all shadow-lg disabled:opacity-40">
            {loading ? 'RUNNING INTEGRATED COMPILATION ENGINE...' : 'EXECUTE FULL HARVEST SCORING'}
          </button>
        </form>

        {/* Right Output View Deck (Dashboard Engine Display) */}
        <div className="lg:col-span-7 space-y-6">
          {analysis ? (
            <div className="space-y-6">
              
              {/* Main Score Banner */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-orange-500/5 blur-2xl rounded-full"></div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">System Viability Target Verdict</span>
                  <h3 className="text-xl font-black text-slate-100 mt-1">{analysis.verdict}</h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">Framework scores above 75 point toward direct deployment efficiency via internal loop setups.</p>
                </div>
                <div className="flex flex-col items-center justify-center w-28 h-28 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-4xl font-black text-orange-400">{analysis.overallScore}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">Index Score</span>
                </div>
              </div>

              {/* Sub Score Performance Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Thermal Loop", val: analysis.subScores.thermalScore, icon: Flame, color: "text-red-400", bg: "bg-red-500/5" },
                  { label: "Casing Structural", val: analysis.subScores.integrityScore, icon: Shield, color: "text-blue-400", bg: "bg-blue-500/5" },
                  { label: "Solar Footprint", val: analysis.subScores.solarScore, icon: Sun, color: "text-yellow-400", bg: "bg-yellow-500/5" },
                  { label: "Grid Integration", val: analysis.subScores.deploymentScore, icon: Truck, color: "text-emerald-400", bg: "bg-emerald-500/5" },
                ].map((item, index) => (
                  <div key={index} className={`bg-slate-900 border border-slate-800 p-4 rounded-xl text-center ${item.bg}`}>
                    <div className="flex justify-center mb-1"><item.icon className={`w-5 h-5 ${item.color}`} /></div>
                    <span className="text-xs text-slate-400 block truncate font-medium">{item.label}</span>
                    <span className="text-lg font-extrabold text-slate-100 block mt-1">{item.val}%</span>
                  </div>
                ))}
              </div>

              {/* Production Estimates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[11px] font-mono text-slate-500 uppercase block">Surface Fluid Loop Temp</span>
                  <span className="text-xl font-black text-slate-200 mt-1 block">{analysis.metrics.estSurfaceTemp}°C</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[11px] font-mono text-slate-500 uppercase block">Model Output Net Power</span>
                  <span className="text-xl font-black text-emerald-400 mt-1 block">{analysis.metrics.estPowerOutput} MW</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[11px] font-mono text-slate-500 uppercase block">Estimated Amortization</span>
                  <span className="text-xl font-black text-amber-400 mt-1 block">{analysis.metrics.paybackPeriod} Years</span>
                </div>
              </div>

              {/* System Strengths and Vulnerabilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Systemic Advantages
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300 list-inside list-disc leading-relaxed">
                    {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Engineering Vulnerabilities
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300 list-inside list-disc leading-relaxed">
                    {analysis.risks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>

              {/* Advanced Nanofluid Material Callout */}
              <div className="bg-slate-900 border-l-4 border-orange-500 p-4 rounded-r-xl space-y-1">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2 font-mono">
                  <Cpu className="w-4 h-4" /> Nanofluid & Collector Optimization Notes
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  {analysis.materialNotes}
                </p>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[420px] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-6 bg-slate-900/10">
              <Cpu className="w-10 h-10 text-slate-800 mb-2 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Awaiting Simulation Matrix Execution</h3>
              <p className="text-xs text-slate-600 max-w-xs mt-1">Configure the 14 structural vectors inside the assessment console deck to execute computational evaluation modeling.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}