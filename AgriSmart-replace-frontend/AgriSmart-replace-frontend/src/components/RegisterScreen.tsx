import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Eye, EyeOff, MapPin, ArrowLeft, ArrowRight, Sprout, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, UserRole } from '../types';

interface RegisterScreenProps {
  onRegisterSuccess: (user: UserProfile) => void;
  onNavigateLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [state] = useState('Karnataka');
  const [district, setDistrict] = useState('Belagavi');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!mobile || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#059669', '#34d399', '#f59e0b'],
    });

    const newUser: UserProfile = {
      fullName,
      mobile,
      email: email || undefined,
      role,
      state,
      district,
    };

    setTimeout(() => {
      onRegisterSuccess(newUser);
    }, 400);
  };

  return (
    <div
      id="screen-register"
      className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 via-white to-slate-100 p-4 sm:p-6 select-none"
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-300">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            id="btn-register-back"
            onClick={onNavigateLogin}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-sm">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>AgriSmart Registration</span>
          </div>
          <div className="w-9"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="register-input-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Mobile & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="register-input-mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10 digits"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="register-input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition ${
                  role === 'farmer'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={role === 'farmer'}
                  onChange={() => setRole('farmer')}
                  className="hidden"
                />
                <span>Farmer</span>
                {role === 'farmer' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition ${
                  role === 'officer'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="officer"
                  checked={role === 'officer'}
                  onChange={() => setRole('officer')}
                  className="hidden"
                />
                <span>Agri Officer</span>
                {role === 'officer' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
              </label>
            </div>
          </div>

          {/* Location Details (5 Districts only) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={state}
                  disabled
                  className="w-full pl-8 pr-2 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                District *
              </label>
              <select
                id="register-select-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
              >
                <option value="Belagavi">Belagavi(North)</option>
                <option value="Raichur">Raichur</option>
                <option value="Dakshina Kannada">Dakshina Kannada</option>
                <option value="Udupi">Udupi</option>
                <option value="Shivamogga">Shivamogga</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Create Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="register-input-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="register-input-confirmpassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            id="btn-submit-register"
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2 mt-3 cursor-pointer"
          >
            <span>Create Account & Start</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button
              id="btn-goto-login-from-reg"
              onClick={onNavigateLogin}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
