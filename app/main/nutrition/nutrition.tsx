import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import { usePetStore } from '@/store/pet-store';
import { getNutritionInfoByPetType } from '@/mocks/nutrition';

export default function NutritionScreen() {
  const { getActivePet } = usePetStore();
  const activePet = getActivePet();
  
  const nutritionInfo = activePet 
    ? getNutritionInfoByPetType(activePet.type)
    : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{ 
        title: 'Dinh dưỡng',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
      }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <PetSelector />

        {activePet && nutritionInfo ? (
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>{nutritionInfo.title}</Text>
                <Text style={styles.subtitle}>Thông tin dinh dưỡng cho {activePet.name}</Text>
              </View>
              <Image 
                source={{ uri: activePet.imageUrl }} 
                style={styles.petImage} 
              />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.description}>{nutritionInfo.description}</Text>
              
              <Text style={styles.sectionTitle}>Thực phẩm khuyến nghị</Text>
              {nutritionInfo.recommendations.map((item, index) => (
                <View key={`rec-${index}`} style={styles.foodItem}>
                  <View style={styles.iconContainer}>
                    <Check size={16} color={Colors.success} />
                  </View>
                  <Text style={styles.foodText}>{item}</Text>
                </View>
              ))}
              
              <Text style={styles.sectionTitle}>Thực phẩm cần tránh</Text>
              {nutritionInfo.restrictions.map((item, index) => (
                <View key={`res-${index}`} style={styles.foodItem}>
                  <View style={[styles.iconContainer, styles.restrictedIcon]}>
                    <X size={16} color={Colors.error} />
                  </View>
                  <Text style={styles.foodText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Mẹo cho ăn</Text>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipNumber}>1</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipHeader}>Cho ăn đúng lượng</Text>
                  <Text style={styles.tipText}>
                    Kiểm soát khẩu phần ăn để tránh thừa cân hoặc suy dinh dưỡng.
                  </Text>
                </View>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipNumber}>2</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipHeader}>Đảm bảo đủ nước</Text>
                  <Text style={styles.tipText}>
                    Luôn cung cấp nước sạch và thay nước thường xuyên.
                  </Text>
                </View>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipNumber}>3</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipHeader}>Thay đổi từ từ</Text>
                  <Text style={styles.tipText}>
                    Khi thay đổi thức ăn, hãy làm từ từ trong 7-10 ngày để tránh rối loạn tiêu hóa.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Vui lòng chọn thú cưng để xem thông tin dinh dưỡng
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
  headerContainer: {
    flexDirection: 'row',
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
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
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
  description: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  restrictedIcon: {
    backgroundColor: Colors.error + '20',
  },
  foodText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  tipsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    color: Colors.card,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipHeader: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textLight,
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