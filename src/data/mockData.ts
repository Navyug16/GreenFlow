import type { User, KpiStat, Incident, Facility } from '../types';

export const CURRENT_USER: User = {
    id: 'u1',
    name: 'Navyug Galani',
    role: 'admin', // Default to admin for demo
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
};

export const ADMIN_STATS: KpiStat[] = [
    { label: 'Total Revenue', value: '4.2M', unit: 'SAR', change: 12, icon: 'DollarSign', color: 'var(--accent-finance)' },
    { label: 'Active Trucks', value: 142, change: 5, icon: 'Truck', color: 'var(--accent-admin)' },
    { label: 'Total Bins', value: '12,450', change: 0, icon: 'Trash2', color: 'var(--text-secondary)' },
    { label: 'Total Drivers', value: 310, change: 2, icon: 'Users', color: 'var(--text-primary)' },
    { label: 'Avg Bin Fill', value: 68, unit: '%', change: -4, icon: 'BarChart3', color: 'var(--accent-manager)' },
    { label: 'Avg Truck Fill', value: 82, unit: '%', change: 8, icon: 'Box', color: 'var(--accent-engineer)' },
];

export const MANAGER_STATS: KpiStat[] = [
    { label: 'Waste Collected Today', value: '850', unit: 'Tons', change: 15, icon: 'Scale', color: 'var(--accent-manager)' },
    { label: 'Active Routes', value: 45, change: 0, icon: 'Map', color: 'var(--accent-admin)' },
    { label: 'Pending Requests', value: 12, change: -2, icon: 'AlertCircle', color: 'var(--accent-warning)' },
];

export const ENGINEER_STATS: KpiStat[] = [
    { label: 'Trucks to Maintain', value: 3, change: 1, icon: 'Wrench', color: 'var(--accent-danger)' },
    { label: 'Bins to Repair', value: 15, change: -5, icon: 'Hammer', color: 'var(--accent-warning)' },
    { label: 'Machinery Status', value: '98%', unit: 'Health', change: 0, icon: 'Activity', color: 'var(--status-good)' },
];

export const FINANCE_STATS: KpiStat[] = [
    { label: 'Total Revenue', value: '42.5M', unit: 'SAR', change: 12, icon: 'DollarSign', color: 'var(--status-good)' },
    { label: 'Energy Generation', value: '18.2M', unit: 'SAR', change: 8, icon: 'Zap', color: 'var(--accent-engineer)' },
    { label: 'Recycling Output', value: '8.4M', unit: 'SAR', change: 24, icon: 'Recycle', color: 'var(--accent-manager)' },
];

export const RECENT_INCIDENTS: Incident[] = [
    { id: 'i1', type: 'truck_failure', message: 'Truck T-104 engine overheating in Sector 4', timestamp: '10 min ago', severity: 'high', resolved: false },
    { id: 'i2', type: 'bin_overflow', message: 'Smart Bin B-2292 disconnected from network', timestamp: '45 min ago', severity: 'medium', resolved: false },
    { id: 'i3', type: 'facility_warning', message: 'Conveyor Belt C-2 maintenance due soon', timestamp: '2 hours ago', severity: 'low', resolved: true },
];

// User provided Facility
export const FACILITIES: Facility[] = [
    {
        id: 'F1',
        name: 'Recycling Unit',
        type: 'recycle',
        status: 'operational',
        output: 450,
        description: 'Recycles waste materials into reusable resources.'
    },
    {
        id: 'F2',
        name: 'Dump Yard',
        type: 'dumpyard',
        status: 'operational',
        output: 1200,
        description: 'Final disposal site for non-recyclable and non-energy waste.'
    },
    {
        id: 'F3',
        name: 'Energy Recovery Plant',
        type: 'energy',
        status: 'operational',
        output: 850,
        description: 'Generates renewable energy from waste processing.'
    },
];

// Simple path for demo (Riyadh approx)
export const DEMO_ROUTE: [number, number][] = [
    [24.7136, 46.6753],
    [24.7236, 46.6853],
    [24.7336, 46.6953],
    [24.7436, 46.7053],
];

export interface Bin {
    id: string;
    lat: number;
    lng: number;
    fillLevel: number; // 0-100
    status: 'active' | 'maintenance' | 'offline';
    lastCollection: string;
}

export const BINS: Bin[] = [
    { id: 'B1', lat: 24.7136, lng: 46.6753, fillLevel: 85, status: 'active', lastCollection: '1 day ago' },
    { id: 'B2', lat: 24.7200, lng: 46.7000, fillLevel: 60, status: 'active', lastCollection: '2 days ago' },
    { id: 'B3', lat: 24.7300, lng: 46.6900, fillLevel: 95, status: 'active', lastCollection: '4 hours ago' },
];

export const TRUCK_ROUTES = [
    // Route for Truck T1
    {
        id: 'T1',
        name: 'Route T1 (Central)',
        driver: 'Ahmed Khan',
        vehicle: 'Mercedes Actros',
        status: 'in_progress',
        progress: 0,
        efficiency: 94,
        // Path: T1 -> B1 -> B3 -> F1
        currentPath: [
            [24.7100, 46.6800], // Start T1
            [24.7118, 46.6776],
            [24.7136, 46.6753], // B1
            [24.7190, 46.6800],
            [24.7245, 46.6850],
            [24.7300, 46.6900], // B3
            [24.7366, 46.7000],
            [24.7433, 46.7100],
            [24.7500, 46.7200]  // End F1
        ] as [number, number][]
    },
    // Route for Truck T2
    {
        id: 'T2',
        name: 'Route T2 (East)',
        driver: 'John Smith',
        vehicle: 'Volvo FMX',
        status: 'optimizing',
        progress: 0,
        efficiency: 0,
        // Path: T2 -> B2 -> F1
        currentPath: [
            [24.7350, 46.7050], // Start T2
            [24.7300, 46.7033],
            [24.7250, 46.7016],
            [24.7200, 46.7000], // B2
            [24.7300, 46.7066],
            [24.7400, 46.7133],
            [24.7500, 46.7200]  // End F1
        ] as [number, number][]
    }
];

export const REQUESTS = [
    { id: 'req1', type: 'Truck', notes: 'Need additional compactor for Sector 7', status: 'pending', date: '2026-01-15', requester: 'West Manager' },
    { id: 'req2', type: 'Bin', notes: 'Replacement for damaged bin B-105', status: 'approved', date: '2026-01-14', requester: 'West Manager' },
];

export const TRUCKS = [
    { id: 'T1', code: 'T-101', type: 'Compactor', status: 'active', fuel: 75, mileage: 12500, lastService: '2025-12-10', driver: 'Ahmed Khan', plate: 'KSA 1234', capacity: '15 Tons', totalHours: 4500 },
    { id: 'T2', code: 'T-205', type: 'Dump Truck', status: 'active', fuel: 60, mileage: 8200, lastService: '2026-01-05', driver: 'John Smith', plate: 'KSA 5678', capacity: '20 Tons', totalHours: 3200 },
    { id: 'T3', code: 'T-308', type: 'Recycling Unit', status: 'maintenance', fuel: 0, mileage: 15400, lastService: '2025-11-20', driver: 'Unassigned', plate: 'KSA 9012', capacity: '10 Tons', totalHours: 5100 },
];
