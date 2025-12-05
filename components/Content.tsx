import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import Markdown from 'react-native-markdown-display';
import { colors } from '../constants/Colors';
import ChartPreview from './ChartPreview';
import BottomNavigation from './BottomNavigation';
import { generateChartAnalysis } from '../services';
import { fetchSurveys, fetchSurveyById, SurveyData } from '../services/surveysService';
import { showSuccessAlert } from '../utils/alertUtils';
import { generateChartPDF } from '../services/pdfService';

// Definición de la interfaz TypeScript para las props del componente
interface ContentProps {
  title: string;
  chartType: 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar';
  category: string;
  question: string;
  onBack: () => void;
  isGuest?: boolean;
  userEmail?: string;
  onCreateAccount?: () => void;
  onHomePress?: () => void;
  surveyId?: string; // ID de la encuesta en Firebase para guardar reportes
}

// Componente Content para mostrar los detalles de una gráfica
const Content: React.FC<ContentProps> = ({
  title,
  chartType,
  category,
  question,
  onBack,
  isGuest = false,
  userEmail,
  onCreateAccount,
  onHomePress,
  surveyId
}) => {
  
  // Estado para el texto generado por IA
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);
  const [isSavingToDatabase, setIsSavingToDatabase] = useState<boolean>(false);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  
  // Ref para capturar la gráfica como imagen
  const chartRef = useRef<ViewShot>(null);
  
  // Efecto para cargar los datos del survey
  useEffect(() => {
    const loadSurveyData = async () => {
      try {
        const data = await fetchSurveys();
        const survey = data.find(s => s.chartType === chartType);
        if (survey) {
          setSurveyData(survey);
        }
      } catch (error) {
        console.error('Error cargando datos del survey:', error);
      }
    };

    loadSurveyData();
  }, [chartType]);
  
  // Efecto para generar o cargar el texto del reporte
  useEffect(() => {
    const loadOrGenerateAnalysis = async () => {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');
      setIsSavingToDatabase(false);
      
      try {
        let reportContent: string | null = null;
        
        // Si hay surveyId, intentar obtener el reporte existente
        if (surveyId) {
          try {
            console.log(`🔍 Verificando reporte en caché para surveyId: ${surveyId}`);
            const survey = await fetchSurveyById(surveyId);
            
            // Si el reporte ya existe y no está vacío, utilizarlo
            if (survey && survey.report && survey.report.trim().length > 0) {
              console.log('✓ Usando reporte en caché para:', surveyId);
              reportContent = survey.report;
              setGeneratedText(reportContent);
              setIsLoading(false);
              return;
            }
          } catch (fetchError) {
            console.warn('Error verificando reporte en caché:', fetchError);
          }
        }
        
        // Si no existe reporte, generar uno nuevo
        console.log('🤖 Generando nuevo análisis con IA...');
        const analysis = await generateChartAnalysis({
          chartType,
          title,
          category,
          question,
          surveyId,
          chartData: surveyData?.chartData
        });
        
        if (analysis && analysis.trim().length > 0) {
          console.log('✅ Análisis generado correctamente');
          setGeneratedText(analysis);
          
          // Si se está guardando en BD, mostrar indicador
          if (surveyId) {
            setIsSavingToDatabase(true);
            setTimeout(() => setIsSavingToDatabase(false), 2000);
          }
        } else {
          throw new Error('El análisis generado está vacío');
        }
      } catch (error) {
        console.error('Error generando análisis:', error);
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrGenerateAnalysis();
  }, [chartType, title, surveyId, surveyData]);
  // Estado para almacenar surveys desde Firebase
  const [surveys, setSurveys] = useState<SurveyData[]>([]);

  // Cargar surveys desde Firebase al montar el componente
  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const data = await fetchSurveys();
        setSurveys(data);
      } catch (error) {
        console.error('Error cargando surveys:', error);
      }
    };

    loadSurveys();
  }, []);
  
  // Función para obtener la descripción según el tipo de gráfica
  const getChartDescription = (type: string) => {
    const survey = surveys.find(survey => survey.chartType === type);
    return survey ? survey.description : 'Esta gráfica presenta información importante de manera visual y fácil de interpretar.';
  };

  // Función para manejar la exportación a PDF
  const handleExportToPDF = async () => {
    if (isGuest) {
      // Si es invitado, mostrar modal
      setShowGuestModal(true);
      return;
    }

    // Validar que tenemos todos los datos necesarios
    if (!surveyId || !generatedText || !chartRef.current) {
      Alert.alert(
        'Error',
        'No se pueden exportar los datos. Intenta recargar la página.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    try {
      setIsExportingPDF(true);

      // Capturar la gráfica como imagen
      console.log('📸 Capturando gráfica...');
      
      if (!chartRef.current || !chartRef.current.capture) {
        throw new Error('La referencia a la gráfica no está disponible');
      }
      
      const chartImageUri = await chartRef.current.capture();
      
      if (!chartImageUri) {
        throw new Error('No se pudo capturar la imagen de la gráfica');
      }

      // Generar el PDF con el URI de la imagen
      console.log('📄 Generando PDF...');
      const result = await generateChartPDF({
        title,
        category,
        question,
        analysisText: generatedText,
        chartImageUri: chartImageUri,
        userEmail: userEmail || '',
        surveyId: surveyId || '',
        chartType,
      });

      if (result.success) {
        Alert.alert(
          'Éxito',
          'El reporte PDF se ha generado y compartido exitosamente.',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error exportando a PDF:', error);
      Alert.alert(
        'Error',
        `No se pudo generar el PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Texto preescrito por defecto
  const defaultText = `
Esta es una vista detallada de la gráfica seleccionada. Aquí puedes encontrar información más específica sobre los datos representados.

Los datos mostrados son parte de un análisis completo que incluye métricas importantes para la toma de decisiones. Esta visualización te permite:

• Analizar tendencias y patrones
• Identificar oportunidades de mejora
• Comparar diferentes períodos o categorías
• Obtener insights valiosos para tu negocio

La información se actualiza en tiempo real y refleja los datos más recientes disponibles en el sistema.
  `;

  return (
    <View style={styles.container}>
      {/* Header con botón de retroceso */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Título de la gráfica */}
          <Text style={styles.title}>{title}</Text>
          
          {/* Información de la encuesta */}
          <View style={styles.surveyInfoContainer}>
            <View style={styles.surveyInfoRow}>
              <Text style={styles.surveyInfoLabel}>📊 Categoría:</Text>
              <Text style={styles.surveyInfoValue}>{category}</Text>
            </View>
            <View style={styles.surveyInfoRow}>
              <Text style={styles.surveyInfoLabel}>❓ Pregunta:</Text>
              <Text style={styles.surveyInfoValue}>{question}</Text>
            </View>
          </View>
          
          {/* Contenedor de la gráfica */}
          <ViewShot ref={chartRef} options={{ format: 'png', quality: 1.0 }}>
            <View style={styles.chartContainer}>
              <ChartPreview 
                type={chartType}
              />
            </View>
          </ViewShot>
          
          {/* Descripción de la gráfica */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.descriptionText}>
              {getChartDescription(chartType)}
            </Text>
          </View>
          
          {/* Texto generado por IA */}
          <View style={styles.contentContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Generando análisis...</Text>
              </View>
            ) : hasError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>⚠️ Error al generar análisis</Text>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={() => {
                    setIsLoading(true);
                    setHasError(false);
                    const generateAnalysis = async () => {
                      try {
                        const analysis = await generateChartAnalysis({
                          chartType,
                          title,
                          category,
                          question,
                          surveyId,
                          chartData: surveyData?.chartData
                        });
                        setGeneratedText(analysis);
                        setHasError(false);
                      } catch (error) {
                        setHasError(true);
                        setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
                      } finally {
                        setIsLoading(false);
                      }
                    };
                    generateAnalysis();
                  }}
                >
                  <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {isSavingToDatabase && (
                  <View style={styles.savingIndicator}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.savingText}>Guardando en base de datos...</Text>
                  </View>
                )}
                <Markdown
                  style={markdownStyles}
                >
                  {generatedText}
                </Markdown>

                {/* Botón de exportación a PDF */}
                <TouchableOpacity
                  style={[styles.exportButton, isExportingPDF && styles.exportButtonDisabled]}
                  onPress={handleExportToPDF}
                  disabled={isExportingPDF}
                >
                  {isExportingPDF ? (
                    <>
                      <ActivityIndicator size="small" color={colors.surface} style={{ marginRight: 10 }} />
                      <Text style={styles.exportButtonText}>Generando PDF...</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.exportButtonText}>📄 Exportar a PDF</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal para usuarios invitados */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showGuestModal}
        onRequestClose={() => setShowGuestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚠️ Cuenta Requerida</Text>
            <Text style={styles.modalMessage}>
              Necesitas crear una cuenta para exportar reportes en PDF.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={() => {
                  setShowGuestModal(false);
                  onCreateAccount && onCreateAccount();
                }}
              >
                <Text style={styles.createAccountButtonText}>Crear Cuenta</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowGuestModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavigation 
        activeTab=""
        isGuest={isGuest}
        onCreateAccountPress={onCreateAccount}
        onTabPress={(tabName) => {
          if (tabName === 'home' && onHomePress) {
            onHomePress();
          }
        }}
      />
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  backButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 70, // Mismo ancho que el botón para centrar el título
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  surveyInfoContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  surveyInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  surveyInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    minWidth: 100,
    marginRight: 10,
  },
  surveyInfoValue: {
    flex: 1,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  descriptionContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  contentContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  contentText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 15,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fed7d7',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e53e3e',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#c53030',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  savingText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  exportButtonDisabled: {
    opacity: 0.6,
    backgroundColor: '#999999',
  },
  exportButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'column',
    gap: 16,
    alignItems: 'center',
  },
  createAccountButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createAccountButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  cancelButton: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

// Estilos específicos para Markdown
const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
    marginTop: 20,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 12,
  },
  paragraph: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
  },
  list_item: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 6,
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  strong: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  em: {
    fontStyle: 'italic',
  },
  code_inline: {
    backgroundColor: colors.surface,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  fence: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingLeft: 12,
    marginVertical: 8,
    backgroundColor: colors.surface,
    paddingVertical: 8,
  },
});

export default Content;