import type { User, KpiStat, Incident, Facility, Bin, Machine, Truck, Request, Route } from '../types';

export const CURRENT_USER: User = {
    id: 'u1',
    name: 'Navyug Galani',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
};

export const ADMIN_STATS: KpiStat[] = [
    { label: 'Total Revenue', value: '4.2M', unit: 'SAR', change: 12, icon: 'DollarSign', color: 'var(--accent-finance)' },
    { label: 'Active Trucks', value: 6, change: 2, icon: 'Truck', color: 'var(--accent-admin)' }, // Updated from CSV count
    { label: 'Total Bins', value: '18', change: 5, icon: 'Trash2', color: 'var(--text-secondary)' }, // Updated from CSV count
    { label: 'Total Drivers', value: 7, change: 1, icon: 'Users', color: 'var(--text-primary)' },
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
        lat: 24.9200,
        lng: 46.6500
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
        lat: 24.5500,
        lng: 46.7800
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
        lat: 24.8000,
        lng: 46.7800
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
        lat: 24.6900,
        lng: 46.6900
    }
];

// Aligned Bins with Trucks.csv Locations
export const BINS: Bin[] = [
    // T-01: Al Faisaliah / Olaya / Kingdom Centre
    { id: 'B-01', lat: 24.6905, lng: 46.6855, fillLevel: 45, status: 'active', health: 100, region: 'Central Riyadh', overflowStatus: false, lastCollection: '2 hours ago', location: 'Al Faisaliah Tower', cost: 1200, routeId: 'T1' },
    { id: 'B-19', lat: 24.7000, lng: 46.6800, fillLevel: 50, status: 'active', health: 98, region: 'Central Riyadh', overflowStatus: false, lastCollection: '3 hours ago', location: 'Olaya Street', cost: 1150, routeId: 'T1' },
    { id: 'B-02', lat: 24.7115, lng: 46.6745, fillLevel: 60, status: 'active', health: 95, region: 'Central Riyadh', overflowStatus: false, lastCollection: '4 hours ago', location: 'Kingdom Centre', cost: 1100, routeId: 'T1' },

    // T-02: Al Malaz Park
    { id: 'B-03', lat: 24.6655, lng: 46.7255, fillLevel: 30, status: 'active', health: 90, region: 'Central Riyadh', overflowStatus: false, lastCollection: '1 day ago', location: 'Al Malaz Park', cost: 900, routeId: 'T2' },

    // T-03: Second Industrial City (Removed)

    // T-04: King Khalid Airport
    { id: 'B-05', lat: 24.9505, lng: 46.7005, fillLevel: 25, status: 'active', health: 98, region: 'North Riyadh', overflowStatus: false, lastCollection: '30 mins ago', location: 'Airport Terminal 5', cost: 2000, routeId: 'T4' },
    { id: 'B-15', lat: 24.9600, lng: 46.7100, fillLevel: 40, status: 'active', health: 95, region: 'North Riyadh', overflowStatus: false, lastCollection: '1 hour ago', location: 'Airport Cargo Area', cost: 1900, routeId: 'T4' },

    // T-05: Riyadh Park Mall
    { id: 'B-06', lat: 24.7550, lng: 46.6300, fillLevel: 20, status: 'active', health: 88, region: 'North Riyadh', overflowStatus: false, lastCollection: '5 hours ago', location: 'Riyadh Park Mall', cost: 1800, routeId: 'T5' },
    { id: 'B-11', lat: 24.7600, lng: 46.6350, fillLevel: 30, status: 'active', health: 92, region: 'North Riyadh', overflowStatus: false, lastCollection: '2 hours ago', location: 'Riyadh Park North', cost: 1700, routeId: 'T5' },
    { id: 'B-12', lat: 24.7500, lng: 46.6250, fillLevel: 50, status: 'active', health: 94, region: 'North Riyadh', overflowStatus: false, lastCollection: '3 hours ago', location: 'Riyadh Park West', cost: 1750, routeId: 'T5' },

    // T-06: Al Nahda / Granada
    { id: 'B-07', lat: 24.7850, lng: 46.7400, fillLevel: 40, status: 'active', health: 92, region: 'East Riyadh', overflowStatus: false, lastCollection: '3 hours ago', location: 'Granada Mall', cost: 1400, routeId: 'T6' },
    { id: 'B-13', lat: 24.7900, lng: 46.7450, fillLevel: 45, status: 'active', health: 90, region: 'East Riyadh', overflowStatus: false, lastCollection: '4 hours ago', location: 'Granada Business Park', cost: 1450, routeId: 'T6' },

    // T-07: Ministry of Interior
    { id: 'B-08', lat: 24.6805, lng: 46.6205, fillLevel: 25, status: 'active', health: 96, region: 'Central Riyadh', overflowStatus: false, lastCollection: '4 hours ago', location: 'Ministry of Interior', cost: 1300, routeId: 'T7' },
    { id: 'B-14', lat: 24.6850, lng: 46.6250, fillLevel: 35, status: 'active', health: 93, region: 'Central Riyadh', overflowStatus: false, lastCollection: '5 hours ago', location: 'Ministry Housing', cost: 1350, routeId: 'T7' },

    // T-08: Ring Road / Connector (New Network Expansion)
    { id: 'B-20', lat: 24.8200, lng: 46.6500, fillLevel: 65, status: 'active', health: 85, region: 'North Connector', overflowStatus: false, lastCollection: '1 hour ago', location: 'Northern Ring Road Exit 6', cost: 1600, routeId: 'T8' },
    { id: 'B-21', lat: 24.8400, lng: 46.7000, fillLevel: 40, status: 'active', health: 90, region: 'North Connector', overflowStatus: false, lastCollection: '2 hours ago', location: 'Princess Nourah Univ', cost: 1550, routeId: 'T8' },
    { id: 'B-22', lat: 24.7500, lng: 46.7800, fillLevel: 55, status: 'active', health: 88, region: 'East Connector', overflowStatus: false, lastCollection: '3 hours ago', location: 'Dammam Road', cost: 1500, routeId: 'T8' },
    { id: 'B-23', lat: 24.6200, lng: 46.7500, fillLevel: 70, status: 'active', health: 80, region: 'South Connector', overflowStatus: false, lastCollection: '4 hours ago', location: 'Eastern Ring Road South', cost: 1450, routeId: 'T8' },
    { id: 'B-24', lat: 24.8800, lng: 46.6000, fillLevel: 30, status: 'active', health: 95, region: 'North West', overflowStatus: false, lastCollection: '5 hours ago', location: 'Salbuk Road', cost: 1650, routeId: 'T8' }
];

