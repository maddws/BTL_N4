import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import { usePetStore } from '@/store/pet-store';
import AppointmentItem from '@/components/AppointmentItem'; // đảm bảo bạn có component này
import { getAppointmentsByPetId , deleteAppointmentById } from '@/store/appointment';
import type { Appointment } from '@/store/appointment';
import { Alert } from 'react-native';

export default function AppointmentsScreen() {
    const router = useRouter();
    const { getActivePet } = usePetStore();
    const activePet = getActivePet();
    const handleCancelAppointment = async (id: string) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn hủy lịch hẹn này?', [
          {
            text: 'Hủy bỏ',
            style: 'cancel',
          },
          {
            text: 'Hủy lịch hẹn',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteAppointmentById(id); // Xóa từ Firestore
                setAppointments((prev) => prev.filter((appt) => appt.id !== id)); // Cập nhật UI
              } catch (error) {
                console.error('Lỗi khi hủy lịch hẹn:', error);
                Alert.alert('Lỗi', 'Không thể hủy lịch hẹn. Vui lòng thử lại sau.');
              }
            },
          },
        ]);
      };

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

    const sortedAppointments = [...appointments].sort((a, b) =>
        new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
    );

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Lịch hẹn bác sĩ',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                <PetSelector />

                {activePet ? (
                    <View style={styles.content}>
                        <View style={styles.appointmentsContainer}>
                            <View style={styles.appointmentsHeader}>
                                <Text style={styles.appointmentsTitle}>Lịch hẹn</Text>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => router.push('./veterinary_contact')}
                                >
                                    <Plus size={16} color={Colors.card} />
                                </TouchableOpacity>
                            </View>
                            

                        {sortedAppointments.length > 0 ? (
                            sortedAppointments.map((appointment) => (
                                <View key={appointment.id} style={styles.appointmentWrapper}>
                                <AppointmentItem appointment={appointment} />

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => handleCancelAppointment(appointment.id)}
                                >
                                    <Text style={styles.cancelButtonText}>Hủy</Text>
                                </TouchableOpacity>
                                </View>
                            ))
                            ) : (
                            <Text style={styles.emptyText}>Chưa có lịch hẹn. Hãy thêm mới.</Text>
                        )}
                        </View>
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            Vui lòng chọn thú cưng để xem lịch hẹn
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    appointmentWrapper: {
        marginBottom: 16,
      },
      
      cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignSelf: 'flex-end',
        borderRadius: 8,
        marginTop: 8,
      },
      
      cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 16,
    },
    appointmentsContainer: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 16,
    },
    appointmentsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    appointmentsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textLight,
        textAlign: 'center',
    },
});