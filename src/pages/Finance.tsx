import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Activity,
    Zap,
    Truck,
    Factory,
    Wrench,
    PieChart,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { useData } from '../context/DataContext';

const FinancePage = () => {
    const { facilities, routes, requests, incidents } = useData();

    // Calculations
    const dailyRevenue = facilities.reduce((acc, f) => acc + f.revenue, 0);

    // Costs
    const dailyFuelCost = routes.reduce((acc, r) => acc + r.currentFuelCost, 0);
    const dailyFacilityCost = facilities.reduce((acc, f) => acc + (f.operatingCost || 0), 0);
    // Estimated: 500 SAR per active request, 1000 SAR per unresolved incident (immediate liability)
    const maintenanceCost = (requests.filter(r => r.status === 'pending').length * 500) +
        (incidents.filter(i => !i.resolved).length * 1000);

    const totalDailyCost = dailyFuelCost + dailyFacilityCost + maintenanceCost;
    const netProfit = dailyRevenue - totalDailyCost;
    const profitMargin = (netProfit / dailyRevenue) * 100;

    // Efficiency Metrics
    const avgFacilityUtilization = facilities.reduce((acc, f) => acc + (f.currentLoad / f.capacity), 0) / facilities.length * 100;
    const avgRouteEfficiency = routes.reduce((acc, r) => acc + r.efficiency, 0) / routes.length;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Finance & Reporting</h1>
                    <p style={{ color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>Financial performance and operational efficiency analysis</p>
                </div>
                <div style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--bg-panel)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--glass-border)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    Last Updated: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', fontWeight: 500 }}>Net Profit (Daily)</p>
                            <h2 style={{ fontSize: '1.75rem', margin: '0.25rem 0', color: netProfit >= 0 ? 'var(--status-good)' : 'var(--status-danger)' }}>
                                {formatCurrency(netProfit)}
                            </h2>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', color: 'var(--status-good)' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--status-good)', display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
                            <TrendingUp size={14} /> {profitMargin.toFixed(1)}%
                        </span>
                        <span style={{ color: 'var(--text-tertiary)' }}>margin</span>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Revenue</p>
                            <h2 style={{ fontSize: '1.75rem', margin: '0.25rem 0' }}>{formatCurrency(dailyRevenue)}</h2>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: 'var(--accent-admin)' }}>
                            <Activity size={20} />
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'var(--bg-main)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: '100%', height: '100%', background: 'var(--accent-admin)' }} />
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Costs</p>
                            <h2 style={{ fontSize: '1.75rem', margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{formatCurrency(totalDailyCost)}</h2>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: 'var(--status-danger)' }}>
                            <ArrowDownRight size={20} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        <span>Ops: {Math.round((dailyFacilityCost / totalDailyCost) * 100)}%</span> •
                        <span>Fuel: {Math.round((dailyFuelCost / totalDailyCost) * 100)}%</span>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', fontWeight: 500 }}>Global Efficiency</p>
                            <h2 style={{ fontSize: '1.75rem', margin: '0.25rem 0' }}>{Math.round((avgFacilityUtilization + avgRouteEfficiency) / 2)}%</h2>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px', color: 'var(--status-warning)' }}>
                            <PieChart size={20} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                        <Zap size={14} /> System Health: Good
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Cost Distribution */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingDown size={18} className="text-danger" /> Cost Distribution
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Facility Operations */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Factory size={16} /> Facility Operations</span>
                                <span style={{ fontWeight: 600 }}>{formatCurrency(dailyFacilityCost)}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${(dailyFacilityCost / totalDailyCost) * 100}%`,
                                    height: '100%',
                                    background: 'var(--accent-finance)',
                                    borderRadius: '4px'
                                }} />
                            </div>
                        </div>

                        {/* Fuel */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Truck size={16} /> Fleet Fuel Usage</span>
                                <span style={{ fontWeight: 600 }}>{formatCurrency(dailyFuelCost)}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${(dailyFuelCost / totalDailyCost) * 100}%`,
                                    height: '100%',
                                    background: 'var(--accent-engineer)',
                                    borderRadius: '4px'
                                }} />
                            </div>
                        </div>

                        {/* Maintenance */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wrench size={16} /> Maintenance & Repairs</span>
                                <span style={{ fontWeight: 600 }}>{formatCurrency(maintenanceCost)}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${(maintenanceCost / totalDailyCost) * 100}%`,
                                    height: '100%',
                                    background: 'var(--status-danger)',
                                    borderRadius: '4px'
                                }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue Streams */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={18} style={{ color: 'var(--status-good)' }} /> Revenue Streams
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {facilities.filter(f => f.revenue > 0).map(facility => (
                            <div key={facility.id} style={{
                                padding: '1rem',
                                background: 'var(--bg-main)',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        padding: '0.5rem',
                                        background: facility.type === 'energy' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                        borderRadius: '6px',
                                        color: facility.type === 'energy' ? 'var(--status-warning)' : 'var(--status-good)'
                                    }}>
                                        {facility.type === 'energy' ? <Zap size={18} /> : <Factory size={18} />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{facility.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                            Output: {facility.output.toLocaleString()} {facility.type === 'energy' ? 'kW' : 'Tons'}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(facility.revenue)}</div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: facility.revenue > facility.operatingCost ? 'var(--status-good)' : 'var(--status-danger)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        gap: '0.25rem'
                                    }}>
                                        {facility.revenue > facility.operatingCost ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {(facility.revenue / facility.operatingCost * 100 - 100).toFixed(0)}% ROI
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Reporting Table */}
            <div className="card">
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem' }}>Detailed Facility Financials</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-tertiary)' }}>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Facility Name</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Type</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Operating Cost</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Revenue</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Net Impact</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Efficiency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facilities.map(facility => {
                                const net = facility.revenue - facility.operatingCost;
                                const efficiency = (facility.currentLoad / facility.capacity) * 100;

                                return (
                                    <tr key={facility.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{facility.name}</td>
                                        <td style={{ padding: '1rem 0.5rem', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{facility.type}</td>
                                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right', color: 'var(--text-secondary)' }}>{formatCurrency(facility.operatingCost)}</td>
                                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right', color: 'var(--text-primary)' }}>{formatCurrency(facility.revenue)}</td>
                                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: 600, color: net >= 0 ? 'var(--status-good)' : 'var(--status-danger)' }}>
                                            {net >= 0 ? '+' : ''}{formatCurrency(net)}
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '0.85rem' }}>{Math.round(efficiency)}%</span>
                                                <div style={{ width: 40, height: 4, background: 'var(--bg-main)', borderRadius: 2 }}>
                                                    <div style={{ width: `${efficiency}%`, height: '100%', background: efficiency > 90 ? 'var(--status-warning)' : 'var(--accent-admin)', borderRadius: 2 }} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinancePage;
