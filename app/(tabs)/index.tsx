import React, { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Calendar,
    Activity,
    Syringe,
    Bell,
    MapPin,
    Gamepad,
    Apple,
    Stethoscope,
    FileText,
    HeartPulse,
    ChevronRight,
    Cross,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import HomeCard from '@/components/HomeCard';
import ReminderItem from '@/components/ReminderItem';
import VaccinationItem from '@/components/VaccinationItem';
import { usePetStore } from '@/store/pet-store';
import AppointmentItem from '@/components/AppointmentItem';
import type { UserDoc } from '@/types/pet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAppointmentsByPetId } from '@/store/appointment';
import type { Appointment } from '@/store/appointment';
import { useSettingsStore } from '@/store/settings-store';
import { useTranslation } from 'react-i18next';

import '@/config/i18n'; // <- Phải có dòng này, KHÔNG COMMENT
import { AppRegistry } from 'react-native';
import App from '../(tabs)/index'; // Đường dẫn đến file chính của bạn

AppRegistry.registerComponent('main', () => App);

export default function HomeScreen() {
    // const user = db.collection('Users').get().then(snapshot => {
    //     snapshot.forEach(doc => {
    //         console.log(doc.id, '=>', doc.data());
    //     });
    // });
    const language = useSettingsStore((state) => state.language);
    const { i18n, t } = useTranslation();

    console.log('i18n resources:', i18n.getDataByLanguage('vi')?.translation);
    console.log('t(tab.home)=', i18n.t('tab.home'));

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
    const router = useRouter();
    const { getActivePet, fetchUserPets, getUpcomingReminders, getUpcomingVaccinations } =
        usePetStore();

    const activePet = getActivePet();

    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        if (!activePet) return;

        const fetchAppointments = async () => {
            try {
                const data = await getAppointmentsByPetId(activePet.id);
                setAppointments(data);
            } catch (error) {
                console.error('Lỗi tải lịch hẹn:', error);
            }
        };

        fetchAppointments();
    }, [activePet]);

    const upcomingReminders = getUpcomingReminders(7);
    const upcomingVaccinations = getUpcomingVaccinations(30);

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>{t('greeting')}</Text>
                    <Text style={styles.subGreeting}>
                        {activePet
                            ? `${t('greeting.sub', { name: activePet.name })}`
                            : t('greeting.no_pet')}
                    </Text>
                </View>

                <PetSelector />

                <View style={styles.content}>
                    {/* Main Features */}
                    <HomeCard
                        title={t('card.health.title')}
                        icon={<HeartPulse size={20} color={Colors.primary} />}
                        description={t('card.health.description')}
                        onPress={() => router.push('/main/health/health')}
                    />
                    <HomeCard
                        title={t('card.activity.title')}
                        icon={<Activity size={20} color={Colors.primary} />}
                        description={t('card.activity.description')}
                        onPress={() => router.push('/main/activity/activity')}
                    />

                    <HomeCard
                        title={t('card.vaccination.title')}
                        icon={<Syringe size={20} color={Colors.primary} />}
                        description={t('card.vaccination.description')}
                        onPress={() => router.push('/main/vaccination/vaccinations')}
                    >
                        {upcomingVaccinations.length > 0 ? (
                            <>
                                {upcomingVaccinations.slice(0, 2).map((vaccination) => (
                                    <VaccinationItem
                                        key={vaccination.id}
                                        vaccination={vaccination}
                                    />
                                ))}
                                {upcomingVaccinations.length > 2 && (
                                    <TouchableOpacity
                                        style={styles.viewMoreButton}
                                        onPress={() =>
                                            router.push('/main/vaccination/vaccinations')
                                        }
                                    >
                                        <Text style={styles.viewMoreText}>
                                            {t('card.vaccination.view_more')}
                                        </Text>
                                        <ChevronRight size={16} color={Colors.primary} />
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : (
                            <Text style={styles.emptyText}>
                                {t('card.vaccination.no_upcoming')}
                            </Text>
                        )}
                    </HomeCard>
                    <HomeCard
                        title={t('card.veterinary.title')}
                        icon={<Cross size={20} color={Colors.primary} />}
                        description={t('card.veterinary.description')}
                        onPress={() => router.push('/main/veterinary/veterinary')}
                    >
                        {appointments.length > 0 ? (
                            <>
                                {appointments.slice(0, 2).map((appointment) => (
                                    <AppointmentItem
                                        key={appointment.id}
                                        appointment={appointment}
                                    />
                                ))}
                                {appointments.length > 2 && (
                                    <TouchableOpacity
                                        style={styles.viewMoreButton}
                                        onPress={() => router.push('/main/veterinary/veterinary')}
                                    >
                                        <Text style={styles.viewMoreText}>
                                            {t('card.veterinary.view_more')}
                                        </Text>
                                        <ChevronRight size={16} color={Colors.primary} />
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : (
                            <Text style={styles.emptyText}>{t('card.veterinary.no_upcoming')}</Text>
                        )}
                    </HomeCard>
                    <HomeCard
                        title={t('card.reminder.title')}
                        icon={<Bell size={20} color={Colors.primary} />}
                        description={t('card.reminder.description')}
                        onPress={() => router.push('/main/reminder/reminders')}
                    >
                        {upcomingReminders.length > 0 ? (
                            <>
                                {upcomingReminders.slice(0, 2).map((reminder) => (
                                    <ReminderItem key={reminder.id} reminder={reminder} />
                                ))}
                                {upcomingReminders.length > 2 && (
                                    <TouchableOpacity
                                        style={styles.viewMoreButton}
                                        onPress={() => router.push('/main/reminder/reminders')}
                                    >
                                        <Text style={styles.viewMoreText}>
                                            {t('card.reminder.view_more')}
                                        </Text>
                                        <ChevronRight size={16} color={Colors.primary} />
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : (
                            <Text style={styles.emptyText}>{t('card.reminder.no_upcoming')}</Text>
                        )}
                    </HomeCard>

                    <HomeCard
                        title={t('card.location.title')}
                        icon={<MapPin size={20} color={Colors.primary} />}
                        description={t('card.location.description')}
                        onPress={() => router.push('/main/location/location')}
                    />

                    <HomeCard
                        title={t('card.interactive.title')}
                        icon={<Gamepad size={20} color={Colors.primary} />}
                        description={t('card.interactive.description')}
                        onPress={() => router.push('/main/interactive/music-player')}
                    />

                    {/* Additional Features */}
                    <Text style={styles.sectionTitle}>{t('section.additional.title')}</Text>

                    <View style={styles.additionalFeatures}>
                        <TouchableOpacity
                            style={styles.additionalFeatureItem}
                            onPress={() => router.push('/main/nutrition/nutrition')}
                        >
                            <View style={styles.additionalFeatureIcon}>
                                <Apple size={20} color={Colors.primary} />
                            </View>
                            <Text style={styles.additionalFeatureText}>
                                {t('additional.nutrition')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.additionalFeatureItem}
                            onPress={() => router.push('/main/disease/diseases')}
                        >
                            <View style={styles.additionalFeatureIcon}>
                                <Stethoscope size={20} color={Colors.primary} />
                            </View>
                            <Text style={styles.additionalFeatureText}>
                                {t('additional.disease')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.additionalFeatureItem}
                            onPress={() => router.push('/main/medical-documents/medical-records')}
                        >
                            <View style={styles.additionalFeatureIcon}>
                                <FileText size={20} color={Colors.primary} />
                            </View>
                            <Text style={styles.additionalFeatureText}>
                                {t('additional.medical_records')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.additionalFeatureItem}
                            onPress={() => router.push('/main/veterinary/veterinary_contact')}
                        >
                            <View style={styles.additionalFeatureIcon}>
                                <Cross size={24} color={Colors.primary} />
                            </View>
                            <Text style={styles.additionalFeatureText}>
                                {t('card.veterinary_contact.title')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    subGreeting: {
        fontSize: 16,
        color: Colors.textLight,
        marginTop: 4,
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginTop: 24,
        marginBottom: 16,
    },
    additionalFeatures: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    additionalFeatureItem: {
        alignItems: 'center',
        width: '30%',
    },
    additionalFeatureIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    additionalFeatureText: {
        fontSize: 14,
        color: Colors.text,
        textAlign: 'center',
    },
    viewMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginTop: 4,
    },
    viewMoreText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
        marginRight: 4,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textLight,
        textAlign: 'center',
        paddingVertical: 16,
    },
});
