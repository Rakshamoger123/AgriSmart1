import React, { useState } from 'react';
import { 
  Sprout, 
  MessageSquare, 
  Users, 
  CheckCircle, 
  Clock, 
  Search, 
  Bell, 
  Menu, 
  ChevronRight, 
  User, 
  FileText, 
  Send, 
  LogOut, 
  ShieldCheck, 
  Plus, 
  ArrowRight,
  Filter,
  Sparkles,
  CheckCircle2,
  X,
  Calendar,
  Layers,
  Award,
  BarChart3,
  Languages,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, FarmerQuery, AdvisoryPost, FarmerDirectoryRecord, NotificationItem } from '../types';
import { INITIAL_ADVISORIES, INITIAL_REGISTERED_FARMERS, INITIAL_NOTIFICATIONS } from '../data/agriData';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidNavBar } from './AndroidNavBar';
import { ProfileModal } from './ProfileModal';
import { NotificationsModal } from './NotificationsModal';
import { AdvisoriesView } from './AdvisoriesView';
import { FarmersDirectoryView } from './FarmersDirectoryView';

interface OfficerDashboardProps {
  user: UserProfile;
  queries: FarmerQuery[];
  onReplyQuery: (queryId: string, replyText: string) => void;
  onLogout: () => void;
  onSwitchToFarmer?: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  user,
  queries,
  onReplyQuery,
  onLogout,
  onSwitchToFarmer,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'queries' | 'advisory' | 'farmers' | 'notifications'>('dashboard');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('all');
  
  // Modals & Sub-views state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [advisories, setAdvisories] = useState<AdvisoryPost[]>(INITIAL_ADVISORIES);
  const [farmers, setFarmers] = useState<FarmerDirectoryRecord[]>(INITIAL_REGISTERED_FARMERS);

  // Responding Modal / State
  const [respondingQuery, setRespondingQuery] = useState<FarmerQuery | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  // Stats calculation
  const pendingCount = queries.filter((q) => q.status === 'Pending').length;
  const repliedCount = queries.filter((q) => q.status === 'Replied').length;
  const totalCount = queries.length;

  const filteredQueries = queries.filter((q) => {
    if (selectedDistrictFilter === 'all') return true;
    return q.district === selectedDistrictFilter;
  });

  const handleOpenRespond = (query: FarmerQuery) => {
    setRespondingQuery(query);
    setReplyInput(query.officerReply || '');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingQuery || !replyInput.trim()) return;

