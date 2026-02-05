import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TRUCKS as INITIAL_TRUCKS, BINS as INITIAL_BINS, REQUESTS as INITIAL_REQUESTS, RECENT_INCIDENTS as INITIAL_INCIDENTS, FACILITIES as INITIAL_FACILITIES } from '../data/mockData';
import type { Incident, Facility, Truck, Bin, Request } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

// Define types
// Define types removed to use imported types


interface DataContextType {
    trucks: Truck[];
    bins: Bin[];
    facilities: Facility[];
    requests: Request[];
    incidents: Incident[];
    addTruck: (truck: Truck) => void;
    deleteTruck: (id: string) => void;
    addBin: (bin: Bin) => void;
    deleteBin: (id: string) => void;
    updateBin: (id: string, updates: Partial<Bin>) => void;
    updateFacility: (id: string, updates: Partial<Facility>) => void;
    addRequest: (request: Request) => void;
    approveRequest: (id: string) => void;
    rejectRequest: (id: string) => void;
    resolveIncident: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    // Initial state is mock data by default
    const [trucks, setTrucks] = useState<Truck[]>(INITIAL_TRUCKS);
    const [bins, setBins] = useState<Bin[]>(INITIAL_BINS);
    const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
    const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
    const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);

    // Sync with Firebase if connected
    useEffect(() => {
        if (!db) return;

        console.log("Connecting to Firestore...");

        const unsubTrucks = onSnapshot(collection(db, 'trucks'), (snap) => {
            const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Truck));
            // Merge Mock + DB
            const merged: Truck[] = [...INITIAL_TRUCKS];
            data.forEach(d => {
                if (!merged.find(m => m.id === d.id)) merged.push(d);
            });
            setTrucks(merged);
        });

        const unsubBins = onSnapshot(collection(db, 'bins'), (snap) => {
            const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Bin));
            const merged: Bin[] = [...INITIAL_BINS];
            data.forEach(d => {
                if (!merged.find(m => m.id === d.id)) merged.push(d);
            });
            setBins(merged);
        });

        const unsubRequests = onSnapshot(collection(db, 'requests'), (snap) => {
            const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Request));
            if (data.length > 0) setRequests(data);
        });

        const unsubIncidents = onSnapshot(collection(db, 'incidents'), (snap) => {
            const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Incident));
            if (data.length > 0) setIncidents(data);
        });

        return () => {
            unsubTrucks();
            unsubBins();
            unsubRequests();
            unsubIncidents();
        };
    }, []);

    const addTruck = async (truck: Truck) => {
        if (db) {
            try {
                // Use setDoc to map our internal ID to Firestore ID
                await setDoc(doc(db, 'trucks', truck.id), truck);
            } catch (e) {
                console.error("Error adding truck", e);
            }
        } else {
            setTrucks(prev => [...prev, truck]);
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
        <DataContext.Provider value={{ trucks, bins, facilities, requests, incidents, addTruck, deleteTruck, addBin, deleteBin, updateBin, updateFacility, addRequest, approveRequest, rejectRequest, resolveIncident }}>
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