export const MACHINERY: Machine[] = [
    { id: 'M1', name: 'Conveyor Belt C-2', status: 'operational', health: 92, region: 'Central Riyadh', facilityId: 'F1', lastMaintenance: '2d ago', nextDue: '2 weeks', type: 'Conveyor', cost: 150000 },
    { id: 'M2', name: 'Waste Compactor A', status: 'maintenance', health: 45, region: 'South Riyadh', facilityId: 'F2', lastMaintenance: 'Now', nextDue: 'Overdue', type: 'Compactor', cost: 280000 },
    { id: 'M3', name: 'Sorting Arm R-5', status: 'operational', health: 88, region: 'Central Riyadh', facilityId: 'F1', lastMaintenance: '5d ago', nextDue: '3 weeks', type: 'Sorting Arm', cost: 450000 },
    { id: 'M4', name: 'Shredder Unit S-1', status: 'warning', health: 76, region: 'North Riyadh', facilityId: 'F3', lastMaintenance: '1w ago', nextDue: '1 week', type: 'Shredder', cost: 320000 },
    { id: 'M5', name: 'Hydraulic Press HP-2', status: 'repair', health: 30, region: 'South Riyadh', facilityId: 'F2', lastMaintenance: 'Yesterday', nextDue: 'Now', type: 'Hydraulic Press', cost: 210000 },
];

export const REQUESTS: Request[] = [];

export const TRUCKS: Truck[] = [
    { id: '1', code: 'T-01', plate: 'T-01', driver: 'Mohammed Al-Salem', type: 'Compactor', route: 'Olaya Corridor', routeId: 'T1', status: 'active', health: 95, region: 'Central Riyadh', fuel: 72, mileage: 12500, lastService: '2026-01-10', capacity: '15 Tons', totalHours: 4200, cost: 350000 },
    { id: '2', code: 'T-02', plate: 'T-02', driver: 'Ajay Kumar', type: 'Pickup', route: 'Al Malaz Park Area', routeId: 'T2', status: 'active', health: 88, region: 'Central Riyadh', fuel: 65, mileage: 8100, lastService: '2026-01-15', capacity: '5 Tons', totalHours: 2100, cost: 180000 },
    // Removed T-03 (Maintenance)
    { id: '4', code: 'T-04', plate: 'T-04', driver: 'Ahmed Hassan', type: 'Pickup', route: 'King Khalid Airport', routeId: 'T4', status: 'active', health: 92, region: 'North Riyadh', fuel: 88, mileage: 5600, lastService: '2026-01-25', capacity: '5 Tons', totalHours: 1500, cost: 190000 },
    { id: '5', code: 'T-05', plate: 'T-05', driver: 'Abdul Rehman', type: 'Large Compactor', route: 'Riyadh Park Mall', routeId: 'T5', status: 'active', health: 78, region: 'North Riyadh', fuel: 45, mileage: 18900, lastService: '2026-01-05', capacity: '20 Tons', totalHours: 5600, cost: 420000 },
    { id: '6', code: 'T-06', plate: 'T-06', driver: 'Salman Khan', type: 'Hook Loader', route: 'Al Nahda District', routeId: 'T6', status: 'active', health: 85, region: 'East Riyadh', fuel: 55, mileage: 9800, lastService: '2026-01-18', capacity: '12 Tons', totalHours: 3100, cost: 310000 },
    { id: '7', code: 'T-07', plate: 'T-07', driver: 'Farukh Saikh', type: 'Pickup', route: 'Ministry of Interior HQ', routeId: 'T7', status: 'active', health: 96, region: 'Central Riyadh', fuel: 80, mileage: 6700, lastService: '2026-01-22', capacity: '5 Tons', totalHours: 1900, cost: 185000 },
    { id: '8', code: 'T-08', plate: 'T-08', driver: 'Omar Khalid', type: 'Large Compactor', route: 'Ring Road Network', routeId: 'T8', status: 'active', health: 94, region: 'Ring Roads', fuel: 90, mileage: 1100, lastService: '2026-02-10', capacity: '18 Tons', totalHours: 400, cost: 410000 },
];

