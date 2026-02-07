import type { User, KpiStat, Incident, Facility, Bin, Machine, Truck } from '../types';

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
    {
        id: 'F1',
        name: 'Central Recycling Unit',
        type: 'recycle',
        status: 'operational',
        region: 'Central Riyadh',
        capacity: 1000,
        currentLoad: 450,
        incomingWaste: 120, // tons/day
        wasteCategory: ['Plastic', 'Paper', 'Metal'],
        output: 380, // Recycled tons
        revenue: 15000, // SAR/day
        description: 'Advanced sorting and recycling facility for dry waste.',
        lastServiceDate: '2026-01-15'
    },
    {
        id: 'F2',
        name: 'South Dump Yard',
        type: 'dumpyard',
        status: 'operational',
        region: 'South Riyadh',
        capacity: 5000,
        currentLoad: 3200,
        incomingWaste: 450,
        wasteCategory: ['Organic', 'Mixed'],
        output: 0,
        revenue: 0,
        description: 'Primary disposal site for non-recyclable waste.',
        lastServiceDate: '2025-12-10'
    },
    {
        id: 'F3',
        name: 'North Energy Plant',
        type: 'energy',
        status: 'operational',
        region: 'North Riyadh',
        capacity: 2000,
        currentLoad: 1400,
        incomingWaste: 600,
        wasteCategory: ['Combustible', 'Organic'],
        output: 4500, // kW
        revenue: 28000,
        description: 'Waste-to-Energy incineration plant.',
        lastServiceDate: '2026-01-28'
    },
    {
        id: 'F4',
        name: 'West Dump Yard',
        type: 'dumpyard',
        status: 'maintenance',
        region: 'West Riyadh',
        capacity: 3000,
        currentLoad: 2900,
        incomingWaste: 0, // Restricted
        wasteCategory: ['Hazardous', 'Mixed'],
        output: 0,
        revenue: 0,
        description: 'Restricted access due to environmental regulations.',
        lastServiceDate: '2026-02-01'
    }
];



// Imported Bins with approximate coordinates in Riyadh
export const BINS: Bin[] = [
    { id: 'B-01', lat: 24.6905, lng: 46.6855, fillLevel: 45, status: 'active', health: 100, region: 'Central Riyadh', overflowStatus: false, lastCollection: '2 hours ago', location: 'Al Faisaliah Tower – Service Entrance', cost: 6800, routeId: 'T1' },
    { id: 'B-02', lat: 24.6960, lng: 46.6810, fillLevel: 72, status: 'active', health: 95, region: 'Central Riyadh', overflowStatus: false, lastCollection: '4 hours ago', location: 'Olaya Street – Al Andalus Intersection', cost: 6200, routeId: 'T1' },
    { id: 'B-03', lat: 24.7115, lng: 46.6745, fillLevel: 88, status: 'active', health: 90, region: 'Central Riyadh', overflowStatus: false, lastCollection: '1 day ago', location: 'Kingdom Centre Tower – Parking Access', cost: 7000, routeId: 'T1' },
    { id: 'B-04', lat: 24.6655, lng: 46.7255, fillLevel: 25, status: 'active', health: 75, region: 'Central Riyadh', overflowStatus: false, lastCollection: '30 mins ago', location: 'Al Malaz Park – Main Gate', cost: 5200, routeId: 'T2' },
    { id: 'B-05', lat: 24.6700, lng: 46.7300, fillLevel: 60, status: 'active', health: 85, region: 'Central Riyadh', overflowStatus: false, lastCollection: '5 hours ago', location: 'Salahuddin Al Ayyubi Road – Residential Block', cost: 4800, routeId: 'T2' },
    { id: 'B-06', lat: 24.6600, lng: 46.7200, fillLevel: 35, status: 'active', health: 80, region: 'Central Riyadh', overflowStatus: false, lastCollection: '1 day ago', location: 'King Abdullah Park – South Entrance', cost: 5500, routeId: 'T2' },
    { id: 'B-07', lat: 24.6005, lng: 46.8005, fillLevel: 92, status: 'maintenance', health: 40, region: 'South Riyadh', overflowStatus: true, lastCollection: '2 days ago', location: 'Riyadh Second Industrial City – Gate 1', cost: 7500, routeId: 'T3' },
    { id: 'B-08', lat: 24.5950, lng: 46.8050, fillLevel: 80, status: 'active', health: 92, region: 'South Riyadh', overflowStatus: false, lastCollection: '6 hours ago', location: 'Al Kharj Road – Industrial Transfer Point', cost: 6900, routeId: 'T3' },
    { id: 'B-09', lat: 24.9505, lng: 46.7005, fillLevel: 15, status: 'active', health: 98, region: 'North Riyadh', overflowStatus: false, lastCollection: '10 mins ago', location: 'King Khalid International Airport – Terminal 5 Drop Zone', cost: 8200, routeId: 'T4' },
    { id: 'B-10', lat: 24.9450, lng: 46.6950, fillLevel: 40, status: 'active', health: 88, region: 'North Riyadh', overflowStatus: false, lastCollection: '1 hour ago', location: 'Airport Road – Cargo Village Access', cost: 7800, routeId: 'T4' },
    { id: 'B-11', lat: 24.7555, lng: 46.6305, fillLevel: 65, status: 'active', health: 94, region: 'North Riyadh', overflowStatus: false, lastCollection: '3 hours ago', location: 'Riyadh Park Mall – North Entrance', cost: 6700, routeId: 'T5' },
    { id: 'B-12', lat: 24.7600, lng: 46.6350, fillLevel: 55, status: 'active', health: 96, region: 'North Riyadh', overflowStatus: false, lastCollection: '4 hours ago', location: 'IKEA Riyadh – Loading Bay Area', cost: 6300, routeId: 'T5' },
    { id: 'B-13', lat: 24.7700, lng: 46.7800, fillLevel: 30, status: 'active', health: 89, region: 'East Riyadh', overflowStatus: false, lastCollection: '1 day ago', location: 'Al Nahda District – Community Center', cost: 4600, routeId: 'T6' },
    { id: 'B-14', lat: 24.7850, lng: 46.7400, fillLevel: 75, status: 'active', health: 91, region: 'East Riyadh', overflowStatus: false, lastCollection: '5 hours ago', location: 'Granada Mall – Public Parking Area', cost: 6400, routeId: 'T6' },
    { id: 'B-15', lat: 24.6805, lng: 46.6205, fillLevel: 20, status: 'active', health: 99, region: 'Central Riyadh', overflowStatus: false, lastCollection: '2 hours ago', location: 'Diplomatic Quarter – Main Gate Bus Stop', cost: 5900, routeId: 'T7' },
];

