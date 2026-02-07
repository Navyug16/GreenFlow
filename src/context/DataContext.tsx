import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TRUCKS as INITIAL_TRUCKS, BINS as INITIAL_BINS, REQUESTS as INITIAL_REQUESTS, RECENT_INCIDENTS as INITIAL_INCIDENTS, FACILITIES as INITIAL_FACILITIES } from '../data/mockData';
import type { Incident, Facility, Truck, Bin, Request, Route, User } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, writeBatch } from 'firebase/firestore';

// Define types
// Define types removed to use imported types


interface DataContextType {
    trucks: Truck[];
    bins: Bin[];
    facilities: Facility[];
    requests: Request[];
    incidents: Incident[];
    routes: Route[]; // Added Route[]
    users: User[]; // Added User[]
    addTruck: (truck: Truck) => void;
    deleteTruck: (id: string) => void;
    addBin: (bin: Bin) => void;
    deleteBin: (id: string) => void;
    updateBin: (id: string, updates: Partial<Bin>) => void;
    updateFacility: (id: string, updates: Partial<Facility>) => void;
    seedDatabase: () => Promise<void>;
    addRequest: (request: Request) => void;
    approveRequest: (id: string) => void;
    rejectRequest: (id: string) => void;
    resolveIncident: (id: string) => void;
    updateUserRole: (id: string, role: string) => void; // Added User update function
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    // Initial state is mock data by default
    const [trucks, setTrucks] = useState<Truck[]>(INITIAL_TRUCKS);
    const [bins, setBins] = useState<Bin[]>(INITIAL_BINS);
    const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
    const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
    const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
    // New State for Routes and Users
    const [routes, setRoutes] = useState<any[]>([]); // Using any for mock data temporarily as imports needed
    const [users, setUsers] = useState<User[]>([]);

    // Sync with Firebase if connected
    useEffect(() => {
        if (!db) return;

        console.log("Connecting to Firestore...");

        const unsubTrucks = onSnapshot(collection(db, 'trucks'), (snap) => {
            const firestoreData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Truck));
            // Merge Mock + DB (Firestore takes precedence)
            // If an item exists in Firestore, use it. If not, check if it's in Mock data.
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

        const unsubRoutes = onSnapshot(collection(db, 'routes'), (snap) => {
            const firestoreData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            // Merge Mock Routes (Need to import mock routes if available, otherwise just use firestore)
            // For now, if firestore is empty, use empty array or hardcoded simple demo routes if needed
            setRoutes(firestoreData);
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
            unsubRoutes();
            unsubUsers();
        };
    }, []);

    const addTruck = async (truck: Truck) => {
        if (db) {
            try {
                // Use setDoc to map our internal ID to Firestore ID
                await setDoc(doc(db, 'trucks', truck.id), truck);

                // Automatically Create Route if provided
                if (truck.route && truck.route !== 'Unassigned') {
                    const routeId = `R-${Date.now()}`;
                    const newRoute = {
                        id: routeId,
                        name: truck.route,
                        driverName: truck.driver || 'Unassigned',
                        truckId: truck.id,
                        vehicle: `${truck.type} ${truck.code}`,
                        status: 'active',
                        fillLevel: 0,
                        progress: 0,
                        efficiency: 100,
                        coordinates: [[24.7136, 46.6753], [24.7136 + 0.01, 46.6753 + 0.01]] // Simple demo connection
                    };
                    await setDoc(doc(db, 'routes', routeId), newRoute);
                }
            } catch (e) {
                console.error("Error adding truck", e);
            }
        } else {
            setTrucks(prev => [...prev, truck]);
            // Also update local routes state if needed for demo
            if (truck.route) {
                const routeId = `R-${Date.now()}`;
                const newRoute = {
                    id: routeId,
                    name: truck.route,
                    driverName: truck.driver || 'Unassigned',
                    truckId: truck.id,
                    vehicle: `${truck.type} ${truck.code}`,
                    status: 'active',
                    fillLevel: 0,
                    progress: 0,
                    efficiency: 100,
                    coordinates: [[24.7136, 46.6753], [24.7136 + 0.01, 46.6753 + 0.01]]
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

    const updateUserRole = async (userId: string, role: string) => {
        if (db) {
            try {
                await updateDoc(doc(db, 'users', userId), { role });
            } catch (e) {
                console.error("Error updating user role", e);
            }
        } else {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: role as any } : u));
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

            // Seed Trucks
            INITIAL_TRUCKS.forEach(t => batch.set(doc(db, 'trucks', t.id), t));
            // Seed Bins
            INITIAL_BINS.forEach(b => batch.set(doc(db, 'bins', b.id), b));
            // Seed Facilities
            INITIAL_FACILITIES.forEach(f => batch.set(doc(db, 'facilities', f.id), f));

            // Seed Requests & Incidents
            INITIAL_REQUESTS.forEach(r => batch.set(doc(db, 'requests', r.id), r));
            INITIAL_INCIDENTS.forEach(i => batch.set(doc(db, 'incidents', i.id), i));

            // Seed Users (Optional Demo Users)
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

        // Logic to convert approved request to actual asset
        if (request.type === 'Truck') {
            const newTruck: Truck = {
                id: `T-${Date.now()}`,
                code: `T-${Math.floor(Math.random() * 1000)}`,
                type: 'Compactor',
                status: 'active',
                fuel: 100,
                mileage: 0,
                lastService: new Date().toISOString().split('T')[0],
                capacity: request.capacity || 'N/A',
                route: request.route || 'Unassigned'
            };
            await addTruck(newTruck);
        } else if (request.type === 'Bin') {
            const newBin: Bin = {
                id: `B-${Math.floor(Math.random() * 10000)}`,
                lat: 24.7 + (Math.random() * 0.1), // Mock location near Riyadh
                lng: 46.6 + (Math.random() * 0.1),
                fillLevel: 0,
                status: 'active',
                lastCollection: 'Just now',
                location: request.location || 'Unknown Location',
                cost: request.cost || 0
            };
            await addBin(newBin);
        }

        // Remove from pending requests
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
        <DataContext.Provider value={{ trucks, bins, facilities, requests, incidents, routes, users, addTruck, deleteTruck, addBin, deleteBin, updateBin, updateFacility, seedDatabase, addRequest, approveRequest, rejectRequest, resolveIncident, updateUserRole }}>
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
