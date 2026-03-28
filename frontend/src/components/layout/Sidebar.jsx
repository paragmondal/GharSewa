import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Settings, Zap, Users, LogOut, DollarSign } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showLogout, setShowLogout] = useState(false);

  const getNavItems = () => {
    if (user?.role === 'admin') {
      return [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
        { path: '/profile', icon: Settings, label: 'Settings' }
      ];
    } else if (user?.role === 'provider') {
      return [
        { path: '/provider', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/provider/bookings', icon: Calendar, label: 'Jobs' },
        { path: '/provider/earnings', icon: DollarSign, label: 'Earnings' },
        { path: '/profile', icon: Settings, label: 'Settings' }
      ];
    }
    return [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/bookings', icon: Calendar, label: 'Bookings' },
      { path: '/profile', icon: Settings, label: 'Settings' }
    ];
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ width: '260px', height: '100vh', background: '#0f1015', borderRight: '1px solid #1a1b24', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', left: 0, top: 0, zIndex: 40 }}>
      {/* Brand */}
      <div style={{ padding: '0 24px', marginBottom: '48px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#6366f1', margin: '0 0 4px 0', letterSpacing: '-0.03em' }}>
            GharSewa
          </h1>
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Premium Home Services
          </span>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ padding: '0 24px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em', color: '#475569', textTransform: 'uppercase', marginBottom: '12px' }}>
          Menu
        </span>
        
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                background: active ? '#1a1c24' : 'transparent',
                color: active ? '#818cf8' : '#94a3b8',
                borderLeft: active ? '3px solid #6366f1' : '3px solid transparent',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: active ? '600' : '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => { if (!active) { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = '#13141b'; } }}
              onMouseOut={e => { if (!active) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; } }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div style={{ padding: '0 24px', marginTop: 'auto' }}>
        <button 
          onClick={() => setShowLogout(true)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', color: '#ef4444', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseOver={e=>e.currentTarget.style.background='rgba(239,68,68,0.1)'}
          onMouseOut={e=>e.currentTarget.style.background='transparent'}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {showLogout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1c1d24', padding: '32px', borderRadius: '24px', border: '1px solid #2a2b36', width: '320px', textAlign: 'center' }}>
             <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '16px' }}>Sign Out?</h3>
             <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Are you sure you want to log out of GharSewa?</p>
             <div style={{ display: 'flex', gap: '12px' }}>
               <button onClick={() => setShowLogout(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #333440', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
               <button onClick={handleLogout} style={{ flex: 1, padding: '10px', background: '#ef4444', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Confirm</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
