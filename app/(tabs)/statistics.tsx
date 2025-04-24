import React, { useState, useEffect } from 'react';
import Markdown from 'react-native-markdown-display';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Button,
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import { usePetStore } from '@/store/pet-store';
import { db } from '@/config/firebase';
import {
    collection,
    onSnapshot,
    query,
    where,
    getDocs,
    doc,
    orderBy,
    limit,
} from 'firebase/firestore';
import DatePicker from '@/components/DatePicker';

// type Period = 'day' | 'week' | 'month';
function getStartAndEndDate(midDateString) {
    const midDate = new Date(midDateString); // Chuyển đổi ngày thành đối tượng Date

    // Lấy ngày bắt đầu (3 ngày trước mốc chính giữa)
    const startDate = new Date(midDate);
    startDate.setDate(midDate.getDate() - 3);

    // Lấy ngày kết thúc (3 ngày sau mốc chính giữa)
    const endDate = new Date(midDate);
    endDate.setDate(midDate.getDate() + 3);

    // Định dạng ngày theo kiểu 'yyyy-mm-dd'
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng, thêm số 0 nếu cần
        const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày, thêm số 0 nếu cần
        return `${year}-${month}-${day}`;
    };

    // Trả về ngày bắt đầu và kết thúc dưới dạng chuỗi
    return {
        start: formatDate(startDate),
        end: formatDate(endDate),
    };
}

const formatTime = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000); // nanoseconds / 1000000 để chuyển đổi nanoseconds thành milliseconds
    return date.toISOString().split('T')[0];
};

const GEMINI_API_KEY = 'AIzaSyC01AUrFvV90eFLOo86k3MVOHU0CN8YODI';
const MODEL_NAME = 'gemini-2.0-flash-latest';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

// Sử dụng hàm
// const { start, end } = getStartAndEndDate('2025-04-24');
// console.log('Start date:', start); // 2025-04-21
// console.log('End date:', end); // 2025-04-30

const getDayOfWeek = (dateString: string) => {
    // Định dạng dateString ví dụ: "DD/MM/YYYY" hoặc "YYYY-MM-DD"
    let date;

    // Kiểm tra định dạng ngày
    if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        date = new Date(`${year}-${month}-${day}`);
    } else if (dateString.includes('-')) {
        date = new Date(dateString);
    } else {
        return 'Định dạng ngày không hợp lệ';
    }

    // Kiểm tra ngày hợp lệ
    if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
    }

    // Mảng các thứ trong tuần
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    // Lấy thứ từ ngày
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
};

const calculateDurationInHours = (startTime, endTime) => {
    // Lấy giờ và phút từ startTime và endTime
    const start = startTime.split(':');
    const end = endTime.split(':');

    // Chuyển đổi giờ và phút thành phút tính tổng
    const startMinutes = parseInt(start[0], 10) * 60 + parseInt(start[1], 10); // Tính tổng phút từ startTime
    const endMinutes = parseInt(end[0], 10) * 60 + parseInt(end[1], 10); // Tính tổng phút từ endTime

    // Nếu endTime nhỏ hơn startTime (ví dụ: 22:00 và 04:00), giả sử endTime là vào ngày hôm sau
    let durationMinutes = endMinutes - startMinutes;
    if (durationMinutes < 0) {
        durationMinutes += 24 * 60; // Cộng thêm 24 giờ vào
    }

    // Chuyển đổi lại thành giờ
    return durationMinutes / 60;
};
const calculateCalories = (
    activity: string,
    weight: number,
    startTime: string,
    endTime: string
) => {
    const MET_VALUES = {
        walk: 3.8,
        run: 7.0,
        play: 4.0,
        eat: 1.5,
        sleep: 0.9,
    };

    const durationInHours = calculateDurationInHours(startTime, endTime);
    // console.log(durationInHours);

    const MET = MET_VALUES[activity] || 1; // Mặc định là 1 nếu không có trong bảng
    return {
        calories: Math.round(MET * weight * durationInHours) || 0,
        time_duration: Math.round(durationInHours),
    }; // Tính số kcal
};

