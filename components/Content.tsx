import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { colors } from '../constants/Colors';
import ChartPreview from './ChartPreview';
import BottomNavigation from './BottomNavigation';
import { generateChartAnalysis } from '../services';
import { fetchSurveys, SurveyData } from '../services/surveysService';
import { showSuccessAlert } from '../utils/alertUtils';

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
  onHomePress
}) => {
  
  // Estado para el texto generado por IA
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);
  
  // Efecto para generar el texto con OpenAI al montar el componente
  useEffect(() => {
    const generateAnalysis = async () => {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');
      
      try {
        const analysis = await generateChartAnalysis({
          chartType,
          title,
          category,
          question
        });
        setGeneratedText(analysis);
      } catch (error) {
        console.error('Error generating analysis:', error);
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    generateAnalysis();
  }, [chartType, title]);
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
  const handleExportToPDF = () => {
    if (isGuest) {
      // Si es invitado, mostrar modal
      setShowGuestModal(true);
    } else {
      // Si está logueado, mostrar mensaje de confirmación
      showSuccessAlert(
        `Se ha enviado el reporte PDF a su correo electrónico: ${userEmail}`,
        {
          title: 'Reporte Enviado',
          buttons: [{ text: 'OK', style: 'default' }]
        }
      );
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
          <View style={styles.chartContainer}>
            <ChartPreview 
              type={chartType}
            />
          </View>
          
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
                          question
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
              <Markdown
                style={markdownStyles}
              >
                {generatedText}
              </Markdown>
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