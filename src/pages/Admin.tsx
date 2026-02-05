import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Database, RefreshCw, Users, Shield, Server } from 'lucide-react';

const AdminPage = () => {
    const { user } = useAuth(); // Ensure only admin can access this in UI
    const { seedDatabase } = useData();
    const [seeding, setSeeding] = React.useState(false);

    const handleSeed = async () => {
        setSeeding(true);
        await seedDatabase();
        setSeeding(false);
    };

    if (user?.role !== 'admin') {
        return <div style={{ padding: '2rem', color: 'white' }}>Access Denied</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: 'var(--accent-admin)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={20} />
                    <span>System Administrator</span>
                </div>
            </div>

            {/* System Status / Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Database Management Card */}
                <div className="card" style={{ borderColor: 'var(--accent-warning)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '12px', color: 'var(--accent-warning)' }}>
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Database Management</h3>
                            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Maintenance & Data Integrity</p>
                        </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Reset the system database to its initial mock state. This is useful for demos or recovering from data corruption.
                        <strong> Warning: This will overwrite existing data.</strong>
                    </p>

                    <button
                        onClick={handleSeed}
                        disabled={seeding}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'var(--accent-warning)',
                            color: 'var(--bg-main)',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 600,
                            cursor: seeding ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: seeding ? 0.7 : 1
                        }}
                    >
                        {seeding ? <RefreshCw size={20} className="spin" /> : <RefreshCw size={20} />}
                        {seeding ? 'Seeding Database...' : 'Seed / Reset Database'}
                    </button>
                </div>

                {/* User Management Card (Visual) */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: 'var(--accent-admin)' }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>User Management</h3>
                            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Role & Access Control</p>
                        </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Manage system users and role assignments. Currently connected to Firebase Auth.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--status-good)' }}></div>
                                <span>Ali Al-Ahmed (You)</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: 'var(--accent-admin)' }}>ADMIN</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-tertiary)' }}></div>
                                <span>Sara Al-Mansoori</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(34, 197, 94, 0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: 'var(--accent-manager)' }}>MANAGER</span>
                        </div>
                    </div>
                </div>

                {/* System Health */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--status-good)' }}>
                            <Server size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>System Health</h3>
                            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Operational Status</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--status-good)' }}>99.9%</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Uptime</div>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>45ms</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Latency</div>
                        </div>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        All services operational. version v1.2.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
