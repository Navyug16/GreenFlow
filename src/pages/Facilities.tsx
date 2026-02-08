import { useState, useEffect } from 'react';
import { Factory, Zap, Trash2, Activity, AlertTriangle, X, Thermometer, Gauge, BarChart3, Wind, Droplets } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import MapWidget from '../components/MapWidget';
import type { Facility } from '../types';

const FacilitiesPage = () => {
    const { user } = useAuth();
    const { facilities = [] } = useData();
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

    // Simulated Metrics State for the Modal
    const [metrics, setMetrics] = useState({
        temp: 0,
        pressure: 0,
        voltage: 0,
        rpm: 0
    });

    // Animate metrics when a facility is selected
    useEffect(() => {
        if (!selectedFacility) return;

        // Initial random values
        setMetrics({
            temp: 450 + Math.random() * 50,
            pressure: 80 + Math.random() * 10,
            voltage: 11 + Math.random(),
            rpm: 3200 + Math.random() * 200
        });

        const interval = setInterval(() => {
            setMetrics(prev => ({
                temp: prev.temp + (Math.random() - 0.5) * 5,
                pressure: prev.pressure + (Math.random() - 0.5) * 2,
                voltage: prev.voltage + (Math.random() - 0.5) * 0.1,
                rpm: prev.rpm + (Math.random() - 0.5) * 50
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, [selectedFacility]);

    if (user?.role === 'engineer') {
        return <div style={{ padding: '2rem', color: 'white' }}>Access Restricted: Engineers view specific machinery via the dedicated module.</div>;
    }

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
            case 'energy': return '#fbbf24'; // var(--accent-engineer)
            case 'dumpyard': return '#ef4444'; // var(--accent-danger)
            case 'recycle': return '#34d399'; // var(--accent-manager)
            default: return '#f1f5f9'; // var(--text-primary)
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

    // Modal Component
    const FacilityModal = ({ facility, onClose }: { facility: Facility, onClose: () => void }) => {
        const Icon = getIcon(facility.type);
        const color = getColor(facility.type);

        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
            }}>
                <div style={{
                    background: '#1e293b', width: '90%', maxWidth: '800px', borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                }}>
                    {/* Header */}
                    <div style={{ padding: '2rem', background: `linear-gradient(to right, ${color}20, transparent)`, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: color, borderRadius: '16px', color: '#0f172a', boxShadow: `0 0 20px ${color}60` }}>
                                <Icon size={32} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'white' }}>{facility.name}</h2>
                                <p style={{ margin: '0.25rem 0 0', opacity: 0.6, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {facility.region} • <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{facility.type}</span>
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.2s' }}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '2rem', color: 'white' }}>

                        {/* Status Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                            {/* Specific Metrics Based on Type */}
                            {facility.type === 'energy' && (
                                <>
                                    <MetricCard label="Turbine Speed" value={Math.round(metrics.rpm)} unit="RPM" icon={Wind} color="#38bdf8" />
                                    <MetricCard label="Core Temp" value={Math.round(metrics.temp)} unit="°C" icon={Thermometer} color="#f43f5e" />
                                    <MetricCard label="Grid Voltage" value={metrics.voltage.toFixed(2)} unit="kV" icon={Zap} color="#fbbf24" />
                                    <MetricCard label="System Pressure" value={Math.round(metrics.pressure)} unit="Bar" icon={Gauge} color="#a78bfa" />
                                </>
                            )}
                            {facility.type === 'recycle' && (
                                <>
                                    <MetricCard label="Line Speed" value={(metrics.rpm / 1000).toFixed(1)} unit="m/s" icon={Activity} color="#38bdf8" />
                                    <MetricCard label="Contamination" value={(metrics.pressure / 10).toFixed(1)} unit="%" icon={AlertTriangle} color="#f43f5e" />
                                    <MetricCard label="Purity Level" value={(90 + metrics.voltage).toFixed(1)} unit="%" icon={Zap} color="#34d399" />
                                    <MetricCard label="Bales/Hr" value={Math.round(metrics.rpm / 50)} unit="Units" icon={Factory} color="#a78bfa" />
                                </>
                            )}
                            {facility.type === 'dumpyard' && (
                                <>
                                    <MetricCard label="Methane Level" value={(metrics.pressure * 2).toFixed(0)} unit="ppm" icon={Wind} color="#34d399" />
                                    <MetricCard label="Soil Moisture" value={(metrics.voltage * 4).toFixed(1)} unit="%" icon={Droplets} color="#38bdf8" />
                                    <MetricCard label="Compression" value={(metrics.rpm / 500).toFixed(1)} unit="x" icon={BarChart3} color="#fbbf24" />
                                    <MetricCard label="Capacity" value={Math.round((facility.currentLoad / facility.capacity) * 100)} unit="%" icon={Gauge} color="#f43f5e" />
                                </>
                            )}
                        </div>

                        {/* Main Info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>Operational Overview</h3>
                                <p style={{ lineHeight: '1.6', opacity: 0.8, fontSize: '0.95rem' }}>{facility.description} Currently operating at optimized levels with automated systems monitoring operational integrity.</p>

                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.25rem' }}>Daily Output</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{facility.output?.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 400, opacity: 0.7 }}>{getUnit(facility.type)}</span></div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.25rem' }}>Incoming Load</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{facility.incomingWaste?.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 400, opacity: 0.7 }}>Tons</span></div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>Efficiency</h3>
                                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* Simple Pure CSS Gauge */}
                                    <div style={{
                                        width: '180px', height: '180px', borderRadius: '50%',
                                        background: `conic-gradient(${color} 0% 75%, rgba(255,255,255,0.1) 75% 100%)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: `0 0 30px ${color}30`
                                    }}>
                                        <div style={{ width: '150px', height: '150px', background: '#1e293b', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: color }}>94%</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>OEE Score</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* Footer Actions */}
                    <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
                        <button style={{ padding: '0.75rem 1.5rem', background: color, color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 12px ${color}40` }}>Download Report</button>
                    </div>
                </div>
            </div>
        );
    };

    const MetricCard = ({ label, value, unit, icon: Icon, color }: any) => (
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: color, fontSize: '0.85rem', fontWeight: 500 }}>
                <Icon size={16} /> {label}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {value} <span style={{ fontSize: '0.85rem', opacity: 0.5, fontWeight: 400 }}>{unit}</span>
            </div>
        </div>
    );

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
                {Array.isArray(facilities) && facilities.map(facility => {
                    if (!facility) return null;
                    const Icon = getIcon(facility.type);
                    const color = getColor(facility.type);

                    return (
                        <div key={facility.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                            {facility.name?.includes('West') && facility.type === 'dumpyard' && (
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
                                            {facility.region} • {facility.type?.replace('_', ' ')}
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
                                    {facility.status?.toUpperCase()}
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
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--status-good)' }}>SAR {facility.revenue?.toLocaleString()}</div>
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
                                    {facility.currentLoad?.toLocaleString()} / {facility.capacity?.toLocaleString()} Tons
                                </div>
                            </div>

                            {/* Categories */}
                            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {facility.wasteCategory?.map(cat => (
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
                                <button
                                    onClick={() => setSelectedFacility(facility)}
                                    style={{
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

            {/* Render Modal */}
            {selectedFacility && (
                <FacilityModal facility={selectedFacility} onClose={() => setSelectedFacility(null)} />
            )}
        </div>
    );
};

export default FacilitiesPage;
