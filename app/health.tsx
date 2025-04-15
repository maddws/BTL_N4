import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Activity, Plus, Weight, Stethoscope, FileText } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import { usePetStore } from '@/store/pet-store';

export default function HealthScreen() {
  const router = useRouter();
  const { getActivePet, getPetHealthRecords } = usePetStore();
  
  const activePet = getActivePet();
  const healthRecords = activePet ? getPetHealthRecords(activePet.id) : [];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{ 
        title: 'Theo dõi sức khỏe',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
      }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <PetSelector />

        {activePet ? (
          <View style={styles.content}>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIconContainer}>
                  <Weight size={20} color={Colors.primary} />
                </View>
                <Text style={styles.summaryTitle}>Cân nặng</Text>
                <Text style={styles.summaryValue}>{activePet.weight} kg</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryIconContainer}>
                  <Activity size={20} color={Colors.primary} />
                </View>
                <Text style={styles.summaryTitle}>Tuổi</Text>
                <Text style={styles.summaryValue}>{activePet.age} tuổi</Text>
              </View>
            </View>

            <View style={styles.recordsContainer}>
              <View style={styles.recordsHeader}>
                <Text style={styles.recordsTitle}>Lịch sử khám bệnh</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => router.push('/add-health-record')}
                >
                  <Plus size={16} color={Colors.card} />
                </TouchableOpacity>
              </View>

              {healthRecords.length > 0 ? (
                healthRecords
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(record => (
                    <TouchableOpacity 
                      key={record.id} 
                      style={styles.recordItem}
                      onPress={() => router.push({
                        pathname: '/health-record-details',
                        params: { id: record.id }
                      })}
                    >
                      <View style={styles.recordIconContainer}>
                        {record.vetVisit ? (
                          <Stethoscope size={20} color={Colors.primary} />
                        ) : (
                          <FileText size={20} color={Colors.primary} />
                        )}
                      </View>
                      <View style={styles.recordContent}>
                        <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
                        <Text style={styles.recordWeight}>Cân nặng: {record.weight} kg</Text>
                        {record.diagnosis && (
                          <Text style={styles.recordDiagnosis} numberOfLines={1}>
                            {record.diagnosis}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
              ) : (
                <Text style={styles.emptyText}>
                  Chưa có dữ liệu sức khỏe. Hãy thêm bản ghi mới.
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Vui lòng chọn thú cưng để xem thông tin sức khỏe
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  recordsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  recordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recordIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordContent: {
    flex: 1,
  },
  recordDate: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  recordWeight: {
    fontSize: 13,
    color: Colors.text,
    marginTop: 2,
  },
  recordDiagnosis: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
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