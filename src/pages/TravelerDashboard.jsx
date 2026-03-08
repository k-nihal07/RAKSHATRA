import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, Map, ShieldAlert, Car, Building, Star, Compass, CheckCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';

export default function TravelerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSosId, setActiveSosId] = useState(null);
  const [sosResponse, setSosResponse] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) setUser(JSON.parse(data));
  }, []);

  useEffect(() => {
    if (!activeSosId) return;
    const unsubscribe = onSnapshot(doc(db, 'sos_alerts', activeSosId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === 'responded' && data.responder) {
          setSosResponse(data.responder);
        }
      }
    });
    return () => unsubscribe();
  }, [activeSosId]);

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

      {/* Floating SOS Button */}
      <button 
        style={{
          position: 'fixed',
          bottom: '100px', // Above bottom nav
          right: '24px',
          backgroundColor: 'var(--color-danger)',
          color: 'white',
          border: 'none',
          borderRadius: '32px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          boxShadow: '0 8px 16px rgba(235, 32, 38, 0.4)',
          zIndex: 50,
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onClick={async () => {
          if (activeSosId) {
            alert("You already have an active SOS alert. Help is on the way!");
            return;
          }
          try {
            const docRef = await addDoc(collection(db, 'sos_alerts'), {
              timestamp: serverTimestamp(),
              uid: user?.uid || 'guest',
              userName: user?.name || 'Traveler',
              location: "Current Location",
              status: "active"
            });
            setActiveSosId(docRef.id);
            alert("SOS Alert Triggered! Waiting for nearby providers to respond.");
          } catch(e) {
            console.error(e);
            alert("Firebase Error: " + e.message + "\n\nPlease ensure your Firestore Database is created in Test Mode.");
          }
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <ShieldAlert size={24} /> EMERGENCY SOS
      </button>

      {/* Responder Full Screen Popup */}
      {sosResponse && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card flex-col items-center" style={{ backgroundColor: '#1C1C1E', color: 'white', padding: '32px', width: '100%', maxWidth: '340px', textAlign: 'center', border: '1px solid var(--color-danger)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(235, 32, 38, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldAlert size={36} color="var(--color-danger)" />
            </div>
            
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--color-danger)' }}>Help is on the way!</h2>
            <p style={{ marginBottom: '24px', opacity: 0.9 }}>
              A verified Local Guardian has received your distress signal and is responding.
            </p>
            
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', width: '100%', marginBottom: '24px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Responder</p>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {sosResponse.name} <CheckCircle size={16} color="var(--color-secondary)" />
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Contact</p>
              <p style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>{sosResponse.contact}</p>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px' }} 
              onClick={() => { setSosResponse(null); setActiveSosId(null); }}
            >
              I'm Safe / Dismiss
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
