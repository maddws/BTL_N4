import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { AlertCircle, ChevronRight, Search } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import { usePetStore } from '@/store/pet-store';
import { getDiseasesByPetType } from '@/mocks/diseases';

export default function DiseasesScreen() {
  const router = useRouter();
  const { getActivePet } = usePetStore();
  const activePet = getActivePet();
  
  const diseases = activePet 
    ? getDiseasesByPetType(activePet.type)
    : [];

  const handleDiseasePress = (id: string) => {
    router.push({
      pathname: './disease-details',
      params: { id }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{ 
        title: 'Bệnh lý',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
      }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <PetSelector />

        {activePet ? (
          <View style={styles.content}>
            <View style={styles.searchContainer}>
              <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
              <Text style={styles.searchPlaceholder}>Tìm kiếm bệnh lý...</Text>
            </View>

            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Thư viện bệnh lý</Text>
              <Text style={styles.headerSubtitle}>
                Thông tin về các bệnh phổ biến ở {activePet.type === 'dog' ? 'chó' : activePet.type === 'cat' ? 'mèo' : 'thú cưng'}
              </Text>
            </View>

            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Danh mục</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                <TouchableOpacity style={[styles.categoryItem, styles.activeCategoryItem]}>
                  <Text style={[styles.categoryText, styles.activeCategoryText]}>Tất cả</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Text style={styles.categoryText}>Tiêu hóa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Text style={styles.categoryText}>Da liễu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Text style={styles.categoryText}>Hô hấp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Text style={styles.categoryText}>Ký sinh trùng</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <View style={styles.diseasesContainer}>
              <Text style={styles.sectionTitle}>Bệnh phổ biến</Text>
              {diseases.map(disease => (
                <TouchableOpacity 
                  key={disease.id}
                  style={styles.diseaseItem}
                  onPress={() => handleDiseasePress(disease.id)}
                >
                  <View style={styles.diseaseIconContainer}>
                    <AlertCircle size={20} color={Colors.error} />
                  </View>
                  <View style={styles.diseaseContent}>
                    <Text style={styles.diseaseName}>{disease.name}</Text>
                    <Text style={styles.diseaseDescription} numberOfLines={2}>
                      {disease.description}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={Colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.emergencyContainer}>
              <Text style={styles.emergencyTitle}>Tình trạng khẩn cấp</Text>
              <Text style={styles.emergencyDescription}>
                Các dấu hiệu cần đưa thú cưng đến bác sĩ thú y ngay lập tức
              </Text>
              
              <View style={styles.emergencyItems}>
                <View style={styles.emergencyItem}>
                  <View style={styles.emergencyIconContainer}>
                    <AlertCircle size={20} color="#fff" />
                  </View>
                  <Text style={styles.emergencyText}>Khó thở</Text>
                </View>
                <View style={styles.emergencyItem}>
                  <View style={styles.emergencyIconContainer}>
                    <AlertCircle size={20} color="#fff" />
                  </View>
                  <Text style={styles.emergencyText}>Co giật</Text>
                </View>
                <View style={styles.emergencyItem}>
                  <View style={styles.emergencyIconContainer}>
                    <AlertCircle size={20} color="#fff" />
                  </View>
                  <Text style={styles.emergencyText}>Chấn thương</Text>
                </View>
                <View style={styles.emergencyItem}>
                  <View style={styles.emergencyIconContainer}>
                    <AlertCircle size={20} color="#fff" />
                  </View>
                  <Text style={styles.emergencyText}>Nôn mửa kéo dài</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Lưu ý quan trọng</Text>
              <Text style={styles.infoText}>
                Thông tin trong ứng dụng chỉ mang tính chất tham khảo và không thay thế cho tư vấn của bác sĩ thú y. Nếu thú cưng của bạn có dấu hiệu bệnh, hãy đưa đến phòng khám thú y ngay lập tức.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Vui lòng chọn thú cưng để xem thông tin bệnh lý
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: Colors.textLight,
    fontSize: 14,
  },
  headerContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  categoriesScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryItem: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  activeCategoryText: {
    color: Colors.card,
    fontWeight: '500',
  },
  diseasesContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  diseaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  diseaseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  diseaseContent: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  diseaseDescription: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  emergencyContainer: {
    backgroundColor: Colors.error + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  emergencyItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emergencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  emergencyIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: Colors.text,
  },
  infoContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});