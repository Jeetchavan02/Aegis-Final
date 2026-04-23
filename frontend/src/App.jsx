import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, LogOut, LogIn, User as UserIcon } from 'lucide-react';
import InputForm from './components/InputForm';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

const AppNavigation = ({ user, onLogout }) => {
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ShieldCheck color="var(--accent-primary)" size={32} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>AEGIS</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>FORENSIC ENGINE</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', height: '100%', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Analysis Engine
        </Link>
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Threat Dashboard
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.8rem', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
          <UserIcon size={14} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.username}</span>
        </div>
        <button 
          onClick={onLogout}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <LogOut size={16} /> <span style={{ fontSize: '0.85rem' }}>Logout</span>
        </button>
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  if (loading) return null;

  return (
    <Router>
      <AppWrapper user={user} setUser={setUser} handleLogout={handleLogout} />
    </Router>
  );
};

const AppWrapper = ({ user, setUser, handleLogout }) => {
    return (
        <>
            <AppNavigation user={user} onLogout={handleLogout} />
            <main className="app-container">
                <Routes>
                    <Route 
                        path="/login" 
                        element={user ? <Navigate to="/" /> : <Login onLoginSuccess={setUser} />} 
                    />
                    <Route 
                        path="/signup" 
                        element={user ? <Navigate to="/" /> : <Signup />} 
                    />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute user={user}>
                                <InputForm />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute user={user}>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </main>
        </>
    );
};

export default App;
