import React, { useState } from 'react';

import {

  Sprout,

  MapPin,

  CloudSun,

  Droplets,

  Thermometer,

  Wind,

  Award,

  CheckCircle2,

  RefreshCw,

  ArrowLeftRight,

  ShieldCheck,

  Send,

  MessageSquare,

  LayoutDashboard,

  FlaskConical,

  History,

  Info,

  LogOut,

  User,

  Check,

  Clock,

  ChevronDown,

  Sparkles,

  HelpCircle,

  FileEdit,

  ArrowRight,

  Bell,

  Languages,

  Layers,

  FileText,

  TrendingUp,

  AlertTriangle,

  Compass

} from 'lucide-react';

import confetti from 'canvas-confetti';

import { UserProfile, DistrictAgriData, FarmerQuery, AdvisoryPost, NotificationItem } from '../types';

import { FIVE_KARNATAKA_DISTRICTS, INITIAL_ADVISORIES, INITIAL_NOTIFICATIONS } from '../data/agriData';

import { AndroidStatusBar } from './AndroidStatusBar';

import { AndroidNavBar } from './AndroidNavBar';

import { ProfileModal } from './ProfileModal';

import { NotificationsModal } from './NotificationsModal';

import { AdvisoriesView } from './AdvisoriesView';

import { PredictSimulator } from './PredictSimulator';

import { PredictionHistory } from './PredictionHistory';



interface DashboardScreenProps {

  user: UserProfile;

  queries: FarmerQuery[];

  onAddQuery: (newQuery: FarmerQuery) => void;

  onLogout: () => void;

  onSwitchToOfficer?: () => void;

  onUpdateUser?: (updated: UserProfile) => void;

}



