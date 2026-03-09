import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Info, Car, Train, Activity, ShieldAlert } from 'lucide-react';

export default function RouteRecommendation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract start and dest exactly as passed from TripPlanner
  const start = location.state?.start || 'Current Loc';
  const dest = location.state?.dest || 'City Center';

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* App Bar */}
      <div className="flex items-center gap-4" style={{ padding: '20px', backgroundColor: 'var(--color-primary)', color: 'white' }}>
        <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Routes Available</h2>
          <p className="text-xs" style={{ color: 'var(--color-primary-light)' }}>{start} → {dest}</p>
        </div>
      </div>

      {/* Interactive Map on Top */}
      <div style={{ height: '240px', width: '100%', position: 'relative', backgroundColor: '#e5e3df' }}>
        <iframe 
          title="Route Map"
          src={
            start && dest && start !== 'Current Loc'
              ? `https://maps.google.com/maps?saddr=${encodeURIComponent(start)}&daddr=${encodeURIComponent(dest)}&output=embed`
              : dest 
                ? `https://maps.google.com/maps?q=${encodeURIComponent(dest)}&output=embed`
                : `https://maps.google.com/maps?q=Bengaluru&output=embed`
          }
          width="100%" 
          height="100%" 
          style={{ border: 0, filter: 'contrast(1.1) saturate(1.2)' }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Safety Warning */}
      <div style={{ padding: '16px 20px 0 20px' }}>
        <div className="card flex gap-3 items-start" style={{ backgroundColor: '#FFF3E0', borderColor: '#FFE0B2' }}>
          <ShieldAlert size={24} color="#F57C00" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ color: '#E65100', fontSize: '0.9rem', marginBottom: '2px' }}>Area Alert</h4>
            <p className="text-xs" style={{ color: '#F57C00' }}>Avoid walking routes after 11 PM. Showing safe transit options below.</p>
          </div>
        </div>
      </div>

      <div className="flex-col gap-4" style={{ padding: '20px' }}>
        
        {/* Route 1: Multi-modal (Cheaper) */}
        <div className="card flex-col gap-3" style={{ border: '2px solid var(--color-primary)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Recommended (Safest)</span>
          </div>
          
          <div className="flex items-center gap-2" style={{ fontWeight: 600 }}>
            <Car size={18} color="var(--color-text-muted)" /> Auto 
            <Activity size={12} color="var(--color-border)" />
            <Train size={18} color="var(--color-primary)" /> Metro
            <Activity size={12} color="var(--color-border)" />
            <MapPin size={18} color="var(--color-danger)" /> Walk
          </div>
          
          {/* Time and changes details removed as requested */}
          
          <button 
            className="btn btn-outline" 
            style={{ marginTop: '8px', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(dest)}&travelmode=transit`, '_blank')}
          >
            View Public Transport Options
          </button>
        </div>

        {/* Route 2: Direct Taxi */}
        <div className="card flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Fastest</span>
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>₹180</span>
          </div>
          
          <div className="flex items-center gap-2" style={{ fontWeight: 600 }}>
            <Car size={18} color="var(--color-secondary)" /> Taxi Direct
          </div>
          
          <div className="flex text-sm text-muted gap-4">
            <span className="flex items-center gap-1"><Clock size={14} /> 15 mins</span>
          </div>
          
          <button className="btn btn-primary" style={{ marginTop: '8px' }} onClick={() => navigate('/transport')}>Book Taxi</button>
        </div>

      </div>
    </div>
  );
}
