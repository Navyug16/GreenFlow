
import { Wrench, Settings, Activity, Clock, AlertCircle } from 'lucide-react';

const MachineryPage = () => {
    // Mock Data for Machinery
    const machines = [
        { id: 'M1', name: 'Conveyor Belt C-2', status: 'operational', health: 92, lastMaintenance: '2d ago' },
        { id: 'M2', name: 'Waste Compactor A', status: 'maintenance', health: 45, lastMaintenance: 'Now' },
        { id: 'M3', name: 'Sorting Arm R-5', status: 'operational', health: 88, lastMaintenance: '5d ago' },
        { id: 'M4', name: 'Shredder Unit S-1', status: 'warning', health: 76, lastMaintenance: '1w ago' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: 'var(--accent-engineer)' }}>
                        <Wrench size={32} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>Heavy Machinery Status</h2>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Real-time health monitoring and maintenance logs</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {machines.map(machine => (
                        <div key={machine.id} style={{
                            background: 'var(--bg-main)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Settings size={20} color="var(--text-tertiary)" />
                                    <span style={{ fontWeight: 600 }}>{machine.name}</span>
                                </div>
                                <div style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    background: machine.status === 'operational' ? 'var(--status-good)' : machine.status === 'maintenance' ? 'var(--status-danger)' : 'var(--status-warning)',
                                    boxShadow: `0 0 10px ${machine.status === 'operational' ? 'var(--status-good)' : machine.status === 'maintenance' ? 'var(--status-danger)' : 'var(--status-warning)'}`
                                }} />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Health Status</span>
                                    <span style={{ fontWeight: 600, color: machine.health > 90 ? 'var(--status-good)' : machine.health > 70 ? 'var(--status-warning)' : 'var(--status-danger)' }}>{machine.health}%</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--bg-panel)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${machine.health}%`,
                                        height: '100%',
                                        background: machine.health > 90 ? 'var(--status-good)' : machine.health > 70 ? 'var(--status-warning)' : 'var(--status-danger)'
                                    }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)' }}>
                                    <Clock size={14} /> Last: {machine.lastMaintenance}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-engineer)', cursor: 'pointer', fontWeight: 500 }}>
                                    <Activity size={14} /> Diagnostics
                                </div>
                            </div>

                            {machine.status !== 'operational' && (
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '0.75rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    color: 'var(--status-danger)',
                                    fontSize: '0.875rem'
                                }}>
                                    <AlertCircle size={16} />
                                    <span>Attention Required</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MachineryPage;
