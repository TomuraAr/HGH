// app/api/score/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Destructure all 14 parameters matching your exact specification sheet
    const {
      location, depth, age, diameter, wellType,
      knownTemp, geoGradient, formationRock,
      solarIrradiance, gridDistance, integrity,
      nanofluidConcentration, troughEfficiency, operationalDays
    } = body;

    // Convert inputs to numbers safely
    const depthNum = parseFloat(depth) || 0;
    const tempNum = parseFloat(knownTemp) || 0;
    const gradientNum = parseFloat(geoGradient) || 0;
    const solarNum = parseFloat(solarIrradiance) || 0;
    const integrityNum = parseFloat(integrity) || 0;
    const gridDistNum = parseFloat(gridDistance) || 0;
    const nanoConc = parseFloat(nanofluidConcentration) || 0.5;
    const troughEff = parseFloat(troughEfficiency) || 70;

    // Core Technical Evaluation Calculations (Scores range 0-100)
    const thermalScore = Math.min(100, Math.round((tempNum / 200) * 50 + (gradientNum / 45) * 50));
    const integrityScore = Math.min(100, Math.max(0, Math.round(integrityNum * 10 - (parseFloat(age) || 0) * 1.2)));
    const solarScore = Math.min(100, Math.round((solarNum / 7) * 100));
    const deploymentScore = Math.min(100, Math.max(0, Math.round(100 - (gridDistNum * 4.5))));

    // Weighted Overall Framework Score
    const overallScore = Math.round(
      (thermalScore * 0.35) + 
      (integrityScore * 0.25) + 
      (solarScore * 0.20) + 
      (deploymentScore * 0.20)
    );

    // Operational Verdict Engine
    let verdict = "High Viability Deployment";
    if (overallScore < 55) verdict = "Unviable / High Risk Factor";
    else if (overallScore < 75) verdict = "Conditional / Semi-Viable Deployment";

    // Thermodynamic Forecast Modeling
    const estSurfaceTemp = Math.round(tempNum * 0.94);
    // Net energy scaling using nanofluid and trough gains
    const fluidMultiplier = 1 + (nanoConc * 0.2); 
    const troughMultiplier = 1 + (troughEff / 200);
    const estPowerOutput = (((thermalScore * 1.4) * fluidMultiplier) + ((solarScore * 1.9) * troughMultiplier)) / 10;
    const paybackPeriod = Math.max(2.1, (11.5 - (overallScore * 0.09))).toFixed(1);

    // Deep Material-Level Insights Text Blocks
    const materialNotes = `MWCNT nanofluid configured at ${nanoConc}% loading maximizes subterranean convective heat flux. This dynamic pairing alongside high-reflectivity parabolic trough collectors (${troughEff}% efficiency) dramatically suppresses thermal gradient decay over long-distance fluid loops.`;

    return NextResponse.json({
      overallScore,
      verdict,
      subScores: { thermalScore, integrityScore, solarScore, deploymentScore },
      metrics: { estSurfaceTemp, estPowerOutput: estPowerOutput.toFixed(2), paybackPeriod },
      strengths: [
        thermalScore > 75 ? "Excellent downhole thermodynamic energy profile." : "Favorable baseline fluid heat levels.",
        integrityScore > 65 ? "Wellbore structural casing retains high pressure threshold capacities." : "Well configuration fits standard coaxial installation setups.",
        solarNum > 5.0 ? "Abundant localized solar footprint guarantees flawless surface loop superheating." : "Acceptable localized surface irradiance metrics."
      ],
      risks: [
        gridDistNum > 8 ? `Extended grid distance (${gridDistNum}km) requires heightened substructure capital expenditures.` : "Minimal grid infrastructure matching friction expected.",
        integrityScore < 55 ? "Casing structural integrity metrics demand immediate pre-deployment rehabilitation." : "Standard downhole structural stress expected.",
        depthNum > 3800 ? "Deep well hydrodynamics will escalate pumping friction losses." : "Fluid circulation demands remain within nominal operational parameters."
      ],
      materialNotes
    });

  } catch (error) {
    return NextResponse.json({ error: "System processing failure or syntax syntax mismatch." }, { status: 400 });
  }
}