import { useState, useEffect } from 'react';
import { Factory, Zap, Trash2, Activity, X, Thermometer, Gauge, BarChart3, Wind, Droplets, Download, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import MapWidget from '../components/MapWidget';
import type { Facility } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getIcon = (type: string) => {
    switch (type) {
        case 'energy': return Zap;
        case 'dumpyard': return Trash2;
        case 'recycle': return Factory;
        default: return Factory;
    }
};

const getColor = (type: string) => {
    switch (type) {
        case 'energy': return '#fbbf24'; // var(--accent-engineer)
        case 'dumpyard': return '#ef4444'; // var(--accent-danger)
        case 'recycle': return '#34d399'; // var(--accent-manager)
        default: return '#f1f5f9'; // var(--text-primary)
    }
};

const getUnit = (type: string) => {
    switch (type) {
        case 'energy': return 'kW';
        case 'dumpyard': return 'Tons';
        case 'recycle': return 'Tons';
        default: return 'Units';
    }
};

const MetricCard = ({ label, value, unit, icon: Icon, color }: any) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: color, fontSize: '0.85rem', fontWeight: 500 }}>
            <Icon size={16} /> {label}
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {value} <span style={{ fontSize: '0.85rem', opacity: 0.5, fontWeight: 400 }}>{unit}</span>
        </div>
    </div>
);

