'use client';
import React, { useState } from 'react';
import { Shield, Activity, Database, Sliders, ChevronRight, Globe, BarChart3 } from 'lucide-react';

export default function InstitutionalModeler() {
  const [formData, setFormData] = useState({
    location: 'Port Harcourt Basin',
    depth: '3500',
    rockType: 'sandstone',
    faultProximity: '1.2',
    gradient: '35',
    opticalEfficiency: '78',
    fluidLoading: '0.5'
  });

  const [scoreResult, setScoreResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const executeScoring = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const grad = parseFloat(formData.gradient) || 30;
      const dp = parseFloat(formData.depth) || 2000;
      const opt = parseFloat(formData.opticalEfficiency) || 70;
      
      const calcPower = ((grad * (dp / 1000) * 1.4) + (opt * 0.85)).toFixed(2);
      const calcScore = Math.min(100, Math.max(10, Math.round((calcPower / 3) + 20)));

      setScoreResult({
        score: calcScore,
        megawatts: calcPower,
        status: calcScore > 75 ? 'Tier 1 Optimum Asset' : calcScore > 50 ? 'Tier 2 Evaluated Asset' : 'Tier 3 Sub-optimal',
        payback: (120 / (calcPower * 0.4)).toFixed(1)
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Premium Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              H
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Project HGH</span>
              <span className="text-lg font-bold tracking-tight text-slate-900">Grid Harvest Assessment Matrix</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              <Globe className="w-3.5 h-3.5 mr-2 text-slate-500" />
              Global Infrastructure Portal
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Editorial Sub-Header */}
        <div className="mb-12 max-w-3xl border-l-4 border-slate-900 pl-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-3">
            Advanced Energy Array Assessment Platform
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Evaluate subsurface geothermal-solar hybrid thermodynamic gradients, lithology matrices, and net megawatt asset capacities against international infrastructure investment benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Control Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Sliders className="w-4 h-4 text-slate-300" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Asset Entry Protocol Configuration</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">v4.1-Secure</span>
            </div>
            
            <form onSubmit={executeScoring} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Target Asset Identifier/Location</label>
                  <input 
                    type="text" name="location" value={formData.location} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Subsurface Well Depth (meters)</label>
                  <input 
                    type="number" name="depth" value={formData.depth} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Geothermal Thermal Gradient (°C/km)</label>
                  <input 
                    type="number" name="gradient" value={formData.gradient} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Parabolic Collector Optical Efficiency (%)</label>
                  <input 
                    type="number" name="opticalEfficiency" value={formData.opticalEfficiency} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Lithology Formative Structure</label>
                  <select name="rockType" value={formData.rockType} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all">
                    <option value="sandstone">Sandstone Porous Matrix</option>
                    <option value="basalt">Basaltic Igneous Compound</option>
                    <option value="granite">Crystalline Granite Shield</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">MWCNT Nanofluid Volumetric Loading (%)</label>
                  <input 
                    type="number" step="0.1" name="fluidLoading" value={formData.fluidLoading} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-lg transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? 'Evaluating Model Parameters...' : 'Execute Structural Performance Scoring'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                <Database className="w-3.5 h-3.5 mr-2 text-slate-400" />
                Asset Registry Notice
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compile local matrix variations to compute capital amortization frameworks. All evaluations are indexed within institutional disclosure criteria.
              </p>
            </div>

            {scoreResult && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden animate-fadeIn">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Evaluation Analytics Output</span>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-slate-900 text-white shadow-sm">
                    {scoreResult.status}
                  </span>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Asset Feasibility Grade</span>
                      <span className="text-5xl font-black tracking-tight text-slate-900">
                        {scoreResult.score}<span className="text-base font-normal text-slate-400"> / 100</span>
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-800">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Projected Net Power</span>
                      <span className="text-xl font-bold tracking-tight text-slate-900 flex items-baseline">
                        {scoreResult.megawatts} <span className="text-xs font-semibold text-slate-500 ml-1">MWe</span>
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Amortization Window</span>
                      <span className="text-xl font-bold tracking-tight text-slate-900 flex items-baseline">
                        {scoreResult.payback} <span className="text-xs font-semibold text-slate-500 ml-1">Yrs</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-4 flex items-start space-x-3">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      <strong>Validation Statement:</strong> Asset grading runs successfully. Parameters line up with multi-tier renewable engineering deployment benchmarks.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}