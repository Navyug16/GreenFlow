
import { AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';

const IncidentsPage = () => {
    const { incidents, resolveIncident } = useData();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Incident Management</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                            <input
                                type="text"
                                placeholder="Search incidents..."
                                style={{
                                    background: 'var(--bg-main)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '50px',
                                    padding: '0.5rem 1rem 0.5rem 2.5rem',
                                    color: 'white'
                                }}
                            />
                        </div>
                        <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '50px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                        }}>
                            <Filter size={16} /> Filter
                        </button>
                    </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {incidents.map(incident => (
                            <div key={incident.id} style={{
                                background: 'var(--bg-main)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{
                                        padding: '0.5rem',
                                        background: incident.severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : incident.severity === 'medium' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                        borderRadius: '8px',
                                        color: incident.severity === 'high' ? 'var(--status-danger)' : incident.severity === 'medium' ? 'var(--status-warning)' : 'var(--status-good)'
                                    }}>
                                        <AlertTriangle size={24} />
                                    </div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-tertiary)',
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '50px'
                                    }}>
                                        {incident.timestamp}
                                    </span>
                                </div>

                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>{incident.type.replace('_', ' ').toUpperCase()}</h3>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{incident.message}</p>
                                </div>

                                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: incident.resolved ? 'var(--status-good)' : 'var(--status-danger)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        {incident.resolved ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                        {incident.resolved ? 'RESOLVED' : 'OPEN'}
                                    </span>

                                    {!incident.resolved && (
                                        <button
                                            onClick={() => resolveIncident(incident.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'var(--status-good)',
                                                color: 'var(--bg-main)',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Resolve
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncidentsPage;
