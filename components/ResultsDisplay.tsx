import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../constants/Colors';
import { RespuestasResponse } from '../services/miniSpssApiService';

interface ResultsDisplayProps {
  results: RespuestasResponse | null;
  loading?: boolean;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  loading = false,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando resultados...</Text>
      </View>
    );
  }

  if (!results) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Selecciona una pregunta para ver los resultados
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Resultados</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {results.tipo_respuesta === 'cantidad' ? 'Cantidad' : 'Porcentaje'}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Pregunta:</Text>
        <Text style={styles.infoValue}>{results.pregunta}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>ID:</Text>
        <Text style={styles.infoValue}>{results.identificador}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Total de respuestas:</Text>
        <Text style={styles.totalValue}>{results.total_respuestas}</Text>
      </View>

      {results.filtros_aplicados &&
        Object.keys(results.filtros_aplicados).length > 0 && (
          <View style={styles.filtersCard}>
            <Text style={styles.sectionTitle}>Filtros Aplicados</Text>
            <Text style={styles.jsonText}>
              {JSON.stringify(results.filtros_aplicados, null, 2)}
            </Text>
          </View>
        )}

      <View style={styles.resultsCard}>
        <Text style={styles.sectionTitle}>Respuestas</Text>
        {results.respuestas.map((respuesta, index) => (
          <View key={index} style={styles.answerRow}>
            <View style={styles.answerHeader}>
              <Text style={styles.answerLabel}>{respuesta.label}</Text>
              <Text style={styles.answerValue}>
                {results.tipo_respuesta === 'cantidad'
                  ? respuesta.count
                  : `${respuesta.percentage?.toFixed(1)}%`}
              </Text>
            </View>
            {results.tipo_respuesta === 'cantidad' && respuesta.count && (
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(respuesta.count / results.total_respuestas) * 100}%`,
                    },
                  ]}
                />
              </View>
            )}
            {results.tipo_respuesta === 'porcentaje' && respuesta.percentage && (
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${respuesta.percentage}%` },
                  ]}
                />
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.jsonCard}>
        <Text style={styles.sectionTitle}>Datos completos (JSON)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={styles.jsonText}>{JSON.stringify(results, null, 2)}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  filtersCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  resultsCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  answerRow: {
    marginBottom: 16,
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  answerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  jsonCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 18,
  },
});
