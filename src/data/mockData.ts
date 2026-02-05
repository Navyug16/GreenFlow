import type { User, KpiStat, Incident, Facility } from '../types';

export const CURRENT_USER: User = {
    id: 'u1',
    name: 'Navyug Galani',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
};

export const ADMIN_STATS: KpiStat[] = [
    { label: 'Total Revenue', value: '4.2M', unit: 'SAR', change: 12, icon: 'DollarSign', color: 'var(--accent-finance)' },
    { label: 'Active Trucks', value: 8, change: 2, icon: 'Truck', color: 'var(--accent-admin)' }, // Updated from CSV count
    { label: 'Total Bins', value: '15', change: 5, icon: 'Trash2', color: 'var(--text-secondary)' }, // Updated from CSV count
    { label: 'Total Drivers', value: 8, change: 1, icon: 'Users', color: 'var(--text-primary)' },
    { label: 'Avg Bin Fill', value: 68, unit: '%', change: -4, icon: 'BarChart3', color: 'var(--accent-manager)' },
    { label: 'Avg Truck Fill', value: 82, unit: '%', change: 8, icon: 'Box', color: 'var(--accent-engineer)' },
];

export const MANAGER_STATS: KpiStat[] = [
    { label: 'Waste Collected Today', value: '850', unit: 'Tons', change: 15, icon: 'Scale', color: 'var(--accent-manager)' },
    { label: 'Active Routes', value: 12, change: 3, icon: 'Map', color: 'var(--accent-admin)' },
    { label: 'Pending Requests', value: 4, change: -1, icon: 'AlertCircle', color: 'var(--accent-warning)' },
];

export const ENGINEER_STATS: KpiStat[] = [
    { label: 'Trucks to Maintain', value: 1, change: 0, icon: 'Wrench', color: 'var(--accent-danger)' },
    { label: 'Bins to Repair', value: 2, change: -1, icon: 'Hammer', color: 'var(--accent-warning)' },
    { label: 'Machinery Status', value: '98%', unit: 'Health', change: 0, icon: 'Activity', color: 'var(--status-good)' },
];

export const FINANCE_STATS: KpiStat[] = [
    { label: 'Total Revenue', value: '42.5M', unit: 'SAR', change: 12, icon: 'DollarSign', color: 'var(--status-good)' },
    { label: 'Energy Generation', value: '18.2M', unit: 'SAR', change: 8, icon: 'Zap', color: 'var(--accent-engineer)' },
    { label: 'Recycling Output', value: '8.4M', unit: 'SAR', change: 24, icon: 'Recycle', color: 'var(--accent-manager)' },
];

// Import from User CSV (Approximate mapping)
export const RECENT_INCIDENTS: Incident[] = [
    { id: 'i1', type: 'bin_overflow', message: 'Bin overflow detected (95% full) at Al Faisaliah Tower – Service Entrance', timestamp: '10 min ago', severity: 'high', resolved: false },
    { id: 'i2', type: 'truck_delay', message: 'Collection truck delayed due to heavy traffic at Olaya Street near Kingdom Centre Tower', timestamp: '22 min ago', severity: 'medium', resolved: false },
    { id: 'i3', type: 'sensor_failure', message: 'Smart bin sensor not responding at Al Malaz Park – Main Gate', timestamp: '45 min ago', severity: 'medium', resolved: false },
    { id: 'i4', type: 'safety_alert', message: 'Fire risk alert from methane sensor at Riyadh Second Industrial City – Gate 1', timestamp: '1 hour ago', severity: 'high', resolved: true },
    { id: 'i5', type: 'machinery_failure', message: 'Waste compactor malfunction at King Abdullah Park – South Entrance', timestamp: '2 hours ago', severity: 'high', resolved: false },
    { id: 'i6', type: 'missed_pickup', message: 'Missed waste pickup complaint logged at Granada Mall – Public Parking Area', timestamp: '3 hours ago', severity: 'low', resolved: true },
    { id: 'i7', type: 'high_load', message: 'High waste accumulation due to event at Riyadh Park Mall – North Entrance', timestamp: '5 hours ago', severity: 'medium', resolved: true },
];

export const FACILITIES: Facility[] = [
    { id: 'F1', name: 'Recycling Unit', type: 'recycle', status: 'operational', output: 450, description: 'Recycles waste materials into reusable resources.' },
    { id: 'F2', name: 'Dump Yard', type: 'dumpyard', status: 'operational', output: 1200, description: 'Final disposal site for non-recyclable and non-energy waste.' },
    { id: 'F3', name: 'Energy Recovery Plant', type: 'energy', status: 'operational', output: 850, description: 'Generates renewable energy from waste processing.' },
];

