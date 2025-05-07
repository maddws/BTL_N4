import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, ShoppingCart, HistoryIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import ProductItem from '@/components/ProductItem';
import { useShopStore } from '@/store/shop-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/config/firebase';
import { addDoc, collection } from 'firebase/firestore';

type Category = 'all' | 'food' | 'toys' | 'accessories' | 'health' | 'grooming' | 'favorites';

const categoryLabels: Record<Category, string> = {
    all: 'Tất cả',
    food: 'Thức ăn',
    toys: 'Đồ chơi',
    accessories: 'Phụ kiện',
    health: 'Sức khỏe',
    grooming: 'Vệ sinh',
    favorites: 'Yêu thích',
};

export default function ShopScreen() {
    const [activeCategory, setActiveCategory] = useState<Category>('all');

    const router = useRouter();
    const {
        products,
        loadingProducts,
        cartItems,
        cartTotal,
        subscribeProducts,
        subscribeRatings,
        getFavoriteProducts,
        cartItems: getCartItems,
    } = useShopStore();

    // realtime subscribe once
    useEffect(() => {
        const unsub1 = subscribeProducts();
        const unsub2 = subscribeRatings();
        return () => {
            unsub1();
            unsub2();
        };
    }, []);

    // load userId & cart
    useEffect(() => {
        AsyncStorage.getItem('user').then((u) => {
            if (u) useShopStore.getState().setUser(JSON.parse(u).id);
        });
    }, []);

    const getCateProduct = () => {
        if (activeCategory === 'favorites') {
            return getFavoriteProducts();
        } else if (activeCategory === 'all') {
            return products;
        } else {
            return products.filter((product) => product.category === activeCategory);
        }
    };
    const filteredProducts = getCateProduct();

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <View style={styles.headerRow}>
                <TouchableOpacity
                    style={styles.searchBar}
                    onPress={() => router.push('/main/shop/search')}
                >
                    <Search size={20} color={Colors.textLight} />
                    <Text style={styles.searchPlaceholder}>Tìm kiếm sản phẩm...</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cartButton}
                    onPress={() => {
                        router.push('/main/shop/history');
                    }}
                >
                    <HistoryIcon size={24} color={Colors.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cartButton}
                    onPress={() => {
                        router.push('/main/shop/cart');
                    }}
                >
                    <ShoppingCart size={24} color={Colors.text} />
                    {getCartItems().length > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{getCartItems().length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.categoryWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryContainer}
                >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.categoryButton,
                                key === activeCategory && styles.activeCategoryButton,
                            ]}
                            onPress={() => setActiveCategory(key as Category)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    key === activeCategory && styles.activeCategoryText,
                                ]}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loadingProducts ? (
                <ActivityIndicator
                    size="large"
                    color={Colors.primary}
                    style={{ flex: 1, justifyContent: 'center' }}
                />
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={({ item }) => (
                        <ProductItem
                            product={item}
                            onPress={() =>
                                router.push({
                                    pathname: '/main/shop/product-details',
                                    params: { id: item.id },
                                })
                            }
                        />
                    )}
                    keyExtractor={(v) => v.id}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginVertical: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 12,
    },
    searchPlaceholder: {
        fontSize: 14,
        color: Colors.textLight,
        marginLeft: 8,
    },
    cartButton: {
        position: 'relative',
        padding: 8,
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: Colors.card,
        fontSize: 10,
        fontWeight: 'bold',
    },
    categoryWrapper: {
        height: 44,
    },
    categoryContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        marginRight: 8,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
    activeCategoryButton: {
        backgroundColor: Colors.primary,
    },
    categoryText: {
        fontSize: 14,
        color: Colors.textLight,
    },
    activeCategoryText: {
        color: Colors.card,
        fontWeight: '500',
    },
    productList: {
        padding: 16,
    },
    productRow: {
        justifyContent: 'space-between',
    },
});
