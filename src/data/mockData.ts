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
        name: 'Dump Yard – Riyadh North',
        type: 'dumpyard',
        status: 'operational',
        region: 'North Riyadh',
        capacity: 5000,
        currentLoad: 3200,
        incomingWaste: 450,
        wasteCategory: ['Organic', 'Mixed'],
        output: 0,
        revenue: 0,
        operatingCost: 12000,
        description: 'Primary disposal site for North Riyadh waste.',
        lastServiceDate: '2026-01-15',
        lat: 24.8341,
        lng: 46.6370
    },
    {
        id: 'F2',
        name: 'Dump Yard – Riyadh South',
        type: 'dumpyard',
        status: 'operational',
        region: 'South Riyadh',
        capacity: 4500,
        currentLoad: 2800,
        incomingWaste: 400,
        wasteCategory: ['Mixed', 'Construction'],
        output: 0,
        revenue: 0,
        operatingCost: 11000,
        description: 'Disposal site for South Riyadh and construction waste.',
        lastServiceDate: '2025-12-10',
        lat: 24.5247,
        lng: 46.7224
    },
    {
        id: 'F3',
        name: 'Recycling Unit – Industrial City (Sudair)',
        type: 'recycle',
        status: 'operational',
        region: 'Sudair Industrial',
        capacity: 1000,
        currentLoad: 450,
        incomingWaste: 120,
        wasteCategory: ['Plastic', 'Paper', 'Metal'],
        output: 380,
        revenue: 15000,
        operatingCost: 8500,
        description: 'Large scale industrial recycling facility.',
        lastServiceDate: '2026-01-20',
        lat: 25.0186,
        lng: 47.2956
    },
    {
        id: 'F4',
        name: 'Recycling Unit – Riyadh Industrial Area',
        type: 'recycle',
        status: 'maintenance',
        region: 'Industrial Area',
        capacity: 1200,
        currentLoad: 800,
        incomingWaste: 0, // Maintenance
        wasteCategory: ['Industrial', 'Metal'],
        output: 0,
        revenue: 0,
        operatingCost: 4000,
        description: 'Central industrial recycling hub.',
        lastServiceDate: '2026-02-01',
        lat: 24.5856,
        lng: 46.7532
    },
    {
        id: 'F5',
        name: 'Waste-to-Energy Plant – Outskirts of Riyadh',
        type: 'energy',
        status: 'operational',
        region: 'Riyadh Outskirts',
        capacity: 2500,
        currentLoad: 1800,
        incomingWaste: 600,
        wasteCategory: ['Combustible', 'Organic'],
        output: 5000, // kW
        revenue: 35000,
        operatingCost: 20000,
        description: 'Main incineration plant for city waste.',
        lastServiceDate: '2026-01-28',
        lat: 24.9062,
        lng: 46.4189
    },
    {
        id: 'F6',
        name: 'Waste-to-Energy Plant – Central Region',
        type: 'energy',
        status: 'operational',
        region: 'Central Riyadh',
        capacity: 1500,
        currentLoad: 900,
        incomingWaste: 300,
        wasteCategory: ['Organic'],
        output: 2500,
        revenue: 18000,
        operatingCost: 12000,
        description: 'Central energy recovery unit.',
        lastServiceDate: '2026-02-02',
        lat: 24.7117,
        lng: 46.6740
    }
];

