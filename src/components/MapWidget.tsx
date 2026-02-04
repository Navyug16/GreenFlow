import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { DEMO_ROUTE, FACILITIES } from '../data/mockData';

// Fix Leaflet's default icon path issues
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIcon2xPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new Icon({
    iconUrl: markerIconPng, // simple casting or import fix
    iconRetinaUrl: markerIcon2xPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapWidget = () => {
    const position: [number, number] = [24.7136, 46.6753]; // Riyadh

    return (
        <div style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <MapContainer center={position} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    // Using CartoDB Dark Matter for that high-tech look
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Facilities Markers */}
                {FACILITIES.map(f => (
                    <Marker
                        key={f.id}
                        position={f.id === 'F1' ? [24.7136, 46.6753] : f.id === 'F2' ? [24.75, 46.7] : [24.65, 46.6]}
                        icon={defaultIcon}
                    >
                        <Popup>
                            <strong>{f.name}</strong><br />
                            Type: {f.type}<br />
                            Status: {f.status}
                        </Popup>
                    </Marker>
                ))}

                {/* Demo Route */}
                <Polyline positions={DEMO_ROUTE} color="var(--accent-admin)" />
            </MapContainer>
        </div>
    );
};

export default MapWidget;
