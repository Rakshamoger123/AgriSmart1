import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  X, 
  Save, 
  CheckCircle2, 
  Sprout, 
  Briefcase, 
  Award, 
  Languages, 
  FileText, 
  Droplets,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, UserRole } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateProfile,
  onLogout
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName || '');
  const [mobile, setMobile] = useState(user.mobile || '');
  const [email, setEmail] = useState(user.email || '');
  const [district, setDistrict] = useState(user.district || 'Belagavi');
  const [landSize, setLandSize] = useState(user.landSize || '4.5 Acres');
  const [soilCardNo, setSoilCardNo] = useState(user.soilCardNo || 'SHC-KA-883920');
  const [irrigationType, setIrrigationType] = useState(user.irrigationType || 'Drip Irrigation & Borewell');
  const [preferredLang, setPreferredLang] = useState<'English' | 'Kannada'>(user.preferredLang || 'English');
  const [officerBadgeNo, setOfficerBadgeNo] = useState(user.officerBadgeNo || 'AGRI-OFF-KA-772');
  const [designation, setDesignation] = useState(user.designation || 'Senior Agricultural Extension Officer');
  const [assignedTaluks, setAssignedTaluks] = useState(user.assignedTaluks || 'Gokak, Kundapura, Sindhanur');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      fullName,
      mobile,
      email,
      district,
      landSize,
      soilCardNo,
      irrigationType,
      preferredLang,
      officerBadgeNo,
      designation,
      assignedTaluks
    };
    onUpdateProfile(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.5 }
    });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const isFarmer = user.role === 'farmer';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with vibrant Android Banner */}
        <div className={`p-6 relative text-white ${
          isFarmer 
            ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600' 
            : 'bg-gradient-to-r from-emerald-800 via-slate-800 to-teal-800'
        }`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* User Avatar + Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 backdrop-blur-md flex items-center justify-center text-2xl font-black shadow-inner">
                {fullName.charAt(0) || (isFarmer ? 'F' : 'O')}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[10px] text-slate-900 font-bold shadow-xs">
                ✓
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg sm:text-xl truncate text-white">
                  {fullName || (isFarmer ? 'Farmer Profile' : 'Officer Profile')}
                </h3>
              </div>
              <p className="text-xs font-semibold text-emerald-100 flex items-center gap-1.5 mt-0.5">
                {isFarmer ? (
                  <>
                    <Sprout className="w-3.5 h-3.5 text-amber-300" />
                    <span>Registered Progressive Farmer</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>Department of Agriculture, Karnataka</span>
                  </>
                )}
              </p>
              <p className="text-[11px] text-white/80 font-medium mt-0.5">
                📍 {district}, Karnataka
              </p>
            </div>
          </div>

          {/* Quick Role & Language Tag */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
            <span className="px-3 py-1 rounded-full bg-white/20 font-bold text-white tracking-wide uppercase text-[10px]">
              {isFarmer ? '🌾 Farmer Account' : '🏛️ Agri Extension Officer'}
            </span>

            <button
              type="button"
              onClick={() => {
                const nextLang = preferredLang === 'English' ? 'Kannada' : 'English';
                setPreferredLang(nextLang);
                onUpdateProfile({ ...user, preferredLang: nextLang });
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Language: {preferredLang === 'Kannada' ? 'ಕನ್ನಡ (KN)' : 'English (EN)'}</span>
            </button>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile details successfully updated and saved!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Personal Information
              </h4>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Details'}
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    disabled={!isEditing}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 disabled:opacity-80 outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={mobile}
                    disabled={!isEditing}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 disabled:opacity-80 outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    disabled={!isEditing}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@email.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 disabled:opacity-80 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  District (5 Locations)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <select
                    value={district}
                    disabled={!isEditing}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 disabled:opacity-80 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Belagavi">Belagavi(North)</option>
                    <option value="Raichur">Raichur</option>
                    <option value="Dakshina Kannada">Dakshina Kannada</option>
                    <option value="Udupi">Udupi</option>
                    <option value="Shivamogga">Shivamogga</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Role Specific Section */}
            {isFarmer ? (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Farm & Soil Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold text-[10px] block uppercase">Land Size / Holding</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={landSize}
                        onChange={(e) => setLandSize(e.target.value)}
                        className="mt-1 w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold"
                      />
                    ) : (
                      <p className="font-extrabold text-slate-900 mt-0.5">{landSize}</p>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 font-bold text-[10px] block uppercase">Soil Health Card ID</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={soilCardNo}
                        onChange={(e) => setSoilCardNo(e.target.value)}
                        className="mt-1 w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold"
                      />
                    ) : (
                      <p className="font-extrabold text-emerald-800 mt-0.5">{soilCardNo}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-bold text-[10px] block uppercase">Irrigation Source</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={irrigationType}
                        onChange={(e) => setIrrigationType(e.target.value)}
                        className="mt-1 w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold"
                      />
                    ) : (
                      <p className="font-bold text-slate-800 mt-0.5">{irrigationType}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Official Officer Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold text-[10px] block uppercase">Officer Badge ID</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">{officerBadgeNo}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold text-[10px] block uppercase">Designation</span>
                    <p className="font-extrabold text-emerald-800 mt-0.5">{designation}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-bold text-[10px] block uppercase">Assigned Agro-Met Taluks</span>
                    <p className="font-bold text-slate-700 mt-0.5">{assignedTaluks}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            {isEditing && (
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
          >
            Sign Out
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