export const DashboardScreen: React.FC<DashboardScreenProps> = ({

  user,

  queries,

  onAddQuery,

  onLogout,

  onSwitchToOfficer,

  onUpdateUser

}) => {

  const [selectedDistrict, setSelectedDistrict] = useState<string>(user.district || 'Belagavi');



  const [selectedSeason, setSelectedSeason] = useState('Monsoon');

  const [dashboardRecommendation, setDashboardRecommendation] = useState<any>(null);

  const [recommendationError, setRecommendationError] = useState('');



  const [isGenerated, setIsGenerated] = useState<boolean>(true);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'predict' | 'history' | 'queries' | 'advisories' | 'about'>('dashboard');

  // Modals state

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [advisories, setAdvisories] = useState<AdvisoryPost[]>(INITIAL_ADVISORIES);

  const [kannadaMode, setKannadaMode] = useState<boolean>(user.preferredLang === 'Kannada');



  // Query form state

  const [farmerQueryText, setFarmerQueryText] = useState('');

  const [querySuccessMsg, setQuerySuccessMsg] = useState(false);



  const districtData: DistrictAgriData =

    FIVE_KARNATAKA_DISTRICTS[selectedDistrict] || FIVE_KARNATAKA_DISTRICTS['Belagavi'];





  const handleGetRecommendation = async () => {

    setIsAnalyzing(true);

    setRecommendationError('');



    try {

      const response = await fetch('http\://127.0.0.1:5000/predict', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          district: selectedDistrict,

          season: selectedSeason,

        }),

      });



      const data = await response.json();

      console.log("Recommendation response:", data);



      if (!response.ok) {

        throw new Error(

          data.error || data.message || 'Failed to get crop recommendation.'

        );

      }



      setDashboardRecommendation(data);

      setIsGenerated(true);



      confetti({

        particleCount: 60,

        spread: 65,

        origin: { y: 0.6 },

        colors: ['#10b981', '#059669', '#34d399', '#f59e0b', '#38bdf8'],

      });

    } catch (error) {

      setRecommendationError(

        error instanceof Error

          ? error.message

          : 'Unable to connect to the backend.'

      );

    } finally {

      setIsAnalyzing(false);

    }

  };





  const handleSendQueryToOfficer = (e: React.FormEvent) => {

    e.preventDefault();

    if (!farmerQueryText.trim()) return;



    const newQ: FarmerQuery = {

      id: `QRY-${String(queries.length + 1).padStart(3, '0')}`,

      farmerName: user.fullName || 'Basavaraj Patil',

      location: `${districtData.displayName}, Karnataka`,

      district: selectedDistrict,

      query: farmerQueryText.trim(),

      time: 'Just now',

      status: 'Pending',

      recommendedCrop: districtData.recommendedCrop,

    };



    onAddQuery(newQ);

    setFarmerQueryText('');

    setQuerySuccessMsg(true);

    setTimeout(() => setQuerySuccessMsg(false), 4000);

  };



  const farmerSpecificQueries = queries.filter(

    (q) => q.farmerName === user.fullName || q.district === selectedDistrict

  );



  const unreadNotifs = notifications.filter((n) => !n.isRead).length;



  return (

    <div className="flex flex-col min-h-screen bg-[#f4f7f5] text-slate-800 font-sans relative">

      {/* 1. Android Status Bar */}

      <AndroidStatusBar theme="emerald" />



      {/* 2. Top Android App Bar */}

      <header className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-700 text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">

        <div className="flex items-center gap-2.5">

          <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner border border-white/20">

            <Sprout className="w-5 h-5 text-amber-300" />

          </div>

          <div>

            <div className="flex items-center gap-1.5">

              <h1 className="font-extrabold text-base tracking-tight leading-none text-white">

                Agri<span className="text-amber-300">Smart</span>

              </h1>

              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950">

                FARMER

              </span>

            </div>

            <p className="text-[10px] text-emerald-200 font-medium">

              {districtData.displayName}, Karnataka

            </p>

          </div>

        </div>



        {/* Action icons */}

        <div className="flex items-center gap-2">

          {/* Language Toggle */}

          <button

            onClick={() => setKannadaMode(!kannadaMode)}

            className="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer border border-white/20"

            title="Toggle Kannada / English"

          >

            <Languages className="w-3.5 h-3.5 text-amber-300" />

            <span>{kannadaMode ? 'ಕನ್ನಡ' : 'ENG'}</span>

          </button>



          {/* Notifications Button */}

          <button

            onClick={() => setIsNotifOpen(true)}

            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white relative transition cursor-pointer border border-white/20"

            title="Notifications"

          >

            <Bell className="w-4 h-4" />

            {unreadNotifs > 0 && (

              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-900 font-black text-[9px] flex items-center justify-center ring-2 ring-emerald-800">

                {unreadNotifs}

              </span>

            )}

          </button>



          {/* Profile Avatar Button -> Leads directly to Profile Section! */}

          <button

            onClick={() => setIsProfileOpen(true)}

            className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition cursor-pointer border border-white/30 shadow-xs"

            title="Open Profile Section"

          >

            <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[11px]">

              {user.fullName.charAt(0) || 'F'}

            </div>

            <span className="hidden sm:inline text-xs font-semibold truncate max-w-[90px]">

              {user.fullName.split(' ')[0]}

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

            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'dashboard'

              ? 'bg-emerald-600 text-white shadow-sm'

              : 'text-slate-600 hover:bg-slate-100'

              }`}

          >

            <LayoutDashboard className="w-3.5 h-3.5" />

            <span>Dashboard</span>

          </button>



          <button

            onClick={() => setActiveTab('predict')}

            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'predict'

              ? 'bg-emerald-600 text-white shadow-sm'

              : 'text-slate-600 hover:bg-slate-100'

              }`}





        
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Crop Prediction</span>
          </button>
        </div>

        {/* TAB 1: Soil Simulator */}

        {

          activeTab === 'predict' && (

          <PredictSimulator

            initialDistrict={selectedDistrict}

            onApplyRecommendation={(d) => {

              setSelectedDistrict(d);

              setActiveTab('dashboard');

              setIsGenerated(true);

            }}

          />

        )}

        {/* TAB: Prediction History */}

