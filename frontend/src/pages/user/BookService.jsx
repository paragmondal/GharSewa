import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Chatbot from '../../components/chatbot/Chatbot';
import { serviceAPI, bookingAPI } from '../../api';

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    scheduledDate: '',
    scheduledTime: '10:00',
    notes: '',
    address: { street: '', city: '', state: '', pincode: '' },
  });

  useEffect(() => {
    serviceAPI.getById(serviceId).then(({ data }) => {
      setService(data.data.service);
    }).finally(() => setLoading(false));
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await bookingAPI.create({ serviceId, ...form });
      setSuccess(data.data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 size={32} color="#6366f1" className="spin" />
      </div>
    </div>
  );

  if (success) return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="card fade-in" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '48px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={36} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#e2e8f0', marginBottom: '12px' }}>Booking Confirmed! 🎉</h2>
          <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '14px' }}>Your booking has been created successfully.</p>
          <div style={{ background: '#22222e', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Booking Reference</p>
            <p style={{ fontSize: '18px', fontWeight: '800', color: '#6366f1', fontFamily: 'monospace' }}>{success.bookingNumber}</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/bookings')} style={{ width: '100%', justifyContent: 'center' }}>
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '32px' }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
              <span style={{ fontSize: '36px' }}>{service?.icon}</span>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#e2e8f0' }}>Book {service?.name}</h1>
                <p style={{ color: '#10b981', fontWeight: '700', fontSize: '18px' }}>₹{service?.basePrice} <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '400' }}>{service?.priceUnit}</span></p>
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px' }}>{service?.description}</p>
          </div>

          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#f87171', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Date & Time */}
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#e2e8f0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#6366f1" /> Schedule
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Date</label>
                  <input id="book-date" type="date" className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.scheduledDate}
                    onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                    required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Time</label>
                  <input id="book-time" type="time" className="input-field"
                    value={form.scheduledTime}
                    onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                    required />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#e2e8f0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#6366f1" /> Service Address
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Street</label>
                  <input id="addr-street" className="input-field" placeholder="123 Main Street"
                    value={form.address.street}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                    required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[['city', 'City', 'Mumbai'], ['state', 'State', 'Maharashtra'], ['pincode', 'Pincode', '400001']].map(([key, label, placeholder]) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>{label}</label>
                      <input id={`addr-${key}`} className="input-field" placeholder={placeholder}
                        value={form.address[key]}
                        onChange={(e) => setForm({ ...form, address: { ...form.address, [key]: e.target.value } })}
                        required />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Additional Notes (optional)</label>
              <textarea id="book-notes" className="input-field" placeholder="Any specific requirements or instructions..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3} style={{ resize: 'vertical' }} />
            </div>

            {/* Summary */}
            <div style={{ background: '#22222e', borderRadius: '14px', padding: '18px', border: '1px solid #2e2e3e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Service Charge</span>
                <span style={{ color: '#e2e8f0', fontWeight: '800', fontSize: '20px' }}>₹{service?.basePrice}</span>
              </div>
            </div>

            <button id="book-submit" type="submit" className="btn-primary" disabled={submitting}
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '16px' }}>
              {submitting ? <><Loader2 size={18} className="spin" /> Booking...</> : `Confirm Booking — ₹${service?.basePrice}`}
            </button>
          </form>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default BookService;
