
import React, { useCallback, useEffect, useState } from 'react';
import { History, RefreshCw, AlertCircle, Sprout } from 'lucide-react';

interface PredictionRecord {
  created_at?: string;
  district?: string;
  season?: string;
  current_crop?: string;
  recommended_crop?: string;
  recommended_score?: number | string;
  current_crop_score?: number | string;
  decision?: string;
  risk_level?: string;
  best_crop?: string | { crop?: string; name?: string };
  alternatives?: unknown[];
  [key: string]: unknown;
}

interface HistoryResponse {
  status: string;
  count: number;
  history: PredictionRecord[];
  message?: string;
}

const getCropName = (record: PredictionRecord): string => {
  if (typeof record.recommended_crop === 'string') {
    return record.recommended_crop;
  }

  if (typeof record.best_crop === 'string') {
    return record.best_crop;
  }

  if (record.best_crop && typeof record.best_crop === 'object') {
    return record.best_crop.crop || record.best_crop.name || 'Not available';
  }

  return 'Not available';
};

export const PredictionHistory: React.FC = () => {
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:5000/history');
      const data: HistoryResponse = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Could not load prediction history.');
      }

      setRecords(Array.isArray(data.history) ? data.history : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the backend.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  return (
    <section className="space-y-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Prediction History
              </h2>
              <p className="text-xs text-slate-500">
                Previous crop recommendations saved in the database
              </p>
            </div>
          </div>

          <button
            onClick={() => void loadHistory()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
          <p className="text-xs font-semibold text-emerald-800">
            Total saved predictions
          </p>
          <p className="text-2xl font-black text-emerald-900 mt-1">
            {records.length}
          </p>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">
            Loading prediction history...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-white rounded-2xl p-5 border border-red-200">
          <div className="flex items-start gap-2 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold text-sm">Unable to load history</p>
              <p className="text-xs mt-1">{error}</p>
              <p className="text-xs mt-2">
                Check that the Flask backend is running on port 5000.
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
          <Sprout className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
          <p className="font-bold text-slate-800">No predictions yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Generate a crop recommendation to see it here.
          </p>
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="space-y-3">
          {records.map((record, index) => (
            <article
              key={`${record.created_at || 'prediction'}-${index}`}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Prediction {records.length - index}
                  </p>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {getCropName(record)}
                  </h3>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {record.risk_level
                    ? `Risk: ${record.risk_level}`
                    : 'Recommendation'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    District
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {record.district || 'Not available'}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Season
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {record.season || 'Not available'}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Recommended score
                  </p>
                  <p className="text-sm font-bold text-emerald-700 mt-1">
                    {record.recommended_score != null
                      ? `${record.recommended_score}%`
                      : 'Not available'}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Previous crop
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {record.current_crop || 'Not available'}
                  </p>
                </div>
              </div>

              {record.decision && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-amber-800">
                    Decision
                  </p>
                  <p className="text-xs font-semibold text-amber-950 mt-1">
                    {record.decision}
                  </p>
                </div>
              )}

              <p className="text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                {record.created_at
                  ? `Saved: ${new Date(record.created_at).toLocaleString()}`
                  : 'Date not available'}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
