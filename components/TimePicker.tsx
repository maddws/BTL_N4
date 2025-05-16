import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';

interface TimePickerProps {
    label: string;
    time: string;
    onChange: (time: string) => void;
    error?: string;
}

const TIME_OPTIONS = ['08:00', '10:00', '13:00', '15:00'];

export default function TimePicker({ label, time, onChange, error }: TimePickerProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.optionContainer}>
                {TIME_OPTIONS.map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[
                            styles.option,
                            time === t && styles.selectedOption,
                            error && styles.optionError,
                        ]}
                        onPress={() => onChange(t)}
                    >
                        <Text style={[styles.optionText, time === t && styles.selectedText]}>
                            {t}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 8,
    },
    optionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    option: {
        backgroundColor: Colors.card,
        borderColor: Colors.border,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedOption: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    optionText: {
        fontSize: 14,
        color: Colors.text,
    },
    selectedText: {
        color: Colors.card,
        fontWeight: '600',
    },
    optionError: {
        borderColor: Colors.error,
    },
    errorText: {
        fontSize: 12,
        color: Colors.error,
        marginTop: 4,
    },
});
