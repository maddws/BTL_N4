import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Camera, Calendar, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';

type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'other';

interface PetTypeOption {
  value: PetType;
  label: string;
}

const petTypes: PetTypeOption[] = [
  { value: 'dog', label: 'Chó' },
  { value: 'cat', label: 'Mèo' },
  { value: 'bird', label: 'Chim' },
  { value: 'fish', label: 'Cá' },
  { value: 'other', label: 'Khác' },
];

export default function AddPetScreen() {
  const router = useRouter();
  const { addPet } = usePetStore();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<PetType>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [imageUrl, setImageUrl] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [color, setColor] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Vui lòng nhập tên thú cưng';
    if (!breed.trim()) newErrors.breed = 'Vui lòng nhập giống thú cưng';
    if (!age.trim()) newErrors.age = 'Vui lòng nhập tuổi';
    else if (isNaN(Number(age))) newErrors.age = 'Tuổi phải là số';
    
    if (!weight.trim()) newErrors.weight = 'Vui lòng nhập cân nặng';
    else if (isNaN(Number(weight))) newErrors.weight = 'Cân nặng phải là số';
    
    if (!color.trim()) newErrors.color = 'Vui lòng nhập màu lông';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    addPet({
      name,
      type,
      breed,
      age: Number(age),
      weight: Number(weight),
      gender,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
      birthDate: birthDate || new Date().toISOString().split('T')[0],
      color,
      microchipId: microchipId || undefined,
      isActive: true
    });
    
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{ 
        title: 'Thêm thú cưng mới',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
      }} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.petImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Camera size={40} color={Colors.primary} />
                <Text style={styles.imagePlaceholderText}>Thêm ảnh</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tên thú cưng *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên thú cưng"
              placeholderTextColor={Colors.textLight}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Loại thú cưng *</Text>
            <View style={styles.optionsContainer}>
              {petTypes.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    type === option.value && styles.optionButtonActive
                  ]}
                  onPress={() => setType(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    type === option.value && styles.optionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Giống *</Text>
            <TextInput
              style={[styles.input, errors.breed && styles.inputError]}
              value={breed}
              onChangeText={setBreed}
              placeholder="Nhập giống thú cưng"
              placeholderTextColor={Colors.textLight}
            />
            {errors.breed && <Text style={styles.errorText}>{errors.breed}</Text>}
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Tuổi (năm) *</Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                value={age}
                onChangeText={setAge}
                placeholder="Nhập tuổi"
                placeholderTextColor={Colors.textLight}
                keyboardType="numeric"
              />
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
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
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Giới tính *</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'male' && styles.genderButtonActive
                ]}
                onPress={() => setGender('male')}
              >
                <Text style={[
                  styles.genderText,
                  gender === 'male' && styles.genderTextActive
                ]}>
                  Đực
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'female' && styles.genderButtonActive
                ]}
                onPress={() => setGender('female')}
              >
                <Text style={[
                  styles.genderText,
                  gender === 'female' && styles.genderTextActive
                ]}>
                  Cái
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ngày sinh</Text>
            <TouchableOpacity style={styles.dateInput}>
              <TextInput
                style={styles.dateInputText}
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textLight}
              />
              <Calendar size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Màu lông *</Text>
            <TextInput
              style={[styles.input, errors.color && styles.inputError]}
              value={color}
              onChangeText={setColor}
              placeholder="Nhập màu lông"
              placeholderTextColor={Colors.textLight}
            />
            {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mã chip (nếu có)</Text>
            <TextInput
              style={styles.input}
              value={microchipId}
              onChangeText={setMicrochipId}
              placeholder="Nhập mã chip"
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Thêm thú cưng</Text>
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
  imageSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: Colors.lightGray,
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
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
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  genderButtonActive: {
    backgroundColor: Colors.primary,
  },
  genderText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  genderTextActive: {
    color: Colors.card,
    fontWeight: '500',
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
});