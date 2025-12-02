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
import { Categoria } from '../services/miniSpssApiService';

interface CategorySelectorProps {
  categorias: Categoria[];
  selectedCategoriaId: number | null;
  onSelectCategoria: (categoria: Categoria) => void;
  loading?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categorias,
  selectedCategoriaId,
  onSelectCategoria,
  loading = false,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una categoría</Text>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryCard,
              selectedCategoriaId === item.id && styles.categoryCardSelected,
            ]}
            onPress={() => onSelectCategoria(item)}
          >
            <Text
              style={[
                styles.categoryName,
                selectedCategoriaId === item.id && styles.categoryNameSelected,
              ]}
            >
              {item.nombre}
            </Text>
            {item.descripcion && (
              <Text
                style={[
                  styles.categoryDescription,
                  selectedCategoriaId === item.id &&
                    styles.categoryDescriptionSelected,
                ]}
              >
                {item.descripcion}
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  categoryCard: {
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
  categoryCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(58, 92, 168, 0.06)', // primaryLight with 6% opacity
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  categoryNameSelected: {
    color: colors.primary,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  categoryDescriptionSelected: {
    color: colors.primaryDark, // Using darker shade for better contrast
  },
});
