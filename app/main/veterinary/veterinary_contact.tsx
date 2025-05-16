import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter , useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/colors';
import PetSelector from '@/components/PetSelector';
import { usePetStore } from '@/store/pet-store';
import { getDoctorList , getDoctorById } from '@/store/doctor'; // Giả lập API lấy danh sách bác sĩ
const mockDoctors = [
  {
    id: 'doc1',
    name: 'BS. Nguyễn Văn A',
    clinic: 'Phòng khám Thú Y Sài Gòn',
    specialization: 'Chuyên khoa chó mèo',
    distance: '2.3km',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'doc2',
    name: 'BS. Trần Thị B',
    clinic: 'Thú Y Quận 3',
    specialization: 'Tiêm phòng & tư vấn dinh dưỡng',
    distance: '3.1km',
    avatar: 'https://i.pravatar.cc/150?img=24',
  },
  {
    id: 'doc3',
    name: 'BS. Lê Văn C',
    clinic: 'Phòng khám PetCare',
    specialization: 'Phẫu thuật & điều trị bệnh lý',
    distance: '4.0km',
    avatar: 'https://i.pravatar.cc/150?img=37',
  },
];

export default function VetContactScreen() {
  const router = useRouter();
  const { getActivePet } = usePetStore();
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
      (async () => {
          try {
              const list = await getDoctorList();
              setDoctors(list);
          } catch (err) {
              // xử lý lỗi nếu cần
          }
      })();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen
        options={{
          title: 'Liên hệ thú y',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <PetSelector />

        <View style={styles.content}>
          <View style={styles.sectionContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Bác sĩ gần đây</Text>
            </View>

            {doctors.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={styles.doctorCard}
                onPress={() =>{
                  // console.log('Doctor ID:', doc.id);
                  router.push({ pathname: './book_doctor', params: { doctor_id: doc.id } })
                }
                  // router.push({ pathname: './book_doctor', params: { doctor_id: doc.id } })
                }
              >
                <View style={styles.doctorRow}>
                  <Image source={{ uri: doc.avatar }} style={styles.avatar} />
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{doc.name}</Text>
                    <Text style={styles.doctorDetail}>{doc.clinic}</Text>
                    <Text style={styles.doctorDetail}>{doc.specialization}</Text>
                    <Text style={styles.doctorDistance}>{doc.distance}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Vì sao nên liên hệ bác sĩ thú y?</Text>
            <Text style={styles.infoText}>
              Việc kiểm tra định kỳ và liên hệ với bác sĩ thú y giúp phát hiện sớm các vấn đề sức khỏe, tăng tuổi thọ và nâng cao chất lượng sống cho thú cưng.
            </Text>
          </View>
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
  content: {
    padding: 16,
  },
  sectionContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  doctorCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  doctorDetail: {
    fontSize: 13,
    color: Colors.textLight,
  },
  doctorDistance: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
  infoContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
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
});
