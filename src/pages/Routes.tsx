import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Fuel, Truck, Navigation, RefreshCw } from 'lucide-react';
import { TRUCK_ROUTES, FACILITIES, BINS } from '../data/mockData';

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
    // Local simulation state for bin levels to show "emptying and filling"
    const [simulatedBins, setSimulatedBins] = useState(BINS);
    const [routes, setRoutes] = useState(TRUCK_ROUTES);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [activeNotification, setActiveNotification] = useState<string | null>(null);

    // Fetch paths logic (kept similar but ensured it runs)
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
            // Re-fetch logic or keep existing state if already populated? 
            // Better to re-fetch to be safe.
            const t1Path = await fetchRouteGeometry([[24.6850, 46.6900], [24.6905, 46.6855], [24.7115, 46.6745], [24.7200, 46.6700]]);
            const t5Path = await fetchRouteGeometry([[24.7500, 46.6250], [24.7555, 46.6305], [24.7600, 46.6350], [24.7650, 46.6400]]);

            // ... other placeholder fetches
            const fetchAndSet = async (id: string, start: [number, number], end: [number, number]) => {
                const path = await fetchRouteGeometry([start, end]);
                return { id, path };
            };
            const otherRoutes = await Promise.all([
                fetchAndSet('T2', [24.6650, 46.7300], [24.6620, 46.7150]),
                fetchAndSet('T3', [24.6005, 46.8005], [24.5950, 46.8050]),
                fetchAndSet('T4', [24.9505, 46.7005], [24.9450, 46.6950]),
                fetchAndSet('T6', [24.7700, 46.7800], [24.7850, 46.7400]),
                fetchAndSet('T7', [24.6805, 46.6205], [24.6700, 46.6300]),
            ]);

            setRoutes(prev => prev.map(r => {
                if (r.id === 'T1' && t1Path) return { ...r, currentPath: t1Path };
                if (r.id === 'T5' && t5Path) return { ...r, currentPath: t5Path };
                const other = otherRoutes.find(o => o.id === r.id);
                if (other && other.path) return { ...r, currentPath: other.path };
                return r;
            }));
        };
        updateRoutes();
    }, []);

    // Get position helper
    const getPosition = (path: [number, number][], t: number): [number, number] => {
        if (!path || path.length < 2) return [0, 0];
        const total = path.length - 1;
        const scaled = t * total;
        const idx = Math.floor(scaled);
        const segment = scaled - idx;
        if (idx >= total) return path[total];
        const start = path[idx];
        const end = path[idx + 1];
        return [start[0] + (end[0] - start[0]) * segment, start[1] + (end[1] - start[1]) * segment];
    };

    // Advanced Simulation Loop
    useEffect(() => {
        let animationFrameId: number;
        let startTime: number;
        const duration = 20000; // 20s loop

        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const newProgress = (elapsed % duration) / duration;

            // 1. Check for Bin Collection
            // For each route, where is the truck?
            routes.forEach(route => {
                // If this route is moving (simplified: all move together in this demo)
                // In real app, each has unique progress. Here we use global progress for sync demo.
                if (!route.currentPath) return;
                const pos = getPosition(route.currentPath, newProgress);


                // Check distance to all bins
                setSimulatedBins(currentBins => {
                    return currentBins.map(bin => {
                        const dist = Math.sqrt(Math.pow(bin.lat - pos[0], 2) + Math.pow(bin.lng - pos[1], 2));

                        // Truck is VERY close to bin (< 0.002 degrees approx 200m visually)
                        if (dist < 0.002) {
                            if (bin.fillLevel > 5) {
                                // EMPTY THE BIN!
                                setSimulatedBins(current => current.map(b => b.id === bin.id ? { ...b, fillLevel: 0 } : b));
                                if (!activeNotification) {
                                    setActiveNotification(`${route.name} collecting waste from Bin ${bin.id}...`);
                                    // Clear notification after 3 seconds to allow new ones
                                    setTimeout(() => setActiveNotification(null), 3000);
                                }
                                return { ...bin, fillLevel: 0 };
                            }
                        } else {
                            // Slowly refill bin if it was empty, to simulate life
                            if (bin.fillLevel < 90 && Math.random() > 0.95) {
                                return { ...bin, fillLevel: bin.fillLevel + 0.5 };
                            }
                        }
                        return bin;
                    });
                });
            });

            // 2. Facility Drop logic
            if (newProgress > 0.98 && newProgress < 0.99) {
                setActiveNotification("Trucks arriving at Facility for disposal...");
            } else if (newProgress < 0.01) {
                setActiveNotification(null);
            }

            setProgress(newProgress);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [routes, activeNotification]);


    return (
        <div style={{ position: 'relative', height: 'calc(100vh - 100px)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>

            {/* Floating Overlay Panel - IMPROVED UX */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '320px',
                zIndex: 1000,
                background: 'rgba(30, 41, 59, 0.9)', // Darker, glass feel
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '1.5rem',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--accent-admin)', borderRadius: '12px' }}>
                        <Navigation size={24} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Smart Routing</h2>
                        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Live Fleet Tracking</p>
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

                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.5, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Fleets</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div
                            onClick={() => setSelectedRoute(null)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '10px',
                                background: selectedRoute === null ? 'rgba(255,255,255,0.1)' : 'transparent',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                border: selectedRoute === null ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent'
                            }}
                        >
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></div>
                            <span style={{ fontSize: '0.9rem' }}>Show All Trucks</span>
                        </div>

                        {routes.map(r => (
                            <div
                                key={r.id}
                                onClick={() => setSelectedRoute(r.id)}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    background: selectedRoute === r.id ? 'var(--accent-admin)' : 'rgba(255,255,255,0.03)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Truck size={16} />
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{r.name}</div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{r.driver}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: r.efficiency > 90 ? '#10B981' : '#F59E0B' }}>
                                    {r.efficiency}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notification Float */}
            {activeNotification && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#10B981',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                    zIndex: 2000,
                    animation: 'bounce 0.5s'
                }}>
                    {activeNotification}
                </div>
            )}

            <MapContainer center={[24.72, 46.68]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                />

                {/* Facilities */}
                {FACILITIES.map(f => (
                    <Marker
                        key={f.id}
                        position={f.id === 'F1' ? [24.75, 46.72] : f.id === 'F2' ? [24.60, 46.80] : [24.95, 46.70]}
                        icon={getFacilityIcon(f.type)}
                    >
                        <Popup><strong>{f.name}</strong><br />{f.description}</Popup>
                    </Marker>
                ))}

                {/* Bins with Simulated Levels */}
                {simulatedBins.map(bin => (
                    <CircleMarker
                        key={bin.id}
                        center={[bin.lat, bin.lng]}
                        radius={bin.fillLevel > 0 ? 6 : 4} // Smaller if empty
                        fillColor={bin.fillLevel === 0 ? '#10B981' : bin.fillLevel > 90 ? '#EF4444' : '#F59E0B'}
                        color="white"
                        weight={2}
                        fillOpacity={1}
                    >
                        <Popup>
                            <strong>Bin #{bin.id}</strong><br />
                            Level: {Math.round(bin.fillLevel)}%<br />
                            (Live Simulation)
                        </Popup>
                    </CircleMarker>
                ))}

                {/* Routes & Trucks */}
                {routes.map(r => {
                    if (selectedRoute && selectedRoute !== r.id) return null;
                    if (!r.currentPath || r.currentPath.length < 2) return null;
                    const isActive = selectedRoute === r.id;
                    const pos = getPosition(r.currentPath, progress);

                    return (
                        <div key={r.id}>
                            <Polyline positions={r.currentPath} color={isActive ? '#10B981' : 'rgba(255,255,255,0.2)'} weight={isActive ? 5 : 3} />
                            <Marker position={pos} icon={truckIcon} />
                        </div>
                    )
                })}

            </MapContainer>
        </div>
    );
};

export default RoutesPage;
