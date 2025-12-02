import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { colors } from '../constants/Colors';
import { Filtros, FILTER_LABELS } from '../services/miniSpssApiService';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filtros: Filtros) => void;
  currentFilters: Filtros;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [filtros, setFiltros] = useState<Filtros>(currentFilters);

  const handleApply = () => {
    onApplyFilters(filtros);
    onClose();
  };

  const handleReset = () => {
    setFiltros({});
  };

  const renderFilterSection = (
    title: string,
    options: { [key: number]: string },
    filterKey: keyof Omit<Filtros, 'edad'>
  ) => {
    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>{title}</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              filtros[filterKey] === null && styles.optionButtonSelected,
            ]}
            onPress={() => setFiltros({ ...filtros, [filterKey]: null })}
          >
            <Text
              style={[
                styles.optionText,
                filtros[filterKey] === null && styles.optionTextSelected,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
          {Object.entries(options).map(([key, label]) => {
            const numKey = parseInt(key);
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.optionButton,
                  filtros[filterKey] === numKey && styles.optionButtonSelected,
                ]}
                onPress={() => setFiltros({ ...filtros, [filterKey]: numKey })}
              >
                <Text
                  style={[
                    styles.optionText,
                    filtros[filterKey] === numKey && styles.optionTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {renderFilterSection(
              'Calidad de Vida',
              FILTER_LABELS.calidad_vida,
              'calidad_vida'
            )}

            {renderFilterSection(
              'Municipio',
              FILTER_LABELS.municipio,
              'municipio'
            )}

            {renderFilterSection('Sexo', FILTER_LABELS.sexo, 'sexo')}

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Edad</Text>
              <View style={styles.ageInputContainer}>
                <View style={styles.ageInputWrapper}>
                  <Text style={styles.ageLabel}>Min:</Text>
                  <TextInput
                    style={styles.ageInput}
                    keyboardType="numeric"
                    placeholder="18"
                    value={filtros.edad?.min?.toString() || ''}
                    onChangeText={(text) => {
                      const min = text ? parseInt(text) : null;
                      setFiltros({
                        ...filtros,
                        edad: { min, max: filtros.edad?.max || null },
                      });
                    }}
                  />
                </View>
                <View style={styles.ageInputWrapper}>
                  <Text style={styles.ageLabel}>Max:</Text>
                  <TextInput
                    style={styles.ageInput}
                    keyboardType="numeric"
                    placeholder="65"
                    value={filtros.edad?.max?.toString() || ''}
                    onChangeText={(text) => {
                      const max = text ? parseInt(text) : null;
                      setFiltros({
                        ...filtros,
                        edad: { min: filtros.edad?.min || null, max },
                      });
                    }}
                  />
                </View>
              </View>
            </View>

            {renderFilterSection(
              'Escolaridad',
              FILTER_LABELS.escolaridad,
              'escolaridad'
            )}

            {renderFilterSection('NSE', FILTER_LABELS.nse, 'nse')}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.applyButton]}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
  ageInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  ageInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ageLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  ageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
});
