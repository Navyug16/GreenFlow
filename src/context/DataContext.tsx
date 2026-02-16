import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TRUCKS as INITIAL_TRUCKS, BINS as INITIAL_BINS, REQUESTS as INITIAL_REQUESTS, RECENT_INCIDENTS as INITIAL_INCIDENTS, FACILITIES as INITIAL_FACILITIES, TRUCK_ROUTES as INITIAL_TRUCK_ROUTES, MACHINERY as INITIAL_MACHINERY } from '../data/mockData';
import type { Incident, Facility, Truck, Bin, Request, Route, User, Machine } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, writeBatch } from 'firebase/firestore';

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
    useEffect(() => {
        // console.log("DataProvider mounted");
    }, []);
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
    const [users, setUsers] = useState<User[]>(() => getInitialState('greenflow_users_v3', []));

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
        // SIMULATION LOOP
        const interval = setInterval(() => {
            // 1. Slow Bin Filling
            setBins(prevBins => prevBins.map(bin => {
                // Slower fill rate: 0.5% - 2% per tick (was likely higher or static before)
                const fillIncrement = Math.random() * 1.5;
                let newLevel = bin.fillLevel + fillIncrement;
                if (newLevel > 100) newLevel = 100;

                // Overflow logic
                const isOverflowing = newLevel >= 95;

                return {
                    ...bin,
                    fillLevel: parseFloat(newLevel.toFixed(1)),
                    overflowStatus: isOverflowing,
                    status: isOverflowing ? 'critical' : bin.status
                };
            }));

            // 2. Truck Movement & Logic
            setTrucks(prevTrucks => {
                return prevTrucks.map(truck => {
                    if (truck.status !== 'active') return truck;

                    let currentLoad = truck.currentLoad || 0;

                    // A. Check Capacity
                    if (currentLoad >= 90) {
                        // GO TO FACILITY
                        // Find nearest facility (Mock: defaults to region specific or first one)
                        // In a real app, calculate distance. Here we simulate 'dumping' if not already there
                        if (Math.random() > 0.8) { // Simulate travel time
                            currentLoad = 0; // Dumped
                            // console.log(`Truck ${truck.code} dumped waste at facility.`);
                        }
                        return { ...truck, currentLoad };
                    }

                    // B. Route Logic
                    // If route completed (mock: simply probabilistic or standard path)
                    // For this simulation, we'll assume trucks are constantly "patrolling" their route

                    // C. "Smart" Logic: If idle/patrolling and nearby bin is critical
                    // Find critical bin in same region not assigned/collected recently
                    // This is complex to mock purely with state without a map engine running here, 
                    // so we simulate the RESULT of that logic:

                    // If truck has capacity and random chance hits, it collects waste
                    if (currentLoad < 90 && Math.random() > 0.7) {
                        currentLoad += 5; // Collected 5% capacity worth of waste
                    }

                    return { ...truck, currentLoad };
                });
            });

        }, 10000); // 10 Seconds per tick (Reduced frequency for performance)

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!db) return;

        console.log("Connecting to Firestore...");

        const unsubTrucks = onSnapshot(collection(db, 'trucks'), (snap) => {
            const firestoreData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Truck));
            const merged: Truck[] = [...firestoreData];
            INITIAL_TRUCKS.forEach(mockItem => {
                if (!merged.find(m => m.id === mockItem.id)) {
                    merged.push(mockItem);
                }
            });
            setTrucks(merged);
        });

        const unsubBins = onSnapshot(collection(db, 'bins'), (snap) => {
            const firestoreData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Bin));
            const merged: Bin[] = [...firestoreData];
            INITIAL_BINS.forEach(mockItem => {
                if (!merged.find(m => m.id === mockItem.id)) {
                    merged.push(mockItem);
                }
            });
            setBins(merged);
        });

        const unsubRequests = onSnapshot(collection(db, 'requests'), (snap) => {
            const firestoreData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Request));
            const merged: Request[] = [...firestoreData];
            INITIAL_REQUESTS.forEach(mockItem => {
                if (!merged.find(m => m.id === mockItem.id)) {
                    merged.push(mockItem);
                }
            });
            setRequests(merged);
        });

        const unsubIncidents = onSnapshot(collection(db, 'incidents'), (snap) => {
            const firestoreData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Incident));
            const merged: Incident[] = [...firestoreData];
            INITIAL_INCIDENTS.forEach(mockItem => {
                if (!merged.find(m => m.id === mockItem.id)) {
                    merged.push(mockItem);
                }
            });
            setIncidents(merged);
        });

        const unsubFacilities = onSnapshot(collection(db, 'facilities'), (snap) => {
            const firestoreData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Facility));
            const merged: Facility[] = [...firestoreData];
            INITIAL_FACILITIES.forEach(mockItem => {
                if (!merged.find(m => m.id === mockItem.id)) {
                    merged.push(mockItem);
                }
            });
            setFacilities(merged);
        });

        const unsubMachinery = onSnapshot(collection(db, 'machinery'), (snap) => {
            const firestoreData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Machine));
            const merged: Machine[] = [...firestoreData];
            INITIAL_MACHINERY.forEach(mockItem => {
                const castMockItem = mockItem as unknown as Machine;
                if (!merged.find(m => m.id === castMockItem.id)) {
                    merged.push(castMockItem);
                }
            });
            setMachinery(merged);
        });

        const unsubRoutes = onSnapshot(collection(db, 'routes'), (snap) => {
            const firestoreData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Route));
            const merged: Route[] = [...firestoreData];
            INITIAL_TRUCK_ROUTES.forEach(mockItem => {
                if (!merged.find(m => m.id === mockItem.id)) {
                    merged.push(mockItem as Route);
                }
            });
            setRoutes(merged);
        });

        const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
            const firestoreData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
            setUsers(firestoreData);
        });

        return () => {
            unsubTrucks();
            unsubBins();
            unsubRequests();
            unsubIncidents();
            unsubFacilities();
            unsubMachinery();
            unsubRoutes();
            unsubUsers();
        };
    }, []);

    const checkAssetHealth = async (_id: string, type: 'Truck' | 'Bin' | 'Machine', health: number, name: string) => {
        if (health < 20) {
            // High Severity Incident
            const newIncident: Incident = {
                id: `inc-${Date.now()}`,
                type: 'asset_failure',
                message: `Critical health alert for ${type} ${name}: Health at ${health}%`,
                timestamp: 'Just now',
                severity: 'high',
                resolved: false
            };
            if (db) await setDoc(doc(db, 'incidents', newIncident.id), newIncident);
            else setIncidents(prev => [newIncident, ...prev]);
        } else if (health < 50) {
            // Maintenance Request
            const newRequest: Request = {
                id: `req-${Date.now()}`,
                type: type,
                notes: `Automated maintenance request for ${name}. Health is ${health}%`,
                status: 'pending',
                date: new Date().toISOString().split('T')[0],
                requester: 'System Monitor',
                details: 'Health check failed threshold'
            };
            if (db) await setDoc(doc(db, 'requests', newRequest.id), newRequest);
            else setRequests(prev => [newRequest, ...prev]);
        }
    };

    const addTruck = async (truck: Truck) => {
        if (db) {
            try {
                await setDoc(doc(db, 'trucks', truck.id), truck);
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
                    await setDoc(doc(db, 'routes', routeId), newRoute);
                }
            } catch (e) {
                console.error("Error adding truck", e);
            }
        } else {
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
        }
    };

    const deleteTruck = async (id: string) => {
        if (db) {
            try {
                await deleteDoc(doc(db, 'trucks', id));
            } catch (e) {
                console.error("Error deleting truck", e);
            }
        } else {
            setTrucks(prev => prev.filter(t => t.id !== id));
        }
    };

    const addBin = async (bin: Bin) => {
        if (db) {
            try {
                await setDoc(doc(db, 'bins', bin.id), bin);
            } catch (e) {
                console.error("Error adding bin", e);
            }
        } else {
            setBins(prev => [...prev, bin]);
        }
    };

    const updateBin = async (id: string, updates: Partial<Bin>) => {
        const bin = bins.find(b => b.id === id);
        if (bin && updates.health !== undefined) {
            checkAssetHealth(id, 'Bin', updates.health, bin.location || id);
        }

        if (db) {
            try {
                await updateDoc(doc(db, 'bins', id), updates);
            } catch (e) {
                console.error("Error updating bin", e);
            }
        } else {
            setBins(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
        }
    };

    const updateTruck = async (id: string, updates: Partial<Truck>) => {
        const truck = trucks.find(t => t.id === id);
        if (truck && updates.health !== undefined) {
            checkAssetHealth(id, 'Truck', updates.health, truck.code);
        }

        if (db) {
            try {
                await updateDoc(doc(db, 'trucks', id), updates);
            } catch (e) {
                console.error("Error updating truck", e);
            }
        } else {
            setTrucks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
        }
    };

    const deleteBin = async (id: string) => {
        if (db) {
            try {
                await deleteDoc(doc(db, 'bins', id));
            } catch (e) {
                console.error("Error deleting bin", e);
            }
        } else {
            setBins(prev => prev.filter(b => b.id !== id));
        }
    };

    const updateFacility = async (id: string, updates: Partial<Facility>) => {
        if (db) {
            try {
                await updateDoc(doc(db, 'facilities', id), updates);
            } catch (e) {
                console.error("Error updating facility", e);
            }
        } else {
            setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
        }
    };

    const updateMachine = async (id: string, updates: Partial<Machine>) => {
        const machine = machinery.find(m => m.id === id);
        if (machine && updates.health !== undefined) {
            checkAssetHealth(id, 'Machine', updates.health, machine.name);
        }

        if (db) {
            try {
                await updateDoc(doc(db, 'machinery', id), updates);
            } catch (e) {
                console.error("Error updating machine", e);
            }
        } else {
            setMachinery(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
        }
    };

    const updateUserRole = async (userId: string, role: string) => {
        if (db) {
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, { role });
            } catch (e) {
                console.error("Error updating user role", e);
            }
        } else {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: role as any } : u));
        }
    };

    const addUser = async (user: User) => {
        if (db) {
            try {
                await setDoc(doc(db, 'users', user.id), user);
            } catch (e) {
                console.error("Error adding user", e);
            }
        } else {
            setUsers(prev => [...prev, user]);
        }
    };

    const deleteUser = async (id: string) => {
        if (db) {
            try {
                await deleteDoc(doc(db, 'users', id));
            } catch (e) {
                console.error("Error deleting user", e);
            }
        } else {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    const seedDatabase = async () => {
        if (!db) {
            alert("Database not connected. Check .env config.");
            return;
        }
        if (!confirm("Overwrite database with initial Mock Data? This cannot be undone.")) return;

        try {
            const batch = writeBatch(db);
            INITIAL_TRUCKS.forEach(t => batch.set(doc(db, 'trucks', t.id), t));
            INITIAL_BINS.forEach(b => batch.set(doc(db, 'bins', b.id), b));
            INITIAL_FACILITIES.forEach(f => batch.set(doc(db, 'facilities', f.id), f));
            INITIAL_REQUESTS.forEach(r => batch.set(doc(db, 'requests', r.id), r));
            INITIAL_INCIDENTS.forEach(i => batch.set(doc(db, 'incidents', i.id), i));
            INITIAL_MACHINERY.forEach(m => batch.set(doc(db, 'machinery', m.id), m));
            const demoUsers: User[] = [
                { id: 'u1', name: 'Ali Al-Ahmed', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
                { id: 'u2', name: 'Sara Al-Mansoori', role: 'manager', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
                { id: 'u3', name: 'Omar Farooq', role: 'engineer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
                { id: 'u4', name: 'Layla Hassan', role: 'finance', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }
            ];
            demoUsers.forEach(u => batch.set(doc(db, 'users', u.id), u));
            await batch.commit();
            console.log("Database seeded successfully");
            alert("Database seeded successfully!");
        } catch (e) {
            console.error("Error seeding database", e);
            alert("Error seeding database check console.");
        }
    };

    const addRequest = async (request: Request) => {
        if (db) {
            try {
                await setDoc(doc(db, 'requests', request.id), request);
            } catch (e) {
                console.error("Error adding request", e);
            }
        } else {
            setRequests(prev => [request, ...prev]);
        }
    };

    const approveRequest = async (id: string) => {
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
            await addTruck(newTruck);
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
            await addBin(newBin);
        }
        if (db) {
            try {
                await deleteDoc(doc(db, 'requests', id));
            } catch (e) {
                console.error("Error deleting request", e);
            }
        } else {
            setRequests(prev => prev.filter(r => r.id !== id));
        }
    };

    const rejectRequest = async (id: string) => {
        if (db) {
            try {
                await deleteDoc(doc(db, 'requests', id));
            } catch (e) {
                console.error("Error rejecting request", e);
            }
        } else {
            setRequests(prev => prev.filter(r => r.id !== id));
        }
    };

    const resolveIncident = async (id: string) => {
        if (db) {
            try {
                await updateDoc(doc(db, 'incidents', id), { resolved: true });
            } catch (e) {
                console.error("Error resolving incident", e);
            }
        } else {
            setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, resolved: true } : inc));
        }
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
