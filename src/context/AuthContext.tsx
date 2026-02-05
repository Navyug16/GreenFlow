import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (role: UserRole) => Promise<void>; // Modified signature
    logout: () => void;
    authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);

    // Sync with Firebase Auth State
    useEffect(() => {
        if (!auth) return;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in, fetch role from Firestore
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser({
                        id: firebaseUser.uid,
                        name: userData.name || firebaseUser.email || 'User',
                        role: userData.role as UserRole,
                        avatar: userData.avatar || 'https://i.pravatar.cc/150'
                    });
                } else {
                    // Fallback if no user record in Firestore (should create one)
                    setUser({
                        id: firebaseUser.uid,
                        name: firebaseUser.email || 'User',
                        role: 'admin', // Default fallback
                        avatar: 'https://i.pravatar.cc/150'
                    });
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async (role: UserRole) => {
        // DEMO LOGIN (Keep existing behavior for easy testing without creating accounts)
        // If you want real auth, you would use signInWithEmailAndPassword here

        if (!auth) {
            // Fallback to mock login if firebase not ready
            let name = 'Admin User';
            let avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d';

            switch (role) {
                case 'admin': name = 'Ali Al-Ahmed'; break;
                case 'manager': name = 'Sara Al-Mansoori'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'; break;
                case 'engineer': name = 'Omar Farooq'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d'; break;
                case 'finance': name = 'Layla Hassan'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'; break;
            }

            setUser({
                id: `u-${Date.now()}`,
                name,
                role,
                avatar
            });
            return;
        }

        // AUTO-CREATE ACCOUNT FOR DEMO ROLES (If using Real Auth)
        // For this "Role Button" login UI, we can trick it by signing in anonymously or using hardcoded demo accounts if we wanted.
        // But since the user likes the "Button Click" simplicity, we will stick to the 'Mock' state style for now
        // UNLESS the user explicitly asks for Email/Password forms.

        // MIXED MODE: We will just set the user state locally so the app works instantly
        // BUT we will also try to anonymously sign in to firebase so rules work
        /*
        try {
            await signInAnonymously(auth);
            // After sign in, the useEffect above handles setting the user? 
            // Actually, for anonymous, we might not have a profile.
        } catch (e) {
            console.error(e);
        }
        */

        // KEEPING EXISTING LOGIN LOGIC for the simplified UX requested
        let name = 'Admin User';
        let avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d';

        switch (role) {
            case 'admin': name = 'Ali Al-Ahmed'; break;
            case 'manager': name = 'Sara Al-Mansoori'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'; break;
            case 'engineer': name = 'Omar Farooq'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d'; break;
            case 'finance': name = 'Layla Hassan'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'; break;
        }

        setUser({
            id: `u-demo-${role}`, // Stable ID for demo
            name,
            role,
            avatar
        });
    };

    const logout = async () => {
        if (auth) {
            try {
                await signOut(auth);
            } catch (e) {
                console.error(e);
            }
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, authError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
