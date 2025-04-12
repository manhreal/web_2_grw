'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchUserProfile, User } from '@/api/users';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    isAuthenticated: false,
});

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    console.log('AuthProvider rendering');
    useEffect(() => {
        async function loadUserData() {
            try {
                const userData = await fetchUserProfile();
                setUser(userData);
            } catch (error) {
                console.error('Error loading user data:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        loadUserData();
    }, []);

    const value = {
        user,
        loading,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}