import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Bell, Star, AlertCircle, CheckCircle, Home, Key } from 'lucide-react';

export default function ProviderDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [user, setUser] = useState({ name: 'Partner', serviceType: 'Transport' });

  // Dynamic dashboard states
  const [roomsBooked, setRoomsBooked] = useState(8);
  const [guestsWaiting, setGuestsWaiting] = useState(3);
  const [routesToday, setRoutesToday] = useState(12);
  const [activeRequests, setActiveRequests] = useState([
    { id: 1, type: 'Transport', status: 'pending' },
    { id: 2, type: 'SOS', status: 'pending' }
  ]);
  const [hotelRequests, setHotelRequests] = useState([
    { id: 1, type: 'Booking', status: 'pending' },
    { id: 2, type: 'Verification', status: 'pending' }
  ]);

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  const isHotel = user.serviceType === 'Hotel/Accommodation';

  // Handlers for interactive buttons
  const handleHotelRequest = (id, action) => {
    if (action === 'confirm' && id === 1) {
      setRoomsBooked(prev => prev + 1);
    } else if (action === 'verify' && id === 2) {
      setGuestsWaiting(prev => Math.max(0, prev - 1));
    }
    setHotelRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleTransportRequest = (id, action) => {
    if (action === 'accept' && id === 1) {
      setRoutesToday(prev => prev + 1);
    }
    setActiveRequests(prev => prev.filter(req => req.id !== id));
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
          
          {/* HOTEL VIEW */}
          {isHotel && (
            <>
              {hotelRequests.find(r => r.id === 1) && (
                <div className="card flex-col gap-3" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Standard Room - 2 Nights</span>
                    <span className="text-xs">Incoming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home size={18} color="var(--color-text-muted)" />
                    <p style={{ fontWeight: 500 }}>Sarah J. <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}> wants to book</span></p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleHotelRequest(1, 'confirm')}>Confirm</button>
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => handleHotelRequest(1, 'full')}>Full</button>
                  </div>
                </div>
              )}
              
              {hotelRequests.find(r => r.id === 2) && (
                <div className="card flex-col gap-3" style={{ borderLeft: '4px solid var(--color-secondary)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ background: 'var(--color-secondary-light)', color: 'var(--color-secondary)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Guest Verification</span>
                    <span className="text-xs">At Reception</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key size={18} color="var(--color-secondary)" />
                    <p style={{ fontWeight: 500 }}>Rakshatra ID Check</p>
                  </div>
                  <button className="btn btn-outline w-full mt-1" onClick={() => handleHotelRequest(2, 'verify')}>Verify ID</button>
                </div>
              )}

              {hotelRequests.length === 0 && (
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
              {activeRequests.find(r => r.id === 1) && (
                <div className="card flex-col gap-3" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Transport Requested</span>
                    <span className="text-xs">2 mins ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} color="var(--color-text-muted)" />
                    <p style={{ fontWeight: 500 }}>Central Station <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>→ 3.2km away</span></p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleTransportRequest(1, 'accept')}>Accept</button>
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => handleTransportRequest(1, 'decline')}>Decline</button>
                  </div>
                </div>
              )}

              {activeRequests.find(r => r.id === 2) && (
                <div className="card flex-col gap-3" style={{ borderLeft: '4px solid var(--color-danger)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>SOS Assistance</span>
                    <span className="text-xs">Just now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={18} color="var(--color-danger)" />
                    <p style={{ fontWeight: 500 }}>Tourist Needs Help <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>→ 800m away</span></p>
                  </div>
                  <button className="btn btn-danger flex items-center justify-center w-full" onClick={() => handleTransportRequest(2, 'respond')}>Respond Immediate</button>
                </div>
              )}

              {activeRequests.length === 0 && (
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

    </div>
  );
}
