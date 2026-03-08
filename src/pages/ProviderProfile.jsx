import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, MapPin, Briefcase, Star, Gift, Copy, MessageSquare } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function ProviderProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Service Provider', email: '', serviceType: '', location: '' });
  const [points, setPoints] = useState(1250);
  
  // Reward Modal States
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardDetails, setRewardDetails] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  // Fetch real-time feedbacks
  useEffect(() => {
    if (!user.uid) return;
    const q = query(collection(db, "feedbacks"), where("providerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedFeedbacks = [];
      snapshot.forEach(doc => {
        fetchedFeedbacks.push({ id: doc.id, ...doc.data() });
      });
      // Sort newest first
      fetchedFeedbacks.sort((a, b) => b.timestamp - a.timestamp);
      setFeedbacks(fetchedFeedbacks);
    });
    return () => unsubscribe();
  }, [user.uid]);

  const handleRedeem = (title, cost) => {
    if (points >= cost) {
      setPoints(prev => prev - cost);
      
      // Generate a random promo code
      const code = 'RKSH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setPromoCode(code);
      setRewardDetails({ title, cost });
      setShowRewardModal(true);
      
      // Trigger simple CSS animation pulse
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);
    } else {
      alert("Not enough points!");
    }
  };

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* App Bar */}
      <div className="flex items-center gap-4" style={{ padding: '20px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Provider Profile</h2>
      </div>

      <div style={{ padding: '24px 20px' }}>
        
        {/* Header Profile Info */}
        <div className="flex-col items-center justify-center text-center gap-2" style={{ marginBottom: '32px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-secondary-light)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', 
            fontSize: '2rem', fontWeight: 600, marginBottom: '8px'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>{user.name}</h2>
          <div className="flex items-center gap-2 text-sm justify-center" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
            <Star size={16} fill="var(--color-secondary)" /> 
            {feedbacks.length > 0 
              ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0) / feedbacks.length).toFixed(1) 
              : "5.0"} Rating
          </div>
        </div>

        {/* Provider Details Card */}
        <div className="card flex-col gap-4">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Business Details</h3>
          
          <div className="flex items-center gap-3">
            <Mail size={20} color="var(--color-text-muted)" />
            <div>
              <p className="text-xs text-muted">Email / Contact</p>
              <p style={{ fontWeight: 500 }}>{user.email || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase size={20} color="var(--color-text-muted)" />
            <div>
              <p className="text-xs text-muted">Service Type</p>
              <p style={{ fontWeight: 500 }}>{user.serviceType || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={20} color="var(--color-text-muted)" />
            <div>
              <p className="text-xs text-muted">Service Location</p>
              <p style={{ fontWeight: 500 }}>{user.location || 'Not specified'}</p>
            </div>
          </div>

        </div>

        {/* Live Feedback Section */}
        <div className="card flex-col gap-4" style={{ marginTop: '16px' }}>
          <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Feedback</h3>
            <MessageSquare size={18} color="var(--color-text-muted)" />
          </div>

          <div className="flex-col gap-3">
            {feedbacks.length > 0 ? (
              feedbacks.map(fb => (
                <div key={fb.id} style={{ padding: '12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  <div className="flex justify-between items-center mb-1">
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{fb.userName || 'Guest User'}</span>
                    <div className="flex items-center gap-1" style={{ color: '#F57C00', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Star size={12} fill="#F57C00" /> {fb.rating || 5}
                    </div>
                  </div>
                  <p className="text-xs text-muted" style={{ fontStyle: 'italic' }}>"{fb.text || 'No comment provided.'}"</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted text-center" style={{ padding: '16px 0' }}>No feedback received yet.</p>
            )}
          </div>
        </div>

        {/* Rewards Section */}
        <div className="card flex-col gap-4" style={{ marginTop: '16px' }}>
          <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Rewards Points</h3>
            <div className={`flex items-center gap-1 ${isAnimating ? 'pulse-anim' : ''}`} style={{ color: '#F57C00', fontWeight: 600, transition: 'all 0.3s ease' }}>
              <Star size={18} fill="#F57C00" /> {points} <span className="text-xs text-muted" style={{ color: 'var(--color-text-muted)' }}>Pts</span>
            </div>
          </div>
          <p className="text-sm text-muted">Redeem your earned points for exclusive travel offers.</p>
          
          <div className="flex-col gap-3">
            <div className="flex items-center justify-between" style={{ padding: '12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>10% Off Hotel Booking</p>
                <p className="text-xs text-muted">Valid on partner hotels.</p>
              </div>
              <button 
                className="btn" 
                style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: points >= 500 ? '#F57C00' : 'var(--color-border)', color: points >= 500 ? 'white' : 'var(--color-text-muted)', border: 'none', borderRadius: '6px', cursor: points >= 500 ? 'pointer' : 'not-allowed' }} 
                onClick={() => handleRedeem('10% Off Hotel Booking', 500)}
                disabled={points < 500}
              >
                500 Pts
              </button>
            </div>

            <div className="flex items-center justify-between" style={{ padding: '12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>5% Off Taxi Rides</p>
                <p className="text-xs text-muted">Valid on local rides.</p>
              </div>
              <button 
                className="btn" 
                style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: points >= 1000 ? '#F57C00' : 'var(--color-border)', color: points >= 1000 ? 'white' : 'var(--color-text-muted)', border: 'none', borderRadius: '6px', cursor: points >= 1000 ? 'pointer' : 'not-allowed' }} 
                onClick={() => handleRedeem('5% Off Taxi Rides', 1000)}
                disabled={points < 1000}
              >
                1000 Pts
              </button>
            </div>
          </div>
        </div>

        <button 
          className="btn btn-outline w-full" 
          style={{ marginTop: '32px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
          onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Celebration & Reward Modal */}
      {showRewardModal && (
        <>
          <div 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(4px)' }}
            onClick={() => setShowRewardModal(false)}
          />
          
          {/* Confetti Rain */}
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 101, pointerEvents: 'none', overflow: 'hidden' }}>
            {[...Array(40)].map((_, i) => (
              <div 
                key={i} 
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                  backgroundColor: ['#F57C00', '#4CAF50', '#2196F3', '#E91E63', '#FFC107'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>

          <div 
            className="bounce-in-anim"
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: '32px', borderRadius: '24px',
              width: '90%', maxWidth: '360px',
              zIndex: 105,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              textAlign: 'center'
            }}
          >
            {/* Celebration Icon */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
              <div className="celebration-burst" style={{ position: 'absolute', top: '-10px', left: '-10px', right: '-10px', bottom: '-10px', backgroundColor: '#F57C00', borderRadius: '50%', opacity: 0.2, zIndex: -1 }} />
              <div style={{ padding: '20px', backgroundColor: '#FFF3E0', borderRadius: '50%', color: '#F57C00' }}>
                <Gift size={48} />
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: '#333' }}>Reward Redeemed!</h2>
            <p className="text-sm text-muted" style={{ marginBottom: '24px' }}>You've successfully claimed {rewardDetails?.title}.</p>
            
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '2px dashed #CBD5E1', marginBottom: '24px' }}>
              <p className="text-xs text-muted" style={{ marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Your Unique Code</p>
              <div className="flex items-center justify-center gap-2">
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '2px' }}>{promoCode}</span>
                <Copy 
                  size={20} 
                  color="var(--color-text-muted)" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    navigator.clipboard.writeText(promoCode);
                  }}
                />
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              onClick={() => setShowRewardModal(false)}
            >
              Awesome!
            </button>
          </div>
        </>
      )}

      {/* Global simple animations for the celebration */}
      <style>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: translate(-50%, -40%) scale(0.9); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .bounce-in-anim {
          animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes burst {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        .celebration-burst {
          animation: burst 1s ease-out infinite;
        }

        @keyframes pulsePoint {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); color: var(--color-danger); }
          100% { transform: scale(1); }
        }
        .pulse-anim {
          animation: pulsePoint 0.5s ease-in-out;
        }
        
        @keyframes confettiFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          top: -10px;
          width: 10px;
          height: 20px;
          opacity: 0;
          animation: confettiFall linear infinite backwards;
        }
      `}</style>
    </div>
  );
}
