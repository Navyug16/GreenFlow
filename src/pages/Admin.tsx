import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
    Check, X, AlertTriangle, Activity, Users, Shield,
    BarChart3, Truck, Trash2, Zap, FileText, Plus
} from 'lucide-react';
import type { User } from '../types';

const AdminPage = () => {
    const { user, auditLog } = useAuth(); // Get real audit log

    if (user?.role !== 'admin') {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <h2>Access Restricted</h2>
                <p>Only Administrators can access this dashboard.</p>
            </div>
        );
    }

    const { users, updateUserRole, addUser, requests, approveRequest, rejectRequest, facilities, trucks, bins, incidents } = useData();
    const [showAddUser, setShowAddUser] = useState(false);
    const [newUser, setNewUser] = useState<Partial<User>>({
        name: '',
        role: 'manager',
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
    });

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.name) return;

        const userToAdd: User = {
            id: `u-${Date.now()}`,
            name: newUser.name,
            role: newUser.role as any,
            avatar: newUser.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
            // Add other required fields if any
        };

        await addUser(userToAdd);
        setShowAddUser(false);
        setNewUser({ name: '', role: 'manager', avatar: `https://i.pravatar.cc/150?u=${Math.random()}` });
    };

    if (user?.role !== 'admin') {
        return <div style={{ padding: '2rem', color: 'white' }}>Access Denied</div>;
    }

    // KPI Calculations
    const activeTrucks = trucks.filter(t => t.status === 'active').length;
    const fleetUptime = Math.round((activeTrucks / trucks.length) * 100) || 0;
    const avgFillLevel = Math.round(bins.reduce((acc, b) => acc + b.fillLevel, 0) / bins.length) || 0;
    const unresolvedIncidents = incidents.filter(i => !i.resolved).length;

    // Mock Revenue Calculation (but using real lengths)
    const estRevenue = (bins.length * 150) + (trucks.length * 500);

    const pendingRequests = requests.filter(r => r.status === 'pending');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-tertiary)' }}>System Overview & Control Panel</p>
                </div>
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: 'var(--accent-admin)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={20} />
                    <span>System Administrator</span>
                </div>
            </div>

            {/* System KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Collection Efficiency</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--status-good)' }}>{avgFillLevel}%</div>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '8px', color: 'var(--status-good)' }}>
                            <Trash2 size={24} />
                        </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg. Bin Utilization</div>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(56, 189, 248, 0.05))', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Fleet Uptime</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-admin)' }}>{fleetUptime}%</div>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(56, 189, 248, 0.2)', borderRadius: '8px', color: 'var(--accent-admin)' }}>
                            <Truck size={24} />
                        </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{activeTrucks} / {trucks.length} Active Vehicles</div>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Est. Revenue</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-warning)' }}>{estRevenue.toLocaleString()} SAR</div>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '8px', color: 'var(--accent-warning)' }}>
                            <BarChart3 size={24} />
                        </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monthly Projection</div>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>System Alerts</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-danger)' }}>{unresolvedIncidents}</div>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: 'var(--accent-danger)' }}>
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Unresolved Incidents</div>
                </div>
            </div>

            {/* User Management Card (Moved Here) */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: 'var(--accent-admin)' }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>User Management</h3>
                            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Role & Access Control</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddUser(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'var(--accent-admin)',
                            color: 'var(--bg-main)',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={18} />
                        Add User
                    </button>
                </div>

                {showAddUser && (
                    <div style={{
                        marginBottom: '1.5rem',
                        padding: '1.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <h4 style={{ margin: '0 0 1rem 0' }}>Add New Team Member</h4>
                        <form onSubmit={handleAddUser} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value as any })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                >
                                    <option value="manager">Manager</option>
                                    <option value="engineer">Engineer</option>
                                    <option value="finance">Finance</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Avatar URL (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={newUser.avatar}
                                    onChange={e => setNewUser({ ...newUser, avatar: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    type="submit"
                                    style={{ flex: 1, padding: '0.75rem', background: 'var(--status-good)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Create User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddUser(false)}
                                    style={{ padding: '0.75rem', background: 'var(--glass-border)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {users.length > 0 ? (
                        users.map(u => (
                            <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--glass-border)', overflow: 'hidden' }}>
                                        <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{u.name || 'Unknown User'}</div>
                                        <div style={{ fontSize: '0.75rem', color: u.role === 'admin' ? 'var(--status-good)' : 'var(--text-tertiary)' }}>{u.role.toUpperCase()}</div>
                                    </div>
                                </div>
                                <select
                                    value={u.role}
                                    onChange={(e) => updateUserRole(u.id, e.target.value)}
                                    style={{
                                        fontSize: '0.75rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        color: 'white',
                                        border: '1px solid var(--glass-border)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="engineer">Engineer</option>
                                    <option value="finance">Finance</option>
                                </select>
                            </div>
                        ))
                    ) : (
                        <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '1rem' }}>
                            No users found in database.
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Grid: Pending Requests, Facilities, Activity Log */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Pending Requests */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                        <FileText size={20} color="var(--accent-admin)" />
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Pending Requests</h3>
                        <div style={{ marginLeft: 'auto', background: 'var(--accent-admin)', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                            {pendingRequests.length} Pending
                        </div>
                    </div>

                    {pendingRequests.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {pendingRequests.map(req => (
                                <div key={req.id} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    border: '1px solid var(--glass-border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 600, fontSize: '1rem' }}>{req.type}</span>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {req.details || req.notes}
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                            <span>{req.date}</span>
                                            {req.cost && <span>{req.cost} SAR</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => approveRequest(req.id)}
                                            style={{ padding: '0.5rem', background: 'var(--status-good)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white' }}
                                            title="Approve"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={() => rejectRequest(req.id)}
                                            style={{ padding: '0.5rem', background: 'var(--accent-danger)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white' }}
                                            title="Reject"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                            <Check size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>No pending requests.</p>
                        </div>
                    )}
                </div>

                {/* Facility Overview */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                        <Zap size={20} color="var(--accent-manager)" />
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Facilities Overview</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {facilities.map(fac => (
                            <div key={fac.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>{fac.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{fac.type}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: fac.status === 'operational' ? 'var(--status-good)' : 'var(--accent-danger)' }}>
                                        {fac.status.toUpperCase()}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                        Output: {fac.output}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Log */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <Activity size={20} color="var(--text-secondary)" />
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Activity Log</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {auditLog && auditLog.length > 0 ? (
                            auditLog.map(log => (
                                <div key={log.id} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.type === 'system' ? 'var(--text-tertiary)' : 'var(--accent-admin)', marginTop: '6px' }} />
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{log.user}</div>
                                        <div style={{ color: 'var(--text-secondary)' }}>{log.action}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{log.time}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '1rem' }}>No recent activity.</div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AdminPage;
