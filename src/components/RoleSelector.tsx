import { useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Truck, Wrench, BarChart3, X } from 'lucide-react';
import type { UserRole } from '../types';

const RoleSelector = () => {
    const { isRoleSelectorOpen, closeRoleSelector, switchRole } = useAuth();
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeRoleSelector();
            }
        };

        if (isRoleSelectorOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isRoleSelectorOpen, closeRoleSelector]);

    if (!isRoleSelectorOpen) return null;

    const roles: { id: UserRole; title: string; icon: React.ElementType; color: string; desc: string }[] = [
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
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div
                ref={modalRef}
                className="role-selector-modal"
                style={{
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    width: '100%',
                    maxWidth: '800px',
                    position: 'relative',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <button
                    onClick={closeRoleSelector}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-tertiary)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Switch Role</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Select a role to simulate user perspective</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', // Smaller cards for modal
                    gap: '1rem'
                }}>
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => switchRole(role.id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: '1.5rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                color: 'var(--text-primary)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = role.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'var(--glass-border)';
                            }}
                        >
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                background: `color-mix(in srgb, ${role.color} 20%, transparent)`,
                                color: role.color,
                                display: 'grid',
                                placeItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                <role.icon size={24} />
                            </div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>{role.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{role.desc}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleSelector;
