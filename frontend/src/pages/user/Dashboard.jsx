import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Star, ArrowRight, Zap, ShieldCheck, MapPin } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Chatbot from '../../components/chatbot/Chatbot';
import { bookingAPI, serviceAPI } from '../../api';
import useAuthStore from '../../store/authStore';
import { useTranslation } from 'react-i18next';

const statusBadge = (status) => {
  const tStatus = status.replace('_', ' ');
  return <span className={`badge badge-${status}`}>{tStatus.charAt(0).toUpperCase() + tStatus.slice(1)}</span>;
};

const UserDashboard = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingAPI.getMyBookings({ limit: 5 }),
      serviceAPI.getAll(),
    ]).then(([b, s]) => {
      setBookings(b.data.data.bookings || []);
      setServices(s.data.data.services || []);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: Calendar, label: t('totalBookings'), value: bookings.length, color: '#6366f1' },
    { icon: CheckCircle, label: t('completed'), value: bookings.filter(b => b.status === 'completed').length, color: '#10b981' },
    { icon: Clock, label: t('pending'), value: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length, color: '#f59e0b' },
    { icon: Star, label: t('reviewsGiven'), value: bookings.filter(b => b.isReviewed).length, color: '#a78bfa' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  const upcomingBooking = bookings.find(b => b.status === 'pending' || b.status === 'confirmed');

  return (
    <div style={{ display: 'flex', background: '#0B0C10', minHeight: '100vh', fontFamily: '"Manrope", "Inter", sans-serif' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '40px 48px', boxSizing: 'border-box', minWidth: 0, flex: 1, background: '#0B0C10' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Welcome Text */}
        <div className="fade-in" style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#faf8fe', letterSpacing: '-0.02em', margin: 0 }}>
             {getGreeting()}, <span style={{ color: '#6366f1' }}>{user?.name?.split(' ')[0]}</span>.
          </h1>
          <p style={{ color: '#abaab0', marginTop: '8px', fontSize: '16px', fontWeight: '400' }}>
            Welcome to your digital concierge. Your home is running smoothly.
          </p>
        </div>

        {/* Hero Upcoming Booking (Lumina Noir Glassmorphism) */}
        {upcomingBooking ? (
          <div className="fade-in" style={{ marginBottom: '48px', position: 'relative', overflow: 'hidden', padding: '32px 40px', background: 'rgba(26,27,32,0.6)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ zIndex: 10, position: 'relative' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.15)', padding: '6px 14px', borderRadius: '30px', color: '#a3a6ff', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '16px' }}>
                <Zap size={14} /> UPCOMING SERVICE
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', margin: '0 0 8px 0' }}>
                {upcomingBooking.serviceId?.name || 'Professional Service'}
              </h2>
              <p style={{ color: '#abaab0', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Calendar size={16} /> 
                {new Date(upcomingBooking.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {upcomingBooking.scheduledTime}
              </p>
            </div>
            <div style={{ zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
              {statusBadge(upcomingBooking.status)}
              <Link to="/bookings">
                <button style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 8px 20px rgba(99,102,241,0.3)', transition: 'all 0.2s' }}>
                  Manage Booking
                </button>
              </Link>
            </div>
            {/* Soft Glow Effect */}
            <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 1, pointerEvents: 'none' }} />
          </div>
        ) : (
           <div className="fade-in" style={{ marginBottom: '48px', position: 'relative', overflow: 'hidden', padding: '40px', background: 'rgba(26,27,32,0.4)', borderRadius: '24px', border: '1px solid #1e1f25', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', margin: '0 0 8px 0' }}>No active bookings</h2>
                <p style={{ color: '#abaab0', fontSize: '15px', margin: 0 }}>Your schedule is completely clear. Need assistance?</p>
              </div>
              <Link to="/services">
                <button style={{ background: '#18191e', color: '#a3a6ff', border: '1px solid rgba(99,102,241,0.3)', padding: '12px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'} onMouseOut={e => e.currentTarget.style.background = '#18191e'}>
                  Browse Services
                </button>
              </Link>
           </div>
        )}

        {/* Analytics Tonal Layering Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '56px' }} className="fade-in">
          {stats.map((stat, idx) => (
            <div key={stat.label} style={{ background: '#121318', borderRadius: '20px', padding: '24px', animationDelay: `${idx * 0.1}s`, display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `rgba(${stat.color === '#6366f1' ? '99,102,241' : stat.color === '#10b981' ? '16,185,129' : stat.color === '#f59e0b' ? '245,158,11' : '167,139,250'}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={24} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '32px', fontWeight: '700', color: '#faf8fe', lineHeight: '1', margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: '13px', color: '#abaab0', fontWeight: '500', marginTop: '6px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Services Grid (Luminous Edges) */}
        <div style={{ marginBottom: '56px' }} className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#faf8fe', margin: 0 }}>Available Services</h2>
            <Link to="/services" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Catalog <ArrowRight size={16} />
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {services.slice(0, 4).map((svc) => (
              <Link key={svc._id} to={`/book/${svc._id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#121318', padding: '32px 24px', borderRadius: '20px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '1px solid transparent', transition: 'all 0.3s ease', cursor: 'pointer' }} 
                     onMouseOver={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.5)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                     onMouseOut={e => { e.currentTarget.style.border = '1px solid transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ fontSize: '48px', filter: 'drop-shadow(0 4px 12px rgba(99,102,241,0.3))', marginBottom: '16px' }}>{svc.icon}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#faf8fe', margin: '0 0 8px 0' }}>{svc.name}</h3>
                  <p style={{ fontSize: '14px', color: '#a3a6ff', fontWeight: '600', margin: 0 }}>Est. ₹{svc.basePrice}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent History */}
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#faf8fe', margin: 0 }}>{t('recentBookings')}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.length === 0 && !loading && (
              <p style={{ color: '#abaab0', fontSize: '15px' }}>No booking history found.</p>
            )}
            {bookings.map((b) => (
               <div key={b._id} style={{ background: '#121318', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderRadius: '16px', borderBottom: '1px solid #1e1f25' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ fontSize: '28px', background: '#1a1b20', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px' }}>
                      {b.serviceId?.icon || '⚙️'}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', color: '#faf8fe', fontSize: '16px', margin: '0 0 4px 0' }}>{b.serviceId?.name || 'Service'}</p>
                      <p style={{ fontSize: '13px', color: '#abaab0', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                        <span style={{ color: '#6366f1' }}>#{b.bookingNumber}</span> • 
                        {new Date(b.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#faf8fe' }}>₹{b.amount}</span>
                    </div>
                    {statusBadge(b.status)}
                  </div>
                </div>
            ))}
          </div>
        </div>

        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default UserDashboard;
