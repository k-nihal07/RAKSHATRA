import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Star, Phone, ShieldCheck, User, MapPin } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function NearbyTransport() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Ramesh K.', vehicle: 'Auto Rickshaw', number: 'KA-01-AB-1234', rating: 4.8, fare: '₹50 - ₹120', verified: true, location: 'Bangalore South' },
    { id: 2, name: 'Suresh M.', vehicle: 'Sedan Taxi', number: 'KA-05-XY-9876', rating: 4.9, fare: '₹150 - ₹300', verified: true, location: 'City Center' },
    { id: 3, name: 'Vijay P.', vehicle: 'Auto Rickshaw', number: 'KA-03-CD-4567', rating: 4.5, fare: '₹50 - ₹130', verified: false, location: 'Indiranagar' },
  ]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [ratingValue, setRatingValue] = useState(0);

  // Get current user info for bookings
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleReport = async () => {
    if (ratingValue === 0 && !feedbackText) {
      alert("Please provide a rating or feedback text.");
      return;
    }

    try {
      await addDoc(collection(db, 'feedbacks'), {
        providerId: selectedDriver.id,
        rating: ratingValue,
        text: feedbackText,
        userId: currentUser.uid || 'guest',
        userName: currentUser.name || 'Traveler',
        timestamp: serverTimestamp()
      });
      alert(`Feedback submitted for ${selectedDriver.name}!`);
    } catch(e) {
      console.error("Error submitting feedback:", e);
      alert("Firebase Error: " + e.message + "\n\nPlease ensure your Firestore Database is created in Test Mode.");
    }

    setShowFeedbackInput(false);
    setFeedbackText('');
    setRatingValue(0);
  };

  // Real-time Provider Fetch
  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "provider"),
      where("serviceType", "==", "Transport")
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
      
      // Merge static mock drivers with dynamically fetched drivers
      const mockDrivers = [
        { id: 1, name: 'Ramesh K.', vehicle: 'Auto Rickshaw', number: 'KA-01-AB-1234', rating: 4.8, fare: '₹50 - ₹120', verified: true, location: 'Bangalore South' },
        { id: 2, name: 'Suresh M.', vehicle: 'Sedan Taxi', number: 'KA-05-XY-9876', rating: 4.9, fare: '₹150 - ₹300', verified: true, location: 'City Center' },
        { id: 3, name: 'Vijay P.', vehicle: 'Auto Rickshaw', number: 'KA-03-CD-4567', rating: 4.5, fare: '₹50 - ₹130', verified: false, location: 'Indiranagar' }
      ];
      setDrivers([...mockDrivers, ...fetchedDrivers]);
    }, (error) => {
      console.error("Failed to fetch real-time drivers", error);
    });

    return () => unsubscribe();
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
                <button 
                  className="btn btn-primary flex-1"
                  onClick={async () => {
                    try {
                      await addDoc(collection(db, 'service_requests'), {
                        providerId: driver.id,
                        type: 'Transport',
                        action: 'Ride Request',
                        status: 'pending',
                        timestamp: serverTimestamp(),
                        userId: currentUser.uid || 'guest',
                        userName: currentUser.name || 'Traveler',
                        location: driver.location || 'Current Loc'
                      });
                      alert(`Ride request sent to ${driver.name}! They will be notified immediately.`);
                    } catch (e) {
                      console.error("Booking error:", e);
                      alert("Firebase Error: " + e.message + "\n\nPlease ensure your Firestore Database is created in Test Mode.");
                    }
                  }}
                >
                  <Phone size={16} /> Contact
                </button>
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

              {!showFeedbackInput ? (
                <div className="flex gap-2" style={{ width: '100%', marginTop: '24px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, border: 'none' }}
                    onClick={() => setSelectedDriver(null)}
                  >
                    Close
                  </button>
                  <button 
                    className="btn" 
                    style={{ flex: 1, backgroundColor: 'var(--color-danger)', color: 'white', border: 'none' }}
                    onClick={() => setShowFeedbackInput(true)}
                  >
                    Report / Rate
                  </button>
                </div>
              ) : (
                <div className="flex-col gap-2" style={{ width: '100%', marginTop: '24px' }}>
                  <div className="flex justify-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={32} 
                        fill={star <= ratingValue ? "#F57C00" : "transparent"} 
                        color={star <= ratingValue ? "#F57C00" : "rgba(255,255,255,0.3)"}
                        onClick={() => setRatingValue(star)}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      />
                    ))}
                  </div>
                  <textarea 
                    placeholder="Describe the issue or provide feedback..."
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', resize: 'none' }}
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button className="btn btn-outline flex-1" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', flex: 1 }} onClick={() => setShowFeedbackInput(false)}>Cancel</button>
                    <button className="btn flex-1" style={{ backgroundColor: 'var(--color-danger)', color: 'white', border: 'none', flex: 1 }} onClick={handleReport}>Submit Report</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
