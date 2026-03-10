import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { FileText, TrendingUp, TrendingDown, DollarSign, AlertCircle, Download } from 'lucide-react';
import { useData } from '../context/DataContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const FinanceDashboard = () => {
    const { routes, facilities, trucks, bins } = useData();

    const data = useMemo(() => {
        // 1. Revenue Sources (Real-time from facilities)
        const recyclingRevenue = facilities
            .filter(f => f.type === 'recycle')
            .reduce((sum, f) => sum + (f.revenue || 0), 0);

        const energyRevenue = facilities
            .filter(f => f.type === 'energy')
            .reduce((sum, f) => sum + (f.revenue || 0), 0);

        const revenueData = [
            { name: 'Recycling Sales', value: recyclingRevenue > 0 ? recyclingRevenue : 450000, color: '#10B981' },
            { name: 'Energy Output', value: energyRevenue > 0 ? energyRevenue : 320000, color: '#F59E0B' },
            { name: 'Service Fees', value: 180000, color: '#3B82F6' },
            { name: 'Gov Subsidies', value: 120000, color: '#8B5CF6' },
        ];

        // 2. Cost Analysis (Monthly Projection)
        // Fuel cost based on truck consumption simulation
        const simulatedFuelCost = routes.reduce((sum, r) => sum + (r.currentFuelCost || 0), 0) * 30;
        const maintenanceCost = trucks.length * 1250;
        const personnelCost = trucks.filter(t => t.driver !== 'Unassigned').length * 4500;
        const disposalFees = facilities.filter(f => f.type === 'dumpyard').reduce((acc, f) => acc + (f.currentLoad * 12), 0);

        const costData = [
            { name: 'Fuel', value: simulatedFuelCost > 0 ? simulatedFuelCost : 145000 },
            { name: 'Maintenance', value: maintenanceCost },
            { name: 'Personnel', value: personnelCost > 0 ? personnelCost : 210000 },
            { name: 'Operations', value: 95000 },
            { name: 'Disposal Fees', value: disposalFees > 0 ? disposalFees : 65000 },
        ];

        // 3. Profit/Loss Trend (Keep static for UI variety, but total matches)
        const trendData = [
            { month: 'Jan', revenue: 980000, cost: 580000 },
            { month: 'Feb', revenue: 1020000, cost: 590000 },
            { month: 'Mar', revenue: 950000, cost: 610000 },
            { month: 'Apr', revenue: 1100000, cost: 600000 },
            { month: 'May', revenue: 1080000, cost: 595000 },
            { month: 'Jun', revenue: 1150000, cost: 585000 },
        ];

        // 4. Route Profitability (Dynamic from routes data)
        const routeFinancials = routes.map(r => {
            const cost = 5000 + (r.currentFuelCost || 50) * 20;
            const revenue = 8000 + (r.efficiency * 60);
            return {
                id: r.id,
                name: r.name,
                cost: Math.round(cost),
                revenue: Math.round(revenue),
                profit: Math.round(revenue - cost),
                roi: Math.round(((revenue - cost) / cost) * 100)
            };
        }).sort((a, b) => a.profit - b.profit);

        // 5. KPIs
        const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.value, 0);
        const totalCost = costData.reduce((acc, curr) => acc + curr.value, 0);
        const netProfit = totalRevenue - totalCost;
        const totalTons = facilities.reduce((acc, f) => acc + f.currentLoad, 0) + 1500;
        const costPerTon = Math.round(totalCost / totalTons);

        return { revenueData, costData, trendData, routeFinancials, totalRevenue, totalCost, netProfit, costPerTon };
    }, [routes, facilities]);

    const handleDownloadReport = (type: 'pdf' | 'csv') => {
        if (type === 'pdf') {
            const doc = new jsPDF();
            const timestamp = new Date().toLocaleString();

            // 1. Header & Branding
            doc.setFillColor(31, 41, 55); // Dark theme matching app
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text('GREENFLOW', 14, 25);
            doc.setFontSize(12);
            doc.text('Smart Waste Management Financial Report', 14, 33);

            doc.setTextColor(100, 116, 139);
            doc.setFontSize(10);
            doc.text(`Generated: ${timestamp}`, 155, 15);

            // 2. Executive Summary (KPIs)
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.text('1. Executive Financial Summary', 14, 55);

            autoTable(doc, {
                startY: 60,
                head: [['Metric', 'Current Month (SAR)', 'Projected Annual (SAR)']],
                body: [
                    ['Total Revenue', data.totalRevenue.toLocaleString(), (data.totalRevenue * 12).toLocaleString()],
                    ['Operational Costs', data.totalCost.toLocaleString(), (data.totalCost * 12).toLocaleString()],
                    ['Net Profit', data.netProfit.toLocaleString(), (data.netProfit * 12).toLocaleString()],
                    ['Cost per Ton', `${data.costPerTon} SAR`, 'N/A'],
                ],
                theme: 'striped',
                headStyles: { fillColor: [59, 130, 246] }
            });

            // 3. Revenue Breakdown
            doc.setFontSize(16);
            doc.text('2. Revenue Stream Analytics', 14, (doc as any).lastAutoTable.finalY + 15);

            autoTable(doc, {
                startY: (doc as any).lastAutoTable.finalY + 20,
                head: [['Source', 'Revenue (SAR)', '% of Total Portfolio']],
                body: data.revenueData.map(r => [
                    r.name,
                    r.value.toLocaleString(),
                    `${((r.value / data.totalRevenue) * 100).toFixed(1)}%`
                ]),
                theme: 'grid',
                headStyles: { fillColor: [16, 185, 129] }
            });

            // 4. Operational Assets Efficiency
            doc.setFontSize(16);
            doc.text('3. Route Profitability Index', 14, (doc as any).lastAutoTable.finalY + 15);

            autoTable(doc, {
                startY: (doc as any).lastAutoTable.finalY + 20,
                head: [['Route/ID', 'Monthly Cost', 'Monthly Revenue', 'Profit', 'ROI%']],
                body: data.routeFinancials.map(r => [
                    `${r.name} (${r.id})`,
                    r.cost.toLocaleString(),
                    r.revenue.toLocaleString(),
                    r.profit.toLocaleString(),
                    `${r.roi}%`
                ]),
                theme: 'striped',
                headStyles: { fillColor: [245, 158, 11] }
            });

            // 5. Facility Operations
            doc.setFontSize(16);
            doc.text('4. Processing Facility Performance', 14, (doc as any).lastAutoTable.finalY + 15);

            autoTable(doc, {
                startY: (doc as any).lastAutoTable.finalY + 20,
                head: [['Facility Name', 'Type', 'Utilization', 'Revenue Earned']],
                body: facilities.map(f => [
                    f.name,
                    f.type.toUpperCase(),
                    `${Math.round((f.currentLoad / f.capacity) * 100)}%`,
                    `${(f.revenue || 0).toLocaleString()} SAR`
                ]),
                headStyles: { fillColor: [139, 92, 246] }
            });

            // 6. Fleet & Bin Statistics (Analytic Summary)
            doc.addPage();
            doc.setFontSize(16);
            doc.text('5. Fleet & Infrastructure Analytics', 14, 25);

            const activeTrucks = trucks.filter(t => t.status === 'active').length;
            const avgFuel = Math.round(trucks.reduce((acc, t) => acc + (t.fuel || 0), 0) / trucks.length);
            const totalMileage = trucks.reduce((acc, t) => acc + (t.mileage || 0), 0);

            autoTable(doc, {
                startY: 35,
                head: [['Asset Metric', 'Current Value']],
                body: [
                    ['Total Fleet (Trucks)', trucks.length],
                    ['Active Fleet (%)', `${Math.round((activeTrucks / trucks.length) * 100)}%`],
                    ['Average Fleet Fuel Level', `${avgFuel}%`],
                    ['Total Fleet Mileage', `${totalMileage.toLocaleString()} km`],
                    ['Total IoT Smart Bins', bins.length],
                    ['Average Bin Fill Level', `${Math.round(bins.reduce((acc, b) => acc + b.fillLevel, 0) / bins.length)}%`],
                ],
                theme: 'grid'
            });

            doc.save(`GreenFlow_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
        } else {
            // Detailed CSV Generation
            let csv = "GreenFlow Financial Analytic Report\n";
            csv += `Generated: ${new Date().toLocaleString()}\n\n`;

            csv += "EXECUTIVE SUMMARY\n";
            csv += `Metric,Value (SAR)\n`;
            csv += `Total Revenue,${data.totalRevenue}\n`;
            csv += `Total Costs,${data.totalCost}\n`;
            csv += `Net Profit,${data.netProfit}\n\n`;

            csv += "ROUTE PROFITABILITY\n";
            csv += "ID,Name,Cost,Revenue,Profit,ROI%\n";
            data.routeFinancials.forEach(r => {
                csv += `${r.id},${r.name},${r.cost},${r.revenue},${r.profit},${r.roi}%\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `GreenFlow_Data_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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
                                    <Download size={16} /> PDF
                                </button>
                                <button onClick={() => handleDownloadReport('csv')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#10B981', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                                    <Download size={16} /> CSV
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
                                    <Download size={16} /> PDF
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