    onReplyQuery(respondingQuery.id, replyInput.trim());
    setReplySuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setReplySuccess(false);
      setRespondingQuery(null);
      setReplyInput('');
    }, 1200);
  };

  const handleAddAdvisory = (newAdv: AdvisoryPost) => {
    setAdvisories((prev) => [newAdv, ...prev]);
  };

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7f5] text-slate-800 font-sans relative">
      {/* 1. Android Status Bar */}
      <AndroidStatusBar theme="dark" />

      {/* 2. Top Android App Bar */}
      <header className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight leading-none text-white">
                Agri<span className="text-emerald-400">Smart</span>
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                OFFICER
              </span>
            </div>
            <p className="text-[10px] text-emerald-200 font-medium">
              Agri Extension Officer Desk
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white relative transition cursor-pointer border border-white/15"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-900 font-black text-[9px] flex items-center justify-center ring-2 ring-slate-900">
                {unreadNotifs}
              </span>
            )}
          </button>

          {/* Profile Avatar Button -> Leads directly to Profile Section! */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-emerald-600/40 hover:bg-emerald-600/60 text-white font-bold text-xs transition cursor-pointer border border-emerald-400/40 shadow-xs"
            title="Open Profile Section"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-black text-[11px]">
              {user.fullName ? user.fullName.charAt(0) : 'O'}
            </div>
            <span className="hidden sm:inline text-xs font-semibold truncate max-w-[100px]">
              {user.fullName ? user.fullName.split(' ')[0] : 'Officer'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-5 max-w-6xl w-full mx-auto space-y-4 pb-20 overflow-y-auto">
        {/* Navigation Switch Tabs on Top for Quick Filter */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-xs flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('queries')}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'queries'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Farmer Queries</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('advisory')}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'advisory'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Broadcast Advisory</span>
          </button>

          <button
            onClick={() => setActiveTab('farmers')}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'farmers'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Farmers Registry</span>
          </button>
        </div>

        {/* SUB-VIEW 1: Advisories Broadcaster */}
        {activeTab === 'advisory' && (
          <AdvisoriesView
            advisories={advisories}
            userRole="officer"
            onAddAdvisory={handleAddAdvisory}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* SUB-VIEW 2: Farmers Directory */}
        {activeTab === 'farmers' && (
          <FarmersDirectoryView
            farmers={farmers}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* SUB-VIEW 3: Farmer Queries Full View */}
        {activeTab === 'queries' && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Farmer Inquiries Management Desk
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Review and provide expert agronomic responses to farmers across 5 Karnataka districts
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedDistrictFilter}
                  onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">All 5 Districts</option>
                  <option value="Belagavi">Belagavi</option>
                  <option value="Raichur">Raichur</option>
                  <option value="Dakshina Kannada">Dakshina Kannada</option>
                  <option value="Udupi">Udupi</option>
                  <option value="Shivamogga">Shivamogga</option>
                </select>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100"
                >
                  Back
                </button>
              </div>
            </div>

            {/* Inquiries Cards Grid */}
            <div className="space-y-3">
              {filteredQueries.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-emerald-50/20 shadow-xs space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        {q.farmerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                          {q.farmerName}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          📍 {q.location} • {q.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          q.status === 'Pending'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {q.status}
                      </span>

                      <button
                        onClick={() => handleOpenRespond(q)}
                        className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                      >
                        {q.status === 'Replied' ? 'Edit Advice' : 'Respond'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 bg-white p-3 rounded-xl border border-slate-200">
                    "{q.query}"
                  </p>

                  {q.officerReply && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-0.5">
                      <span className="font-bold text-emerald-800 block text-[11px]">
                        ✓ Your Submitted Advice:
                      </span>
                      <p className="leading-relaxed font-medium">{q.officerReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-VIEW 4: Main Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            {/* Welcome greeting */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Officer Command Center
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Real-time Agro-Advisory & Farmer Inquiry Management
                </p>
              </div>

              {onSwitchToFarmer && (
                <button
                  onClick={onSwitchToFarmer}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Farmer App</span>
                </button>
              )}
            </div>

            {/* 4 Stat Cards with Vibrant Gradients Matching Image 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Card 1: 24 New Queries */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 rounded-3xl p-4 border border-emerald-200 shadow-xs flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800">New Queries</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {24 + pendingCount}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold">From Farmers</p>
                </div>
              </div>

              {/* Card 2: 56 Total Farmers */}
              <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50/50 rounded-3xl p-4 border border-sky-200 shadow-xs flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-sky-800">Farmers</span>
                  <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">56</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Connected</p>
                </div>
              </div>

              {/* Card 3: 32 Recommendations */}
              <div className="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 rounded-3xl p-4 border border-amber-200 shadow-xs flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800">Recommendations</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                    <Sprout className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {32 + repliedCount}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold">Given & Approved</p>
                </div>
              </div>

              {/* Card 4: 12 Pending Queries */}
              <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50/50 rounded-3xl p-4 border border-purple-200 shadow-xs flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-800">Pending</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {12 + pendingCount}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold">Action Required</p>
                </div>
              </div>
            </div>

            {/* Main 2-Column Section Matching Image 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Recent Farmer Queries Table */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Recent Farmer Queries
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Questions from local farmers requesting crop & fertilizer guidance
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedDistrictFilter}
                      onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                      className="text-xs font-bold px-2.5 py-1 bg-slate-100 rounded-xl border border-slate-200 outline-none cursor-pointer text-slate-700"
                    >
                      <option value="all">All 5 Districts</option>
                      <option value="Belagavi">Belagavi</option>
                      <option value="Raichur">Raichur</option>
                      <option value="Dakshina Kannada">Dakshina Kannada</option>
                      <option value="Udupi">Udupi</option>
                      <option value="Shivamogga">Shivamogga</option>
                    </select>

                    <button
                      onClick={() => setActiveTab('queries')}
                      className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-2">Farmer</th>
                        <th className="py-2.5 px-2">Location</th>
                        <th className="py-2.5 px-2">Query</th>
                        <th className="py-2.5 px-2">Status</th>
                        <th className="py-2.5 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredQueries.slice(0, 5).map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-2 font-bold text-slate-900 whitespace-nowrap">
                            {q.farmerName}
                          </td>
                          <td className="py-3 px-2 text-slate-500 font-medium whitespace-nowrap">
                            {q.district}
                          </td>
                          <td className="py-3 px-2 text-slate-700 font-semibold max-w-[160px] sm:max-w-xs truncate" title={q.query}>
                            {q.query}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                q.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {q.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleOpenRespond(q)}
                              className="py-1 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                            >
                              {q.status === 'Replied' ? 'Update' : 'Respond'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Quick Actions & Notifications */}
              <div className="lg:col-span-4 space-y-4">
              </div>
            </div>
          </>
        )}
      </main>

      {/* 3. Android Material 3 Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-6xl mx-auto bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 px-3 py-1.5 flex items-center justify-around z-20 shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-emerald-400 font-extrabold'
              : 'hover:text-white font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-emerald-950 text-emerald-400' : ''}`}>
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('queries')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition cursor-pointer ${
            activeTab === 'queries'
              ? 'text-emerald-400 font-extrabold'
              : 'hover:text-white font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'queries' ? 'bg-emerald-950 text-emerald-400' : ''}`}>
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Queries</span>
        </button>

        <button
          onClick={() => setActiveTab('advisory')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition cursor-pointer ${
            activeTab === 'advisory'
              ? 'text-emerald-400 font-extrabold'
              : 'hover:text-white font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'advisory' ? 'bg-emerald-950 text-emerald-400' : ''}`}>
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Advisories</span>
        </button>

        <button
          onClick={() => setActiveTab('farmers')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition cursor-pointer ${
            activeTab === 'farmers'
              ? 'text-emerald-400 font-extrabold'
              : 'hover:text-white font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'farmers' ? 'bg-emerald-950 text-emerald-400' : ''}`}>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Farmers</span>
        </button>

        {/* Profile Tab in Bottom Nav */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-xl hover:text-emerald-400 transition cursor-pointer font-medium"
        >
          <div className="p-1 rounded-xl">
            <User className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </nav>

      {/* 4. Android Bottom Gesture Pill Bar */}
      <AndroidNavBar onHome={() => setActiveTab('dashboard')} />

      {/* 5. Response Modal for Officer */}
      {respondingQuery && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5 text-emerald-800 font-extrabold text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Agricultural Officer Guidance Desk</span>
              </div>
              <button
                onClick={() => setRespondingQuery(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Farmer Query Context */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900">{respondingQuery.farmerName}</span>
                <span className="text-slate-500 font-semibold">{respondingQuery.location}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-950 bg-white p-3 rounded-xl border border-slate-200">
                "{respondingQuery.query}"
              </p>
            </div>

            {/* Quick response templates */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Recommendation Templates:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setReplyInput('Apply 1% Bordeaux mixture before monsoon onset and apply 1kg Dolomite lime per palm for root strength.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-[11px] font-semibold text-slate-700 hover:text-emerald-900 transition cursor-pointer"
                >
                  🍃 Bordeaux Spray
                </button>
                <button
                  type="button"
                  onClick={() => setReplyInput('Apply 250kg Urea in 3 split doses (basal, 30 days, 60 days) with 100kg DAP during earthing up.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-[11px] font-semibold text-slate-700 hover:text-emerald-900 transition cursor-pointer"
                >
                  🧪 Urea Split Dose
                </button>
                <button
                  type="button"
                  onClick={() => setReplyInput('Groundnut (TMV-2 variety) or Sunflower with gypsum application at 200kg/acre gives top yield.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-[11px] font-semibold text-slate-700 hover:text-emerald-900 transition cursor-pointer"
                >
                  🌾 Gypsum Application
                </button>
              </div>
            </div>

            {/* Response Form */}
            <form onSubmit={handleSendReply} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Official Agronomic Advice:
                </label>
                <textarea
                  rows={4}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Enter specific advice, fertilizer dosage, or pest management advice..."
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {replySuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Recommendation transmitted to {respondingQuery.farmerName}'s dashboard!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setRespondingQuery(null)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Advice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Profile Modal */}
      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdateProfile={(updated) => {
          if (onUpdateUser) onUpdateUser(updated);
        }}
        onLogout={onLogout}
      />

      {/* 7. Notifications Modal */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        }}
      />
    </div>
  );
};
