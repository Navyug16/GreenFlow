import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L, { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Fuel, Truck as TruckIcon, Navigation, RefreshCw, AlertTriangle, Layers } from 'lucide-react';
import { FACILITIES } from '../data/mockData';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

// High-quality Truck Icon
const truckIcon = new DivIcon({
    html: `<div style="
        background-color: #10B981; 
        width: 40px; 
        height: 40px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 22px;
        transform: translate(-2px, -2px);">
        🚚
    </div>`,
    className: 'custom-truck-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// Full Truck Icon (Red)
const fullTruckIcon = new DivIcon({
    html: `<div style="
        background-color: #EF4444; 
        width: 40px; 
        height: 40px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 22px;
        transform: translate(-2px, -2px);">
        🚛
    </div>`,
    className: 'full-truck-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// Helper to auto-zoom to selected route
const MapRecenter = ({ selectedRoute, routes }: { selectedRoute: string | null, routes: any[] }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedRoute) {
            const route = routes.find(r => r.id === selectedRoute);
            if (route && route.currentPath && route.currentPath.length > 0) {
                const bounds = L.latLngBounds(route.currentPath);
                map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            }
        }
    }, [selectedRoute, routes, map]);

    return null;
};

// Facility Icons
const getFacilityIcon = (type: string) => new DivIcon({
    html: `<div style="
        background-color: ${type === 'recycle' ? '#F59E0B' : type === 'energy' ? '#3B82F6' : '#EF4444'}; 
        width: 32px; 
        height: 32px; 
        border-radius: 8px; 
        border: 2px solid white; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: white;">
        ${type === 'recycle' ? '♻️' : type === 'energy' ? '⚡' : '🗑️'}
    </div>`,
    className: 'facility-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

// Function to calculate distance between two points
const getDistance = (p1: { lat: number, lng: number }, p2: { lat: number, lng: number }) => {
    return Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));
};

const RoutesPage = () => {
    const { bins, routes: contextRoutes, trucks: contextTrucks } = useData();
    const [displayRoutes, setDisplayRoutes] = useState<any[]>([]);
    const [simulatedBins, setSimulatedBins] = useState(bins);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [activeNotification, setActiveNotification] = useState<string | null>(null);
    const [mapStyle, setMapStyle] = useState<'dark' | 'light'>('dark');

    // Truck Load State: routeId -> load %
    const [truckLoads, setTruckLoads] = useState<Record<string, number>>({});

    const startTimeRef = useRef<number | null>(null);
    const { user } = useAuth();

    // --- DYNAMIC ALGO: ASSIGN BINS TO TRUCKS BASED ON REGION ---
    // Instead of using hardcoded mock assignments, we recalculate them
    const dynamicRoutes = contextRoutes.map(route => {
        // Find truck details for this route
        const truck = contextTrucks.find(t => t.id === route.truckId);
        const region = truck?.region || route.region || 'Central Riyadh';

        let assignedBinIds: string[] = [];

        // 1. Get all bins in this region
        const regionalBins = bins.filter(b => b.region === region && b.status !== 'maintenance');

        // 2. Simple partitioning: Assign bins to trucks in the same region
        // Get all routes in this region to split bins among them
        const regionalRoutes = contextRoutes.filter(r => {
            const t = contextTrucks.find(trk => trk.id === r.truckId);
            return (t?.region === region) || (r.region === region);
        });

        // Sort routes by ID to ensure consistent assignment order
        regionalRoutes.sort((a, b) => a.id.localeCompare(b.id));
        const routeIndex = regionalRoutes.findIndex(r => r.id === route.id);

        if (regionalBins.length > 0 && regionalRoutes.length > 0 && routeIndex >= 0) {
            // Distribute bins: Loop through bins and assign round-robin
            assignedBinIds = regionalBins
                .filter((_, idx) => idx % regionalRoutes.length === routeIndex)
                .map(b => b.id);
        }

        // TSP-ish Sort: Order bins by nearest neighbor starting from a "hub" (Facility)
        // Heuristic Hub
        let hub = { lat: 24.75, lng: 46.72 };
        if (region.includes('South')) hub = { lat: 24.60, lng: 46.80 };
        if (region.includes('North')) hub = { lat: 24.95, lng: 46.70 };

        if (assignedBinIds.length > 0) {
            const sortedBins: string[] = [];
            let currentParams = hub;
            const pool = assignedBinIds.map(id => bins.find(b => b.id === id)).filter(b => b !== undefined) as any[];

            while (pool.length > 0) {
                // Find closest to current
                let closestIdx = -1;
                let minDst = Infinity;
                pool.forEach((b, idx) => {
                    const d = getDistance(currentParams, { lat: b.lat, lng: b.lng });
                    if (d < minDst) {
                        minDst = d;
                        closestIdx = idx;
                    }
                });

                if (closestIdx !== -1) {
                    const nextBin = pool.splice(closestIdx, 1)[0];
                    sortedBins.push(nextBin.id);
                    currentParams = { lat: nextBin.lat, lng: nextBin.lng };
                } else {
                    break;
                }
            }
            assignedBinIds = sortedBins;
        }

        return { ...route, assignedBinIds };
    });

    // Sync simulated Bins with real bins structure whenever meaningful changes happen (add/remove)
    useEffect(() => {
        setSimulatedBins(currentSims => {
            // Add new bins
            const newBins = bins.filter(b => !currentSims.find(s => s.id === b.id));
            // Remove deleted bins
            const keptBins = currentSims.filter(s => bins.find(b => b.id === s.id));

            // For kept bins, preserve local simulation state (fillLevel) but take other updates
            return [...keptBins, ...newBins].map(b => {
                const real = bins.find(r => r.id === b.id);
                // If real bin exists, use its metadata but keep local fillLevel if it exists in currentSims
                const existingSim = currentSims.find(s => s.id === b.id);
                return real ? { ...real, fillLevel: existingSim ? existingSim.fillLevel : real.fillLevel } : b;
            });
        });
    }, [bins]);

    // Routing Logic to calculate Circular Paths
    useEffect(() => {
        const fetchRouteGeometry = async (waypoints: [number, number][]) => {
            try {
                const coordString = waypoints.map(p => `${p[1]},${p[0]}`).join(';');
                const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;
                const response = await fetch(url);
                const data = await response.json();
                if (data.code === 'Ok' && data.routes && data.routes[0]) {
                    return data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]) as [number, number][];
                }
            } catch (error) { console.error(error); }
            return null;
        };

        const updateRoutes = async () => {
            // Use dynamicRoutes calculated above
            const calculatedRoutes = await Promise.all(dynamicRoutes.map(async (route) => {
                // Find bins for this route using latest bins data
                const routeBins = bins.filter(b => route.assignedBinIds?.includes(b.id));

                // If no bins, return route with empty path
                if (routeBins.length === 0) return { ...route, currentPath: [] };

                // Build Circular Waypoints: Facility -> Bins -> Facility
                // Default to F1 (North/Central)
                let startPoint: [number, number] = [24.75, 46.72];

                // Heuristic for facility based on region
                if (route.region?.includes('South')) startPoint = [24.60, 46.80]; // F2
                if (route.region?.includes('North') || route.region?.includes('Airport')) startPoint = [24.95, 46.70]; // F3

                const waypoints: [number, number][] = [];
                waypoints.push(startPoint);
                // Ensure bins are visited in the optimized order
                route.assignedBinIds?.forEach(id => {
                    const b = routeBins.find(bin => bin.id === id);
                    if (b) waypoints.push([b.lat, b.lng]);
                });
                waypoints.push(startPoint); // Return to base for circularity

                const path = await fetchRouteGeometry(waypoints);
                return { ...route, currentPath: path || [] };
            }));

            setDisplayRoutes(calculatedRoutes);
        };

        if (dynamicRoutes.length > 0 && bins.length > 0) {
            updateRoutes();
        }
    }, [bins, contextRoutes, contextTrucks]); // Recalculate if any asset changes

    // Simulation Loop
    useEffect(() => {
        let animationFrameId: number;
        const duration = 45000; // Slower loop (45s) for realism

        const animate = (time: number) => {
            if (startTimeRef.current === null) startTimeRef.current = time;
            const elapsed = time - startTimeRef.current;
            const newProgress = (elapsed % duration) / duration;

            // Update Logic
            setSimulatedBins(currentBins => {
                const nextBins = currentBins.map(bin => {
                    // Very slow natural fill 
                    // 0.005 per frame -> ~0.3 per second -> ~20% per minute
                    let newFill = bin.fillLevel;
                    if (newFill < 100) newFill += 0.005;
                    return { ...bin, fillLevel: newFill };
                });

                // Truck Collection Logic
                displayRoutes.forEach(route => {
                    if (!route.currentPath || route.currentPath.length < 2) return;

                    // Calculate Truck Position
                    const path = route.currentPath;
                    const totalWin = path.length - 1;
                    const scaled = newProgress * totalWin;
                    const idx = Math.floor(scaled);
                    const segment = scaled - idx;

                    if (idx >= totalWin) return; // End of path

                    const start = path[idx];
                    const end = path[idx + 1];
                    const truckPos: [number, number] = [
                        start[0] + (end[0] - start[0]) * segment,
                        start[1] + (end[1] - start[1]) * segment
                    ];

                    const currentLoad = truckLoads[route.id] || 0;

                    // Only interact with bins if NOT full
                    if (currentLoad < 99) {
                        const myBins = nextBins.filter(b => route.assignedBinIds?.includes(b.id));

                        myBins.forEach(bin => {
                            const dist = Math.sqrt(Math.pow(bin.lat - truckPos[0], 2) + Math.pow(bin.lng - truckPos[1], 2));

                            // Interaction Radius (approx 200m)
                            if (dist < 0.002) {
                                if (bin.fillLevel > 5) {
                                    // Collect
                                    const amount = bin.fillLevel;
                                    setTruckLoads(prev => ({ ...prev, [route.id]: Math.min(100, (prev[route.id] || 0) + (amount * 0.3)) }));

                                    // Empty bin
                                    const bIndex = nextBins.findIndex(nb => nb.id === bin.id);
                                    if (bIndex > -1) nextBins[bIndex].fillLevel = 0;

                                    if (!activeNotification) {
                                        setActiveNotification(`${route.name} collecting from Bin ${bin.id}`);
                                        setTimeout(() => setActiveNotification(null), 2000);
                                    }
                                }
                            }
                        });
                    }

                    // Check if at Facility (Start/End of loop)
                    // Loop resets at 0/1. If close to 1 (end), dump.
                    if (newProgress > 0.98) {
                        if (currentLoad > 0) {
                            // Dump
                            setTruckLoads(prev => ({ ...prev, [route.id]: 0 }));
                            if (!activeNotification) {
                                setActiveNotification(`${route.name} unloaded at Facility`);
                                setTimeout(() => setActiveNotification(null), 3000);
                            }
                        }
                    }
                });

                return nextBins;
            });

            setProgress(newProgress);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [displayRoutes, activeNotification, truckLoads]); // Only depend on stable refs effectively

    if (user?.role !== 'admin' && user?.role !== 'manager' && user?.role !== 'finance') {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <h2>Access Restricted</h2>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', height: 'calc(100vh - 100px)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>

            {/* Stats Overlay */}
            <div style={{
                position: 'absolute', top: '20px', left: '20px', width: '320px', zIndex: 1000,
                background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', color: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--accent-admin)', borderRadius: '12px' }}>
                        <Navigation size={24} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Live Operations</h2>
                        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Real-time Fleet Tracking</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', textAlign: 'center' }}>
                        <Fuel size={16} style={{ opacity: 0.7, marginBottom: '0.25rem' }} />
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>14%</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Fuel Saved</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', textAlign: 'center' }}>
                        <RefreshCw size={16} style={{ opacity: 0.7, marginBottom: '0.25rem' }} />
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3B82F6' }}>850</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Tons Collected</div>
                    </div>
                </div>

                {/* Truck List */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {displayRoutes.map(r => {
                        const load = truckLoads[r.id] || 0;
                        const isFull = load >= 99;
                        return (
                            <div key={r.id}
                                onClick={() => setSelectedRoute(r.id === selectedRoute ? null : r.id)}
                                style={{
                                    padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '10px',
                                    background: selectedRoute === r.id ? 'var(--accent-admin)' : 'rgba(255,255,255,0.05)',
                                    cursor: 'pointer', border: isFull ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {r.name}
                                        {isFull && <AlertTriangle size={14} color="#EF4444" />}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8, color: isFull ? '#EF4444' : 'inherit' }}>
                                        {isFull ? 'Returning to Base' : `${Math.round(load)}% Load`}
                                    </span>
                                </div>
                                {/* Load Bar */}
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                    <div style={{
                                        width: `${load}%`, height: '100%', borderRadius: '2px',
                                        background: load > 90 ? '#EF4444' : '#10B981',
                                        transition: 'width 0.5s'
                                    }}></div>
                                </div>
                                <div style={{ fontSize: '0.7rem', marginTop: '0.25rem', opacity: 0.6 }}>
                                    {r.assignedBinIds?.length || 0} Bins • {r.driver}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Notification */}
            {activeNotification && (
                <div style={{
                    position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: activeNotification.includes('unloaded') ? '#3B82F6' : '#10B981', color: 'white', padding: '0.75rem 1.5rem',
                    borderRadius: '50px', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    zIndex: 2000, animation: 'bounce 0.5s'
                }}>
                    {activeNotification}
                </div>
            )}

            {/* Map Style Toggle */}
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000, background: 'white', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}
                onClick={() => setMapStyle(s => s === 'dark' ? 'light' : 'dark')}
            >
                <Layers color="black" />
            </div>

            <MapContainer center={[24.7136, 46.6753]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <MapRecenter selectedRoute={selectedRoute} routes={displayRoutes} />
                <TileLayer
                    url={mapStyle === 'dark'
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }
                    attribution='&copy; CARTO'
                />

                {/* Facilities */}
                {FACILITIES.map(f => (
                    <Marker key={f.id} position={[f.lat || 0, f.lng || 0]} icon={getFacilityIcon(f.type)}>
                        <Popup><strong>{f.name}</strong><br />{f.type}</Popup>
                    </Marker>
                ))}

                {/* Bins */}
                {simulatedBins.map(bin => {
                    // Filter logic: show bins if no route selected, OR if bin belongs to selected route
                    const isVisible = !selectedRoute || displayRoutes.find(r => r.id === selectedRoute)?.assignedBinIds?.includes(bin.id);
                    if (!isVisible) return null;

                    return (
                        <CircleMarker
                            key={bin.id}
                            center={[bin.lat, bin.lng]}
                            radius={6}
                            fillColor={bin.fillLevel > 90 ? '#EF4444' : bin.fillLevel > 50 ? '#F59E0B' : '#10B981'}
                            color="white"
                            weight={2}
                            fillOpacity={1}
                        >
                            <Popup>
                                <strong>Bin {bin.id}</strong><br />
                                Level: {Math.round(bin.fillLevel)}%
                            </Popup>
                        </CircleMarker>
                    );
                })}

                {/* Routes */}
                {displayRoutes.map(r => {
                    if (selectedRoute && selectedRoute !== r.id) return null;
                    if (!r.currentPath || r.currentPath.length < 2) return null;

                    const load = truckLoads[r.id] || 0;
                    const isFull = load >= 99;

                    // Render Truck
                    const path = r.currentPath;
                    const total = path.length - 1;
                    const scaled = progress * total;
                    const idx = Math.floor(scaled);
                    const segment = scaled - idx;
                    let pos: [number, number] = [0, 0];

                    if (idx < total) {
                        const start = path[idx];
                        const end = path[idx + 1];
                        pos = [
                            start[0] + (end[0] - start[0]) * segment,
                            start[1] + (end[1] - start[1]) * segment
                        ];
                    } else {
                        pos = path[total];
                    }

                    return (
                        <div key={r.id}>
                            <Polyline positions={r.currentPath} color={selectedRoute === r.id ? '#10B981' : 'rgba(255,255,255,0.2)'} weight={4} />
                            <Marker position={pos} icon={isFull ? fullTruckIcon : truckIcon}>
                                <Popup>
                                    <strong>{r.name}</strong><br />
                                    Status: {isFull ? 'Returning to Facility (Full)' : 'Collecting Waste'}<br />
                                    Load: {Math.round(load)}%
                                </Popup>
                            </Marker>
                        </div>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default RoutesPage;
