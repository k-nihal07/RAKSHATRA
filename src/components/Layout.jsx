import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShieldAlert, Map, User, Navigation, MessageSquare, Clock } from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('traveler');
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setRole(user.role);
    }
  }, []);

  // Do not show bottom navigation or SOS on Splash, Login, or SOS pages themselves
  const hideNavPaths = ['/', '/login', '/sos'];
  const showNav = !hideNavPaths.includes(location.pathname);

  // Define tabs based on role
  const travelerTabs = [
    { icon: <Home />, label: "Home", path: "/traveler" },
    { icon: <Navigation />, label: "Plan", path: "/planner" },
    { icon: <Map />, label: "Explore", path: "/explore" },
    { icon: <User />, label: "Profile", path: "/profile" }
  ];

  const providerTabs = [
    { icon: <Home />, label: "Dashboard", path: "/provider" },
    { icon: <MessageSquare />, label: "Feedbacks", path: "/feedbacks" },
    { icon: <Clock />, label: "History", path: "/history" },
    { icon: <User />, label: "Profile", path: "/provider-profile" }
  ];

  const activeTabs = role === 'provider' ? providerTabs : travelerTabs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--color-background)' }}>
        {children}
      </div>
      
      {showNav && (
        <button 
          onClick={() => navigate('/sos')}
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '30px',
            backgroundColor: 'var(--color-danger)',
            color: 'white',
            border: 'none',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            cursor: 'pointer'
          }}
        >
          <ShieldAlert size={32} />
        </button>
      )}

      {showNav && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 0 calc(12px + env(safe-area-inset-bottom))',
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          zIndex: 40,
        }}>
          {activeTabs.map((tab, idx) => (
             <NavItem key={idx} icon={tab.icon} label={tab.label} path={tab.path} />
          ))}
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path || location.pathname.startsWith(path);

  return (
    <div 
      className="flex-col items-center gap-2" 
      style={{
        cursor: 'pointer',
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)'
      }} 
      onClick={() => navigate(path)}
    >
      {React.cloneElement(icon, { size: 24, color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' })}
      <span className="text-xs" style={{
        fontWeight: isActive ? 600 : 400
      }}>{label}</span>
    </div>
  );
};

export default Layout;