export default function StatisticsScreen() {
    // const [activePeriod, setActivePeriod] = useState<Period>('week');
    const router = useRouter();
    const { activePetId, getPetById } = usePetStore();
    const [date, setDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState<boolean>(false);
    const [answer, setAnswer] = useState<string>('');
    const activePet = activePetId ? getPetById(activePetId) : null;
    const [weightData, setWeightData] = useState<number[]>([]);
    const [labelData, setLabelData] = useState<string[]>([]);
    const [activityData, setActivityData] = useState<any[]>([]);
    const [timeData, setTimeData] = useState<any[]>([]);

    const [labelTimeData, setLabelTimeData] = useState<any[]>([]);
    const [labelActivityData, setLabelActivityData] = useState<any[]>([]);

    const filterDate = getStartAndEndDate(date);

    const grab = async (col: string) => {
        const ref = collection(db, col);
        const q = query(ref, where('petId', '==', activePetId));
        const snap = await getDocs(q);
        return snap.docs.map((d) => d.data());
    };

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
                activePet.name +
                '(chỉ sử dụng tên, không được sử dụng thông tin nhạy cảm từ cơ sở dữ liệu) từ ngày ' +
                filterDate.start +
                ' đến ngày ' +
                filterDate.end +
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
    };

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const loadWeightData = async () => {
            if (activePet) {
                // console.log('Loading weight data for pet:', activePet);
                // console.log('Filter Date:', filterDate);
                const weightDataRef = collection(db, 'HealthLogs'); // Query trong collection ActivityLogs

                const startDate = new Date(filterDate.start);
                const endDate = new Date(filterDate.end);
                const weightData: number[] = []; // Dữ liệu cân nặng (có thể là null)
                const labelData: string[] = []; // Nhãn ngày (có thể là null)

                // Lặp qua từng ngày từ startDate đến endDate
                while (startDate <= endDate) {
                    const dateString = startDate.toISOString().split('T')[0]; // Định dạng 'yyyy-mm-dd'
                    const dayOfWeek = getDayOfWeek(dateString); // Lấy tên ngày trong tuần (T2, T3, ...)

                    const q = query(
                        weightDataRef,
                        where('petId', '==', activePet.id),
                        where('date', '==', startDate.toISOString())
                    );
                    // Truy vấn Firestore cho ngày cụ thể
                    const querySnapshot = await getDocs(q);
                    // Nếu có bản ghi, tính toán lượng kcal
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            // console.log(data);
                            const { weight } = data;
                            if (weight) {
                                weightData.push(weight); // Thêm kcal vào dữ liệu
                                labelData.push(dayOfWeek); // Thêm ngày vào nhãn
                            }
                        });
                    } else {
                        weightData.push(0); // Không có dữ liệu cho ngày này
                        labelData.push(dayOfWeek + '*');
                    }
                    // Nếu không có bản ghi, trả về NULL và 0 kcal

                    // Tăng ngày lên 1 để tiếp tục lặp qua
                    startDate.setDate(startDate.getDate() + 1);
                }

                // Kiểm tra và log kết quả
                // console.log('Updated weight data:', weightData);
                // console.log('Updated label data:', labelData);

                // Cập nhật state với dữ liệu mới
                setWeightData(weightData);
                setLabelData(labelData);
            }
        };

        loadWeightData();

        // Cleanup khi component unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [activePet, filterDate]); // Lắng nghe sự thay đổi của activePet và filterDate

    useEffect(() => {
        const loadActivityData = async () => {
            if (!activePet) return;

            const activityLogsRef = collection(db, 'ActivityLogs');
            const startDate = new Date(filterDate.start);
            const endDate = new Date(filterDate.end);
            const activityData: number[] = [];
            const labelData: string[] = [];
            const timeData: number[] = [];
            const labelTimeData: string[] = [];

            // Lặp qua từng ngày từ startDate đến endDate
            while (startDate <= endDate) {
                // console.log(startDate);
                const dateString = startDate.toISOString().split('T')[0]; // Chuyển ngày sang định dạng yyyy-mm-dd
                const dayOfWeek = getDayOfWeek(dateString); // Lấy tên ngày trong tuần (T2, T3, ...)
                const dayOfMonth = startDate.toISOString().split('-')[2];
                const q = query(
                    activityLogsRef,
                    where('petId', '==', activePet.id),
                    where('date', '==', new Date(dateString))
                );

                // Thực hiện query cho từng ngày
                const querySnapshot = await getDocs(q);
                // console.log(querySnapshot);
                let totalCalories = 0;
                let totalTime = 0;

                // Nếu có bản ghi cho ngày này, tính toán lượng kcal

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // console.log(data);
                    const { activity_name, start_time, end_time } = data;
                    const { calories, time_duration } = calculateCalories(
                        activity_name,
                        activePet.weight,
                        start_time,
                        end_time
                    );
                    totalCalories += calories;
                    totalTime += time_duration;
                });
                // console.log(totalCalories);

                // Nếu không có bản ghi, trả về kcal = 0
                if (totalCalories === 0) {
                    labelData.push(dayOfWeek + '*');
                    activityData.push(0);

                    labelTimeData.push(dayOfWeek + '*');
                    timeData.push(0);
                } else {
                    labelData.push(dayOfWeek);
                    activityData.push(totalCalories);

                    labelTimeData.push(dayOfWeek);
                    timeData.push(totalTime);
                }

                // Tăng ngày lên 1
                startDate.setDate(startDate.getDate() + 1);
            }

            setActivityData(activityData);
            setLabelActivityData(labelData);

            setTimeData(timeData);
            setLabelTimeData(labelTimeData);
        };

        loadActivityData();
    }, [filterDate, activePet]); // Lắng nghe sự thay đổi của filterDate
    // Cập nhật dữ liệu vào state
    // console.log(weightData);
    // console.log(labelData);

    const screenWidth = Dimensions.get('window').width - 32;

    const chartConfig = {
        backgroundGradientFrom: Colors.card,
        backgroundGradientTo: Colors.card,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(74, 111, 165, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: Colors.primary,
        },
    };

    // Weight data
    const weightDataVisualize = {
        labels: labelData.length > 0 ? labelData : ['20'],
        datasets: [
            {
                data: weightData.length > 0 ? weightData : [0],
            },
        ],
    };

    //    Bar chart data
    const activityDataVisualize = {
        labels: labelActivityData,
        datasets: [
            {
                data: activityData,
            },
        ],
    };

    const timeDataVisualize = {
        labels: labelTimeData,
        datasets: [
            {
                data: timeData,
            },
        ],
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <View style={styles.header}></View>

            <PetSelector />

            <View style={styles.header}>
                <DatePicker label="" date={date} onChange={setDate} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { marginBottom: 12, backgroundColor: Colors.success },
                        ]}
                        onPress={handleAsk}
                    >
                        <Text style={styles.buttonText}>Hỏi trợ lý ảo PetCare AI</Text>
                    </TouchableOpacity>

                    {loading && (
                        <ActivityIndicator size={35} style={{ marginTop: 16, marginBottom: 20 }} />
                    )}
                    {answer !== '' && (
                        <ScrollView style={styles.chartCard}>
                            {/* <Markdown style={styles.content}>{answer}</Text> */}
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
                    )}
                </View>
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Thời gian hoạt động</Text>
                    <Text style={styles.chartSubtitle}>(*: chưa thêm dữ liệu)</Text>

                    <BarChart
                        data={timeDataVisualize}
                        width={screenWidth - 50}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=" giờ"
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                            barPercentage: 0.6, // giảm chiều rộng cột để trông gọn hơn
                            decimalPlaces: 0,
                        }}
                        style={styles.chart}
                        showValuesOnTopOfBars
                    />
                </View>
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Caleries tiêu thụ mỗi ngày</Text>
                    <Text style={styles.chartSubtitle}>(*: chưa thêm dữ liệu)</Text>

                    <BarChart
                        data={activityDataVisualize}
                        width={screenWidth - 50}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=" kcal"
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                            barPercentage: 0.6, // giảm chiều rộng cột để trông gọn hơn
                            decimalPlaces: 0,
                        }}
                        style={styles.chart}
                        showValuesOnTopOfBars
                    />
                </View>

                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Theo dõi Cân nặng</Text>
                    <Text style={styles.chartSubtitle}>(*: chưa thêm dữ liệu)</Text>

                    <LineChart
                        data={weightDataVisualize}
                        width={screenWidth - 50}
                        yAxisSuffix=" kg"
                        height={200}
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(255, 179, 71, ${opacity})`,
                            propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: Colors.secondary,
                            },
                        }}
                        bezier
                        style={styles.chart}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
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
        paddingBottom: 8,
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
