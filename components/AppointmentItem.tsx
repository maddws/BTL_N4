import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

type Appointment = {
  id: string;
  doctor_name: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
};

export default function AppointmentItem({ appointment }: { appointment: Appointment }) {
  return (
    <View style={styles.container}>
      <Text style={styles.doctor}>👩‍⚕️ Bác sĩ: {appointment.doctor_name}</Text>
      <Text style={styles.date}>📅 Ngày: {appointment.appointmentDate}</Text>
      <Text style={styles.time}>⏰ Giờ: {appointment.appointmentTime}</Text>
      <Text style={styles.reason}>📌 Lý do: {appointment.reason}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  doctor: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  time: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  reason: {
    fontSize: 14,
    color: Colors.text,
  },
});