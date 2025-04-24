import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';
import DatePicker from '@/components/DatePicker';

const actTypes: any[] = [
    { value: 'walk', label: 'Đi dạo' },
    { value: 'run', label: 'Chạy nhảy ' },
    { value: 'play', label: 'Tương tác' },
    { value: 'sleep', label: 'Ngủ' },
];

export default function AddActivityLogScreen() {
    const router = useRouter();
    const { getActivePet, addActivityLog } = usePetStore();

    const activePet = getActivePet();

    const [date, setDate] = useState(new Date());
    const [activityName, setActivityName] = useState(activePet ? activePet.weight.toString() : '');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!startTime.trim()) newErrors.startTime = 'Vui lòng nhập thời gian bắt đầu';
        else if (!endTime.trim()) newErrors.endTime = 'Vui lòng nhập thời gian kết thúc';
        else newErrors.noContext = 'Xem lại form';

        setErrors(newErrors);
        // return Object.keys(newErrors).length === 0;
        return true;
    };

    const handleSubmit = async () => {
        // console.log('handling', activePet);
        if (!validateForm() || !activePet) return;
        console.log('handling');

        // Lấy dữ liệu từ form và gọi phương thức thêm bản ghi sức khoẻ vào Firestore
        await addActivityLog({
            petId: activePet.id,
            activity_name: type,
            date: date,
            start_time: startTime,
            end_time: endTime,
        });

        router.back(); // Quay lại màn hình trước
    };

    if (!activePet) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Lịch sử hoạt động',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: Colors.background },
                    }}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Vui lòng chọn thú cưng trước</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Lịch sử hoạt động',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                }}
            />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.petInfo}>
                    <Text style={styles.petInfoText}>
                        Thú cưng: <Text style={styles.petName}>{activePet.name}</Text>
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <DatePicker label="Ngày *" date={date} onChange={setDate} error={errors.date} />

                    <View style={styles.group}>
                        <Text style={styles.label}>Loại *</Text>
                        <View style={styles.options}>
                            {actTypes.map((o) => (
                                <TouchableOpacity
                                    key={o.value}
                                    style={[
                                        styles.optionBtn,
                                        type === o.value && styles.optionActive,
                                    ]}
                                    onPress={() => setType(o.value)}
                                >
                                    <Text
                                        style={[
                                            styles.optionTxt,
                                            type === o.value && styles.optionTxtActive,
                                        ]}
                                    >
                                        {o.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.group}>
                        <Text style={styles.label}>Bắt đầu *</Text>
                        <TextInput
                            style={[styles.input]}
                            value={startTime}
                            onChangeText={setStartTime}
                            placeholder="Nhập thời gian bắt đầu"
                            placeholderTextColor={Colors.textLight}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />

                        <Text style={styles.label}>Kết thúc *</Text>
                        <TextInput
                            style={[styles.input]}
                            value={endTime}
                            onChangeText={setEndTime}
                            placeholder="Nhập thời gian kết thúc"
                            placeholderTextColor={Colors.textLight}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Lưu bản ghi</Text>
                    </TouchableOpacity>
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
    group: { marginBottom: 16 },
    options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    optionBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: Colors.lightGray,
        borderRadius: 20,
    },
    optionActive: { backgroundColor: Colors.primary },
    optionTxt: { color: Colors.textLight },
    optionTxtActive: { color: Colors.card, fontWeight: '500' },
    scrollContainer: {
        flex: 1,
    },
    petInfo: {
        backgroundColor: Colors.card,
        padding: 16,
        margin: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    petInfoText: {
        fontSize: 16,
        color: Colors.text,
    },
    petName: {
        fontWeight: 'bold',
        color: Colors.primary,
    },
    formContainer: {
        padding: 16,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.card,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    textArea: {
        minHeight: 80,
        paddingTop: 12,
    },
    inputError: {
        borderColor: Colors.error,
    },
    errorText: {
        fontSize: 12,
        color: Colors.error,
        marginTop: 4,
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.card,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    dateInputText: {
        flex: 1,
        fontSize: 14,
        color: Colors.text,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.card,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center',
    },
});
