import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { colors, chartColorPalette } from '../../constants/Colors';
import { BottomNavigation, GuestModal } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Pregunta {
  id?: number;
  identificador: string;
  pregunta: string;
  descripcion?: string;
  categoria_id?: number;
  categoria?: { id: number; nombre: string };
  opciones?: Array<{ valor: number; etiqueta: string }>;
}

interface RespuestaItem {
  valor: number;
  etiqueta: string;
  cantidad?: number;
  porcentaje?: number;
}

interface RespuestasData {
  identificador: string;
  pregunta: string;
  tipo_respuesta: string;
  respuestas: RespuestaItem[];
  total_respuestas: number;
  filtros_aplicados: Record<string, unknown>;
}

interface Filtros {
  calidad_vida?: number;
  municipio?: number;
  sexo?: number;
  edad?: {
    min: number;
    max: number;
  };
  escolaridad?: number;
  nse?: number;
}

export default function SearchScreen() {
  const { isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);
  const [selectedCategoriaNombre, setSelectedCategoriaNombre] = useState<string>('');

  // Estados de filtros
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({});
  const [calidadVida, setCalidadVida] = useState<number | null>(null);
  const [municipio, setMunicipio] = useState<number | null>(null);
  const [sexo, setSexo] = useState<number | null>(null);
  const [edadMin, setEdadMin] = useState<number>(18);
  const [edadMax, setEdadMax] = useState<number>(100);
  const [escolaridad, setEscolaridad] = useState<number | null>(null);
  const [nse, setNse] = useState<number | null>(null);

  // Estados para respuestas
  const [selectedPregunta, setSelectedPregunta] = useState<Pregunta | null>(null);
  const [respuestasData, setRespuestasData] = useState<RespuestasData | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('https://mini-spss-production.up.railway.app/categorias', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setCategorias(data.categorias || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching categorias:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreguntas = async (categoriaId: number, categoriaNombre: string) => {
    try {
      setLoading(true);
      setError('');
      setSelectedCategoriaId(categoriaId);
      setSelectedCategoriaNombre(categoriaNombre);
      const response = await fetch(`https://mini-spss-production.up.railway.app/preguntas/categoria/${categoriaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setPreguntas(data.preguntas || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching preguntas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategoriaId(null);
    setSelectedCategoriaNombre('');
    setPreguntas([]);
    setError('');
  };

  const buildFiltrosJSON = (): Filtros => {
    const nuevosFiltros: Filtros = {};
    
    if (calidadVida !== null) nuevosFiltros.calidad_vida = calidadVida;
    if (municipio !== null) nuevosFiltros.municipio = municipio;
    if (sexo !== null) nuevosFiltros.sexo = sexo;
    if (edadMin > 0 || edadMax < 100) {
      nuevosFiltros.edad = { min: edadMin, max: edadMax };
    }
    if (escolaridad !== null) nuevosFiltros.escolaridad = escolaridad;
    if (nse !== null) nuevosFiltros.nse = nse;
    
    return nuevosFiltros;
  };

  const handleApplyFilters = () => {
    const nuevosFiltros = buildFiltrosJSON();
    setFiltros(nuevosFiltros);
    setShowFilterModal(false);
    console.log('Filtros aplicados:', nuevosFiltros);
  };

  const handleResetFilters = () => {
    setCalidadVida(null);
    setMunicipio(null);
    setSexo(null);
    setEdadMin(18);
    setEdadMax(100);
    setEscolaridad(null);
    setNse(null);
    setFiltros({});
  };

  const fetchRespuestas = async (pregunta: Pregunta) => {
    try {
      setLoading(true);
      setError('');
      setSelectedPregunta(pregunta);
      
      const response = await fetch(
        `https://mini-spss-production.up.railway.app/respuestas/${pregunta.identificador}/filtros`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(filtros),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setRespuestasData(data);
      console.log('Respuestas:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching respuestas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPreguntas = () => {
    setSelectedPregunta(null);
    setRespuestasData(null);
    setError('');
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
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.topSpacer} />
        <View style={styles.topBar}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Búsqueda</Text>
            {selectedPregunta && (
              <TouchableOpacity onPress={handleBackToPreguntas} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Volver a preguntas</Text>
              </TouchableOpacity>
            )}
            {selectedCategoriaId && !selectedPregunta && (
              <TouchableOpacity onPress={handleBackToCategories} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Volver a categorías</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.description}>
              {selectedPregunta ? selectedPregunta.pregunta : selectedCategoriaId ? selectedCategoriaNombre : 'Categorías disponibles'}
            </Text>
          </View>
        </View>

        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <Text style={styles.errorSubText}>Intenta recargar la pantalla</Text>
          </View>
        )}

        {!loading && !selectedCategoriaId && categorias.length > 0 && (
          <View style={styles.listContainer}>
            {categorias.map((categoria) => (
              <TouchableOpacity 
                key={categoria.id} 
                style={styles.categoriaCard}
                onPress={() => fetchPreguntas(categoria.id, categoria.nombre)}
              >
                <Text style={styles.categoriaNombre}>{categoria.nombre}</Text>
                <Text style={styles.categoriaDescripcion}>{categoria.descripcion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!loading && selectedCategoriaId && preguntas.length > 0 && !selectedPregunta && (
          <View style={styles.listContainer}>
            {preguntas.map((pregunta) => (
              <TouchableOpacity 
                key={pregunta.identificador} 
                style={styles.preguntaCard}
                onPress={() => fetchRespuestas(pregunta)}
              >
                <Text style={styles.preguntaText}>{pregunta.pregunta}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!loading && selectedPregunta && respuestasData && (
          <View style={styles.listContainer}>
            <View style={styles.respuestasContainer}>
              <View style={styles.respuestasHeader}>
                <Text style={styles.respuestasTitle}>Resultados</Text>
                <Text style={styles.respuestasInfo}>
                  Total de respuestas: {respuestasData.total_respuestas}
                </Text>
                <Text style={styles.respuestasInfo}>
                  Tipo: {respuestasData.tipo_respuesta}
                </Text>
              </View>

              {respuestasData.respuestas.map((item, index) => {
                const porcentaje = (item.cantidad || 0) / respuestasData.total_respuestas * 100;
                const barColor = chartColorPalette[index % chartColorPalette.length];
                return (
                  <View key={index} style={styles.respuestaItem}>
                    <View style={styles.respuestaRow}>
                      <Text style={styles.respuestaLabel}>{item.etiqueta}</Text>
                      <Text style={[styles.respuestaCount, { color: barColor }]}>
                        {item.cantidad} ({porcentaje.toFixed(1)}%)
                      </Text>
                    </View>
                    <View style={styles.barContainer}>
                      <View
                        style={{
                          width: `${porcentaje}%`,
                          backgroundColor: barColor,
                          height: '100%',
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {!loading && categorias.length === 0 && !selectedCategoriaId && !error && (
          <View style={styles.centerContainer}>
            <Text style={styles.description}>No hay categorías disponibles</Text>
          </View>
        )}

        {!loading && selectedCategoriaId && preguntas.length === 0 && !error && (
          <View style={styles.centerContainer}>
            <Text style={styles.description}>No hay preguntas para esta categoría</Text>
          </View>
        )}
      </ScrollView>

      {!selectedPregunta && (
        <TouchableOpacity 
          style={styles.floatingFilterButton} 
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
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

      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={28} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Filtros</Text>
              <TouchableOpacity onPress={handleResetFilters}>
                <Text style={styles.resetButtonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>

            {/* Calidad de Vida */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Calidad de Vida</Text>
              <View style={styles.filterOptions}>
                {[
                  { label: 'Baja (1-2)', value: 1 },
                  { label: 'Media (3)', value: 2 },
                  { label: 'Alta (4-5)', value: 3 },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOptionButton,
                      calidadVida === option.value && styles.filterOptionButtonActive,
                    ]}
                    onPress={() => setCalidadVida(calidadVida === option.value ? null : option.value)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        calidadVida === option.value && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Municipio */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Municipio</Text>
              <View style={styles.filterOptions}>
                {[
                  { label: 'El Salto', value: 1 },
                  { label: 'Guadalajara', value: 2 },
                  { label: 'San Pedro Tlaquepaque', value: 3 },
                  { label: 'Tlajomulco de Zúñiga', value: 4 },
                  { label: 'Tonalá', value: 5 },
                  { label: 'Zapopan', value: 6 },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOptionButton,
                      municipio === option.value && styles.filterOptionButtonActive,
                    ]}
                    onPress={() => setMunicipio(municipio === option.value ? null : option.value)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        municipio === option.value && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sexo */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Sexo</Text>
              <View style={styles.filterOptions}>
                {[
                  { label: 'Hombre', value: 1 },
                  { label: 'Mujer', value: 2 },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOptionButton,
                      sexo === option.value && styles.filterOptionButtonActive,
                    ]}
                    onPress={() => setSexo(sexo === option.value ? null : option.value)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        sexo === option.value && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Edad */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Edad: {edadMin} - {edadMax} años</Text>
              <View style={styles.ageRangeContainer}>
                <Text style={styles.ageLabel}>Mínima: {edadMin}</Text>
                <ScrollView
                  horizontal
                  style={styles.ageScroll}
                  contentContainerStyle={styles.ageScrollContent}
                >
                  {Array.from({ length: 83 }, (_, i) => i + 18).map((age) => (
                    <TouchableOpacity
                      key={`min-${age}`}
                      style={[
                        styles.ageButton,
                        edadMin === age && styles.ageButtonActive,
                      ]}
                      onPress={() => setEdadMin(age)}
                    >
                      <Text
                        style={[
                          styles.ageButtonText,
                          edadMin === age && styles.ageButtonTextActive,
                        ]}
                      >
                        {age}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.ageRangeContainer}>
                <Text style={styles.ageLabel}>Máxima: {edadMax}</Text>
                <ScrollView
                  horizontal
                  style={styles.ageScroll}
                  contentContainerStyle={styles.ageScrollContent}
                >
                  {Array.from({ length: 83 }, (_, i) => i + 18).map((age) => (
                    <TouchableOpacity
                      key={`max-${age}`}
                      style={[
                        styles.ageButton,
                        edadMax === age && styles.ageButtonActive,
                      ]}
                      onPress={() => setEdadMax(age)}
                    >
                      <Text
                        style={[
                          styles.ageButtonText,
                          edadMax === age && styles.ageButtonTextActive,
                        ]}
                      >
                        {age}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Escolaridad */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Escolaridad</Text>
              <View style={styles.filterOptions}>
                {[
                  { label: 'Secundaria o menos', value: 1 },
                  { label: 'Preparatoria', value: 2 },
                  { label: 'Universidad o más', value: 3 },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOptionButton,
                      escolaridad === option.value && styles.filterOptionButtonActive,
                    ]}
                    onPress={() => setEscolaridad(escolaridad === option.value ? null : option.value)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        escolaridad === option.value && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* NSE */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>NSE (Nivel Socioeconómico)</Text>
              <View style={styles.filterOptions}>
                {[
                  { label: 'D+/D/E', value: 1 },
                  { label: 'C/C-', value: 2 },
                  { label: 'A/B/C+', value: 3 },
                  { label: 'Sin datos suficientes', value: 4 },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOptionButton,
                      nse === option.value && styles.filterOptionButtonActive,
                    ]}
                    onPress={() => setNse(nse === option.value ? null : option.value)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        nse === option.value && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  topSpacer: {
    height: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingFilterButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  backButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
    maxWidth: '90%',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubText: {
    color: '#D32F2F',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  listContainer: {
    width: '100%',
  },
  categoriaCard: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriaNombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  categoriaDescripcion: {
    fontSize: 14,
    color: '#F0F0F0',
    lineHeight: 20,
  },
  preguntaCard: {
    backgroundColor: '#E8F0FE',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  preguntaText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 22,
  },
  preguntaDescripcion: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  // Modal Filtros
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalContent: {
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOptionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  filterOptionButtonActive: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
  },
  ageRangeContainer: {
    marginBottom: 16,
  },
  ageLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ageScroll: {
    flexGrow: 0,
  },
  ageScrollContent: {
    paddingHorizontal: 4,
    gap: 4,
  },
  ageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    minWidth: 40,
    alignItems: 'center',
  },
  ageButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ageButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  ageButtonTextActive: {
    color: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Respuestas
  respuestasContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  respuestasScrollContainer: {
    // Removido maxHeight para permitir scroll completo
  },
  respuestasHeader: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  respuestasTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  respuestasInfo: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  respuestaItem: {
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  respuestaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  respuestaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  respuestaCount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 12,
  },
  barContainer: {
    height: 20,
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
  jsonSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  jsonTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  jsonContent: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    lineHeight: 14,
  },
});
