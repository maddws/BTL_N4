import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/colors';
import { getAppointmentsByPetId } from '@/store/appointment'; // Lấy dữ liệu từ API
import type { Appointment } from '@/store/appointment';
// Component chi tiết lịch hẹn
export default function AppointmentDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams(); // Lấy ID của lịch hẹn từ URL query parameters
    const [appointment, setAppointment] = useState<Appointment | null>(null);

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try {
                if (id) {
                    const appointments = await getAppointmentsByPetId(id as string);
                    if (appointments.length > 0) {
                        setAppointment(appointments[0]);
                    }
                }
            } catch (error) {
                console.error('Lỗi khi tải chi tiết lịch hẹn:', error);
            }
        };

        fetchAppointmentDetails();
    }, [id]);

    if (!appointment) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.loadingText}>Đang tải...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Chi Tiết Lịch Hẹn</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
                        <Text style={styles.goBackText}>Quay lại</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.label}>Thú cưng:</Text>
                    <Text style={styles.value}>{appointment.petName}</Text>

                    <Text style={styles.label}>Bác sĩ:</Text>
                    <Text style={styles.value}>{appointment.doctor_name}</Text>

                    <Text style={styles.label}>Ngày hẹn:</Text>
                    <Text style={styles.value}>{new Date(appointment.appointmentDate).toLocaleDateString()}</Text>

                    <Text style={styles.label}>Giờ hẹn:</Text>
                    <Text style={styles.value}>{appointment.appointmentTime}</Text>

                    <Text style={styles.label}>Lý do:</Text>
                    <Text style={styles.value}>{appointment.reason}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    goBackButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    goBackText: {
        color: '#ffffff',
        fontSize: 14,
    },
    detailsContainer: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textLight,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    loadingText: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center',
        marginTop: 20,
    },
});