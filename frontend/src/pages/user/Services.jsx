import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Chatbot from '../../components/chatbot/Chatbot';
import { serviceAPI } from '../../api';
import { useTranslation } from 'react-i18next';
import { Search, Zap } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    serviceAPI.getAll().then((res) => {
      setServices(res.data.data.services || []);
    }).finally(() => setLoading(false));
  }, []);

  const filteredServices = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '40px', boxSizing: 'border-box', minWidth: 0, flex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div className="card hero-gradient fade-in" style={{ marginBottom: '32px', position: 'relative', overflow: 'hidden', padding: '32px 40px', border: '1px solid var(--c-primary-light)' }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--c-text)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {t('browseServices')} <Zap size={28} color="var(--c-primary)" />
            </h1>
            <p style={{ color: 'var(--c-text-muted)', marginTop: '8px', fontSize: '15px', maxWidth: '600px', lineHeight: '1.6' }}>
              Choose from trusted, verified professionals delivering high-quality home services right to your doorstep.
            </p>
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', background: 'var(--c-surface-2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--c-border)', maxWidth: '400px' }}>
              <Search size={18} color="var(--c-text-muted)" style={{ marginRight: '12px' }} />
              <input 
                type="text" 
                placeholder="Search for plumbing, cleaning..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--c-text)', width: '100%', fontSize: '14px' }}
              />
            </div>
          </div>
          <div style={{ position: 'absolute', right: '-5%', top: '-20%', opacity: 0.1, zIndex: 1, pointerEvents: 'none' }}>
             <Zap size={240} color="var(--c-primary)" />
          </div>
        </div>

        {/* Services Grid (Native Flex/Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="shimmer card" style={{ height: '220px', borderRadius: '20px' }} />)
          ) : filteredServices.length === 0 ? (
             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--c-text-muted)' }}>
                No services found matching "{search}"
             </div>
          ) : (
            filteredServices.map((svc) => (
              <Link key={svc._id} to={`/book/${svc._id}`} className="fade-in" style={{ textDecoration: 'none' }}>
                <div className="card glass" style={{ 
                  textAlign: 'center', cursor: 'pointer', padding: '40px 20px', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                  borderRadius: '20px', height: '100%', justifyContent: 'center'
                }}>
                  <div style={{ 
                    fontSize: '48px', 
                    background: 'var(--c-surface-2)', 
                    width: '90px', height: '90px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    borderRadius: '24px', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' 
                  }}>
                    {svc.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--c-text)' }}>{svc.name}</h3>
                    <p style={{ fontSize: '15px', color: 'var(--c-primary)', fontWeight: '800', marginTop: '6px' }}>₹{svc.basePrice} <span style={{ fontSize: '11px', color: 'var(--c-text-muted)', fontWeight: '500' }}>/{svc.priceUnit.replace('per ', '')}</span></p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Services;
