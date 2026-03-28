import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Star, ArrowRight, Zap, TrendingUp, MapPin } from 'lucide-react';
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
    { icon: Activity, label: t('totalBookings'), value: bookings.length, color: 'var(--c-primary)' },
    { icon: CheckCircle, label: t('completed'), value: bookings.filter(b => b.status === 'completed').length, color: 'var(--c-success)' },
    { icon: Clock, label: t('pending'), value: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length, color: 'var(--c-warning)' },
  ];

  const upcomingBooking = bookings.find(b => b.status === 'pending' || b.status === 'confirmed');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"Manrope", "Inter", sans-serif' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '48px 64px', boxSizing: 'border-box', minWidth: 0, flex: 1, position: 'relative' }}>
        
        {/* Ambient Page Glow */}
        <div style={{ position: 'fixed', top: '-10%', left: '25%', width: '800px', height: '800px', background: 'radial-gradient(circle, color-mix(in srgb, var(--c-primary) 8%, transparent) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Hero Upcoming Booking (Absolute Premium Lumina Glassmorphism) */}
        {upcomingBooking ? (
          <div className="fade-in" style={{ marginBottom: '64px', position: 'relative', overflow: 'hidden', padding: '48px 56px', background: 'color-mix(in srgb, var(--c-surface-2) 40%, transparent)', backdropFilter: 'blur(60px)', WebkitBackdropFilter: 'blur(60px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ zIndex: 10, position: 'relative' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'color-mix(in srgb, var(--c-primary) 15%, transparent)', padding: '6px 14px', borderRadius: '30px', color: 'var(--c-primary)', fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '20px', border: '1px solid color-mix(in srgb, var(--c-primary) 30%, transparent)' }}>
                <Zap size={14} /> ACTIVE DISPATCH
              </div>
              <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#ffffff', margin: '0 0 12px 0', letterSpacing: '-0.02em', textShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
                {upcomingBooking.serviceId?.name || 'Professional Service'}
              </h2>
              <p style={{ color: 'var(--c-text-muted)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: '500' }}>
                <Calendar size={20} color="var(--c-primary)" /> 
                Scheduled for {new Date(upcomingBooking.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {upcomingBooking.scheduledTime}
              </p>
            </div>
            <div style={{ zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '24px' }}>
              {statusBadge(upcomingBooking.status)}
              <Link to="/bookings">
                <button style={{ background: 'linear-gradient(135deg, var(--c-primary), #4f46e5)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 36px', borderRadius: '16px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 12px 30px color-mix(in srgb, var(--c-primary) 40%, transparent)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  Manage Appointment
                </button>
              </Link>
            </div>
            {/* Extremely soft dynamic glow */}
            <div style={{ position: 'absolute', bottom: '-40%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, color-mix(in srgb, var(--c-primary) 20%, transparent) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 1, pointerEvents: 'none' }} />
          </div>
        ) : (
           <div className="fade-in" style={{ marginBottom: '64px', padding: '0' }}>
              <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em', margin: '0 0 12px 0' }}>
                 Welcome back, <span style={{ background: 'linear-gradient(135deg, var(--c-primary), #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}</span>.
              </h1>
              <p style={{ color: 'var(--c-text-muted)', fontSize: '18px', margin: 0, maxWidth: '600px', lineHeight: 1.6 }}>
                Your digital concierge is online. Let us secure your home with elite professional services today.
              </p>
           </div>
        )}

        {/* 3-Column Premium Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
          
          {/* Main Services Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Services Grid (Cinematic Edges) */}
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>Service Catalog</h2>
                <Link to="/services" style={{ color: 'var(--c-text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#ffffff'} onMouseOut={e=>e.currentTarget.style.color='var(--c-text-muted)'}>
                  View Catalog <ArrowRight size={16} />
                </Link>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {services.slice(0, 4).map((svc) => (
                  <Link key={svc._id} to={`/book/${svc._id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'linear-gradient(145deg, var(--c-surface), var(--c-bg))', padding: '32px', borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '24px' }} 
                         onMouseOver={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.4)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(99,102,241,0.15)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.querySelector('.svc-icon').style.transform = 'scale(1.1)'; }}
                         onMouseOut={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.03)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.querySelector('.svc-icon').style.transform = 'scale(1)'; }}>
                      <div className="svc-icon" style={{ fontSize: '48px', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 2 }}>{svc.icon}</div>
                      <div style={{ zIndex: 2 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>{svc.name}</h3>
                        <p style={{ fontSize: '14px', color: 'var(--c-primary)', fontWeight: '700', margin: 0 }}>Starting at ₹{svc.basePrice}</p>
                      </div>
                      <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', fontSize: '120px', opacity: 0.03, filter: 'blur(2px)', pointerEvents: 'none' }}>{svc.icon}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent History */}
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>Recent Intelligence</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.length === 0 && !loading && (
                  <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px' }}>
                    <p style={{ color: 'var(--c-text-muted)', fontSize: '15px', fontWeight: '500' }}>No historical data found. Dispatch a service to generate records.</p>
                  </div>
                )}
                {bookings.map((b) => (
                   <div key={b._id} style={{ background: 'var(--c-surface)', padding: '24px 32px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s', border: '1px solid rgba(255,255,255,0.02)' }} onMouseOver={e=>e.currentTarget.style.background='var(--c-surface-2)'} onMouseOut={e=>e.currentTarget.style.background='var(--c-surface)'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ fontSize: '24px', background: 'var(--c-bg)', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                          {b.serviceId?.icon || '⚙️'}
                        </div>
                        <div>
                          <p style={{ fontWeight: '800', color: '#ffffff', fontSize: '16px', margin: '0 0 6px 0' }}>{b.serviceId?.name || 'Service'}</p>
                          <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: '500' }}>
                            <span style={{ color: 'var(--c-primary)', background: 'color-mix(in srgb, var(--c-primary) 15%, transparent)', padding: '2px 8px', borderRadius: '6px' }}>#{b.bookingNumber}</span>
                            {new Date(b.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>₹{b.amount}</span>
                        </div>
                        {statusBadge(b.status)}
                      </div>
                    </div>
                ))}
              </div>
            </div>

          </div>

          {/* Side Analytics Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>Metrics</h2>
            {stats.map((stat, idx) => (
              <div key={stat.label} className="fade-in" style={{ background: 'linear-gradient(180deg, var(--c-surface), var(--c-surface-2))', borderRadius: '24px', padding: '32px', animationDelay: `${idx * 0.1}s`, border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `color-mix(in srgb, ${stat.color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid color-mix(in srgb, ${stat.color} 20%, transparent)` }}>
                    <stat.icon size={24} color={stat.color} />
                  </div>
                  <TrendingUp size={20} color="var(--c-text-muted)" opacity={0.5} />
                </div>
                <div>
                  <p style={{ fontSize: '48px', fontWeight: '800', color: '#ffffff', lineHeight: '1', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>{stat.value}</p>
                  <p style={{ fontSize: '14px', color: 'var(--c-text-muted)', fontWeight: '700', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                </div>
              </div>
            ))}
            
            <div className="fade-in" style={{ background: 'color-mix(in srgb, var(--c-primary) 10%, transparent)', borderRadius: '24px', padding: '32px', border: '1px solid color-mix(in srgb, var(--c-primary) 30%, transparent)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animationDelay: '0.4s', marginTop: '24px' }}>
               <ShieldCheck size={48} color="var(--c-primary)" style={{ filter: 'drop-shadow(0 8px 16px rgba(99,102,241,0.4))', marginBottom: '16px' }} />
               <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px 0' }}>GharSewa Guarantee</h3>
               <p style={{ fontSize: '14px', color: 'var(--c-primary-light)', margin: 0, lineHeight: 1.5, opacity: 0.8 }}>Every service is backed by our 100% satisfaction promise and verified professionals.</p>
            </div>
          </div>
          
        </div>

        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default UserDashboard;
