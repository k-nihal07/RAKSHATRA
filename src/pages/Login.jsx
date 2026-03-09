import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Globe, Briefcase, User, MapPin, Mail, Lock } from 'lucide-react';

// Firebase Imports
import { auth, db } from '../firebase';
import digilockerImage from '../assets/digilocker.png';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('traveler');
  const [loading, setLoading] = useState(false);

  // Form states
  const [serviceType, setServiceType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [digilockerVerified, setDigilockerVerified] = useState(false);

  // Helper to prevent Firestore from hanging indefinitely if the db isn't created yet
  const withTimeout = (promise, ms = 5000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
    ]);
  };

  const handleAuth = async (e, mode) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill in email and password");

    setLoading(true);
    try {
      let userCredential;
      let userData;

      if (mode === 'login') {
        // Handle Login
        userCredential = await signInWithEmailAndPassword(auth, email, password);

        userData = { role: activeTab, email: email, name: "Guest", uid: userCredential.user.uid }; // Default fallback
        try {
          // Fetch user document to get their previously registered role, etc.
          const docSnap = await withTimeout(getDoc(doc(db, "users", userCredential.user.uid)), 5000);
          if (docSnap.exists()) {
            userData = docSnap.data();
          }
        } catch (dbError) {
          console.warn("Firestore taking too long or Failed:", dbError);
        }
      } else {
        // Handle Registration
        if (activeTab === 'provider') {
          if (!serviceType) {
            alert("Please select a service type");
            setLoading(false);
            return;
          }
          if (!digilockerVerified) {
            alert("Please verify your business with DigiLocker");
            setLoading(false);
            return;
          }
        }

        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Data format to save
        userData = {
          uid: userCredential.user.uid,
          name: name || (activeTab === 'traveler' ? 'Guest Traveler' : 'Guest Provider'),
          email: email,
          role: activeTab,
          serviceType: activeTab === 'provider' ? serviceType : null,
          location: activeTab === 'provider' ? location : null,
          createdAt: new Date().toISOString()
        };

        try {
          // Save extra details to Firestore
          await withTimeout(setDoc(doc(db, "users", userCredential.user.uid), userData), 5000);
        } catch (dbError) {
          console.warn("Firestore taking too long or Failed:", dbError);
        }
      }

      // Sync role and info to localStorage so Layout and App can display properly
      localStorage.setItem('user', JSON.stringify(userData));

      // Route based on role
      if (userData.role === 'traveler') navigate('/traveler');
      else navigate('/provider');

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      position: 'relative',
      backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: 'var(--font-family)',
    }}>

      {/* Dark overlay for better readability */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1
      }} />

      {/* Main Glassmorphism Card */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
        padding: '32px 24px',
        width: '100%',
        maxWidth: '400px',
        zIndex: 10,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        color: 'white'
      }}>

        {/* Header */}
        <div className="flex-col items-center justify-center text-center" style={{ marginBottom: '32px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
            <Globe size={24} color="#FA5A5A" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Smart Travel Guide</h1>
          </div>
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>{loading ? 'Processing...' : 'Your journey begins here'}</p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => setActiveTab('traveler')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'traveler' ? 'white' : 'transparent',
              color: activeTab === 'traveler' ? '#1A4F5A' : 'white',
              fontWeight: activeTab === 'traveler' ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Traveler
          </button>
          <button
            onClick={() => setActiveTab('provider')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'provider' ? 'white' : 'transparent',
              color: activeTab === 'provider' ? '#1A4F5A' : 'white',
              fontWeight: activeTab === 'provider' ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Service Provider
          </button>
        </div>

        {/* Forms */}
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {activeTab === 'provider' && (
            <>
              {/* Service Type Dropdown */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }}>
                  <Briefcase size={18} />
                </div>
                <select
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    appearance: 'none',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  required
                >
                  <option value="" disabled style={{ color: 'black' }}>SELECT SERVICE TYPE</option>
                  <option value="Transport" style={{ color: 'black' }}>Transport</option>
                  <option value="Hotel/Accommodation" style={{ color: 'black' }}>Hotel/Accommodation</option>
                  <option value="Local Guide" style={{ color: 'black' }}>Local Guide</option>
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7, pointerEvents: 'none' }}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Business Name */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Name or Business Name"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {activeTab === 'traveler' && (
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }}>
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }}>
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Email or Phone Number"
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }}>
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Password"
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Location & Digilocker for Provider */}
          {activeTab === 'provider' && (
            <>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }}>
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Service Location"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              {/* DigiLocker Verification Checkbox */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <input
                  type="checkbox"
                  id="digilocker"
                  checked={digilockerVerified}
                  onChange={(e) => setDigilockerVerified(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: '#008cff', cursor: 'pointer' }}
                />
                <label htmlFor="digilocker" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
                  Verify with
                  <img src={digilockerImage} alt="DigiLocker" style={{ height: '24px', backgroundColor: 'white', padding: '2px 6px', borderRadius: '4px' }} />
                </label>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              className="btn"
              disabled={loading}
              onClick={(e) => handleAuth(e, 'login')}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#0F8C8A', // Teal-ish color from image
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {loading ? 'Processing...' : 'Login'}
            </button>
            <button
              type="button"
              className="btn"
              disabled={loading}
              onClick={(e) => handleAuth(e, 'register')}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {activeTab === 'provider' ? 'Register' : 'Register Now'}
            </button>
          </div>

        </form>
      </div>

      {/* Floating SOS - Specific to Login screen per design */}
      <button
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#FA5A5A',
          color: 'white',
          border: 'none',
          borderRadius: '32px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          boxShadow: '0 8px 16px rgba(250, 90, 90, 0.4)',
          zIndex: 20,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/sos')}
      >
        <ShieldAlert size={20} /> SOS
      </button>

      {/* Custom Styles override for this pg */}
      <style>{`
        input::placeholder { color: rgba(255,255,255,0.7); }
        select { color: rgba(255,255,255,0.7); }
        select option { color: black; }
      `}</style>
    </div>
  );
}