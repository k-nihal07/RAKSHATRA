import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      width: '100%',
    }}>
      <div style={{
        animation: 'pulse 2s infinite',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <ShieldCheck size={80} strokeWidth={1.5} />
        <h1 style={{ marginTop: '24px', fontSize: '2.5rem', letterSpacing: '2px' }}>RAKSHATRA</h1>
        <p style={{ marginTop: '8px', opacity: 0.9, fontWeight: 500, fontSize: '1.1rem' }}>Smart Travel Safety</p>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
