import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Settings, Zap } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

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
    </div>
  );
};

export default Sidebar;
