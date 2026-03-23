import { useState, useEffect } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Chatbot from '../../components/chatbot/Chatbot';
import { bookingAPI } from '../../api';

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    bookingAPI.getProviderBookings()
      .then(res => setBookings(res.data.data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await bookingAPI.updateStatus(bookingId, status);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
    } catch {}
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const statusBadge = (status) => (
    <span className={`badge badge-${status}`}>{status.replace('_', ' ')}</span>
  );

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '32px 40px', boxSizing: 'border-box', minWidth: 0, flex: 1 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div className="card hero-gradient fade-in" style={{ padding: '32px 40px', borderRadius: '24px', marginBottom: '32px', border: '1px solid var(--c-primary-light)', position: 'relative', overflow: 'hidden' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--c-text)', margin: 0 }}>My Bookings</h1>
            <p style={{ color: 'var(--c-text-muted)', marginTop: '8px', fontSize: '15px' }}>Manage and update the status of incoming and ongoing service requests.</p>
            <div style={{ position: 'absolute', right: '5%', top: '-20%', opacity: 0.1, pointerEvents: 'none' }}>
              <Calendar size={180} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
            {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'rejected'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                style={{ 
                  padding: '8px 16px', borderRadius: '12px', 
                  background: filter === f ? 'var(--c-primary)' : 'var(--c-surface)', 
                  color: filter === f ? 'white' : 'var(--c-text)', 
                  border: `1px solid ${filter === f ? 'var(--c-primary)' : 'var(--c-border)'}`, 
                  cursor: 'pointer', fontWeight: '700', textTransform: 'capitalize', transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3, 4].map(i => <div key={i} className="shimmer card" style={{ height: '100px', borderRadius: '16px' }} />)}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="card fade-in" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '24px', background: 'transparent', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--c-border)' }}>
              <Calendar size={48} color="var(--c-text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ color: 'var(--c-text)', fontSize: '18px', fontWeight: '800' }}>No bookings found</p>
              <p style={{ color: 'var(--c-text-muted)', fontSize: '14px', marginTop: '8px' }}>You don't have any bookings matching the "{filter}" status.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredBookings.map((b) => (
                <div key={b._id} className="card glass fade-in" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderRadius: '16px' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ fontSize: '36px', background: 'var(--c-surface-2)', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: '1px solid var(--c-border)' }}>
                      {b.serviceId?.icon || '🔧'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '800', color: 'var(--c-text)', fontSize: '18px' }}>{b.serviceId?.name}</span>
                        {statusBadge(b.status)}
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--c-text-muted)', margin: 0 }}>
                        <span style={{ fontWeight: '700', color: 'var(--c-text)' }}>{b.userId?.name}</span> • {new Date(b.scheduledDate).toLocaleDateString('en-IN')} at {b.scheduledTime}
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', marginTop: '4px', margin: 0 }}>
                        📍 {b.address?.city}, {b.address?.street}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <span style={{ fontWeight: '800', color: 'var(--c-text)', fontSize: '20px' }}>₹{b.amount}</span>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {b.status === 'confirmed' && (
                        <>
                          <button onClick={() => handleStatusUpdate(b._id, 'in_progress')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}>Start Job</button>
                          <button onClick={() => handleStatusUpdate(b._id, 'rejected')} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '8px 16px', fontSize: '13px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Reject</button>
                        </>
                      )}
                      
                      {b.status === 'in_progress' && (
                        <button onClick={() => handleStatusUpdate(b._id, 'completed')} style={{ background: 'var(--c-success)', color: 'white', border: 'none', padding: '8px 16px', fontSize: '13px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={14} /> Complete
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default ProviderBookings;