{activeTab === 'history' && (

  <PredictionHistory />

)}



        {/* TAB 2: Advisories */}

        {activeTab === 'advisories' && (

          <AdvisoriesView

            advisories={advisories}

            userRole="farmer"

            onBackToDashboard={() => setActiveTab('dashboard')}

          />

        )}



        {/* TAB 3: Queries & Inquiries */}

        {activeTab === 'queries' && (

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">

              <div>

                <h3 className="text-base font-extrabold text-slate-900">

                  Officer Inquiries & Expert Responses

                </h3>

                <p className="text-xs text-slate-500 font-medium">

                  Direct communication record with your regional Agricultural Officer

                </p>

              </div>



              <button

                onClick={() => setActiveTab('dashboard')}

                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100"

              >

                Back to Dashboard

              </button>

            </div>



            {farmerSpecificQueries.length === 0 ? (

              <div className="py-10 text-center text-slate-400 text-xs">

                No queries submitted yet. Ask your Agricultural Officer from the main dashboard!

              </div>

            ) : (

              <div className="space-y-3">

                {farmerSpecificQueries.map((q) => (

                  <div

                    key={q.id}

                    className="p-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/30 space-y-2"

                  >

                    <div className="flex justify-between items-center text-xs">

                      <span className="font-extrabold text-slate-900">

                        📍 {q.location} • {q.time}

                      </span>

                      <span

                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${q.status === 'Replied'

                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'

                          : 'bg-amber-100 text-amber-900 border border-amber-300'

                          }`}

                      >

                        {q.status === 'Replied' ? '✓ Officer Guidance Received' : '⏳ Pending Review'}

                      </span>

                    </div>



                    <p className="text-xs font-semibold text-slate-800 bg-white p-3 rounded-xl border border-slate-200">

                      "{q.query}"

                    </p>



                    {q.officerReply && (

                      <div className="p-3.5 bg-emerald-100/70 rounded-xl border border-emerald-300 text-xs text-emerald-950 space-y-1">

                        <p className="font-extrabold text-emerald-900 flex items-center gap-1.5">

                          <ShieldCheck className="w-4 h-4 text-emerald-700" />

                          <span>Dr. Suresh Gowda (Agricultural Officer):</span>

                        </p>

                        <p className="leading-relaxed font-medium">{q.officerReply}</p>

                        {q.repliedAt && (

                          <span className="text-[10px] text-emerald-700 font-bold block pt-1">

                            🕒 {q.repliedAt}

                          </span>

                        )}

                      </div>

                    )}

                  </div>

                ))}

              </div>

            )}

          </div>

        )}



        {/* TAB 4: About Us */}

        {activeTab === 'about' && (

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-2xl mx-auto animate-in fade-in">

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">

              <Sprout className="w-6 h-6" />

            </div>

            <h3 className="text-lg font-black text-slate-900">

              About AgriSmart Crop Recommendation Intelligence

            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">

              AgriSmart is an automated agro-climatic intelligence platform engineered by the Department of Computer Science & Engineering at <strong>Srinivas Institute of Technology</strong>.

            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">

              By mapping soil N-P-K profiles and precipitation variables across 5 distinct Karnataka agro-climatic zones (Belagavi, Raichur, Dakshina Kannada, Udupi, Shivamogga), AgriSmart delivers high-precision crop recommendations and connects farmers directly to their local Agricultural Extension Officers.

            </p>

            <button

              onClick={() => setActiveTab('dashboard')}

              className="py-2.5 px-5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"

            >

              Return to Dashboard

            </button>

          </div>

        )}



        {/* TAB 5: Main Dashboard View */}

        {activeTab === 'dashboard' && (

          <>

            {/* Section 1: Location & Recommendation Trigger Card */}

            <section className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">

              <div className="flex items-center justify-between">

                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">

                  <MapPin className="w-4 h-4 text-emerald-600" />

                  <span>{kannadaMode ? 'ಸ್ಥಳ ಆಯ್ಕೆ ಮತ್ತು ಶಿಫಾರಸು' : 'Select Karnataka District'}</span>

                </h3>



                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">

                  5 Agro Zones

                </span>

              </div>



              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">

                {/* State selector */}

                <div className="sm:col-span-4">

                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">

                    State

                  </label>

                  <div className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">

                    Karnataka (ಭಾರತ)

                  </div>

                </div>



                {/* District selector (5 locations) */}



                <div className="sm:col-span-5">

                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">

                    District

                  </label>

                  <select

                    id="districtSelect"

                    value={selectedDistrict}

                    onChange={(e) => {

                      setSelectedDistrict(e.target.value);

                      setIsGenerated(true);

                    }}

                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/40 text-base font-extrabold text-emerald-950 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"

                  >

                    <option value="Belagavi">Belagavi - ಬೆಳಗಾವಿ</option>

                    <option value="Dakshina Kannada">Dakshina Kannada - ದಕ್ಷಿಣ ಕನ್ನಡ</option>

                    <option value="Kalaburagi">Kalaburagi - ಕಲಬುರಗಿ</option>

                    <option value="Kodagu">Kodagu - ಕೊಡಗು</option>

                    <option value="Mysuru">Mysuru - ಮೈಸೂರು</option>

                  </select>

                </div>



                <div className="sm:col-span-5">

                  <label

                    htmlFor="seasonSelect"

                    className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1"

                  >

                    Season

                  </label>

                  <select

                    id="seasonSelect"

                    value={selectedSeason}

                    onChange={(e) => {

                      setSelectedSeason(e.target.value);

                      setIsGenerated(false);

                    }}

                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-semibold text-slate-800"

                  >

                    <option value="Monsoon">Monsoon</option>

                    <option value="Post-monsoon">Post-monsoon</option>

                    <option value="Summer">Summer</option>

                    <option value="Winter">Winter</option>

                  </select>

                </div>



                {/* Trigger Button */}

                <div className="sm:col-span-3">

                  <button

                    id="btn-get-recommendation"

                    onClick={handleGetRecommendation}

                    disabled={isAnalyzing}

                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-200 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"

                  >

                    {isAnalyzing ? (

                      <>

                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />

                        <span>Predicting...</span>

                      </>

                    ) : (

                      <>

                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />

                        <span>Get Recommendation</span>

                      </>

                    )}

                  </button>

                </div>

              </div>

            </section>



            {/* Section 2: Three Main Indicator Cards */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">

              {/* Card 1: Current Weather with vibrant gradient */}

              <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50/60 rounded-3xl p-4 sm:p-5 border border-sky-200/80 shadow-xs flex flex-col justify-between space-y-3">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">

                      <CloudSun className="w-4 h-4" />

                    </div>

                    <div>

                      <h4 className="font-black text-xs sm:text-sm text-slate-900">

                        {kannadaMode ? 'ಹವಾಮಾನ ಸ್ಥಿತಿ' : 'Current Weather'}

                      </h4>

                      <p className="text-[10px] text-slate-500 font-semibold">{districtData.region}</p>

                    </div>

                  </div>

                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>

                </div>



                <div className="space-y-2 text-xs">

                  <div className="flex justify-between items-center p-2 rounded-xl bg-white/80 border border-sky-100">

                    <span className="text-slate-600 font-medium flex items-center gap-1">

                      <Thermometer className="w-3.5 h-3.5 text-amber-500" />

                      <span>Temperature</span>

                    </span>

                    <span className="font-extrabold text-slate-900">{districtData.temp} °C</span>

                  </div>



                  <div className="flex justify-between items-center p-2 rounded-xl bg-white/80 border border-sky-100">

                    <span className="text-slate-600 font-medium flex items-center gap-1">

                      <Droplets className="w-3.5 h-3.5 text-blue-500" />

                      <span>Humidity</span>

                    </span>

                    <span className="font-extrabold text-slate-900">{districtData.humidity} %</span>

                  </div>



                  <div className="flex justify-between items-center p-2 rounded-xl bg-white/80 border border-sky-100">

                    <span className="text-slate-600 font-medium flex items-center gap-1">

                      <Wind className="w-3.5 h-3.5 text-teal-500" />

                      <span>Rainfall</span>

                    </span>

                    <span className="font-extrabold text-slate-900">{districtData.rainfall} mm</span>

                  </div>

                </div>



                <p className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-sky-100">

                  Agro-Met Automated Feed

                </p>

              </div>



              {/* Card 2: Soil Information with colorful NPK gauges */}

              <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 rounded-3xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs flex flex-col justify-between space-y-3">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">

                      <Sprout className="w-4 h-4" />

                    </div>

                    <div>

                      <h4 className="font-black text-xs sm:text-sm text-slate-900">

                        {kannadaMode ? 'ಮಣ್ಣಿನ ಮಾಹಿತಿ' : 'Soil Information'}

                      </h4>

                      <p className="text-[10px] text-slate-500 font-semibold truncate max-w-[120px]">{districtData.soilType}</p>

                    </div>

                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">

                    pH {districtData.ph}

                  </span>

                </div>



                <div className="grid grid-cols-2 gap-2 text-xs">

                  <div className="p-2 rounded-xl bg-white/80 border border-emerald-100">

                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">Nitrogen (N)</span>

                    <span className="font-extrabold text-slate-900 text-sm">{districtData.nitrogen} <span className="text-[10px] font-normal text-slate-400">kg/ha</span></span>

                  </div>



                  <div className="p-2 rounded-xl bg-white/80 border border-amber-100">

                    <span className="text-[10px] text-amber-700 font-bold block uppercase">Phosphorus (P)</span>

                    <span className="font-extrabold text-slate-900 text-sm">{districtData.phosphorus} <span className="text-[10px] font-normal text-slate-400">kg/ha</span></span>

                  </div>



                  <div className="p-2 rounded-xl bg-white/80 border border-purple-100">

                    <span className="text-[10px] text-purple-700 font-bold block uppercase">Potassium (K)</span>

                    <span className="font-extrabold text-slate-900 text-sm">{districtData.potassium} <span className="text-[10px] font-normal text-slate-400">kg/ha</span></span>

                  </div>



                  <div className="p-2 rounded-xl bg-white/80 border border-sky-100">

                    <span className="text-[10px] text-sky-700 font-bold block uppercase">Soil Acidity</span>

                    <span className="font-extrabold text-slate-900 text-sm">{districtData.ph < 6.5 ? 'Acidic' : districtData.ph > 7.5 ? 'Alkaline' : 'Neutral'}</span>

                  </div>

                </div>



                <p className="text-[10px] text-emerald-700 font-bold pt-1 border-t border-emerald-100 truncate">

                  {districtData.npkRecommendation}

                </p>

              </div>



              {/* Card 3: Recommended Crop Hero Banner with Image & Kannada translation */}

              <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col justify-between space-y-3 relative overflow-hidden">

                <div className="relative z-10">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-xs">

                      <Award className="w-4 h-4 text-amber-400" />

                      <span>{kannadaMode ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆ' : 'Recommended Crop'}</span>

                    </div>



                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-xs">

                      {dashboardRecommendation?.recommended_score != null

                        ? `${Number(dashboardRecommendation.recommended_score).toFixed(1)}%`

                        : `${districtData.confidenceScore}%`} Match

                    </span>

                  </div>



                  <h3 id="cropName" className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">

                    {dashboardRecommendation?.recommended_crop ||

                      districtData.recommendedCrop}

                  </h3>

                  <p className="text-xs text-amber-200 font-bold mt-0.5">

                    {dashboardRecommendation?.recommended_crop

                      ? dashboardRecommendation.recommended_crop

                      : districtData.recommendedCropKannada}

                  </p>



                  <p className="text-[11px] text-emerald-100 leading-relaxed mt-2 line-clamp-3">

                    {dashboardRecommendation?.recommended_crop

                      ? `Recommended for ${selectedDistrict} during ${selectedSeason}, based on the crop suitability ranking.`

                      : districtData.description}

                  </p>

                </div>





                <div className="relative z-10 pt-2 border-t border-white/20 flex items-center justify-between text-[11px]">

                  {dashboardRecommendation ? (

                    <span className="text-emerald-200">

                      Season: <strong>{selectedSeason}</strong>

                    </span>

                  ) : (

                    <span className="text-emerald-200">

                      Yield: <strong>{districtData.expectedYield}</strong>

                    </span>

                  )}



                  {!dashboardRecommendation && (

                    <span className="text-amber-300 font-bold">

                      {districtData.marketPrice}

                    </span>

                  )}

                </div>



              </div>

            </div>



            {/* Section 3: Bottom Row 3 Indicator Cards */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">

              {/* Card 1: Climate Status */}

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">

                    {kannadaMode ? 'ಹವಾಮಾನ ಸ್ಥಿತಿ' : 'CLIMATE STATUS'}

                  </p>

                  <p className="text-base font-black text-emerald-600 mt-0.5">

                    {districtData.climateStatus}

                  </p>

                  <p className="text-[11px] text-slate-400 font-medium">

                    Favorable for Kharif sowing

                  </p>

                </div>

                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                  <Check className="w-5 h-5" />

                </div>

              </div>



              {/* Card 2: Alternative Crop */}

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">

                    {kannadaMode ? 'ಪರ್ಯಾಯ ಬೆಳೆ' : 'ALTERNATIVE BACKUP CROP'}

                  </p>

                  <p className="text-sm font-black text-slate-900 mt-0.5">

                    {dashboardRecommendation?.rankings?.[1]?.crop ||

                      districtData.alternativeCrop}

                  </p>

                  <p className="text-[11px] text-amber-600 font-semibold truncate max-w-[170px]">

                    {dashboardRecommendation?.rankings?.[1]?.crop

                      ? dashboardRecommendation.rankings[1].crop

                      : districtData.alternativeCropKannada}

                  </p>

                </div>

                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">

                  <ArrowLeftRight className="w-4 h-4" />

                </div>

              </div>



              {/* Card 3: Risk Level */}



              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">

                <div className="min-w-0">

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">

                    {kannadaMode ? 'ಅಪಾಯದ ಮಟ್ಟ' : 'RISK LEVEL'}

                  </p>





                  <p className={`text-base font-black mt-0.5 ${dashboardRecommendation?.risk_level === 'Low'

                    ? 'text-emerald-600'

                    : dashboardRecommendation?.risk_level === 'Medium'

                      ? 'text-amber-600'

                      : dashboardRecommendation?.risk_level === 'High'

                        ? 'text-red-600'

                        : 'text-slate-500'

                    }`}>

                    {dashboardRecommendation?.risk_level ?? 'Not assessed'}

                  </p>







                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">

                    {dashboardRecommendation?.risk_message ??

                      'Generate a recommendation to assess risk.'}

                  </p>



                </div>



                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">

                  <ShieldCheck className="w-5 h-5" />

                </div>

              </div>



            </div>



            {/* Section 4: Connect with Agricultural Officer / Request Advice (Flowchart!) */}

            <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-5 text-white shadow-md space-y-3">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-2.5">

                <div className="flex items-center gap-2.5">

                  <div className="w-9 h-9 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">

                    <MessageSquare className="w-4 h-4" />

                  </div>

                  <div>

                    <h3 className="font-extrabold text-sm sm:text-base leading-tight">

                      Connect with Agricultural Officer • Request Expert Advice

                    </h3>

                    <p className="text-[11px] text-emerald-200 font-medium">

                      Direct advisory channel for {districtData.displayName}

                    </p>

                  </div>

                </div>



                {onSwitchToOfficer && (

                  <button

                    onClick={onSwitchToOfficer}

                    className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-emerald-200 text-xs font-bold flex items-center gap-1 transition self-start sm:self-auto cursor-pointer border border-white/20"

                  >

                    <span>Officer Desk</span>

                    <ArrowRight className="w-3 h-3" />

                  </button>

                )}

              </div>



              {/* Form to submit query */}

              <form onSubmit={handleSendQueryToOfficer} className="space-y-2.5">

                <div className="flex flex-col sm:flex-row gap-2">

                  <input

                    type="text"

                    value={farmerQueryText}

                    onChange={(e) => setFarmerQueryText(e.target.value)}

                    placeholder={`e.g. Best fertilizer dosage for ${districtData.recommendedCrop} in ${districtData.displayName}?`}

                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-400 font-medium"

                    required

                  />

                  <button

                    type="submit"

                    className="py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"

                  >

                    <Send className="w-3.5 h-3.5" />

                    <span>Send Query</span>

                  </button>

                </div>



                {querySuccessMsg && (

                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">

                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />

                    <span>

                      Query transmitted to Agricultural Officer! Check 'My Queries' tab for replies.

                    </span>

                  </div>

                )}

              </form>



              {/* Recent Responses Snippet */}

              {farmerSpecificQueries.length > 0 && (

                <div className="pt-2 space-y-1.5">

                  <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold">

                    <span>Recent Responses from Agricultural Officer:</span>

                    <button

                      onClick={() => setActiveTab('queries')}

                      className="text-amber-300 hover:underline cursor-pointer"

                    >

                      View All ({farmerSpecificQueries.length})

                    </button>

                  </div>



                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                    {farmerSpecificQueries.slice(0, 2).map((q) => (

                      <div key={q.id} className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs space-y-1">

                        <div className="flex justify-between items-center text-[10px] text-emerald-300">

                          <span className="font-semibold truncate max-w-[150px]">"{q.query}"</span>

                          <span className={`px-2 py-0.5 rounded-full font-bold ${q.status === 'Replied' ? 'bg-emerald-400/30 text-emerald-200' : 'bg-amber-400/30 text-amber-200'

                            }`}>

                            {q.status}

                          </span>

                        </div>

                        {q.officerReply ? (

                          <p className="text-white font-medium bg-black/20 p-1.5 rounded-lg text-[11px]">

                            🌾 <strong>Advice:</strong> {q.officerReply}

                          </p>

                        ) : (

                          <p className="text-slate-300 text-[10px] italic">

                            Pending officer review\...

                          </p>

                        )}

                      </div>

                    ))}

                  </div>

                </div>

              )}

            </section>

          </>

        )}

      *</main>*



      {/* 3. Android Material 3 Bottom Navigation Bar */}

      *<nav className="fixed bottom-0 left-0 right-0 max-w-6xl mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around z-20 shadow-lg">

        <button

          onClick={() => setActiveTab('dashboard')}

          className={`flex flex-col items-center py-1 px-3 rounded-xl transition cursor-pointer ${activeTab === 'dashboard'

            ? 'text-emerald-700 font-extrabold'

            : 'text-slate-500 hover:text-slate-900 font-medium'

            }`}

        >

          <div className={`p-1 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-emerald-100' : ''}`}>

            <LayoutDashboard className="w-4 h-4" />

          </div>

          <span className="text-[10px] mt-0.5">Home</span>

        </button>



        <button

          onClick={() => setActiveTab('predict')}

          className={`flex flex-col items-center py-1 px-3 rounded-xl transition cursor-pointer ${activeTab === 'predict'

            ? 'text-emerald-700 font-extrabold'

            : 'text-slate-500 hover:text-slate-900 font-medium'

            }`}

        >

          <div className={`p-1 rounded-xl transition ${activeTab === 'predict' ? 'bg-emerald-100' : ''}`}>

            <FlaskConical className="w-4 h-4" />

          </div>

          <span className="text-[10px] mt-0.5">Simulator</span>

        </button>



        <button

          onClick={() => setActiveTab('queries')}

          className={`flex flex-col items-center py-1 px-3 rounded-xl transition cursor-pointer relative ${activeTab === 'queries'

            ? 'text-emerald-700 font-extrabold'

            : 'text-slate-500 hover:text-slate-900 font-medium'

            }`}

        >

          <div className={`p-1 rounded-xl transition ${activeTab === 'queries' ? 'bg-emerald-100' : ''}`}>

            <History className="w-4 h-4" />

          </div>

          <span className="text-[10px] mt-0.5">Inquiries</span>

        </button>



        <button

          onClick={() => setActiveTab('advisories')}

          className={`flex flex-col items-center py-1 px-3 rounded-xl transition cursor-pointer ${activeTab === 'advisories'

            ? 'text-emerald-700 font-extrabold'

            : 'text-slate-500 hover:text-slate-900 font-medium'

            }`}

        >

          <div className={`p-1 rounded-xl transition ${activeTab === 'advisories' ? 'bg-emerald-100' : ''}`}>

            <FileText className="w-4 h-4" />

          </div>

          <span className="text-[10px] mt-0.5">Advisories</span>

        </button>



        {/* Profile Tab in Bottom Nav */}

        <button

          onClick={() => setIsProfileOpen(true)}

          className="flex flex-col items-center py-1 px-3 rounded-xl text-slate-500 hover:text-emerald-700 transition cursor-pointer font-medium"

        >

          <div className="p-1 rounded-xl">

            <User className="w-4 h-4" />

          </div>

          <span className="text-[10px] mt-0.5">Profile</span>

        </button>

      </nav>



      {/* 4. Android Bottom Gesture Pill Bar */}

      <AndroidNavBar onHome={() => setActiveTab('dashboard')} />



      {/* 5. Profile Modal */}

      <ProfileModal

        user={user}

        isOpen={isProfileOpen}

        onClose={() => setIsProfileOpen(false)}

        onUpdateProfile={(updated) => {

          if (onUpdateUser) onUpdateUser(updated);

          setSelectedDistrict(updated.district);

        }}

        onLogout={onLogout}

      />



      {/* 6. Notifications Modal */}

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
