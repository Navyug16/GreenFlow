import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet's default icon path issues
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIcon2xPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Custom Icons
const binIcon = new Icon({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIcon2xPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const facilityIcon = new Icon({
    iconUrl: markerIconPng, // Use local icon for reliability
    iconRetinaUrl: markerIcon2xPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



// Since external icons might break, let's use a standard colored marker for trucks for reliability if the above fails in preview
const truckMarkerIcon = new Icon({
    iconUrl: markerIconPng, // Use local icon for reliability
    iconRetinaUrl: markerIcon2xPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


const CONTAINER_STYLE = { height: '100%', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' };
const MAP_STYLE = { height: '100%', width: '100%' };

const MapWidget = ({ showBins = true }: { showBins?: boolean }) => {
    const { bins = [], facilities = [], trucks = [], routes = [] } = useData();
    const { user } = useAuth();
    const position: [number, number] = [24.7136, 46.6753]; // Riyadh Center

    // Optimize: Filter Bins for Manager (West Region)
    const displayBins = useMemo(() => {
        if (!showBins) return [];
        return user?.role === 'manager'
            ? bins.filter(b => b.region === 'West Riyadh')
            : bins;
    }, [bins, showBins, user?.role]);

    // Optimize: Filter Facilities with valid coordinates
    const displayFacilities = useMemo(() => {
        return facilities.filter(f => f.lat && f.lng);
    }, [facilities]);

    // Optimize: Filter Trucks (Manager sees only their region?) - For now show all or filter by region
    const displayTrucks = useMemo(() => {
        return user?.role === 'manager'
            ? trucks.filter(t => t.region === 'West Riyadh') // Assuming trucks have region data matching manager
            : trucks;
    }, [trucks, user?.role]);

    // Optimize: Routes
    const displayRoutes = useMemo(() => {
        return user?.role === 'manager'
            ? routes.filter(r => r.region === 'West Riyadh')
            : routes;
    }, [routes, user?.role]);

    return (
        <div style={CONTAINER_STYLE}>
            <MapContainer center={position} zoom={10} style={MAP_STYLE}>
                <TileLayer
                    // Using CartoDB Dark Matter for that high-tech look
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Truck Routes - Render first so they are behind markers */}
                {displayRoutes.map(route => (
                    route.currentPath && route.currentPath.length > 0 && (
                        <Polyline
                            key={route.id}
                            positions={route.currentPath}
                            pathOptions={{ color: 'var(--accent-admin)', weight: 4, opacity: 0.6 }}
                        >
                            <Popup>
                                <strong>Route: {route.name}</strong><br />
                                Driver: {route.driver}<br />
                                Progress: {route.progress}%
                            </Popup>
                        </Polyline>
                    )
                ))}

                {/* Real Smart Bins from Database */}
                {displayBins.map(bin => (
                    <Marker
                        key={bin.id}
                        position={[bin.lat, bin.lng]}
                        icon={binIcon}
                    >
                        <Popup>
                            <strong>Bin #{bin.id}</strong><br />
                            Status: <span style={{ color: bin.status === 'active' ? 'green' : 'red' }}>{bin.status}</span><br />
                            Fill Level: {bin.fillLevel}%<br />
                            Location: {bin.location || 'Unknown'}
                        </Popup>
                    </Marker>
                ))}

                {/* Facilities Markers */}
                {displayFacilities.map(facility => (
                    <Marker
                        key={facility.id}
                        // Checked in useMemo above
                        position={[facility.lat!, facility.lng!]}
                        icon={facilityIcon}
                    >
                        <Popup>
                            <strong>{facility.name}</strong><br />
                            Type: {facility.type.toUpperCase()}<br />
                            Status: {facility.status}<br />
                            Load: {Math.round((facility.currentLoad / facility.capacity) * 100)}%
                        </Popup>
                    </Marker>
                ))}

                {/* Truck Markers */}
                {displayTrucks.map(truck => {
                    // Find truck position - for now mocking based on route path or center if no route
                    // In real app, truck has lat/lng. Mock data might not have it explicitly on truck object, 
                    // but let's check. If not, we can find it via its route's current position.

                    const truckRoute = routes.find(r => r.truckId === truck.id);
                    const position = truckRoute?.currentPath?.[0] || [24.7136, 46.6753]; // Fallback

                    return (
                        <Marker
                            key={truck.id}
                            position={position as [number, number]}
                            icon={truckMarkerIcon}
                        >
                            <Popup>
                                <strong>Truck {truck.code}</strong><br />
                                Driver: {truck.driver}<br />
                                Status: {truck.status}<br />
                                Load: {truck.currentLoad}%
                            </Popup>
                        </Marker>
                    );
                })}

            </MapContainer>
        </div>
    );
};

export default MapWidget;
