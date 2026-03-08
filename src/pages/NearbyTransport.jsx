import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Star, Phone, ShieldCheck, User, MapPin } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function NearbyTransport() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Ramesh K.', vehicle: 'Auto Rickshaw', number: 'KA-01-AB-1234', rating: 4.8, fare: '₹50 - ₹120', verified: true, location: 'Bangalore South' },
    { id: 2, name: 'Suresh M.', vehicle: 'Sedan Taxi', number: 'KA-05-XY-9876', rating: 4.9, fare: '₹150 - ₹300', verified: true, location: 'City Center' },
    { id: 3, name: 'Vijay P.', vehicle: 'Auto Rickshaw', number: 'KA-03-CD-4567', rating: 4.5, fare: '₹50 - ₹130', verified: false, location: 'Indiranagar' },
  ]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Fetch registered Service Providers from Firestore
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "provider"),
          where("serviceType", "==", "Transport")
        );
        const querySnapshot = await getDocs(q);
        const fetchedDrivers = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            vehicle: 'Registered Vehicle',
            number: 'Verify via Profile',
            rating: 5.0, // Default rating for new users
            fare: 'Varies',
            verified: true,
            location: data.location || 'Unknown'
          };
        });
        
        // Append fetched drivers to the mock list
        setDrivers(prev => [...prev, ...fetchedDrivers]);
      } catch (err) {
        console.error("Failed to fetch drivers", err);
      }
    };
    fetchProviders();
  }, []);

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '100px', position: 'relative' }}>
      
      {/* App Bar */}
      <div className="flex items-center justify-between" style={{ padding: '20px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-4">
          <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Nearby Transport</h2>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <p className="text-sm" style={{ marginBottom: '16px' }}>Local drivers verified by the community.</p>

        <div className="flex-col gap-4">
          {drivers.map(driver => (
            <div key={driver.id} className="card flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div style={{ padding: '10px', backgroundColor: 'var(--color-primary-light)', borderRadius: '50%', color: 'var(--color-primary)' }}>
                    <Car size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {driver.name} 
                      {driver.verified && <ShieldCheck size={14} color="var(--color-secondary)" />}
                    </h3>
                    <p className="text-xs">{driver.vehicle} • {driver.number}</p>
                  </div>
                </div>
                <div className="flex-col items-end">
                  <div className="flex items-center gap-1" style={{ color: '#F57C00', fontWeight: 600 }}>
                    <Star size={14} fill="#F57C00" /> {driver.rating}
                  </div>
                  <p className="text-xs text-muted">Est. {driver.fare}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  className="btn btn-outline flex-1"
                  onClick={() => setSelectedDriver(driver)}
                >
                  View Profile
                </button>
                <button className="btn btn-primary flex-1"><Phone size={16} /> Contact</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Driver Profile Modal (Dark Theme) */}
      {selectedDriver && (
        <>
          <div 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100 }}
            onClick={() => setSelectedDriver(null)}
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            backgroundColor: '#0F172A', // Dark Blue/Black Theme
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            padding: '24px', borderRadius: '24px',
            width: '90%', maxWidth: '400px',
            zIndex: 105,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}>
            <div className="flex-col items-center gap-2" style={{ textAlign: 'center' }}>
              <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', color: 'white', display: 'inline-block', marginBottom: '8px' }}>
                <User size={40} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{selectedDriver.name}</h2>
              <div className="flex items-center gap-1" style={{ color: '#F57C00', fontWeight: 600, fontSize: '1.1rem' }}>
                <Star size={18} fill="#F57C00" /> {selectedDriver.rating} Rating
              </div>
              
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
              
              <div className="flex-col gap-3" style={{ textAlign: 'left', width: '100%' }}>
                <div className="flex items-center gap-3">
                  <Car size={18} color="rgba(255,255,255,0.7)" />
                  <span style={{ fontWeight: 500 }}>{selectedDriver.vehicle} ({selectedDriver.number})</span>
                </div>
                {selectedDriver.location && (
                  <div className="flex items-center gap-3">
                    <MapPin size={18} color="rgba(255,255,255,0.7)" />
                    <span style={{ fontWeight: 500 }}>Base: {selectedDriver.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} color={selectedDriver.verified ? "#4CAF50" : "rgba(255,255,255,0.5)"} />
                  <span style={{ fontWeight: 500, color: selectedDriver.verified ? "#4CAF50" : "rgba(255,255,255,0.7)" }}>
                    {selectedDriver.verified ? 'Verified Driver' : 'Unverified Driver'}
                  </span>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '24px', border: 'none' }}
                onClick={() => setSelectedDriver(null)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
