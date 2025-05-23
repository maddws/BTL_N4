import React, { useState, useEffect } from 'react';
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
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';
import DatePicker from '@/components/DatePicker';

export default function EditHealthRecordScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { healthRecords, pets, updateHealthRecord } = usePetStore();
    // console.log(id);

    const record = healthRecords.find((r) => r.id === id);
    const pet = record ? pets.find((p) => p.id === record.petId) : undefined;

    const [date, setDate] = useState(new Date());
    const [weight, setWeight] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [notes, setNotes] = useState('');
    const [vetVisit, setVetVisit] = useState(false);
    const [vetName, setVetName] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (record) {
            setDate(new Date(record.date));
            setWeight(record.weight.toString());
            setSymptoms(record.symptoms || '');
            setDiagnosis(record.diagnosis || '');
            setTreatment(record.treatment || '');
            setNotes(record.notes || '');
            setVetVisit(false);
            setVetName(record.vetName || '');
        }
    }, [record]);
    // console.log(record);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!weight.trim()) newErrors.weight = 'Vui lòng nhập cân nặng';
        else if (isNaN(Number(weight))) newErrors.weight = 'Cân nặng phải là số';

        if (vetVisit && !vetName.trim()) newErrors.vetName = 'Vui lòng nhập tên bác sĩ';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm() || !record) return;

        // Cập nhật bản ghi sức khoẻ trong Firestore
        console.log('trying to submit');
        // console.log('idwtffr', record.id);
        await updateHealthRecord(record.id, {
            petId: record.petId,
            date: date.toISOString(),
            weight: Number(weight),
            symptoms: symptoms.trim() || null,
            diagnosis: diagnosis.trim() || null,
            treatment: treatment.trim() || null,
            notes: notes.trim() || null,
            vetVisit: false,
            vetName: vetVisit ? vetName : null,
        });

        router.back(); // Quay lại màn hình trước
    };

    if (!record || !pet) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Chỉnh sửa bản ghi',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: Colors.background },
                    }}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không tìm thấy bản ghi</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Chỉnh sửa bản ghi',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                }}
            />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.petInfo}>
                    <Text style={styles.petInfoText}>
                        Thú cưng: <Text style={styles.petName}>{pet.name}</Text>
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <DatePicker label="Ngày *" date={date} onChange={setDate} error={errors.date} />

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Cân nặng (kg) *</Text>
                        <TextInput
                            style={[styles.input, errors.weight && styles.inputError]}
                            value={weight}
                            onChangeText={setWeight}
                            placeholder="Nhập cân nặng"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="numeric"
                        />
                        {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Triệu chứng</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={symptoms}
                            onChangeText={setSymptoms}
                            placeholder="Nhập các triệu chứng"
                            placeholderTextColor={Colors.textLight}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Chẩn đoán</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={diagnosis}
                            onChangeText={setDiagnosis}
                            placeholder="Nhập chẩn đoán"
                            placeholderTextColor={Colors.textLight}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Điều trị</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={treatment}
                            onChangeText={setTreatment}
                            placeholder="Nhập phương pháp điều trị"
                            placeholderTextColor={Colors.textLight}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Khám bác sĩ thú y</Text>
                            <Switch
                                value={vetVisit}
                                onValueChange={setVetVisit}
                                trackColor={{
                                    false: Colors.border,
                                    true: Colors.primary + '80',
                                }}
                                thumbColor={vetVisit ? Colors.primary : Colors.card}
                            />
                        </View>
                    </View>

                    {vetVisit && (
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Tên bác sĩ *</Text>
                            <TextInput
                                style={[styles.input, errors.vetName && styles.inputError]}
                                value={vetName}
                                onChangeText={setVetName}
                                placeholder="Nhập tên bác sĩ thú y"
                                placeholderTextColor={Colors.textLight}
                            />
                            {errors.vetName && (
                                <Text style={styles.errorText}>{errors.vetName}</Text>
                            )}
                        </View>
                    )}

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Ghi chú</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Nhập ghi chú"
                            placeholderTextColor={Colors.textLight}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Cập nhật</Text>
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
