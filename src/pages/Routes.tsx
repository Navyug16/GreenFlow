import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L, { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Fuel, Navigation, RefreshCw, AlertTriangle, Layers, X, Activity } from 'lucide-react';
import { FACILITIES } from '../data/mockData';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { clusterBinsByTruck, optimizeStopSequence } from '../utils/routeOptimizer';

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
    const lastRouteRef = useRef<string | null>(null);

    useEffect(() => {
        if (selectedRoute && selectedRoute !== lastRouteRef.current) {
            const route = routes.find(r => r.id === selectedRoute);
            if (route && route.currentPath && route.currentPath.length > 0) {
                const bounds = L.latLngBounds(route.currentPath);
                map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15 });
                lastRouteRef.current = selectedRoute;
            }
        } else if (!selectedRoute) {
            lastRouteRef.current = null;
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



const RoutesPage = () => {
    const { bins, routes: contextRoutes, trucks: contextTrucks, updateBin, addTruck } = useData();
    const [displayRoutes, setDisplayRoutes] = useState<any[]>(contextRoutes);
    const [simulatedBins, setSimulatedBins] = useState(() =>
        bins.map(b => ({
            ...b,
            fillRate: 0.005 + Math.random() * 0.02,
            priority: 0
        }))
    );
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [activeNotification, setActiveNotification] = useState<string | null>(null);
    const [mapStyle, setMapStyle] = useState<'dark' | 'light'>('dark');
    const [showStats, setShowStats] = useState(() => window.innerWidth > 768);

    // Truck Load State: routeId -> load %
    const [truckLoads, setTruckLoads] = useState<Record<string, number>>({});

    const startTimeRef = useRef<number | null>(null);
    const { user } = useAuth();

    // Truck Current Positions: routeId -> [lat, lng]
    const truckPositionsRef = useRef<Record<string, [number, number]>>({});
    const lastOptimizationRef = useRef<number>(0);

    // Truck Route Hash: routeId -> string (binIds joined)
    const routeBinsHashRef = useRef<Record<string, string>>({});

    // Initial load check & Sync displayRoutes when context changes
    useEffect(() => {
        if (contextRoutes.length > 0) {
            setDisplayRoutes(prev => {
                if (prev.length === 0) return contextRoutes;
                return prev;
            });

            // Initialize positions
            contextRoutes.forEach(r => {
                if (!truckPositionsRef.current[r.id]) {
                    truckPositionsRef.current[r.id] = r.region?.includes('North') ? [24.95, 46.70] : [24.75, 46.72];
                }
            });
        }
    }, [contextRoutes]);

    // Helper to fetch OSRM path
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

    /**
     * DYNAMIC ROUTING ENGINE
     */
    const optimizeRoutes = async (currentBins: any[], currentMsg: string | null) => {
        const now = Date.now();
        // Throttle: Only optimize every 5 seconds or if forced
        if (now - lastOptimizationRef.current < 5000 && !currentMsg?.includes('Emergency')) return;
        lastOptimizationRef.current = now;

        // 1. Identify Critical Bins
        const criticalBins = currentBins.filter((b: any) => b.fillLevel > 80);

        // 2. Manage Trucks (Add Reinforcement if needed)
        // 2. Manage Trucks (Add Reinforcement if needed)
        // contextRoutes roughly equals active trucks.
        // We use contextTrucks to check total fleet size available or active
        const activeTrucks = contextRoutes.length;

        if (criticalBins.length / (activeTrucks || 1) > 1.5 && activeTrucks < 15) {
            const newCode = `T-${Math.floor(Math.random() * 1000)}`;
            const newTruck = {
                id: `T-${Date.now()}`,
                code: newCode,
                type: 'Emergency Unit',
                status: 'active',
                health: 100,
                region: 'Dynamic - ' + (criticalBins[0]?.region || 'Central'),
                fuel: 100,
                mileage: 0,
                lastService: 'New',
                driver: 'Auto-Pilot',
                plate: newCode,
                route: 'Emergency Route',
                capacity: '10 Tons'
            };

            // Add to Global Context directly
            await addTruck(newTruck as any);

            setActiveNotification("⚠️ High Demand! Deployed Emergency Truck.");
            return; // Context update will trigger re-run
        }

        // 3. Assign Bins to Trucks (Clustering)
        const clusters = clusterBinsByTruck(contextRoutes, currentBins);



        // Process in parallel to speed up loading
        const routePromises = contextRoutes.map(async (route, index) => {
            const currentPos = truckPositionsRef.current[route.id] ||
                (route.region?.includes('North') ? [24.95, 46.70] : [24.75, 46.72]);

            // Find Nearest Facility Dynamically (Universal Endpoint)
            let nearestFacility = FACILITIES[0];
            let minFacDist = Infinity;
            FACILITIES.forEach(f => {
                const d = Math.sqrt(Math.pow(f.lat! - currentPos[0], 2) + Math.pow(f.lng! - currentPos[1], 2));
                if (d < minFacDist) {
                    minFacDist = d;
                    nearestFacility = f;
                }
            });
            const facilityLoc = [nearestFacility.lat || 24.75, nearestFacility.lng || 46.72] as [number, number];

            // Determine Stops
            let assignedBins = clusters[route.id] || [];

            // If Full, override assignments -> Go directly to facility
            // If No Bins, also effectively go to facility (patrol/return base)
            const isFull = (truckLoads[route.id] || 0) >= 99;
            if (isFull) {
                assignedBins = [];
            }

            // Check if we need to update the path
            const binIdsHash = isFull ? 'RETURNING_TO_BASE' : assignedBins.map((b: any) => b.id).sort().join(',');
            const hasChanged = routeBinsHashRef.current[route.id] !== binIdsHash;
            const isMockPath = !route.currentPath || route.currentPath.length < 10;

            if (!hasChanged && !isMockPath) {
                return route;
            }

            routeBinsHashRef.current[route.id] = binIdsHash;

            // Optimize Sequence (TSP)
            const optimizedStops = optimizeStopSequence(
                currentPos as [number, number],
                facilityLoc,
                assignedBins
            );

            // Construct Waypoints
            const waypoints: [number, number][] = [];
            waypoints.push(currentPos as [number, number]);
            optimizedStops.forEach((b: any) => waypoints.push([b.lat, b.lng]));
            waypoints.push(facilityLoc);

            // Fetch Route
            let path = null;
            try {
                // Stagger requests slightly to avoid hitting rate limit instantly
                await new Promise(r => setTimeout(r, index * 100));
                path = await fetchRouteGeometry(waypoints);
            } catch (err) {
                console.warn("Route fetch failed for", route.id);
            }

            return {
                ...route,
                assignedBinIds: optimizedStops.map((b: any) => b.id),
                currentPath: path || route.currentPath || []
            };
        });

        const newDisplayRoutes = await Promise.all(routePromises);

        setDisplayRoutes(newDisplayRoutes);
        startTimeRef.current = performance.now();
    };

    // Sync simulated Bins with real bins structure whenever meaningful changes happen (add/remove)
    useEffect(() => {
        setSimulatedBins(currentSims => {
            const newBins = bins.filter(b => !currentSims.find(s => s.id === b.id));
            const keptBins = currentSims.filter(s => bins.find(b => b.id === s.id));
            return [...keptBins, ...newBins].map(b => {
                const real = bins.find(r => r.id === b.id);
                const existingSim = currentSims.find(s => s.id === b.id);
                const base = real || b;
                return {
                    ...base,
                    fillLevel: existingSim ? existingSim.fillLevel : base.fillLevel,
                    fillRate: existingSim?.fillRate || (0.002 + Math.random() * 0.008),
                    priority: existingSim?.priority || 0
                };
            });
        });
    }, [bins]);

    // Keep a ref of simulatedBins for the interval to access latest state without re-triggering
    const simulatedBinsRef = useRef(simulatedBins);
    useEffect(() => { simulatedBinsRef.current = simulatedBins; }, [simulatedBins]);

    // Trigger Route Optimization periodically (every 5s check)
    useEffect(() => {
        const interval = setInterval(() => {
            if (simulatedBinsRef.current.length > 0) {
                optimizeRoutes(simulatedBinsRef.current, null);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [contextRoutes, contextTrucks]);

    // Sync Simulation to Global Context (Every 2 seconds)
    // This allows the "Assets" page to see the realtime fill levels from the map simulation
    // Sync Simulation to Global Context (Every 2 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            simulatedBinsRef.current.forEach(simBin => {
                const realBin = bins.find(b => b.id === simBin.id);
                // Sync intermediate levels every 2s if changed by > 5%
                if (realBin && Math.abs(realBin.fillLevel - simBin.fillLevel) > 5) {
                    updateBin(simBin.id, { fillLevel: Math.round(simBin.fillLevel) });
                }
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [bins]);

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
                    // Random fill rate
                    let newFill = bin.fillLevel;
                    // @ts-ignore
                    const rate = bin.fillRate || 0.005;
                    if (newFill < 100) newFill += rate;

                    // Sync Critical Status
                    if (newFill > 95 && bin.fillLevel <= 95) {
                        updateBin(bin.id, { overflowStatus: true, status: 'critical', fillLevel: 96 });
                        setActiveNotification(`⚠️ Critical: Bin ${bin.id} is Full!`);
                        setTimeout(() => setActiveNotification(null), 4000);
                    }

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

                    // Safety Check
                    if (idx < 0 || idx >= totalWin) return;
                    if (!path[idx] || !path[idx + 1]) return;

                    const start = path[idx];
                    const end = path[idx + 1];
                    const truckPos: [number, number] = [
                        start[0] + (end[0] - start[0]) * segment,
                        start[1] + (end[1] - start[1]) * segment
                    ];

                    // Update Position Ref for Dynamic Routing
                    truckPositionsRef.current[route.id] = truckPos;

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
                                    if (bIndex > -1) {
                                        nextBins[bIndex].fillLevel = 0;
                                        // Sync Collection to Global Context
                                        updateBin(bin.id, { fillLevel: 0, status: 'active', overflowStatus: false, lastCollection: 'Just now' });
                                    }

                                    // Removed collection notification per user request
                                    /* if (!activeNotification) {
                                        setActiveNotification(`${route.name} collecting from Bin ${bin.id}`);
                                        setTimeout(() => setActiveNotification(null), 2000);
                                    } */

                                }
                            }
                        });
                    }

                    // Check if at Facility (Start/End of loop)
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

            {/* Toggle Stats Button (Mobile/Collapsed View) */}
            {!showStats && (
                <div
                    onClick={() => setShowStats(true)}
                    style={{
                        position: 'absolute', top: '20px', left: '20px', zIndex: 1000,
                        background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(12px)',
                        borderRadius: '12px', padding: '0.75rem', color: 'white',
                        cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    <Activity size={24} />
                </div>
            )}

            {/* Stats Overlay */}
            {showStats && (
                <div style={{
                    position: 'absolute', top: '20px', left: '20px', width: '320px', zIndex: 1000,
                    background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', color: 'white'
                }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={() => setShowStats(false)}>
                        <X size={20} style={{ opacity: 0.7 }} />
                    </div>
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
            )}

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

                    if (idx < total && path[idx] && path[idx + 1]) {
                        const start = path[idx];
                        const end = path[idx + 1];
                        pos = [
                            start[0] + (end[0] - start[0]) * segment,
                            start[1] + (end[1] - start[1]) * segment
                        ];
                    } else if (path[total]) {
                        pos = path[total];
                    } else {
                        pos = path[0] || [0, 0];
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
