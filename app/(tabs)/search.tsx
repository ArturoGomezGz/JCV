import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/Colors';
import { BottomNavigation, GuestModal, FilterModal } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchCategorias,
  fetchPreguntasByCategoria,
  fetchRespuestasConFiltros,
  type Categoria,
  type Pregunta,
  type Filtros,
  type Respuesta,
} from '../../services/spssApiService';

export default function SearchScreen() {
  const { isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Estado para categorías y preguntas
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [selectedPregunta, setSelectedPregunta] = useState<Pregunta | null>(null);
  const [respuestas, setRespuestas] = useState<Respuesta | null>(null);

  // Estado para filtros
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({});

  // Estado de carga
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);
  const [isLoadingPreguntas, setIsLoadingPreguntas] = useState(false);
  const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    setIsLoadingCategorias(true);
    setError(null);
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar categorías. Intente nuevamente.');
      console.error('Error loading categorias:', err);
    } finally {
      setIsLoadingCategorias(false);
    }
  };

  const handleCategoriaSelect = async (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setSelectedPregunta(null);
    setRespuestas(null);
    setIsLoadingPreguntas(true);
    setError(null);

    try {
      const data = await fetchPreguntasByCategoria(categoria.id);
      setPreguntas(data);
    } catch (err) {
      setError('Error al cargar preguntas. Intente nuevamente.');
      console.error('Error loading preguntas:', err);
    } finally {
      setIsLoadingPreguntas(false);
    }
  };

  const handlePreguntaSelect = async (pregunta: Pregunta) => {
    setSelectedPregunta(pregunta);
    setIsLoadingRespuestas(true);
    setError(null);

    try {
      const data = await fetchRespuestasConFiltros(pregunta.id, filtros);
      setRespuestas(data);
    } catch (err) {
      setError('Error al cargar respuestas. Intente nuevamente.');
      console.error('Error loading respuestas:', err);
    } finally {
      setIsLoadingRespuestas(false);
    }
  };

  const handleApplyFilters = async (newFiltros: Filtros) => {
    setFiltros(newFiltros);
    if (selectedPregunta) {
      setIsLoadingRespuestas(true);
      setError(null);
      try {
        const data = await fetchRespuestasConFiltros(selectedPregunta.id, newFiltros);
        setRespuestas(data);
      } catch (err) {
        setError('Error al aplicar filtros. Intente nuevamente.');
        console.error('Error applying filters:', err);
      } finally {
        setIsLoadingRespuestas(false);
      }
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategoria(null);
    setPreguntas([]);
    setSelectedPregunta(null);
    setRespuestas(null);
  };

  const handleBackToQuestions = () => {
    setSelectedPregunta(null);
    setRespuestas(null);
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
        <Text style={styles.title}>Búsqueda</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>⚙ Filtros</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadCategorias}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Mostrar resultados si hay una pregunta seleccionada */}
        {respuestas && selectedPregunta && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TouchableOpacity
                onPress={handleBackToQuestions}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>← Volver</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>Resultados</Text>
            </View>
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>{selectedPregunta.texto}</Text>
              <View style={styles.jsonContainer}>
                <ScrollView horizontal>
                  <Text style={styles.jsonText}>
                    {JSON.stringify(respuestas, null, 2)}
                  </Text>
                </ScrollView>
              </View>
            </View>
          </View>
        )}

        {/* Mostrar preguntas si hay una categoría seleccionada */}
        {!respuestas && selectedCategoria && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TouchableOpacity
                onPress={handleBackToCategories}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>← Volver</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>
                Preguntas - {selectedCategoria.nombre}
              </Text>
            </View>

            {isLoadingPreguntas ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <View style={styles.itemsContainer}>
                {preguntas.map((pregunta) => (
                  <TouchableOpacity
                    key={pregunta.id}
                    style={styles.item}
                    onPress={() => handlePreguntaSelect(pregunta)}
                  >
                    <Text style={styles.itemText}>{pregunta.texto}</Text>
                    <Text style={styles.itemArrow}>→</Text>
                  </TouchableOpacity>
                ))}
                {preguntas.length === 0 && (
                  <Text style={styles.emptyText}>
                    No hay preguntas disponibles para esta categoría
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Mostrar categorías si no hay ninguna seleccionada */}
        {!selectedCategoria && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seleccionar Categoría</Text>
            
            {isLoadingCategorias ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <View style={styles.itemsContainer}>
                {categorias.map((categoria) => (
                  <TouchableOpacity
                    key={categoria.id}
                    style={styles.item}
                    onPress={() => handleCategoriaSelect(categoria)}
                  >
                    <View style={styles.itemContent}>
                      <Text style={styles.itemText}>{categoria.nombre}</Text>
                      {categoria.descripcion && (
                        <Text style={styles.itemDescription}>
                          {categoria.descripcion}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.itemArrow}>→</Text>
                  </TouchableOpacity>
                ))}
                {categorias.length === 0 && !isLoadingCategorias && (
                  <Text style={styles.emptyText}>
                    No hay categorías disponibles
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {isLoadingRespuestas && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando respuestas...</Text>
          </View>
        )}
      </ScrollView>
      
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

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filtros}
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
    fontSize: 24,
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
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  itemsContainer: {
    gap: 10,
  },
  item: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  itemArrow: {
    fontSize: 20,
    color: colors.primary,
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#FEE',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  errorText: {
    color: '#C00',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 10,
  },
  resultContainer: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  jsonContainer: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    maxHeight: 400,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textPrimary,
  },
});
