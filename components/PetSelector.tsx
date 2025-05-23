import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Plus, ChevronDown, Search, X, Pencil } from 'lucide-react-native';
import { db } from '@/config/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { usePetStore } from '@/store/pet-store';

export default function PetSelector() {
    const router = useRouter();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pets = usePetStore((s) => s.pets);
    const activePet = usePetStore((s) => s.getActivePet());
    const setActivePetId = usePetStore((s) => s.setActivePetId);

    // load pets on mount
    useEffect(() => {
        (async () => {
            const userJson = await AsyncStorage.getItem('user');
            if (!userJson) return;
            const { id: userId } = JSON.parse(userJson);
            const upSnap = await getDocs(
                query(collection(db, 'UserPet'), where('user_id', '==', userId))
            );
            const petIds = upSnap.docs.map((d) => d.data().pet_id as string);
            const loaded = await Promise.all(
                petIds.map((pid) =>
                    getDoc(doc(db, 'Pets', pid)).then((d) => ({ id: d.id, ...(d.data() as any) }))
                )
            );
            // initialize store
            const firstId = loaded[0]?.id!;
            setActivePetId(activePet?.id ?? firstId);
            usePetStore.setState({ pets: loaded });
        })();
    }, []);

    // filtered list
    const filtered = searchQuery.length
        ? pets.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : pets;

    const selectPet = (id: string) => {
        setActivePetId(id);
        console.log(id);
        setDropdownVisible(false);
    };

    const goEdit = (id: string) => {
        router.push({ pathname: '/main/pet/edit-pet', params: { petId: id } });
        setDropdownVisible(false);
    };

    const goAdd = () => {
        router.push('/main/pet/add-pet');
        setDropdownVisible(false);
    };

    if (pets.length === 0) {
        return (
            <TouchableOpacity style={styles.emptyContainer} onPress={goAdd}>
                <Plus size={24} color={Colors.primary} />
                <Text style={styles.emptyText}>Thêm thú cưng</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setDropdownVisible(true)}
            >
                {activePet ? (
                    <View style={styles.selectedPet}>
                        <Image source={{ uri: activePet.photo }} style={styles.selectedPetImage} />
                        <View style={styles.selectedPetInfo}>
                            <Text style={styles.selectedPetName}>{activePet.name}</Text>
                            <Text style={styles.selectedPetBreed}>{activePet.breed}</Text>
                        </View>
                        <ChevronDown size={20} color={Colors.textLight} />
                    </View>
                ) : (
                    <Text style={styles.placeholderText}>Chọn thú cưng</Text>
                )}
            </TouchableOpacity>

            <Modal
                visible={dropdownVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setDropdownVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chọn thú cưng</Text>
                            <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                                <X size={24} color={Colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.searchContainer}>
                            <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Tìm kiếm thú cưng..."
                                placeholderTextColor={Colors.textLight}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {!!searchQuery && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <X size={18} color={Colors.textLight} />
                                </TouchableOpacity>
                            )}
                        </View>

                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.itemRow}>
                                    <TouchableOpacity
                                        style={[
                                            styles.petItem,
                                            item.id === activePet?.id && styles.activeItem,
                                        ]}
                                        onPress={() => selectPet(item.id)}
                                    >
                                        <Image
                                            source={{ uri: item.photo }}
                                            style={styles.petImage}
                                        />
                                        <View style={styles.petInfo}>
                                            <Text style={styles.petName}>{item.name}</Text>
                                            <Text style={styles.petBreed}>{item.breed}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.editBtn}
                                        onPress={() => goEdit(item.id)}
                                    >
                                        <Pencil size={18} color={Colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyList}>
                                    <Text style={styles.emptyListText}>
                                        {searchQuery
                                            ? 'Không tìm thấy thú cưng'
                                            : 'Chưa có thú cưng nào'}
                                    </Text>
                                </View>
                            )}
                        />

                        <TouchableOpacity style={styles.addButton} onPress={goAdd}>
                            <Plus size={20} color={Colors.card} />
                            <Text style={styles.addButtonText}>Thêm thú cưng mới</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16, marginBottom: 8 },
    dropdownButton: {
        backgroundColor: Colors.warning,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedPet: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    selectedPetImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    selectedPetInfo: { flex: 1 },
    selectedPetName: { fontSize: 16, fontWeight: '600', color: Colors.text },
    selectedPetBreed: { fontSize: 12, color: Colors.textLight },
    placeholderText: { flex: 1, fontSize: 16, color: Colors.textLight },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Colors.background,
        borderRadius: 16,
        width: '90%',
        maxHeight: '80%',
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, height: 40, color: Colors.text, fontSize: 14 },
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    petItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        flex: 1,
    },
    activeItem: { backgroundColor: Colors.primary + '15' },
    petImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    petInfo: { flex: 1 },
    petName: { fontSize: 16, fontWeight: '500', color: Colors.text },
    petBreed: { fontSize: 12, color: Colors.textLight },
    editBtn: { marginLeft: 8, padding: 4 },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.card,
        marginLeft: 8,
    },
    emptyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.primary,
        marginLeft: 8,
    },
    emptyList: { padding: 24, alignItems: 'center' },
    emptyListText: { fontSize: 14, color: Colors.textLight, textAlign: 'center' },
});
