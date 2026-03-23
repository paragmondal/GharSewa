import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, DollarSign, TrendingUp, ToggleLeft, ToggleRight } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Chatbot from '../../components/chatbot/Chatbot';
import { bookingAPI, providerAPI } from '../../api';

const statusBadge = (status) => (
  <span className={`badge badge-${status}`}>{status.replace('_', ' ')}</span>
);

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    Promise.all([
      bookingAPI.getProviderBookings(),
      providerAPI.getMyProfile(),
    ]).then(([b, p]) => {
      setBookings(b.data.data.bookings || []);
      setProvider(p.data.data.provider);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleAvailability = async () => {
    setToggling(true);
    try {
      const { data } = await providerAPI.toggleAvailability();
      setProvider(data.data.provider);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    } finally { setToggling(false); }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await bookingAPI.updateStatus(bookingId, status);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
    } catch {}
  };

  const stats = [
    { icon: DollarSign, label: 'Total Earnings', value: `₹${provider?.totalEarnings || 0}`, color: '#10b981' },
    { icon: CheckCircle, label: 'Completed Jobs', value: provider?.completedJobs || 0, color: '#6366f1' },
    { icon: Clock, label: 'Pending', value: bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length, color: '#f59e0b' },
    { icon: TrendingUp, label: 'Rating', value: `${provider?.rating?.average || 0} ⭐`, color: '#a78bfa' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#e2e8f0' }}>Provider Dashboard</h1>
            <p style={{ color: '#64748b', marginTop: '6px' }}>Manage your bookings and track earnings</p>
          </div>
          {/* Availability toggle */}
          <button
            id="toggle-availability"
            onClick={toggleAvailability}
            disabled={toggling || !provider}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              background: provider?.availability?.isAvailable ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${provider?.availability?.isAvailable ? '#10b981' : '#ef4444'}`,
              borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px',
              color: provider?.availability?.isAvailable ? '#10b981' : '#ef4444',
            }}
          >
            {provider?.availability?.isAvailable ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
            {provider?.availability?.isAvailable ? 'Available' : 'Unavailable'}
          </button>
        </div>

        {/* Approval notice */}
        {provider && !provider.isApproved && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', color: '#f59e0b', fontSize: '14px', fontWeight: '600' }}>
            ⏳ Your provider account is pending admin approval. You'll start receiving bookings once approved.
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {stats.map((stat) => (
            <div key={stat.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <stat.icon size={22} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '22px', fontWeight: '800', color: '#e2e8f0' }}>{stat.value}</p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#e2e8f0', marginBottom: '16px' }}>Incoming Bookings</h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map(i => <div key={i} className="shimmer" style={{ height: '80px', borderRadius: '12px' }} />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#64748b' }}>No bookings yet. Make sure your profile is complete and you're set to available.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bookings.map((b) => (
                <div key={b._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '20px' }}>{b.serviceId?.icon || '🔧'}</span>
                      <span style={{ fontWeight: '700', color: '#e2e8f0', fontSize: '14px' }}>{b.serviceId?.name}</span>
                      {statusBadge(b.status)}
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                      {b.userId?.name} • {new Date(b.scheduledDate).toLocaleDateString('en-IN')} at {b.scheduledTime} • {b.address?.city}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: '800', color: '#10b981', fontSize: '16px' }}>₹{b.amount}</span>
                    {b.status === 'confirmed' && (
                      <>
                        <button onClick={() => handleStatusUpdate(b._id, 'in_progress')}
                          style={{ padding: '7px 14px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#818cf8', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                          Start
                        </button>
                        <button onClick={() => handleStatusUpdate(b._id, 'rejected')}
                          style={{ padding: '7px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                          Reject
                        </button>
                      </>
                    )}
                    {b.status === 'in_progress' && (
                      <button onClick={() => handleStatusUpdate(b._id, 'completed')}
                        style={{ padding: '7px 16px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#10b981', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                        ✓ Complete
                      </button>
                    )}
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

export default ProviderDashboard;
