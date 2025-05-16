import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Edit2, Trash2, Check, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';

export default function VaccinationDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { vaccinations, pets, updateVaccination, deleteVaccination } = usePetStore();

    const vaccination = vaccinations.find((v) => v.id === id);
    const pet = vaccination ? pets.find((p) => p.id === vaccination.petId) : undefined;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Calculate days until next vaccination
    const daysUntil = () => {
        if (!vaccination) return 0;

        const today = new Date();
        const nextDate = new Date(vaccination.nextDueDate);
        const diffTime = nextDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleEdit = () => {
        router.push({
            pathname: './edit-vaccination',
            params: { id: vaccination?.id },
        });
    };

    const handleDelete = () => {
        Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa lịch tiêm phòng này không?', [
            {
                text: 'Hủy',
                style: 'cancel',
            },
            {
                text: 'Xóa',
                onPress: () => {
                    if (vaccination) {
                        deleteVaccination(vaccination.id);
                        router.back();
                    }
                },
                style: 'destructive',
            },
        ]);
    };

    const handleToggleComplete = () => {
        if (vaccination) {
            updateVaccination(vaccination.id, {
                completed: !vaccination.completed,
            });
        }
    };

    if (!vaccination || !pet) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Chi tiết tiêm phòng',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: Colors.background },
                    }}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không tìm thấy lịch tiêm phòng</Text>
                </View>
            </SafeAreaView>
        );
    }

    const days = daysUntil();
    const isOverdue = days < 0;
    const isUpcoming = days >= 0 && days <= 7;

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Chi tiết tiêm phòng',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                    headerRight: () => (
                        <View style={styles.headerButtons}>
                            <TouchableOpacity style={styles.headerButton} onPress={handleEdit}>
                                <Edit2 size={20} color={Colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
                                <Trash2 size={20} color={Colors.error} />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.vaccineName}>{vaccination.name}</Text>
                    <Text style={styles.petName}>{pet.name}</Text>

                    <View
                        style={[
                            styles.statusBadge,
                            vaccination.completed
                                ? styles.completedBadge
                                : isOverdue
                                  ? styles.overdueBadge
                                  : isUpcoming
                                    ? styles.upcomingBadge
                                    : styles.normalBadge,
                        ]}
                    >
                        <Text style={styles.statusText}>
                            {vaccination.completed
                                ? 'Đã hoàn thành'
                                : isOverdue
                                  ? `Quá hạn ${Math.abs(days)} ngày`
                                  : days === 0
                                    ? 'Hôm nay'
                                    : `${days} ngày nữa`}
                        </Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày tiêm:</Text>
                        <Text style={styles.infoValue}>{formatDate(vaccination.date)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày tiêm tiếp theo:</Text>
                        <Text style={styles.infoValue}>{formatDate(vaccination.nextDueDate)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Bác sĩ thú y:</Text>
                        <Text style={styles.infoValue}>{vaccination.vetName}</Text>
                    </View>

                    {vaccination.notes && (
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Ghi chú</Text>
                            <Text style={styles.sectionContent}>{vaccination.notes}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.completeButton,
                            vaccination.completed && styles.incompleteButton,
                        ]}
                        onPress={handleToggleComplete}
                    >
                        {vaccination.completed ? (
                            <>
                                <X size={20} color={Colors.card} />
                                <Text style={styles.completeButtonText}>
                                    Đánh dấu chưa hoàn thành
                                </Text>
                            </>
                        ) : (
                            <>
                                <Check size={20} color={Colors.card} />
                                <Text style={styles.completeButtonText}>Đánh dấu hoàn thành</Text>
                            </>
                        )}
                    </TouchableOpacity>
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
    scrollContainer: {
        flex: 1,
    },
    headerButtons: {
        flexDirection: 'row',
    },
    headerButton: {
        marginLeft: 16,
    },
    header: {
        backgroundColor: Colors.primary,
        padding: 16,
        alignItems: 'center',
    },
    vaccineName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.card,
        marginBottom: 4,
    },
    petName: {
        fontSize: 16,
        color: Colors.card,
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: Colors.success,
    },
    completedBadge: {
        backgroundColor: Colors.success,
    },
    overdueBadge: {
        backgroundColor: Colors.error,
    },
    upcomingBadge: {
        backgroundColor: Colors.warning,
    },
    normalBadge: {
        backgroundColor: Colors.info,
    },
    statusText: {
        color: Colors.card,
        fontWeight: '500',
        fontSize: 14,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        margin: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    infoLabel: {
        fontSize: 14,
        color: Colors.textLight,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    infoSection: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    sectionContent: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.success,
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 16,
        gap: 8,
    },
    incompleteButton: {
        backgroundColor: Colors.error,
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.card,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center',
    },
});
