import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Brain, Fuel, TrendingUp, Truck } from 'lucide-react';
import { TRUCK_ROUTES } from '../data/mockData';
import { useData } from '../context/DataContext';

// Custom Icons
// Custom Icons
// Custom Icons
const truckIcon = new DivIcon({
    html: `<div style="
        background-color: #10B981; 
        width: 36px; 
        height: 36px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 20px;">
        🚚
    </div>`,
    className: 'custom-truck-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
});

const RoutesPage = () => {
    const { bins } = useData();
    const [optimizing, setOptimizing] = useState(false);
    const [routes, setRoutes] = useState(TRUCK_ROUTES);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    // Fetch real road geometry from OSRM
    useEffect(() => {
        const fetchRouteGeometry = async (waypoints: [number, number][]) => {
            try {
                // OSRM expects {lng},{lat};{lng},{lat}
                const coordString = waypoints.map(p => `${p[1]},${p[0]}`).join(';');
                const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.code === 'Ok' && data.routes && data.routes[0]) {
                    // Convert [lng, lat] back to [lat, lng] for Leaflet
                    return data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]) as [number, number][];
                }
            } catch (error) {
                console.error("Failed to fetch route:", error);
            }
            return null;
        };

        const updateRoutes = async () => {
            // Update T1 (Olaya)
            const t1Waypoints: [number, number][] = [[24.6850, 46.6900], [24.6905, 46.6855], [24.7115, 46.6745], [24.7200, 46.6700]];
            const t1Path = await fetchRouteGeometry(t1Waypoints);

            // Update T2 (Al Malaz)
            const t2Waypoints: [number, number][] = [[24.6650, 46.7300], [24.6655, 46.7255], [24.6600, 46.7200], [24.6620, 46.7150]];
            const t2Path = await fetchRouteGeometry(t2Waypoints);

            // Update T5 (North Commercial)
            const t5Waypoints: [number, number][] = [[24.7500, 46.6250], [24.7555, 46.6305], [24.7600, 46.6350], [24.7650, 46.6400]];
            const t5Path = await fetchRouteGeometry(t5Waypoints);

            // For others, we can use simple straight lines or add more waypoints later if needed, 
            // but let's try to fetch at least a simple valid path for them based on their mockData currentPath start/end
            const fetchAndSet = async (id: string, start: [number, number], end: [number, number]) => {
                const path = await fetchRouteGeometry([start, end]);
                return { id, path };
            };

            const otherRoutes = await Promise.all([
                fetchAndSet('T3', [24.6005, 46.8005], [24.5950, 46.8050]), // Industrial
                fetchAndSet('T4', [24.9505, 46.7005], [24.9450, 46.6950]), // Airport
                fetchAndSet('T6', [24.7700, 46.7800], [24.7850, 46.7400]), // Nahda
                fetchAndSet('T7', [24.6805, 46.6205], [24.6700, 46.6300]), // Ministry
            ]);

            setRoutes(prev => prev.map(r => {
                if (r.id === 'T1' && t1Path) return { ...r, currentPath: t1Path };
                if (r.id === 'T2' && t2Path) return { ...r, currentPath: t2Path };
                if (r.id === 'T5' && t5Path) return { ...r, currentPath: t5Path };

                const other = otherRoutes.find(o => o.id === r.id);
                if (other && other.path) return { ...r, currentPath: other.path };

                return r;
            }));
        };

        updateRoutes();
    }, []);

    // Simulate AI Optimization
    const handleOptimize = () => {
        setOptimizing(true);
        setTimeout(() => {
            setOptimizing(false);
            alert("AI Optimization Complete! Route efficiency increased by 14%. Projected fuel saving: 12L.");
        }, 3000);
    };

    // Animation Loop with "Waste Drop" Simulation
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    useEffect(() => {
        let animationFrameId: number;
        let startTime: number;
        const duration = 20000; // 20 seconds for full route cycle

        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const newProgress = (elapsed % duration) / duration;

            // Simulation Logic:
            // 0.0 - 0.1: Leaving Depot
            // 0.1 - 0.8: Collecting Waste (Bins)
            // 0.8 - 0.99: Going to Facility (Full)
            // 1.0 (Loop): Dump & Reset

            if (newProgress > 0.98 && newProgress < 0.99) {
                if (!statusMessage) setStatusMessage("Truck arriving at Recycling Facility...");
            } else if (newProgress < 0.02) {
                setStatusMessage(null); // Reset
            }

            setProgress(newProgress);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [statusMessage]);

    // ... handleOptimize function ...

    // Helper to get position along path
    const getPosition = (path: [number, number][], t: number): [number, number] => {
        if (!path || path.length < 2) return [0, 0];

        const totalLength = path.length - 1;
        const scaledT = t * totalLength;
        const index = Math.floor(scaledT);
        const segmentT = scaledT - index;

        if (index >= totalLength) return path[totalLength];

        const start = path[index];
        const end = path[index + 1];

        return [
            start[0] + (end[0] - start[0]) * segmentT,
            start[1] + (end[1] - start[1]) * segmentT
        ];
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 140px)', gap: '1.5rem' }}>
            {/* Sidebar Controls ... (No Changes) */}
            <div className="card" style={{ width: '350px', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                {/* ... Sidebar Content ... */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(52, 211, 153, 0.1)',
                            borderRadius: '12px',
                            color: 'var(--accent-manager)'
                        }}>
                            <Brain size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>AI Routing</h2>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Fuel & Path Optimization</p>
                        </div>
                    </div>

                    <button
                        onClick={handleOptimize}
                        disabled={optimizing}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: optimizing ? 'var(--bg-panel)' : 'linear-gradient(135deg, var(--accent-manager), var(--accent-admin))',
                            border: optimizing ? '1px solid var(--glass-border)' : 'none',
                            borderRadius: 'var(--radius-sm)',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: optimizing ? 0.7 : 1
                        }}
                    >
                        {optimizing ? (
                            <>Optimizing Paths...</>
                        ) : (
                            <>Run AI Optimization</>
                        )}
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Active Fleets</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {routes.map(route => (
                            <div
                                key={route.id}
                                onClick={() => setSelectedRoute(route.id)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-sm)',
                                    background: selectedRoute === route.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.03)',
                                    border: selectedRoute === route.id ? '1px solid var(--accent-admin)' : '1px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>{route.name}</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        background: route.efficiency > 90 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                        color: route.efficiency > 90 ? 'var(--status-good)' : 'var(--status-warning)'
                                    }}>
                                        {route.efficiency}% Eff.
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                                    <Truck size={14} />
                                    <span>{route.driver}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                    <h4 style={{ margin: '0 0 1rem 0' }}>Real-time Stats</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                                <Fuel size={12} /> Fuel Saved
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-finance)' }}>14%</div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                                <TrendingUp size={12} /> Distance
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-admin)' }}>-22km</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Map Area */}
            <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 400,
                    background: 'var(--bg-panel)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--glass-shadow)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--status-danger)' }}></span>
                        <span>Full Bin ({'>'}90%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--status-good)' }}></span>
                        <span>Normal Bin</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <div style={{ width: 12, height: 4, background: 'var(--accent-admin)' }}></div>
                        <span>Active Route</span>
                    </div>
                </div>

                {statusMessage && (
                    <div style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid var(--status-good)',
                        borderRadius: '4px',
                        color: 'var(--status-good)',
                        fontWeight: 600,
                        animation: 'pulse 1s infinite'
                    }}>
                        {statusMessage}
                    </div>
                )}
            </div>

            <MapContainer center={[24.72, 46.68]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                />

                {/* Render Bins */}
                {bins.map(bin => (
                    <CircleMarker
                        key={bin.id}
                        center={[bin.lat, bin.lng]}
                        radius={6}
                        fillColor={bin.fillLevel > 90 ? 'var(--status-danger)' : bin.fillLevel > 75 ? 'var(--status-warning)' : 'var(--status-good)'}
                        color="white"
                        weight={2}
                        fillOpacity={1}
                    >
                        <Popup className="custom-popup">
                            <div style={{ color: 'var(--bg-main)' }}>
                                <strong>Bin #{bin.id}</strong><br />
                                Level: {bin.fillLevel}%<br />
                                Last: {bin.lastCollection}
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                {/* Render Routes */}
                {routes.map(route => {
                    if (selectedRoute && selectedRoute !== route.id) return null; // Hide others if one is selected
                    if (!route.currentPath || route.currentPath.length < 2) return null;

                    const isActive = selectedRoute === route.id;
                    const currentPos = getPosition(route.currentPath, progress);

                    return (
                        <div key={route.id}>
                            {/* Outer Glow / Border for Active Route */}
                            {isActive && (
                                <Polyline
                                    positions={route.currentPath}
                                    color="var(--accent-admin)"
                                    weight={8}
                                    opacity={0.3}
                                />
                            )}

                            {/* Main Path */}
                            <Polyline
                                positions={route.currentPath}
                                color={isActive ? 'var(--accent-admin)' : 'rgba(255,255,255,0.2)'}
                                weight={isActive ? 4 : 3}
                                dashArray={isActive ? undefined : '5, 10'}
                            />

                            {/* Animated Truck Marker */}
                            <Marker position={currentPos} icon={truckIcon}>
                                <Popup>
                                    <div style={{ color: 'var(--bg-main)' }}>
                                        <strong>{route.name}</strong><br />
                                        Driver: {route.driver}<br />
                                        Speed: 45 km/h
                                    </div>
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
