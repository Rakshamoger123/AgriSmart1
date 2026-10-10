import React, { useEffect, useMemo, useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  RefreshCw,
  MapPin,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sprout,
  BarChart3,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PredictSimulatorProps {
  initialDistrict: string;
  onApplyRecommendation: (district: string) => void;
}

interface CropRanking {
  crop: string;
  score: number;
  rank: number;
  confidence?: number;
}

interface SuitabilityBreakdown {
  climate_soil_score?: number | null;
  rainfall_suitability?: number | null;
  ml_model_support?: number | null;
  district_evidence?: string | null;
}

interface PredictionResponse {
  district: string;
  season: string;
  current_crop?: string | null;
  current_crop_score?: number | null;
  recommended_crop: string;
  recommended_score: number;
  score_difference?: number | null;
  decision: string;
  best_crop?: CropRanking;
  alternatives?: CropRanking[];
  rankings?: CropRanking[];
  suitability_breakdown?: SuitabilityBreakdown;
  prediction_method?: string;
  note?: string;
  error?: string;
}

interface OptionsResponse {
  districts: string[];
  seasons: string[];
  crops: string[];
  error?: string;
}


const API_BASE = 'http://127.0.0.1:5000';


const scoreLabel = (score: number | null | undefined) =>
  typeof score === 'number' && Number.isFinite(score) ? `${score.toFixed(2)}%` : 'Not available';

const decisionStyle = (decision: string) => {
  const value = decision.toLowerCase();
  if (value.includes('strong')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (value.includes('potential') || value.includes('improvement')) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (value.includes('top ranked')) return 'bg-sky-100 text-sky-800 border-sky-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

export const PredictSimulator: React.FC<PredictSimulatorProps> = ({
  initialDistrict,
  onApplyRecommendation,
}) => {
  const [district, setDistrict] = useState(initialDistrict || 'Belagavi');
  const [season, setSeason] = useState('Monsoon');
  const [currentCrop, setCurrentCrop] = useState('');
  const [options, setOptions] = useState<OptionsResponse>({ districts: [], seasons: [], crops: [] });
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/options`)
      .then(async (response) => {
        const data = (await response.json()) as OptionsResponse;
        if (!response.ok) throw new Error(data.error || 'Could not load district, season, and crop options.');
        if (active) {
          setOptions(data);
          if (data.districts?.length && !data.districts.includes(initialDistrict)) {
            setDistrict(data.districts[0]);
          }
          if (data.seasons?.length && !data.seasons.includes('Monsoon')) {
            setSeason(data.seasons[0]);
          }
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : 'Could not load prediction options.');
        }
      });
    return () => {
      active = false;
    };
  }, [initialDistrict]);

  const rankings = useMemo(() => {
    if (result?.rankings?.length) return result.rankings;
    if (result?.best_crop) return [result.best_crop, ...(result.alternatives || [])];
    return [];
  }, [result]);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district,
          season,
          current_crop: currentCrop,
        }),
      });
      const data = (await response.json()) as PredictionResponse;
      if (!response.ok) throw new Error(data.error || 'Prediction failed. Please check the selected options.');
      setResult(data);
      if (data.recommended_crop || data.best_crop?.crop) {
        confetti({ particleCount: 45, spread: 55, origin: { y: 0.65 } });
      }
    } catch (error: unknown) {
      setResult(null);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to get a crop recommendation from the backend.');
    } finally {
      setIsSimulating(false);
    }
  };

  const breakdown = result?.suitability_breakdown;
  const breakdownItems = [
    { label: 'Climate & soil score', value: breakdown?.climate_soil_score },
    { label: 'Rainfall suitability', value: breakdown?.rainfall_suitability },
    { label: 'ML model support', value: breakdown?.ml_model_support },
  ];

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 p-5 text-white shadow-md">
        <div className="flex items-start gap-3">
          <span className="rounded-2xl bg-white/20 p-2.5"><FlaskConical className="h-5 w-5" /></span>
          <div>
            <h3 className="text-base font-black tracking-tight sm:text-lg">Climate-Smart Crop Recommendation</h3>
            <p className="mt-1 text-sm leading-relaxed text-emerald-50">
              Compare the current crop with the highest-ranked option for your district and season.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Recommendation inputs</h4>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="agri-district" className="text-sm font-bold text-slate-700">District</label>
            <select id="agri-district" value={district} onChange={(e) => { setDistrict(e.target.value); setResult(null); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base font-semibold text-slate-800 outline-none focus:border-emerald-500">
              {(options.districts.length ? options.districts : [district]).map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="agri-season" className="text-sm font-bold text-slate-700">Season</label>
            <select id="agri-season" value={season} onChange={(e) => { setSeason(e.target.value); setResult(null); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base font-semibold text-slate-800 outline-none focus:border-emerald-500">
              {(options.seasons.length ? options.seasons : [season]).map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="agri-current-crop" className="text-sm font-bold text-slate-700">Current crop</label>
            <select id="agri-current-crop" value={currentCrop} onChange={(e) => { setCurrentCrop(e.target.value); setResult(null); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base font-semibold text-slate-800 outline-none focus:border-emerald-500">
              <option value="">Select current crop</option>
              {options.crops.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            {!options.crops.length && <p className="text-xs text-slate-500">Crop options could not be loaded. Check that the Flask /options endpoint is running.</p>}
          </div>

          <button onClick={handleRunSimulation} disabled={isSimulating || !district || !season || !currentCrop} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-base font-extrabold text-white shadow-md transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-60">
            {isSimulating ? <><RefreshCw className="h-4 w-4 animate-spin" />Generating recommendation…</> : <><Sparkles className="h-4 w-4" />Generate Recommendation</>}
          </button>
          {errorMessage && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-base text-rose-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{errorMessage}</span></div>}
        </section>

        <section className="space-y-4 rounded-3xl bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 p-5 text-white shadow-md lg:col-span-7">
          {!result ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <span className="rounded-2xl bg-white/10 p-4"><Sprout className="h-8 w-8 text-emerald-200" /></span>
              <h4 className="mt-4 text-xl font-black">Your recommendation will appear here</h4>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-emerald-100">Choose a district, season, and current crop, then generate a recommendation to compare the available suitability scores.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/15 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-amber-300"><Award className="h-4 w-4" />Recommended crop</div>
                  <h4 className="mt-2 text-2xl font-black sm:text-3xl">{result.recommended_crop || result.best_crop?.crop || 'Not available'}</h4>
                  <p className="mt-1 text-sm text-emerald-100">{result.district} · {result.season}</p>
                </div>
                <div className="rounded-2xl bg-emerald-500/20 px-4 py-3 text-right">
                  <p className="text-xs font-semibold text-emerald-100">Suitability score</p>
                  <p className="mt-1 text-2xl font-black text-white">{scoreLabel(result.recommended_score ?? result.best_crop?.score)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><p className="text-xs text-emerald-100">Current crop</p><p className="mt-1 font-bold">{result.current_crop || currentCrop}</p><p className="mt-1 text-sm font-extrabold text-white">{scoreLabel(result.current_crop_score)}</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><p className="text-xs text-emerald-100">Recommended crop</p><p className="mt-1 font-bold">{result.recommended_crop || result.best_crop?.crop}</p><p className="mt-1 text-sm font-extrabold text-white">{scoreLabel(result.recommended_score ?? result.best_crop?.score)}</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><p className="text-xs text-emerald-100">Score difference</p><p className="mt-1 text-lg font-black text-amber-300">{typeof result.score_difference === 'number' ? `${result.score_difference > 0 ? '+' : ''}${result.score_difference.toFixed(2)} pts` : 'Not available'}</p></div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Decision</div>
                <span className={`mt-3 inline-flex rounded-full border px-3 py-1.5 text-xs font-extrabold ${decisionStyle(result.decision || '')}`}>{result.decision || 'Decision unavailable'}</span>
                <p className="mt-3 text-sm leading-relaxed text-emerald-50">
                  {typeof result.score_difference === 'number'
                    ? result.score_difference > 0
                      ? `${result.recommended_crop} has a suitability score ${result.score_difference.toFixed(2)} points higher than ${result.current_crop || currentCrop}. Treat this as a ranking indicator, not a guarantee of yield.`
                      : result.score_difference === 0
                        ? 'The current and recommended crop have equal suitability scores in the available ranking data.'
                        : `${result.current_crop || currentCrop} scores higher than the recommended option in the returned ranking data. Review the ranking before switching.`
                    : 'A current-crop score was not available for this district and season, so a score comparison cannot be made.'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center gap-2 font-bold"><BarChart3 className="h-4 w-4 text-emerald-300" />Suitability breakdown</div>
                <div className="space-y-3">
                  {breakdownItems.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between gap-3 text-xs"><span className="text-emerald-100">{item.label}</span><span className="font-bold text-white">{scoreLabel(item.value)}</span></div>
                      {typeof item.value === 'number' && <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-300" style={{ width: `${Math.max(0, Math.min(100, item.value))}%` }} /></div>}
                    </div>
                  ))}
                  {breakdownItems.every((item) => typeof item.value !== 'number') && <p className="text-xs leading-relaxed text-emerald-100">Component scores are not available in the current ranking data. No component values have been estimated.</p>}
                  {breakdown?.district_evidence && <p className="border-t border-white/10 pt-2 text-xs text-emerald-100">Evidence: {breakdown.district_evidence}</p>}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-3 font-bold"><Sprout className="h-4 w-4 text-emerald-300" />Top 3 suitable crops</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/10 text-xs uppercase text-emerald-100"><tr><th className="px-4 py-3">Crop</th><th className="px-4 py-3">Suitability score</th><th className="px-4 py-3 text-right">Rank</th></tr></thead>
                    <tbody>
                      {rankings.slice(0, 3).map((item, index) => <tr key={`${item.crop}-${item.rank ?? index}`} className="border-t border-white/10"><td className="px-4 py-3 font-semibold">{item.crop}</td><td className="px-4 py-3">{scoreLabel(item.score)}</td><td className="px-4 py-3 text-right">#{item.rank ?? index + 1}</td></tr>)}
                      {!rankings.length && <tr><td colSpan={3} className="px-4 py-4 text-center text-emerald-100">Ranking details are not available.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {result.note && <p className="text-xs leading-relaxed text-emerald-100">{result.note}</p>}
              <button onClick={() => onApplyRecommendation(district)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-300"><span>View in Dashboard</span><ArrowRight className="h-4 w-4" /></button>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
