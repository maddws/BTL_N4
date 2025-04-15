import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { X, Camera, Upload } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';
import * as ImagePicker from 'expo-image-picker';
import DatePicker from '@/components/DatePicker';

export default function EditMedicalDocumentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { medicalDocuments, pets, updateMedicalDocument } = usePetStore();
  
  const document = medicalDocuments.find(doc => doc.id === id);
  const pet = document ? pets.find(p => p.id === document.petId) : undefined;
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState<'lab_result' | 'prescription' | 'xray' | 'certificate' | 'other'>('lab_result');
  const [description, setDescription] = useState('');
  const [vetName, setVetName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setDate(new Date(document.date));
      setType(document.type);
      setDescription(document.description || '');
      setVetName(document.vetName || '');
      setClinicName(document.clinicName || '');
      setNotes(document.notes || '');
      setImageUrl(document.imageUrl);
    }
  }, [document]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePickImage = async () => {
    if (Platform.OS === 'web') {
      alert('Tính năng này không khả dụng trên web');
      return;
    }

    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Cần quyền truy cập thư viện ảnh để tiếp tục');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    if (Platform.OS === 'web') {
      alert('Tính năng này không khả dụng trên web');
      return;
    }

    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Cần quyền truy cập camera để tiếp tục');
      return;
    }

    // Take photo
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!validateForm() || !document) return;
    
    updateMedicalDocument(document.id, {
      title,
      type,
      date: date.toISOString().split('T')[0],
      description: description.trim() || undefined,
      vetName: vetName.trim() || undefined,
      clinicName: clinicName.trim() || undefined,
      notes: notes.trim() || undefined,
      imageUrl,
    });
    
    router.back();
  };

  if (!document || !pet) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ 
          title: 'Chỉnh sửa tài liệu',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
        }} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy tài liệu</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{ 
        title: 'Chỉnh sửa tài liệu',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
      }} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.petInfo}>
          <Text style={styles.petInfoText}>Thú cưng: <Text style={styles.petName}>{pet.name}</Text></Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tiêu đề *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={title}
              onChangeText={setTitle}
              placeholder="Nhập tiêu đề tài liệu"
              placeholderTextColor={Colors.textLight}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <DatePicker
            label="Ngày *"
            date={date}
            onChange={setDate}
            error={errors.date}
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Loại tài liệu</Text>
            <View style={styles.typeButtonsContainer}>
              <TouchableOpacity 
                style={[styles.typeButton, type === 'lab_result' && styles.activeTypeButton]}
                onPress={() => setType('lab_result')}
              >
                <Text style={[styles.typeButtonText, type === 'lab_result' && styles.activeTypeButtonText]}>
                  Xét nghiệm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeButton, type === 'prescription' && styles.activeTypeButton]}
                onPress={() => setType('prescription')}
              >
                <Text style={[styles.typeButtonText, type === 'prescription' && styles.activeTypeButtonText]}>
                  Đơn thuốc
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeButton, type === 'xray' && styles.activeTypeButton]}
                onPress={() => setType('xray')}
              >
                <Text style={[styles.typeButtonText, type === 'xray' && styles.activeTypeButtonText]}>
                  X-quang
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeButton, type === 'certificate' && styles.activeTypeButton]}
                onPress={() => setType('certificate')}
              >
                <Text style={[styles.typeButtonText, type === 'certificate' && styles.activeTypeButtonText]}>
                  Chứng nhận
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeButton, type === 'other' && styles.activeTypeButton]}
                onPress={() => setType('other')}
              >
                <Text style={[styles.typeButtonText, type === 'other' && styles.activeTypeButtonText]}>
                  Khác
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Nhập mô tả tài liệu"
              placeholderTextColor={Colors.textLight}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Bác sĩ thú y</Text>
            <TextInput
              style={styles.input}
              value={vetName}
              onChangeText={setVetName}
              placeholder="Nhập tên bác sĩ thú y"
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phòng khám</Text>
            <TextInput
              style={styles.input}
              value={clinicName}
              onChangeText={setClinicName}
              placeholder="Nhập tên phòng khám"
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Hình ảnh</Text>
            {imageUrl ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImageUrl(undefined)}
                >
                  <X size={20} color={Colors.card} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imageButtonsContainer}>
                <TouchableOpacity 
                  style={styles.imageButton}
                  onPress={handlePickImage}
                >
                  <Upload size={20} color={Colors.primary} />
                  <Text style={styles.imageButtonText}>Chọn ảnh</Text>
                </TouchableOpacity>
                {Platform.OS !== 'web' && (
                  <TouchableOpacity 
                    style={styles.imageButton}
                    onPress={handleTakePhoto}
                  >
                    <Camera size={20} color={Colors.primary} />
                    <Text style={styles.imageButtonText}>Chụp ảnh</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
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
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    marginBottom: 8,
  },
  activeTypeButton: {
    backgroundColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  activeTypeButtonText: {
    color: Colors.card,
    fontWeight: '500',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
  },
  imageButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.error,
    justifyContent: 'center',
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