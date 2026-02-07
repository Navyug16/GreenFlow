import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Login = () => {
    const { login, authError } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setLocalError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    // Helper to quick fill credentials for demo
    const fillCreds = (role: string) => {
        const domain = '@greenflow.sa';
        setEmail(`${role}${domain}`);
        setPassword(role); // Using simplified passwords for demo: 'admin', 'manager', 'engineer', 'finance'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top right, #1e293b 0%, #0b1120 100%)',
            padding: '2rem'
        }}>
            <div className="login-container" style={{ width: '100%', maxWidth: '420px' }}>

                {/* Logo Section */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <img
                        src={logo}
                        alt="GreenFlow Logo"
                        style={{
                            width: '80px',
                            marginBottom: '1.5rem',
                            filter: 'drop-shadow(0 0 20px rgba(56,189,248,0.3))'
                        }}
                    />
                    <h1 style={{
                        fontSize: '2rem',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        GreenFlow
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Log in to your dashboard</p>
                </div>

                {/* Login Card */}
                <div style={{
                    padding: '2rem',
                    background: 'rgba(30, 41, 59, 0.7)',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <form onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@greenflow.sa"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        outline: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        outline: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-tertiary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {(authError || localError) && (
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '0.75rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '8px',
                                color: 'var(--status-danger)',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <AlertCircle size={16} />
                                {authError || localError}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                background: 'var(--accent-admin)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'background 0.2s'
                            }}
                        >
                            {loading ? 'Authenticating...' : (
                                <>
                                    <LogIn size={20} /> Login
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Demo Credentials Helper */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                        DEMO ACCESS: Click a role to autofill
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {[
                            { role: 'admin', label: 'Admin', color: 'var(--accent-admin)' },
                            { role: 'manager', label: 'Manager', color: 'var(--accent-manager)' },
                            { role: 'engineer', label: 'Engineer', color: 'var(--status-warning)' },
                            { role: 'finance', label: 'Finance', color: 'var(--accent-finance)' }
                        ].map(cred => (
                            <button
                                key={cred.role}
                                onClick={() => fillCreds(cred.role)}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '6px',
                                    color: cred.color,
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                {cred.label}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
