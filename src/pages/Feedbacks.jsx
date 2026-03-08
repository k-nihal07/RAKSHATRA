import React from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Feedbacks() {
  const navigate = useNavigate();

  return (
    <div className="flex-col" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="flex items-center gap-4" style={{ padding: '20px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <ArrowLeft size={24} onClick={() => navigate('/provider')} style={{ cursor: 'pointer' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Feedbacks & Ratings</h2>
      </div>
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', opacity: 0.6 }}>
        <MessageSquare size={48} style={{ marginBottom: '16px' }} />
        <h3>No Feedback Yet</h3>
        <p className="text-sm text-center" style={{ marginTop: '8px' }}>Reviews from travelers you assist will appear here.</p>
      </div>
    </div>
  );
}
