import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
    FileText,
    Plus,
    Stethoscope,
    Syringe,
    FileCheck,
    FileClock,
    FileImage,
    FilePen,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import { usePetStore } from '@/store/pet-store';

export default function MedicalRecordsScreen() {
    const router = useRouter();
    const { getActivePet, getPetHealthRecords, getPetVaccinations, getPetMedicalDocuments } =
        usePetStore();

    const activePet = getActivePet();
    const healthRecords = activePet ? getPetHealthRecords(activePet.id) : [];
    const vaccinations = activePet ? getPetVaccinations(activePet.id) : [];
    const medicalDocuments = activePet ? getPetMedicalDocuments(activePet.id) : [];

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Get document icon based on type
    const getDocumentIcon = (type: string) => {
        switch (type) {
            case 'lab_result':
                return <FileText size={20} color={Colors.primary} />;
            case 'prescription':
                return <FilePen size={20} color={Colors.primary} />;
            case 'xray':
                return <FileImage size={20} color={Colors.primary} />;
            case 'certificate':
                return <FileCheck size={20} color={Colors.primary} />;
            default:
                return <FileClock size={20} color={Colors.primary} />;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Hồ sơ y tế',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                <PetSelector />

                {activePet ? (
                    <View style={styles.content}>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <Stethoscope size={20} color={Colors.primary} />
                                    <Text style={styles.sectionTitle}>Bản ghi sức khỏe</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => router.push('/main/health/add-health-record')}
                                >
                                    <Plus size={16} color={Colors.card} />
                                </TouchableOpacity>
                            </View>

                            {healthRecords.length > 0 ? (
                                healthRecords
                                    .sort(
                                        (a, b) =>
                                            new Date(b.date).getTime() - new Date(a.date).getTime()
                                    )
                                    .slice(0, 3)
                                    .map((record) => (
                                        <TouchableOpacity
                                            key={record.id}
                                            style={styles.recordItem}
                                            onPress={() =>
                                                router.push({
                                                    pathname: '/main/health/health-record-details',
                                                    params: { id: record.id },
                                                })
                                            }
                                        >
                                            <View style={styles.recordIconContainer}>
                                                {record.vetVisit ? (
                                                    <Stethoscope size={20} color={Colors.primary} />
                                                ) : (
                                                    <FileText size={20} color={Colors.primary} />
                                                )}
                                            </View>
                                            <View style={styles.recordContent}>
                                                <Text style={styles.recordDate}>
                                                    {formatDate(record.date)}
                                                </Text>
                                                <Text style={styles.recordWeight}>
                                                    Cân nặng: {record.weight} kg
                                                </Text>
                                                {record.diagnosis && (
                                                    <Text
                                                        style={styles.recordDiagnosis}
                                                        numberOfLines={1}
                                                    >
                                                        {record.diagnosis}
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))
                            ) : (
                                <Text style={styles.emptyText}>
                                    Chưa có bản ghi sức khỏe. Hãy thêm mới.
                                </Text>
                            )}

                            {healthRecords.length > 3 && (
                                <TouchableOpacity
                                    style={styles.viewAllButton}
                                    onPress={() => router.push('/main/health/health')}
                                >
                                    <Text style={styles.viewAllText}>Xem tất cả</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <Syringe size={20} color={Colors.primary} />
                                    <Text style={styles.sectionTitle}>Lịch tiêm phòng</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => router.push('/main/vaccination/add-vaccination')}
                                >
                                    <Plus size={16} color={Colors.card} />
                                </TouchableOpacity>
                            </View>

                            {vaccinations.length > 0 ? (
                                vaccinations
                                    .sort(
                                        (a, b) =>
                                            new Date(b.date).getTime() - new Date(a.date).getTime()
                                    )
                                    .slice(0, 3)
                                    .map((vaccination) => (
                                        <TouchableOpacity
                                            key={vaccination.id}
                                            style={styles.recordItem}
                                            onPress={() =>
                                                router.push({
                                                    pathname: './vaccination-details',
                                                    params: { id: vaccination.id },
                                                })
                                            }
                                        >
                                            <View style={styles.recordIconContainer}>
                                                <Syringe size={20} color={Colors.primary} />
                                            </View>
                                            <View style={styles.recordContent}>
                                                <Text style={styles.recordName}>
                                                    {vaccination.name}
                                                </Text>
                                                <Text style={styles.recordDate}>
                                                    Ngày tiêm: {formatDate(vaccination.date)}
                                                </Text>
                                                <Text style={styles.recordNextDate}>
                                                    Tiêm tiếp theo:{' '}
                                                    {formatDate(vaccination.nextDueDate)}
                                                </Text>
                                            </View>
                                            {vaccination.completed && (
                                                <View style={styles.completedBadge}>
                                                    <FileCheck size={16} color={Colors.success} />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    ))
                            ) : (
                                <Text style={styles.emptyText}>
                                    Chưa có lịch tiêm phòng. Hãy thêm mới.
                                </Text>
                            )}

                            {vaccinations.length > 3 && (
                                <TouchableOpacity
                                    style={styles.viewAllButton}
                                    onPress={() => router.push('/main/vaccination/add-vaccination')}
                                >
                                    <Text style={styles.viewAllText}>Xem tất cả</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <FileText size={20} color={Colors.primary} />
                                    <Text style={styles.sectionTitle}>Tài liệu y tế</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => router.push('./add-medical-document')}
                                >
                                    <Plus size={16} color={Colors.card} />
                                </TouchableOpacity>
                            </View>

                            {medicalDocuments.length > 0 ? (
                                <View style={styles.documentList}>
                                    {medicalDocuments
                                        .sort(
                                            (a, b) =>
                                                new Date(b.date).getTime() -
                                                new Date(a.date).getTime()
                                        )
                                        .slice(0, 3)
                                        .map((document) => (
                                            <TouchableOpacity
                                                key={document.id}
                                                style={styles.documentItem}
                                                onPress={() =>
                                                    router.push({
                                                        pathname: './medical-document-details',
                                                        params: { id: document.id },
                                                    })
                                                }
                                            >
                                                <View style={styles.documentIconContainer}>
                                                    {getDocumentIcon(document.type)}
                                                </View>
                                                <View style={styles.documentContent}>
                                                    <Text style={styles.documentName}>
                                                        {document.title}
                                                    </Text>
                                                    <Text style={styles.documentDate}>
                                                        {formatDate(document.date)}
                                                    </Text>
                                                </View>
                                                {document.imageUrl && (
                                                    <View style={styles.documentImageContainer}>
                                                        <Image
                                                            source={{ uri: document.imageUrl }}
                                                            style={styles.documentThumbnail}
                                                            resizeMode="cover"
                                                        />
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            ) : (
                                <Text style={styles.emptyText}>
                                    Chưa có tài liệu y tế. Hãy thêm mới.
                                </Text>
                            )}

                            {medicalDocuments.length > 3 && (
                                <TouchableOpacity
                                    style={styles.viewAllButton}
                                    onPress={() => router.push('./medical-documents')}
                                >
                                    <Text style={styles.viewAllText}>Xem tất cả</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            Vui lòng chọn thú cưng để xem hồ sơ y tế
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
    section: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginLeft: 8,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    recordIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    recordContent: {
        flex: 1,
    },
    recordDate: {
        fontSize: 12,
        color: Colors.textLight,
    },
    recordWeight: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    recordDiagnosis: {
        fontSize: 12,
        color: Colors.textLight,
        marginTop: 2,
    },
    recordName: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    recordNextDate: {
        fontSize: 12,
        color: Colors.textLight,
    },
    completedBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.success + '20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewAllButton: {
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 8,
    },
    viewAllText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
    },
    documentList: {
        gap: 12,
    },
    documentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
        padding: 12,
    },
    documentIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    documentContent: {
        flex: 1,
    },
    documentName: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    documentDate: {
        fontSize: 12,
        color: Colors.textLight,
        marginTop: 2,
    },
    documentImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 4,
        overflow: 'hidden',
        marginLeft: 8,
    },
    documentThumbnail: {
        width: '100%',
        height: '100%',
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
        paddingVertical: 16,
    },
});
