import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { authAPI } from '../../api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      const { user, accessToken, refreshToken } = data.data;
      login(user, accessToken, refreshToken);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'provider') navigate('/provider');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'linear-gradient(135deg, #0f0f14 0%, #1a0a2e 100%)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Zap size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GharSewa</h1>
          <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>Welcome back! Sign in to continue.</p>
        </div>

        {/* Card */}
        <div className="card" style={{ borderRadius: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#e2e8f0' }}>Sign In</h2>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#f87171', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                id="login-email"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  id="login-password"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              id="login-submit"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px', fontSize: '15px' }}
            >
              {loading ? <><Loader2 size={18} className="spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>Sign up</Link>
          </p>

          {/* Demo accounts */}
          <div style={{ marginTop: '24px', padding: '16px', background: '#22222e', borderRadius: '12px', border: '1px solid #2e2e3e' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demo Accounts</p>
            {[
              { role: 'User', email: 'user@demo.com', pass: 'demo123' },
              { role: 'Provider', email: 'provider@demo.com', pass: 'demo123' },
              { role: 'Admin', email: 'admin@demo.com', pass: 'demo123' },
            ].map(({ role, email, pass }) => (
              <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>{role}:</span>
                <button
                  onClick={() => setForm({ email, password: pass })}
                  style={{ fontSize: '11px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace' }}
                  id={`demo-${role.toLowerCase()}`}
                >
                  {email}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
