import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet's default icon path issues
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIcon2xPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Custom Icons could be added here
const binIcon = new Icon({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIcon2xPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapWidget = () => {
    const { bins } = useData();
    const { user } = useAuth();
    const position: [number, number] = [24.7136, 46.6753]; // Riyadh Center

    // Filter Bins for Manager (West Region)
    const displayBins = user?.role === 'manager'
        ? bins.filter(b => b.location && b.location.includes('West'))
        : bins;

    return (
        <div style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    // Using CartoDB Dark Matter for that high-tech look
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

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

                {/* We can envision truck routes here later */}
            </MapContainer>
        </div>
    );
};

export default MapWidget;
