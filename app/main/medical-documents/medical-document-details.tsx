import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Share,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import {
    Edit2,
    Trash2,
    Share2,
    FileText,
    FilePen,
    FileImage,
    FileCheck,
    FileClock,
    Calendar,
    User,
    Building2,
    FileDown,
    Eye,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';

export default function MedicalDocumentDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { medicalDocuments, pets, deleteMedicalDocument } = usePetStore();
    const [imageFullscreen, setImageFullscreen] = useState(false);

    const document = medicalDocuments.find((doc) => doc.id === id);
    const pet = document ? pets.find((p) => p.id === document.petId) : undefined;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Get document type name in Vietnamese
    const getDocumentTypeName = (type: string) => {
        switch (type) {
            case 'lab_result':
                return 'Kết quả xét nghiệm';
            case 'prescription':
                return 'Đơn thuốc';
            case 'xray':
                return 'X-quang';
            case 'certificate':
                return 'Giấy chứng nhận';
            default:
                return 'Khác';
        }
    };

    // Get document icon based on type
    const getDocumentIcon = (type: string) => {
        switch (type) {
            case 'lab_result':
                return <FileText size={24} color={Colors.primary} />;
            case 'prescription':
                return <FilePen size={24} color={Colors.primary} />;
            case 'xray':
                return <FileImage size={24} color={Colors.primary} />;
            case 'certificate':
                return <FileCheck size={24} color={Colors.primary} />;
            default:
                return <FileClock size={24} color={Colors.primary} />;
        }
    };

    const handleEdit = () => {
        router.push({
            pathname: './edit-medical-document',
            params: { id: document?.id },
        });
    };

    const handleDelete = () => {
        Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa tài liệu này không?', [
            {
                text: 'Hủy',
                style: 'cancel',
            },
            {
                text: 'Xóa',
                onPress: () => {
                    if (document) {
                        deleteMedicalDocument(document.id);
                        router.back();
                    }
                },
                style: 'destructive',
            },
        ]);
    };

    const handleShare = async () => {
        if (!document) return;

        try {
            await Share.share({
                message: `Tài liệu y tế: ${document.title}\nNgày: ${formatDate(
                    document.date
                )}\nLoại: ${getDocumentTypeName(document.type)}${
                    document.description ? `\nMô tả: ${document.description}` : ''
                }`,
                title: document.title,
            });
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể chia sẻ tài liệu');
        }
    };

    if (!document || !pet) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Chi tiết tài liệu',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: Colors.background },
                    }}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không tìm thấy tài liệu</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (imageFullscreen && document.imageUrl) {
        return (
            <SafeAreaView style={styles.fullscreenContainer}>
                <Stack.Screen
                    options={{
                        title: document.title,
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: Colors.background },
                    }}
                />
                <TouchableOpacity
                    style={styles.fullscreenImageContainer}
                    onPress={() => setImageFullscreen(false)}
                    activeOpacity={1}
                >
                    <Image
                        source={{ uri: document.imageUrl }}
                        style={styles.fullscreenImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Chi tiết tài liệu',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                    headerRight: () => (
                        <View style={styles.headerButtons}>
                            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                                <Share2 size={20} color={Colors.primary} />
                            </TouchableOpacity>
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
                    <View style={styles.documentTypeContainer}>
                        {getDocumentIcon(document.type)}
                        <Text style={styles.documentType}>
                            {getDocumentTypeName(document.type)}
                        </Text>
                    </View>
                    <Text style={styles.documentTitle}>{document.title}</Text>
                    <Text style={styles.petName}>{pet.name}</Text>
                </View>

                {document.imageUrl && (
                    <View style={styles.imageSection}>
                        <TouchableOpacity
                            style={styles.imageContainer}
                            onPress={() => setImageFullscreen(true)}
                        >
                            <Image
                                source={{ uri: document.imageUrl }}
                                style={styles.documentImage}
                                resizeMode="cover"
                            />
                            <View style={styles.imageOverlay}>
                                <Eye size={24} color={Colors.card} />
                                <Text style={styles.viewFullText}>Xem đầy đủ</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoLabelContainer}>
                            <Calendar size={16} color={Colors.textLight} />
                            <Text style={styles.infoLabel}>Ngày:</Text>
                        </View>
                        <Text style={styles.infoValue}>{formatDate(document.date)}</Text>
                    </View>

                    {document.vetName && (
                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelContainer}>
                                <User size={16} color={Colors.textLight} />
                                <Text style={styles.infoLabel}>Bác sĩ:</Text>
                            </View>
                            <Text style={styles.infoValue}>{document.vetName}</Text>
                        </View>
                    )}

                    {document.clinicName && (
                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelContainer}>
                                <Building2 size={16} color={Colors.textLight} />
                                <Text style={styles.infoLabel}>Phòng khám:</Text>
                            </View>
                            <Text style={styles.infoValue}>{document.clinicName}</Text>
                        </View>
                    )}

                    {document.description && (
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Mô tả</Text>
                            <Text style={styles.sectionContent}>{document.description}</Text>
                        </View>
                    )}

                    {document.notes && (
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Ghi chú</Text>
                            <Text style={styles.sectionContent}>{document.notes}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                        <Share2 size={20} color={Colors.card} />
                        <Text style={styles.actionButtonText}>Chia sẻ</Text>
                    </TouchableOpacity>
{/* 
                    {document.imageUrl && Platform.OS !== 'web' && (
                        <TouchableOpacity style={styles.actionButton}>
                            <FileDown size={20} color={Colors.card} />
                            <Text style={styles.actionButtonText}>Tải xuống</Text>
                        </TouchableOpacity>
                    )} */}
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
    documentTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 12,
    },
    documentType: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.primary,
        marginLeft: 8,
    },
    documentTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.card,
        marginBottom: 4,
        textAlign: 'center',
    },
    petName: {
        fontSize: 16,
        color: Colors.card,
    },
    imageSection: {
        padding: 16,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    documentImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewFullText: {
        color: Colors.card,
        marginLeft: 8,
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
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    infoLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 14,
        color: Colors.textLight,
        marginLeft: 8,
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
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    actionButtonText: {
        color: Colors.card,
        fontWeight: '500',
        marginLeft: 8,
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
    fullscreenContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    fullscreenImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: '100%',
        height: '100%',
    },
});
