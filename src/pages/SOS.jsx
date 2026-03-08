import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Phone, CheckCircle, ArrowLeft } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function SOS() {
  const navigate = useNavigate();
  const [sosActive, setSosActive] = useState(false);
  const [activeSosId, setActiveSosId] = useState(null);
  const [sosResponse, setSosResponse] = useState(null);

  React.useEffect(() => {
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

  const handleSOS = async () => {
    if (sosActive) return;
    setSosActive(true);
    
    // Get user from local storage
    const userDataStr = localStorage.getItem('user');
    const user = userDataStr ? JSON.parse(userDataStr) : null;
    
    try {
      const docRef = await addDoc(collection(db, 'sos_alerts'), {
        timestamp: serverTimestamp(),
        uid: user?.uid || 'guest',
        userName: user?.name || 'Traveler',
        location: "Current Location",
        status: "active"
      });
      setActiveSosId(docRef.id);
    } catch(e) {
      console.error(e);
      alert("Firebase Error: " + e.message + "\n\nPlease ensure your Firestore Database is created in Test Mode.");
    }
  };

  const cancelSOS = async () => {
    setSosActive(false);
    if (activeSosId) {
      try {
        await updateDoc(doc(db, 'sos_alerts', activeSosId), { status: 'cancelled' });
      } catch (e) {
        console.error("Failed to cancel on firebase:", e);
      }
      setActiveSosId(null);
    }
  };

  return (
    <div className="flex-col" style={{ backgroundColor: sosActive ? 'var(--color-danger)' : 'var(--color-surface)', minHeight: '100vh', transition: 'background-color 0.5s', color: sosActive ? 'white' : 'var(--color-text)' }}>
      
      {/* App Bar */}
      <div className="flex items-center justify-between" style={{ padding: '20px' }}>
        <button 
          style={{ background: sosActive ? 'rgba(255,255,255,0.2)' : 'var(--color-background)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: sosActive ? 'white' : 'inherit' }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-col items-center justify-center flex" style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
        
        {sosActive ? (
          <div className="flex-col items-center gap-4 animation-fade-in">
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '50%', color: 'var(--color-danger)', marginBottom: '16px' }}>
              <CheckCircle size={60} />
            </div>
            <h1 style={{ fontSize: '2rem' }}>Help is on the way</h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Emergency alert sent.</p>
            
            <div className="card w-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', marginTop: '24px', textAlign: 'left' }}>
              <div className="flex items-center gap-3">
                <ShieldAlert size={20} /> <p>Notified nearby police station.</p>
              </div>
              <div className="flex items-center gap-3" style={{ marginTop: '12px' }}>
                <AlertTriangle size={20} /> <p>Live GPS sent to emergency contacts.</p>
              </div>
              <div className="flex items-center gap-3" style={{ marginTop: '12px' }}>
                <ShieldAlert size={20} /> <p>2 Guardian Volunteers responding.</p>
              </div>
            </div>

            <button 
              className="btn" 
              style={{ backgroundColor: 'white', color: 'var(--color-danger)', marginTop: '32px', width: '100%' }}
              onClick={cancelSOS}
            >
              Cancel Alert
            </button>
          </div>
        ) : (
          <div className="flex-col items-center gap-4">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Emergency Assistance</h2>
            <p className="text-muted">Press and hold the button below to alert authorities and nearby volunteers.</p>

            <button 
              style={{
                width: '200px', height: '200px', borderRadius: '50%',
                backgroundColor: 'var(--color-danger)', border: 'none',
                boxShadow: '0 0 0 16px var(--color-danger-light), 0 20px 40px rgba(255, 59, 48, 0.4)',
                color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                margin: '40px 0', cursor: 'pointer', transition: 'transform 0.2s'
              }}
              onPointerDown={(e) => e.target.style.transform = 'scale(0.95)'}
              onPointerUp={(e) => { e.target.style.transform = 'scale(1)'; handleSOS(); }}
              onPointerLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <ShieldAlert size={64} style={{ marginBottom: '8px' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '2px' }}>SOS</span>
            </button>

            <button className="btn btn-outline flex items-center gap-2 w-full mt-4">
              <Phone size={20} /> Call Police (100)
            </button>
          </div>
        )}

      </div>

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
              onClick={() => { setSosResponse(null); setActiveSosId(null); setSosActive(false); }}
            >
              I'm Safe / Dismiss
            </button>
          </div>
        </div>
      )}

      <style>{`
        .animation-fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
