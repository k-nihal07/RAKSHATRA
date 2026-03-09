import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Bell, Star, AlertCircle, CheckCircle, Home, Key, ShieldAlert, X } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function ProviderDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [user, setUser] = useState({ name: 'Partner', serviceType: 'Transport' });

  // Dynamic dashboard states
  const [roomsBooked, setRoomsBooked] = useState(0);
  const [guestsWaiting, setGuestsWaiting] = useState(0);
  const [routesToday, setRoutesToday] = useState(0);
  const [activeRequests, setActiveRequests] = useState([]);
  const [hotelRequests, setHotelRequests] = useState([]);
  const [sosRequests, setSosRequests] = useState([]);
  const [trackingSosId, setTrackingSosId] = useState(null);
  const [trackingSosData, setTrackingSosData] = useState(null);
  const [latestFeedback, setLatestFeedback] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  // Real-time SOS alerts listener
  useEffect(() => {
    if (!isOnline) return;
    const q = query(collection(db, "sos_alerts"), where("status", "==", "active"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sosList = [];
      const now = Date.now();
      snapshot.forEach(doc => {
        const data = doc.data();
        let alertTime = now;
        if (data.timestamp) {
           alertTime = data.timestamp.toMillis ? data.timestamp.toMillis() : data.timestamp;
        }
        
        // Ignore alerts older than 1 hour (3600000 ms)
        if (now - alertTime < 3600000) {
          sosList.push({ id: doc.id, ...data, type: 'SOS', dynamic: true });
        }
      });
      setSosRequests(sosList);
    });
    return () => unsubscribe();
  }, [isOnline]);

  // SOS Response Tracker (Listening for "I'm Safe" cancellation)
  useEffect(() => {
    if (!trackingSosId) return;
    const unsubscribe = onSnapshot(doc(db, 'sos_alerts', trackingSosId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTrackingSosData(data);
        if (data.status === 'cancelled') {
           alert("USER IS SAFE! The traveler has cancelled the SOS alert. You may stand down.");
           setTrackingSosId(null);
           setTrackingSosData(null);
        }
      }
    });
    return () => unsubscribe();
  }, [trackingSosId]);

  // Real-time Feedback Toast Listener
  useEffect(() => {
    if (!user.uid || !isOnline) return;
    const q = query(collection(db, "feedbacks"), where("providerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const fb = change.doc.data();
          if (fb.timestamp && (Date.now() - fb.timestamp.toMillis() < 10000)) {
            setLatestFeedback(fb);
            setTimeout(() => setLatestFeedback(null), 8000);
          }
        }
      });
    });
    return () => unsubscribe();
  }, [user.uid, isOnline]);

  // Real-time Service Requests (Bookings) listener
  useEffect(() => {
    if (!user.uid || !isOnline) return;
    const q = query(collection(db, "service_requests"), where("providerId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = [];
      let activeBookings = 0;
      let pendingBookings = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'pending') {
          requests.push({ id: doc.id, ...data });
          pendingBookings++;
        } else if (data.status === 'accepted' || data.status === 'confirmed') {
          activeBookings++;
        }
      });

      if (user.serviceType === 'Hotel/Accommodation') {
        setHotelRequests(requests);
        setRoomsBooked(activeBookings);
        setGuestsWaiting(pendingBookings);
      } else {
        setActiveRequests(requests);
        setRoutesToday(activeBookings);
      }
    });

    return () => unsubscribe();
  }, [user.uid, isOnline, user.serviceType]);

  const isHotel = user.serviceType === 'Hotel/Accommodation';

  // Handlers for interactive buttons
  const handleHotelRequest = async (id, action) => {
    try {
      if (action === 'confirm') {
        const roomNum = prompt("Enter the assigned Room Number for the guest:");
        if (!roomNum) return; // User cancelled prompt
        await updateDoc(doc(db, 'service_requests', id), { status: 'confirmed', roomNumber: roomNum });
      } else if (action === 'full') {
        await updateDoc(doc(db, 'service_requests', id), { status: 'declined' });
      } else if (action === 'verify') {
        await updateDoc(doc(db, 'service_requests', id), { status: 'verified' });
      }
    } catch (e) {
      console.error("Error updating hotel request:", e);
    }
  };

  const handleTransportRequest = async (id, action, isSOS = false) => {
    if (isSOS) {
      try {
        await updateDoc(doc(db, 'sos_alerts', id), {
          status: 'responded',
          responder: {
            id: user.uid || 'provider',
            name: user.name,
            contact: user.email || 'Registered Contact'
          }
        });
        setTrackingSosId(id);
        alert(`You are responding to the SOS. Routing you to their location.`);
      } catch(e) {
        console.error("Failed to update SOS alert", e);
      }
      return;
    }

    // Normal Transport Request
    try {
      if (action === 'accept') {
        await updateDoc(doc(db, 'service_requests', id), { status: 'accepted' });
      } else if (action === 'decline') {
        await updateDoc(doc(db, 'service_requests', id), { status: 'declined' });
      }
    } catch (e) {
      console.error("Error updating transport request:", e);
    }
  };

  const declineSosRequest = (id) => {
    setSosRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="flex-col" style={{ padding: '20px', paddingBottom: '100px', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>
            {isHotel ? 'Hotel Dashboard' : 'Transport Dashboard'}
          </h2>
          <p className="text-sm">Welcome back, {user.name.split(' ')[0]}</p>
        </div>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-secondary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)'
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Online Toggle */}
      <div className="card flex items-center justify-between" style={{ marginBottom: '24px' }}>
        <div className="flex items-center gap-3">
          <div style={{ 
            width: '12px', height: '12px', borderRadius: '50%', 
            backgroundColor: isOnline ? 'var(--color-secondary)' : 'var(--color-text-muted)',
            boxShadow: isOnline ? '0 0 10px var(--color-secondary)' : 'none'
          }} />
          <h3 style={{ fontSize: '1.1rem' }}>{isOnline ? 'Accepting Requests' : 'Offline'}</h3>
        </div>
        <button 
          className="btn"
          style={{ 
            backgroundColor: isOnline ? 'var(--color-background)' : 'var(--color-secondary)', 
            color: isOnline ? 'var(--color-text)' : 'white',
            border: isOnline ? '1px solid var(--color-border)' : 'none'
          }}
          onClick={() => setIsOnline(!isOnline)}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card flex-col gap-1">
          <p className="text-sm">{isHotel ? 'Rooms Booked' : 'Routes Today'}</p>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-secondary)' }}>{isHotel ? roomsBooked : routesToday}</h2>
        </div>
        <div className="card flex-col gap-1">
          <p className="text-sm">{isHotel ? 'Guests Wait' : 'Rating'}</p>
          <div className="flex items-center gap-1">
            <h2 style={{ fontSize: '1.8rem', color: isHotel ? 'var(--color-primary)' : '#F57C00' }}>{isHotel ? guestsWaiting : '4.8'}</h2>
            {!isHotel && <Star size={18} fill="#F57C00" color="#F57C00" />}
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '16px' }}>{isHotel ? 'Room Requests' : 'Active Requests'}</h3>
      
      {isOnline ? (
        <div className="flex-col gap-4">

          {/* GLOBAL SOS ALERTS */}
          {sosRequests.map(req => (
            <div key={req.id} className="card flex-col gap-3" style={{ borderLeft: '4px solid var(--color-danger)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>SOS Assistance</span>
                <span className="text-xs">Just now</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle size={18} color="var(--color-danger)" />
                <p style={{ fontWeight: 500 }}>{req.userName || 'User'} <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>→ {req.location || 'Unknown'}</span></p>
              </div>
              <button className="btn btn-danger flex items-center justify-center w-full" onClick={() => handleTransportRequest(req.id, 'respond', true)}>Respond Immediate</button>
            </div>
          ))}
          
          {/* HOTEL VIEW */}
          {isHotel && (
            <>
              {hotelRequests.map(req => (
                <div key={req.id} className="card flex-col gap-3" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{req.details || 'Room Request'}</span>
                    <span className="text-xs">Incoming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home size={18} color="var(--color-text-muted)" />
                    <p style={{ fontWeight: 500 }}>{req.userName || 'Guest'} <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}> wants to book</span></p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleHotelRequest(req.id, 'confirm')}>Confirm</button>
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => handleHotelRequest(req.id, 'full')}>Full</button>
                  </div>
                </div>
              ))}

              {hotelRequests.length === 0 && sosRequests.length === 0 && (
                <div className="card text-center" style={{ padding: '32px 16px', color: 'var(--color-text-muted)' }}>
                  <CheckCircle size={32} color="var(--color-secondary)" style={{ margin: '0 auto 12px' }} />
                  <p>All caught up on requests!</p>
                </div>
              )}
            </>
          )}

          {/* TRANSPORT VIEW */}
          {!isHotel && (
            <>
              {activeRequests.map(req => (
                <div key={req.id} className="card flex-col gap-3" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{req.action || 'Transport Requested'}</span>
                    <span className="text-xs">Just now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} color="var(--color-text-muted)" />
                    <p style={{ fontWeight: 500 }}>{req.userName || 'Passenger'} <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>→ {req.location || 'Current Loc'}</span></p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleTransportRequest(req.id, 'accept', false)}>Accept</button>
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => handleTransportRequest(req.id, 'decline', false)}>Decline</button>
                  </div>
                </div>
              ))}

              {activeRequests.length === 0 && sosRequests.length === 0 && (
                <div className="card text-center" style={{ padding: '32px 16px', color: 'var(--color-text-muted)' }}>
                  <CheckCircle size={32} color="var(--color-secondary)" style={{ margin: '0 auto 12px' }} />
                  <p>All caught up on requests!</p>
                </div>
              )}
            </>
          )}

        </div>
      ) : (
        <div className="card flex-col items-center justify-center p-8 text-center gap-3">
          <Bell size={40} color="var(--color-text-muted)" opacity={0.5} />
          <p>You are currently offline. Go online to receive requests.</p>
        </div>
      )}

      {/* Real-time Feedback Toast */}
      {latestFeedback && (
        <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#333', color: 'white', padding: '16px 24px', borderRadius: '12px', zIndex: 2000, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '90%', maxWidth: '340px', animation: 'slideUp 0.3s ease-out' }}>
          <div style={{ backgroundColor: '#F57C00', padding: '8px', borderRadius: '50%' }}><Star size={20} color="white" fill="white" /></div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>New {latestFeedback.rating}-Star Feedback!</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>"{latestFeedback.text || 'Great service!'}" - {latestFeedback.userName}</p>
          </div>
        </div>
      )}

      {/* Tracking SOS Modal (Map Tracking Provider Side) */}
      {trackingSosData && trackingSosData.status === 'responded' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card flex-col items-center" style={{ backgroundColor: '#1C1C1E', color: 'white', padding: '24px', width: '100%', maxWidth: '400px', textAlign: 'center', border: '1px solid var(--color-primary)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--color-primary)' }}>Tracking Traveler</h2>
            <p style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Proceed immediately to location.</p>
            
            <div style={{ width: '100%', height: '250px', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${encodeURIComponent(trackingSosData.location || "Current Location")}&output=embed`}
                allowFullScreen
              />
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px' }} 
              onClick={() => { setTrackingSosId(null); setTrackingSosData(null); }}
            >
              Close Tracking Map
            </button>
          </div>
        </div>
      )}

      {sosRequests.length > 0 && isOnline && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(235,32,38,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'pulseBg 2s infinite' }}>
          <div className="card flex-col items-center" style={{ position: 'relative', backgroundColor: '#1C1C1E', color: 'white', padding: '32px', width: '100%', maxWidth: '340px', textAlign: 'center', border: '2px solid white', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}>
            
            <button 
              onClick={() => declineSosRequest(sosRequests[0].id)} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              aria-label="Decline"
            >
              <X size={24} />
            </button>

            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', animation: 'bounceIn 0.5s' }}>
              <ShieldAlert size={40} color="white" />
            </div>
            
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--color-danger)', fontWeight: 800 }}>EMERGENCY SOS</h2>
            <p style={{ marginBottom: '24px', opacity: 0.9, fontSize: '1.1rem' }}>
              A traveler nearby needs immediate assistance!
            </p>
            
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', width: '100%', marginBottom: '24px', textAlign: 'left' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Traveler Name</p>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontWeight: 600 }}>{sosRequests[0].userName || 'Unknown User'}</h3>
              
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Location</p>
              <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18} color="var(--color-danger)"/> {sosRequests[0].location || 'Current Location'}</p>
            </div>

            <button 
              className="btn btn-danger" 
              style={{ width: '100%', padding: '16px', fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }} 
              onClick={() => handleTransportRequest(sosRequests[0].id, 'respond', true)}
            >
              Respond Immediate
            </button>
            <p className="text-xs text-muted" style={{ marginTop: '16px' }}>Responding will share your contact details with the traveler.</p>
          </div>
          
          <style>{`
            @keyframes pulseBg {
              0% { background-color: rgba(235,32,38,0.85); }
              50% { background-color: rgba(235,32,38,0.95); }
              100% { background-color: rgba(235,32,38,0.85); }
            }
            @keyframes slideUp {
              from { transform: translate(-50%, 50px); opacity: 0; }
              to { transform: translate(-50%, 0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

    </div>
  );
}
