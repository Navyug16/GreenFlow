export type UserRole = 'admin' | 'manager' | 'engineer' | 'finance';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface KpiStat {
  label: string;
  value: string | number;
  unit?: string;
  change?: number; // % change
  icon: string; // Lucide icon name
  color?: string;
}

export type RouteStatus = 'active' | 'delayed' | 'completed' | 'pending' | 'in_progress' | 'maintenance';

export interface Route {
  id: string;
  name: string;
  region: string;
  driver: string;
  truckId: string;
  vehicle: string;
  assignedBinIds: string[];
  status: RouteStatus;
  distance: number; // km
  efficiency: number; // 0-100
  currentFuelCost: number; // SAR
  fillLevel?: number; // Optional as it might be calculated dynamic
  progress: number;
  currentPath: [number, number][];
}

export interface Incident {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: 'energy' | 'recycle' | 'dumpyard';
  status: 'operational' | 'maintenance' | 'offline';
  region: string;
  capacity: number;
  currentLoad: number;
  incomingWaste: number;
  wasteCategory: string[];
  output: number;
  revenue: number;
  description?: string;
  lastServiceDate?: string;
}

export interface Truck {
  id: string;
  code: string;
  type: string;
  status: string; // 'active' | 'maintenance' | 'inactive'
  health: number; // 0-100
  region: string;
  fuel: number; // Fuel level % or Liters
  mileage: number; // Distance covered
  lastService: string;
  driver?: string;
  plate?: string;
  capacity?: string;
  totalHours?: number;
  routeId?: string; // Link to Route ID
  route?: string; // Display Name
}

export interface Bin {
  id: string;
  lat: number;
  lng: number;
  fillLevel: number;
  health: number; // 0-100
  region: string;
  overflowStatus: boolean;
  status: string;
  lastCollection: string;
  location?: string;
  cost?: number;
  routeId?: string;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'maintenance' | 'warning' | 'repair';
  health: number; // 0-100
  region: string;
  facilityId: string;
  lastMaintenance: string;
  nextDue: string;
}

export interface Request {
  id: string;
  type: string;
  notes: string;
  status: string;
  date: string;
  requester: string;
  details?: string;
  route?: string;
  location?: string;
  cost?: number;
  capacity?: string;
}
