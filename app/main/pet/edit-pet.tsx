import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Camera, Calendar } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';
import { db } from '@/config/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'other';
interface PetTypeOption { value: PetType; label: string; }

const petTypes: PetTypeOption[] = [
  { value: 'dog',   label: 'Chó' },
  { value: 'cat',   label: 'Mèo' },
  { value: 'bird',  label: 'Chim' },
  { value: 'fish',  label: 'Cá' },
  { value: 'other', label: 'Khác' },
];

export default function EditPetScreen() {
  const router = useRouter();
  const { petId } = useLocalSearchParams() as { petId: string };
  const { pets, updatePet, deletePet } = usePetStore();

  // find the pet in local store
  const petToEdit = pets.find(p => p.id === petId);

  useEffect(() => {
    if (!petToEdit) {
      Alert.alert('Lỗi', 'Không tìm thấy thú cưng', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  }, [petToEdit]);

  // form state
  const [name,      setName]      = useState(petToEdit?.name        || '');
  const [type,      setType]      = useState<PetType>(petToEdit?.species as PetType || 'dog');
  const [breed,     setBreed]     = useState(petToEdit?.breed       || '');
  const [age,       setAge]       = useState(petToEdit ? String(petToEdit.age)   : '');
  const [weight,    setWeight]    = useState(petToEdit ? String(petToEdit.weight): '');
  const [gender,    setGender]    = useState<'male'|'female'>(petToEdit?.gender || 'male');
  const [photo,     setPhoto]     = useState(petToEdit?.photo       || '');
  const [birthDate, setBirthDate] = useState(petToEdit?.birthDate   || '');
  const [color,     setColor]     = useState(petToEdit?.color       || '');
  const [chip,      setChip]      = useState(petToEdit?.microchipId || '');

  const [errors, setErrors] = useState<Record<string,string>>({});

  // pick image from library
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect:[1,1], quality:1
    });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  // basic validation
  const validate = () => {
    const e: Record<string,string> = {};
    if (!name.trim())  e.name   = 'Nhập tên';
    if (!breed.trim()) e.breed  = 'Nhập giống';
    if (!age.trim() || isNaN(Number(age)))     e.age    = 'Tuổi phải là số';
    if (!weight.trim() || isNaN(Number(weight))) e.weight = 'Cân nặng phải là số';
    if (!color.trim()) e.color  = 'Nhập màu';
    setErrors(e);
    return !Object.keys(e).length;
  };

 // Save changes
 const onSave = async () => {
  if (!validate() || !petId) return;
  try {
    const petRef = doc(db, 'Pets', petId);
    await updateDoc(petRef, {
      name,
      species: type,
      breed,
      age: Number(age),
      weight: Number(weight),
      gender,
      photo,
      birthDate,
      color,
      microchipId: chip,
      isActive: true
    });
    updatePet(petId, {
      name,
      species: type,
      breed,
      age: Number(age),
      weight: Number(weight),
      gender,
      photo,
      birthDate,
      color,
      microchipId: chip,
      isActive: true
    });
    Alert.alert('Thành công', 'Cập nhật thông tin thú cưng thành công', [
      { text: 'OK', onPress: () => router.replace('/') }
    ]);
  } catch (err) {
    console.error(err);
    Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại.');
  }
};

  // delete pet
  const onDelete = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa thú cưng này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            // 1) Xóa UI ngay
            deletePet(petId);
  
            // 2) Xóa Firestore
            try {
              const petRef = doc(db, 'Pets', petId);
              await deleteDoc(petRef);
            } catch (err) {
              console.error('Xóa thất bại:', err);
              Alert.alert('Lỗi', 'Không thể xóa thú cưng. Vui lòng thử lại.');
              return;
            }
  
            // 3) Điều hướng về màn hình chính
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right','left']}>
      <Stack.Screen
        options={{
          title: 'Chỉnh sửa thú cưng',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
        }}
      />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Photo */}
        <TouchableOpacity style={styles.imageWrapper} onPress={pickImage}>
          {photo
            ? <Image source={{uri:photo}} style={styles.image}/>
            : <View style={styles.placeholder}>
                <Camera size={40} color={Colors.primary}/>
                <Text style={styles.placeholderText}>Chọn ảnh</Text>
              </View>
          }
        </TouchableOpacity>

        {/* Name */}
        <View style={styles.group}>
          <Text style={styles.label}>Tên *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.errorInput]}
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên"
            placeholderTextColor={Colors.textLight}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Type */}
        <View style={styles.group}>
          <Text style={styles.label}>Loại *</Text>
          <View style={styles.options}>
            {petTypes.map(o => (
              <TouchableOpacity
                key={o.value}
                style={[styles.optionBtn, type===o.value && styles.optionActive]}
                onPress={()=>setType(o.value)}
              >
                <Text style={[styles.optionTxt, type===o.value && styles.optionTxtActive]}>
                  {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Breed */}
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

        {/* Age & Weight */}
        <View style={styles.row}>
          <View style={[styles.group, styles.half]}>
            <Text style={styles.label}>Tuổi *</Text>
            <TextInput
              style={[styles.input, errors.age && styles.errorInput]}
              value={age}
              onChangeText={setAge}
              placeholder="Năm"
              keyboardType="numeric"
            />
            {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
          </View>
          <View style={[styles.group, styles.half]}>
            <Text style={styles.label}>Cân nặng *</Text>
            <TextInput
              style={[styles.input, errors.weight && styles.errorInput]}
              value={weight}
              onChangeText={setWeight}
              placeholder="Kg"
              keyboardType="numeric"
            />
            {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
          </View>
        </View>

        {/* Gender */}
        <View style={styles.group}>
          <Text style={styles.label}>Giới tính *</Text>
          <View style={styles.row}>
            {(['male','female'] as const).map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.optionBtn, gender===g && styles.optionActive]}
                onPress={()=>setGender(g)}
              >
                <Text style={[styles.optionTxt, gender===g && styles.optionTxtActive]}>
                  {g==='male' ? 'Đực' : 'Cái'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Birth Date */}
        <View style={styles.group}>
          <Text style={styles.label}>Ngày sinh</Text>
          <View style={styles.dateInput}>
            <TextInput
              style={styles.inputFlex}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textLight}
            />
            <Calendar size={20} color={Colors.textLight}/>
          </View>
        </View>

        {/* Color */}
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

        {/* Microchip */}
        <View style={styles.group}>
          <Text style={styles.label}>Mã chip</Text>
          <TextInput
            style={styles.input}
            value={chip}
            onChangeText={setChip}
            placeholder="Nhập mã chip"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveTxt}>Cập nhật thông tin</Text>
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: '#E74C3C', marginTop:12 }]}
          onPress={onDelete}
        >
          <Text style={styles.saveTxt}>Xóa thú cưng</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex:1, backgroundColor:Colors.background },
  scroll:      { padding:16 },
  imageWrapper:{ 
    alignSelf:'center', width:120, height:120, borderRadius:60,
    backgroundColor:Colors.lightGray, overflow:'hidden',
    justifyContent:'center',alignItems:'center',marginBottom:24
  },
  image:       { width:'100%', height:'100%' },
  placeholder: { justifyContent:'center', alignItems:'center' },
  placeholderText:{ marginTop:8, color:Colors.primary },

  group:       { marginBottom:16 },
  row:         { flexDirection:'row', justifyContent:'space-between', gap:12 },
  half:        { flex:1 },
  label:       { fontSize:14,fontWeight:'500',color:Colors.text,marginBottom:8 },
  input:       {
    backgroundColor:Colors.card, borderRadius:8,
    paddingHorizontal:12,paddingVertical:10,
    borderWidth:1,borderColor:Colors.border,
    color:Colors.text
  },
  inputFlex:   { flex:1, color:Colors.text },
  dateInput:   {
    flexDirection:'row', alignItems:'center',
    backgroundColor:Colors.card, borderRadius:8,
    borderWidth:1,borderColor:Colors.border,
    paddingHorizontal:12,paddingVertical:10
  },

  options:     { flexDirection:'row', flexWrap:'wrap', gap:8 },
  optionBtn:   {
    paddingHorizontal:12,paddingVertical:8,
    borderRadius:20, backgroundColor:Colors.lightGray
  },
  optionActive:{ backgroundColor:Colors.primary },
  optionTxt:   { color:Colors.textLight },
  optionTxtActive:{ color:Colors.card, fontWeight:'500' },

  errorInput:  { borderColor:Colors.error },
  errorText:   { color:Colors.error, marginTop:4 },

  saveBtn:     {
    backgroundColor:Colors.primary,
    paddingVertical:14, borderRadius:8,
    alignItems:'center', marginTop:24
  },
  saveTxt:     { color:Colors.card, fontWeight:'600' }
});
