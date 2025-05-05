// components/statistics/WeightChart.tsx
import { BarChart } from 'react-native-chart-kit';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import Colors from '@/constants/colors';

const w = Dimensions.get('window').width - 32;
const baseConfig = {
    /* chartConfig như cũ */
    backgroundGradientFrom: Colors.card,
    backgroundGradientTo: Colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 111, 165, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: Colors.primary,
    },
};

export default function CaloriesChart({ labels, data }: { labels: string[]; data: number[] }) {
    const timeDataVisualize = {
        labels: labels,
        datasets: [
            {
                data: data,
            },
        ],
    };
    return (
        <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Caleries tiêu thụ mỗi ngày</Text>
            <Text style={styles.chartSubtitle}>(*: chưa thêm dữ liệu)</Text>

            <BarChart
                data={timeDataVisualize}
                width={w - 50}
                height={220}
                yAxisLabel=""
                yAxisSuffix=" kcal"
                chartConfig={{
                    ...baseConfig,
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                    barPercentage: 0.6, // giảm chiều rộng cột để trông gọn hơn
                    decimalPlaces: 0,
                }}
                style={styles.chart}
                showValuesOnTopOfBars
            />
        </View>
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
    chartCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    chartSubtitle: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 16,
    },
    chart: {
        borderRadius: 16,
        marginVertical: 0,
        marginHorizontal: -10,
    },
    activityLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 8,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.card,
    },
    legendText: {
        fontSize: 12,
        color: Colors.textLight,
    },
});
