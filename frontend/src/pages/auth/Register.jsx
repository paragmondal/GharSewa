import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { authAPI } from '../../api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.phone) delete payload.phone;
      
      const { data } = await authAPI.register(payload);
      const { user, accessToken, refreshToken } = data.data;
      login(user, accessToken, refreshToken);
      if (user.role === 'provider') navigate('/provider');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputField = (id, label, type, key, placeholder, extra = {}) => (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>{label}</label>
      <input
        id={id}
        type={type}
        className="input-field"
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        {...extra}
      />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'linear-gradient(135deg, #0f0f14 0%, #1a0a2e 100%)' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Zap size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Join GharSewa</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>Create your account to get started</p>
        </div>

        <div className="card" style={{ borderRadius: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#e2e8f0' }}>Create Account</h2>

          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#f87171', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {inputField('reg-name', 'Full Name', 'text', 'name', 'John Doe', { required: true, minLength: 2 })}
            {inputField('reg-email', 'Email', 'email', 'email', 'you@example.com', { required: true })}
            {inputField('reg-password', 'Password', 'password', 'password', '••••••••', { required: true, minLength: 6 })}
            {inputField('reg-phone', 'Phone (optional)', 'tel', 'phone', '9876543210')}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>I want to</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[{ value: 'user', label: '🏠 Book Services' }, { value: 'provider', label: '🔧 Provide Services' }].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    id={`role-${value}`}
                    onClick={() => setForm({ ...form, role: value })}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: `2px solid ${form.role === value ? '#6366f1' : '#2e2e3e'}`,
                      background: form.role === value ? 'rgba(99,102,241,0.1)' : '#22222e',
                      color: form.role === value ? '#818cf8' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} id="register-submit"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px', fontSize: '15px' }}>
              {loading ? <><Loader2 size={18} className="spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