// Updated Bins clustered around new Riyadh facilities
export const BINS: Bin[] = [
    // Near F1 (North Dump Yard - 24.8341, 46.6370)
    { id: 'B-01', lat: 24.8350, lng: 46.6380, fillLevel: 45, status: 'active', health: 100, region: 'North Riyadh', overflowStatus: false, lastCollection: '2 hours ago', location: 'North District Market', cost: 6800, routeId: 'T1' },
    { id: 'B-02', lat: 24.8360, lng: 46.6360, fillLevel: 72, status: 'active', health: 95, region: 'North Riyadh', overflowStatus: false, lastCollection: '4 hours ago', location: 'Qirawan Residential', cost: 6200, routeId: 'T1' },
    { id: 'B-03', lat: 24.8330, lng: 46.6390, fillLevel: 88, status: 'active', health: 90, region: 'North Riyadh', overflowStatus: false, lastCollection: '1 day ago', location: 'North Commercial Strip', cost: 7000, routeId: 'T1' },

    // Near F6 (Central Energy - 24.7117, 46.6740)
    { id: 'B-04', lat: 24.7120, lng: 46.6750, fillLevel: 25, status: 'active', health: 75, region: 'Central Riyadh', overflowStatus: false, lastCollection: '30 mins ago', location: 'Kingdom Centre Area', cost: 5200, routeId: 'T7' },
    { id: 'B-05', lat: 24.7100, lng: 46.6730, fillLevel: 60, status: 'active', health: 85, region: 'Central Riyadh', overflowStatus: false, lastCollection: '5 hours ago', location: 'Olaya Street', cost: 4800, routeId: 'T7' },
    { id: 'B-15', lat: 24.7130, lng: 46.6760, fillLevel: 20, status: 'active', health: 99, region: 'Central Riyadh', overflowStatus: false, lastCollection: '2 hours ago', location: 'Al Faisaliah Proximity', cost: 5900, routeId: 'T7' },

    // Near F2 (South Dump Yard - 24.5247, 46.7224)
    { id: 'B-07', lat: 24.5250, lng: 46.7230, fillLevel: 92, status: 'maintenance', health: 40, region: 'South Riyadh', overflowStatus: true, lastCollection: '2 days ago', location: 'Aziziyah South', cost: 7500, routeId: 'T3' },
    { id: 'B-08', lat: 24.5240, lng: 46.7210, fillLevel: 80, status: 'active', health: 92, region: 'South Riyadh', overflowStatus: false, lastCollection: '6 hours ago', location: 'South Ring Road Stop', cost: 6900, routeId: 'T3' },

    // Near F4 (Riyadh Industrial - 24.5856, 46.7532)
    { id: 'B-09', lat: 24.5860, lng: 46.7540, fillLevel: 15, status: 'active', health: 98, region: 'Industrial Area', overflowStatus: false, lastCollection: '10 mins ago', location: 'New Industrial Gate 1', cost: 8200, routeId: 'T2' },
    { id: 'B-10', lat: 24.5850, lng: 46.7520, fillLevel: 40, status: 'active', health: 88, region: 'Industrial Area', overflowStatus: false, lastCollection: '1 hour ago', location: 'Factory Zone A', cost: 7800, routeId: 'T2' },

    // Near F5 (Outskirts Energy - 24.9062, 46.4189)
    { id: 'B-11', lat: 24.9070, lng: 46.4190, fillLevel: 65, status: 'active', health: 94, region: 'Riyadh Outskirts', overflowStatus: false, lastCollection: '3 hours ago', location: 'West Outskirts Village', cost: 6700, routeId: 'T4' },
    { id: 'B-12', lat: 24.9050, lng: 46.4200, fillLevel: 55, status: 'active', health: 96, region: 'Riyadh Outskirts', overflowStatus: false, lastCollection: '4 hours ago', location: 'Diriya Approach', cost: 6300, routeId: 'T4' },

    // Near F3 (Sudair Industrial - 25.0186, 47.2956) - A bit far, but keeping logical connection
    { id: 'B-06', lat: 25.0190, lng: 47.2960, fillLevel: 35, status: 'active', health: 80, region: 'Sudair Industrial', overflowStatus: false, lastCollection: '1 day ago', location: 'Sudair Main Gate', cost: 5500, routeId: 'T6' },
    { id: 'B-13', lat: 25.0180, lng: 47.2950, fillLevel: 30, status: 'active', health: 89, region: 'Sudair Industrial', overflowStatus: false, lastCollection: '1 day ago', location: 'Logistics Hub', cost: 4600, routeId: 'T6' },

    // General West/Mixed
    { id: 'B-16', lat: 24.6500, lng: 46.5500, fillLevel: 85, status: 'active', health: 80, region: 'West Riyadh', overflowStatus: false, lastCollection: '6 hours ago', location: 'Wadi Hanifa', cost: 4500, routeId: 'T8' },
    { id: 'B-17', lat: 24.6600, lng: 46.5600, fillLevel: 65, status: 'active', health: 88, region: 'West Riyadh', overflowStatus: false, lastCollection: '3 hours ago', location: 'Irqah District', cost: 4200, routeId: 'T8' },
    { id: 'B-18', lat: 24.6400, lng: 46.5400, fillLevel: 95, status: 'active', health: 70, region: 'West Riyadh', overflowStatus: true, lastCollection: '1 day ago', location: 'Laban Exit', cost: 4800, routeId: 'T8' },
    { id: 'B-14', lat: 24.7500, lng: 46.6500, fillLevel: 75, status: 'active', health: 91, region: 'North Riyadh', overflowStatus: false, lastCollection: '5 hours ago', location: 'KAFD Area', cost: 6400, routeId: 'T5' },
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
        name: 'North Zone Route',
        region: 'North Zone',
        truckId: '1',
        assignedBinIds: ['B-01', 'B-02', 'B-03'],
        distance: 12.5,
        currentFuelCost: 45.50,
        driver: 'Mohammed Al-Salem',
        vehicle: 'Compactor T-01',
        status: 'in_progress',
        progress: 45,
        efficiency: 94,
        currentPath: [[23.0900, 72.5700], [23.0920, 72.5720]] as [number, number][]
    },
    {
        id: 'T2',
        name: 'East Industrial Route',
        region: 'East Zone',
        truckId: '2',
        assignedBinIds: ['B-04', 'B-05', 'B-06'],
        distance: 8.2,
        currentFuelCost: 28.10,
        driver: 'Ajay Kumar',
        vehicle: 'Pickup T-02',
        status: 'active',
        progress: 20,
        efficiency: 89,
        currentPath: [[23.0250, 72.6350], [23.0270, 72.6370]] as [number, number][]
    },
    {
        id: 'T3',
        name: 'South Zone Route',
        region: 'South Zone',
        truckId: '3',
        assignedBinIds: ['B-07', 'B-08'],
        distance: 24.0,
        currentFuelCost: 85.00,
        driver: 'Faisal Al-Harbi',
        vehicle: 'Compactor T-03',
        status: 'delayed',
        progress: 0,
        efficiency: 10,
        currentPath: [[22.9780, 72.4900], [22.9800, 72.4920]] as [number, number][]
    },
    {
        id: 'T4',
        name: 'Outer Ring Route',
        region: 'Ring Road',
        truckId: '4',
        assignedBinIds: ['B-09', 'B-10'],
        distance: 35.5,
        currentFuelCost: 120.50,
        driver: 'Ahmed Hassan',
        vehicle: 'Pickup T-04',
        status: 'active',
        progress: 60,
        efficiency: 92,
        currentPath: [[23.1120, 72.6040], [23.1140, 72.6060]] as [number, number][]
    },
    {
        id: 'T5',
        name: 'West Industrial Route',
        region: 'West Zone',
        truckId: '5',
        assignedBinIds: ['B-11', 'B-12'],
        distance: 18.2,
        currentFuelCost: 65.20,
        driver: 'Abdul Rehman',
        vehicle: 'Large Compactor T-05',
        status: 'active',
        progress: 10,
        efficiency: 88,
        currentPath: [[23.0580, 72.5130], [23.0600, 72.5150]] as [number, number][]
    },
    {
        id: 'T6',
        name: 'Peripheral Route',
        region: 'Peripheral Zone',
        truckId: '6',
        assignedBinIds: ['B-13', 'B-14'],
        distance: 15.8,
        currentFuelCost: 52.80,
        driver: 'Salman Khan',
        vehicle: 'Hook Loader T-06',
        status: 'active',
        progress: 35,
        efficiency: 85,
        currentPath: [[22.9450, 72.5890], [22.9470, 72.5910]] as [number, number][]
    },
    {
        id: 'T7',
        name: 'Central City Route',
        region: 'Central Zone',
        truckId: '7',
        assignedBinIds: ['B-15'],
        distance: 5.5,
        currentFuelCost: 18.50,
        driver: 'Farukh Saikh',
        vehicle: 'Pickup T-07',
        status: 'active',
        progress: 80,
        efficiency: 95,
        currentPath: [[23.0300, 72.5800], [23.0310, 72.5810]] as [number, number][]
    },
    {
        id: 'T8',
        name: 'West Residential Route',
        region: 'West Zone',
        truckId: '8',
        assignedBinIds: ['B-16', 'B-17', 'B-18'],
        distance: 14.5,
        currentFuelCost: 48.00,
        driver: 'Kareem Abdul',
        vehicle: 'Compactor T-08',
        status: 'active',
        progress: 60,
        efficiency: 88,
        currentPath: [[23.0500, 72.5200], [23.0520, 72.5190]] as [number, number][]
    }
];
