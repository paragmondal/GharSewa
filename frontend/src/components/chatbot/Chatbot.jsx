import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2, CheckCircle, XCircle, Clock, Activity, Star } from 'lucide-react';
import { aiAPI } from '../../api';

const suggestions = [
  '👋 Hello!',
  '🔧 Book a plumber',
  '🧹 Home cleaning service',
  '⚡ Need an electrician',
  '📊 Track my booking',
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! 👋 I'm GharSewa AI. How can I help you today?\n\nI can help you book services, track bookings, or answer any questions!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const { data } = await aiAPI.chat(updated.slice(-10)); // keep last 10 msgs for context
      setMessages([...updated, data.data.message]);
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        id="chatbot-toggle"
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          border: 'none', cursor: 'pointer', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
          transition: 'transform 0.2s ease',
          transform: open ? 'scale(0.9) rotate(90deg)' : 'scale(1)'
        }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
        {!open && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            width: '18px', height: '18px', background: '#10b981', borderRadius: '50%',
            fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '700', border: '2px solid #0f0f14'
          }}>AI</span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div id="chatbot-window" className="fade-in" style={{
          position: 'fixed', bottom: '96px', right: '24px', zIndex: 999,
          width: '360px', height: '520px',
          background: '#1a1a24', border: '1px solid #2e2e3e', borderRadius: '20px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="white" />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>GharSewa AI</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>● Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'white' }}>
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => {
              let textContent = msg.content;
              let actionObj = null;
              
              if (msg.role === 'assistant') {
                try {
                  const parsed = JSON.parse(msg.content);
                  textContent = parsed.message || parsed.content || "Processing your request...";
                  actionObj = parsed;
                } catch (e) { /* normal text */ }
              }

              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', maxWidth: '100%' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: msg.role === 'user' ? '#6366f1' : '#22222e', border: '1px solid #2e2e3e'
                    }}>
                      {msg.role === 'user' ? <User size={14} color="white" /> : <Bot size={14} color="#818cf8" />}
                    </div>
                    <div style={{
                      maxWidth: '80%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#22222e',
                      color: 'white', fontSize: '13.5px', lineHeight: '1.5', whiteSpace: 'pre-wrap',
                      border: msg.role === 'assistant' ? '1px solid #2e2e3e' : 'none'
                    }}>
                      {textContent}
                    </div>
                  </div>

                  {/* Dynamic Action Cards */}
                  {actionObj && actionObj.action !== 'chat' && actionObj.action !== 'error' && (
                    <div style={{ marginLeft: '36px', width: '260px', background: 'rgba(255,255,255,0.03)', border: '1px solid #2e2e3e', borderRadius: '12px', padding: '14px', position: 'relative', overflow: 'hidden' }}>
                      
                      {actionObj.action === 'book_service' && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', marginBottom: '10px' }}>
                            <CheckCircle size={16} /> <span style={{ fontWeight: '700', fontSize: '13px' }}>Booking Confirmed</span>
                          </div>
                          <p style={{ margin: '4px 0', fontSize: '12px', color: '#cbd5e1' }}><strong>ID:</strong> {actionObj.data?.bookingId}</p>
                          <p style={{ margin: '4px 0', fontSize: '12px', color: '#cbd5e1', textTransform: 'capitalize' }}><strong>Service:</strong> {actionObj.data?.service}</p>
                          <div style={{ padding: '8px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', marginTop: '10px', fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
                            {actionObj.data?.date} at {actionObj.data?.time}
                          </div>
                        </>
                      )}

                      {actionObj.action === 'cancel_booking' && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', marginBottom: '10px' }}>
                            <XCircle size={16} /> <span style={{ fontWeight: '700', fontSize: '13px' }}>Booking Cancelled</span>
                          </div>
                          <p style={{ margin: '0', fontSize: '12px', color: '#cbd5e1' }}><strong>ID:</strong> {actionObj.data?.bookingId}</p>
                        </>
                      )}

                      {actionObj.action === 'reschedule_booking' && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', marginBottom: '10px' }}>
                            <Clock size={16} /> <span style={{ fontWeight: '700', fontSize: '13px' }}>Rescheduled</span>
                          </div>
                          <p style={{ margin: '4px 0', fontSize: '12px', color: '#cbd5e1' }}><strong>ID:</strong> {actionObj.data?.bookingId}</p>
                          <p style={{ margin: '4px 0', fontSize: '12px', color: '#cbd5e1' }}><strong>New Date:</strong> {actionObj.data?.newDate}</p>
                          <p style={{ margin: '4px 0', fontSize: '12px', color: '#cbd5e1' }}><strong>New Time:</strong> {actionObj.data?.newTime}</p>
                        </>
                      )}

                      {actionObj.action === 'check_booking_status' && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', marginBottom: '10px' }}>
                            <Activity size={16} /> <span style={{ fontWeight: '700', fontSize: '13px' }}>Status Tracker</span>
                          </div>
                          <p style={{ margin: '4px 0', fontSize: '12px', color: '#cbd5e1' }}><strong>Service:</strong> {actionObj.data?.service}</p>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                            <span style={{ padding: '4px 8px', background: 'rgba(245,158,11,0.15)', borderRadius: '6px', fontSize: '11px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase' }}>
                              {actionObj.data?.status?.replace('_', ' ')}
                            </span>
                            <span style={{ padding: '4px 8px', background: 'rgba(148,163,184,0.1)', borderRadius: '6px', fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>
                              Pay: {actionObj.data?.payment}
                            </span>
                          </div>
                        </>
                      )}

                      {actionObj.action === 'suggest_provider' && actionObj.data?.length > 0 && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7', marginBottom: '10px' }}>
                            <Star size={16} /> <span style={{ fontWeight: '700', fontSize: '13px' }}>Top Matches</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {actionObj.data.map(p => (
                              <div key={p.id} style={{ padding: '10px', background: '#22222e', borderRadius: '8px', border: '1px solid #2e2e3e' }}>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'white' }}>{p.name}</p>
                                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                                  <span>{p.rating} ⭐</span>
                                  <span>Starts ₹{p.baseRate}</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                    </div>
                  )}

                  {/* Error Card */}
                  {actionObj && actionObj.action === 'error' && (
                    <div style={{ marginLeft: '36px', width: '260px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px' }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>⚠️ Request Failed</p>
                    </div>
                  )}

                </div>
              );
            })}
            
            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#22222e', border: '1px solid #2e2e3e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={14} color="#818cf8" />
                </div>
                <div style={{ padding: '10px 14px', background: '#22222e', borderRadius: '16px 16px 16px 4px', border: '1px solid #2e2e3e' }}>
                  <Loader2 size={16} color="#818cf8" className="spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', gap: '6px', overflowX: 'auto', flexWrap: 'nowrap' }}>
              {suggestions.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  style={{ padding: '6px 12px', borderRadius: '20px', background: '#22222e', border: '1px solid #2e2e3e', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #2e2e3e', display: 'flex', gap: '8px' }}>
            <input
              id="chatbot-input"
              className="input-field"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              style={{ flex: 1, padding: '10px 14px' }}
            />
            <button
              id="chatbot-send"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                background: input.trim() ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#22222e',
                border: '1px solid #2e2e3e', borderRadius: '10px', padding: '10px 12px',
                cursor: input.trim() ? 'pointer' : 'default', color: 'white', flexShrink: 0
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