// Modal Component
const FacilityModal = ({ facility, onClose, metrics }: { facility: Facility, onClose: () => void, metrics: any }) => {
    const Icon = getIcon(facility.type);
    const color = getColor(facility.type);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
                padding: '1rem'
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="glass-panel-heavy"
                style={{
                    width: '100%', maxWidth: '900px', borderRadius: '24px',
                    maxHeight: 'min(95vh, 800px)', // Constrain height
                    overflow: 'hidden', position: 'relative',
                    display: 'flex', flexDirection: 'column'
                }}
            >
                {/* Header HUD */}
                <div style={{ padding: '1.5rem 2rem', background: `linear-gradient(135deg, ${color}15, transparent)`, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            padding: '1rem', background: color, borderRadius: '16px', color: '#0f172a',
                            boxShadow: `0 0 30px ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Icon size={32} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>{facility.name}</h2>
                                <div style={{ padding: '0.25rem 0.75rem', background: `${color}20`, color: color, borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', border: `1px solid ${color}40` }}>
                                    {facility.status}
                                </div>
                            </div>
                            <p style={{ margin: '0.25rem 0 0', opacity: 0.5, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                {facility.region} <span style={{ opacity: 0.3 }}>|</span> <span style={{ textTransform: 'uppercase' }}>{facility.type} UNIT</span>
                            </p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer' }}
                    >
                        <X size={20} />
                    </motion.button>
                </div>

                {/* Content HUD - Scrollable */}
                <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        {facility.type === 'energy' && (
                            <>
                                <MetricCard label="Turbine RPM" value={Math.round(metrics.rpm)} unit="STABLE" icon={Wind} color="#38bdf8" />
                                <MetricCard label="Core Temp" value={Math.round(metrics.temp)} unit="°C" icon={Thermometer} color="#f43f5e" />
                                <MetricCard label="Grid Load" value={metrics.voltage.toFixed(2)} unit="kV" icon={Zap} color="#fbbf24" />
                                <MetricCard label="System Psi" value={Math.round(metrics.pressure)} unit="BAR" icon={Gauge} color="#a78bfa" />
                            </>
                        )}
                        {facility.type === 'recycle' && (
                            <>
                                <MetricCard label="Line Vel" value={(metrics.rpm / 1000).toFixed(1)} unit="m/s" icon={Activity} color="#38bdf8" />
                                <MetricCard label="Purity" value={(90 + metrics.voltage).toFixed(1)} unit="%" icon={Zap} color="#34d399" />
                                <MetricCard label="Throughput" value={Math.round(metrics.rpm / 50)} unit="U/h" icon={Factory} color="#a78bfa" />
                                <MetricCard label="Sensors" value="ACTIVE" unit="" icon={ShieldAlert} color="#fbbf24" />
                            </>
                        )}
                        {facility.type === 'dumpyard' && (
                            <>
                                <MetricCard label="Methane" value={(metrics.pressure * 2).toFixed(0)} unit="ppm" icon={Wind} color="#34d399" />
                                <MetricCard label="Compression" value={(metrics.rpm / 500).toFixed(1)} unit="x" icon={BarChart3} color="#38bdf8" />
                                <MetricCard label="Moisture" value={(metrics.voltage * 4).toFixed(1)} unit="%" icon={Droplets} color="#fbbf24" />
                                <MetricCard label="Integrity" value="NOMINAL" unit="" icon={ShieldAlert} color="#f43f5e" />
                            </>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={18} /> Operational Logs
                            </h3>
                            <p style={{ lineHeight: '1.6', opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                {facility.description} Peak efficiency reported across all subsystems. AI-driven optimization active.
                            </p>

                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.4, marginBottom: '0.25rem', textTransform: 'uppercase' }}>Capacity</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{facility.capacity?.toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>Tons</span></div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.4, marginBottom: '0.25rem', textTransform: 'uppercase' }}>Revenue</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>SAR {facility.revenue?.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                                <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                    <motion.circle
                                        cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="6"
                                        strokeDasharray="283"
                                        initial={{ strokeDashoffset: 283 }}
                                        animate={{ strokeDashoffset: 283 - (283 * 0.94) }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>94%</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 600 }}>OEE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer HUD */}
                <div style={{ padding: '1rem 2rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexShrink: 0 }}>
                    <button onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Close Console</button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '0.75rem 1.75rem', background: color, color: '#0f172a', border: 'none', borderRadius: '12px',
                            fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 30px ${color}30`,
                            display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'
                        }}
                    >
                        <Download size={18} /> Audit PDF
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ReportModal = ({ isOpen, onClose, facilities, reportDuration, setReportDuration }: any) => {
    if (!isOpen) return null;

    // Mock calculations based on duration
    const multiplier = reportDuration === 'day' ? 1 : reportDuration === 'week' ? 7 : 30;
    const totalProcessed = 2500 * multiplier;
    const totalEnergy = 850 * multiplier;
    const totalRevenue = facilities.reduce((acc: number, f: Facility) => acc + f.revenue, 0) * multiplier;

    const downloadReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("GreenFlow - System Performance Report", 14, 22);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.text(`Duration: ${reportDuration.charAt(0).toUpperCase() + reportDuration.slice(1)}`, 14, 35);
        doc.setDrawColor(200);
        doc.line(14, 40, 196, 40);
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("System Overview", 14, 50);
        doc.setFontSize(12);
        doc.setTextColor(60);
        doc.text(`Total Waste Processed: ${totalProcessed.toLocaleString()} Tons`, 14, 60);
        doc.text(`Total Energy Generated: ${totalEnergy.toLocaleString()} kW`, 14, 68);
        doc.text(`Total Revenue: ${totalRevenue.toLocaleString()} SAR`, 14, 76);

        const tableData = facilities.map((f: Facility) => [
            f.name,
            f.type.toUpperCase(),
            f.region,
            `${Math.round(f.output * multiplier)} ${getUnit(f.type)}`,
            f.status.toUpperCase()
        ]);

        autoTable(doc, {
            startY: 85,
            head: [['Facility Name', 'Type', 'Region', 'Output', 'Status']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] },
            styles: { fontSize: 10 }
        });
        doc.save(`greenflow-report-${reportDuration}.pdf`);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0 }}>System Analytics</h2>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}><X size={20} /></button>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', opacity: 0.6, fontSize: '0.9rem' }}>Select Duration</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        {(['day', 'week', 'month'] as const).map(d => (
                            <button
                                key={d}
                                onClick={() => setReportDuration(d)}
                                style={{
                                    padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: reportDuration === d ? '#10b981' : 'rgba(255,255,255,0.02)',
                                    color: reportDuration === d ? '#0f172a' : 'white', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {d.charAt(0).toUpperCase() + d.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ opacity: 0.6 }}>Processed</span>
                        <span style={{ fontWeight: 700 }}>{totalProcessed.toLocaleString()} Tons</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ opacity: 0.6 }}>Generation</span>
                        <span style={{ fontWeight: 700 }}>{totalEnergy.toLocaleString()} kW</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                        <span style={{ opacity: 0.8 }}>Total Revenue</span>
                        <span style={{ fontWeight: 800 }}>SAR {totalRevenue.toLocaleString()}</span>
                    </div>
                </div>

                <button
                    onClick={downloadReport}
                    style={{ width: '100%', padding: '1rem', background: '#10b981', color: '#0f172a', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                >
                    <Download size={20} /> Generate PDF Report
                </button>
            </motion.div>
        </div>
    );
};

