import { useState } from 'react';
import { Wrench, Settings, Activity, Clock, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import type { Machine } from '../types';

const MachineryPage = () => {
    const { user } = useAuth();
    const { machinery, updateMachine } = useData();

    const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
    const [maintenanceNotes, setMaintenanceNotes] = useState('');

    if (user?.role !== 'engineer' && user?.role !== 'admin' && user?.role !== 'finance') {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <h2>Access Restricted</h2>
                <p>Only Engineers and Admins manage heavy machinery.</p>
            </div>
        );
    }

    const handleUpdateStatus = (id: string, newStatus: string) => {
        updateMachine(id, {
            status: newStatus as any,
            lastMaintenance: newStatus === 'operational' ? 'Just Now' : undefined
        });

        if (maintenanceNotes) {
            console.log(`Maintenance Log for ${id}: ${maintenanceNotes}`);
            alert('Maintenance log recorded and status updated.');
        }
        setMaintenanceNotes('');
        setSelectedMachine(null);
    };

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
                    {machinery.map(machine => (
                        <div
                            key={machine.id}
                            onClick={() => setSelectedMachine(machine)}
                            style={{
                                background: 'var(--bg-main)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Settings size={20} color="var(--text-tertiary)" />
                                    <span style={{ fontWeight: 600 }}>{machine.name}</span>
                                </div>
                                <div style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    background: machine.status === 'operational' ? 'var(--status-good)' : machine.status === 'maintenance' || machine.status === 'repair' ? 'var(--status-danger)' : 'var(--status-warning)',
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-engineer)', fontWeight: 500 }}>
                                    <Activity size={14} /> {user?.role === 'engineer' ? 'Diagnose' : 'Details'}
                                </div>
                            </div>

                            {(machine.status === 'maintenance' || machine.status === 'repair') && (
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--status-danger)',
                                    fontSize: '0.75rem'
                                }}>
                                    <Wrench size={14} />
                                    <span>Work Order Active</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Maintenance Modal */}
            {selectedMachine && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '450px', padding: '2rem', animation: 'slideIn 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Settings color="var(--accent-engineer)" />
                                {selectedMachine.name}
                            </h2>
                            <button onClick={() => setSelectedMachine(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Health Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Current Status</div>
                                    <div style={{
                                        color: selectedMachine.status === 'operational' ? 'var(--status-good)' : 'var(--status-danger)',
                                        fontWeight: 600,
                                        marginTop: '0.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        {selectedMachine.status === 'operational' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                                        {selectedMachine.status.toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>System Health</div>
                                    <div style={{
                                        color: selectedMachine.health > 80 ? 'var(--status-good)' : 'var(--status-warning)',
                                        fontWeight: 600,
                                        marginTop: '0.25rem'
                                    }}>
                                        {selectedMachine.health}% Efficiency
                                    </div>
                                </div>
                            </div>

                            {/* Engineer Controls */}
                            {user?.role === 'engineer' ? (
                                <div style={{ animation: 'fadeIn 0.3s' }}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Update Status</label>
                                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedMachine.id, 'operational')}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                border: '1px solid var(--status-good)',
                                                background: selectedMachine.status === 'operational' ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                                                color: 'var(--status-good)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            Operational
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Just strictly setting UI selection for now, logic handled in select or future robust form
                                                // For this simple UI, we might want a dropdown instead if saving is separate
                                            }}
                                            // Using formatting for "Under Repair" logic
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                border: '1px solid var(--status-danger)',
                                                background: selectedMachine.status === 'maintenance' || selectedMachine.status === 'repair' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                                                color: 'var(--status-danger)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            Maintenance
                                        </button>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>New Status</label>
                                        <select
                                            id="machine-status-select"
                                            defaultValue={selectedMachine.status}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                background: 'var(--bg-main)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: 'var(--radius-sm)',
                                                color: 'white'
                                            }}
                                        >
                                            <option value="operational">Operational</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="repair">Under Repair</option>
                                            <option value="warning">Warning Check</option>
                                        </select>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Simulate Health: {selectedMachine.health}%</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={selectedMachine.health}
                                            onChange={(e) => {
                                                const v = parseInt(e.target.value);
                                                updateMachine(selectedMachine.id, { health: v });
                                                setSelectedMachine(p => p ? { ...p, health: v } : null);
                                            }}
                                            style={{ width: '100%', cursor: 'pointer' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Maintenance Log / Notes</label>
                                        <textarea
                                            value={maintenanceNotes}
                                            onChange={(e) => setMaintenanceNotes(e.target.value)}
                                            placeholder="Log diagnostic codes, parts replaced, or issues found..."
                                            rows={4}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                background: 'var(--bg-main)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: 'var(--radius-sm)',
                                                color: 'white',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    <button
                                        onClick={() => {
                                            const select = document.getElementById('machine-status-select') as HTMLSelectElement;
                                            handleUpdateStatus(selectedMachine.id, select.value);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'var(--accent-engineer)',
                                            border: 'none',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'black',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Wrench size={18} /> Update Status & Log
                                    </button>
                                </div>
                            ) : (
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Last Maintenance</div>
                                    <div style={{ fontWeight: 600 }}>{selectedMachine.lastMaintenance}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Next Service Due</div>
                                    <div style={{ fontWeight: 600 }}>{selectedMachine.nextDue}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default MachineryPage;
