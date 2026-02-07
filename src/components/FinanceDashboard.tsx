import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { FileText, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

export const FinanceDashboard = () => {
    const { routes, facilities } = useData();

    const data = useMemo(() => {
        // Mock Financial Data Generation based on real entity counts

        // Calculate Revenue from Facilities (Daily to Monthly projection)
        const recyclingRevenue = facilities
            .filter(f => f.type === 'recycle')
            .reduce((sum, f) => sum + (f.revenue || 0), 0) * 30;

        const energyRevenue = facilities
            .filter(f => f.type === 'energy')
            .reduce((sum, f) => sum + (f.revenue || 0), 0) * 30;

        // 1. Revenue Sources
        const revenueData = [
            { name: 'Recycling Sales', value: recyclingRevenue > 0 ? recyclingRevenue : 450000, color: '#10B981' },
            { name: 'Energy Output', value: energyRevenue > 0 ? energyRevenue : 320000, color: '#F59E0B' },
            { name: 'Service Fees', value: 180000, color: '#3B82F6' },
            { name: 'Gov Subsidies', value: 120000, color: '#8B5CF6' },
        ];

        // 2. Cost Analysis (Monthly)
        const costData = [
            { name: 'Fuel', value: 145000 },
            { name: 'Maintenance', value: 85000 },
            { name: 'Personnel', value: 210000 },
            { name: 'Operations', value: 95000 },
            { name: 'Disposal Fees', value: 65000 },
        ];

        // 3. Profit/Loss Trend (Last 6 Months)
        const trendData = [
            { month: 'Jan', revenue: 980000, cost: 580000 },
            { month: 'Feb', revenue: 1020000, cost: 590000 },
            { month: 'Mar', revenue: 950000, cost: 610000 },
            { month: 'Apr', revenue: 1100000, cost: 600000 },
            { month: 'May', revenue: 1080000, cost: 595000 },
            { month: 'Jun', revenue: 1150000, cost: 585000 },
        ];

        // 4. Route Profitability
        // Mocking profitability based on route efficiency (which we have)
        const routeFinancials = routes.map(r => {
            // Visualize real data connection: Base op cost + (Fuel * 30 days)
            const monthlyFuel = (r.currentFuelCost || 50) * 30;
            const cost = 5000 + monthlyFuel;
            const revenue = 8000 + (r.efficiency * 50); // Revenue correlated to efficiency
            return {
                id: r.id,
                name: r.name,
                cost: Math.round(cost),
                revenue: Math.round(revenue),
                profit: Math.round(revenue - cost),
                roi: Math.round(((revenue - cost) / cost) * 100)
            };
        }).sort((a, b) => a.profit - b.profit); // Sort by profit ascending (loss makers first)

        // 5. KPIs
        const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.value, 0);
        const totalCost = costData.reduce((acc, curr) => acc + curr.value, 0);
        const netProfit = totalRevenue - totalCost;
        const totalTons = 3500; // Mock total tons
        const costPerTon = Math.round(totalCost / totalTons);

        return { revenueData, costData, trendData, routeFinancials, totalRevenue, totalCost, netProfit, costPerTon };
    }, [routes, facilities]);

    const handleDownloadReport = (type: 'pdf' | 'csv') => {
        alert(`Generating ${type.toUpperCase()} Financial Report... Download will start shortly.`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Top KPI Cards */}
            <div className="grid-overview">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Net Profit (Monthly)</p>
                            <h3 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--status-good)' }}>
                                {data.netProfit.toLocaleString()} <span style={{ fontSize: '1rem' }}>SAR</span>
                            </h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', color: 'var(--status-good)' }}>
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--status-good)' }}>
                        +12.5% from last month
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Total Revenue</p>
                            <h3 style={{ fontSize: '1.75rem', margin: 0 }}>
                                {data.totalRevenue.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>SAR</span>
                            </h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3B82F6' }}>
                            <DollarSign size={24} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Operational Cost</p>
                            <h3 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--status-danger)' }}>
                                {data.totalCost.toLocaleString()} <span style={{ fontSize: '1rem' }}>SAR</span>
                            </h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--status-danger)' }}>
                            <TrendingDown size={24} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Cost per Ton</p>
                            <h3 style={{ fontSize: '1.75rem', margin: 0 }}>
                                {data.costPerTon} <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>SAR/Ton</span>
                            </h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#F59E0B' }}>
                            <FileText size={24} />
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--status-good)' }}>
                        -5% Improved Efficiency
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid-desktop-2col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', height: '400px' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Revenue vs Cost Trend</h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--glass-border)', color: 'white' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Legend />
                                <Bar dataKey="revenue" name="Revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="cost" name="Cost" fill="#EF4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Revenue Sources</h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.revenueData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.revenueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--glass-border)', color: 'white' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Reports & Loss Makers */}
            <div className="grid-desktop-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                {/* Reports Generation */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Financial Reports</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>Monthly Performance Report</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compiles all KPIs, costs, and revenues for current month</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleDownloadReport('pdf')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#EF4444', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                                    <FileText size={16} /> PDF
                                </button>
                                <button onClick={() => handleDownloadReport('csv')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#10B981', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                                    <FileText size={16} /> CSV
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>Annual Financial Statement</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full year audit logs and balance sheet</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleDownloadReport('pdf')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#EF4444', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                                    <FileText size={16} /> PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loss Making Routes/Assets */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <AlertCircle size={20} color="var(--status-danger)" />
                        Underperforming Assets
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {data.routeFinancials.slice(0, 4).map(route => (
                            <div key={route.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                background: route.profit < 0 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-main)',
                                borderLeft: route.profit < 0 ? '4px solid var(--status-danger)' : '4px solid var(--status-warning)'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{route.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Route ID: {route.id}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700, color: route.profit < 0 ? 'var(--status-danger)' : 'var(--status-warning)' }}>
                                        {route.profit.toLocaleString()} SAR
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Net Profit</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
