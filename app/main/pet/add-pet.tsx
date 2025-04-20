// File: AddPetScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from '@/components/DatePicker';

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
  const { createPetForUser } = usePetStore();

  const [name, setName] = useState('');
  const [type, setType] = useState<PetType>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [photo, setPhoto] = useState('');
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [color, setColor] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Vui lòng nhập tên';
    if (!breed.trim()) newErrors.breed = 'Vui lòng nhập giống';
    if (!age.trim() || isNaN(Number(age))) newErrors.age = 'Tuổi phải là số';
    if (!weight.trim() || isNaN(Number(weight))) newErrors.weight = 'Cân nặng phải là số';
    if (!color.trim()) newErrors.color = 'Vui lòng nhập màu lông';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const userJson = await AsyncStorage.getItem('user');
      const userId = userJson ? JSON.parse(userJson).id : null;
      if (!userId) throw new Error('Không tìm thấy user');

      await createPetForUser(userId, {
        name,
        breed,
        species: type,
        age: Number(age),
        weight: Number(weight),
        gender,
        photo: photo || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
        birthDate: birthDate.toISOString().split('T')[0],
        color,
        microchipId: microchipId || undefined,
        isActive: true,
        imageUrl: photo || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
        vaccinated: false, // Default value, update as needed
      });

      Alert.alert('Thành công', 'Đã thêm thú cưng mới', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể thêm thú cưng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Thêm thú cưng mới',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
        }}
      />
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageWrapper} onPress={pickImage}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Camera size={40} color={Colors.primary} />
                <Text style={styles.placeholderText}>Chọn ảnh</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Tên thú cưng *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.errorInput]}
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên"
            placeholderTextColor={Colors.textLight}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Loại *</Text>
          <View style={styles.options}>
            {petTypes.map(o => (
              <TouchableOpacity
                key={o.value}
                style={[styles.optionBtn, type === o.value && styles.optionActive]}
                onPress={() => setType(o.value)}
              >
                <Text style={[styles.optionTxt, type === o.value && styles.optionTxtActive]}>
                  {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Giống *</Text>
          <TextInput
            style={[styles.input, errors.breed && styles.errorInput]}
            value={breed}
            onChangeText={setBreed}
            placeholder="Nhập giống"
            placeholderTextColor={Colors.textLight}
          />
          {errors.breed && <Text style={styles.errorText}>{errors.breed}</Text>}
        </View>

        <View style={styles.row}>
          <View style={[styles.group, styles.half]}>
            <Text style={styles.label}>Tuổi (năm) *</Text>
            <TextInput
              style={[styles.input, errors.age && styles.errorInput]}
              value={age}
              onChangeText={setAge}
              placeholder="Nhập tuổi"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
            />
            {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
          </View>
          <View style={[styles.group, styles.half]}>
            <Text style={styles.label}>Cân nặng (kg) *</Text>
            <TextInput
              style={[styles.input, errors.weight && styles.errorInput]}
              value={weight}
              onChangeText={setWeight}
              placeholder="Nhập cân nặng"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
            />
            {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Giới tính *</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.genderBtn, gender === 'male' && styles.genderActive]}
              onPress={() => setGender('male')}
            >
              <Text style={[styles.genderTxt, gender === 'male' && styles.genderTxtActive]}>
                Đực
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBtn, gender === 'female' && styles.genderActive]}
              onPress={() => setGender('female')}
            >
              <Text style={[styles.genderTxt, gender === 'female' && styles.genderTxtActive]}>
                Cái
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Ngày sinh</Text>
          <DatePicker date={birthDate} onChange={setBirthDate} />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Màu lông *</Text>
          <TextInput
            style={[styles.input, errors.color && styles.errorInput]}
            value={color}
            onChangeText={setColor}
            placeholder="Nhập màu"
            placeholderTextColor={Colors.textLight}
          />
          {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Mã chip</Text>
          <TextInput
            style={styles.input}
            value={microchipId}
            onChangeText={setMicrochipId}
            placeholder="Nhập mã chip (nếu có)"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {loading
          ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
          : (
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitTxt}>Thêm thú cưng</Text>
            </TouchableOpacity>
          )
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  imageSection: { alignItems: 'center', marginBottom: 24 },
  imageWrapper: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.lightGray, overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center'
  },
  image: { width: '100%', height: '100%' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { marginTop: 8, color: Colors.primary },

  group: { marginBottom: 16 },
  label: { marginBottom: 8, fontSize: 14, fontWeight: '500', color: Colors.text },
  input: {
    backgroundColor: Colors.card, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.border,
    color: Colors.text
  },
  errorInput: { borderColor: Colors.error },
  errorText: { marginTop: 4, color: Colors.error },

  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  half: { flex: 1 },

  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: {
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: Colors.lightGray, borderRadius: 20
  },
  optionActive: { backgroundColor: Colors.primary },
  optionTxt: { color: Colors.textLight },
  optionTxtActive: { color: Colors.card, fontWeight: '500' },

  genderBtn: {
    flex: 1, paddingVertical: 10,
    backgroundColor: Colors.lightGray, borderRadius: 8,
    alignItems: 'center'
  },
  genderActive: { backgroundColor: Colors.primary },
  genderTxt: { color: Colors.textLight },
  genderTxtActive: { color: Colors.card, fontWeight: '500' },

  submitBtn: {
    marginTop: 16, backgroundColor: Colors.primary,
    paddingVertical: 14, borderRadius: 8, alignItems: 'center'
  },
  submitTxt: { color: Colors.card, fontWeight: '600' },
});
