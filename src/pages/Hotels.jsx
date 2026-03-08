import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Star, Phone, MapPin } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Hotels() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([
    { id: 1, name: 'Grand Horizon Hotel', price: '₹2,500/night', rating: 4.7, dist: '1.2 km', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'City Center Inn', price: '₹1,200/night', rating: 4.3, dist: '2.5 km', img: 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Lakeside Resorts', price: '₹4,000/night', rating: 4.9, dist: '4.8 km', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Budget Backpackers Hostel', price: '₹600/night', rating: 4.1, dist: '0.8 km', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80' }
  ]);
  const [selectedHotel, setSelectedHotel] = useState(null);
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
        providerId: selectedHotel.id,
        rating: ratingValue,
        text: feedbackText,
        userId: currentUser.uid || 'guest',
        userName: currentUser.name || 'Traveler',
        timestamp: serverTimestamp()
      });
      alert(`Feedback submitted for ${selectedHotel.name}!`);
    } catch(e) {
      console.error("Error submitting feedback:", e);
      console.error("Error submitting feedback:", e);
      alert("Firebase Error: " + e.message + "\n\nPlease ensure your Firestore Database is created in Test Mode.");
    }

    setShowFeedbackInput(false);
    setFeedbackText('');
    setRatingValue(0);
  };

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "provider"),
      where("serviceType", "==", "Hotel/Accommodation")
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedHotels = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: 'Contact for rates',
          rating: 5.0, // Default for new providers
          dist: data.location || 'Unknown Distance',
          img: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80' // Default hotel image
        };
      });
      
      const mockHotels = [
        { id: 1, name: 'Grand Horizon Hotel', price: '₹2,500/night', rating: 4.7, dist: '1.2 km', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
        { id: 2, name: 'City Center Inn', price: '₹1,200/night', rating: 4.3, dist: '2.5 km', img: 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
        { id: 3, name: 'Lakeside Resorts', price: '₹4,000/night', rating: 4.9, dist: '4.8 km', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
        { id: 4, name: 'Budget Backpackers Hostel', price: '₹600/night', rating: 4.1, dist: '0.8 km', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80' }
      ];
      setHotels([...mockHotels, ...fetchedHotels]);
    }, (error) => {
      console.error("Failed to fetch real-time hotels", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* App Bar */}
      <div className="flex items-center justify-between" style={{ padding: '20px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-4">
          <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Hotels & Stays</h2>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div className="flex-col gap-4">
          {hotels.map(hotel => (
            <div key={hotel.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={hotel.img} alt={hotel.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }} className="flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 style={{ fontSize: '1.1rem' }}>{hotel.name}</h3>
                  <div className="flex items-center gap-1" style={{ color: '#F57C00', fontWeight: 600 }}>
                    <Star size={14} fill="#F57C00" /> {hotel.rating}
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1 text-muted"><MapPin size={14} /> {hotel.dist}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{hotel.price}</span>
                </div>
                
                <div className="flex gap-2" style={{ marginTop: '8px' }}>
                  <button className="btn btn-outline" style={{ flex: 1, padding: '12px 0' }} onClick={() => alert("Calling provider...")}><Phone size={16} /></button>
                  <button className="btn btn-outline" style={{ flex: 1, padding: '12px 0', borderColor: '#F57C00', color: '#F57C00' }} onClick={() => setSelectedHotel(hotel)}><Star size={16} /></button>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 3 }}
                    onClick={async () => {
                      try {
                        await addDoc(collection(db, 'service_requests'), {
                          providerId: hotel.id,
                          type: 'Hotel/Accommodation',
                          action: 'Booking Request',
                          status: 'pending',
                          timestamp: serverTimestamp(),
                          userId: currentUser.uid || 'guest',
                          userName: currentUser.name || 'Traveler',
                          details: 'Standard Room Request'
                        });
                        alert(`Booking request sent to ${hotel.name}! The provider will confirm shortly.`);
                      } catch (e) {
                        console.error("Booking error:", e);
                        alert("Firebase Error: " + e.message + "\n\nPlease ensure your Firestore Database is created in Test Mode.");
                      }
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Rating Profile Modal (Dark Theme) */}
      {selectedHotel && (
        <>
          <div 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100 }}
            onClick={() => { setSelectedHotel(null); setShowFeedbackInput(false); setRatingValue(0); }}
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
                <Building size={40} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{selectedHotel.name}</h2>
              <div className="flex items-center gap-1" style={{ color: '#F57C00', fontWeight: 600, fontSize: '1.1rem' }}>
                <Star size={18} fill="#F57C00" /> {selectedHotel.rating} Overall
              </div>
              
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
              
              {!showFeedbackInput ? (
                <div className="flex gap-2" style={{ width: '100%', marginTop: '24px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, border: 'none' }}
                    onClick={() => { setSelectedHotel(null); setShowFeedbackInput(false); }}
                  >
                    Close
                  </button>
                  <button 
                    className="btn" 
                    style={{ flex: 1, backgroundColor: 'var(--color-danger)', color: 'white', border: 'none' }}
                    onClick={() => setShowFeedbackInput(true)}
                  >
                    Rate Hotel
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
                    placeholder="Describe your experience..."
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', resize: 'none' }}
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button className="btn btn-outline flex-1" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', flex: 1 }} onClick={() => setShowFeedbackInput(false)}>Cancel</button>
                    <button className="btn flex-1" style={{ backgroundColor: 'var(--color-danger)', color: 'white', border: 'none', flex: 1 }} onClick={handleReport}>Submit Rating</button>
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
