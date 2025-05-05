import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Star, Minus, Plus, ShoppingCart, Heart, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useShopStore } from '@/store/shop-store';

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const { getProductById, addToCart, favorites, addToFavorites, removeFromFavorites } =
        useShopStore();

    const product = getProductById(id as string);
    const isFavorite = favorites.includes(id as string);

    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Chi tiết sản phẩm',
                        headerLeft: () => (
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                            >
                                <ArrowLeft size={24} color={Colors.text} />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handleAddToCart = () => {
        addToCart(product.id, quantity);
        router.back();
    };

    const handleToggleFavorite = () => {
        if (isFavorite) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product.id);
        }
    };

    // Format price
    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Chi tiết sản phẩm',
                    headerLeft: () => (
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <ArrowLeft size={24} color={Colors.text} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.scrollContainer}>
                <Image source={{ uri: product.imageUrl }} style={styles.image} />

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.name}>{product.name}</Text>
                        <TouchableOpacity
                            style={[
                                styles.favoriteButton,
                                isFavorite && styles.activeFavoriteButton,
                            ]}
                            onPress={handleToggleFavorite}
                        >
                            <Heart
                                size={20}
                                color={isFavorite ? Colors.card : Colors.primary}
                                fill={isFavorite ? Colors.card : 'none'}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.price}>{formatPrice(product.price)}</Text>

                    <View style={styles.ratingContainer}>
                        <Star size={16} color={Colors.warning} fill={Colors.warning} />
                        <Text style={styles.rating}>{product.rating}</Text>
                        <Text style={styles.reviews}>({product.reviews} đánh giá)</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.descriptionTitle}>Mô tả sản phẩm</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.quantityTitle}>Số lượng</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            <Minus size={16} color={Colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => setQuantity(quantity + 1)}
                        >
                            <Plus size={16} color={Colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Tổng cộng:</Text>
                    <Text style={styles.totalPrice}>{formatPrice(product.price * quantity)}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.addToCartButton, !product.inStock && styles.disabledButton]}
                    onPress={handleAddToCart}
                    disabled={!product.inStock}
                >
                    <ShoppingCart size={20} color={Colors.card} />
                    <Text style={styles.addToCartText}>
                        {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    backButton: {
        padding: 8,
    },
    scrollContainer: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        flex: 1,
        marginRight: 16,
    },
    favoriteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    activeFavoriteButton: {
        backgroundColor: Colors.primary,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
        marginTop: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    rating: {
        fontSize: 14,
        color: Colors.text,
        marginLeft: 4,
    },
    reviews: {
        fontSize: 14,
        color: Colors.textLight,
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 16,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
    },
    quantityTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
        marginHorizontal: 16,
        minWidth: 24,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 12,
        color: Colors.textLight,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    disabledButton: {
        backgroundColor: Colors.textLight,
    },
    addToCartText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.card,
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textLight,
    },
});
