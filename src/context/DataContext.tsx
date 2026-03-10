import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TRUCKS as INITIAL_TRUCKS, BINS as INITIAL_BINS, REQUESTS as INITIAL_REQUESTS, RECENT_INCIDENTS as INITIAL_INCIDENTS, FACILITIES as INITIAL_FACILITIES, TRUCK_ROUTES as INITIAL_TRUCK_ROUTES, MACHINERY as INITIAL_MACHINERY } from '../data/mockData';
import type { Incident, Facility, Truck, Bin, Request, Route, User, Machine } from '../types';

interface DataContextType {
    trucks: Truck[];
    bins: Bin[];
    facilities: Facility[];
    requests: Request[];
    incidents: Incident[];
    routes: Route[];
    machinery: Machine[];
    users: User[];
    addTruck: (truck: Truck) => void;
    deleteTruck: (id: string) => void;
    addBin: (bin: Bin) => void;
    deleteBin: (id: string) => void;
    updateBin: (id: string, updates: Partial<Bin>) => void;
    updateTruck: (id: string, updates: Partial<Truck>) => void;
    updateFacility: (id: string, updates: Partial<Facility>) => void;
    updateMachine: (id: string, updates: Partial<Machine>) => void;
    seedDatabase: () => Promise<void>;
    addRequest: (request: Request) => void;
    approveRequest: (id: string) => void;
    rejectRequest: (id: string) => void;
    resolveIncident: (id: string) => void;
    updateUserRole: (id: string, role: string) => void;
    addUser: (user: User) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    // Helper to initialize state from localStorage or default
    const getInitialState = <T,>(key: string, defaultState: T): T => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultState;
        } catch (e) {
            console.error(`Error parsing localStorage for ${key}`, e);
            return defaultState;
        }
    };

    const [trucks, setTrucks] = useState<Truck[]>(() => getInitialState('greenflow_trucks_v3', INITIAL_TRUCKS as unknown as Truck[]));
    const [bins, setBins] = useState<Bin[]>(() => getInitialState('greenflow_bins_v3', INITIAL_BINS as unknown as Bin[]));
    const [facilities, setFacilities] = useState<Facility[]>(() => getInitialState('greenflow_facilities_v3', INITIAL_FACILITIES));
    const [requests, setRequests] = useState<Request[]>(() => getInitialState('greenflow_requests_v3', INITIAL_REQUESTS));
    const [incidents, setIncidents] = useState<Incident[]>(() => getInitialState('greenflow_incidents_v3', INITIAL_INCIDENTS));
    const [routes, setRoutes] = useState<Route[]>(() => getInitialState('greenflow_routes_v3', INITIAL_TRUCK_ROUTES as unknown as Route[]));
    const [machinery, setMachinery] = useState<Machine[]>(() => getInitialState('greenflow_machinery_v3', INITIAL_MACHINERY as unknown as Machine[]));
    const [users, setUsers] = useState<User[]>(() => getInitialState('greenflow_users_v3', [
        { id: 'u1', name: 'Ali Al-Ahmed', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        { id: 'u2', name: 'Sara Al-Mansoori', role: 'manager', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        { id: 'u3', name: 'Omar Farooq', role: 'engineer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        { id: 'u4', name: 'Layla Hassan', role: 'finance', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }
    ]));

    // Persist state to localStorage whenever it changes
    useEffect(() => { localStorage.setItem('greenflow_trucks_v3', JSON.stringify(trucks)); }, [trucks]);
    useEffect(() => { localStorage.setItem('greenflow_bins_v3', JSON.stringify(bins)); }, [bins]);
    useEffect(() => { localStorage.setItem('greenflow_facilities_v3', JSON.stringify(facilities)); }, [facilities]);
    useEffect(() => { localStorage.setItem('greenflow_requests_v3', JSON.stringify(requests)); }, [requests]);
    useEffect(() => { localStorage.setItem('greenflow_incidents_v3', JSON.stringify(incidents)); }, [incidents]);
    useEffect(() => { localStorage.setItem('greenflow_routes_v3', JSON.stringify(routes)); }, [routes]);
    useEffect(() => { localStorage.setItem('greenflow_machinery_v3', JSON.stringify(machinery)); }, [machinery]);
    useEffect(() => { localStorage.setItem('greenflow_users_v3', JSON.stringify(users)); }, [users]);

    useEffect(() => {
        // SIMULATION LOOP (Enhanced Interconnected Logic)
        const interval = setInterval(() => {
            setBins(prevBins => {
                const updatedBins = [...prevBins];
                setTrucks(prevTrucks => {
                    const updatedTrucks = [...prevTrucks];
                    setFacilities(prevFacilities => {
                        const updatedFacilities = [...prevFacilities];

                        // 1. Bins Fill Up
                        updatedBins.forEach((bin, idx) => {
                            const fillIncrement = Math.random() * 2.5;
                            let newLevel = bin.fillLevel + fillIncrement;
                            if (newLevel > 100) newLevel = 100;
                            const isOverflowing = newLevel >= 95;
                            updatedBins[idx] = {
                                ...bin,
                                fillLevel: parseFloat(newLevel.toFixed(1)),
                                overflowStatus: isOverflowing,
                                status: isOverflowing ? 'critical' : bin.status
                            };
                        });

                        // 2. Trucks Movement & Interconnected Logic
                        updatedTrucks.forEach((truck, tIdx) => {
                            if (truck.status !== 'active') return;

                            const fuelBurn = 0.3 + (Math.random() * 0.4);
                            let newFuel = (truck.fuel || 0) - fuelBurn;
                            if (newFuel < 0) newFuel = 0; // Don't auto-refuel here anymore

                            const mileageGain = 1.2 + (Math.random() * 2);
                            const newMileage = (truck.mileage || 0) + mileageGain;

                            let currentLoad = truck.currentLoad || 0;
                            let truckUpdates: Partial<Truck> = {
                                fuel: parseFloat(newFuel.toFixed(1)),
                                mileage: Math.round(newMileage)
                            };

                            // Collection Logic: Connects Truck to Bins
                            if (currentLoad < 80) {
                                const targetBinIdx = updatedBins.findIndex(b => b.region === truck.region && b.fillLevel > 60);
                                if (targetBinIdx !== -1 && Math.random() > 0.5) {
                                    const bin = updatedBins[targetBinIdx];
                                    currentLoad += 15;
                                    if (currentLoad > 100) currentLoad = 100;

                                    updatedBins[targetBinIdx] = {
                                        ...bin,
                                        fillLevel: 0,
                                        overflowStatus: false,
                                        status: 'active',
                                        lastCollection: 'Just now'
                                    };
                                }
                            }

                            // Dumping Logic: Connects Truck to Facilities
                            if (currentLoad >= 85) {
                                const facilityIdx = updatedFacilities.findIndex(f => f.region === truck.region && f.status === 'operational');
                                if (facilityIdx !== -1 && Math.random() > 0.6) {
                                    const facility = updatedFacilities[facilityIdx];

                                    // Conditional: Refuel if low, otherwise dump waste
                                    if (newFuel < 30) {
                                        newFuel = 100;
                                        // console.log(`Truck ${truck.code} refueling at ${facility.name}`);
                                    } else {
                                        const dumpAmount = currentLoad * 8.5;
                                        const newFacilityLoad = Math.min(facility.currentLoad + (dumpAmount / 5), facility.capacity);

                                        let revenueGain = 0;
                                        let outputGain = 0;
                                        if (facility.type === 'recycle') revenueGain = dumpAmount * 15;
                                        if (facility.type === 'energy') outputGain = dumpAmount * 12;

                                        updatedFacilities[facilityIdx] = {
                                            ...facility,
                                            currentLoad: Math.round(newFacilityLoad),
                                            revenue: (facility.revenue || 0) + revenueGain,
                                            output: (facility.output || 0) + outputGain
                                        };
                                        currentLoad = 0;
                                        // console.log(`Truck ${truck.code} dumped at ${facility.name}`);
                                    }
                                }
                            }

                            updatedTrucks[tIdx] = { ...truck, ...truckUpdates, currentLoad: parseFloat(currentLoad.toFixed(1)) };
                        });

                        // 3. Facilities Waste Conversion (Live Revenue)
                        updatedFacilities.forEach((facility, fIdx) => {
                            if (facility.status !== 'operational' || facility.currentLoad <= 0) return;
                            const processed = Math.min(facility.currentLoad, 8);
                            updatedFacilities[fIdx] = {
                                ...facility,
                                currentLoad: Math.round(facility.currentLoad - processed),
                                revenue: (facility.revenue || 0) + (processed * 2.5)
                            };
                        });

                        return updatedFacilities;
                    });
                    return updatedTrucks;
                });
                return updatedBins;
            });

        }, 5000); // 5s for dynamic presentation impact


        return () => clearInterval(interval);
    }, []);

    const checkAssetHealth = (type: 'Truck' | 'Bin' | 'Machine', health: number, name: string) => {
        if (health < 20) {
            const newIncident: Incident = {
                id: `inc-${Date.now()}`,
                type: 'asset_failure',
                message: `Critical health alert for ${type} ${name}: Health at ${health}%`,
                timestamp: 'Just now',
                severity: 'high',
                resolved: false
            };
            setIncidents(prev => [newIncident, ...prev]);
        } else if (health < 50) {
            const newRequest: Request = {
                id: `req-${Date.now()}`,
                type: type,
                notes: `Automated maintenance request for ${name}. Health is ${health}%`,
                status: 'pending',
                date: new Date().toISOString().split('T')[0],
                requester: 'System Monitor',
                details: 'Health check failed threshold'
            };
            setRequests(prev => [newRequest, ...prev]);
        }
    };

    const addTruck = (truck: Truck) => {
        setTrucks(prev => [...prev, truck]);
        if (truck.route) {
            const routeId = `R-${Date.now()}`;
            const newRoute: Route = {
                id: routeId,
                name: truck.route,
                region: 'Unassigned Region',
                driver: truck.driver || 'Unassigned',
                truckId: truck.id,
                vehicle: `${truck.type} ${truck.code}`,
                assignedBinIds: [],
                status: 'active',
                distance: 0,
                currentFuelCost: 0,
                fillLevel: 0,
                progress: 0,
                efficiency: 100,
                currentPath: [[24.7136, 46.6753], [24.7136 + 0.01, 46.6753 + 0.01]]
            };
            setRoutes(prev => [...prev, newRoute]);
        }
    };

    const deleteTruck = (id: string) => {
        setTrucks(prev => prev.filter(t => t.id !== id));
    };

    const addBin = (bin: Bin) => {
        setBins(prev => [...prev, bin]);
    };

    const updateBin = (id: string, updates: Partial<Bin>) => {
        const bin = bins.find(b => b.id === id);
        if (bin && updates.health !== undefined) {
            checkAssetHealth('Bin', updates.health, bin.location || id);
        }
        setBins(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const updateTruck = (id: string, updates: Partial<Truck>) => {
        const truck = trucks.find(t => t.id === id);
        if (truck && updates.health !== undefined) {
            checkAssetHealth('Truck', updates.health, truck.code);
        }
        setTrucks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteBin = (id: string) => {
        setBins(prev => prev.filter(b => b.id !== id));
    };

    const updateFacility = (id: string, updates: Partial<Facility>) => {
        setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const updateMachine = (id: string, updates: Partial<Machine>) => {
        const machine = machinery.find(m => m.id === id);
        if (machine && updates.health !== undefined) {
            checkAssetHealth('Machine', updates.health, machine.name);
        }
        setMachinery(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const updateUserRole = (userId: string, role: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: role as any } : u));
    };

    const addUser = async (user: User) => {
        setUsers(prev => [...prev, user]);
    };

    const deleteUser = async (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    const seedDatabase = async () => {
        if (!confirm("Reset database to initial Mock Data? All local changes will be lost.")) return;

        setTrucks(INITIAL_TRUCKS as unknown as Truck[]);
        setBins(INITIAL_BINS as unknown as Bin[]);
        setFacilities(INITIAL_FACILITIES);
        setRequests(INITIAL_REQUESTS);
        setIncidents(INITIAL_INCIDENTS);
        setMachinery(INITIAL_MACHINERY as unknown as Machine[]);
        setRoutes(INITIAL_TRUCK_ROUTES as unknown as Route[]);
        setUsers([
            { id: 'u1', name: 'Ali Al-Ahmed', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
            { id: 'u2', name: 'Sara Al-Mansoori', role: 'manager', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
            { id: 'u3', name: 'Omar Farooq', role: 'engineer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
            { id: 'u4', name: 'Layla Hassan', role: 'finance', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }
        ]);

        alert("Database reset to initial mock data!");
    };

    const addRequest = (request: Request) => {
        setRequests(prev => [request, ...prev]);
    };

    const approveRequest = (id: string) => {
        const request = requests.find(r => r.id === id);
        if (!request) return;
        if (request.type === 'Truck') {
            const newCode = `T-${Math.floor(Math.random() * 1000)}`;
            const newTruck: Truck = {
                id: `T-${Date.now()}`,
                code: newCode,
                type: 'Compactor',
                status: 'active',
                health: 100,
                region: 'Unassigned',
                fuel: 100,
                mileage: 0,
                lastService: new Date().toISOString().split('T')[0],
                capacity: request.capacity || 'N/A',
                route: request.route || `Route ${newCode}`,
                cost: request.cost || 0
            };
            addTruck(newTruck);
        } else if (request.type === 'Bin') {
            const newBin: Bin = {
                id: `B-${Math.floor(Math.random() * 10000)}`,
                lat: 24.7 + (Math.random() * 0.1),
                lng: 46.6 + (Math.random() * 0.1),
                fillLevel: 0,
                health: 100,
                region: 'Unassigned',
                overflowStatus: false,
                status: 'active',
                lastCollection: 'Just now',
                location: request.location || 'Unknown Location',
                cost: request.cost || 0
            };
            addBin(newBin);
        }
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    const rejectRequest = (id: string) => {
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    const resolveIncident = (id: string) => {
        setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, resolved: true } : inc));
    };

    return (
        <DataContext.Provider value={{ trucks, bins, facilities, requests, incidents, routes, machinery, users, addTruck, deleteTruck, addBin, deleteBin, updateBin, updateTruck, updateFacility, updateMachine, seedDatabase, addRequest, approveRequest, rejectRequest, resolveIncident, updateUserRole, addUser, deleteUser }}>
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
