import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
    FileText,
    Plus,
    Search,
    Filter,
    FilePen,
    FileImage,
    FileCheck,
    FileClock,
    X,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import { usePetStore } from '@/store/pet-store';
import { MedicalDocument } from '@/types/pet';
import { TextInput } from 'react-native-gesture-handler';

type DocumentFilter = 'all' | 'lab_result' | 'prescription' | 'xray' | 'certificate' | 'other';

export default function MedicalDocumentsScreen() {
    const router = useRouter();
    const { getActivePet, getPetMedicalDocuments } = usePetStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<DocumentFilter>('all');

    const activePet = getActivePet();
    const allDocuments = activePet ? getPetMedicalDocuments(activePet.id) : [];

    // Filter documents based on search query and type filter
    const filteredDocuments = allDocuments
        .filter(
            (doc) =>
                doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (doc.description &&
                    doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (doc.vetName && doc.vetName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (doc.clinicName && doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .filter((doc) => activeFilter === 'all' || doc.type === activeFilter)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

    // Render document item
    const renderDocumentItem = ({ item }: { item: MedicalDocument }) => (
        <TouchableOpacity
            style={styles.documentItem}
            onPress={() =>
                router.push({
                    pathname: '/medical-document-details',
                    params: { id: item.id },
                })
            }
        >
            <View style={styles.documentHeader}>
                <View style={styles.documentIconContainer}>{getDocumentIcon(item.type)}</View>
                <View style={styles.documentHeaderContent}>
                    <Text style={styles.documentName}>{item.title}</Text>
                    <Text style={styles.documentDate}>{formatDate(item.date)}</Text>
                </View>
                <View style={styles.documentTypeTag}>
                    <Text style={styles.documentTypeText}>{getDocumentTypeName(item.type)}</Text>
                </View>
            </View>

            {item.description && (
                <Text style={styles.documentDescription} numberOfLines={2}>
                    {item.description}
                </Text>
            )}

            {item.imageUrl && (
                <View style={styles.documentImageContainer}>
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.documentImage}
                        resizeMode="cover"
                    />
                </View>
            )}

            <View style={styles.documentFooter}>
                {item.vetName && (
                    <Text style={styles.documentFooterText}>Bác sĩ: {item.vetName}</Text>
                )}
                {item.clinicName && (
                    <Text style={styles.documentFooterText}>Phòng khám: {item.clinicName}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Tài liệu y tế',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                    headerRight: () => (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push('/add-medical-document')}
                        >
                            <Plus size={20} color={Colors.primary} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <PetSelector />

            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm tài liệu..."
                        placeholderTextColor={Colors.textLight}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={18} color={Colors.textLight} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScrollContent}
                >
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === 'all' && styles.activeFilterButton,
                        ]}
                        onPress={() => setActiveFilter('all')}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                activeFilter === 'all' && styles.activeFilterButtonText,
                            ]}
                        >
                            Tất cả
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === 'lab_result' && styles.activeFilterButton,
                        ]}
                        onPress={() => setActiveFilter('lab_result')}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                activeFilter === 'lab_result' && styles.activeFilterButtonText,
                            ]}
                        >
                            Xét nghiệm
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === 'prescription' && styles.activeFilterButton,
                        ]}
                        onPress={() => setActiveFilter('prescription')}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                activeFilter === 'prescription' && styles.activeFilterButtonText,
                            ]}
                        >
                            Đơn thuốc
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === 'xray' && styles.activeFilterButton,
                        ]}
                        onPress={() => setActiveFilter('xray')}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                activeFilter === 'xray' && styles.activeFilterButtonText,
                            ]}
                        >
                            X-quang
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === 'certificate' && styles.activeFilterButton,
                        ]}
                        onPress={() => setActiveFilter('certificate')}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                activeFilter === 'certificate' && styles.activeFilterButtonText,
                            ]}
                        >
                            Chứng nhận
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === 'other' && styles.activeFilterButton,
                        ]}
                        onPress={() => setActiveFilter('other')}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                activeFilter === 'other' && styles.activeFilterButtonText,
                            ]}
                        >
                            Khác
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {activePet ? (
                <FlatList
                    data={filteredDocuments}
                    renderItem={renderDocumentItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {searchQuery.length > 0 || activeFilter !== 'all'
                                    ? 'Không tìm thấy tài liệu nào phù hợp'
                                    : 'Chưa có tài liệu y tế nào. Hãy thêm mới.'}
                            </Text>
                            {searchQuery.length === 0 && activeFilter === 'all' && (
                                <TouchableOpacity
                                    style={styles.emptyAddButton}
                                    onPress={() => router.push('/add-medical-document')}
                                >
                                    <Text style={styles.emptyAddButtonText}>Thêm tài liệu</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    }
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Vui lòng chọn thú cưng để xem tài liệu y tế
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const ScrollView = require('react-native').ScrollView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    addButton: {
        marginRight: 8,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: Colors.text,
        fontSize: 14,
    },
    filterContainer: {
        paddingVertical: 8,
    },
    filterScrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: Colors.lightGray,
        marginRight: 8,
    },
    activeFilterButton: {
        backgroundColor: Colors.primary,
    },
    filterButtonText: {
        fontSize: 12,
        color: Colors.textLight,
    },
    activeFilterButtonText: {
        color: Colors.card,
        fontWeight: '500',
    },
    listContent: {
        padding: 16,
        gap: 16,
    },
    documentItem: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    documentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    documentIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    documentHeaderContent: {
        flex: 1,
    },
    documentName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    documentDate: {
        fontSize: 12,
        color: Colors.textLight,
        marginTop: 2,
    },
    documentTypeTag: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: Colors.primary + '20',
        borderRadius: 4,
    },
    documentTypeText: {
        fontSize: 10,
        color: Colors.primary,
        fontWeight: '500',
    },
    documentDescription: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 12,
        lineHeight: 20,
    },
    documentImageContainer: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
    },
    documentImage: {
        width: '100%',
        height: '100%',
    },
    documentFooter: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 12,
    },
    documentFooterText: {
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 4,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        height: 300,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textLight,
        textAlign: 'center',
        marginBottom: 16,
    },
    emptyAddButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.primary,
        borderRadius: 8,
    },
    emptyAddButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.card,
    },
});
