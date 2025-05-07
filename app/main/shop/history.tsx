// app/main/shop/history.tsx
// import { formatTime } from '@/utils/time';
import { toDMY } from '@/utils/time';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShopStore } from '@/store/shop-store';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function OrderHistoryScreen() {
    const router = useRouter();
    const { orders, loadingOrders, subscribeOrders, getProductById } = useShopStore();
    const [tab, setTab] = useState<'processing' | 'done'>('processing');
    // console.log('orders', orders);

    useEffect(() => subscribeOrders(), []);

    const data = orders.filter((o) => (tab === 'done' ? o.status === 'done' : o.status !== 'done'));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <Stack.Screen
                options={{
                    title: 'Lịch sử đơn hàng',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                            <ArrowLeft size={24} color={Colors.text} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.tabs}>
                {['processing', 'done'].map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.tab, t === tab && styles.activeTab]}
                        onPress={() => setTab(t as any)}
                    >
                        <Text style={[styles.tabTxt, t === tab && styles.activeTabTxt]}>
                            {t === 'processing' ? 'Đang xử lý' : 'Hoàn thành'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loadingOrders ? (
                <Text style={{ textAlign: 'center', marginTop: 40 }}>Loading…</Text>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(o) => o.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.orderId}>#{item.id}</Text>
                            <Text style={styles.date}>{toDMY(item.createAt)}</Text>

                            {item.items.map((it) => {
                                // console.log('it', it);
                                const p = getProductById(it.productId);
                                // console.log('p', p);
                                if (!p) return null;
                                return (
                                    <View key={it.productId} style={styles.row}>
                                        <Text style={styles.productName}>{p.name}</Text>
                                        <Text style={styles.qty}>x{it.quantity}</Text>
                                        {tab === 'done' && !item.rated && (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    router.push({
                                                        pathname: '/main/shop/reviews',
                                                        params: { pid: p.id, oid: item.id }, // cho phép đánh giá
                                                    })
                                                }
                                                style={styles.rateBtn}
                                            >
                                                <Star
                                                    size={16}
                                                    color={Colors.card}
                                                    fill={Colors.card}
                                                />
                                                <Text style={styles.rateTxt}>Đánh giá</Text>
                                            </TouchableOpacity>
                                        )}
                                        {tab === 'done' && item.rated && (
                                            <View style={styles.rateBtn}>
                                                <Star
                                                    size={16}
                                                    color={Colors.card}
                                                    fill={Colors.card}
                                                />
                                                <Text style={styles.rateTxt}>Đã đánh giá</Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                            <Text style={styles.total}>
                                Tổng: {item.total_all.toLocaleString()}đ
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 40 }}>
                            {tab === 'processing'
                                ? 'Không có đơn đang xử lý'
                                : 'Chưa có đơn hoàn thành'}
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border },
    tab: { flex: 1, padding: 12, alignItems: 'center' },
    activeTab: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
    tabTxt: { fontSize: 14, color: Colors.textLight },
    activeTabTxt: { color: Colors.primary, fontWeight: '600' },

    card: { backgroundColor: Colors.card, padding: 12, borderRadius: 8, marginBottom: 12 },
    orderId: { fontWeight: '600', color: Colors.text },
    date: { fontSize: 12, color: Colors.textLight, marginBottom: 8 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    productName: { flex: 1, color: Colors.text },
    qty: { marginHorizontal: 4, color: Colors.textLight },
    rateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    rateTxt: { color: Colors.card, fontSize: 12, marginLeft: 4 },
    total: { textAlign: 'right', marginTop: 4, fontWeight: '600', color: Colors.primary },
});
