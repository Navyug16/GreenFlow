import { useState, useMemo, useCallback } from 'react';
import { Truck as TruckIcon, Trash2, Battery, AlertTriangle, CheckCircle2, Search, Gauge, Plus, X, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import type { Truck, Bin } from '../types';

interface StatsCardProps {
    label: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
}

const StatsCard = ({ label, value, icon: Icon, color }: StatsCardProps) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${color}20`, color: color }}>
            <Icon size={24} />
        </div>
        <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
        </div>
    </div>
);

const AssetsPage = ({ defaultTab = 'trucks', hideTabs = false }: { defaultTab?: 'trucks' | 'bins', hideTabs?: boolean }) => {
    const { user } = useAuth();
    const { trucks, bins, addTruck, addBin, addRequest, deleteTruck, deleteBin } = useData();

    const [activeTab, setActiveTab] = useState<'trucks' | 'bins'>(defaultTab);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'maintenance'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Request Modal State (Manager)
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestType, setRequestType] = useState('Truck');
    const [requestNotes, setRequestNotes] = useState('');
    const [requestLocation, setRequestLocation] = useState('');
    const [requestCapacity, setRequestCapacity] = useState('');
    const [requestRoute, setRequestRoute] = useState('');
    const [requestCost, setRequestCost] = useState('');

    // Add Asset Modal State (Admin)
    const [showAddAssetModal, setShowAddAssetModal] = useState(false);
    const [newAssetType, setNewAssetType] = useState('Truck');
    const [newAssetCode, setNewAssetCode] = useState(''); // Plate or ID
    const [newAssetRoute, setNewAssetRoute] = useState('');
    const [newAssetLocation, setNewAssetLocation] = useState('');
    const [newAssetCost, setNewAssetCost] = useState('');

    // Truck/Bin Details Modal State
    const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
    const [selectedBin, setSelectedBin] = useState<Bin | null>(null);

    const filteredTrucks = useMemo(() => trucks.filter(t =>
        (filterStatus === 'all' || t.status === filterStatus) &&
        (t.code.toLowerCase().includes(searchTerm.toLowerCase()) || t.type.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [trucks, filterStatus, searchTerm]);

    const filteredBins = useMemo(() => bins.filter(b =>
        (filterStatus === 'all' || b.status === filterStatus) &&
        (b.id.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [bins, filterStatus, searchTerm]);

    const handleRequestSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const details = requestType === 'Bin' ? `Location: ${requestLocation}, Cost: ${requestCost}` : requestType === 'Truck' ? `Capacity: ${requestCapacity}, Route: ${requestRoute}` : '';

        addRequest({
            id: `req-${Date.now()}`,
            type: requestType,
            notes: requestNotes,
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            requester: user?.name || 'Manager', // specific manager name
            details: details,
            route: requestRoute,
            capacity: requestCapacity,
            location: requestLocation,
            cost: requestCost ? parseFloat(requestCost) : 0
        });

        alert(`Request Submitted to Admin`);
        setShowRequestModal(false);
        setRequestNotes('');
        setRequestLocation('');
        setRequestCapacity('');
        setRequestRoute('');
        setRequestCost('');
    }, [addRequest, requestType, requestNotes, requestLocation, requestCost, requestCapacity, requestRoute, user?.name]);

    const handleAddAssetSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (newAssetType === 'Truck') {
            addTruck({
                id: `T-${Date.now()}`,
                code: newAssetCode || `T-${Math.floor(Math.random() * 1000)}`,
                type: 'Compactor',
                status: 'active',
                fuel: 100,
                mileage: 0,
                lastService: 'New',
                driver: 'Unassigned',
                plate: 'New',
                capacity: 'N/A',
                totalHours: 0,
                route: newAssetRoute || 'Unassigned'
            });
        } else {
            addBin({
                id: newAssetCode || `B-${Math.floor(Math.random() * 10000)}`,
                lat: 24.71,
                lng: 46.67,
                fillLevel: 0,
                status: 'active',
                lastCollection: 'Just now',
                location: newAssetLocation || 'Unknown',
                cost: newAssetCost ? parseFloat(newAssetCost) : 0
            });
        }
        setShowAddAssetModal(false);
        setNewAssetCode('');
        setNewAssetRoute('');
        setNewAssetLocation('');
        setNewAssetCost('');
    }, [addTruck, addBin, newAssetType, newAssetCode, newAssetRoute, newAssetLocation, newAssetCost]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatsCard label="Total Assets" value={trucks.length + bins.length} icon={Gauge} color="var(--accent-admin)" />
                <StatsCard label="Active Fleet" value={trucks.filter(t => t.status === 'active').length} icon={TruckIcon} color="var(--status-good)" />
                <StatsCard label="Smart Bins" value={bins.length} icon={Trash2} color="var(--accent-manager)" />
                <StatsCard label="Maintenance" value={trucks.filter(t => t.status === 'maintenance').length + bins.filter(b => b.status === 'maintenance').length} icon={AlertTriangle} color="var(--accent-danger)" />
            </div>

            {/* Main Content Area */}
            <div className="card" style={{ minHeight: '600px' }}>
                {/* Toolbar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {!hideTabs && (
                            <div style={{ display: 'flex', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', padding: '4px' }}>
                                <button
                                    onClick={() => setActiveTab('trucks')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: activeTab === 'trucks' ? 'var(--accent-admin)' : 'transparent',
                                        border: 'none',
                                        color: activeTab === 'trucks' ? 'white' : 'var(--text-tertiary)',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <TruckIcon size={16} /> Trucks
                                </button>
                                <button
                                    onClick={() => setActiveTab('bins')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: activeTab === 'bins' ? 'var(--accent-manager)' : 'transparent',
                                        border: 'none',
                                        color: activeTab === 'bins' ? 'white' : 'var(--text-tertiary)',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Trash2 size={16} /> Bins
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {/* Dynamic Button Based on Role */}
                        {user?.role === 'manager' && (
                            <button
                                onClick={() => setShowRequestModal(true)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'linear-gradient(135deg, var(--accent-manager), var(--status-good))',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <Plus size={18} /> Request Asset
                            </button>
                        )}

                        {user?.role === 'admin' && (
                            <button
                                onClick={() => {
                                    setNewAssetType(activeTab === 'bins' ? 'Bin' : 'Truck');
                                    setShowAddAssetModal(true);
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'var(--accent-admin)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <Plus size={18} /> Add Asset
                            </button>
                        )}

                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    background: 'var(--bg-main)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '50px',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    color: 'white',
                                    width: '200px'
                                }}
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'maintenance')}
                            style={{
                                background: 'var(--bg-main)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0 1rem',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                </div>

                {/* Grid View */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {activeTab === 'trucks' ? (
                        filteredTrucks.map(truck => (
                            <div
                                key={truck.id}
                                onClick={() => setSelectedTruck(truck)}
                                style={{
                                    background: 'var(--bg-main)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    border: '1px solid var(--glass-border)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {user?.role === 'admin' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Delete this asset?')) deleteTruck(truck.id);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            padding: '0.5rem',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: 'var(--accent-danger)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            zIndex: 50
                                        }}
                                        title="Delete Asset"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: 'var(--accent-admin)' }}>
                                            <TruckIcon size={32} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{truck.code}</h3>
                                            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>{truck.type}</p>
                                            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--accent-admin)', fontSize: '0.75rem', fontWeight: 600 }}>Route: {truck.route || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    <div style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '50px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: truck.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: truck.status === 'active' ? 'var(--status-good)' : 'var(--status-danger)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        {truck.status === 'active' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                                        {truck.status.toUpperCase()}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Fuel Level</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>
                                            <Battery size={16} color={truck.fuel > 20 ? 'var(--status-good)' : 'var(--status-danger)'} />
                                            {truck.fuel}%
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Total Km</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{truck.mileage.toLocaleString()} km</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent-admin)', fontSize: '0.875rem', fontWeight: 500 }}>
                                    View Full Details <ChevronRight size={16} />
                                </div>
                            </div>
                        ))
                    ) : (
                        filteredBins.map(bin => (
                            <div
                                key={bin.id}
                                onClick={() => setSelectedBin(bin)}
                                style={{
                                    background: 'var(--bg-main)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    border: '1px solid var(--glass-border)',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {user?.role === 'admin' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Delete this bin?')) deleteBin(bin.id);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            padding: '0.5rem',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: 'var(--accent-danger)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            zIndex: 50
                                        }}
                                        title="Delete Asset"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            padding: '0.75rem',
                                            background: bin.fillLevel > 90 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(52, 211, 153, 0.1)',
                                            borderRadius: '12px',
                                            color: bin.fillLevel > 90 ? 'var(--status-danger)' : 'var(--status-good)'
                                        }}>
                                            <Trash2 size={32} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Bin #{bin.id}</h3>
                                            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>{bin.location || 'IoT Enabled'}</p>
                                            {bin.cost && <p style={{ margin: '0.25rem 0 0 0', color: 'var(--status-warning)', fontSize: '0.75rem' }}>Cost: {bin.cost} SAR</p>}
                                        </div>
                                    </div>

                                    <div style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '50px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: bin.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: bin.status === 'active' ? 'var(--status-good)' : 'var(--status-danger)'
                                    }}>
                                        {bin.status.toUpperCase()}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Fill Level</span>
                                        <span style={{ fontWeight: 600, color: bin.fillLevel > 90 ? 'var(--status-danger)' : 'white' }}>{bin.fillLevel}%</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--bg-panel)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${bin.fillLevel}%`,
                                            background: bin.fillLevel > 90 ? 'var(--status-danger)' : bin.fillLevel > 50 ? 'var(--status-warning)' : 'var(--status-good)',
                                            transition: 'width 0.5s ease'
                                        }} />
                                    </div>
                                </div>

                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent-manager)', fontSize: '0.875rem', fontWeight: 500 }}>
                                    View Full Details <ChevronRight size={16} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Request Asset Modal (Manager) */}
            {showRequestModal && (
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
                    <div className="card" style={{ width: '400px', padding: '2rem', animation: 'slideIn 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Request Asset</h2>
                            <button onClick={() => setShowRequestModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleRequestSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Asset Type</label>
                                <select
                                    value={requestType}
                                    onChange={(e) => setRequestType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--bg-main)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'white'
                                    }}
                                >
                                    <option value="Truck">Truck</option>
                                    <option value="Bin">Smart Bin</option>
                                    <option value="Facility">Facility Upgrade</option>
                                    <option value="Machinery">Machinery</option>
                                </select>
                            </div>

                            {requestType === 'Bin' && (
                                <>
                                    <div style={{ marginBottom: '1rem', animation: 'fadeIn 0.3s' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Proposed Location</label>
                                        <div style={{ position: 'relative' }}>
                                            <MapPin size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                            <input
                                                type="text"
                                                placeholder="e.g. King Fahd Rd, Sector 4"
                                                value={requestLocation}
                                                onChange={(e) => setRequestLocation(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--bg-main)',
                                                    border: '1px solid var(--glass-border)',
                                                    color: 'white'
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '1rem', animation: 'fadeIn 0.3s' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Purchase Cost (SAR)</label>
                                        <div style={{ position: 'relative' }}>
                                            <CreditCard size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                            <input
                                                type="number"
                                                placeholder="e.g. 5000"
                                                value={requestCost}
                                                onChange={(e) => setRequestCost(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--bg-main)',
                                                    border: '1px solid var(--glass-border)',
                                                    color: 'white'
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {requestType === 'Truck' && (
                                <>
                                    <div style={{ marginBottom: '1rem', animation: 'fadeIn 0.3s' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Required Capacity</label>
                                        <div style={{ position: 'relative' }}>
                                            <Gauge size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                            <input
                                                type="text"
                                                placeholder="e.g. 15 Tons"
                                                value={requestCapacity}
                                                onChange={(e) => setRequestCapacity(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--bg-main)',
                                                    border: '1px solid var(--glass-border)',
                                                    color: 'white'
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '1rem', animation: 'fadeIn 0.3s' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Proposed Route</label>
                                        <div style={{ position: 'relative' }}>
                                            <MapPin size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                            <input
                                                type="text"
                                                placeholder="e.g. Route A"
                                                value={requestRoute}
                                                onChange={(e) => setRequestRoute(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--bg-main)',
                                                    border: '1px solid var(--glass-border)',
                                                    color: 'white'
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Reason / Notes</label>
                                <textarea
                                    value={requestNotes}
                                    onChange={(e) => setRequestNotes(e.target.value)}
                                    rows={4}
                                    placeholder="Describe your need..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--bg-main)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'white',
                                        resize: 'vertical'
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowRequestModal(false)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: 'transparent',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: 'var(--accent-admin)',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'white',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Asset Modal (Admin) */}
            {showAddAssetModal && (
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
                    <div className="card" style={{ width: '400px', padding: '2rem', animation: 'slideIn 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Add New Asset</h2>
                            <button onClick={() => setShowAddAssetModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleAddAssetSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Asset Type</label>
                                <select
                                    value={newAssetType}
                                    onChange={(e) => setNewAssetType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--bg-main)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'white'
                                    }}
                                >
                                    <option value="Truck">Truck</option>
                                    <option value="Bin">Smart Bin</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Identifier (ID/Plate)</label>
                                <input
                                    type="text"
                                    placeholder={newAssetType === 'Truck' ? 'e.g. T-999 or KSA-1234' : 'e.g. B-5000'}
                                    value={newAssetCode}
                                    onChange={(e) => setNewAssetCode(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--bg-main)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'white'
                                    }}
                                    required
                                />
                            </div>

                            {newAssetType === 'Truck' && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Assigned Route</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Route A"
                                        value={newAssetRoute}
                                        onChange={(e) => setNewAssetRoute(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'var(--bg-main)',
                                            border: '1px solid var(--glass-border)',
                                            color: 'white'
                                        }}
                                        required
                                    />
                                </div>
                            )}

                            {newAssetType === 'Bin' && (
                                <>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Location Description</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Main Market, Corner 2"
                                            value={newAssetLocation}
                                            onChange={(e) => setNewAssetLocation(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--bg-main)',
                                                border: '1px solid var(--glass-border)',
                                                color: 'white'
                                            }}
                                            required
                                        />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Purchase Cost (SAR)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 5000"
                                            value={newAssetCost}
                                            onChange={(e) => setNewAssetCost(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--bg-main)',
                                                border: '1px solid var(--glass-border)',
                                                color: 'white'
                                            }}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddAssetModal(false)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: 'transparent',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: 'var(--accent-admin)',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'white',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Add Asset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Asset Details Modal */}
            {selectedTruck && (
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
                    <div className="card" style={{ width: '400px', padding: '2rem', animation: 'slideIn 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Truck Details</h2>
                            <button onClick={() => setSelectedTruck(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>ID:</span>
                                <span>{selectedTruck.code}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Type:</span>
                                <span>{selectedTruck.type}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                                <span style={{ color: selectedTruck.status === 'active' ? 'var(--status-good)' : 'var(--status-danger)' }}>
                                    {selectedTruck.status.toUpperCase()}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Route:</span>
                                <span>{selectedTruck.route || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Fuel:</span>
                                <span>{selectedTruck.fuel}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Mileage:</span>
                                <span>{selectedTruck.mileage} km</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedBin && (
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
                    <div className="card" style={{ width: '400px', padding: '2rem', animation: 'slideIn 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Bin Details</h2>
                            <button onClick={() => setSelectedBin(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>ID:</span>
                                <span>{selectedBin.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Location:</span>
                                <span>{selectedBin.location || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                                <span style={{ color: selectedBin.status === 'active' ? 'var(--status-good)' : 'var(--status-danger)' }}>
                                    {selectedBin.status.toUpperCase()}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Fill Level:</span>
                                <span>{selectedBin.fillLevel}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Last Collection:</span>
                                <span>{selectedBin.lastCollection}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AssetsPage;
