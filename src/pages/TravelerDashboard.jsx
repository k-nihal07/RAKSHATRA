import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, Map, ShieldAlert, Car, Building, Star, Compass } from 'lucide-react';

export default function TravelerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex-col" style={{ padding: '20px', paddingBottom: '100px', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>Hi, Traveler</h2>
          <p className="text-sm">Where are we going today?</p>
        </div>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)'
        }}>
          T
        </div>
      </div>

      {/* Main Action - Smart Trip Planner */}
      <div 
        className="card flex-col" 
        style={{ backgroundColor: 'var(--color-primary)', color: 'white', marginBottom: '24px', cursor: 'pointer' }}
        onClick={() => navigate('/planner')}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Smart Trip Planner</h3>
            <p style={{ color: 'var(--color-primary-light)', fontSize: '0.9rem', marginTop: '4px' }}>Find safest & fastest routes</p>
          </div>
          <Navigation size={32} color="white" />
        </div>
      </div>

      {/* Security Warning / Alert Module */}
      <div 
        className="card flex items-center gap-4" 
        style={{ borderLeft: '4px solid var(--color-warning)', marginBottom: '24px', backgroundColor: 'var(--color-surface)' }}
      >
        <div style={{ color: 'var(--color-warning)' }}>
          <ShieldAlert size={28} />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem' }}>Safety Status: Moderate</h3>
          <p className="text-xs" style={{ marginTop: '2px' }}>Avoid downtown area after 10 PM. Stay on verified routes.</p>
        </div>
      </div>

      {/* Grid Quick Actions */}
      <h3 style={{ marginBottom: '16px' }}>Explore Services</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        
        <div className="card flex-col items-center justify-center gap-2" style={{ cursor: 'pointer', padding: '20px 12px' }} onClick={() => navigate('/transport')}>
          <div style={{ backgroundColor: 'var(--color-secondary-light)', padding: '12px', borderRadius: '50%', color: 'var(--color-secondary)' }}>
            <Car size={24} />
          </div>
          <span style={{ fontWeight: 600 }}>Transport</span>
        </div>

        <div className="card flex-col items-center justify-center gap-2" style={{ cursor: 'pointer', padding: '20px 12px' }} onClick={() => navigate('/hotels')}>
          <div style={{ backgroundColor: '#E3F2FD', padding: '12px', borderRadius: '50%', color: '#1976D2' }}>
            <Building size={24} />
          </div>
          <span style={{ fontWeight: 600 }}>Hotels</span>
        </div>

        <div className="card flex-col items-center justify-center gap-2" style={{ cursor: 'pointer', padding: '20px 12px' }} onClick={() => navigate('/explore')}>
          <div style={{ backgroundColor: '#FFF3E0', padding: '12px', borderRadius: '50%', color: '#F57C00' }}>
            <Compass size={24} />
          </div>
          <span style={{ fontWeight: 600 }}>Places</span>
        </div>

        <div className="card flex-col items-center justify-center gap-2" style={{ cursor: 'pointer', padding: '20px 12px' }} onClick={() => navigate('/volunteer')}>
          <div style={{ backgroundColor: '#F3E5F5', padding: '12px', borderRadius: '50%', color: '#8E24AA' }}>
            <Star size={24} />
          </div>
          <span style={{ fontWeight: 600 }}>Volunteers</span>
        </div>

      </div>

    </div>
  );
}
