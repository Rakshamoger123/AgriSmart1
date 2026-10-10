import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, Sprout, ArrowRight, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigateRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateRegister,
}) => {
  const [mobile, setMobile] = useState('9845123456');
  const [password, setPassword] = useState('agri2026');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('farmer');
  const [district, setDistrict] = useState('Belagavi');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    const user: UserProfile = {
      fullName: role === 'farmer' ? 'Basavaraj Patil' : 'Dr. Suresh Gowda (Agri Officer)',
      mobile,
      role,
      state: 'Karnataka',
      district: district || 'Belagavi',
      email: role === 'officer' ? 'suresh.gowda@agri.kar.gov.in' : 'patil.farmer@gmail.com',
    };

    onLoginSuccess(user);
  };

  const setDemoAccount = (demoRole: UserRole) => {
    setRole(demoRole);
    if (demoRole === 'farmer') {
      setMobile('9845123456');
      setPassword('agri2026');
      setDistrict('Belagavi');
    } else {
      setMobile('9880198765');
      setPassword('officer2026');
      setDistrict('Dakshina Kannada');
    }
    setError('');
  };

  return (
    <div
      id="screen-login"
      className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 via-white to-slate-100 p-4 sm:p-6 select-none"
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-300">
        {/* App Logo Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 flex items-center justify-center mb-3 shadow-md shadow-emerald-200 text-white">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Agri<span className="text-emerald-700">Smart</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            SMART FARMING FUTURE
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex mb-5 border border-slate-200">
          <button
            type="button"
            id="login-role-farmer"
            onClick={() => setDemoAccount('farmer')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'farmer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Farmer Login</span>
          </button>
          <button
            type="button"
            id="login-role-officer"
            onClick={() => setDemoAccount('officer')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'officer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Agricultural Officer</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Mobile Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="login-input-mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-xs font-medium"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-input-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-xs font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* District Selector (Only 5 locations!) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Location (5 Karnataka Districts)
            </label>
            <select
              id="login-select-district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none shadow-xs cursor-pointer"
            >
              <option value="Belagavi">Belagavi(North)</option>
              <option value="Raichur">Raichur</option>
              <option value="Dakshina Kannada">Dakshina Kannada</option>
              <option value="Udupi">Udupi</option>
              <option value="Shivamogga">Shivamogga</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            id="btn-submit-login"
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <span>{role === 'farmer' ? 'Enter Farmer Dashboard' : 'Enter Officer Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Register Navigation */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-600">
            Don't have an account?{' '}
            <button
              id="btn-goto-register"
              onClick={onNavigateRegister}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Research info */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
          Srinivas Institute of Technology • CSE Department Research Project
        </div>
      </div>
    </div>
  );
};
