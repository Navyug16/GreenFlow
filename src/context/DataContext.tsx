import { createContext, useContext, useState, type ReactNode } from 'react';
import { TRUCKS as INITIAL_TRUCKS, BINS as INITIAL_BINS, REQUESTS as INITIAL_REQUESTS, RECENT_INCIDENTS as INITIAL_INCIDENTS } from '../data/mockData';
import type { Incident } from '../types';

// Define types (you might want to move these to a types file eventually)
interface Truck { id: string; code: string; type: string; status: string; fuel: number; mileage: number; lastService: string; driver?: string; plate?: string; capacity?: string; totalHours?: number; }
interface Bin { id: string; lat: number; lng: number; fillLevel: number; status: string; lastCollection: string; }
interface Request { id: string; type: string; notes: string; status: string; date: string; requester: string; details?: string; }

interface DataContextType {
    trucks: Truck[];
    bins: Bin[];
    requests: Request[];
    incidents: Incident[];
    addTruck: (truck: Truck) => void;
    addBin: (bin: Bin) => void;
    addRequest: (request: Request) => void;
    approveRequest: (id: string) => void;
    rejectRequest: (id: string) => void;
    resolveIncident: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [trucks, setTrucks] = useState<Truck[]>(INITIAL_TRUCKS);
    const [bins, setBins] = useState<Bin[]>(INITIAL_BINS);
    const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
    const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);

    const addTruck = (truck: Truck) => setTrucks(prev => [...prev, truck]);
    const addBin = (bin: Bin) => setBins(prev => [...prev, bin]);
    const addRequest = (request: Request) => setRequests(prev => [request, ...prev]);

    const approveRequest = (id: string) => {
        const request = requests.find(r => r.id === id);
        if (!request) return;

        // Logic to convert approved request to actual asset
        // This is a simplification. In a real app, you might need more details.
        if (request.type === 'Truck') {
            const newTruck: Truck = {
                id: `T-${Date.now()}`,
                code: `T-${Math.floor(Math.random() * 1000)}`,
                type: 'Compactor', // Default or parse from notes
                status: 'active',
                fuel: 100,
                mileage: 0,
                lastService: new Date().toISOString().split('T')[0],
                capacity: request.details?.replace('Capacity: ', '') || 'N/A'
            };
            addTruck(newTruck);
        } else if (request.type === 'Bin') {
            const newBin: Bin = {
                id: `B-${Math.floor(Math.random() * 10000)}`,
                lat: 24.7 + (Math.random() * 0.1), // Mock location near Riyadh
                lng: 46.6 + (Math.random() * 0.1),
                fillLevel: 0,
                status: 'active',
                lastCollection: 'Just now'
            };
            addBin(newBin);
        }

        // Remove from pending list
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    const rejectRequest = (id: string) => {
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    const resolveIncident = (id: string) => {
        setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, resolved: true } : inc));
    };

    return (
        <DataContext.Provider value={{ trucks, bins, requests, incidents, addTruck, addBin, addRequest, approveRequest, rejectRequest, resolveIncident }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
