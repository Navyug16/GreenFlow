import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatsCard from '../components/StatsCard';
import MapWidget from '../components/MapWidget';
import {
    ADMIN_STATS, MANAGER_STATS, ENGINEER_STATS, FINANCE_STATS,
    RECENT_INCIDENTS
} from '../data/mockData';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const Overview = () => {
    const { user } = useAuth();
    const { requests, approveRequest } = useData();

    const stats = useMemo(() => {
        if (!user) return [];
        switch (user.role) {
            case 'admin': return ADMIN_STATS;
            case 'manager': return MANAGER_STATS;
            case 'engineer': return ENGINEER_STATS;
            case 'finance': return FINANCE_STATS;
            default: return [];
        }
    }, [user]);

    if (!user) return null;

    // Filter to only show pending requests in the dashboard list
    const pendingRequests = requests.filter(r => r.status === 'pending');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Stats Row */}
            <div className="grid-overview">
                {stats.map((stat, idx) => (
                    <StatsCard key={idx} stat={stat} />
                ))}
            </div>

            {/* 2. Main Visual Area (Map + Incidents) */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', height: '600px' }}>

                {/* Map Container */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0 }}>Live Operations Map</h3>
                        <span style={{ fontSize: '0.875rem', color: 'var(--accent-admin)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="pulse-dot" style={{ width: 8, height: 8, background: 'currentColor', borderRadius: '50%' }}></span>
                            Live Feed
                        </span>
                    </div>
                    <div style={{ flex: 1 }}>
                        <MapWidget />
                    </div>
                </div>

                {/* Side Panel (Incidents / Activity / Requests) */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>
                        {user.role === 'admin' ? 'Pending Requests' : user.role === 'engineer' ? 'Maintenance Alerts' : 'Recent Incidents'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                        {user.role === 'admin' ? (
                            pendingRequests.length > 0 ? (
                                pendingRequests.map(req => (
                                    <div key={req.id} style={{
                                        padding: '1rem',
                                        background: 'rgba(56, 189, 248, 0.05)',
                                        borderRadius: '8px',
                                        borderLeft: `4px solid var(--accent-admin)`
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-admin)' }}>{req.type.toUpperCase()} REQUEST</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{req.date}</span>
                                        </div>
                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>{req.notes}</p>
                                        {req.details && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}><b>{req.details}</b></p>}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>From: {req.requester}</span>
                                            <button
                                                onClick={() => approveRequest(req.id)}
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    background: 'var(--status-good)',
                                                    color: 'black',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem' }}>No pending requests</div>
                            )
                        ) : (
                            RECENT_INCIDENTS.map((inc) => (
                                <div key={inc.id} style={{
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '8px',
                                    borderLeft: `4px solid ${inc.severity === 'high' ? 'var(--status-danger)' : inc.severity === 'medium' ? 'var(--status-warning)' : 'var(--status-good)'}`
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.125rem 0.5rem',
                                            borderRadius: '4px',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: 'var(--text-tertiary)'
                                        }}>
                                            {inc.type.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{inc.timestamp}</span>
                                    </div>
                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>{inc.message}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                                        {inc.resolved ? (
                                            <span style={{ color: 'var(--status-good)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <CheckCircle size={14} /> Resolved
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <AlertTriangle size={14} /> Action Required
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
