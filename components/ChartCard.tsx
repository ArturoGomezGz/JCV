import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { colors } from '../constants/Colors';
import ChartPreview from './ChartPreview';
import { fetchSurveys, SurveyData } from '../services/surveysService';

interface ChartCardProps {
    survey: SurveyData;
    onPress?: () => void;
}

const ChartCard: React.FC<ChartCardProps> = ({
    survey,
    onPress
}) => {
    const [isLoading, setIsLoading] = useState(false);

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
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <ChartPreview 
                        type={survey.chartType}
                        surveyData={survey}
                    />
                )}
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
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
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