import { useNavigate } from 'react-router-dom';
import { Users, Truck, Wrench, BarChart3, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

import logo from '../assets/logo.png';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (role: UserRole) => {
        login(role);
        navigate('/');
    };

    const roles: { id: UserRole; title: string; icon: any; color: string; desc: string }[] = [
        {
            id: 'admin',
            title: 'Admin',
            icon: Users,
            color: 'var(--accent-admin)',
            desc: 'Full system control & oversight'
        },
        {
            id: 'manager',
            title: 'West Manager',
            icon: Truck,
            color: 'var(--accent-manager)',
            desc: 'Route & collection management'
        },
        {
            id: 'engineer',
            title: 'Maintenance Engineer',
            icon: Wrench,
            color: 'var(--status-warning)', // Amber
            desc: 'Asset repair & facilities'
        },
        {
            id: 'finance',
            title: 'Finance Analyst',
            icon: BarChart3,
            color: 'var(--accent-finance)',
            desc: 'Revenue & efficiency tracking'
        }
    ];

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
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <img src={logo} alt="GreenFlow Logo" style={{ width: '120px', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(56,189,248,0.3))' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Welcome to GreenFlow
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Select your role to access the digital twin dashboard</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '1200px'
            }}>
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => handleLogin(role.id)}
                        className="glass-panel"
                        style={{
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            cursor: 'pointer',
                            border: '1px solid var(--glass-border)',
                            transition: 'all 0.3s ease',
                            background: 'rgba(255, 255, 255, 0.03)',
                            color: 'var(--text-primary)' // Reset button color
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.borderColor = role.color;
                            e.currentTarget.style.boxShadow = `0 10px 30px -10px ${role.color}40`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                            e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                        }}
                    >
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: `color-mix(in srgb, ${role.color} 20%, transparent)`,
                            display: 'grid',
                            placeItems: 'center',
                            marginBottom: '1.5rem',
                            color: role.color
                        }}>
                            <role.icon size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{role.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{role.desc}</p>

                        <div style={{
                            marginTop: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: role.color,
                            fontWeight: 600
                        }}>
                            Enter Dashboard <ArrowRight size={18} />
                        </div>
                    </button>
                ))}
            </div>

            <p style={{ marginTop: '4rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                System Status: <span style={{ color: 'var(--status-good)' }}>● Operational</span>
            </p>
        </div>
    );
};

export default Login;
