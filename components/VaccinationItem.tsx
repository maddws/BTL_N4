import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Vaccination } from '@/types/pet';
import { usePetStore } from '@/store/pet-store';

interface VaccinationItemProps {
    vaccination: Vaccination;
    showPetName?: boolean;
}

export default function VaccinationItem({
    vaccination,
    showPetName = false,
}: VaccinationItemProps) {
    const { pets } = usePetStore();
    const pet = pets.find((p) => p.id === vaccination.petId);

    // Calculate days until next vaccination
    const daysUntil = () => {
        const today = new Date();
        const nextDate = new Date(vaccination.nextDueDate);
        const diffTime = nextDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const days = daysUntil();
    const isOverdue = days < 0;
    const isUpcoming = days >= 0 && days <= 7;

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.statusIndicator,
                    isOverdue
                        ? styles.overdueIndicator
                        : isUpcoming
                          ? styles.upcomingIndicator
                          : styles.normalIndicator,
                ]}
            />
            <View style={styles.content}>
                <Text style={styles.name}>{vaccination.name}</Text>
                <View style={styles.detailsContainer}>
                    <Calendar size={12} color={Colors.textLight} />
                    <Text style={styles.date}>
                        {isOverdue
                            ? `Quá hạn ${Math.abs(days)} ngày`
                            : days === 0
                              ? 'Hôm nay'
                              : `${days} ngày nữa`}
                    </Text>
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
    statusIndicator: {
        width: 4,
        borderRadius: 2,
        marginRight: 12,
    },
    overdueIndicator: {
        backgroundColor: Colors.error,
    },
    upcomingIndicator: {
        backgroundColor: Colors.warning,
    },
    normalIndicator: {
        backgroundColor: Colors.success,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    date: {
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
