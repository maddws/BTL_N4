import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import VaccinationItem from '@/components/VaccinationItem';
import { usePetStore } from '@/store/pet-store';

export default function VaccinationsScreen() {
    const router = useRouter();
    const { getActivePet, getPetVaccinations } = usePetStore();

    const activePet = getActivePet();
    const vaccinations = activePet ? getPetVaccinations(activePet.id) : [];

    // Sort vaccinations: overdue first, then upcoming, then completed
    const sortedVaccinations = [...vaccinations].sort((a, b) => {
        const aDate = new Date(a.nextDueDate);
        const bDate = new Date(b.nextDueDate);
        const today = new Date();

        const aOverdue = aDate < today && !a.completed;
        const bOverdue = bDate < today && !b.completed;

        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;

        if (!a.completed && b.completed) return -1;
        if (a.completed && !b.completed) return 1;

        return aDate.getTime() - bDate.getTime();
    });

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Lịch tiêm phòng',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                <PetSelector />

                {activePet ? (
                    <View style={styles.content}>
                        <View style={styles.vaccinationsContainer}>
                            <View style={styles.vaccinationsHeader}>
                                <Text style={styles.vaccinationsTitle}>Lịch tiêm phòng</Text>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => router.push('./add-vaccination')}
                                >
                                    <Plus size={16} color={Colors.card} />
                                </TouchableOpacity>
                            </View>

                            {sortedVaccinations.length > 0 ? (
                                sortedVaccinations.map((vaccination) => (
                                    <TouchableOpacity
                                        key={vaccination.id}
                                        onPress={() =>
                                            router.push({
                                                pathname: './vaccination-details',
                                                params: { id: vaccination.id },
                                            })
                                        }
                                    >
                                        <VaccinationItem vaccination={vaccination} />
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>
                                    Chưa có lịch tiêm phòng. Hãy thêm mới.
                                </Text>
                            )}
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoTitle}>Thông tin về tiêm phòng</Text>
                            <Text style={styles.infoText}>
                                Tiêm phòng là một phần quan trọng trong việc chăm sóc thú cưng. Nó
                                giúp bảo vệ thú cưng của bạn khỏi nhiều bệnh nguy hiểm và đảm bảo
                                sức khỏe lâu dài.
                            </Text>
                            <Text style={styles.infoSubtitle}>
                                Các loại vắc-xin phổ biến cho chó:
                            </Text>
                            <Text style={styles.infoListItem}>• Vắc-xin phòng bệnh dại</Text>
                            <Text style={styles.infoListItem}>• Vắc-xin 5 in 1 (DHPP)</Text>
                            <Text style={styles.infoListItem}>• Vắc-xin phòng bệnh Care</Text>

                            <Text style={styles.infoSubtitle}>
                                Các loại vắc-xin phổ biến cho mèo:
                            </Text>
                            <Text style={styles.infoListItem}>• Vắc-xin phòng bệnh dại</Text>
                            <Text style={styles.infoListItem}>• Vắc-xin 3 in 1 (FPV)</Text>
                            <Text style={styles.infoListItem}>
                                • Vắc-xin phòng bệnh giảm bạch cầu (FeLV)
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            Vui lòng chọn thú cưng để xem lịch tiêm phòng
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 16,
    },
    vaccinationsContainer: {
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
    vaccinationsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    vaccinationsTitle: {
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
    infoContainer: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
        marginBottom: 12,
    },
    infoSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
        marginTop: 12,
        marginBottom: 8,
    },
    infoListItem: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
        marginLeft: 8,
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
