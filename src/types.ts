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

export interface Route {
  id: string;
  driverName: string;
  truckId: string;
  status: 'active' | 'completed' | 'pending';
  fillLevel: number;
  coordinates: [number, number][]; // Simple path
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
  output: number; // e.g., KW or Tons
  description?: string;
}
