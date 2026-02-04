import { Factory, Zap, Trash2, Activity, AlertTriangle } from 'lucide-react';
import { FACILITIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const FacilitiesPage = () => {
    const { user } = useAuth();

    // In a real app, this should come from context/state
    const facilities = FACILITIES;

    const getIcon = (type: string) => {
        switch (type) {
            case 'energy': return Zap;
            case 'dumpyard': return Trash2;
            case 'recycle': return Factory;
            default: return Factory;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'energy': return 'var(--accent-engineer)'; // Yellow/Orange
            case 'dumpyard': return 'var(--accent-danger)'; // Red/Brown
            case 'recycle': return 'var(--accent-manager)'; // Green
            default: return 'var(--text-primary)';
        }
    };

    const getUnit = (type: string) => {
        switch (type) {
            case 'energy': return 'kW';
            case 'dumpyard': return 'Tons';
            case 'recycle': return 'Tons';
            default: return 'Units';
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header / Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '12px', color: 'var(--status-good)' }}>
                        <Factory size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Total Processing</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>2,500 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Tons/Day</span></div>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(245, 158, 11, 0.05))', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(234, 179, 8, 0.2)', borderRadius: '12px', color: 'var(--status-warning)' }}>
                        <Zap size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Energy Generated</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>850 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>kW</span></div>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: 'var(--accent-admin)' }}>
                        <Activity size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>System Efficiency</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>94%</div>
                    </div>
                </div>
            </div>

            {/* Facilities List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {facilities.map(facility => {
                    const Icon = getIcon(facility.type);
                    const color = getColor(facility.type);

                    return (
                        <div key={facility.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                            {/* Status Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '50px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: facility.status === 'operational' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                color: facility.status === 'operational' ? 'var(--status-good)' : 'var(--status-danger)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></span>
                                {facility.status.toUpperCase()}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    background: `${color}15`,
                                    color: color,
                                    border: `1px solid ${color}30`
                                }}>
                                    <Icon size={32} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{facility.name}</h3>
                                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-tertiary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {facility.type.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '3rem' }}>
                                {facility.description}
                            </p>

                            <div style={{
                                background: 'var(--bg-main)',
                                padding: '1rem',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Current Output</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
                                    {facility.output} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{getUnit(facility.type)}</span>
                                </span>
                            </div>

                            {/* Controls (Visual specific to Admin/Manager) */}
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'var(--text-primary)',
                                    color: 'var(--bg-main)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Activity size={16} /> View Details
                                </button>
                                {user?.role === 'admin' && (
                                    <button style={{
                                        padding: '0.75rem',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        color: 'var(--status-danger)',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer'
                                    }} title="Emergency Stop">
                                        <AlertTriangle size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FacilitiesPage;
