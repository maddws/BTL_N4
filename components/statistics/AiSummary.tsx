import React, { useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { usePetStore } from '@/store/pet-store';
import { X } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
import Colors from '@/constants/colors';

export default function AiSummary({ petName, start, end }) {
    const { getActivePet } = usePetStore();
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(true);

    const activePet = getActivePet();

    const grab = async (col: string) => {
        const ref = collection(db, col);
        const q = query(ref, where('petId', '==', activePet.id));
        const snap = await getDocs(q);
        return snap.docs.map((d) => d.data());
    };
    //   const ask = async () => { …hàm fetch Gemini như bạn đã viết… }
    const handleAsk = async () => {
        setLoading(true);
        setAnswer('');

        try {
            //Lấy dữ liệu
            const [health, activity, medical, vaccine] = await Promise.all([
                grab('HealthLogs'),
                grab('ActivityLogs'),
                grab('MedicalRecords'),
                grab('VaccinationSchedule'),
            ]);

            const compact = (obj: any) => JSON.stringify(obj).slice(0, 3000);

            const payloadData = `
HealthLogs: ${compact(health)}
ActivityLogs: ${compact(activity)}
MedicalRecords: ${compact(medical)}
VaccinationSchedule: ${compact(vaccine)}
`;

            //prompt
            const prompt =
                'Tóm tắt ngắn gọn cho tôi những thông tin này để người dùng có thể biết được tình trạng của thú cưng tên là ' +
                petName +
                '(chỉ sử dụng tên, không được sử dụng thông tin nhạy cảm từ cơ sở dữ liệu) từ ngày ' +
                start +
                ' đến ngày ' +
                end +
                ' , và đưa ra lời khuyên về sức khoẻ và dinh dưỡng, chế độ tập luyện, nghỉ ngơi:\n' +
                payloadData +
                ' ghi nhớ in đậm tên thú cưng và những đoạn quan trọng (bao gồm cả ngày tháng năm tôi đề cập cho bạn)';

            // Gemini with API
            const geminiKey = 'AIzaSyDcKI3s8fuAmjmqLE0Z4k8ma26LHE6y_vU';
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: prompt }],
                            },
                        ],
                    }),
                }
            );

            const json = await res.json();
            const aiText =
                json?.candidates?.[0]?.content?.parts?.[0]?.text ||
                'Không nhận được phản hồi hợp lệ.';
            setAnswer(aiText);
        } catch (e: any) {
            console.error(e);
            setAnswer('Đã xảy ra lỗi khi gọi AI hoặc lấy dữ liệu.');
        } finally {
            setLoading(false);
        }
        setShowAnswer(true);
    };
    const handleClose = () => {
        setShowAnswer(false);
    };

    const handleShow = () => {
        setShowAnswer(true);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: Colors.success, marginBottom: 8 }]}
                onPress={handleAsk}
            >
                <Text style={styles.buttonText}>Hỏi trợ lý ảo PetCare AI</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size={35} style={{ marginVertical: 20 }} />}

            {/* Khi ẩn, hiện nút "Hiện lại" */}
            {!loading && answer !== '' && !showAnswer && (
                <TouchableOpacity
                    style={{ ...styles.button, marginVertical: 16 }}
                    onPress={handleShow}
                >
                    <Text style={styles.buttonText}>Hiện câu trả lời</Text>
                </TouchableOpacity>
            )}

            {/* Phần chat */}
            {showAnswer && answer !== '' && (
                <View style={{ ...styles.chartCard, marginVertical: 16 }}>
                    <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                        <X size={20} color={Colors.textLight} />
                    </TouchableOpacity>

                    <ScrollView style={styles.content}>
                        <Markdown
                            style={{
                                body: { color: '#333', fontSize: 15, lineHeight: 22 },
                                strong: { fontWeight: '700' },
                                heading2: { fontSize: 17, fontWeight: '700', marginTop: 12 },
                                list_item: { flexDirection: 'row', marginVertical: 2 },
                            }}
                        >
                            {answer}
                        </Markdown>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        // paddingBottom: ,
    },
    showBtn: {
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    answerWrapper: {
        position: 'relative',
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 12,
    },
    closeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
        padding: 4,
    },
    answerCard: {
        maxHeight: 300,
        paddingTop: 24, // để khỏi chồng nút
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    periodButton: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        marginHorizontal: 4,
    },
    activePeriodButton: {
        backgroundColor: Colors.primary,
    },
    periodButtonText: {
        fontSize: 14,
        color: Colors.textLight,
    },
    activePeriodButtonText: {
        color: Colors.card,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    chartCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    chartSubtitle: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 16,
    },
    chart: {
        borderRadius: 16,
        marginVertical: 0,
        marginHorizontal: -10,
    },
    activityLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 8,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.card,
    },
    legendText: {
        fontSize: 12,
        color: Colors.textLight,
    },
});
