import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';
import DatePicker from '@/components/DatePicker';

type ReminderType = 'feeding' | 'medication' | 'grooming' | 'exercise' | 'vet' | 'other';
type RepeatOption = 'none' | 'daily' | 'weekly' | 'monthly';

interface TypeOption {
    value: ReminderType;
    label: string;
}

interface RepeatOptionItem {
    value: RepeatOption;
    label: string;
}

const reminderTypes: TypeOption[] = [
    { value: 'feeding', label: 'Cho ăn' },
    { value: 'medication', label: 'Thuốc' },
    { value: 'grooming', label: 'Vệ sinh' },
    { value: 'exercise', label: 'Tập thể dục' },
    { value: 'vet', label: 'Khám bác sĩ' },
    { value: 'other', label: 'Khác' },
];

const repeatOptions: RepeatOptionItem[] = [
    { value: 'none', label: 'Không lặp lại' },
    { value: 'daily', label: 'Hàng ngày' },
    { value: 'weekly', label: 'Hàng tuần' },
    { value: 'monthly', label: 'Hàng tháng' },
];

export default function AddReminderScreen() {
    const router = useRouter();
    const { getActivePet, addReminder } = usePetStore();

    const activePet = getActivePet();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('08:00');
    const [type, setType] = useState<ReminderType>('feeding');
    const [repeat, setRepeat] = useState<RepeatOption>('none');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề';
        if (!time.trim()) newErrors.time = 'Vui lòng nhập giờ';
        else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
            newErrors.time = 'Giờ không hợp lệ (HH:MM)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm() || !activePet) return;

        addReminder({
            petId: activePet.id,
            title: title.trim(),
            description: description.trim() || undefined,
            date: date.toISOString().split('T')[0],
            time,
            type,
            repeat,
            completed: false,
        });

        router.back();
    };

    if (!activePet) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Thêm nhắc nhở',
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
                    title: 'Thêm nhắc nhở',
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
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Tiêu đề *</Text>
                        <TextInput
                            style={[styles.input, errors.title && styles.inputError]}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Nhập tiêu đề nhắc nhở"
                            placeholderTextColor={Colors.textLight}
                        />
                        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Mô tả</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Nhập mô tả chi tiết"
                            placeholderTextColor={Colors.textLight}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Loại nhắc nhở *</Text>
                        <View style={styles.optionsContainer}>
                            {reminderTypes.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionButton,
                                        type === option.value && styles.optionButtonActive,
                                    ]}
                                    onPress={() => setType(option.value)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            type === option.value && styles.optionTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.halfWidth]}>
                            <DatePicker
                                label="Ngày *"
                                date={date}
                                onChange={setDate}
                                error={errors.date}
                            />
                        </View>

                        <View style={[styles.formGroup, styles.halfWidth]}>
                            <Text style={styles.label}>Giờ *</Text>
                            <TouchableOpacity style={styles.dateInput}>
                                <TextInput
                                    style={styles.dateInputText}
                                    value={time}
                                    onChangeText={setTime}
                                    placeholder="HH:MM"
                                    placeholderTextColor={Colors.textLight}
                                />
                                <Clock size={20} color={Colors.textLight} />
                            </TouchableOpacity>
                            {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Lặp lại</Text>
                        <View style={styles.optionsContainer}>
                            {repeatOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionButton,
                                        repeat === option.value && styles.optionButtonActive,
                                    ]}
                                    onPress={() => setRepeat(option.value)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            repeat === option.value && styles.optionTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Lưu nhắc nhở</Text>
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
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        marginBottom: 8,
    },
    optionButtonActive: {
        backgroundColor: Colors.primary,
    },
    optionText: {
        fontSize: 14,
        color: Colors.textLight,
    },
    optionTextActive: {
        color: Colors.card,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
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
