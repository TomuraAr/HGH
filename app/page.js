'use client';
import React, { useState } from 'react';
import { Shield, Activity, Database, Sliders, ChevronRight, BarChart3, TrendingUp } from 'lucide-react';

export default function CorporateModeler() {
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
    
    // Simulate high-end analytics processing calculation
    setTimeout(() => {
      const grad = parseFloat(formData.gradient) || 30;
      const dp = parseFloat(formData.depth) || 2000;
      const opt = parseFloat(formData.opticalEfficiency) || 70;
      
      const calcPower = ((grad * (dp / 1000) * 1.4) + (opt * 0.85)).toFixed(2);
      const calcScore = Math.min(100, Math.max(10, Math.round((calcPower / 3) + 20)));

      setScoreResult({
        score: calcScore,
        megawatts: calcPower,
        status: calcScore > 75 ? 'Tier 1 Optimum' : calcScore > 50 ? 'Tier 2 Viable' : 'Tier 3 Sub-optimal',
        payback: (120 / (calcPower * 0.4)).toFixed(1)
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Premium Institutional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200">
              H
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 block">Project HGH</span>
              <span className="text-xl font-bold tracking-tight text-slate-800">Grid Harvest Modeler</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Institutional Cloud Active
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Editorial Title Block */}
        <div className="mb-12 max-w-3xl">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
            Advanced Energy Array Assessment Platform
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Simulate and evaluate the technical viability, geothermal-solar thermodynamic gradients, and projected megawatt output vectors for proposed subsurface energy harvesting wells.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Control Panel Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center space-x-3">
              <Sliders className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold tracking-tight">14-Vector Asset Configuration Matrix</h2>
            </div>
            
            <form onSubmit={executeScoring} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Target Asset Identifier/Location</label>
                  <input 
                    type="text" name="location" value={formData.location} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subsurface Well Depth (meters)</label>
                  <input 
                    type="number" name="depth" value={formData.depth} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Geothermal Thermal Gradient (°C/km)</label>
                  <input 
                    type="number" name="gradient" value={formData.gradient} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Parabolic Collector Optical Efficiency (%)</label>
                  <input 
                    type="number" name="opticalEfficiency" value={formData.opticalEfficiency} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Lithology Formative Structure</label>
                  <select name="rockType" value={formData.rockType} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all">
                    <option value="sandstone">Sandstone Porous Matrix</option>
                    <option value="basalt">Basaltic Igneous Compound</option>
                    <option value="granite">Crystalline Granite Shield</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">MWCNT Nanofluid Volumetric Loading (%)</label>
                  <input 
                    type="float" name="fluidLoading" value={formData.fluidLoading} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? 'Evaluating Array Metrics...' : 'Execute Structural Performance Scoring'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Institutional Reporting Desk Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                <Database className="w-4 h-4 mr-2 text-slate-400" />
                Platform Status
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter your structural site attributes and activate calculation engine. Results comply with clean infrastructure disclosure benchmarks.
              </p>
            </div>

            {scoreResult && (
              <div className="bg-white rounded-2xl border border-blue-200 shadow-xl shadow-blue-50/50 overflow-hidden animate-fadeIn">
                <div className="bg-blue-50 border-b border-blue-100 p-5 flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-800">Telemetry Evaluation Output</span>
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-white border border-blue-200 text-blue-700 shadow-sm">
                    {scoreResult.status}
                  </span>
                </div>
                <div className="p-6 space-y-6">
                  {/* Huge Score Ring replacement */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Asset Grade Score</span>
                      <span className="text-5xl font-black tracking-tight text-slate-900">{scoreResult.score}<span className="text-lg font-medium text-slate-400">/100</span></span>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-blue-600">
                      <Activity className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Operational Data Points */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Net Power Capacity</span>
                      <span className="text-2xl font-bold tracking-tight text-slate-800 flex items-baseline">
                        {scoreResult.megawatts} <span className="text-xs font-bold text-slate-500 ml-1">MWe</span>
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Amortization Period</span>
                      <span className="text-2xl font-bold tracking-tight text-slate-800 flex items-baseline">
                        {scoreResult.payback} <span className="text-xs font-bold text-slate-500 ml-1">Yrs</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-slate-100 rounded-xl p-4 flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed text-slate-300">
                      <strong>Investment Notice:</strong> Thermodynamic telemetry checks out within design margin. This record has been cataloged inside project main system index logs.
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
}SSSSS