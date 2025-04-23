import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Edit2, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';

export default function HealthRecordDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { healthRecords, pets, deleteHealthRecord } = usePetStore();

    const record = healthRecords.find((r) => r.id === id);
    const pet = record ? pets.find((p) => p.id === record.petId) : undefined;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const handleEdit = () => {
        router.push({
            pathname: '/edit-health-record',
            params: { id: record?.id },
        });
    };

    const handleDelete = () => {
        Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa bản ghi này không?', [
            {
                text: 'Hủy',
                style: 'cancel',
            },
            {
                text: 'Xóa',
                onPress: () => {
                    if (record) {
                        deleteHealthRecord(record.id);
                        router.back();
                    }
                },
                style: 'destructive',
            },
        ]);
    };

    if (!record || !pet) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Chi tiết bản ghi',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: Colors.background },
                    }}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không tìm thấy bản ghi</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Chi tiết bản ghi',
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
                    <Text style={styles.date}>{formatDate(record.date)}</Text>
                    <Text style={styles.petName}>{pet.name}</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Cân nặng:</Text>
                        <Text style={styles.infoValue}>{record.weight} kg</Text>
                    </View>

                    {record.vetVisit && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Bác sĩ thú y:</Text>
                            <Text style={styles.infoValue}>{record.vetName}</Text>
                        </View>
                    )}

                    {record.symptoms && (
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Triệu chứng</Text>
                            <Text style={styles.sectionContent}>{record.symptoms}</Text>
                        </View>
                    )}

                    {record.diagnosis && (
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Chẩn đoán</Text>
                            <Text style={styles.sectionContent}>{record.diagnosis}</Text>
                        </View>
                    )}

                    {record.treatment && (
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Điều trị</Text>
                            <Text style={styles.sectionContent}>{record.treatment}</Text>
                        </View>
                    )}

                    {record.notes && (
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Ghi chú</Text>
                            <Text style={styles.sectionContent}>{record.notes}</Text>
                        </View>
                    )}
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
    date: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.card,
        marginBottom: 4,
    },
    petName: {
        fontSize: 16,
        color: Colors.card,
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
