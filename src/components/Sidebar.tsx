import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Map, Truck, Factory, AlertTriangle,
    Camera, Users, Trash2, Wrench, X, PieChart, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.png';

const Sidebar = ({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) => {
    const { user, logout } = useAuth();


    // const handleLogout = () => {
    //     logout();
    //     navigate('/login');
    // };

    if (!user) return null; // Should not happen in protected layout

    const getMenuItems = () => {
        switch (user.role) {
            case 'admin':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/' },
                    { icon: Map, label: 'Routes', path: '/routes' },
                    { icon: Truck, label: 'Fleet', path: '/fleet' },
                    { icon: Factory, label: 'Facilities', path: '/facilities' },
                    { icon: PieChart, label: 'Finance', path: '/finance' },
                    { icon: AlertTriangle, label: 'Incidents', path: '/incidents' },
                    { icon: Camera, label: 'CCTV', path: '/cctv' },
                    { icon: Users, label: 'Admin', path: '/admin-users' },
                ];
            case 'manager':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/' },
                    { icon: Map, label: 'Routes', path: '/routes' },
                    { icon: Truck, label: 'Fleet', path: '/fleet' },
                    { icon: Factory, label: 'Facilities', path: '/facilities' },
                    { icon: PieChart, label: 'Finance', path: '/finance' },
                ];
            case 'engineer':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/' },
                    { icon: Trash2, label: 'Bins', path: '/bins' },
                    { icon: Truck, label: 'Trucks', path: '/trucks' },
                    { icon: Wrench, label: 'Machinery', path: '/machinery' },
                ];
            case 'finance':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/' },
                    { icon: PieChart, label: 'Finance', path: '/finance' },
                    { icon: Map, label: 'Routes', path: '/routes' },
                    { icon: Truck, label: 'Fleet', path: '/fleet' },
                    { icon: Factory, label: 'Facilities', path: '/facilities' },
                ];
            default:
                return [{ icon: LayoutDashboard, label: 'Overview', path: '/' }];
        }
    };

    return (
        <aside
            className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}
            style={{
                width: 'var(--sidebar-width)',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                zIndex: 50,
                transition: 'transform 0.3s ease'
            }}
        >
            <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <img src={logo} alt="GreenFlow Logo" style={{ height: '40px' }} />
                <button
                    onClick={onClose}
                    className="mobile-close-btn"
                    style={{
                        position: 'absolute',
                        right: -10,
                        top: 0,
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        display: 'none', // Hidden on desktop
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {getMenuItems().map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            textDecoration: 'none',
                            color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                            background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                            borderLeft: isActive ? '3px solid var(--accent-admin)' : '3px solid transparent',
                            transition: 'all 0.2s ease',
                            fontWeight: isActive ? 600 : 500
                        })}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.875rem 1rem',
                        background: 'rgba(239, 68, 68, 0.1)', // Red tint for logout
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--status-danger)',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'background 0.2s',
                        justifyContent: 'flex-start'
                    }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <img
                    src={user.avatar}
                    alt="User"
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ overflow: 'hidden' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                        {user.role === 'finance' ? 'Finance Analyst' :
                            user.role === 'manager' ? 'West Manager' :
                                user.role === 'engineer' ? 'Maintenance Engineer' :
                                    user.role}
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
