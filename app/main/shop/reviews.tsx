// app/main/shop/reviews.tsx
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import Colors from '@/constants/colors';
import { Star, ArrowLeft } from 'lucide-react-native';
import { useShopStore } from '@/store/shop-store';

export default function ReviewsScreen() {
    const { pid, oid } = useLocalSearchParams(); // pid luôn có, oid chỉ khi đánh giá
    const router = useRouter();
    const { addRating, getRatingsByProduct } = useShopStore();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<any[]>([]);
    const [avg, setAvg] = useState(0);
    const [reviews, setReviews] = useState(0);
    const [myRating, setMyRating] = useState(0);
    const [myReview, setMyReview] = useState('');

    useEffect(() => {
        (async () => {
            const res = await getRatingsByProduct(pid as string);
            setList(res.data);
            setAvg(res.rating);
            setReviews(res.reviews);
            setLoading(false);
        })();
    }, [pid]);

    const handleSend = async () => {
        if (!myRating) return;
        await addRating(pid as string, oid as string, myRating, myReview);
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <Stack.Screen
                options={{
                    title: 'Đánh giá',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                            <ArrowLeft size={24} color={Colors.text} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.summary}>
                <Text style={styles.avg}>{avg.toFixed(1)}</Text>
                <Star size={20} color={Colors.warning} fill={Colors.warning} />
                <Text style={styles.count}>({reviews} đánh giá)</Text>
            </View>

            {oid /* khối nhập đánh giá chỉ xuất hiện khi vào từ OrderHistory */ && (
                <View style={styles.form}>
                    <Text style={styles.formLabel}>Đánh giá của bạn</Text>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TouchableOpacity key={i} onPress={() => setMyRating(i)}>
                                <Star
                                    size={28}
                                    color={i <= myRating ? Colors.warning : Colors.textLight}
                                    fill={i <= myRating ? Colors.warning : 'none'}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Viết nhận xét..."
                        value={myReview}
                        onChangeText={setMyReview}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <Text style={styles.sendTxt}>Gửi đánh giá</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={list}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.user}>{item.user_id.slice(0, 6)}***</Text>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        color={i <= item.rating ? Colors.warning : Colors.textLight}
                                        fill={i <= item.rating ? Colors.warning : 'none'}
                                    />
                                ))}
                            </View>
                        </View>
                        <Text style={styles.reviewTxt}>{item.review}</Text>
                    </View>
                )}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    !loading ? <Text style={{ textAlign: 'center' }}>Chưa có đánh giá</Text> : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    summary: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    avg: { fontSize: 34, fontWeight: '700', color: Colors.primary, marginRight: 4 },
    count: { fontSize: 14, color: Colors.textLight, marginLeft: 4 },
    form: { padding: 16, borderTopWidth: 1, borderTopColor: Colors.border },
    formLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    starsRow: { flexDirection: 'row', marginVertical: 8 },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    sendBtn: {
        marginTop: 12,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    sendTxt: { color: Colors.card, fontWeight: '600' },
    card: { marginBottom: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    user: { fontWeight: '600', color: Colors.text },
    reviewTxt: { color: Colors.text },
});
