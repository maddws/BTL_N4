import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

  // State cho category, search text và kết quả query
  const [selectedCategory, setSelectedCategory] = useState<
    'Tất cả' | 'Tiêu hóa' | 'Da liễu' | 'Hô hấp' | 'Ký sinh trùng'
  >('Tất cả');
  const [searchText, setSearchText] = useState<string>('');
  const [diseasesList, setDiseasesList] = useState<any[]>([]);

  const categories = [
    'Tất cả',
    'Tiêu hóa',
    'Da liễu',
    'Hô hấp',
    'Ký sinh trùng',
  ] as const;

  // Mỗi khi activePet, selectedCategory hoặc searchText thay đổi thì query Firestore
  useEffect(() => {
    if (!activePet) {
      setDiseasesList([]);
      return;
    }

    const colRef = collection(db, 'DiseasesLibrary');
    const constraints: any[] = [
      where('petType', 'array-contains', activePet.species),
    ];

    if (selectedCategory !== 'Tất cả') {
      constraints.push(where('category', '==', selectedCategory));
    }

    // nếu có từ khóa thì thêm prefix-search trên field disease_name_lower
    if (searchText.trim()) {
      constraints.push(orderBy('disease_name_lower'));
      constraints.push(startAt(searchText.toLowerCase()));
      constraints.push(endAt(searchText.toLowerCase() + '\uf8ff'));
    }

    const q = query(colRef, ...constraints);

    getDocs(q)
      .then((snap) => {
        setDiseasesList(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      })
      .catch((err) => console.error('Fetch diseases error:', err));
  }, [activePet, selectedCategory, searchText]);

  const handleDiseasePress = (id: string) => {
    router.push({
      pathname: './disease-details',
      params: { id },
    });
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
            {/* Search bar */}
            <View style={styles.searchContainer}>
              <Search
                size={20}
                color={Colors.textLight}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm bệnh lý..."
                placeholderTextColor={Colors.textLight}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Thư viện bệnh lý</Text>
              <Text style={styles.headerSubtitle}>
                Thông tin về các bệnh phổ biến ở{' '}
                {activePet.species === 'dog'
                  ? 'chó'
                  : activePet.species === 'cat'
                  ? 'mèo'
                  : 'thú cưng'}
              </Text>
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Danh mục</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
              >
                {categories.map((cat) => (
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
              {diseasesList.map((d) => (
                <TouchableOpacity
                  key={d.id}
                  style={styles.diseaseItem}
                  onPress={() => handleDiseasePress(d.id)}
                >
                  <View style={styles.diseaseIconContainer}>
                    <AlertCircle size={20} color={Colors.error} />
                  </View>
                  <View style={styles.diseaseContent}>
                    <Text style={styles.diseaseName}>
                      {d.disease_name || d.name}
                    </Text>
                    <Text
                      style={styles.diseaseDescription}
                      numberOfLines={2}
                    >
                      {d.symptoms || d.description}
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
