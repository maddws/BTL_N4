import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ErrorBoundary } from './main/error/error-boundary';

import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';

export const unstable_settings = { initialRouteName: '(tabs)' };
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({ ...FontAwesome.font });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) SplashScreen.hideAsync();
    }, [loaded]);

    // useEffect(() => {
    // // 1. Yêu cầu quyền (Android 13+ / iOS)
    // async function requestUserPermission() {
    //     const authStatus = await messaging().requestPermission();
    //     const enabled =
    //         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    //     if (enabled) {
    //         console.log('Authorization status:', authStatus);
    //     }
    // }

    // // 2. Lấy FCM token
    // messaging().getToken().then(token => {
    // console.log('FCM Token:', token);
    // // Gửi token này lên server để push sau
    // });

    // // 3. Lắng nghe tin nhắn foreground
    // const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    // console.log('FCM message in foreground:', remoteMessage);
    // // Hiển thị một alert hay custom notification nếu muốn
    // });

    // 4. Xử lý tin nhắn khi app killed / background (headless JS)
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    // console.log('Message handled in the background!', remoteMessage);
    // // Bạn có thể tạo notification ở đây nếu cần
    // });

    // return () => {
    // unsubscribeOnMessage();
    // };
    // }, []);

    if (!loaded) return null;

    return (
        <ErrorBoundary>
            <AuthProvider>
                <AuthGuard>
                    <RootLayoutNav />
                </AuthGuard>
            </AuthProvider>
        </ErrorBoundary>
    );
}

function RootLayoutNav() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            {/* nhóm (auth) sẽ tự có header mặc định */}
        </Stack>
    );
}