export const MACHINERY: Machine[] = [
    { id: 'M1', name: 'Conveyor Belt C-2', status: 'operational', health: 92, region: 'Central Riyadh', facilityId: 'F1', lastMaintenance: '2d ago', nextDue: '2 weeks', type: 'Conveyor' },
    { id: 'M2', name: 'Waste Compactor A', status: 'maintenance', health: 45, region: 'South Riyadh', facilityId: 'F2', lastMaintenance: 'Now', nextDue: 'Overdue', type: 'Compactor' },
    { id: 'M3', name: 'Sorting Arm R-5', status: 'operational', health: 88, region: 'Central Riyadh', facilityId: 'F1', lastMaintenance: '5d ago', nextDue: '3 weeks', type: 'Sorting Arm' },
    { id: 'M4', name: 'Shredder Unit S-1', status: 'warning', health: 76, region: 'North Riyadh', facilityId: 'F3', lastMaintenance: '1w ago', nextDue: '1 week', type: 'Shredder' },
    { id: 'M5', name: 'Hydraulic Press HP-2', status: 'repair', health: 30, region: 'South Riyadh', facilityId: 'F2', lastMaintenance: 'Yesterday', nextDue: 'Now', type: 'Hydraulic Press' },
];

export const REQUESTS = [
    { id: 'req1', type: 'Truck', notes: 'Need additional compactor for Sector 7', status: 'pending', date: '2026-02-04', requester: 'West Manager', details: 'High volume expected next month' },
    { id: 'req2', type: 'Bin', notes: 'Replacement for damaged bin B-04', status: 'approved', date: '2026-02-03', requester: 'Maintenance Team', details: 'Sensor malfunction' },
    { id: 'req3', type: 'Bin', notes: 'New bin request for Diplomatic Quarter ext', status: 'pending', date: '2026-02-05', requester: 'City Planning', details: 'New park opening' },
];

