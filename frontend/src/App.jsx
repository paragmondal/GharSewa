import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import useAuthStore from './store/authStore';
import useSocketStore from './store/socketStore';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/user/Dashboard';
import Services from './pages/user/Services';
import BookService from './pages/user/BookService';
import MyBookings from './pages/user/MyBookings';
import ProviderDashboard from './pages/provider/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import Profile from './pages/shared/Profile';
import ProviderBookings from './pages/provider/Bookings';
import ProviderEarnings from './pages/provider/Earnings';

// ─── Protected Route ───────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f14' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #2e2e3e', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontSize: '14px' }}>Loading GharSewa...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'provider') return <Navigate to="/provider" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// ─── Public Route (redirect if logged in) ─────────────────────
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'provider') return <Navigate to="/provider" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  const { initialize, isAuthenticated, user } = useAuthStore();
  const { setSocket, clearSocket } = useSocketStore();

  // Initialize auth session on mount
  useEffect(() => {
    initialize();
  }, []);

  // Setup Socket.io connection when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        if (user.role === 'user') socket.emit('joinUserRoom', user._id);
        if (user.role === 'admin') socket.emit('joinAdminRoom');
        // Provider room is joined from provider profile
      });

      socket.on('bookingUpdated', (data) => {
        // Could trigger global notification here
        console.log('Booking updated:', data);
      });

      socket.on('paymentConfirmed', (data) => {
        console.log('Payment confirmed:', data);
      });

      setSocket(socket);
      return () => {
        socket.disconnect();
        clearSocket();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* User routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/services" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Services />
          </ProtectedRoute>
        } />
        <Route path="/book/:serviceId" element={
          <ProtectedRoute allowedRoles={['user']}>
            <BookService />
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute allowedRoles={['user']}>
            <MyBookings />
          </ProtectedRoute>
        } />

        {/* Provider routes */}
        <Route path="/provider" element={
          <ProtectedRoute allowedRoles={['provider', 'user']}>
            <ProviderDashboard />
          </ProtectedRoute>
        } />
        <Route path="/provider/bookings" element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderBookings />
          </ProtectedRoute>
        } />
        <Route path="/provider/earnings" element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderEarnings />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Shared Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f14', flexDirection: 'column', gap: '16px' }}>
            <h1 style={{ fontSize: '64px', fontWeight: '900', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
            <p style={{ color: '#64748b', fontSize: '18px' }}>Page not found</p>
            <a href="/" style={{ color: '#818cf8', fontSize: '14px', textDecoration: 'none', fontWeight: '600' }}>← Back to Home</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
