import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Shield, Edit3 } from 'lucide-react';
import { userAPI } from '../../api';
import useAuthStore from '../../store/authStore';
import Sidebar from '../../components/layout/Sidebar';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const { data } = await userAPI.updateProfile(formData);
      setUser(data.data.user);
      setSuccess(t('profileUpdated', 'Profile updated successfully!'));
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '32px 40px', boxSizing: 'border-box', minWidth: 0, flex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div className="card hero-gradient fade-in" style={{ padding: '40px', borderRadius: '24px', border: '1px solid var(--c-primary-light)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--c-primary), #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99,102,241,0.3)', position: 'relative', zIndex: 10 }}>
              <span style={{ fontSize: '40px', fontWeight: '800', color: 'white' }}>{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div style={{ position: 'relative', zIndex: 10 }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--c-text)', margin: 0 }}>{user?.name}</h1>
              <p style={{ color: 'var(--c-primary)', fontWeight: '700', fontSize: '15px', marginTop: '4px', textTransform: 'capitalize' }}>
                <Shield size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }}/> 
                {user?.role} Account
              </p>
            </div>
            <div style={{ position: 'absolute', right: '-10%', top: '-50%', opacity: 0.05, zIndex: 1, pointerEvents: 'none' }}>
              <User size={400} />
            </div>
          </div>

          <div className="card glass fade-in" style={{ padding: '40px', borderRadius: '24px', animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-primary)' }}>
                <Edit3 size={20} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--c-text)', margin: 0 }}>{t('editProfile', 'Edit Profile details')}</h2>
            </div>
            
            {success && <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '12px', marginBottom: '24px', fontWeight: '600', fontSize: '14px', border: '1px solid rgba(16,185,129,0.2)' }}>{success}</div>}
            {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '12px', marginBottom: '24px', fontWeight: '600', fontSize: '14px', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c-text-muted)' }}>{t('fullName', 'Full Name')}</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-muted)' }} />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" style={{ paddingLeft: '44px' }} required />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c-text-muted)' }}>{t('email', 'Email Address')}</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-muted)' }} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" style={{ paddingLeft: '44px' }} required />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c-text-muted)' }}>{t('phone', 'Phone Number')}</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-muted)' }} />
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-field" style={{ paddingLeft: '44px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c-text-muted)' }}>{t('address', 'Full Address')}</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '22px', transform: 'translateY(-50%)', color: 'var(--c-text-muted)' }} />
                  <textarea name="address" value={formData.address} onChange={handleChange} className="input-field" style={{ paddingLeft: '44px', minHeight: '100px', paddingTop: '14px', resize: 'vertical' }} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '12px', padding: '16px', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                {loading ? <div className="spin" style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} /> : <><Save size={18} /> {t('saveChanges', 'Save Changes')}</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
