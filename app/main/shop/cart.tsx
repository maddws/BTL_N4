import React, { useLayoutEffect, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import Colors from '@/constants/colors';
import { useShopStore } from '@/store/shop-store';

/* ---------- selector để chỉ re‑render khi thật sự cần ---------- */
type CartState = {
    items: Array<any>;
    total: number;
    updateQty: (id: string, qty: number) => void;
    remove: (id: string) => void;
    clear: () => void;
};

// CartScreen.tsx
const useCart = () => {
    /* lấy đúng state thô, tham chiếu ổn định */
    const cart = useShopStore((s) => s.cart);
    const products = useShopStore((s) => s.products);
    const updateQty = useShopStore((s) => s.updateQty);
    const remove = useShopStore((s) => s.removeFromCart);
    const clear = useShopStore((s) => s.clearCart);

    /* derive dữ liệu bằng useMemo => không gây subscribe thừa */
    const items = React.useMemo(
        () =>
            cart
                .map((c) => ({
                    product: products.find((p) => p.id === c.productId)!,
                    quantity: c.quantity,
                }))
                .filter((i) => i.product),
        [cart, products]
    );

    const total = React.useMemo(
        () => items.reduce((s, i) => s + i.product.price * i.quantity, 0),
        [items]
    );

    return { items, total, updateQty, remove, clear };
};

export default function CartScreen() {
    const router = useRouter();
    const nav = useNavigation();

    const { items: cartItems, total: cartTotal, updateQty, remove, clear } = useCart();
    const [ready, setReady] = React.useState(false); // hook 2

    /* header: luôn gọi */
    useLayoutEffect(() => {
        nav.setOptions({
            title: '  Giỏ hàng',
            headerLeft: () => (
                <TouchableOpacity onPress={() => nav.goBack()}>
                    <ArrowLeft size={24} color={Colors.text} />
                </TouchableOpacity>
            ),
        });
    }, [nav]); // hook 3

    /* mô phỏng fetch done */
    useEffect(() => setReady(true), []); // hook 4  (ví dụ)

    const formatPrice = (v: number) =>
        v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    /* helpers */
    const money = (v: number) => v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const changeQty = (pid: string, next: number) => {
        if (next < 1) {
            Alert.alert('Xóa sản phẩm', 'Bạn chắc chắn muốn xóa?', [
                { text: 'Huỷ', style: 'cancel' },
                { text: 'Xoá', style: 'destructive', onPress: () => remove(pid) },
            ]);
            return;
        }
        updateQty(pid, next);
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            {!ready ? (
                <ActivityIndicator size="large" style={{ marginTop: 40 }} />
            ) : cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <ShoppingBag size={64} color={Colors.textLight} />
                    <Text style={styles.emptyText}>Giỏ hàng trống</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        renderItem={({ item }) => (
                            <View style={styles.cartItem}>
                                <Image
                                    source={{ uri: item.product.imageUrl }}
                                    style={styles.productImage}
                                />

                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {item.product.name}
                                    </Text>
                                    <Text style={styles.productPrice}>
                                        {formatPrice(item.product.price)}
                                    </Text>

                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() =>
                                                updateQty(item.product.id, item.quantity - 1)
                                            }
                                        >
                                            <Minus size={16} color={Colors.text} />
                                        </TouchableOpacity>

                                        <Text style={styles.quantity}>{item.quantity}</Text>

                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() =>
                                                updateQty(item.product.id, item.quantity + 1)
                                            }
                                        >
                                            <Plus size={16} color={Colors.text} />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.removeButton}
                                            onPress={() => remove(item.product.id)}
                                        >
                                            <Trash2 size={16} color={Colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Text style={styles.itemTotal}>
                                    {formatPrice(item.product.price * item.quantity)}
                                </Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.product.id}
                        contentContainerStyle={styles.cartList}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Tổng cộng:</Text>
                            <Text style={styles.totalPrice}>{formatPrice(cartTotal)}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() => router.push('./checkout')}
                        >
                            <Text style={styles.checkoutText}>Thanh toán</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textLight,
        marginTop: 16,
        marginBottom: 24,
    },
    continueShoppingButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    continueShoppingText: {
        color: Colors.card,
        fontSize: 16,
        fontWeight: '500',
    },
    cartList: {
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    productPrice: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
        marginTop: 4,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        marginLeft: 12,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginLeft: 8,
        alignSelf: 'center',
    },
    footer: {
        backgroundColor: Colors.card,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        color: Colors.text,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    checkoutButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    checkoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.card,
    },
});