const FacilitiesPage = () => {
    const { user } = useAuth();
    const { facilities = [] } = useData();
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportDuration, setReportDuration] = useState<'day' | 'week' | 'month'>('day');

    // Simulated Metrics State for the Modal
    const [metrics, setMetrics] = useState({
        temp: 0,
        pressure: 0,
        voltage: 0,
        rpm: 0
    });

    // Animate metrics when a facility is selected
    useEffect(() => {
        if (!selectedFacility) return;

        // Initial random values
        setMetrics({
            temp: 450 + Math.random() * 50,
            pressure: 80 + Math.random() * 10,
            voltage: 11 + Math.random(),
            rpm: 3200 + Math.random() * 200
        });

        const interval = setInterval(() => {
            setMetrics(prev => ({
                temp: prev.temp + (Math.random() - 0.5) * 5,
                pressure: prev.pressure + (Math.random() - 0.5) * 2,
                voltage: prev.voltage + (Math.random() - 0.5) * 1, // Increased variation for "live" feel
                rpm: prev.rpm + (Math.random() - 0.5) * 100
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [selectedFacility]);

    if (user?.role === 'engineer') {
        return <div style={{ padding: '2rem', color: 'white' }}>Access Restricted: Engineers view specific machinery via the dedicated module.</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', minHeight: '100vh', color: 'white' }}
        >
            {/* Header Bento Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-panel" style={{ gridColumn: 'span 2', padding: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div className="pulse-dot" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#10b981' }}>Live Network Status: Operational</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>Facilities Command</h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowReportModal(true)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '1rem 1.5rem', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1 }}
                    >
                        <Download size={18} /> Analytics Export
                    </motion.button>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.5, marginBottom: '0.5rem' }}>
                        <Activity size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Efficiency OEE</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>94.2% <span style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700 }}>+1.2%</span></div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.5, marginBottom: '0.5rem' }}>
                        <Zap size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Energy Recovery</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>850 <span style={{ fontSize: '1rem', opacity: 0.5 }}>kW/h</span></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
                {/* Map Section */}
                <div style={{ position: 'sticky', top: '2rem', height: '600px' }}>
                    <div className="glass-panel-heavy" style={{ padding: '1rem', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
                        <MapWidget showFacilitiesOnly={true} />
                    </div>
                </div>

                {/* Facilities List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {facilities.map((f, idx) => (
                        <motion.div
                            key={f.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glow-card glass-panel"
                            style={{ padding: '1.75rem', overflow: 'hidden' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{
                                        padding: '1.25rem', background: `${getColor(f.type)}15`, color: getColor(f.type), borderRadius: '20px',
                                        boxShadow: `0 0 30px ${getColor(f.type)}10`, border: `1px solid ${getColor(f.type)}25`
                                    }}>
                                        {(() => { const Icon = getIcon(f.type); return <Icon size={28} />; })()}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{f.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', opacity: 0.5, fontSize: '0.85rem', fontWeight: 600 }}>
                                            {f.region} • {f.type.toUpperCase()} UNIT
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{f.output.toLocaleString()} <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 500 }}>{getUnit(f.type)}</span></div>
                                    <div style={{ color: getColor(f.type), fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.4rem' }}>{f.status}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedFacility(f)}
                                    style={{ flex: 1, padding: '0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                    Access Command Console
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                facilities={facilities}
                reportDuration={reportDuration}
                setReportDuration={setReportDuration}
            />

            <AnimatePresence>
                {selectedFacility && (
                    <FacilityModal
                        facility={selectedFacility}
                        onClose={() => setSelectedFacility(null)}
                        metrics={metrics}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FacilitiesPage;
