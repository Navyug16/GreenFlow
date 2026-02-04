import { useState } from 'react';
import { Truck, Trash2, Battery, AlertTriangle, CheckCircle2, Search, Gauge, Plus, X, MapPin, User, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const AssetsPage = ({ defaultTab = 'trucks', hideTabs = false }: { defaultTab?: 'trucks' | 'bins', hideTabs?: boolean }) => {
    const { user } = useAuth();
    const { trucks, bins, addTruck, addBin, addRequest } = useData();

    const [activeTab, setActiveTab] = useState<'trucks' | 'bins'>(defaultTab);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'maintenance'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Request Modal State (Manager)
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestType, setRequestType] = useState('Truck');
    const [requestNotes, setRequestNotes] = useState('');
    const [requestLocation, setRequestLocation] = useState('');
    const [requestCapacity, setRequestCapacity] = useState('');

    // Add Asset Modal State (Admin)
    const [showAddAssetModal, setShowAddAssetModal] = useState(false);
    const [newAssetType, setNewAssetType] = useState('Truck');
    const [newAssetCode, setNewAssetCode] = useState(''); // Plate or ID

    // Truck Details Modal State
    const [selectedTruck, setSelectedTruck] = useState<any>(null);

    const filteredTrucks = trucks.filter(t =>
        (filterStatus === 'all' || t.status === filterStatus) &&
        (t.code.toLowerCase().includes(searchTerm.toLowerCase()) || t.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredBins = bins.filter(b =>
        (filterStatus === 'all' || b.status === filterStatus) &&
        (b.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const details = requestType === 'Bin' ? `Location: ${requestLocation}` : requestType === 'Truck' ? `Capacity: ${requestCapacity}` : '';

        addRequest({
            id: `req-${Date.now()}`,
            type: requestType,
            notes: requestNotes,
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            requester: user?.name || 'Manager', // specific manager name
            details: details
        });

        alert(`Request Submitted to Admin`);
        setShowRequestModal(false);
        setRequestNotes('');
        setRequestLocation('');
        setRequestCapacity('');
    };

    const handleAddAssetSubmit = (e: React.FormEvent) => {
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
                totalHours: 0
            });
        } else {
            addBin({
                id: newAssetCode || `B-${Math.floor(Math.random() * 10000)}`,
                lat: 24.71,
                lng: 46.67,
                fillLevel: 0,
                status: 'active',
                lastCollection: 'Just now'
            });
        }
        setShowAddAssetModal(false);
        setNewAssetCode('');
    };

    const StatsCard = ({ label, value, icon: Icon, color }: any) => (
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatsCard label="Total Assets" value={trucks.length + bins.length} icon={Gauge} color="var(--accent-admin)" />
                <StatsCard label="Active Fleet" value={trucks.filter(t => t.status === 'active').length} icon={Truck} color="var(--status-good)" />
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
                                    <Truck size={16} /> Trucks
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
                                onClick={() => setShowAddAssetModal(true)}
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
                            onChange={(e: any) => setFilterStatus(e.target.value)}
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: 'var(--accent-admin)' }}>
                                            <Truck size={32} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{truck.code}</h3>
                                            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>{truck.type}</p>
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
                            <div key={bin.id} style={{
                                background: 'var(--bg-main)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                border: '1px solid var(--glass-border)',
                                position: 'relative'
                            }}>
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
                                            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>IoT Enabled</p>
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
                            )}

                            {requestType === 'Truck' && (
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

            {/* Truck Details Modal */}
            {selectedTruck && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 1100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '500px', padding: '0', overflow: 'hidden', animation: 'scaleUp 0.3s ease' }}>
                        <div style={{
                            background: 'linear-gradient(to right, var(--bg-panel), var(--bg-main))',
                            padding: '1.5rem',
                            borderBottom: '1px solid var(--glass-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start'
                        }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: 'var(--accent-admin)' }}>
                                    <Truck size={32} />
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedTruck.code}</h2>
                                    <p style={{ margin: 0, color: 'var(--text-tertiary)' }}>{selectedTruck.type}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedTruck(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h4 style={{ color: 'var(--text-tertiary)', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Operational Status</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Current Status</div>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '50px',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            background: selectedTruck.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                            color: selectedTruck.status === 'active' ? 'var(--status-good)' : 'var(--status-danger)'
                                        }}>
                                            {selectedTruck.status === 'active' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                                            {selectedTruck.status.toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Assigned Driver</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                            <User size={16} color="var(--accent-admin)" /> {selectedTruck.driver || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>License Plate</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontFamily: 'monospace' }}>
                                            <CreditCard size={16} color="var(--text-tertiary)" /> {selectedTruck.plate || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ color: 'var(--text-tertiary)', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Technical Specs</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Distance</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedTruck.mileage?.toLocaleString()} km</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Fuel Level</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: selectedTruck.fuel > 20 ? 'var(--status-good)' : 'var(--status-danger)' }}>{selectedTruck.fuel}%</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Load Capacity</div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{selectedTruck.capacity || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Last Service</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                            <Calendar size={16} color="var(--text-tertiary)" /> {selectedTruck.lastService}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', background: 'var(--bg-main)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button style={{ padding: '0.75rem 1.5rem', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-admin)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}>View Maintenance Log</button>
                            <button onClick={() => setSelectedTruck(null)} style={{ padding: '0.75rem 1.5rem', background: 'var(--accent-admin)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetsPage;
