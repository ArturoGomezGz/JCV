import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/Colors';
import { BottomNavigation, GuestModal } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchCategorias,
  fetchPreguntasByCategoria,
  fetchRespuestasConFiltros,
  type Categoria,
  type Pregunta,
  type Filtros,
  type RespuestasResult,
} from '../../services';

export default function SearchScreen() {
  const { isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // State for categories and questions
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [selectedPregunta, setSelectedPregunta] = useState<Pregunta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({
    calidad_vida: null,
    municipio: null,
    sexo: null,
    edad: { min: null, max: null },
    escolaridad: null,
    nse: null,
  });

  // State for results
  const [resultados, setResultados] = useState<RespuestasResult | null>(null);

  // Load categories on mount
  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaSelect = async (categoria: Categoria) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCategoria(categoria);
      setSelectedPregunta(null);
      setResultados(null);
      
      const data = await fetchPreguntasByCategoria(categoria.id);
      setPreguntas(data);
    } catch (err) {
      setError('Error al cargar las preguntas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreguntaSelect = async (pregunta: Pregunta) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedPregunta(pregunta);
      
      const data = await fetchRespuestasConFiltros(pregunta.identificador, filtros);
      setResultados(data);
    } catch (err) {
      setError('Error al cargar las respuestas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    setShowFiltersModal(false);
    
    if (selectedPregunta) {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRespuestasConFiltros(selectedPregunta.identificador, filtros);
        setResultados(data);
      } catch (err) {
        setError('Error al aplicar filtros');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetFilters = () => {
    setFiltros({
      calidad_vida: null,
      municipio: null,
      sexo: null,
      edad: { min: null, max: null },
      escolaridad: null,
      nse: null,
    });
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === 'home') {
      if (isGuest) {
        router.replace('/(tabs)/guest');
      } else {
        router.replace('/(tabs)');
      }
    } else if (tabName === 'profile') {
      if (isGuest) {
        setModalMessage('Necesitas crear una cuenta para acceder a la configuración de tu perfil.');
        setShowGuestModal(true);
      } else {
        router.push('/(tabs)/account');
      }
    } else if (tabName === 'chat') {
      if (isGuest) {
        setModalMessage('Necesitas crear una cuenta para acceder al foro de discusión.');
        setShowGuestModal(true);
      } else {
        router.push('/(tabs)/forum');
      }
    }
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/create-account');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Búsqueda de Información</Text>
        {selectedPregunta && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFiltersModal(true)}
          >
            <Text style={styles.filterButtonText}>Filtros</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Selecciona una Categoría</Text>
          <View style={styles.optionsContainer}>
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={[
                  styles.option,
                  selectedCategoria?.id === categoria.id && styles.selectedOption,
                ]}
                onPress={() => handleCategoriaSelect(categoria)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedCategoria?.id === categoria.id && styles.selectedOptionText,
                  ]}
                >
                  {categoria.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Questions Section */}
        {selectedCategoria && preguntas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Selecciona una Pregunta</Text>
            <View style={styles.optionsContainer}>
              {preguntas.map((pregunta) => (
                <TouchableOpacity
                  key={pregunta.identificador}
                  style={[
                    styles.option,
                    selectedPregunta?.identificador === pregunta.identificador &&
                      styles.selectedOption,
                  ]}
                  onPress={() => handlePreguntaSelect(pregunta)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedPregunta?.identificador === pregunta.identificador &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {pregunta.pregunta}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results Section */}
        {resultados && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resultados</Text>
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsJson}>
                {JSON.stringify(resultados, null, 2)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFiltersModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFiltersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Aplicar Filtros</Text>

              <Text style={styles.filterLabel}>Calidad de Vida</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.calidad_vida === 1 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, calidad_vida: 1 })}
                >
                  <Text style={styles.filterOptionText}>Baja (1-2)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.calidad_vida === 2 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, calidad_vida: 2 })}
                >
                  <Text style={styles.filterOptionText}>Media (3)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.calidad_vida === 3 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, calidad_vida: 3 })}
                >
                  <Text style={styles.filterOptionText}>Alta (4-5)</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.filterLabel}>Municipio</Text>
              <View style={styles.filterOptions}>
                {[
                  { id: 1, name: 'El Salto' },
                  { id: 2, name: 'Guadalajara' },
                  { id: 3, name: 'San Pedro Tlaquepaque' },
                  { id: 4, name: 'Tlajomulco de Zúñiga' },
                  { id: 5, name: 'Tonalá' },
                  { id: 6, name: 'Zapopan' },
                ].map((mun) => (
                  <TouchableOpacity
                    key={mun.id}
                    style={[
                      styles.filterOption,
                      filtros.municipio === mun.id && styles.filterOptionSelected,
                    ]}
                    onPress={() => setFiltros({ ...filtros, municipio: mun.id })}
                  >
                    <Text style={styles.filterOptionText}>{mun.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Sexo</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.sexo === 1 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, sexo: 1 })}
                >
                  <Text style={styles.filterOptionText}>Hombre</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.sexo === 2 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, sexo: 2 })}
                >
                  <Text style={styles.filterOptionText}>Mujer</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.filterLabel}>Edad (años)</Text>
              <View style={styles.ageInputContainer}>
                <TextInput
                  style={styles.ageInput}
                  placeholder="Mín"
                  keyboardType="numeric"
                  value={filtros.edad?.min?.toString() || ''}
                  onChangeText={(text) =>
                    setFiltros({
                      ...filtros,
                      edad: { ...filtros.edad, min: text ? parseInt(text) : null },
                    })
                  }
                />
                <Text style={styles.ageInputSeparator}>-</Text>
                <TextInput
                  style={styles.ageInput}
                  placeholder="Máx"
                  keyboardType="numeric"
                  value={filtros.edad?.max?.toString() || ''}
                  onChangeText={(text) =>
                    setFiltros({
                      ...filtros,
                      edad: { ...filtros.edad, max: text ? parseInt(text) : null },
                    })
                  }
                />
              </View>

              <Text style={styles.filterLabel}>Escolaridad</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.escolaridad === 1 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, escolaridad: 1 })}
                >
                  <Text style={styles.filterOptionText}>Sec&lt;</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.escolaridad === 2 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, escolaridad: 2 })}
                >
                  <Text style={styles.filterOptionText}>Prep</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.escolaridad === 3 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, escolaridad: 3 })}
                >
                  <Text style={styles.filterOptionText}>Univ+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.filterLabel}>NSE (Nivel Socioeconómico)</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.nse === 1 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, nse: 1 })}
                >
                  <Text style={styles.filterOptionText}>D+/D/E</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.nse === 2 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, nse: 2 })}
                >
                  <Text style={styles.filterOptionText}>C/C-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.nse === 3 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, nse: 3 })}
                >
                  <Text style={styles.filterOptionText}>A/B/C+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filtros.nse === 4 && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFiltros({ ...filtros, nse: 4 })}
                >
                  <Text style={styles.filterOptionText}>Sin datos</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetFilters}
                >
                  <Text style={styles.resetButtonText}>Limpiar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApplyFilters}
                >
                  <Text style={styles.applyButtonText}>Aplicar</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFiltersModal(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <BottomNavigation
        activeTab={activeTab}
        isGuest={isGuest}
        onTabPress={handleTabPress}
      />
      <GuestModal
        visible={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onCreateAccount={handleCreateAccount}
        message={modalMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  filterButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fee',
    borderRadius: 8,
  },
  errorText: {
    color: '#c00',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    padding: 15,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  selectedOptionText: {
    color: colors.surface,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultsJson: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 15,
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  ageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ageInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
  },
  ageInputSeparator: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 25,
  },
  resetButton: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
