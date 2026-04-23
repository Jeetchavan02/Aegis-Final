import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { loginUser } from '../services/api';

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginUser(formData.email, formData.password);
            if (data.success) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onLoginSuccess(data.user);
                navigate('/');
            }
        } catch (err) {
            setError(err.error || "Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <ShieldCheck size={48} color="var(--accent-primary)" style={{ filter: 'drop-shadow(0 0 10px var(--accent-glow))', marginBottom: '1rem' }} />
                <h1 style={{ fontSize: '1.5rem', letterSpacing: '0.1em', margin: 0 }}>AEGIS</h1>
                <div className="tech-font" style={{ marginTop: '0.25rem', letterSpacing: '0.2em' }}>SECURE ACCESS TERMINAL</div>
            </div>

            <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div>
                    <span className="tech-font" style={{ color: 'var(--text-secondary)' }}>OPERATOR AUTHENTICATION</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">EMAIL</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                style={{ paddingLeft: '2.5rem', width: '100%' }}
                                placeholder="analyst@aegis.intel"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                style={{ paddingLeft: '2.5rem', width: '100%' }}
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ 
                            padding: '0.75rem', 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            color: 'var(--danger)', 
                            borderRadius: '2px', 
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem'
                        }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'} <ArrowRight size={16} />
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    No clearance? <Link to="/signup" style={{ color: 'var(--accent-primary)' }}>Request Access</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
