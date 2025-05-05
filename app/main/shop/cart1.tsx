import React, { useLayoutEffect } from 'react';
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

const useCart = (): CartState =>
    useShopStore((s) => ({
        items: s.cartItems(),
        total: s.cartTotal(),
        updateQty: s.updateQty,
        remove: s.removeFromCart,
        clear: s.clearCart,
    }));

export default function CartScreen() {
    const router = useRouter();
    const nav = useNavigation();

    const { items: cartItems, total: cartTotal, updateQty, remove, clear } = useCart();

    /* loading UI nhỏ khi sản phẩm chưa kịp sync */
    if (!cartItems.length) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" style={{ marginTop: 40 }} />
            </SafeAreaView>
        );
    }

    /* ---------- helpers ---------- */
    const formatPrice = (v: number) =>
        v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    // const handleChange = (pid: string, next: number) => {
    //     if (next < 1) {
    //         Alert.alert('Xóa sản phẩm', 'Bạn chắc chắn muốn xóa?', [
    //             { text: 'Huỷ', style: 'cancel' },
    //             { text: 'Xoá', style: 'destructive', onPress: () => remove(pid) },
    //         ]);
    //         return;
    //     }
    //     updateQty(pid, next);
    // };

    // if (cartItems.length === 0) {
    //     return (
    //         <SafeAreaView style={styles.container} edges={['right', 'left']}>
    //             <Stack.Screen
    //                 options={{
    //                     title: 'Giỏ hàng',
    //                     headerLeft: () => (
    //                         <TouchableOpacity
    //                             style={styles.backButton}
    //                             onPress={() => router.back()}
    //                         >
    //                             <ArrowLeft size={24} color={Colors.text} />
    //                         </TouchableOpacity>
    //                     ),
    //                 }}
    //             />

    //             <View style={styles.emptyContainer}>
    //                 <ShoppingBag size={64} color={Colors.textLight} />
    //                 <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
    //                 <TouchableOpacity
    //                     style={styles.continueShoppingButton}
    //                     onPress={() => router.back()}
    //                 >
    //                     <Text style={styles.continueShoppingText}>Tiếp tục mua sắm</Text>
    //                 </TouchableOpacity>
    //             </View>
    //         </SafeAreaView>
    //     );
    // }
    /* set header ONE TIME – không tạo vòng lặp */
    useLayoutEffect(() => {
        nav.setOptions({
            title: 'Giỏ hàng',
            headerLeft: () => (
                <TouchableOpacity style={styles.backButton} onPress={() => nav.goBack()}>
                    <ArrowLeft size={24} color={Colors.text} />
                </TouchableOpacity>
            ),
        });
    }, [nav]);

    /* loading UI nhỏ khi products chưa kịp sync */
    if (cartItems.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <ShoppingBag size={64} color={Colors.textLight} />
                    <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
                </View>
            </SafeAreaView>
        );
    }

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
            <Stack.Screen
                options={{
                    title: 'Giỏ hàng',
                    headerLeft: () => (
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <ArrowLeft size={24} color={Colors.text} />
                        </TouchableOpacity>
                    ),
                }}
            />

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
                                    onPress={() => updateQty(item.product.id, item.quantity - 1)}
                                >
                                    <Minus size={16} color={Colors.text} />
                                </TouchableOpacity>

                                <Text style={styles.quantity}>{item.quantity}</Text>

                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => updateQty(item.product.id, item.quantity + 1)}
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
        </SafeAreaView>
    );
}

// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Stack, useRouter } from 'expo-router';
// import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
// import Colors from '@/constants/colors';
// import { useShopStore } from '@/store/shop-store';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function CartScreen() {
//     const router = useRouter();
//     const {
//         getCartItems,
//         getCartTotal,
//         saveCart,
//         updateCartItemQuantity,
//         removeFromCart,
//         clearCart,
//         // fetchSavedCart,
//     } = useShopStore();
//     // const userId = AsyncStorage.getItem('user').then((user) => { JSON.parse(user).id; });
//     // fetchSavedCart();

//     const cartItems = getCartItems();
//     const cartTotal = getCartTotal();

//     const handleQuantityChange = (productId: string, newQuantity: number) => {
//         if (newQuantity < 1) {
//             // Ask for confirmation before removing
//             Alert.alert('Xóa sản phẩm', 'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?', [
//                 {
//                     text: 'Hủy',
//                     style: 'cancel',
//                 },
//                 {
//                     text: 'Xóa',
//                     onPress: () => removeFromCart(productId),
//                     style: 'destructive',
//                 },
//             ]);
//         } else {
//             updateCartItemQuantity(productId, newQuantity);
//         }
//     };

//     const handleRemoveItem = (productId: string) => {
//         Alert.alert('Xóa sản phẩm', 'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?', [
//             {
//                 text: 'Hủy',
//                 style: 'cancel',
//             },
//             {
//                 text: 'Xóa',
//                 onPress: () => removeFromCart(productId),
//                 style: 'destructive',
//             },
//         ]);
//     };

