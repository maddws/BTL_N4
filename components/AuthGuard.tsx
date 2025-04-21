// src/components/AuthGuard.tsx
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments(); // ví dụ: ['(auth)', 'login'] hoặc ['main', 'home']

    useEffect(() => {
        if (loading) return; // Đợi kiểm tra xong

        // Nhóm màn hình không yêu cầu đăng nhập đặt trong folder (auth)
        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            router.replace('/(auth)/login'); // Chưa login ⇒ ép về /login
        } else if (user && inAuthGroup) {
            router.replace('/'); // Đã login mà vào auth ⇒ về Home
        }
    }, [user, loading, segments]);

    return <>{children}</>;
}
