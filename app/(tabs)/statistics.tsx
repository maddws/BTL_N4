import { useActivityStats, useWeightHistory } from '@/hooks/useStatistics';
import { usePetStore } from '@/store/pet-store';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PetSelector from '@/components/PetSelector';
import { getStartAndEnd } from '@/utils/statistics';
import AiSummary from '@/components/statistics/AiSummary';
import TimeChart from '@/components/statistics/TimeChart';
import CaloriesChart from '@/components/statistics/CaloriesChart';
import DatePicker from '@/components/DatePicker';
import WeightChart from '@/components/statistics/WeightChart';
import Colors from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default function StatisticsScreen() {
    const { activePetId, getPetById } = usePetStore();
    const pet = activePetId ? getPetById(activePetId) : null;
    const [date, setDate] = useState(new Date());
    const { start, end } = getStartAndEnd(date);

    const { labels: dataLabels, data: weight } = useWeightHistory(pet?.id!, start, end);
    const { label, kcalData, timeData } = useActivityStats(pet?.id!, pet?.weight || 0, start, end);
    console.log('kcalData', kcalData);
    console.log('timeData', timeData);
    console.log('weightData', weight);

    if (!pet) return null;

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <View style={styles.header}></View>

            <PetSelector />
            <View style={styles.header}>
                <DatePicker date={date} onChange={setDate} />
            </View>
            <ScrollView style={styles.content}>
                <AiSummary petName={pet.name} start={start} end={end} />
                <TimeChart labels={label} data={timeData} />
                <CaloriesChart labels={label} data={kcalData} />
                <WeightChart labels={dataLabels} data={weight} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    periodButton: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        marginHorizontal: 4,
    },
    activePeriodButton: {
        backgroundColor: Colors.primary,
    },
    periodButtonText: {
        fontSize: 14,
        color: Colors.textLight,
    },
    activePeriodButtonText: {
        color: Colors.card,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
});
