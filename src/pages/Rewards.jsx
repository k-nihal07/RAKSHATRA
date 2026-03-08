import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Coffee, Car, Building } from 'lucide-react';

export default function Rewards() {
  const navigate = useNavigate();

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* App Bar */}
      <div className="flex items-center justify-between" style={{ padding: '20px', backgroundColor: '#FFF8E1' }}>
        <div className="flex items-center gap-4">
          <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Rewards & Profile</h2>
        </div>
      </div>

      {/* Points Card */}
      <div style={{ backgroundColor: '#FFF8E1', padding: '0 20px 40px 20px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
        <div className="card flex items-center justify-between" style={{ backgroundColor: 'white', border: '1px solid #FFE0B2', boxShadow: '0 10px 30px rgba(245, 124, 0, 0.1)' }}>
          <div>
            <p className="text-sm">Safety Points</p>
            <h1 style={{ fontSize: '2.5rem', color: '#F57C00', display: 'flex', alignItems: 'center', gap: '8px' }}>
              450 <Star size={28} fill="#F57C00" />
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="text-xs text-muted">Level 2</p>
            <p className="text-sm font-semibold text-primary">Guardian</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '16px' }}>Redeem points for</h3>
        
        <div className="flex-col gap-4">
          
          <div className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ padding: '12px', backgroundColor: 'var(--color-primary-light)', borderRadius: '50%', color: 'var(--color-primary)' }}>
                <Car size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem' }}>20% OFF Transport</h4>
                <p className="text-xs text-muted">Any verified auto/taxi</p>
              </div>
            </div>
            <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>200 pts</button>
          </div>

          <div className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ padding: '12px', backgroundColor: '#E0F7FA', borderRadius: '50%', color: '#00838F' }}>
                <Building size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem' }}>10% OFF Hotels</h4>
                <p className="text-xs text-muted">Partnered stays</p>
              </div>
            </div>
            <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', color: '#00838F', borderColor: '#00838F' }}>300 pts</button>
          </div>

        </div>
      </div>
      
    </div>
  );
}
