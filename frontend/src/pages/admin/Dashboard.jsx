import { useState, useEffect } from 'react';
import { Users, Briefcase, Calendar, TrendingUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { adminAPI } from '../../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    Promise.all([
      adminAPI.getDashboard(),
      adminAPI.getProviders({ isApproved: 'false', limit: 5 }),
      adminAPI.getBookings({ limit: 8 }),
    ]).then(([s, p, b]) => {
      setStats(s.data.data);
      setProviders(p.data.data.providers || []);
      setBookings(b.data.data.bookings || []);
    }).finally(() => setLoading(false));
  }, []);

  const approveProvider = async (id) => {
    setApproving(id);
    try {
      await adminAPI.approveProvider(id);
      setProviders(prev => prev.filter(p => p._id !== id));
    } catch {} finally { setApproving(null); }
  };

  const statCards = stats ? [
    { icon: Calendar, label: 'Total Bookings', value: stats.bookings?.total || 0, color: '#6366f1' },
    { icon: CheckCircle, label: 'Completed', value: stats.bookings?.completed || 0, color: '#10b981' },
    { icon: TrendingUp, label: 'Pending', value: stats.bookings?.pending || 0, color: '#f59e0b' },
    { icon: Users, label: 'Total Users', value: stats.users || 0, color: '#a78bfa' },
    { icon: Briefcase, label: 'Providers', value: stats.providers || 0, color: '#60a5fa' },
  ] : [];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#e2e8f0' }}>Admin Dashboard</h1>
          <p style={{ color: '#64748b', marginTop: '6px' }}>Platform-wide analytics and management</p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="shimmer" style={{ height: '90px', borderRadius: '16px' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {statCards.map((s) => (
              <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div>
                  <p style={{ fontSize: '22px', fontWeight: '800', color: '#e2e8f0' }}>{s.value}</p>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Pending Provider Approvals */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', marginBottom: '14px' }}>⏳ Pending Provider Approvals</h2>
            {providers.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: '#64748b', fontSize: '14px' }}>All providers approved!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {providers.map((p) => (
                  <div key={p._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px' }}>
                    <div>
                      <p style={{ fontWeight: '700', color: '#e2e8f0', fontSize: '13px' }}>{p.userId?.name || 'Provider'}</p>
                      <p style={{ fontSize: '11px', color: '#64748b' }}>{p.skills?.join(', ')}</p>
                    </div>
                    <button
                      id={`approve-${p._id}`}
                      onClick={() => approveProvider(p._id)}
                      disabled={approving === p._id}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#10b981', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
                    >
                      {approving === p._id ? <Loader2 size={14} className="spin" /> : <CheckCircle size={14} />}
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', marginBottom: '14px' }}>📋 Recent Bookings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {bookings.map((b) => (
                <div key={b._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                  <div>
                    <p style={{ fontWeight: '700', color: '#e2e8f0', fontSize: '12px' }}>{b.bookingNumber}</p>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>{b.serviceId?.name} • {b.userId?.name}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>₹{b.amount}</span>
                    <span className={`badge badge-${b.status}`} style={{ fontSize: '10px' }}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
