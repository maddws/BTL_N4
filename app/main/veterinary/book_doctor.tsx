import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/colors';

import { usePetStore } from '@/store/pet-store';
import DatePicker from '@/components/DatePicker';
import TimePicker from '@/components/TimePicker';
import { getDoctorById } from '@/store/doctor';
import { createAppointment } from '@/store/appointment';
import { useSettingsStore } from '@/store/settings-store';
import { useTranslation } from 'react-i18next';

export default function BookDoctorScreen() {
    const language = useSettingsStore((state) => state.language);
    const { i18n, t } = useTranslation();

    useEffect(() => {
        const changeLang = async () => {
            try {
                await i18n.changeLanguage(language);
                console.log('Language changed:', language);
            } catch (err) {
                console.error('Error while changing language:', err);
            }
        };
        if (language) {
            changeLang();
        }
    }, [language, i18n]);

    const router = useRouter();
    const { doctor_id } = useLocalSearchParams();
    const { getActivePet } = usePetStore();
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            const doctor = await getDoctorById(doctor_id as string);
            setSelectedDoctor(doctor);
        };
        fetchDoctor();
    }, []);

    const activePet = getActivePet();

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('09:00');
    const [reason, setReason] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!reason.trim()) newErrors.reason = t('validation.reason');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm() || !activePet) return;

        const payload = {
            petId: activePet?.id || '',
            petName: activePet?.name || '',
            doctor_id: Array.isArray(doctor_id) ? doctor_id[0] : doctor_id || '',
            doctor_name: selectedDoctor?.name || '',
            appointmentDate: date?.toISOString().split('T')[0] || '',
            appointmentTime: time || '',
            reason: reason?.trim() || '',
        };

        createAppointment(payload);
        console.log('Fake booking payload:', payload);

        Alert.alert(t('confirmation.title'), t('confirmation.success'));
        router.back();
    };

    if (!activePet) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: t('booking.title'),
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: Colors.background },
                    }}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{t('empty.selectPet')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: t('booking.title'),
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                }}
            />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.petInfo}>
                    <Text style={styles.petInfoText}>
                        {t('pet.name')}: <Text style={styles.petName}>{activePet.name}</Text>
                    </Text>
                </View>

                <View style={styles.petInfo}>
                    <Text style={styles.petInfoText}>
                        {t('doctor.name')}: <Text style={styles.petName}>{selectedDoctor ? selectedDoctor.name : t('loading.doctorName')}</Text>
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <DatePicker
                        label={`${t('booking.date')} *`}
                        date={date}
                        onChange={setDate}
                        error={errors.date}
                    />

                    <TimePicker
                        label={`${t('booking.time')} *`}
                        time={time}
                        onChange={setTime}
                        error={errors.time}
                    />

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>{t('reason.label')} *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, errors.reason && styles.inputError]}
                            value={reason}
                            onChangeText={setReason}
                            placeholder={t('reason.placeholder')}
                            placeholderTextColor={Colors.textLight}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                        {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>{t('submit.booking')}</Text>
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
