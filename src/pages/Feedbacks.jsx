import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Feedbacks() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "feedbacks"), where("providerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = [];
      snapshot.forEach(doc => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      fetched.sort((a, b) => b.timestamp - a.timestamp);
      setFeedbacks(fetched);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="flex items-center gap-4" style={{ padding: '20px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <ArrowLeft size={24} onClick={() => navigate('/provider')} style={{ cursor: 'pointer' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Feedbacks & Ratings</h2>
      </div>
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '60vh' }}>
        {feedbacks.length > 0 ? (
          feedbacks.map(fb => (
            <div key={fb.id} className="card" style={{ padding: '16px' }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontWeight: 600 }}>{fb.userName || 'Guest User'}</span>
                <div className="flex items-center gap-1" style={{ color: '#F57C00', fontWeight: 600 }}>
                  <Star size={16} fill="#F57C00" /> {fb.rating || 5}
                </div>
              </div>
              <p className="text-sm" style={{ opacity: 0.9 }}>"{fb.text || 'No comment provided.'}"</p>
            </div>
          ))
        ) : (
          <div className="flex-col items-center justify-center text-center opacity-60" style={{ marginTop: '40px' }}>
            <MessageSquare size={48} style={{ marginBottom: '16px' }} />
            <h3>No Feedback Yet</h3>
            <p className="text-sm text-center" style={{ marginTop: '8px' }}>Reviews from travelers you assist will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