export const TRUCK_ROUTES: Route[] = [
    {
        id: 'T1',
        name: 'Olaya Corridor',
        region: 'Central Zone',
        truckId: '1',
        assignedBinIds: ['B-01', 'B-19', 'B-02'],
        distance: 12.5,
        currentFuelCost: 45.50,
        driver: 'Mohammed Al-Salem',
        vehicle: 'Compactor T-01',
        status: 'in_progress',
        progress: 45,
        efficiency: 94,
        currentPath: [[24.6900, 46.6850], [24.7000, 46.6800], [24.7100, 46.6750]] as [number, number][]
    },
    {
        id: 'T2',
        name: 'Al Malaz Route',
        region: 'Central Zone',
        truckId: '2',
        assignedBinIds: ['B-03'],
        distance: 8.2,
        currentFuelCost: 28.10,
        driver: 'Ajay Kumar',
        vehicle: 'Pickup T-02',
        status: 'active',
        progress: 20,
        efficiency: 89,
        currentPath: [[24.6650, 46.7250], [24.6700, 46.7300]] as [number, number][]
    },
    // Removed T3 (Linked to Maintenance Truck)
    {
        id: 'T4',
        name: 'Airport Route',
        region: 'North Zone',
        truckId: '4',
        assignedBinIds: ['B-05', 'B-15'],
        distance: 35.5,
        currentFuelCost: 120.50,
        driver: 'Ahmed Hassan',
        vehicle: 'Pickup T-04',
        status: 'active',
        progress: 60,
        efficiency: 92,
        currentPath: [[24.9500, 46.7000], [24.9600, 46.7100]] as [number, number][]
    },
    {
        id: 'T5',
        name: 'Riyadh Park Route',
        region: 'North Zone',
        truckId: '5',
        assignedBinIds: ['B-06', 'B-11', 'B-12'],
        distance: 18.2,
        currentFuelCost: 65.20,
        driver: 'Abdul Rehman',
        vehicle: 'Large Compactor T-05',
        status: 'active',
        progress: 10,
        efficiency: 88,
        currentPath: [[24.7550, 46.6300], [24.7600, 46.6350]] as [number, number][]
    },
    {
        id: 'T6',
        name: 'Granada Route',
        region: 'East Zone',
        truckId: '6',
        assignedBinIds: ['B-07', 'B-13'],
        distance: 15.8,
        currentFuelCost: 52.80,
        driver: 'Salman Khan',
        vehicle: 'Hook Loader T-06',
        status: 'active',
        progress: 35,
        efficiency: 85,
        currentPath: [[24.7850, 46.7400], [24.7900, 46.7450]] as [number, number][]
    },
    {
        id: 'T7',
        name: 'Ministry Route',
        region: 'Central Zone',
        truckId: '7',
        assignedBinIds: ['B-08', 'B-14'],
        distance: 5.5,
        currentFuelCost: 18.50,
        driver: 'Farukh Saikh',
        vehicle: 'Pickup T-07',
        status: 'active',
        progress: 80,
        efficiency: 95,
        currentPath: [[24.6800, 46.6200], [24.6850, 46.6250]] as [number, number][]
    },
    {
        id: 'T8',
        name: 'Ring Road Network',
        region: 'Ring Roads',
        truckId: '8',
        assignedBinIds: ['B-20', 'B-21', 'B-22', 'B-23', 'B-24'],
        distance: 45.2,
        currentFuelCost: 150.00,
        driver: 'Omar Khalid',
        vehicle: 'Large Compactor T-08',
        status: 'active',
        progress: 25,
        efficiency: 91,
        currentPath: [[24.8200, 46.6500], [24.8400, 46.7000]] as [number, number][]
    }
];
