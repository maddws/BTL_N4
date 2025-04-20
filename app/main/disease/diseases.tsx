import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { AlertCircle, ChevronRight, Search } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import { usePetStore } from '@/store/pet-store';
import { db } from '@/config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  getDocs,
} from 'firebase/firestore';

export default function DiseasesScreen() {
  const router = useRouter();
  const { getActivePet } = usePetStore();
  const activePet = getActivePet();

  const [selectedCategory, setSelectedCategory] = useState<
    'Tất cả' | 'Tiêu hóa' | 'Da liễu' | 'Hô hấp' | 'Ký sinh trùng'
  >('Tất cả');
  const [searchText, setSearchText] = useState<string>('');
  const [diseasesList, setDiseasesList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const categories = [
    'Tất cả',
    'Tiêu hóa',
    'Da liễu',
    'Hô hấp',
    'Ký sinh trùng',
  ] as const;

  const fetchDiseases = useCallback(async () => {
    if (!activePet) return;
    setLoading(true);

    try {
      const colRef = collection(db, 'DiseasesLibrary');
      const baseConstraints: any[] = [
        where('petType', 'array-contains', activePet.species),
      ];
      if (selectedCategory !== 'Tất cả') {
        baseConstraints.push(where('category', '==', selectedCategory));
      }

      // 1) Lấy gốc từ Firestore (petType + category)
      const baseQ = query(colRef, ...baseConstraints);
      const snap = await getDocs(baseQ);
      const all = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        // giả sử bạn đã lưu disease_name_lower
        disease_name_lower: (d.data() as any).disease_name_lower,
      }));

      let filtered = all;

      // 2) Nếu có searchText thì filter local
      if (searchText.trim()) {
        const txt = searchText.toLowerCase();
        filtered = all.filter(item =>
          item.disease_name_lower.includes(txt)
        );
      }

      setDiseasesList(filtered);
    } catch (err) {
      console.error('Loi mat roiii:', err);
    } finally {
      setLoading(false);
    }
  }, [activePet, selectedCategory, searchText]);

  useEffect(() => {
    fetchDiseases();
  }, [activePet, selectedCategory, fetchDiseases]);
  const handleSearchPress = () => {
    fetchDiseases();
  };

  const handleDiseasePress = (id: string) => {
    router.push({ pathname: './disease-details', params: { id } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen
        options={{
          title: 'Thư viện bệnh',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <PetSelector />

        {activePet ? (
          <View style={styles.content}>
            {/* Search bar có nút */}
            <View style={styles.searchContainer}>
              <TouchableOpacity onPress={handleSearchPress}>
                <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm bệnh lý..."
                placeholderTextColor={Colors.textLight}
                value={searchText}
                onChangeText={setSearchText}
                returnKeyType="search"
                onSubmitEditing={handleSearchPress}
              />
            </View>

            {/* Loading spinner */}
            {loading && <ActivityIndicator color={Colors.primary} style={{ marginVertical: 8 }} />}

            {/* Categories */}
            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Danh mục</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryItem,
                      selectedCategory === cat && styles.activeCategoryItem,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === cat && styles.activeCategoryText,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Danh sách bệnh */}
            <View style={styles.diseasesContainer}>
              <Text style={styles.sectionTitle}>Bệnh phổ biến</Text>
              {diseasesList.map(d => (
                <TouchableOpacity
                  key={d.id}
                  style={styles.diseaseItem}
                  onPress={() => handleDiseasePress(d.id)}
                >
                  <View style={styles.diseaseIconContainer}>
                    <AlertCircle size={20} color={Colors.error} />
                  </View>
                  <View style={styles.diseaseContent}>
                    <Text style={styles.diseaseName}>{d.disease_name}</Text>
                    <Text style={styles.diseaseDescription} numberOfLines={2}>
                      {Array.isArray(d.symptoms) ? d.symptoms.join(', ') : d.description}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={Colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Phần khẩn cấp */}
            <View style={styles.emergencyContainer}>
              <Text style={styles.emergencyTitle}>Tình trạng khẩn cấp</Text>
              <Text style={styles.emergencyDescription}>
                Các dấu hiệu cần đưa thú cưng đến bác sĩ thú y ngay lập tức
              </Text>
              <View style={styles.emergencyItems}>
                {[
                  'Khó thở',
                  'Co giật',
                  'Chấn thương',
                  'Nôn mửa kéo dài',
                ].map((symptom, idx) => (
                  <View key={idx} style={styles.emergencyItem}>
                    <View style={styles.emergencyIconContainer}>
                      <AlertCircle size={20} color="#fff" />
                    </View>
                    <Text style={styles.emergencyText}>{symptom}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Phần lưu ý */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Lưu ý quan trọng</Text>
              <Text style={styles.infoText}>
                Thông tin trong ứng dụng chỉ mang tính chất tham khảo và không
                thay thế cho tư vấn của bác sĩ thú y. Nếu thú cưng của bạn có
                dấu hiệu bệnh, hãy đưa đến phòng khám thú y ngay lập tức.
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
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
