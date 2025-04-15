import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface DatePickerProps {
  date: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

export default function DatePicker({ 
  date, 
  onChange, 
  label, 
  placeholder = 'Chọn ngày', 
  error 
}: DatePickerProps) {
  const [show, setShow] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    onChange(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={[styles.dateInput, error && styles.inputError]} 
        onPress={showDatepicker}
      >
        <Text style={[
          styles.dateText, 
          date ? styles.dateTextSelected : styles.dateTextPlaceholder
        ]}>
          {date ? formatDate(date) : placeholder}
        </Text>
        <Calendar size={20} color={Colors.textLight} />
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
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
  dateText: {
    fontSize: 14,
  },
  dateTextSelected: {
    color: Colors.text,
  },
  dateTextPlaceholder: {
    color: Colors.textLight,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
});