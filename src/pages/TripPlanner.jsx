import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, Search, LocateFixed } from 'lucide-react';

export default function TripPlanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const [start, setStart] = useState('Current Location');
  const [dest, setDest] = useState(location.state?.dest || '');

  const handleSearch = (e) => {
    e.preventDefault();
    if (dest) {
      // Pass start and dest to the routes page via state
      navigate('/routes', { state: { start, dest } });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setStart('Locating...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStart(`${position.coords.latitude},${position.coords.longitude}`);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not get your location. Please check browser location permissions.");
          setStart('Current Location');
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-surface)', height: '100vh', position: 'relative' }}>
      
      {/* Interactive Map */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#e5e3df' }}>
        <iframe 
          title="Trip Map"
          src={
            start && dest && start !== 'Current Location'
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

      {/* Floating Back Button */}
      <button 
        style={{ position: 'absolute', top: '40px', left: '20px', zIndex: 10, background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={24} color="var(--color-text)" />
      </button>

      {/* Search Bottom Sheet */}
      <div style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px',
        padding: '24px',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        zIndex: 20
      }}>
        <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', margin: '0 auto 20px auto' }} />
        
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Plan Your Trip safely</h2>
        
        <form onSubmit={handleSearch} className="flex-col gap-3">
          <div className="flex items-center gap-3 card" style={{ padding: '12px 16px' }}>
            <Navigation size={20} color="var(--color-primary)" />
            <input 
              type="text" 
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', background: 'transparent' }}
              placeholder="Start Location"
            />
            <div 
              onClick={getCurrentLocation} 
              style={{ cursor: 'pointer', color: 'white', backgroundColor: 'var(--color-primary)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Use my current location"
            >
              <LocateFixed size={18} />
            </div>
          </div>

          <div style={{ paddingLeft: '26px', borderLeft: '2px dashed var(--color-border)', marginLeft: '25px', height: '16px', marginTop: '-8px', marginBottom: '-8px' }} />

          <div className="flex items-center gap-3 card" style={{ padding: '12px 16px' }}>
            <MapPin size={20} color="var(--color-danger)" />
            <input 
              type="text" 
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', background: 'transparent' }}
              placeholder="Where to?"
              autoFocus
            />
          </div>

          <button 
            type="submit"
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '16px', padding: '16px' }}
            disabled={!dest}
          >
            <Search size={20} /> Find Safe Routes
          </button>
        </form>
      </div>

    </div>
  );
}
