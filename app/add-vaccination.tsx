import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';
import DatePicker from '@/components/DatePicker';

export default function AddVaccinationScreen() {
  const router = useRouter();
  const { getActivePet, addVaccination } = usePetStore();
  
  const activePet = getActivePet();
  
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [nextDueDate, setNextDueDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
  const [vetName, setVetName] = useState('');
  const [notes, setNotes] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Vui lòng nhập tên vắc-xin';
    if (!vetName.trim()) newErrors.vetName = 'Vui lòng nhập tên bác sĩ';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !activePet) return;
    
    addVaccination({
      petId: activePet.id,
      name: name.trim(),
      date: date.toISOString().split('T')[0],
      nextDueDate: nextDueDate.toISOString().split('T')[0],
      vetName: vetName.trim(),
      notes: notes.trim() || undefined,
      completed: false
    });
    
    router.back();
  };

  if (!activePet) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ 
          title: 'Thêm lịch tiêm phòng',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
        }} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Vui lòng chọn thú cưng trước</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{ 
        title: 'Thêm lịch tiêm phòng',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
      }} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.petInfo}>
          <Text style={styles.petInfoText}>Thú cưng: <Text style={styles.petName}>{activePet.name}</Text></Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tên vắc-xin *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên vắc-xin"
              placeholderTextColor={Colors.textLight}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <DatePicker
            label="Ngày tiêm *"
            date={date}
            onChange={setDate}
            error={errors.date}
          />

          <DatePicker
            label="Ngày tiêm tiếp theo *"
            date={nextDueDate}
            onChange={setNextDueDate}
            error={errors.nextDueDate}
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tên bác sĩ *</Text>
            <TextInput
              style={[styles.input, errors.vetName && styles.inputError]}
              value={vetName}
              onChangeText={setVetName}
              placeholder="Nhập tên bác sĩ thú y"
              placeholderTextColor={Colors.textLight}
            />
            {errors.vetName && <Text style={styles.errorText}>{errors.vetName}</Text>}
          </View>

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
            <Text style={styles.submitButtonText}>Lưu lịch tiêm phòng</Text>
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