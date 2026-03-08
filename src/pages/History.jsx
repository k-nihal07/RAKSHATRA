import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Star, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Service Provider', serviceType: 'Transport' });

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  const isHotel = user.serviceType === 'Hotel/Accommodation';

  const hotelHistory = [
    { id: 1, type: 'Room Booked', date: 'Oct 12, 2024', user: 'Amit R.', amount: '₹2,500', rating: 5 },
    { id: 2, type: 'Room Booked', date: 'Oct 10, 2024', user: 'Priya K.', amount: '₹5,000', rating: 4.8 },
    { id: 3, type: 'Verification', date: 'Oct 08, 2024', user: 'Rahul S.', amount: 'N/A', rating: null },
  ];

  const transportHistory = [
    { id: 1, type: 'Ride Completed', date: 'Oct 14, 2024', dest: 'Bengaluru Airport', amount: '₹850', rating: 4.9 },
    { id: 2, type: 'Ride Completed', date: 'Oct 13, 2024', dest: 'MG Road', amount: '₹120', rating: 5 },
    { id: 3, type: 'SOS Responded', date: 'Oct 05, 2024', dest: 'Indiranagar', amount: 'Community Points', rating: null },
  ];

  const historyData = isHotel ? hotelHistory : transportHistory;

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="flex items-center gap-4" style={{ padding: '20px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <ArrowLeft size={24} onClick={() => navigate('/provider')} style={{ cursor: 'pointer' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Service History</h2>
      </div>
      
      <div style={{ padding: '20px' }}>
        {historyData.length > 0 ? (
          <div className="flex-col gap-4">
            {historyData.map((item) => (
              <div key={item.id} className="card flex-col gap-2" style={{ borderLeft: `4px solid ${item.type.includes('SOS') ? 'var(--color-danger)' : 'var(--color-primary)'}` }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontWeight: 600, fontSize: '1rem' }}>{item.type}</span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Calendar size={12} /> {item.date}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2 text-sm">
                    {isHotel ? (
                      <>
                        <CheckCircle size={16} color="var(--color-secondary)" />
                        <span>Guest: {item.user}</span>
                      </>
                    ) : (
                      <>
                        <MapPin size={16} color="var(--color-text-muted)" />
                        <span>{item.dest}</span>
                      </>
                    )}
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{item.amount}</span>
                </div>

                {item.rating && (
                  <div className="flex items-center gap-1 mt-2 text-sm" style={{ color: '#F57C00', fontWeight: 600, backgroundColor: '#FFF3E0', padding: '4px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}>
                    <Star size={14} fill="#F57C00" /> {item.rating} Rating
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', opacity: 0.6 }}>
            <Clock size={48} style={{ marginBottom: '16px' }} />
            <h3>No Past History Yet</h3>
            <p className="text-sm text-center" style={{ marginTop: '8px' }}>Your completed requests and trips will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
