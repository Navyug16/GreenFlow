import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { auth } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password?: string) => Promise<void>;
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
    // Default to NULL (Not authenticated)
    const [user, setUser] = useState<User | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [auditLog, setAuditLog] = useState<{ id: number; user: string; action: string; time: string; type: string }[]>([]);
    const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);

    // Hardcoded Credentials for Demo
    const CREDENTIALS = {
        'admin@greenflow.sa': { role: 'admin', name: 'Ali Al-Ahmed', password: 'admin', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        'manager@greenflow.sa': { role: 'manager', name: 'Sara Al-Mansoori', password: 'manager', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        'engineer@greenflow.sa': { role: 'engineer', name: 'Omar Farooq', password: 'engineer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        'finance@greenflow.sa': { role: 'finance', name: 'Layla Hassan', password: 'finance', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }
    };

    // Sync with Firebase Auth State (Optional fallback if we were using real Firebase Auth)
    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            // Logic kept for potential firebase integration, but primary auth for this demo is credential-based
            if (!firebaseUser) setUser(null);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password?: string) => {
        // Clear previous errors
        setAuthError(null);

        // Check credentials from hardcoded list
        const userCreds = CREDENTIALS[email as keyof typeof CREDENTIALS];

        if (userCreds && userCreds.password === password) {
            const role = userCreds.role as UserRole;
            setUser({
                id: `u-demo-${role}`,
                name: userCreds.name,
                role: role,
                avatar: userCreds.avatar
            });
            return;
        }

        // Simulating error for invalid credentials
        setAuthError("Invalid email or password");
        throw new Error("Invalid credentials");
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
