import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, Navigation, Image as ImageIcon } from 'lucide-react';

export default function PlacesToExplore() {
  const navigate = useNavigate();

  const places = [
    { id: 1, name: 'Lalbagh Botanical Garden', type: 'Attraction', dist: '3.0 km', img: 'https://images.unsplash.com/photo-1596422846543-75c6fa2fde78?auto=format&fit=crop&w=800&q=80', desc: 'Historic 240-acre botanical garden with a glasshouse.' },
    { id: 2, name: 'Bangalore Palace', type: 'Landmark', dist: '5.2 km', img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', desc: 'Tudor-style palace with elegant interior & grounds.' },
    { id: 3, name: 'Cubbon Park', type: 'Park', dist: '1.5 km', img: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=80', desc: 'Sprawling park with bamboo groves and historic buildings.' },
    { id: 4, name: 'Nandi Hills', type: 'Landmark', dist: '60 km', img: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=800&q=80', desc: 'Ancient hill fortress known for spectacular sunrise views.' },
  ];

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '100px' }}>

      {/* App Bar */}
      <div className="flex items-center justify-between" style={{ padding: '20px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-4">
          <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Explore Places</h2>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div className="flex-col gap-4">
          {places.map(place => (
            <div key={place.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={place.img} alt={place.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }} className="flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{place.name}</h3>
                    <p className="text-xs text-muted">{place.type} • {place.dist}</p>
                  </div>
                </div>

                <p className="text-sm" style={{ margin: '8px 0' }}>{place.desc}</p>

                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => navigate('/planner', { state: { dest: place.name } })}
                >
                  <Navigation size={16} /> Navigate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
