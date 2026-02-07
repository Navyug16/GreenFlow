import { Factory, Zap, Trash2, Activity, AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import MapWidget from '../components/MapWidget';

const FacilitiesPage = () => {
    const { user } = useAuth();

    if (user?.role === 'engineer') {
        return <div style={{ padding: '2rem', color: 'white' }}>Access Restricted: Engineers view specific machinery via the dedicated module.</div>;
    }

    const { facilities = [] } = useData();

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



    // ... (existing imports/code)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Facility Map View */}
            <div className="card" style={{ height: '400px', padding: '0.5rem' }}>
                <MapWidget showBins={false} />
            </div>

            {/* Header / Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
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
                            {facility.name.includes('West') && facility.type === 'dumpyard' && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    background: 'var(--accent-danger)',
                                    color: 'white',
                                    padding: '0.25rem 1rem',
                                    borderBottomLeftRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700
                                }}>
                                    RESTRICTED
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                                            {facility.region} • {facility.type.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div style={{
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
                            </div>

                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '3rem', fontSize: '0.9rem' }}>
                                {facility.description}
                            </p>

                            {/* Metrics Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Incoming Waste</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{facility.incomingWaste} <span style={{ fontSize: '0.8rem' }}>Tons/day</span></div>
                                </div>
                                <div style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Revenue</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--status-good)' }}>SAR {facility.revenue.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Utilization Bar */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Capacity Utilization</span>
                                    <span style={{ fontWeight: 600 }}>{Math.round((facility.currentLoad / facility.capacity) * 100)}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--bg-panel)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(facility.currentLoad / facility.capacity) * 100}%`,
                                        height: '100%',
                                        background: (facility.currentLoad / facility.capacity) > 0.9 ? 'var(--status-danger)' : color,
                                        borderRadius: '4px'
                                    }} />
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                                    {facility.currentLoad.toLocaleString()} / {facility.capacity.toLocaleString()} Tons
                                </div>
                            </div>

                            {/* Categories */}
                            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {facility.wasteCategory.map(cat => (
                                    <span key={cat} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                                        {cat}
                                    </span>
                                ))}
                            </div>

                            <div style={{
                                background: 'var(--bg-main)',
                                padding: '1rem',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Output ({facility.type === 'energy' ? 'Energy' : 'Recycled'})</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
                                    {facility.output} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{getUnit(facility.type)}</span>
                                </span>
                            </div>

                            {/* Controls */}
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
