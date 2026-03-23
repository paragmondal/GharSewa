import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Star, ArrowRight, Zap } from 'lucide-react';
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

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '32px 40px', boxSizing: 'border-box', minWidth: 0, flex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Banner Header */}
        <div className="card hero-gradient fade-in" style={{ marginBottom: '32px', position: 'relative', overflow: 'hidden', padding: '32px 40px', border: '1px solid var(--c-primary-light)', borderRadius: '24px' }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--c-text)', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
              {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}!</span> 👋
            </h1>
            <p style={{ color: 'var(--c-text-muted)', marginTop: '8px', fontSize: '15px', maxWidth: '600px', lineHeight: '1.6' }}>
              {t('overview')} {t('welcomeMessage', '')}
            </p>
            <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
               <Link to="/services" style={{ textDecoration: 'none' }}>
                 <button className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}>{t('bookAService')} <ArrowRight size={16} /></button>
               </Link>
            </div>
          </div>
          <div style={{ position: 'absolute', right: '-2%', top: '-30%', opacity: 0.08, zIndex: 1, pointerEvents: 'none' }}>
             <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop" style={{ width: '400px', height: '400px', objectFit: 'cover', borderRadius: '50%', filter: 'blur(20px)' }} />
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }} className="fade-in">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px 20px', animationDelay: `${idx * 0.1}s`, borderRadius: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `color-mix(in srgb, ${stat.color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <stat.icon size={26} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--c-text)', lineHeight: '1.1', margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: '14px', color: 'var(--c-text-muted)', fontWeight: '600', marginTop: '4px' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Available Services Section */}
        <div style={{ marginBottom: '40px' }} className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--c-text)', margin: 0 }}>{t('availableServices')}</h2>
            <Link to="/services" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--c-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>
              {t('viewAll')} <ArrowRight size={16} />
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="shimmer card" style={{ height: '160px', borderRadius: '20px' }} />)
            ) : (
              services.slice(0, 4).map((svc) => (
                <Link key={svc._id} to={`/book/${svc._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card glass" style={{ textAlign: 'center', cursor: 'pointer', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', borderRadius: '20px', height: '100%' }}>
                    <div style={{ fontSize: '48px', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.12))', lineHeight: 1 }}>{svc.icon}</div>
                    <div style={{ marginTop: '4px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--c-text)', margin: 0 }}>{svc.name}</h3>
                      <p style={{ fontSize: '14px', color: 'var(--c-primary)', fontWeight: '800', marginTop: '6px' }}>₹{svc.basePrice}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--c-text)', margin: 0 }}>{t('recentBookings')}</h2>
            <Link to="/bookings" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--c-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>
              {t('viewAll')} <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2].map(i => <div key={i} className="shimmer card" style={{ height: '90px', borderRadius: '16px' }} />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--c-border)', borderRadius: '20px', background: 'transparent' }}>
              <div style={{ background: 'var(--c-surface)', padding: '16px', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Calendar size={32} color="var(--c-text-muted)" />
              </div>
              <p style={{ color: 'var(--c-text)', fontSize: '18px', fontWeight: '800', margin: 0 }}>{t('noBookingsYet')}</p>
              <p style={{ color: 'var(--c-text-muted)', fontSize: '14px', marginTop: '8px', marginBottom: '24px' }}>Book your first service and it will appear here.</p>
              <Link to="/services">
                <button className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}>{t('bookAService')}</button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((b) => (
                <div key={b._id} className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ fontSize: '32px', background: 'var(--c-surface-2)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: '1px solid var(--c-border)' }}>
                      {b.serviceId?.icon || '🔧'}
                    </div>
                    <div>
                      <p style={{ fontWeight: '800', color: 'var(--c-text)', fontSize: '16px', margin: '0 0 6px 0' }}>{b.serviceId?.name || 'Service'}</p>
                      <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                        <span style={{ color: 'var(--c-primary)' }}>#{b.bookingNumber}</span> • 
                        <Calendar size={12} /> {new Date(b.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--c-text)' }}>₹{b.amount}</span>
                    </div>
                    {statusBadge(b.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default UserDashboard;
