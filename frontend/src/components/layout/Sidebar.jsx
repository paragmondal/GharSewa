import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Home, Calendar, Star, LogOut, Bell, Sun, Moon, Menu, User, Settings, LayoutDashboard } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'dark');

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Sync sidebar body class
  useEffect(() => {
    if (isSidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isSidebarCollapsed]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLangChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('app_lang', lang);
  };

  const userNav = [
    { path: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
    { path: '/services', icon: Star, key: 'browseServices' },
    { path: '/bookings', icon: Calendar, key: 'myBookings' },
  ];

  const providerNav = [
    { path: '/provider', icon: LayoutDashboard, key: 'dashboard' },
    { path: '/provider/bookings', icon: Calendar, key: 'bookings' },
    { path: '/provider/earnings', icon: Star, key: 'earnings' },
  ];

  const adminNav = [
    { path: '/admin', icon: LayoutDashboard, key: 'dashboard' },
    { path: '/admin/users', icon: Star, key: 'users' },
    { path: '/admin/providers', icon: Bell, key: 'providers' },
    { path: '/admin/bookings', icon: Calendar, key: 'bookings' },
  ];

  const commonNav = [
    { path: '/profile', icon: User, key: 'profile' },
  ];

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'provider' ? providerNav : userNav;
  const roleColor = { admin: '#f59e0b', provider: '#10b981', user: '#6366f1' }[user?.role] || '#6366f1';
  
  let roleLabelKey = 'customer';
  if (user?.role === 'admin') roleLabelKey = 'admin';
  if (user?.role === 'provider') roleLabelKey = 'provider';

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/login');
  };

  return (
    <>
    <div className="sidebar" style={{ background: 'var(--c-bg)', borderRight: '1px solid rgba(255,255,255,0.05)', boxShadow: '4px 0 24px rgba(0,0,0,0.5)' }}>
      {/* Header / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', padding: '0 8px', overflow: 'hidden' }}>
        <button 
          onClick={toggleSidebar} 
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-text)', padding: '4px', borderRadius: '8px', flexShrink: 0 }}
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="hide-on-collapse" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--c-primary), #a78bfa)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 16px rgba(99,102,241,0.4)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Zap size={20} color="white" />
          </div>
          <span style={{ fontSize: '22px', fontWeight: '800', fontFamily: '"Manrope", sans-serif', letterSpacing: '-0.03em', color: '#ffffff' }}>Ghar<span style={{ color: 'var(--c-primary)' }}>Sewa</span></span>
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span className="hide-on-collapse" style={{ padding: '0 16px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', color: 'var(--c-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Menu</span>
        
        {navItems.map(({ path, icon: Icon, key }) => {
          const active = location.pathname === path;
          const translatedLabel = t(key, { defaultValue: key.charAt(0).toUpperCase() + key.slice(1) });
          
          return (
            <Link
              key={path}
              to={path}
              className="nav-item"
              id={`nav-${key.toLowerCase()}`}
              style={{
                background: active ? 'linear-gradient(90deg, color-mix(in srgb, var(--c-primary) 15%, transparent), transparent)' : 'transparent',
                color: active ? '#ffffff' : 'var(--c-text-muted)',
                fontWeight: active ? '700' : '500', 
                fontSize: '15px',
                borderLeft: active ? '3px solid var(--c-primary)' : '3px solid transparent',
                borderRadius: '0 12px 12px 0',
                padding: '12px 16px',
                margin: '0 0 4px 0'
              }}
              title={isSidebarCollapsed ? translatedLabel : ''}
              onMouseOver={e => { if (!active) e.currentTarget.style.color = '#ffffff'; }}
              onMouseOut={e => { if (!active) e.currentTarget.style.color = 'var(--c-text-muted)'; }}
            >
              <Icon size={20} style={{ color: active ? 'var(--c-primary)' : 'var(--c-text-muted)', flexShrink: 0, transition: 'color 0.2s' }} />
              <span className="hide-on-collapse">{translatedLabel}</span>
            </Link>
          );
        })}

        <div style={{ margin: '24px 0' }}></div>
        <span className="hide-on-collapse" style={{ padding: '0 16px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', color: 'var(--c-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>System</span>

        {commonNav.map(({ path, icon: Icon, key }) => {
          const active = location.pathname === path;
          const translatedLabel = t(key, { defaultValue: key.charAt(0).toUpperCase() + key.slice(1) });
          
          return (
            <Link
              key={path}
              to={path}
              className="nav-item"
              style={{
                background: active ? 'linear-gradient(90deg, color-mix(in srgb, var(--c-primary) 15%, transparent), transparent)' : 'transparent',
                color: active ? '#ffffff' : 'var(--c-text-muted)',
                fontWeight: active ? '700' : '500', 
                fontSize: '15px',
                borderLeft: active ? '3px solid var(--c-primary)' : '3px solid transparent',
                borderRadius: '0 12px 12px 0',
                padding: '12px 16px',
                margin: '0 0 4px 0'
              }}
              title={isSidebarCollapsed ? translatedLabel : ''}
              onMouseOver={e => { if (!active) e.currentTarget.style.color = '#ffffff'; }}
              onMouseOut={e => { if (!active) e.currentTarget.style.color = 'var(--c-text-muted)'; }}
            >
              <Icon size={20} style={{ color: active ? 'var(--c-primary)' : 'var(--c-text-muted)', flexShrink: 0, transition: 'color 0.2s' }} />
              <span className="hide-on-collapse">{translatedLabel}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Section (Theme & Lang) */}
      <div className="settings-section" style={{ marginBottom: '24px', display: 'flex', gap: '8px', padding: '0 16px' }}>
        <select 
          className="input-field hide-on-collapse" 
          style={{ flex: 1, padding: '10px 14px', fontSize: '13px', borderRadius: '12px', background: 'var(--c-surface-2)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--c-text)', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
          value={i18n.language || 'en'}
          onChange={handleLangChange}
        >
          <option value="en">ENG</option>
          <option value="hi">HIN</option>
          <option value="bn">BEN</option>
          <option value="ta">TAM</option>
        </select>

        <button 
          onClick={toggleTheme}
          style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--c-surface-2)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--c-text)', flexShrink: 0, transition: 'all 0.2s' }}
          title={t('theme', 'Theme')}
          onMouseOver={e=>e.currentTarget.style.background='var(--c-surface)'}
          onMouseOut={e=>e.currentTarget.style.background='var(--c-surface-2)'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Premium User Card */}
      <div className="user-card" style={{ padding: '16px', background: 'linear-gradient(180deg, var(--c-surface), var(--c-surface-2))', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s ease', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: `linear-gradient(135deg, ${roleColor}, color-mix(in srgb, ${roleColor} 60%, transparent))`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 8px 16px color-mix(in srgb, ${roleColor} 40%, transparent)`, border: '1px solid rgba(255,255,255,0.2)' }} title={user?.name}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: 'white', fontFamily: 'Manrope' }}>{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="hide-on-collapse" style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0 0 2px 0' }}>{user?.name}</p>
            <p style={{ fontSize: '12px', color: roleColor, fontWeight: '700', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t(roleLabelKey, roleLabelKey)}</p>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'center', gap: '8px', padding: '12px 0', background: 'color-mix(in srgb, var(--c-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--c-danger) 20%, transparent)', borderRadius: '12px', color: 'var(--c-danger)', cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: 'all 0.2s ease' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'color-mix(in srgb, var(--c-danger) 20%, transparent)' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'color-mix(in srgb, var(--c-danger) 10%, transparent)' }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} /><span className="hide-on-collapse">{t('logout', 'Logout')}</span>
        </button>
      </div>
    </div>

    {showLogoutModal && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="fade-in" style={{ padding: '40px', maxWidth: '420px', width: '90%', textAlign: 'center', background: 'var(--c-surface-2)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'color-mix(in srgb, var(--c-danger) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--c-danger)', border: '1px solid color-mix(in srgb, var(--c-danger) 30%, transparent)' }}>
            <LogOut size={32} />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Manrope', color: '#ffffff', margin: '0 0 12px 0' }}>Sign Out?</h2>
          <p style={{ color: 'var(--c-text-muted)', fontSize: '15px', margin: '0 0 32px 0', lineHeight: 1.6 }}>Are you sure you want to log out of GharSewa? You will need to sign in again to access the digital concierge.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ flex: 1, background: 'transparent', color: 'var(--c-text)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', padding: '14px', transition: 'all 0.2s' }} onClick={() => setShowLogoutModal(false)} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>Cancel</button>
            <button onClick={confirmLogout} style={{ flex: 1, background: 'linear-gradient(135deg, var(--c-danger), #b91c1c)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', padding: '14px', boxShadow: '0 8px 24px color-mix(in srgb, var(--c-danger) 40%, transparent)' }}>Sign Out</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Sidebar;
