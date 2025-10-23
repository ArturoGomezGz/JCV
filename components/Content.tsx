import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { colors } from '../constants/Colors';
import ChartPreview from './ChartPreview';
import { generateChartAnalysis } from '../services';

// Definición de la interfaz TypeScript para las props del componente
interface ContentProps {
  title: string;
  chartType: 'bar' | 'pie' | 'line' | 'progress' | 'donut';
  data: any[];
  onBack: () => void;
}

// Componente Content para mostrar los detalles de una gráfica
const Content: React.FC<ContentProps> = ({
  title,
  chartType,
  data,
  onBack
}) => {
  
  // Estado para el texto generado por IA
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
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
          data
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
  }, [chartType, title, data]);
  
  // Función para obtener la descripción según el tipo de gráfica
  const getChartDescription = (type: string) => {
    switch (type) {
      case 'bar':
        return 'Esta gráfica de barras muestra la evolución de datos a lo largo del tiempo. Cada barra representa un período específico y su altura indica el valor correspondiente.';
      case 'pie':
        return 'Esta gráfica circular representa la distribución proporcional de diferentes categorías. Cada sector muestra el porcentaje que representa cada categoría del total.';
      case 'line':
        return 'Esta gráfica de líneas muestra las tendencias y cambios de datos a través del tiempo. Las líneas conectan puntos de datos para revelar patrones y tendencias.';
      case 'progress':
        return 'Esta gráfica de progreso muestra el avance o completitud de diferentes proyectos o tareas. Cada barra indica el porcentaje de progreso alcanzado.';
      case 'donut':
        return 'Esta gráfica de dona es similar a la circular pero con un espacio central vacío. Muestra la distribución de datos de forma clara y visualmente atractiva.';
      default:
        return 'Esta gráfica presenta información importante de manera visual y fácil de interpretar.';
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
          
          {/* Contenedor de la gráfica */}
          <View style={styles.chartContainer}>
            <ChartPreview 
              type={chartType}
              data={data}
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
                          data
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