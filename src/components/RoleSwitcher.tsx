import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

const roles: UserRole[] = ['admin', 'manager', 'engineer', 'finance'];

const RoleSwitcher = () => {
    const { user, login } = useAuth();

    if (!user) return null;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>View as:</span>
            <select
                value={user.role}
                onChange={(e) => login(e.target.value as UserRole)}
                style={{
                    background: 'var(--bg-panel)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--glass-border)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    outline: 'none'
                }}
            >
                {roles.map((role) => (
                    <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default RoleSwitcher;
