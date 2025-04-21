// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserDoc } from '@/types/pet';

interface AuthContextType {
    user: UserDoc | null;
    loading: boolean;
    signIn: (user: UserDoc) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserDoc | null>(null);
    const [loading, setLoading] = useState(true);

    // Khi app mount, đọc lại user từ AsyncStorage
    useEffect(() => {
        (async () => {
            try {
                const json = await AsyncStorage.getItem('user');
                if (json) {
                    const savedUser: UserDoc = JSON.parse(json);
                    setUser(savedUser);
                }
            } catch (e) {
                console.error('Failed to load user from storage', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Hàm gọi khi login thành công
    const signIn = async (userData: UserDoc) => {
        try {
            // Lưu vào AsyncStorage
            // Cập nhật context
            setUser(userData);
        } catch (e) {
            console.error('Failed to save user to storage', e);
        }
    };

    // Hàm gọi khi logout
    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
        } catch (e) {
            console.error('Failed to remove user from storage', e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
