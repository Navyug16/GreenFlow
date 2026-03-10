import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatsCard from '../components/StatsCard';
import MapWidget from '../components/MapWidget';
import { FinanceDashboard } from '../components/FinanceDashboard';

const Overview = () => {
    const { user } = useAuth();
    const { requests, approveRequest, trucks, bins, facilities, incidents } = useData();

    const stats = useMemo(() => {
        if (!user) return [];

        // Dynamic Stats Calculation
        const activeTrucks = trucks.filter(t => t.status === 'active').length;
        const totalIncidents = incidents.filter(i => !i.resolved).length;
        const avgBinLevel = bins.length > 0 ? Math.round(bins.reduce((acc, b) => acc + b.fillLevel, 0) / bins.length) : 0;
        const totalRevenue = facilities.reduce((acc, f) => acc + (f.revenue || 0), 0);
        const operatingExpenses = trucks.reduce((acc, t) => acc + ((100 - (t.fuel || 0)) * 5), 0); // Simulated expense based on fuel used

        switch (user.role) {
            case 'admin':
                return [
                    { label: 'Total Revenue', value: `${(totalRevenue / 1000).toFixed(1)}K`, unit: 'SAR', change: 12, icon: 'DollarSign', color: 'var(--status-good)' },
                    { label: 'Active Fleet', value: activeTrucks, unit: 'Trucks', change: 5, icon: 'Truck', color: 'var(--accent-admin)' },
                    { label: 'Open Incidents', value: totalIncidents, unit: 'Alerts', change: -8, icon: 'AlertTriangle', color: 'var(--status-danger)' },
                    { label: 'System Health', value: '98.2', unit: '%', change: 1.5, icon: 'ShieldCheck', color: 'var(--status-good)' }
                ];
            case 'manager':
                return [
                    { label: 'Region Efficiency', value: '94.5', unit: '%', change: 3.2, icon: 'TrendingUp', color: 'var(--status-good)' },
                    { label: 'Bins To Collect', value: bins.filter(b => b.fillLevel > 80).length, unit: 'Bins', change: 15, icon: 'Trash2', color: 'var(--status-warning)' },
                    { label: 'Average Fill', value: avgBinLevel, unit: '%', change: 4.8, icon: 'BarChart3', color: 'var(--accent-manager)' },
                    { label: 'Active Shifts', value: '18', unit: 'Drivers', change: 0, icon: 'Users', color: 'var(--accent-manager)' }
                ];
            case 'engineer':
                return [
                    { label: 'Fleet Health', value: Math.round(trucks.reduce((acc, t) => acc + t.health, 0) / trucks.length), unit: '%', change: -1.2, icon: 'Activity', color: 'var(--status-warning)' },
                    { label: 'Critical Assets', value: trucks.filter(t => t.health < 40).length + bins.filter(b => b.health < 40).length, unit: 'Items', change: 2, icon: 'Settings', color: 'var(--status-danger)' },
                    { label: 'Maint. Costs', value: (operatingExpenses / 10).toFixed(0), unit: 'SAR', change: 5.4, icon: 'Tool', color: 'var(--accent-engineer)' },
                    { label: 'Energy Output', value: (facilities.filter(f => f.type === 'energy').reduce((acc, f) => acc + f.output, 0) / 1000).toFixed(1), unit: 'MW', change: 8.2, icon: 'Zap', color: 'var(--status-good)' }
                ];
            default: return [];
        }
    }, [user, trucks, bins, facilities, incidents]);

    const displayRequests = useMemo(() => {
        if (!user) return [];
        if (user.role === 'admin') {
            return requests.filter(r => r.status === 'pending');
        } else if (user.role === 'manager') {
            return requests.filter(r => r.requester === user.name || r.requester === 'Manager');
        }
        return [];
    }, [requests, user]);

    if (!user) return null;

    if (user.role === 'finance') {
        return <FinanceDashboard />;
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Stats Row */}
            <div className="grid-overview">
                {stats.map((stat, idx) => (
                    <StatsCard key={idx} stat={stat} />
                ))}
            </div>

            {/* 2. Main Visual Area */}
            <div className="grid-desktop-2col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', minHeight: '500px' }}>

                {/* Left/Main Column: Map or Engineer List */}
                <div className="card map-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>

                    {user.role !== 'engineer' ? (
                        /* Standard Map View for Admin & Manager */
                        <>
                            <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>
                                    {user.role === 'manager' ? 'West Region Live Map' : 'Live Operations Map'}
                                </h3>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    {user.role === 'manager' && (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Region: West Riyadh</span>
                                    )}
                                    <span style={{ fontSize: '0.875rem', color: 'var(--accent-admin)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className="pulse-dot" style={{ width: 8, height: 8, background: 'currentColor', borderRadius: '50%' }}></span>
                                        Real-time
                                    </span>
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <MapWidget />
                            </div>
                        </>
                    ) : (
                        /* Engineer specific view: Critical Assets List + Map Preview */
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                <h3 style={{ margin: 0 }}>Asset Health Monitor</h3>
                            </div>
                            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-tertiary)' }}>
                                            <th style={{ padding: '0.5rem' }}>Asset ID</th>
                                            <th style={{ padding: '0.5rem' }}>Type</th>
                                            <th style={{ padding: '0.5rem' }}>Status</th>
                                            <th style={{ padding: '0.5rem' }}>Health</th>
                                            <th style={{ padding: '0.5rem' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Mock filtering for "Engineer" relevant assets */}
                                        {[
                                            { id: 'T-03', type: 'Truck', status: 'maintenance', health: 45 },
                                            { id: 'M2', type: 'Compactor', status: 'repair', health: 30 },
                                            { id: 'M5', type: 'Hydraulic Press', status: 'repair', health: 30 },
                                            { id: 'B-07', type: 'Bin', status: 'maintenance', health: 40 }
                                        ].map(asset => (
                                            <tr key={asset.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{asset.id}</td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>{asset.type}</td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '4px',
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        color: 'var(--status-danger)',
                                                        fontSize: '0.75rem',
                                                        textTransform: 'uppercase'
                                                    }}>{asset.status}</span>
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ width: '60px', height: '6px', background: 'var(--bg-main)', borderRadius: '3px' }}>
                                                            <div style={{ width: `${asset.health}%`, height: '100%', background: 'var(--status-danger)', borderRadius: '3px' }} />
                                                        </div>
                                                        <span>{asset.health}%</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                    <button style={{
                                                        padding: '0.25rem 0.75rem',
                                                        background: 'var(--text-primary)',
                                                        color: 'var(--bg-main)',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600
                                                    }}>Inspect</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Role Specific Panels */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '600px', overflow: 'hidden' }}>
                    <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>
                            {user.role === 'admin' ? 'System Alerts & Requests' :
                                user.role === 'manager' ? 'Route Status' :
                                    user.role === 'engineer' ? 'Work Orders' : 'Notifications'}
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }}>

                        {/* ADMIN VIEW */}
                        {user.role === 'admin' && (
                            <>
                                {/* Critical Alerts First */}
                                {incidents.filter(i => i.severity === 'high' && !i.resolved).map(inc => (
                                    <div key={inc.id} style={{
                                        padding: '0.75rem',
                                        background: 'rgba(239, 68, 68, 0.05)',
                                        borderRadius: '8px',
                                        borderLeft: '4px solid var(--status-danger)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--status-danger)' }}>CRITICAL ALERT</span>
                                            <span style={{ color: 'var(--text-tertiary)' }}>{inc.timestamp}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.85rem' }}>{inc.message}</p>
                                    </div>
                                ))}

                                {/* Pending Requests */}
                                {displayRequests.length > 0 ? (
                                    displayRequests.map(req => (
                                        <div key={req.id} style={{
                                            padding: '0.75rem',
                                            background: 'rgba(56, 189, 248, 0.05)',
                                            borderRadius: '8px',
                                            borderLeft: `4px solid var(--accent-admin)`
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Requests Approval</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{req.date}</span>
                                            </div>
                                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>{req.notes}</p>
                                            <button
                                                onClick={() => approveRequest(req.id)}
                                                style={{ width: '100%', padding: '0.5rem', background: 'var(--status-good)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                                            >
                                                Approve Request
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '1rem' }}>No pending requests</div>
                                )}
                            </>
                        )}

                        {/* MANAGER VIEW */}
                        {user.role === 'manager' && (
                            <>
                                {/* Route Performance List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {[
                                        { id: 'T8', name: 'West Valley', status: 'active', progress: 60 },
                                        { id: 'T3', name: 'South Ind.', status: 'delayed', progress: 45 }, // Maybe shared region
                                    ].map(route => (
                                        <div key={route.id} style={{
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '8px',
                                            border: '1px solid var(--glass-border)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 500 }}>{route.name}</span>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.125rem 0.5rem',
                                                    borderRadius: '10px',
                                                    background: route.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                                    color: route.status === 'active' ? 'var(--status-good)' : 'var(--status-warning)'
                                                }}>
                                                    {route.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                <div style={{ flex: 1, height: '6px', background: 'var(--bg-main)', borderRadius: '3px' }}>
                                                    <div style={{ width: `${route.progress}%`, height: '100%', background: 'var(--accent-manager)', borderRadius: '3px' }} />
                                                </div>
                                                <span>{route.progress}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h4 style={{ margin: '1rem 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Collection Alerts</h4>
                                {incidents.slice(0, 2).map(inc => (
                                    <div key={inc.id} style={{ fontSize: '0.8rem', padding: '0.5rem', borderLeft: '3px solid var(--status-warning)', background: 'rgba(255,255,255,0.02)' }}>
                                        {inc.message}
                                    </div>
                                ))}
                            </>
                        )}

                        {/* ENGINEER VIEW */}
                        {user.role === 'engineer' && (
                            <>
                                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid var(--accent-engineer)' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Repair Bin B-07</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sensor failure reported. Priority: High</div>
                                </div>
                                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid var(--accent-engineer)' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Truck T-03 Service</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Scheduled maintenance due. Mileage limit reached.</div>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Overview;
