import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../constants/Colors';
import ChartPreview from './ChartPreview';

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
          
          {/* Texto preescrito */}
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Análisis Detallado</Text>
            <Text style={styles.contentText}>
              {defaultText}
            </Text>
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
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  contentText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});

export default Content;