export interface Bin {
    id: string;
    lat: number;
    lng: number;
    fillLevel: number; // 0-100
    status: 'active' | 'maintenance' | 'offline';
    lastCollection: string;
    location?: string;
    cost?: number;
    route?: string;
}

// Imported Bins with approximate coordinates in Riyadh
export const BINS: Bin[] = [
    { id: 'B-01', lat: 24.6905, lng: 46.6855, fillLevel: 45, status: 'active', lastCollection: '2 hours ago', location: 'Al Faisaliah Tower – Service Entrance', cost: 6800, route: 'Olaya Corridor' },
    { id: 'B-02', lat: 24.6960, lng: 46.6810, fillLevel: 72, status: 'active', lastCollection: '4 hours ago', location: 'Olaya Street – Al Andalus Intersection', cost: 6200, route: 'Olaya Corridor' },
    { id: 'B-03', lat: 24.7115, lng: 46.6745, fillLevel: 88, status: 'active', lastCollection: '1 day ago', location: 'Kingdom Centre Tower – Parking Access', cost: 7000, route: 'Olaya Corridor' },
    { id: 'B-04', lat: 24.6655, lng: 46.7255, fillLevel: 25, status: 'active', lastCollection: '30 mins ago', location: 'Al Malaz Park – Main Gate', cost: 5200, route: 'Al Malaz Residential Route' },
    { id: 'B-05', lat: 24.6700, lng: 46.7300, fillLevel: 60, status: 'active', lastCollection: '5 hours ago', location: 'Salahuddin Al Ayyubi Road – Residential Block', cost: 4800, route: 'Al Malaz Residential Route' },
    { id: 'B-06', lat: 24.6600, lng: 46.7200, fillLevel: 35, status: 'active', lastCollection: '1 day ago', location: 'King Abdullah Park – South Entrance', cost: 5500, route: 'Al Malaz Residential Route' },
    { id: 'B-07', lat: 24.6005, lng: 46.8005, fillLevel: 92, status: 'maintenance', lastCollection: '2 days ago', location: 'Riyadh Second Industrial City – Gate 1', cost: 7500, route: 'Industrial Area Route' },
    { id: 'B-08', lat: 24.5950, lng: 46.8050, fillLevel: 80, status: 'active', lastCollection: '6 hours ago', location: 'Al Kharj Road – Industrial Transfer Point', cost: 6900, route: 'Industrial Area Route' },
    { id: 'B-09', lat: 24.9505, lng: 46.7005, fillLevel: 15, status: 'active', lastCollection: '10 mins ago', location: 'King Khalid International Airport – Terminal 5 Drop Zone', cost: 8200, route: 'Airport & Logistics Corridor' },
    { id: 'B-10', lat: 24.9450, lng: 46.6950, fillLevel: 40, status: 'active', lastCollection: '1 hour ago', location: 'Airport Road – Cargo Village Access', cost: 7800, route: 'Airport & Logistics Corridor' },
    { id: 'B-11', lat: 24.7555, lng: 46.6305, fillLevel: 65, status: 'active', lastCollection: '3 hours ago', location: 'Riyadh Park Mall – North Entrance', cost: 6700, route: 'Northern Commercial Zone' },
    { id: 'B-12', lat: 24.7600, lng: 46.6350, fillLevel: 55, status: 'active', lastCollection: '4 hours ago', location: 'IKEA Riyadh – Loading Bay Area', cost: 6300, route: 'Northern Commercial Zone' },
    { id: 'B-13', lat: 24.7700, lng: 46.7800, fillLevel: 30, status: 'active', lastCollection: '1 day ago', location: 'Al Nahda District – Community Center', cost: 4600, route: 'Eastern Residential Expansion' },
    { id: 'B-14', lat: 24.7850, lng: 46.7400, fillLevel: 75, status: 'active', lastCollection: '5 hours ago', location: 'Granada Mall – Public Parking Area', cost: 6400, route: 'Eastern Residential Expansion' },
    { id: 'B-15', lat: 24.6805, lng: 46.6205, fillLevel: 20, status: 'active', lastCollection: '2 hours ago', location: 'Diplomatic Quarter – Main Gate Bus Stop', cost: 5900, route: 'Government & Office Zone' },
];

export const REQUESTS = [
    { id: 'req1', type: 'Truck', notes: 'Need additional compactor for Sector 7', status: 'pending', date: '2026-02-04', requester: 'West Manager', details: 'High volume expected next month' },
    { id: 'req2', type: 'Bin', notes: 'Replacement for damaged bin B-04', status: 'approved', date: '2026-02-03', requester: 'Maintenance Team', details: 'Sensor malfunction' },
    { id: 'req3', type: 'Bin', notes: 'New bin request for Diplomatic Quarter ext', status: 'pending', date: '2026-02-05', requester: 'City Planning', details: 'New park opening' },
];

