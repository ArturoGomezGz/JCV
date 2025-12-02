import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../constants/Colors';
import { Pregunta } from '../services/miniSpssApiService';

interface QuestionListProps {
  preguntas: Pregunta[];
  selectedPreguntaId: string | null;
  onSelectPregunta: (pregunta: Pregunta) => void;
  loading?: boolean;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  preguntas,
  selectedPreguntaId,
  onSelectPregunta,
  loading = false,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </View>
    );
  }

  if (preguntas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No hay preguntas disponibles para esta categoría
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una pregunta</Text>
      <FlatList
        data={preguntas}
        keyExtractor={(item) => item.identificador}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.questionCard,
              selectedPreguntaId === item.identificador &&
                styles.questionCardSelected,
            ]}
            onPress={() => onSelectPregunta(item)}
          >
            <View style={styles.questionHeader}>
              <Text style={styles.questionId}>{item.identificador}</Text>
              {item.categoria && (
                <Text style={styles.categoryBadge}>{item.categoria.nombre}</Text>
              )}
            </View>
            <Text
              style={[
                styles.questionText,
                selectedPreguntaId === item.identificador &&
                  styles.questionTextSelected,
              ]}
            >
              {item.pregunta}
            </Text>
            {item.opciones && item.opciones.length > 0 && (
              <Text style={styles.optionsCount}>
                {item.opciones.length} opciones de respuesta
              </Text>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  questionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(58, 92, 168, 0.06)', // primaryLight with 6% opacity
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionId: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryBadge: {
    fontSize: 11,
    color: colors.primary,
    backgroundColor: 'rgba(58, 92, 168, 0.12)', // primaryLight with 12% opacity
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  questionTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  optionsCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
