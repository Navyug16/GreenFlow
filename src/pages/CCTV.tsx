import { useState } from 'react';

const CAMERAS = [
    {
        id: 1,
        name: 'Main Gate',
        location: 'Entrance',
        status: 'Live',
        url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'Parking Lot',
        location: 'Zone A',
        status: 'Live',
        url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'Server Room',
        location: 'Basement',
        status: 'Recording',
        url: 'https://images.unsplash.com/photo-1558494949-ef2bb229a98a?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 4,
        name: 'Lobby',
        location: 'Ground Floor',
        status: 'Live',
        url: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1000&auto=format&fit=crop'
    },
];

const CCTV = () => {
    const [selectedCamera, setSelectedCamera] = useState(CAMERAS[0]);

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Central Monitoring System</h1>
                <div style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{
                        display: 'block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        boxShadow: '0 0 8px #ef4444'
                    }}></span>
                    LIVE FEED
                </div>
            </div>

            {/* Main Large View (Big Screen) */}
            <div className="glass-panel" style={{
                marginBottom: '2rem',
                padding: '1rem',
                height: '60vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    flex: 1,
                    background: '#000',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <img
                        src={selectedCamera.url}
                        alt={selectedCamera.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                    />

                    {/* Overlay UI */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        padding: '1rem',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <h3 style={{ margin: 0, color: '#fff' }}>{selectedCamera.name}</h3>
                            <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{selectedCamera.location}</span>
                        </div>
                        <div style={{ textAlign: 'right', color: '#fff', fontFamily: 'monospace' }}>
                            {new Date().toLocaleTimeString()}
                        </div>
                    </div>

                    {/* REC Indicator */}
                    <div style={{
                        position: 'absolute',
                        bottom: '2rem',
                        right: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#fff',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px'
                    }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'red', animation: 'pulse 2s infinite' }}></div>
                        REC
                    </div>
                </div>
            </div>

            {/* Small Cards Grid - One Line */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '1rem'
            }}>
                {CAMERAS.map((cam) => (
                    <div
                        key={cam.id}
                        className="card"
                        onClick={() => setSelectedCamera(cam)}
                        style={{
                            cursor: 'pointer',
                            padding: '1rem',
                            border: selectedCamera.id === cam.id ? '2px solid var(--accent-admin)' : '1px solid var(--glass-border)',
                            transition: 'all 0.3s ease',
                            transform: selectedCamera.id === cam.id ? 'translateY(-2px)' : 'none',
                            backgroundColor: selectedCamera.id === cam.id ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-panel)'
                        }}
                    >
                        <div style={{
                            height: '120px',
                            background: '#000',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: '1rem',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <img
                                src={cam.url}
                                alt={cam.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: '0.5rem',
                                left: '0.5rem',
                                background: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '2px'
                            }}>
                                CAM-0{cam.id}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{cam.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cam.location}</div>
                            </div>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: cam.status === 'Live' ? '#22c55e' : '#eab308'
                            }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @media (max-width: 768px) {
           /* On mobile, maybe allow scrolling instead of 4 squished columns if needed */
           /* But user specifically asked for "in one line add 4 card" so we keep grid but ensure overflow handling */
           .glass-panel { height: 40vh !important; }
        }
      `}</style>
        </div>
    );
};

export default CCTV;
