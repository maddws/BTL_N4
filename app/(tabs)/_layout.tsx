import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Home, BarChart2, Users, ShoppingBag, Settings } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settings-store';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
    const language = useSettingsStore((state) => state.language);
    const { i18n, t } = useTranslation();

    useEffect(() => {
        const changeLang = async () => {
            try {
                await i18n.changeLanguage(language);
                console.log('Language changed:', language);
            } catch (err) {
                console.error('Error while changing language:', err);
            }
        };
        if (language) {
            changeLang();
        }
    }, [language, i18n]);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textLight,
                tabBarStyle: {
                    borderTopColor: Colors.border,
                },
                headerShown: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tab.home'),
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="statistics"
                options={{
                    title: t('tab.statistics'),
                    tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: t('tab.community'),
                    tabBarIcon: ({ color }) => <Users size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="shop"
                options={{
                    title: t('tab.shop'),
                    tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: t('tab.settings'),
                    tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
