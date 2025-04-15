import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Reminder } from '@/types/pet';
import { usePetStore } from '@/store/pet-store';

interface ReminderItemProps {
  reminder: Reminder;
  showPetName?: boolean;
}

const reminderTypeIcons = {
  feeding: '🍽️',
  medication: '💊',
  grooming: '✂️',
  exercise: '🏃',
  vet: '🏥',
  other: '📝',
};

export default function ReminderItem({ reminder, showPetName = false }: ReminderItemProps) {
  const { pets, completeReminder } = usePetStore();
  const pet = pets.find(p => p.id === reminder.petId);

  const handleComplete = () => {
    completeReminder(reminder.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{reminderTypeIcons[reminder.type]}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{reminder.title}</Text>
        {reminder.description && (
          <Text style={styles.description}>{reminder.description}</Text>
        )}
        <View style={styles.timeContainer}>
          <Clock size={12} color={Colors.textLight} />
          <Text style={styles.time}>{reminder.time}</Text>
          {showPetName && pet && (
            <Text style={styles.petName}>• {pet.name}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.completeButton, reminder.completed && styles.completedButton]} 
        onPress={handleComplete}
        disabled={reminder.completed}
      >
        <Check size={16} color={reminder.completed ? Colors.card : Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  description: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  petName: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  completeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});