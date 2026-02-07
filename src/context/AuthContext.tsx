import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { auth } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (role: UserRole) => Promise<void>; // Modified signature
    logout: () => void;
    authError: string | null;
    switchRole: (role: UserRole) => void;
    auditLog: { id: number; user: string; action: string; time: string; type: string }[];
    isRoleSelectorOpen: boolean;
    openRoleSelector: () => void;
    closeRoleSelector: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // DEV: Default to Admin user with full profile to bypass login
    const [user, setUser] = useState<User | null>({
        id: 'dev-admin',
        name: 'Ali Al-Ahmed',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
    });
    const [authError] = useState<string | null>(null);
    const [auditLog, setAuditLog] = useState<{ id: number; user: string; action: string; time: string; type: string }[]>([]);
    const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);

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
                // setUser(null); // DEV: Removed login credential requirement (commented out logout)
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
                case 'admin': name = 'Ali Al-Ahmed'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d'; break;
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

        // KEEPING EXISTING LOGIN LOGIC for the simplified UX requested
        let name = 'Admin User';
        let avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d';

        switch (role) {
            case 'admin': name = 'Ali Al-Ahmed'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d'; break;
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

    const switchRole = (role: UserRole) => {
        let name = 'Admin User';
        let avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d';

        switch (role) {
            case 'admin': name = 'Ali Al-Ahmed'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d'; break;
            case 'manager': name = 'Sara Al-Mansoori'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'; break;
            case 'engineer': name = 'Omar Farooq'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d'; break;
            case 'finance': name = 'Layla Hassan'; avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'; break;
        }

        const newUser = {
            id: user?.id || `u-demo-${role}`,
            name,
            role,
            avatar
        };

        setUser(newUser);

        // Add to audit log
        const logEntry = {
            id: Date.now(),
            user: name,
            action: `Switched role to ${role.toUpperCase()}`,
            time: 'Just now',
            type: 'system'
        };
        setAuditLog(prev => [logEntry, ...prev]);
        setIsRoleSelectorOpen(false);
    };

    const openRoleSelector = () => setIsRoleSelectorOpen(true);
    const closeRoleSelector = () => setIsRoleSelectorOpen(false);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            authError,
            switchRole,
            auditLog,
            isRoleSelectorOpen,
            openRoleSelector,
            closeRoleSelector
        }}>
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
