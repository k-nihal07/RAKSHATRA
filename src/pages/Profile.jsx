import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, MapPin, Award, Star } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Traveler', email: '' });

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* App Bar */}
      <div className="flex items-center gap-4" style={{ padding: '20px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Traveler Profile</h2>
      </div>

      <div style={{ padding: '24px 20px' }}>
        
        {/* Profile Card */}
        <div className="card flex-col items-center justify-center text-center gap-2" style={{ marginBottom: '24px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', 
            fontSize: '2rem', fontWeight: 600, marginBottom: '8px'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>{user.name}</h2>
          <div className="flex items-center gap-2 text-muted text-sm">
            <Mail size={16} /> {user.email || 'No email provided'}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="card flex-col gap-1 items-center justify-center text-center" style={{ backgroundColor: '#FFF8E1', borderColor: '#FFE0B2' }}>
            <Star size={24} color="#F57C00" style={{ marginBottom: '4px' }} />
            <p className="text-xs text-muted">Safety Points</p>
            <h3 style={{ fontSize: '1.25rem', color: '#F57C00' }}>450</h3>
          </div>
          <div className="card flex-col gap-1 items-center justify-center text-center" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary)' }}>
            <MapPin size={24} color="var(--color-primary)" style={{ marginBottom: '4px' }} />
            <p className="text-xs text-muted">Places Visited</p>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>12</h3>
          </div>
        </div>

        {/* List Details (Places visited placeholder) */}
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Recent Places Visited</h3>
        <div className="flex-col gap-3">
          <div className="card flex items-center justify-between" style={{ padding: '16px' }}>
            <div className="flex items-center gap-3">
              <div style={{ padding: '10px', backgroundColor: '#E8F5E9', borderRadius: '50%', color: '#2E7D32' }}>
                <MapPin size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Lalbagh Botanical Garden</h4>
                <p className="text-xs text-muted">Oct 12, 2024</p>
              </div>
            </div>
          </div>
          <div className="card flex items-center justify-between" style={{ padding: '16px' }}>
            <div className="flex items-center gap-3">
              <div style={{ padding: '10px', backgroundColor: '#E8F5E9', borderRadius: '50%', color: '#2E7D32' }}>
                <MapPin size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Bangalore Palace</h4>
                <p className="text-xs text-muted">Oct 10, 2024</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="btn btn-outline w-full" 
          style={{ marginTop: '32px' }}
          onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}
        >
          Sign Out
        </button>

      </div>
    </div>
  );
}
