import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (role: UserRole) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (role: UserRole) => {
        // Mock login - in a real app this would come from a backend
        let name = 'Admin User';
        let avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d';

        switch (role) {
            case 'admin':
                name = 'Ali Al-Ahmed';
                break;
            case 'manager':
                name = 'Sara Al-Mansoori';
                avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026704d';
                break;
            case 'engineer':
                name = 'Omar Farooq';
                avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026024d'; // Reusing for now or find another
                break;
            case 'finance':
                name = 'Layla Hassan';
                avatar = 'https://i.pravatar.cc/150?u=a042581f4e29026704d';
                break;
        }

        setUser({
            id: `u-${Date.now()}`,
            name,
            role,
            avatar
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
