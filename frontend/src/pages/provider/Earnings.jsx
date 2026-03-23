import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Download } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Chatbot from '../../components/chatbot/Chatbot';
import { providerAPI, bookingAPI } from '../../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ProviderEarnings = () => {
  const [provider, setProvider] = useState(null);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      providerAPI.getMyProfile(),
      bookingAPI.getProviderBookings({ status: 'completed' })
    ]).then(([p, b]) => {
      setProvider(p.data.data.provider);
      setCompletedJobs(b.data.data.bookings?.filter(bk => bk.status === 'completed') || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleExportPDF = () => {
    if (completedJobs.length === 0) return;
    const doc = new jsPDF();
    
    // Brand & Document Title
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text('GharSewa', 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(99, 102, 241); // indigo-500
    doc.text('Earnings Statement & Job History', 14, 30);
    
    // Metadata
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Date Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 40);
    
    // Financial Summary
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(`Total Lifetime Earnings: Rs. ${provider?.totalEarnings || 0}`, 14, 48);
    doc.text(`Total Completed Jobs: ${provider?.completedJobs || completedJobs.length}`, 14, 54);
    
    // Transaction Table Config
    const tableColumn = ["Date", "Service", "Customer", "Amount (Rs)"];
    const tableRows = completedJobs.map(job => [
      new Date(job.scheduledDate).toLocaleDateString('en-IN'),
      job.serviceId?.name || 'Service',
      job.userId?.name || 'Customer',
      `+ ${job.amount}`
    ]);

    // Render Table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 6 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    // Save File
    doc.save(`GharSewa_Earnings_${new Date().getTime()}.pdf`);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ padding: '32px 40px', boxSizing: 'border-box', minWidth: 0, flex: 1 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div className="card fade-in" style={{ padding: '40px', borderRadius: '24px', marginBottom: '32px', background: 'linear-gradient(135deg, var(--c-success), #059669)', border: 'none', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 10, color: 'white' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', opacity: 0.9, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={18} /> Total Lifetime Earnings</p>
              <h1 style={{ fontSize: '48px', fontWeight: '900', margin: '8px 0 0 0' }}>₹{provider?.totalEarnings || 0}</h1>
              <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>Across {provider?.completedJobs || 0} completed services</p>
            </div>
            <div style={{ position: 'absolute', right: '5%', top: '-30%', opacity: 0.2, pointerEvents: 'none' }}>
              <DollarSign size={200} color="white" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--c-text)', margin: 0 }}>Earnings History</h2>
            <button onClick={handleExportPDF} disabled={completedJobs.length === 0} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 16px', opacity: completedJobs.length === 0 ? 0.5 : 1, cursor: completedJobs.length === 0 ? 'not-allowed' : 'pointer' }}>
               <Download size={14} /> Export PDF
            </button>
          </div>

          {loading ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[1, 2, 3].map(i => <div key={i} className="shimmer card" style={{ height: '80px', borderRadius: '16px' }} />)}
             </div>
          ) : completedJobs.length === 0 ? (
             <div className="card fade-in" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '24px', background: 'var(--c-surface-2)', border: '1px solid var(--c-border)' }}>
               <DollarSign size={48} color="var(--c-text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
               <p style={{ color: 'var(--c-text)', fontSize: '18px', fontWeight: '800' }}>No earnings yet</p>
               <p style={{ color: 'var(--c-text-muted)', fontSize: '14px', marginTop: '8px' }}>Complete your first job to start earning.</p>
             </div>
          ) : (
            <div className="card glass fade-in" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--c-surface-2)', borderBottom: '1px solid var(--c-border)' }}>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: 'var(--c-text-muted)' }}>Date</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: 'var(--c-text-muted)' }}>Service</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: 'var(--c-text-muted)' }}>Customer</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: 'var(--c-text-muted)', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {completedJobs.map(job => (
                    <tr key={job._id} style={{ borderBottom: '1px solid var(--c-border)', transition: 'background 0.2s', ':hover': { background: 'var(--c-surface)' } }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--c-text)', fontWeight: '600' }}>{new Date(job.scheduledDate).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--c-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{job.serviceId?.icon}</span> {job.serviceId?.name}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--c-text-muted)' }}>{job.userId?.name}</td>
                      <td style={{ padding: '16px 24px', fontSize: '16px', color: 'var(--c-success)', fontWeight: '800', textAlign: 'right' }}>+ ₹{job.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default ProviderEarnings;
