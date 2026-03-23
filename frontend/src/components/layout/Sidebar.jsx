import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Home, Calendar, Star, LogOut, Bell, Sun, Moon, Menu, User } from 'lucide-react';
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
    { path: '/dashboard', icon: Home, key: 'dashboard' },
    { path: '/services', icon: Star, key: 'browseServices' },
    { path: '/bookings', icon: Calendar, key: 'myBookings' },
    { path: '/profile', icon: User, key: 'profile' },
  ];

  const providerNav = [
    { path: '/provider', icon: Home, key: 'dashboard' },
    { path: '/provider/bookings', icon: Calendar, key: 'bookings' },
    { path: '/provider/earnings', icon: Star, key: 'earnings' },
    { path: '/profile', icon: User, key: 'profile' },
  ];

  const adminNav = [
    { path: '/admin', icon: Home, key: 'dashboard' },
    { path: '/admin/users', icon: Star, key: 'users' },
    { path: '/admin/providers', icon: Bell, key: 'providers' },
    { path: '/admin/bookings', icon: Calendar, key: 'bookings' },
    { path: '/profile', icon: User, key: 'profile' },
  ];

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'provider' ? providerNav : userNav;
  const roleColor = { admin: '#f59e0b', provider: '#10b981', user: '#6366f1' }[user?.role] || '#6366f1';
  
  let roleLabelKey = 'customer';
  if (user?.role === 'admin') roleLabelKey = 'admin';
  if (user?.role === 'provider') roleLabelKey = 'provider';

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/login');
  };

  return (
    <>
    <div className="sidebar">
      {/* Header / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', padding: '0 8px', overflow: 'hidden' }}>
        <button 
          onClick={toggleSidebar} 
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-text)', padding: '4px', borderRadius: '8px', flexShrink: 0 }}
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="hide-on-collapse" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--c-primary), #a78bfa)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
            <Zap size={18} color="white" />
          </div>
          <span className="gradient-text" style={{ fontSize: '20px', fontWeight: '800' }}>GharSewa</span>
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1 }}>
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
                background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: active ? 'var(--c-primary)' : 'var(--c-text-muted)',
                fontWeight: active ? '700' : '500', 
                fontSize: '14px',
                border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
              }}
              title={isSidebarCollapsed ? translatedLabel : ''}
            >
              <Icon size={20} style={{ color: active ? 'var(--c-primary)' : 'var(--c-text-muted)', flexShrink: 0 }} />
              <span className="hide-on-collapse">{translatedLabel}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Section (Theme & Lang) */}
      <div className="settings-section" style={{ marginBottom: '16px', display: 'flex', gap: '8px', padding: '0 8px' }}>
        <select 
          className="input-field hide-on-collapse" 
          style={{ flex: 1, padding: '8px', fontSize: '13px', borderRadius: '10px', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
          value={i18n.language || 'en'}
          onChange={handleLangChange}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="bn">বাংলা</option>
          <option value="ta">தமிழ்</option>
          <option value="gu">ગુજરાતી</option>
          <option value="mr">मराठी</option>
          <option value="te">తెలుగు</option>
        </select>

        <button 
          onClick={toggleTheme}
          style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--c-text)', flexShrink: 0 }}
          title={t('theme', 'Theme')}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* User card */}
      <div className="user-card" style={{ padding: '16px', background: 'var(--c-surface-2)', borderRadius: '16px', border: '1px solid var(--c-border)', transition: 'padding 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 10px ${roleColor}40` }} title={user?.name}>
            <span style={{ fontSize: '16px', fontWeight: '800', color: 'white' }}>{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="hide-on-collapse" style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{user?.name}</p>
            <p style={{ fontSize: '12px', color: roleColor, fontWeight: '600', margin: 0 }}>{t(roleLabelKey, roleLabelKey)}</p>
          </div>
        </div>
        <button
          id="sidebar-logout"
          onClick={handleLogoutClick}
          title={t('logout', 'Logout')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'center', gap: '8px', padding: '10px 0', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: 'all 0.2s ease' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} /><span className="hide-on-collapse">{t('logout', 'Logout')}</span>
        </button>
      </div>
    </div>

    {showLogoutModal && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card fade-in" style={{ padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center', background: 'var(--c-surface)', borderRadius: '24px', border: '1px solid var(--c-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#ef4444' }}>
            <LogOut size={32} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--c-text)', margin: '0 0 8px 0' }}>Sign Out?</h2>
          <p style={{ color: 'var(--c-text-muted)', fontSize: '15px', margin: '0 0 32px 0', lineHeight: 1.5 }}>Are you sure you want to log out of GharSewa? You will need to sign in again to access your account.</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={() => setShowLogoutModal(false)} style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>Cancel</button>
            <button onClick={confirmLogout} style={{ flex: 1, justifyContent: 'center', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease', padding: '12px' }} onMouseOver={e=>e.currentTarget.style.background='#dc2626'} onMouseOut={e=>e.currentTarget.style.background='#ef4444'}>Yes, Log out</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Sidebar;
