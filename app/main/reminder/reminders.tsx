import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import ReminderItem from '@/components/ReminderItem';
import { usePetStore } from '@/store/pet-store';

export default function RemindersScreen() {
  const router = useRouter();
  const { getActivePet, getPetReminders } = usePetStore();
  
  const activePet = getActivePet();
  const reminders = activePet ? getPetReminders(activePet.id) : [];

  // Group reminders by date
  const groupedReminders = reminders.reduce((groups, reminder) => {
    const date = reminder.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(reminder);
    return groups;
  }, {} as Record<string, typeof reminders>);

  // Sort dates
  const sortedDates = Object.keys(groupedReminders).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.getTime() === today.getTime()) {
      return "Hôm nay";
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Ngày mai";
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{ 
        title: 'Nhắc nhở chăm sóc',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
      }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <PetSelector />

        {activePet ? (
          <View style={styles.content}>
            <View style={styles.remindersContainer}>
              <View style={styles.remindersHeader}>
                <Text style={styles.remindersTitle}>Danh sách nhắc nhở</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => router.push('/add-reminder')}
                >
                  <Plus size={16} color={Colors.card} />
                </TouchableOpacity>
              </View>

              {sortedDates.length > 0 ? (
                sortedDates.map(date => (
                  <View key={date}>
                    <Text style={styles.dateHeader}>{formatDate(date)}</Text>
                    {groupedReminders[date]
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map(reminder => (
                        <TouchableOpacity 
                          key={reminder.id}
                          onPress={() => router.push({
                            pathname: '/reminder-details',
                            params: { id: reminder.id }
                          })}
                        >
                          <ReminderItem reminder={reminder} />
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  Chưa có nhắc nhở nào. Hãy thêm mới.
                </Text>
              )}
            </View>

            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Mẹo chăm sóc thú cưng</Text>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipHeader}>Cho ăn đúng giờ</Text>
                <Text style={styles.tipText}>
                  Thiết lập lịch cho ăn cố định giúp thú cưng của bạn có thói quen tốt và hệ tiêu hóa khỏe mạnh.
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipHeader}>Tập thể dục thường xuyên</Text>
                <Text style={styles.tipText}>
                  Đảm bảo thú cưng của bạn được vận động đầy đủ mỗi ngày để duy trì sức khỏe và cân nặng lý tưởng.
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipHeader}>Chăm sóc lông</Text>
                <Text style={styles.tipText}>
                  Chải lông thường xuyên giúp giảm rụng lông và ngăn ngừa các vấn đề về da.
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Vui lòng chọn thú cưng để xem nhắc nhở
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
  remindersContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  remindersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  remindersTitle: {
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
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
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
    marginBottom: 16,
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