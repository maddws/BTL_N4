import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, MapPin, Truck, Plus, Minus, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useShopStore } from '@/store/shop-store';
import { useSettingsStore } from '@/store/settings-store';
import { db } from '@/config/firebase';
import { Firestore, collection, setDoc, doc } from 'firebase/firestore';

export default function CheckoutScreen() {
    // ... rest of
    const router = useRouter();
    const { cart, getProductById, updateCartItemQuantity, removeFromCart, clearCart } =
        useShopStore();
    const { userProfile } = useSettingsStore();

    const [address, setAddress] = useState(userProfile?.address || '');
    const [phone, setPhone] = useState(userProfile?.phone || '');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const shippingFee = 30000; // Fixed shipping fee
    const total = subtotal + shippingFee;

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        updateCartItemQuantity(productId, quantity);
    };

    const handleRemoveItem = (productId: string) => {
        removeFromCart(productId);
    };

    const handlePlaceOrder = async () => {
        if (!address.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ giao hàng');
            return;
        }

        if (!phone.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
            return;
        }

        try {
            const orderId = Date.now().toString(); // Generate a unique ID
            const orderRef = doc(db, 'Orders', orderId);
            const orderData = {
                user_id: userProfile?.id,
                address: address,
                phone_number: phone,
                method: paymentMethod,
                items: cart.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
                total: subtotal,
                ship: shippingFee,
                total_all: total,
            };
            await setDoc(orderRef, orderData);
        } catch {
            Alert.alert('Lỗi', 'Đặt hàng không thành công. Vui lòng thử lại sau.');
            return;
        }

        setIsProcessing(true);

        // Simulate order processing
        setTimeout(() => {
            setIsProcessing(false);
            clearCart();

            console.log('Order placed successfully');

            Alert.alert(
                'Đặt hàng thành công',
                'Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(tabs)'),
                    },
                ]
            );
        }, 1500);
    };

    // Format price
    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
    };

    if (cart.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Thanh toán',
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
                    <Text style={styles.emptyText}>Giỏ hàng trống</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => router.replace('/(tabs)/shop')}
                    >
                        <Text style={styles.shopButtonText}>Tiếp tục mua sắm</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Thanh toán',
                    headerLeft: () => (
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <ArrowLeft size={24} color={Colors.text} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
                    <View style={styles.addressContainer}>
                        <MapPin size={20} color={Colors.textLight} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập địa chỉ giao hàng"
                            placeholderTextColor={Colors.textLight}
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Số điện thoại</Text>
                    <View style={styles.addressContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập số điện thoại"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                    <View style={styles.paymentOptions}>
                        <TouchableOpacity
                            style={[
                                styles.paymentOption,
                                paymentMethod === 'cod' && styles.paymentOptionActive,
                            ]}
                            onPress={() => setPaymentMethod('cod')}
                        >
                            <Truck
                                size={20}
                                color={paymentMethod === 'cod' ? Colors.primary : Colors.textLight}
                            />
                            <Text
                                style={[
                                    styles.paymentOptionText,
                                    paymentMethod === 'cod' && styles.paymentOptionTextActive,
                                ]}
                            >
                                Thanh toán khi nhận hàng
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.paymentOption,
                                paymentMethod === 'card' && styles.paymentOptionActive,
                            ]}
                            onPress={() => setPaymentMethod('card')}
                        >
                            <CreditCard
                                size={20}
                                color={paymentMethod === 'card' ? Colors.primary : Colors.textLight}
                            />
                            <Text
                                style={[
                                    styles.paymentOptionText,
                                    paymentMethod === 'card' && styles.paymentOptionTextActive,
                                ]}
                            >
                                Thẻ tín dụng/Ghi nợ
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Đơn hàng của bạn</Text>
                    {cart.map((item) => {
                        const product = getProductById(item.productId);
                        if (!product) return null;

                        return (
                            <View key={item.productId} style={styles.cartItem}>
                                <Image
                                    source={{ uri: product.imageUrl }}
                                    style={styles.productImage}
                                />

                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {product.name}
                                    </Text>
                                    <Text style={styles.productPrice}>
                                        {formatPrice(product.price)}
                                    </Text>

                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() =>
                                                handleUpdateQuantity(
                                                    item.productId,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            <Minus size={16} color={Colors.text} />
                                        </TouchableOpacity>

                                        <Text style={styles.quantity}>{item.quantity}</Text>

                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() =>
                                                handleUpdateQuantity(
                                                    item.productId,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            <Plus size={16} color={Colors.text} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveItem(item.productId)}
                                >
                                    <X size={20} color={Colors.textLight} />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Tạm tính</Text>
                        <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                        <Text style={styles.summaryValue}>{formatPrice(shippingFee)}</Text>
                    </View>
                    <View style={[styles.summaryItem, styles.totalItem]}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerContent}>
                    <View>
                        <Text style={styles.footerTotalLabel}>Tổng thanh toán</Text>
                        <Text style={styles.footerTotalValue}>{formatPrice(total)}</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.checkoutButton,
                            isProcessing && styles.checkoutButtonDisabled,
                        ]}
                        onPress={handlePlaceOrder}
                        disabled={isProcessing}
                    >
                        <Text style={styles.checkoutButtonText}>
                            {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
                        </Text>
                    </TouchableOpacity>
                </View>
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
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: Colors.card,
        marginBottom: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 14,
        color: Colors.text,
    },
    paymentOptions: {
        gap: 12,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
    },
    paymentOptionActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '10',
    },
    paymentOptionText: {
        fontSize: 14,
        color: Colors.text,
        marginLeft: 12,
    },
    paymentOptionTextActive: {
        color: Colors.primary,
        fontWeight: '500',
    },
    cartItem: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingBottom: 16,
        marginBottom: 16,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        padding: 8,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: Colors.textLight,
    },
    summaryValue: {
        fontSize: 14,
        color: Colors.text,
    },
    totalItem: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 12,
        marginTop: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    footer: {
        backgroundColor: Colors.card,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        padding: 16,
    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerTotalLabel: {
        fontSize: 12,
        color: Colors.textLight,
    },
    footerTotalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    checkoutButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    checkoutButtonDisabled: {
        opacity: 0.7,
    },
    checkoutButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.card,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textLight,
        marginBottom: 16,
    },
    shopButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    shopButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.card,
    },
});
