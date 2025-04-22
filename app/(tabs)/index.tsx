import React from 'react';
import { db } from '@/config/firebase';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Activity,
    Syringe,
    Bell,
    MapPin,
    Gamepad,
    Apple,
    Stethoscope,
    FileText,
    ChevronRight,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import HomeCard from '@/components/HomeCard';
import ReminderItem from '@/components/ReminderItem';
import VaccinationItem from '@/components/VaccinationItem';
import { usePetStore } from '@/store/pet-store';

import type { UserDoc } from '@/types/pet';

export default function HomeScreen() {
    // const user = db.collection('Users').get().then(snapshot => {
    //     snapshot.forEach(doc => {
    //         console.log(doc.id, '=>', doc.data());
    //     });
    // });

    const router = useRouter();
    const { getActivePet, getUpcomingReminders, getUpcomingVaccinations } = usePetStore();

    const activePet = getActivePet();
    const upcomingReminders = getUpcomingReminders(7);
    const upcomingVaccinations = getUpcomingVaccinations(30);

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Xin chào!</Text>
                    <Text style={styles.subGreeting}>
                        {activePet
                            ? `Chăm sóc cho ${activePet.name} nào`
                            : 'Hãy thêm thú cưng của bạn'}
                    </Text>
                </View>

                <PetSelector />

                <View style={styles.content}>
                    {/* Main Features */}
                    <HomeCard
                        title="Theo dõi sức khỏe"
                        icon={<Activity size={20} color={Colors.primary} />}
                        description="Ghi lại các chỉ số sức khỏe của thú cưng"
                        onPress={() => router.push('/main/health/health')}
                    />

                    <HomeCard
                        title="Lịch tiêm phòng"
                        icon={<Syringe size={20} color={Colors.primary} />}
                        description="Quản lý lịch tiêm phòng và nhắc nhở"
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
                                        <Text style={styles.viewMoreText}>Xem thêm</Text>
                                        <ChevronRight size={16} color={Colors.primary} />
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : (
                            <Text style={styles.emptyText}>Không có lịch tiêm phòng sắp tới</Text>
                        )}
                    </HomeCard>

                    <HomeCard
                        title="Nhắc nhở chăm sóc"
                        icon={<Bell size={20} color={Colors.primary} />}
                        description="Đặt lịch nhắc cho các hoạt động chăm sóc"
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
                                        <Text style={styles.viewMoreText}>Xem thêm</Text>
                                        <ChevronRight size={16} color={Colors.primary} />
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : (
                            <Text style={styles.emptyText}>Không có nhắc nhở nào sắp tới</Text>
                        )}
                    </HomeCard>

                    <HomeCard
                        title="Theo dõi vị trí"
                        icon={<MapPin size={20} color={Colors.primary} />}
                        description="Theo dõi vị trí thú cưng của bạn"
                        onPress={() => router.push('/main/location/location')}
                    />

                    <HomeCard
                        title="Tương tác"
                        icon={<Gamepad size={20} color={Colors.primary} />}
                        description="Các trò chơi và hoạt động tương tác"
                        onPress={() => router.push('/main/interactive/music-player')}
                    />

                    {/* Additional Features */}
                    <Text style={styles.sectionTitle}>Thông tin hữu ích</Text>

                    <View style={styles.additionalFeatures}>
                        <TouchableOpacity
                            style={styles.additionalFeatureItem}
                            onPress={() => router.push('/main/nutrition/nutrition')}
                        >
                            <View style={styles.additionalFeatureIcon}>
                                <Apple size={20} color={Colors.primary} />
                            </View>
                            <Text style={styles.additionalFeatureText}>Dinh dưỡng</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.additionalFeatureItem}
                            onPress={() => router.push('/main/disease/diseases')}
                        >
                            <View style={styles.additionalFeatureIcon}>
                                <Stethoscope size={20} color={Colors.primary} />
                            </View>
                            <Text style={styles.additionalFeatureText}>Bệnh lý</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.additionalFeatureItem}
                            onPress={() => router.push('/main/medical-documents/medical-records')}
                        >
                            <View style={styles.additionalFeatureIcon}>
                                <FileText size={20} color={Colors.primary} />
                            </View>
                            <Text style={styles.additionalFeatureText}>Hồ sơ y tế</Text>
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
