import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Star, HeartHandshake } from 'lucide-react';

export default function VolunteerReg() {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* App Bar */}
      <div className="flex items-center justify-between" style={{ padding: '20px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-4">
          <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Guardian Network</h2>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        
        {registered ? (
          <div className="card flex-col items-center justify-center p-8 text-center gap-4" style={{ backgroundColor: 'var(--color-secondary-light)', border: '2px solid var(--color-secondary)' }}>
            <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '50%', color: 'var(--color-secondary)' }}>
              <ShieldCheck size={48} />
            </div>
            <h2 style={{ color: 'var(--color-secondary)' }}>You are a Guardian!</h2>
            <p>Thank you for volunteering. You will now receive SOS alerts from travelers within a 1km radius.</p>
            <button className="btn btn-secondary w-full" onClick={() => navigate('/traveler')}>Back to Dashboard</button>
          </div>
        ) : (
          <div className="flex-col gap-4">
            
            <div style={{ textAlign: 'center', marginBottom: '24px', marginTop: '16px' }}>
              <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: '#F3E5F5', borderRadius: '50%', color: '#8E24AA', marginBottom: '16px' }}>
                <HeartHandshake size={48} />
              </div>
              <h2 style={{ fontSize: '1.5rem' }}>Become a Safety Volunteer</h2>
              <p className="text-sm mt-2">Help travelers in need and ensure your city stays safe.</p>
            </div>

            <div className="card flex gap-3 items-start">
              <ShieldCheck size={24} color="var(--color-primary)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Respond to Emergencies</h4>
                <p className="text-xs text-muted">Get notified when a traveler nearby presses SOS and assist until authorities arrive.</p>
              </div>
            </div>

            <div className="card flex gap-3 items-start">
              <Star size={24} color="#F57C00" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Earn Safety Points</h4>
                <p className="text-xs text-muted">Get rewarded with points for every verified assistance, redeemable for discounts.</p>
              </div>
            </div>

            <button 
              className="btn" 
              style={{ backgroundColor: '#8E24AA', color: 'white', padding: '16px', marginTop: '24px' }}
              onClick={() => setRegistered(true)}
            >
              Register as Volunteer
            </button>
            
          </div>
        )}

      </div>
    </div>
  );
}
