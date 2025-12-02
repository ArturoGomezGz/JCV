import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/Colors';
import {
  BottomNavigation,
  GuestModal,
  FilterModal,
  CategorySelector,
  QuestionList,
  ResultsDisplay,
} from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchCategorias,
  fetchPreguntasPorCategoria,
  fetchRespuestasConFiltros,
  Categoria,
  Pregunta,
  Filtros,
  RespuestasResponse,
} from '../../services';

export default function SearchScreen() {
  const { isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Search flow state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [selectedPregunta, setSelectedPregunta] = useState<Pregunta | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({});
  const [results, setResults] = useState<RespuestasResponse | null>(null);
  
  // Loading states
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingPreguntas, setLoadingPreguntas] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  // Current view: 'categories' | 'questions' | 'results'
  const [currentView, setCurrentView] = useState<'categories' | 'questions' | 'results'>('categories');

  // Load categories on mount
  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    setLoadingCategorias(true);
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las categorías. Verifica tu conexión.');
    } finally {
      setLoadingCategorias(false);
    }
  };

  const handleSelectCategoria = async (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setSelectedPregunta(null);
    setResults(null);
    setLoadingPreguntas(true);
    
    try {
      const data = await fetchPreguntasPorCategoria(categoria.id);
      setPreguntas(data);
      setCurrentView('questions');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las preguntas de la categoría.');
    } finally {
      setLoadingPreguntas(false);
    }
  };

  const handleSelectPregunta = async (pregunta: Pregunta) => {
    setSelectedPregunta(pregunta);
    await loadResults(pregunta.identificador, filtros);
  };

  const loadResults = async (questionId: string, appliedFilters: Filtros) => {
    setLoadingResults(true);
    try {
      const data = await fetchRespuestasConFiltros(questionId, appliedFilters);
      setResults(data);
      setCurrentView('results');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los resultados de la pregunta.');
    } finally {
      setLoadingResults(false);
    }
  };

  const handleApplyFilters = (newFilters: Filtros) => {
    setFiltros(newFilters);
    if (selectedPregunta) {
      loadResults(selectedPregunta.identificador, newFilters);
    }
  };

  const handleBack = () => {
    if (currentView === 'results') {
      setCurrentView('questions');
      setResults(null);
    } else if (currentView === 'questions') {
      setCurrentView('categories');
      setSelectedCategoria(null);
      setPreguntas([]);
      setSelectedPregunta(null);
    }
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
      {/* Header with filter button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {currentView !== 'categories' && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Atrás</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.headerTitle}>Búsqueda</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
          disabled={!selectedPregunta}
        >
          <Text style={[
            styles.filterButtonText,
            !selectedPregunta && styles.filterButtonTextDisabled
          ]}>
            Filtros
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {currentView === 'categories' && (
          <CategorySelector
            categorias={categorias}
            selectedCategoriaId={selectedCategoria?.id || null}
            onSelectCategoria={handleSelectCategoria}
            loading={loadingCategorias}
          />
        )}

        {currentView === 'questions' && (
          <QuestionList
            preguntas={preguntas}
            selectedPreguntaId={selectedPregunta?.identificador || null}
            onSelectPregunta={handleSelectPregunta}
            loading={loadingPreguntas}
          />
        )}

        {currentView === 'results' && (
          <ResultsDisplay results={results} loading={loadingResults} />
        )}
      </View>

      <BottomNavigation
        activeTab={activeTab}
        isGuest={isGuest}
        onTabPress={handleTabPress}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filtros}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    width: 80,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    width: 80,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.surface,
  },
  filterButtonTextDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
