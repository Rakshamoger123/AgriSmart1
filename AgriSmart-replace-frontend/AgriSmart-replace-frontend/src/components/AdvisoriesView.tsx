import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Send, 
  PlusCircle, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdvisoryPost, UserRole } from '../types';

interface AdvisoriesViewProps {
  advisories: AdvisoryPost[];
  userRole: UserRole;
  onAddAdvisory?: (newAdv: AdvisoryPost) => void;
  onBackToDashboard: () => void;
}

export const AdvisoriesView: React.FC<AdvisoriesViewProps> = ({
  advisories,
  userRole,
  onAddAdvisory,
  onBackToDashboard
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [showPostForm, setShowPostForm] = useState<boolean>(false);

  // Form state
  const [title, setTitle] = useState('');
  const [district, setDistrict] = useState('Belagavi');
  const [category, setCategory] = useState<AdvisoryPost['category']>('Pest Alert');
  const [importance, setImportance] = useState<AdvisoryPost['importance']>('High');
  const [content, setContent] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);

  const filtered = advisories.filter((a) => {
    if (selectedDistrict === 'all') return true;
    return a.district === selectedDistrict;
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAdv: AdvisoryPost = {
      id: `ADV-${String(advisories.length + 1).padStart(3, '0')}`,
      title: title.trim(),
      district,
      category,
      importance,
      date: 'Just now',
      author: 'Dr. Suresh Gowda (Extension Specialist)',
      content: content.trim()
    };

    if (onAddAdvisory) {
      onAddAdvisory(newAdv);
    }
    setTitle('');
    setContent('');
    setPostSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setPostSuccess(false);
      setShowPostForm(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/20">
              <FileText className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black tracking-tight">
              Official Agro-Met Advisories
            </h3>
          </div>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            Department of Agriculture & KVK Bulletins for 5 Karnataka Districts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'officer' && (
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showPostForm ? 'Close Form' : 'Broadcast Advisory'}</span>
            </button>
          )}

          <button
            onClick={onBackToDashboard}
            className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>

      {/* Officer Advisory Post Form */}
      {showPostForm && (
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-500/40 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm border-b border-slate-100 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Broadcast Official Advisory / Alert</span>
          </div>

          <form onSubmit={handlePost} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Advisory Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bordeaux Spray Schedule for Arecanut"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Target District *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                >
                  <option value="Belagavi">Belagavi(North)</option>
                  <option value="Raichur">Raichur</option>
                  <option value="Dakshina Kannada">Dakshina Kannada</option>
                  <option value="Udupi">Udupi</option>
                  <option value="Shivamogga">Shivamogga</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="Pest Alert">Pest Alert</option>
                  <option value="Weather Advisory">Weather Advisory</option>
                  <option value="Fertilizer Guide">Fertilizer Guide</option>
                  <option value="Sowing Window">Sowing Window</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Priority / Importance
                </label>
                <select
                  value={importance}
                  onChange={(e) => setImportance(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Detailed Agronomic Instructions & Remedial Measures *
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter chemical composition, dosages, timing, and safety precautions..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            {postSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Advisory successfully published and broadcasted to farmers!</span>
              </div>
            )}

            <button
              type="submit"
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publish Advisory</span>
            </button>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          <span>District:</span>
        </span>
        {['all', 'Belagavi', 'Raichur', 'Dakshina Kannada', 'Udupi', 'Shivamogga'].map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDistrict(d)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedDistrict === d
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {d === 'all' ? 'All 5 Districts' : d}
          </button>
        ))}
      </div>

      {/* Advisories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((adv) => (
          <div
            key={adv.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3 flex flex-col justify-between hover:border-emerald-300 transition"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  adv.importance === 'Critical'
                    ? 'bg-red-100 text-red-800'
                    : adv.importance === 'High'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {adv.category} • {adv.importance} Priority
                </span>

                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{adv.date}</span>
                </span>
              </div>

              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                {adv.title}
              </h4>

              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <MapPin className="w-3.5 h-3.5" />
                <span>{adv.district}, Karnataka</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                {adv.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium flex items-center justify-between">
              <span>By: {adv.author}</span>
              <span className="text-emerald-700 font-bold">Official KVK</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
