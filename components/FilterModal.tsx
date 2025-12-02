import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { colors } from '../constants/Colors';
import type { Filtros } from '../services/spssApiService';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filtros: Filtros) => void;
  initialFilters?: Filtros;
}

export default function FilterModal({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
}: FilterModalProps) {
  const [calidadVida, setCalidadVida] = useState(
    initialFilters?.calidad_vida?.toString() || ''
  );
  const [municipio, setMunicipio] = useState(
    initialFilters?.municipio?.toString() || ''
  );
  const [sexo, setSexo] = useState(initialFilters?.sexo?.toString() || '');
  const [edadMin, setEdadMin] = useState(
    initialFilters?.edad?.min?.toString() || ''
  );
  const [edadMax, setEdadMax] = useState(
    initialFilters?.edad?.max?.toString() || ''
  );
  const [escolaridad, setEscolaridad] = useState(
    initialFilters?.escolaridad?.toString() || ''
  );
  const [nse, setNse] = useState(initialFilters?.nse?.toString() || '');

  const handleApply = () => {
    const filtros: Filtros = {};

    // Parse and validate numeric inputs
    const parseNumber = (value: string): number | undefined => {
      if (!value) return undefined;
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? undefined : parsed;
    };

    const calidadVidaNum = parseNumber(calidadVida);
    const municipioNum = parseNumber(municipio);
    const sexoNum = parseNumber(sexo);
    const edadMinNum = parseNumber(edadMin);
    const edadMaxNum = parseNumber(edadMax);
    const escolaridadNum = parseNumber(escolaridad);
    const nseNum = parseNumber(nse);

    if (calidadVidaNum !== undefined) filtros.calidad_vida = calidadVidaNum;
    if (municipioNum !== undefined) filtros.municipio = municipioNum;
    if (sexoNum !== undefined) filtros.sexo = sexoNum;
    if (edadMinNum !== undefined || edadMaxNum !== undefined) {
      filtros.edad = {
        min: edadMinNum ?? 0,
        max: edadMaxNum ?? 0,
      };
    }
    if (escolaridadNum !== undefined) filtros.escolaridad = escolaridadNum;
    if (nseNum !== undefined) filtros.nse = nseNum;

    onApplyFilters(filtros);
    onClose();
  };

  const handleClear = () => {
    setCalidadVida('');
    setMunicipio('');
    setSexo('');
    setEdadMin('');
    setEdadMax('');
    setEscolaridad('');
    setNse('');
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
            <Text style={styles.title}>Aplicar Filtros</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filtersContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.label}>Calidad de Vida</Text>
              <TextInput
                style={styles.input}
                value={calidadVida}
                onChangeText={setCalidadVida}
                keyboardType="numeric"
                placeholder="Ingrese valor"
                placeholderTextColor={colors.textDisabled}
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.label}>Municipio</Text>
              <TextInput
                style={styles.input}
                value={municipio}
                onChangeText={setMunicipio}
                keyboardType="numeric"
                placeholder="Ingrese valor"
                placeholderTextColor={colors.textDisabled}
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.label}>Sexo</Text>
              <TextInput
                style={styles.input}
                value={sexo}
                onChangeText={setSexo}
                keyboardType="numeric"
                placeholder="Ingrese valor"
                placeholderTextColor={colors.textDisabled}
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.label}>Edad</Text>
              <View style={styles.rangeContainer}>
                <TextInput
                  style={[styles.input, styles.rangeInput]}
                  value={edadMin}
                  onChangeText={setEdadMin}
                  keyboardType="numeric"
                  placeholder="Mín"
                  placeholderTextColor={colors.textDisabled}
                />
                <Text style={styles.rangeSeparator}>-</Text>
                <TextInput
                  style={[styles.input, styles.rangeInput]}
                  value={edadMax}
                  onChangeText={setEdadMax}
                  keyboardType="numeric"
                  placeholder="Máx"
                  placeholderTextColor={colors.textDisabled}
                />
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.label}>Escolaridad</Text>
              <TextInput
                style={styles.input}
                value={escolaridad}
                onChangeText={setEscolaridad}
                keyboardType="numeric"
                placeholder="Ingrese valor"
                placeholderTextColor={colors.textDisabled}
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.label}>NSE</Text>
              <TextInput
                style={styles.input}
                value={nse}
                onChangeText={setNse}
                keyboardType="numeric"
                placeholder="Ingrese valor"
                placeholderTextColor={colors.textDisabled}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Limpiar</Text>
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
}

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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  filtersContainer: {
    padding: 20,
  },
  filterGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeInput: {
    flex: 1,
  },
  rangeSeparator: {
    marginHorizontal: 10,
    fontSize: 18,
    color: colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  applyButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});
