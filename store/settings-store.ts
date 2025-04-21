import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'vi' | 'en';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
}

export interface NotificationSettings {
    reminders: boolean;
    vaccinations: boolean;
    community: boolean;
    promotions: boolean;
}

interface SettingsState {
    language: Language;
    darkMode: boolean;
    notifications: NotificationSettings;
    userProfile: UserProfile | null;
    isLoggedIn: boolean;

    // Actions
    setLanguage: (language: Language) => void;
    toggleDarkMode: () => void;
    toggleNotifications: () => void;
    updateNotificationSetting: (key: keyof NotificationSettings, value: boolean) => void;
    login: (profile: UserProfile) => void;
    logout: () => void;
    updateUserProfile: (profile: Partial<UserProfile>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            language: 'vi',
            darkMode: false,
            notifications: {
                reminders: true,
                vaccinations: true,
                community: true,
                promotions: false,
            },
            userProfile: null,
            isLoggedIn: false,

            setLanguage: (language) => set({ language }),

            toggleDarkMode: () =>
                set((state) => ({
                    darkMode: !state.darkMode,
                })),

            toggleNotifications: () =>
                set((state) => {
                    const allEnabled = Object.values(state.notifications).every((value) => value);
                    const newValue = !allEnabled;

                    return {
                        notifications: {
                            reminders: newValue,
                            vaccinations: newValue,
                            community: newValue,
                            promotions: newValue,
                        },
                    };
                }),

            updateNotificationSetting: (key, value) =>
                set((state) => ({
                    notifications: {
                        ...state.notifications,
                        [key]: value,
                    },
                })),

            login: (profile) =>
                set({
                    userProfile: profile,
                    isLoggedIn: true,
                }),

            logout: () =>
                set({
                    userProfile: null,
                    isLoggedIn: false,
                }),

            updateUserProfile: (profile) =>
                set((state) => ({
                    userProfile: state.userProfile ? { ...state.userProfile, ...profile } : null,
                })),
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
