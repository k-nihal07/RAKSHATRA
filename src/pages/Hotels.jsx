import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Star, Phone, MapPin } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Hotels() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([
    { id: 1, name: 'Grand Horizon Hotel', price: '₹2,500/night', rating: 4.7, dist: '1.2 km', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'City Center Inn', price: '₹1,200/night', rating: 4.3, dist: '2.5 km', img: 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Lakeside Resorts', price: '₹4,000/night', rating: 4.9, dist: '4.8 km', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Budget Backpackers Hostel', price: '₹600/night', rating: 4.1, dist: '0.8 km', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80' }
  ]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "provider"),
          where("serviceType", "==", "Hotel/Accommodation")
        );
        const querySnapshot = await getDocs(q);
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
        
        setHotels(prev => [...prev, ...fetchedHotels]);
      } catch (err) {
        console.error("Failed to fetch hotels", err);
      }
    };
    fetchProviders();
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
                  <button className="btn btn-outline" style={{ flex: 1 }}><Phone size={16} /></button>
                  <button className="btn btn-primary" style={{ flex: 3 }}>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
