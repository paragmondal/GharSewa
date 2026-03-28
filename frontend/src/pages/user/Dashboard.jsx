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
    { icon: Calendar, label: t('totalBookings'), value: bookings.length, color: 'var(--c-primary)' },
    { icon: CheckCircle, label: t('completed'), value: bookings.filter(b => b.status === 'completed').length, color: 'var(--c-success)' },
    { icon: Clock, label: t('pending'), value: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length, color: 'var(--c-warning)' },
    { icon: Star, label: t('reviewsGiven'), value: bookings.filter(b => b.isReviewed).length, color: 'var(--c-secondary)' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  const upcomingBooking = bookings.find(b => b.status === 'pending' || b.status === 'confirmed');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"Manrope", "Inter", sans-serif' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '40px 48px', boxSizing: 'border-box', minWidth: 0, flex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Welcome Text */}
        <div className="fade-in" style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--c-text)', letterSpacing: '-0.02em', margin: 0 }}>
             {getGreeting()}, <span style={{ color: 'var(--c-primary)' }}>{user?.name?.split(' ')[0]}</span>.
          </h1>
          <p style={{ color: 'var(--c-text-muted)', marginTop: '8px', fontSize: '16px', fontWeight: '400' }}>
            Welcome to your digital concierge. Your home is running smoothly.
          </p>
        </div>

        {/* Hero Upcoming Booking (Lumina Noir Glassmorphism) */}
        {upcomingBooking ? (
          <div className="fade-in" style={{ marginBottom: '48px', position: 'relative', overflow: 'hidden', padding: '32px 40px', background: 'color-mix(in srgb, var(--c-surface-2) 60%, transparent)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', border: '1px solid color-mix(in srgb, var(--c-primary) 15%, transparent)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ zIndex: 10, position: 'relative' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'color-mix(in srgb, var(--c-primary) 15%, transparent)', padding: '6px 14px', borderRadius: '30px', color: 'var(--c-primary)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '16px' }}>
                <Zap size={14} /> UPCOMING SERVICE
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--c-text)', margin: '0 0 8px 0' }}>
                {upcomingBooking.serviceId?.name || 'Professional Service'}
              </h2>
              <p style={{ color: 'var(--c-text-muted)', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Calendar size={16} /> 
                {new Date(upcomingBooking.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {upcomingBooking.scheduledTime}
              </p>
            </div>
            <div style={{ zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
              {statusBadge(upcomingBooking.status)}
              <Link to="/bookings">
                <button className="btn-primary" style={{ padding: '12px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', boxShadow: '0 8px 20px color-mix(in srgb, var(--c-primary) 30%, transparent)', transition: 'all 0.2s' }}>
                  Manage Booking
                </button>
              </Link>
            </div>
            {/* Soft Glow Effect */}
            <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, color-mix(in srgb, var(--c-primary) 15%, transparent) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 1, pointerEvents: 'none' }} />
          </div>
        ) : (
           <div className="fade-in" style={{ marginBottom: '48px', position: 'relative', overflow: 'hidden', padding: '40px', background: 'color-mix(in srgb, var(--c-surface-2) 40%, transparent)', borderRadius: '24px', border: '1px solid var(--c-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--c-text)', margin: '0 0 8px 0' }}>No active bookings</h2>
                <p style={{ color: 'var(--c-text-muted)', fontSize: '15px', margin: 0 }}>Your schedule is completely clear. Need assistance?</p>
              </div>
              <Link to="/services">
                <button className="btn-secondary" style={{ padding: '12px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '600' }}>
                  Browse Services
                </button>
              </Link>
           </div>
        )}

        {/* Analytics Tonal Layering Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '56px' }} className="fade-in">
          {stats.map((stat, idx) => (
            <div key={stat.label} style={{ background: 'var(--c-surface)', borderRadius: '20px', padding: '24px', animationDelay: `${idx * 0.1}s`, display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `color-mix(in srgb, ${stat.color} 10%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={24} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--c-text)', lineHeight: '1', margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', fontWeight: '500', marginTop: '6px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Services Grid (Luminous Edges) */}
        <div style={{ marginBottom: '56px' }} className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--c-text)', margin: 0 }}>Available Services</h2>
            <Link to="/services" style={{ color: 'var(--c-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Catalog <ArrowRight size={16} />
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {services.slice(0, 4).map((svc) => (
              <Link key={svc._id} to={`/book/${svc._id}`} style={{ textDecoration: 'none' }}>
                <div className="card-lumina" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', filter: 'drop-shadow(0 4px 12px color-mix(in srgb, var(--c-primary) 30%, transparent))', marginBottom: '16px' }}>{svc.icon}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text)', margin: '0 0 8px 0' }}>{svc.name}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--c-primary-light)', fontWeight: '600', margin: 0 }}>Est. ₹{svc.basePrice}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent History */}
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--c-text)', margin: 0 }}>{t('recentBookings')}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.length === 0 && !loading && (
              <p style={{ color: 'var(--c-text-muted)', fontSize: '15px' }}>No booking history found.</p>
            )}
            {bookings.map((b) => (
               <div key={b._id} style={{ background: 'var(--c-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderRadius: '16px', borderBottom: '1px solid var(--c-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ fontSize: '28px', background: 'var(--c-surface-2)', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px' }}>
                      {b.serviceId?.icon || '⚙️'}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', color: 'var(--c-text)', fontSize: '16px', margin: '0 0 4px 0' }}>{b.serviceId?.name || 'Service'}</p>
                      <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                        <span style={{ color: 'var(--c-primary)' }}>#{b.bookingNumber}</span> • 
                        {new Date(b.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text)' }}>₹{b.amount}</span>
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
