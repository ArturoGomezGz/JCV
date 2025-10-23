import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { colors } from '../constants/Colors';

export interface ChartData {
    x?: string | number;
    y?: number;
    label?: string;
    value?: number;
    percentage?: number;
    color?: string;
}

interface ChartPreviewProps {
    type: 'bar' | 'pie' | 'line' | 'progress' | 'donut';
    data: ChartData[];
    height?: number;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({
    type,
    data,
    height = 120
    }) => {
    const renderBarChart = () => (
        <View style={[styles.chart, { height }]}>
        {data.map((point, index) => (
            <View key={index} style={styles.chartBar}>
            <View 
                style={[
                styles.bar, 
                { height: (point.y || 0) * 4 }
                ]} 
            />
            <Text style={styles.chartLabel}>{point.x}</Text>
            </View>
        ))}
        </View>
    );

    const renderPieChart = () => (
        <View style={styles.pieChart}>
        <View style={styles.pieContainer}>
            {data.map((slice, index) => (
            <View key={index} style={styles.pieSlice}>
                <View 
                style={[
                    styles.pieIndicator, 
                    { backgroundColor: slice.color || colors.primary }
                ]} 
                />
                <Text style={styles.pieLabel}>{slice.label}</Text>
                <Text style={styles.pieValue}>{slice.value}%</Text>
            </View>
            ))}
        </View>
        </View>
    );

    const renderLineChart = () => (
        <View style={[styles.lineChart, { height }]}>
        {data.map((point, index) => (
            <View key={index} style={styles.linePoint}>
            <View 
                style={[
                styles.point, 
                { bottom: (point.y || 0) * 8 }
                ]} 
            />
            <Text style={styles.lineLabel}>{point.x}</Text>
            </View>
        ))}
        <View style={styles.lineConnector} />
        </View>
    );

    const renderProgressChart = () => (
        <View style={styles.progressContainer}>
            {data.map((item, index) => (
                <View key={index} style={styles.progressItem}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>{item.label}</Text>
                    <Text style={styles.progressValue}>{item.percentage}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                    <View 
                    style={[
                        styles.progressBar, 
                        { 
                        width: `${item.percentage || 0}%`,
                        backgroundColor: item.color || colors.primary
                        }
                    ]} 
                    />
                </View>
                </View>
            ))}
        </View>
    );

    const renderDonutChart = () => (
        <View style={styles.donutContainer}>
        <View style={styles.donutChart}>
            <View style={styles.donutCenter}>
            <Text style={styles.donutCenterText}>100%</Text>
            <Text style={styles.donutCenterSubtext}>Total</Text>
            </View>
        </View>
        <View style={styles.donutLegend}>
            {data.map((item, index) => (
            <View key={index} style={styles.donutLegendItem}>
                <View 
                style={[
                    styles.donutLegendColor, 
                    { backgroundColor: item.color || colors.primary }
                ]} 
                />
                <Text style={styles.donutLegendLabel}>{item.label}</Text>
                <Text style={styles.donutLegendValue}>{item.value}%</Text>
            </View>
            ))}
        </View>
        </View>
    );

    const renderChart = () => {
        switch (type) {
        case 'bar':
            return renderBarChart();
        case 'pie':
            return renderPieChart();
        case 'line':
            return renderLineChart();
        case 'progress':
            return renderProgressChart();
        case 'donut':
            return renderDonutChart();
        default:
            return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Tipo de gráfico no soportado</Text>
            </View>
            );
        }
    };

  return (
    <View style={styles.container}>
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Estilos para gráfica de barras
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        backgroundColor: colors.background,
        borderRadius: 8,
        padding: 15,
    },
    chartBar: {
        alignItems: 'center',
        flex: 1,
    },
    bar: {
        backgroundColor: colors.primary,
        width: 20,
        marginBottom: 5,
        borderRadius: 2,
        minHeight: 10,
    },
    chartLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    // Estilos para gráfica de pastel
    pieChart: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    pieContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%',
    },
    pieSlice: {
        alignItems: 'center',
        marginBottom: 15,
        minWidth: '30%',
    },
    pieIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginBottom: 5,
    },
    pieLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    pieValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    // Estilos para gráfica de líneas
    lineChart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        backgroundColor: colors.background,
        borderRadius: 8,
        padding: 15,
        position: 'relative',
    },
    linePoint: {
        alignItems: 'center',
        position: 'relative',
    },
    point: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        position: 'absolute',
    },
    lineLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 10,
    },
    lineConnector: {
        position: 'absolute',
        top: '30%',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: colors.primary,
        opacity: 0.3,
    },
    // Estilos para gráfica de progreso
    progressContainer: {
        paddingVertical: 10,
    },
    progressItem: {
        marginBottom: 15,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    progressLabel: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    progressValue: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: 'bold',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: colors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    // Estilos para gráfica de donut
    donutContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    donutChart: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: 80,
        borderRadius: 40,
        backgroundColor: colors.background,
        borderWidth: 15,
        borderColor: colors.primary,
        marginBottom: 15,
    },
    donutCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    donutCenterText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    donutCenterSubtext: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    donutLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    donutLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        minWidth: '45%',
    },
    donutLegendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    donutLegendLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        flex: 1,
    },
    donutLegendValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    // Error container
    errorContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 14,
        color: colors.textDisabled,
        textAlign: 'center',
    },
});

export default ChartPreview;