import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { OfficerDashboard } from './components/OfficerDashboard';
import { AndroidFrame } from './components/AndroidFrame';
import { UserProfile, FarmerQuery } from './types';
import { INITIAL_FARMER_QUERIES } from './data/agriData';

type ScreenState = 'splash' | 'login' | 'register' | 'farmer' | 'officer';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('splash');
  const [queries, setQueries] = useState<FarmerQuery[]>(INITIAL_FARMER_QUERIES);

  const [user, setUser] = useState<UserProfile>({
    fullName: 'Basavaraj Patil',
    mobile: '9845123456',
    email: 'patil.farmer@gmail.com',
    role: 'farmer',
    state: 'Karnataka',
    district: 'Belagavi',
    landSize: '4.5 Acres',
    soilCardNo: 'SHC-KA-883920',
    irrigationType: 'Drip Irrigation & Borewell',
    preferredLang: 'English',
    officerBadgeNo: 'AGRI-OFF-KA-772',
    designation: 'Senior Agricultural Extension Officer',
    assignedTaluks: 'Gokak, Kundapura, Sindhanur'
  });

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser((prev) => ({
      ...prev,
      ...loggedInUser,
      landSize: prev.landSize || '4.5 Acres',
      soilCardNo: prev.soilCardNo || 'SHC-KA-883920',
      irrigationType: prev.irrigationType || 'Drip Irrigation & Borewell',
      officerBadgeNo: prev.officerBadgeNo || 'AGRI-OFF-KA-772',
      designation: prev.designation || 'Senior Agricultural Extension Officer',
      assignedTaluks: prev.assignedTaluks || 'Gokak, Kundapura, Sindhanur'
    }));
    setScreen(loggedInUser.role === 'officer' ? 'officer' : 'farmer');
  };

  const handleRegisterSuccess = (newUser: UserProfile) => {
    setUser((prev) => ({
      ...prev,
      ...newUser,
      landSize: '5.0 Acres',
      soilCardNo: 'SHC-KA-991204',
      irrigationType: 'Borewell & Sprinklers',
      officerBadgeNo: 'AGRI-OFF-KA-772',
      designation: 'Senior Agricultural Extension Officer',
      assignedTaluks: 'Gokak, Kundapura, Sindhanur'
    }));
    setScreen(newUser.role === 'officer' ? 'officer' : 'farmer');
  };

  const handleLogout = () => {
    setScreen('login');
  };

  const handleAddQuery = (newQuery: FarmerQuery) => {
    setQueries((prev) => [newQuery, ...prev]);
  };

  const handleReplyQuery = (queryId: string, replyText: string) => {
    setQueries((prev) =>
      prev.map((q) =>
        q.id === queryId
          ? {
              ...q,
              status: 'Replied',
              officerReply: replyText,
              repliedAt: 'Just now by Dr. Suresh Gowda',
            }
          : q
      )
    );
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased">
      {/* Screen 1: Splash Screen */}
      {screen === 'splash' && (
        <SplashScreen onGetStarted={() => setScreen('login')} />
      )}

      {/* Screen 2: Login Screen */}
      {screen === 'login' && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onNavigateRegister={() => setScreen('register')}
        />
      )}

      {/* Screen 3: Register Screen */}
      {screen === 'register' && (
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateLogin={() => setScreen('login')}
        />
      )}

      {/* Screen 4: Farmer Dashboard wrapped in Android App Shell */}
      {screen === 'farmer' && (
        <AndroidFrame
          activeRole="farmer"
          onSwitchRole={() => setScreen('officer')}
        >
          <DashboardScreen
            user={user}
            queries={queries}
            onAddQuery={handleAddQuery}
            onLogout={handleLogout}
            onSwitchToOfficer={() => setScreen('officer')}
            onUpdateUser={handleUpdateUser}
          />
        </AndroidFrame>
      )}

      {/* Screen 5: Agricultural Officer Dashboard wrapped in Android App Shell */}
      {screen === 'officer' && (
        <AndroidFrame
          activeRole="officer"
          onSwitchRole={() => setScreen('farmer')}
        >
          <OfficerDashboard
            user={{
              ...user,
              fullName: user.role === 'officer' ? user.fullName : 'Dr. Suresh Gowda',
              role: 'officer',
              state: 'Karnataka',
              district: user.district || 'Dakshina Kannada',
            }}
            queries={queries}
            onReplyQuery={handleReplyQuery}
            onLogout={handleLogout}
            onSwitchToFarmer={() => setScreen('farmer')}
            onUpdateUser={handleUpdateUser}
          />
        </AndroidFrame>
      )}
    </div>
  );
};

export default App;
