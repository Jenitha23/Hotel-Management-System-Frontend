import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfilePage from './components/ProfilePage';
import ForgotPasswordPage from './components/ForgotPasswordPage';

interface User {
  email: string;
  name: string;
  phone: string;
  address: string;
  memberSince: string;
}

export type AuthView = 'login' | 'signup' | 'profile' | 'forgot-password';

function App() {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Simulate login - in real app, this would call your API
    setUser({
      email,
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, State 12345',
      memberSince: 'January 2023'
    });
    setIsAuthenticated(true);
    setCurrentView('profile');
  };

  const handleSignup = (userData: any) => {
    // Simulate signup - in real app, this would call your API
    setUser({
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      address: userData.address || 'Not provided',
      memberSince: 'Just joined'
    });
    setIsAuthenticated(true);
    setCurrentView('profile');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    if (isAuthenticated && currentView === 'profile') {
      return (
        <ProfilePage
          user={user!}
          onLogout={handleLogout}
          onUpdateProfile={(updatedUser) => setUser(updatedUser)}
        />
      );
    }

    switch (currentView) {
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToSignup={() => setCurrentView('signup')}
            onNavigateToForgotPassword={() => setCurrentView('forgot-password')}
          />
        );
      case 'signup':
        return (
          <SignupPage
            onSignup={handleSignup}
            onNavigateToLogin={() => setCurrentView('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordPage
            onNavigateToLogin={() => setCurrentView('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderCurrentView()}
    </div>
  );
}

export default App;