export const TRUCKS = [
    { id: '1', code: 'T-01', plate: 'T-01', driver: 'Mohammed Al-Salem', type: 'Compactor', route: 'Al Faisaliah -> Kingdom Centre', status: 'active', fuel: 72, mileage: 12500, lastService: '2026-01-10', capacity: '15 Tons', totalHours: 4200 },
    { id: '2', code: 'T-02', plate: 'T-02', driver: 'Ajay Kumar', type: 'Pickup', route: 'Al Malaz Park Area', status: 'active', fuel: 65, mileage: 8100, lastService: '2026-01-15', capacity: '5 Tons', totalHours: 2100 },
    { id: '3', code: 'T-03', plate: 'T-03', driver: 'Faisal Al-Harbi', type: 'Medium Compactor', route: 'Second Industrial City', status: 'maintenance', fuel: 10, mileage: 14200, lastService: '2025-12-20', capacity: '10 Tons', totalHours: 3800 },
    { id: '4', code: 'T-04', plate: 'T-04', driver: 'Ahmed Hassan', type: 'Pickup', route: 'King Khalid Airport', status: 'active', fuel: 88, mileage: 5600, lastService: '2026-01-25', capacity: '5 Tons', totalHours: 1500 },
    { id: '5', code: 'T-05', plate: 'T-05', driver: 'Abdul Rehman', type: 'Large Compactor', route: 'Riyadh Park Mall', status: 'active', fuel: 45, mileage: 18900, lastService: '2026-01-05', capacity: '20 Tons', totalHours: 5600 },
    { id: '6', code: 'T-06', plate: 'T-06', driver: 'Salman Khan', type: 'Hook Loader', route: 'Al Nahda District', status: 'active', fuel: 55, mileage: 9800, lastService: '2026-01-18', capacity: '12 Tons', totalHours: 3100 },
    { id: '7', code: 'T-07', plate: 'T-07', driver: 'Farukh Saikh', type: 'Pickup', route: 'Ministry of Interior HQ', status: 'active', fuel: 80, mileage: 6700, lastService: '2026-01-22', capacity: '5 Tons', totalHours: 1900 },
];

// Simplified Route Data for Demo visualization (connecting some bin points)
// Full Route Data for all 7 Trucks
export const TRUCK_ROUTES = [
    {
        id: 'T1',
        name: 'Olaya Corridor',
        driver: 'Mohammed Al-Salem',
        vehicle: 'Compactor T-01',
        status: 'in_progress',
        progress: 45,
        efficiency: 94,
        currentPath: [[24.6905, 46.6855], [24.7115, 46.6745]] as [number, number][]
    },
    {
        id: 'T2',
        name: 'Al Malaz Park',
        driver: 'Ajay Kumar',
        vehicle: 'Pickup T-02',
        status: 'active',
        progress: 20,
        efficiency: 89,
        currentPath: [[24.6655, 46.7255], [24.6600, 46.7200]] as [number, number][]
    },
    {
        id: 'T3',
        name: 'Industrial City',
        driver: 'Faisal Al-Harbi',
        vehicle: 'Compactor T-03',
        status: 'maintenance',
        progress: 0,
        efficiency: 10,
        currentPath: [[24.6005, 46.8005], [24.5950, 46.8050]] as [number, number][]
    },
    {
        id: 'T4',
        name: 'Airport Logistics',
        driver: 'Ahmed Hassan',
        vehicle: 'Pickup T-04',
        status: 'active',
        progress: 60,
        efficiency: 92,
        currentPath: [[24.9505, 46.7005], [24.9450, 46.6950]] as [number, number][]
    },
    {
        id: 'T5',
        name: 'Northern Commercial',
        driver: 'Abdul Rehman',
        vehicle: 'Large Compactor T-05',
        status: 'active',
        progress: 10,
        efficiency: 88,
        currentPath: [[24.7555, 46.6305], [24.7600, 46.6350]] as [number, number][]
    },
    {
        id: 'T6',
        name: 'Al Nahda Dist',
        driver: 'Salman Khan',
        vehicle: 'Hook Loader T-06',
        status: 'active',
        progress: 35,
        efficiency: 85,
        currentPath: [[24.7700, 46.7800], [24.7850, 46.7400]] as [number, number][]
    },
    {
        id: 'T7',
        name: 'Ministry HQ',
        driver: 'Farukh Saikh',
        vehicle: 'Pickup T-07',
        status: 'active',
        progress: 80,
        efficiency: 95,
        currentPath: [[24.6805, 46.6205], [24.6700, 46.6300]] as [number, number][]
    }
];
