import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { colors } from '../constants/Colors';
import ChartPreview from './ChartPreview';

interface ChartCardProps {
    title: string;
    chartType: 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar';
    onPress?: () => void;
}

const ChartCard: React.FC<ChartCardProps> = ({
    title,
    chartType,
    onPress
}) => {
    const handlePress = () => {
        if (onPress) {
        onPress();
        }
    };

    return (
        <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.7}
        >
        
        <View style={styles.chartContainer}>
            <ChartPreview 
            type={chartType}
            />
        </View>
        
        <View style={styles.footer}>
            <Text style={styles.tapHint}>Toca para ver más detalles</Text>
        </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
        overflow: 'hidden',
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 5,
    },
    chartContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    tapHint: {
        fontSize: 12,
        color: colors.textDisabled,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default ChartCard;