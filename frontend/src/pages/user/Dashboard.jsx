import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, HelpCircle, Zap, ShieldCheck, Mail, MoreHorizontal, MessageSquare } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { bookingAPI, serviceAPI } from '../../api';
import useAuthStore from '../../store/authStore';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    Promise.all([
      bookingAPI.getMyBookings({ limit: 5 }),
      serviceAPI.getAll(),
    ]).then(([b, s]) => {
      setBookings(b.data.data.bookings || []);
      setServices(s.data.data.services || []);
    }).catch(err => console.error(err));
  }, []);

  const upcomingBooking = bookings.find(b => b.status === 'pending' || b.status === 'confirmed');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0C10', fontFamily: '"Inter", sans-serif', color: '#e2e8f0' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, padding: '32px 48px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Navbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div style={{ position: 'relative', width: '380px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search services..." 
              style={{ width: '100%', background: '#13141b', border: '1px solid #1e202b', borderRadius: '30px', padding: '12px 16px 12px 44px', color: '#fff', fontSize: '14px', outline: 'none' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="#94a3b8" />
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }} />
            </div>
            <HelpCircle size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #1e202b', paddingLeft: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>{user?.name || 'Customer'}</p>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Premium Member</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e202b, #2d303f)', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontWeight: '700', fontSize: '16px' }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
          
          {/* Main Left Column */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Immediate Attention Hero */}
            <section>
              <h3 style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Immediate Attention</h3>
              <div style={{ background: '#1c1d24', borderRadius: '24px', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #2a2b36' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ width: '64px', height: '64px', background: '#252630', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ filter: 'drop-shadow(0 0 8px rgba(129,140,248,0.5))' }}>
                      <Zap size={28} color="#818cf8" />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>CONFIRMED</span>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>Upcoming Today</span>
                    </div>
                    {upcomingBooking ? (
                      <>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>{upcomingBooking.serviceId?.name} Pro arriving at {upcomingBooking.scheduledTime}</h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>Standard Visit • ID: GS-{upcomingBooking.bookingNumber.substring(0,6)}</p>
                      </>
                    ) : (
                       <>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>Master Electrician arriving at 2:00 PM</h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>Full-Home Safety Inspection • Appointment ID: GS-9921</p>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button style={{ background: '#252630', color: '#e2e8f0', border: '1px solid #333440', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#333440'} onMouseOut={e=>e.currentTarget.style.background='#252630'}>
                    Reschedule
                  </button>
                  <button style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', color: '#0f1015', border: 'none', padding: '12px 32px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(129,140,248,0.3)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                    Track Pro
                  </button>
                </div>
              </div>
            </section>

            {/* Available Services */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#f8fafc' }}>Available Services</h2>
                <Link to="/services" style={{ fontSize: '12px', fontWeight: '700', color: '#818cf8', textDecoration: 'none', letterSpacing: '0.05em' }}>VIEW ALL</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {/* Fallback to Mockup data if real services aren't loaded yet to guarantee pixel-perfect match */}
                {[
                  { title: 'Plumbing', sub: 'Expert leak repairs, pipe fittings, and fixture installation.', price: '$45/HR', icon: 'wrench' },
                  { title: 'Deep Cleaning', sub: 'Premium sanitation for luxury residences and smart homes.', price: '$35/HR', icon: 'spray' },
                  { title: 'Interior Painting', sub: 'Precision finishes and premium paint selection services.', price: '$65/HR', icon: 'paint' }
                ].map((mock, idx) => {
                  const realSvc = services[idx];
                  return (
                  <div key={idx} style={{ background: '#121318', border: '1px solid #1f2029', borderRadius: '24px', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px', transition: 'border-color 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.borderColor='#333440'} onMouseOut={e=>e.currentTarget.style.borderColor='#1f2029'}>
                    <div style={{ width: '40px', height: '40px', background: '#1f2029', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#a78bfa' }}>
                       {realSvc ? realSvc.icon : (mock.icon === 'wrench' ? '🔧' : mock.icon === 'spray' ? '🧽' : '🖌️')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f8fafc', margin: '0 0 12px 0' }}>{realSvc ? realSvc.name : mock.title}</h3>
                      <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>{realSvc ? realSvc.description?.substring(0, 65)+'...' : mock.sub}</p>
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: 0 }}>FROM {realSvc ? '₹'+realSvc.basePrice : mock.price}</p>
                  </div>
                  )
                })}
              </div>
            </section>

            {/* Bottom Two Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
               <div style={{ background: '#121318', border: '1px solid #1f2029', borderRadius: '24px', padding: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '80px', background: '#1f2029', borderRadius: '16px', overflow: 'hidden' }}>
                    <img src="https://images.unsplash.com/photo-1556910103-1c02745a872)F?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Kitchen" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} onError={(e) => { e.target.style.display='none'; e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#6366f1">🍳</div>'; }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', letterSpacing: '0.1em', margin: '0 0 8px 0' }}>MONTHLY FEATURED</p>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: '0 0 8px 0', lineHeight: 1.3 }}>Smart Kitchen<br/>Maintenance Suite</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>Comprehensive care for high-end appliances and custom cabinetry.</p>
                    <a href="#" style={{ color: '#fff', fontSize: '13px', fontWeight: '600', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Explore Package</a>
                  </div>
               </div>
               
               <div style={{ background: '#121318', border: '1px solid #1f2029', borderRadius: '24px', padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                 <div style={{ width: '48px', height: '48px', background: '#064e3b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                   <ShieldCheck size={24} color="#34d399" />
                 </div>
                 <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: '0 0 8px 0' }}>Elite Guarantee</h3>
                 <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5, maxWidth: '200px' }}>All services insured up to $10M for your total peace of mind.</p>
               </div>
            </div>

          </div>

          {/* Right Column / Sidebar Metrics */}
          <div style={{ width: '340px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Top Professionals */}
            <div style={{ background: '#121318', border: '1px solid #1f2029', borderRadius: '24px', padding: '32px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: 0 }}>Top Professionals</h3>
                <MoreHorizontal size={20} color="#64748b" style={{ cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { name: 'Marcus Sterling', role: 'SENIOR ELECTRICIAN', rating: '4.9', face: '👨🏿‍🦱' },
                  { name: 'Elena Vance', role: 'MASTER INTERIOR DECOR', rating: '5.0', face: '👩🏼' },
                  { name: 'David Kim', role: 'PLUMBING SPECIALIST', rating: '4.8', face: '👨🏻' },
                ].map((pro, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ width: '44px', height: '44px', background: '#1f2029', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', overflow: 'hidden' }}>
                          {pro.face}
                        </div>
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', border: '2px solid #121318' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0', margin: '0 0 4px 0' }}>{pro.name}</h4>
                        <p style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>{pro.role}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{pro.rating} ★</p>
                      </div>
                    </div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.background='#1f2029'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                      <Mail size={16} color="#64748b" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity / AI Concierge */}
            <div style={{ position: 'relative' }}>
              <div style={{ background: '#1a1b23', border: '1px solid #252630', borderRadius: '24px', padding: '24px', opacity: 0.9 }}>
                <h3 style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.1em', margin: '0 0 20px 0' }}>YOUR RECENT ACTIVITY</h3>
                <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '5px', top: '10px', bottom: '-40px', width: '2px', background: '#2e2f3e' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6366f1', zIndex: 1, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: '0 0 4px 0' }}>Plumbing repair completed</p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Oct 24, 2023</p>
                  </div>
                </div>
              </div>

              {/* AI Concierge Float Layer */}
              <div style={{ position: 'absolute', bottom: '-20px', left: '-10px', right: '-10px', background: '#252630', border: '1px solid #333440', borderRadius: '20px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#34d399', letterSpacing: '0.05em' }}>AI CONCIERGE</span>
                </div>
                <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
                  Hi {user?.name?.split(' ')[0] || 'Adrian'}! Based on your history, I recommend booking <strong>Marcus Sterling</strong> for your inspection today.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Floating Chat Button (Bottom Right) */}
      <div style={{ position: 'fixed', bottom: '40px', right: '40px', width: '60px', height: '60px', background: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(79,70,229,0.4)', cursor: 'pointer', zIndex: 100 }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
        <MessageSquare size={24} color="white" />
      </div>

    </div>
  );
};

export default UserDashboard;
