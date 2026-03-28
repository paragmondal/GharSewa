import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ChevronRight, Star, ShieldCheck, Zap, ArrowRight, UserPlus, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden', position: 'relative' }}>
      
      {/* Background Ambient Glows */}
      <div style={{ position: 'absolute', top: '-150px', left: '-150px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(10,10,15,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20vh', right: '-200px', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(10,10,15,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Top Banner */}
      <div style={{ background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)', padding: '10px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', zIndex: 10, position: 'relative' }}>
        🚀 Launch Special: Get your first service fee completely waived!
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Code: GHARZERO</span>
      </div>

      {/* Navbar */}
      <nav style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)' }}>
            <span style={{ fontSize: '20px' }}>🏡</span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', color: 'white' }}>GharSewa</span>
        </div>

        <div style={{ display: 'flex', gap: '36px', fontSize: '14px', fontWeight: '500', color: '#94a3b8', alignItems: 'center' }}>
          <a href="#services" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='#94a3b8'}>Services</a>
          <a href="#professionals" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='#94a3b8'}>For Professionals</a>
          <a href="#about" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='#94a3b8'}>About Us</a>
          <a href="#reviews" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='#94a3b8'}>Reviews</a>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/login" style={{ textDecoration: 'none', color: '#cbd5e1', fontWeight: '600', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='#cbd5e1'}>
            Login
          </Link>
          <Link to="/register" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: 'white', fontWeight: '600', fontSize: '14px', padding: '10px 24px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '24px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', transition: 'transform 0.2s', border: '1px solid rgba(255,255,255,0.1)' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
            Create Account <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', position: 'relative', zIndex: 10 }}>
        
        {/* Left Content */}
        <div style={{ flex: '1', maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '6px 14px', borderRadius: '20px', fontWeight: '600', fontSize: '13px', letterSpacing: '0.5px', marginBottom: '32px', border: '1px solid rgba(16,185,129,0.2)' }}>
            <ShieldCheck size={16} /> 100% VERIFIED PROFESSIONALS
          </div>
          
          <h1 style={{ fontSize: '72px', fontWeight: '800', lineHeight: '1.05', letterSpacing: '-2.5px', margin: '0 0 24px', color: 'white' }}>
            Smart Home <br/>
            Services, powered <br/>
            by <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Modern AI.</span>
          </h1>
          
          <p style={{ fontSize: '20px', lineHeight: '1.6', color: '#94a3b8', margin: '0 0 48px', maxWidth: '540px' }}>
            Stop stressing over unreliable workers. Chat with our intelligent assistant, get matched instantly, and enjoy seamless, guaranteed home services right to your doorstep.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '56px' }}>
            <Link to="/register" style={{ textDecoration: 'none', background: 'white', color: '#0f172a', padding: '18px 36px', borderRadius: '32px', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 20px rgba(255,255,255,0.1)', transition: 'all 0.3s' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(255,255,255,0.2)';}} onMouseOut={e=>{e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 0 20px rgba(255,255,255,0.1)';}}>
              Book a Service <ArrowRight size={18} />
            </Link>
            <Link to="/register?role=provider" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '18px 32px', borderRadius: '32px', fontWeight: '600', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }} onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)'}} onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)'}}>
              <UserPlus size={18} /> Join as Provider
            </Link>
          </div>
          
          {/* Social Proof Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', maxWidth: '500px' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'white', letterSpacing: '-1px' }}>24/7</div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>AI Matchmaking</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'white', letterSpacing: '-1px' }}>15<span style={{ fontSize:'20px', color:'#10b981' }}>min</span></div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>Avg. Arrival Time</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '38px' }}>
                <div style={{ display: 'flex', color: '#fbbf24' }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>10k+ 5-Star Reviews</div>
            </div>
          </div>
        </div>
        
        {/* Right Content Custom 3D App Preview Graphic */}
        <div style={{ flex: '1.2', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '1000px' }}>
          
          <div style={{ position: 'relative', width: '90%', height: '500px', transform: 'rotateY(-15deg) rotateX(10deg) translateZ(0)', transformStyle: 'preserve-3d', transition: 'transform 0.5s', ':hover': { transform: 'rotateY(0deg) rotateX(0deg)' } }} onMouseOver={e=>e.currentTarget.style.transform='rotateY(-5deg) rotateX(5deg) scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='rotateY(-15deg) rotateX(10deg)'}>
            
            {/* Main Application Glass Pane */}
            <div style={{ position: 'absolute', inset: '0', background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '-20px 30px 60px rgba(0,0,0,0.5)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Header */}
              <div style={{ height: '60px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width:'12px', height:'12px', borderRadius:'50%', background:'#ef4444' }}></div>
                  <div style={{ width:'12px', height:'12px', borderRadius:'50%', background:'#eab308' }}></div>
                  <div style={{ width:'12px', height:'12px', borderRadius:'50%', background:'#22c55e' }}></div>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 24px', borderRadius: '16px', fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={14} color="#10b981"/> Secure Connection
                  </div>
                </div>
              </div>

              {/* Chat Interface Mockup */}
              <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* User Bubble */}
                <div style={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', color: 'white', fontSize: '14px', maxWidth: '80%', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                  I urgently need an electrician. The main circuit breaker kept tripping.
                </div>

                {/* AI Bubble */}
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px 16px 16px 4px', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '14px', maxWidth: '85%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#a78bfa', fontWeight: '600' }}>
                    <Bot size={18} /> GharSewa AI
                  </div>
                  I'm scanning for available top-tier electricians near you right now...
                  
                  {/* Embedded Matching Card */}
                  <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                      <Zap size={14} /> Found Perfect Match
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#334155', border: '2px solid #10b981', overflow: 'hidden' }}>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Raj" alt="Provider" style={{ width: '100%', height: '100%' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'space-between' }}>
                          Raj Verma 
                          <span style={{ fontSize: '13px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '2px' }}><Star size={12} fill="currentColor"/> 4.9</span>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px', display: 'flex', gap: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> 12 mins away</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}><ShieldCheck size={12}/> Verified</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1, textAlign: 'center', background: '#10b981', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>Dispatch Immediately</div>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Input Area */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#64748b', fontSize: '14px' }}>
                  Reply to GharSewa AI...
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
                  <ArrowRight color="white" size={18} />
                </div>
              </div>

            </div>

            {/* Glowing Orbs behind the 3D element */}
            <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '150px', height: '150px', background: '#6366f1', borderRadius: '50%', filter: 'blur(80px)', transform: 'translateZ(-50px)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '150px', height: '150px', background: '#10b981', borderRadius: '50%', filter: 'blur(80px)', transform: 'translateZ(-50px)', pointerEvents: 'none' }}></div>
          </div>
        </div>
      </main>

      {/* Sections for Scroll Navigation */}
      <section id="services" style={{ padding: '80px 48px', maxWidth: '1440px', margin: '0 auto', color: 'white', marginTop: '100px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '24px', letterSpacing: '-1px' }}>Explore Our Services</h2>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting'].map(srv => (
            <div key={srv} style={{ background: '#1e293b', padding: '24px 32px', borderRadius: '16px', border: '1px solid #334155', flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>{srv}</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>Verified professionals dispatched instantly via AI.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="professionals" style={{ padding: '80px 48px', maxWidth: '1440px', margin: '0 auto', color: 'white' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: '24px', padding: '48px', border: '1px solid #4f46e5', position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px', letterSpacing: '-1px' }}>Join the Network</h2>
          <p style={{ color: '#a5b4fc', fontSize: '18px', maxWidth: '600px', marginBottom: '32px' }}>GharSewa empowers thousands of independent contractors across India to set their own hours and rapidly grow their business without the middleman fuss.</p>
          <Link to="/register?role=provider" style={{ textDecoration: 'none', background: '#6366f1', color: 'white', padding: '16px 32px', borderRadius: '32px', fontWeight: 'bold', display: 'inline-flex' }}>Sign up as a Professional</Link>
        </div>
      </section>

      <section id="about" style={{ padding: '80px 48px', maxWidth: '1440px', margin: '0 auto', color: 'white', display: 'flex', gap: '48px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '32px', marginBottom: '24px', letterSpacing: '-1px' }}>About GharSewa</h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6' }}>We started GharSewa with one single objective: to entirely eliminate the stress of hiring reliable help. By leveraging powerful Large Language Models directly into our routing algorithm, we guarantee matches with the highest-rated experts within seconds of a chat request.</p>
        </div>
        <div style={{ flex: 1, height: '300px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '18px' }}>
          GharSewa Operations Dashboard
        </div>
      </section>

      <section id="reviews" style={{ padding: '80px 48px 120px 48px', maxWidth: '1440px', margin: '0 auto', color: 'white' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '40px', letterSpacing: '-1px', textAlign: 'center' }}>Loved by Indian Households</h2>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { name: "Priya Sharma", role: "Delhi", text: "The AI instantly matched me with a certified plumber at 11 PM during an emergency. Absolute lifesaver." },
            { name: "Rahul Patel", role: "Mumbai", text: "I've deleted every other service app from my phone. GharSewa's chat UI is so clean, and the workers are always top 1%." },
            { name: "Ananya Desai", role: "Bangalore", text: "The upfront pricing without any hidden negotiation fees is a game changer for home maintenance." }
          ].map((r, i) => (
            <div key={i} style={{ flex: 1, padding: '32px', background: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', color: '#fbbf24', marginBottom: '16px' }}>{[1,2,3,4,5].map(j => <Star key={j} size={16} fill="currentColor" />)}</div>
              <p style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' }}>"{r.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155' }}></div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{r.name}</div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ background: '#0f172a', padding: '32px 48px', textAlign: 'center', color: '#64748b', fontSize: '14px', borderTop: '1px solid #1e293b' }}>
        &copy; {new Date().getFullYear()} GharSewa Technologies AI. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
