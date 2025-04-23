import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Activity } from '@/types/pet';
import { usePetStore } from '@/store/pet-store';

interface ActivityItemProps {
    activity: Activity;
    showPetName?: boolean;
}

const activityTypeIcons = {
    walk: '🚶',
    play: '🎮',
    rest: '😴',
    eat: '🍽️',
    other: '📝',
};

export default function ActivityItem({ activity, showPetName = false }: ActivityItemProps) {
    const { pets } = usePetStore();
    const pet = pets.find((p) => p.id === activity.petId);

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{activityTypeIcons[activity.type]}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.type}>
                    {activity.type === 'walk' && 'Đi dạo'}
                    {activity.type === 'play' && 'Chơi đùa'}
                    {activity.type === 'rest' && 'Nghỉ ngơi'}
                    {activity.type === 'eat' && 'Ăn uống'}
                    {activity.type === 'other' && 'Hoạt động khác'}
                </Text>
                {activity.duration && <Text style={styles.duration}>{activity.duration} phút</Text>}
                {activity.notes && <Text style={styles.notes}>{activity.notes}</Text>}
                <View style={styles.timeContainer}>
                    <Clock size={12} color={Colors.textLight} />
                    <Text style={styles.time}>{activity.time}</Text>
                    {showPetName && pet && <Text style={styles.petName}>• {pet.name}</Text>}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
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
    type: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    duration: {
        fontSize: 13,
        color: Colors.text,
        marginTop: 2,
    },
    notes: {
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
});
