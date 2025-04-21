import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Edit2, Trash2, Clock, Calendar, RefreshCw, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';

export default function ReminderDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { reminders, pets, updateReminder, deleteReminder, completeReminder } = usePetStore();

    const reminder = reminders.find((r) => r.id === id);
    const pet = reminder ? pets.find((p) => p.id === reminder.petId) : undefined;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const getRepeatText = (repeat: string) => {
        switch (repeat) {
            case 'daily':
                return 'Hàng ngày';
            case 'weekly':
                return 'Hàng tuần';
            case 'monthly':
                return 'Hàng tháng';
            default:
                return 'Không lặp lại';
        }
    };

    const getTypeText = (type: string) => {
        switch (type) {
            case 'feeding':
                return 'Cho ăn';
            case 'medication':
                return 'Thuốc';
            case 'grooming':
                return 'Vệ sinh';
            case 'exercise':
                return 'Tập thể dục';
            case 'vet':
                return 'Khám bác sĩ';
            default:
                return 'Khác';
        }
    };

    const handleEdit = () => {
        router.push({
            pathname: '/edit-reminder',
            params: { id: reminder?.id },
        });
    };

    const handleDelete = () => {
        Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa nhắc nhở này không?', [
            {
                text: 'Hủy',
                style: 'cancel',
            },
            {
                text: 'Xóa',
                onPress: () => {
                    if (reminder) {
                        deleteReminder(reminder.id);
                        router.back();
                    }
                },
                style: 'destructive',
            },
        ]);
    };

    const handleToggleComplete = () => {
        if (reminder) {
            completeReminder(reminder.id);
        }
    };

    if (!reminder || !pet) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Chi tiết nhắc nhở',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: Colors.background },
                    }}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không tìm thấy nhắc nhở</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Chi tiết nhắc nhở',
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
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <Text style={styles.petName}>{pet.name}</Text>

                    <View
                        style={[
                            styles.statusBadge,
                            reminder.completed ? styles.completedBadge : styles.pendingBadge,
                        ]}
                    >
                        <Text style={styles.statusText}>
                            {reminder.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                        </Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <View style={styles.infoIcon}>
                                <Calendar size={20} color={Colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Ngày</Text>
                                <Text style={styles.infoValue}>{formatDate(reminder.date)}</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <View style={styles.infoIcon}>
                                <Clock size={20} color={Colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Giờ</Text>
                                <Text style={styles.infoValue}>{reminder.time}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <View style={styles.infoIcon}>
                                <RefreshCw size={20} color={Colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Lặp lại</Text>
                                <Text style={styles.infoValue}>
                                    {getRepeatText(reminder.repeat)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <View style={styles.infoIcon}>
                                <Text style={styles.typeIcon}>
                                    {reminder.type === 'feeding'
                                        ? '🍽️'
                                        : reminder.type === 'medication'
                                          ? '💊'
                                          : reminder.type === 'grooming'
                                            ? '✂️'
                                            : reminder.type === 'exercise'
                                              ? '🏃'
                                              : reminder.type === 'vet'
                                                ? '🏥'
                                                : '📝'}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Loại</Text>
                                <Text style={styles.infoValue}>{getTypeText(reminder.type)}</Text>
                            </View>
                        </View>
                    </View>

                    {reminder.description && (
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionLabel}>Mô tả</Text>
                            <Text style={styles.descriptionText}>{reminder.description}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.completeButton,
                            reminder.completed && styles.incompleteButton,
                        ]}
                        onPress={handleToggleComplete}
                    >
                        <Check size={20} color={Colors.card} />
                        <Text style={styles.completeButtonText}>
                            {reminder.completed
                                ? 'Đánh dấu chưa hoàn thành'
                                : 'Đánh dấu hoàn thành'}
                        </Text>
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
    reminderTitle: {
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
    },
    completedBadge: {
        backgroundColor: Colors.success,
    },
    pendingBadge: {
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
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    typeIcon: {
        fontSize: 20,
    },
    infoLabel: {
        fontSize: 12,
        color: Colors.textLight,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    descriptionContainer: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 16,
        marginBottom: 16,
    },
    descriptionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    descriptionText: {
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
