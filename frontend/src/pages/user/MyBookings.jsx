import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Filter } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Chatbot from '../../components/chatbot/Chatbot';
import { bookingAPI } from '../../api';

const statusOptions = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'];

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getMyBookings().then(({ data }) => {
      const b = data.data.bookings || [];
      setBookings(b);
      setFiltered(b);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') setFiltered(bookings);
    else setFiltered(bookings.filter(b => b.status === statusFilter));
  }, [statusFilter, bookings]);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#e2e8f0' }}>My Bookings</h1>
            <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px' }}>Track and manage all your service bookings</p>
          </div>
          <Link to="/services"><button className="btn-primary">+ New Booking</button></Link>
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {statusOptions.map((s) => (
            <button key={s} id={`filter-${s}`} onClick={() => setStatusFilter(s)}
              style={{
                padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                border: `1px solid ${statusFilter === s ? '#6366f1' : '#2e2e3e'}`,
                background: statusFilter === s ? 'rgba(99,102,241,0.15)' : '#22222e',
                color: statusFilter === s ? '#818cf8' : '#64748b', cursor: 'pointer',
                textTransform: 'capitalize',
              }}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="shimmer" style={{ height: '92px', borderRadius: '14px' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <Calendar size={48} color="#2e2e3e" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No bookings found</p>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              {statusFilter !== 'all' ? `No ${statusFilter} bookings` : "You haven't made any bookings yet"}
            </p>
            <Link to="/services"><button className="btn-primary">Browse Services</button></Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((b) => (
              <div key={b._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(99,102,241,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                    {b.serviceId?.icon || '🔧'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: '#e2e8f0', fontSize: '15px' }}>{b.serviceId?.name || 'Service'}</span>
                      <span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                      <span>📅 {new Date(b.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>🕐 {b.scheduledTime}</span>
                      <span>📍 {b.address?.city}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#475569', marginTop: '3px', fontFamily: 'monospace' }}>Ref: {b.bookingNumber}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>₹{b.amount}</span>
                  <span className={`badge badge-${b.paymentStatus}`}>{b.paymentStatus}</span>
                  {b.status === 'completed' && !b.isReviewed && (
                    <button style={{ padding: '5px 12px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '8px', color: '#a78bfa', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                      ⭐ Leave Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
};

export default MyBookings;
