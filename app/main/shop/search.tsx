import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useShopStore } from '@/store/shop-store';
import ProductItem from '@/components/ProductItem';

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<
        ReturnType<typeof useShopStore.getState.getProductsBySearch>
    >([]);
    const router = useRouter();
    const { getProductsBySearch } = useShopStore();

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            setSearchResults(getProductsBySearch(searchQuery));
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color={Colors.text} />
                </TouchableOpacity>

                <View style={styles.searchContainer}>
                    <Search size={20} color={Colors.textLight} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm sản phẩm..."
                        placeholderTextColor={Colors.textLight}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={handleClearSearch}>
                            <X size={20} color={Colors.textLight} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {searchQuery.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateText}>Nhập từ khóa để tìm kiếm sản phẩm</Text>
                </View>
            ) : searchResults.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateText}>Không tìm thấy sản phẩm phù hợp</Text>
                </View>
            ) : (
                <FlatList
                    data={searchResults}
                    renderItem={({ item }) => (
                        <ProductItem
                            product={item}
                            onPress={() =>
                                router.push({
                                    pathname: './product-details',
                                    params: { id: item.id },
                                })
                            }
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.productRow}
                    contentContainerStyle={styles.productList}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backButton: {
        marginRight: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
        marginLeft: 8,
        paddingVertical: 4,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyStateText: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center',
    },
    productList: {
        padding: 16,
    },
    productRow: {
        justifyContent: 'space-between',
    },
});