//     const handleCheckout = () => {
//         if (cartItems.length === 0) {
//             Alert.alert(
//                 'Giỏ hàng trống',
//                 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.'
//             );
//             return;
//         }

//         Alert.alert('Xác nhận đặt hàng', `Tổng tiền: ${formatPrice(cartTotal)}`, [
//             {
//                 text: 'Hủy',
//                 style: 'cancel',
//             },
//             {
//                 text: 'Đặt hàng',
//                 onPress: () => {
//                     // Simulate successful order
//                     Alert.alert(
//                         'Đặt hàng thành công',
//                         'Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đang được xử lý.',
//                         [
//                             {
//                                 text: 'OK',
//                                 onPress: () => {
//                                     clearCart();
//                                     router.back();
//                                 },
//                             },
//                         ]
//                     );
//                 },
//             },
//         ]);
//     };

//     // Format price
//     const formatPrice = (price: number) => {
//         return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
//     };

//     const handleSaveCart = () => {
//         saveCart();
//     };

//     if (cartItems.length === 0) {
//         return (
//             <SafeAreaView style={styles.container} edges={['right', 'left']}>
//                 <Stack.Screen
//                     options={{
//                         title: 'Giỏ hàng',
//                         headerLeft: () => (
//                             <TouchableOpacity
//                                 style={styles.backButton}
//                                 onPress={() => router.back()}
//                             >
//                                 <ArrowLeft size={24} color={Colors.text} />
//                             </TouchableOpacity>
//                         ),
//                     }}
//                 />

//                 <View style={styles.emptyContainer}>
//                     <ShoppingBag size={64} color={Colors.textLight} />
//                     <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
//                     <TouchableOpacity
//                         style={styles.continueShoppingButton}
//                         onPress={() => router.back()}
//                     >
//                         <Text style={styles.continueShoppingText}>Tiếp tục mua sắm</Text>
//                     </TouchableOpacity>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.container} edges={['right', 'left']}>
//             <Stack.Screen
//                 options={{
//                     title: 'Giỏ hàng',
//                     headerLeft: () => (
//                         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//                             <ArrowLeft size={24} color={Colors.text} />
//                         </TouchableOpacity>
//                     ),
//                 }}
//             />

//             <FlatList
//                 data={cartItems}
//                 renderItem={({ item }) => (
//                     <View style={styles.cartItem}>
//                         <Image
//                             source={{ uri: item.product.imageUrl }}
//                             style={styles.productImage}
//                         />

//                         <View style={styles.productInfo}>
//                             <Text style={styles.productName} numberOfLines={2}>
//                                 {item.product.name}
//                             </Text>
//                             <Text style={styles.productPrice}>
//                                 {formatPrice(item.product.price)}
//                             </Text>

//                             <View style={styles.quantityContainer}>
//                                 <TouchableOpacity
//                                     style={styles.quantityButton}
//                                     onPress={() =>
//                                         handleQuantityChange(item.product.id, item.quantity - 1)
//                                     }
//                                 >
//                                     <Minus size={16} color={Colors.text} />
//                                 </TouchableOpacity>

//                                 <Text style={styles.quantity}>{item.quantity}</Text>

//                                 <TouchableOpacity
//                                     style={styles.quantityButton}
//                                     onPress={() =>
//                                         handleQuantityChange(item.product.id, item.quantity + 1)
//                                     }
//                                 >
//                                     <Plus size={16} color={Colors.text} />
//                                 </TouchableOpacity>

//                                 <TouchableOpacity
//                                     style={styles.removeButton}
//                                     onPress={() => handleRemoveItem(item.product.id)}
//                                 >
//                                     <Trash2 size={16} color={Colors.error} />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>

//                         <Text style={styles.itemTotal}>
//                             {formatPrice(item.product.price * item.quantity)}
//                         </Text>
//                     </View>
//                 )}
//                 keyExtractor={(item) => item.product.id}
//                 contentContainerStyle={styles.cartList}
//                 showsVerticalScrollIndicator={false}
//             />

//             <View style={styles.footer}>
//                 <View style={styles.totalContainer}>
//                     <Text style={styles.totalLabel}>Tổng cộng:</Text>
//                     <Text style={styles.totalPrice}>{formatPrice(cartTotal)}</Text>
//                 </View>

//                 {/* <TouchableOpacity
//                     style={[
//                         styles.checkoutButton,
//                         { marginBottom: 12, backgroundColor: Colors.success },
//                     ]}
//                     onPress={handleSaveCart}
//                 >
//                     <Text style={styles.checkoutText}>Lưu giỏ hàng</Text>
//                 </TouchableOpacity> */}

//                 <TouchableOpacity
//                     style={styles.checkoutButton}
//                     onPress={() => router.push('./checkout')}
//                 >
//                     <Text style={styles.checkoutText}>Thanh toán</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// }

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