export const TRUCKS: Truck[] = [
    { id: '1', code: 'T-01', plate: 'T-01', driver: 'Mohammed Al-Salem', type: 'Compactor', route: 'Olaya Corridor', routeId: 'T1', status: 'active', health: 95, region: 'Central Riyadh', fuel: 72, mileage: 12500, lastService: '2026-01-10', capacity: '15 Tons', totalHours: 4200 },
    { id: '2', code: 'T-02', plate: 'T-02', driver: 'Ajay Kumar', type: 'Pickup', route: 'Al Malaz Park Area', routeId: 'T2', status: 'active', health: 88, region: 'Central Riyadh', fuel: 65, mileage: 8100, lastService: '2026-01-15', capacity: '5 Tons', totalHours: 2100 },
    { id: '3', code: 'T-03', plate: 'T-03', driver: 'Faisal Al-Harbi', type: 'Medium Compactor', route: 'Second Industrial City', routeId: 'T3', status: 'maintenance', health: 45, region: 'South Riyadh', fuel: 10, mileage: 14200, lastService: '2025-12-20', capacity: '10 Tons', totalHours: 3800 },
    { id: '4', code: 'T-04', plate: 'T-04', driver: 'Ahmed Hassan', type: 'Pickup', route: 'King Khalid Airport', routeId: 'T4', status: 'active', health: 92, region: 'North Riyadh', fuel: 88, mileage: 5600, lastService: '2026-01-25', capacity: '5 Tons', totalHours: 1500 },
    { id: '5', code: 'T-05', plate: 'T-05', driver: 'Abdul Rehman', type: 'Large Compactor', route: 'Riyadh Park Mall', routeId: 'T5', status: 'active', health: 78, region: 'North Riyadh', fuel: 45, mileage: 18900, lastService: '2026-01-05', capacity: '20 Tons', totalHours: 5600 },
    { id: '6', code: 'T-06', plate: 'T-06', driver: 'Salman Khan', type: 'Hook Loader', route: 'Al Nahda District', routeId: 'T6', status: 'active', health: 85, region: 'East Riyadh', fuel: 55, mileage: 9800, lastService: '2026-01-18', capacity: '12 Tons', totalHours: 3100 },
    { id: '7', code: 'T-07', plate: 'T-07', driver: 'Farukh Saikh', type: 'Pickup', route: 'Ministry of Interior HQ', routeId: 'T7', status: 'active', health: 96, region: 'Central Riyadh', fuel: 80, mileage: 6700, lastService: '2026-01-22', capacity: '5 Tons', totalHours: 1900 },
];

// Simplified Route Data for Demo visualization (connecting some bin points)
// Full Route Data for all 7 Trucks
export const TRUCK_ROUTES = [
    {
        id: 'T1',
        name: 'Olaya Corridor',
        region: 'Central Riyadh',
        truckId: '1',
        assignedBinIds: ['B-01', 'B-02', 'B-03'],
        distance: 12.5,
        currentFuelCost: 45.50,
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
        region: 'Central Riyadh',
        truckId: '2',
        assignedBinIds: ['B-04', 'B-05', 'B-06'],
        distance: 8.2,
        currentFuelCost: 28.10,
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
        region: 'South Riyadh',
        truckId: '3',
        assignedBinIds: ['B-07', 'B-08'],
        distance: 24.0,
        currentFuelCost: 85.00,
        driver: 'Faisal Al-Harbi',
        vehicle: 'Compactor T-03',
        status: 'delayed',
        progress: 0,
        efficiency: 10,
        currentPath: [[24.6005, 46.8005], [24.5950, 46.8050]] as [number, number][]
    },
    {
        id: 'T4',
        name: 'Airport Logistics',
        region: 'North Riyadh',
        truckId: '4',
        assignedBinIds: ['B-09', 'B-10'],
        distance: 35.5,
        currentFuelCost: 120.50,
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
        region: 'North Riyadh',
        truckId: '5',
        assignedBinIds: ['B-11', 'B-12'],
        distance: 18.2,
        currentFuelCost: 65.20,
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
        region: 'East Riyadh',
        truckId: '6',
        assignedBinIds: ['B-13', 'B-14'],
        distance: 15.8,
        currentFuelCost: 52.80,
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
        region: 'Central Riyadh',
        truckId: '7',
        assignedBinIds: ['B-15'],
        distance: 5.5,
        currentFuelCost: 18.50,
        driver: 'Farukh Saikh',
        vehicle: 'Pickup T-07',
        status: 'active',
        progress: 80,
        efficiency: 95,
        currentPath: [[24.6805, 46.6205], [24.6700, 46.6300]] as [number, number][]
    }
];
