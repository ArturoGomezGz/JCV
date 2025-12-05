import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
  ActivityIndicator,
} from 'react-native';
import {
  BarChart,
  LineChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
  // Bezier Line Chart es una variante del LineChart
  // Area Chart se puede simular con LineChart
} from 'react-native-chart-kit';
import { colors, generateChartColors, generateDatasetColors } from '../constants/Colors';
import { fetchSurveys, SurveyData } from '../services/surveysService';

export interface ChartData {
  name?: string;
  population?: number;
  color?: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

interface ChartPreviewProps {
  type: 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar';
  height?: number;
  surveyData?: SurveyData;
  surveyId?: string; // ID único para identificar la gráfica exacta
}

const ChartPreview: React.FC<ChartPreviewProps> = ({
  type,
  height,
  surveyData,
  surveyId,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(300);
  const [surveyInfo, setSurveyInfo] = useState<{ title: string; category: string }>({
    title: 'Gráfico',
    category: 'General'
  });
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar surveys desde Firebase al montar el componente
  useEffect(() => {
    const loadSurveys = async () => {
      try {
        // Si se proporciona surveyData directamente, usarlo (es el más exacto)
        if (surveyData) {
          setSurveyInfo({
            title: surveyData.title,
            category: surveyData.category
          });
          setSurveys([surveyData]);
          setIsLoading(false);
          return;
        }

        // Si hay surveyId, buscar exactamente ese survey por ID
        if (surveyId) {
          const data = await fetchSurveys();
          const survey = data.find(s => s.id === surveyId);
          if (survey) {
            setSurveyInfo({
              title: survey.title,
              category: survey.category
            });
            setSurveys([survey]);
          } else {
            console.warn(`Survey con ID ${surveyId} no encontrado`);
          }
          setIsLoading(false);
          return;
        }

        // Si no, cargar todos los surveys (caso de compatibilidad hacia atrás)
        const data = await fetchSurveys();
        setSurveys(data);
        
        // Encontrar el survey correspondiente al tipo de gráfico
        const survey = data.find(s => s.chartType === type);
        if (survey) {
          setSurveyInfo({
            title: survey.title,
            category: survey.category
          });
        }
      } catch (error) {
        console.error('Error cargando surveys:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSurveys();
  }, [type, surveyData, surveyId]);

  // Función para generar datos basados en la información del survey
  const generateChartData = (chartType: string) => {
    // Prioridad 1: Si se pasó surveyData directamente, usarlo
    let survey = surveyData;
    
    // Si no, buscar en los surveys cargados
    if (!survey && surveys.length > 0) {
      survey = surveys[0]; // Ya está filtrado en el useEffect
    }
    
    if (!survey || !survey.chartData) {
      return null;
    }

    const data = survey.chartData as any;

    // Adaptamos la estructura simple del JSON a los formatos requeridos por react-native-chart-kit
    switch (chartType) {
      case 'bar':
      case 'line':
      case 'bezierLine':
      case 'areaChart':
      case 'horizontalBar':
        // Manejar tanto datasets únicos como múltiples
        if (data.datasets && Array.isArray(data.datasets)) {
          // Múltiples datasets
          const datasetColors = generateDatasetColors(data.datasets.length);
          return {
            labels: data.labels,
            datasets: data.datasets.map((dataset: any, index: number) => ({
              data: dataset.values,
              color: datasetColors[index].color,
              strokeWidth: chartType === 'bezierLine' ? 4 : 3
            }))
          };
        } else {
          // Dataset único (formato anterior)
          const datasetColors = generateDatasetColors(1);
          return {
            labels: data.labels,
            datasets: [
              {
                data: data.values,
                color: datasetColors[0].color,
                strokeWidth: chartType === 'bezierLine' ? 4 : 3
              }
            ]
          };
        }

      case 'pie':
        // Generar colores automáticamente según la cantidad de categorías
        const pieColors = generateChartColors(data.labels?.length || 0);
        return data.labels?.map((label: string, index: number) => ({
          name: label,
          population: data.values[index],
          color: pieColors[index],
          legendFontColor: '#7F7F7F',
          legendFontSize: 15,
        })) || [];

      case 'progress':
        return {
          labels: data.labels,
          data: data.values?.map((value: number) => value / 100) || [] // Convertir a decimal
        };

      case 'stackedBar':
        // Generar colores automáticamente según la cantidad de series
        const stackedColors = generateChartColors(data.series?.length || 3);
        return {
          labels: data.labels,
          legend: data.series,
          data: data.values,
          barColors: stackedColors
        };

      case 'contribution':
        // Generar fechas para el año basándose en los valores
        const startDate = new Date(data.startDate || '2024-01-01');
        const endDate = new Date(data.endDate || '2024-12-31');
        const values = [];
        
        let valueIndex = 0;
        for (let d = new Date(startDate); d <= endDate && valueIndex < (data.values?.length || 0); d.setDate(d.getDate() + 1)) {
          values.push({
            date: d.toISOString().split('T')[0],
            count: data.values[valueIndex % data.values.length]
          });
          valueIndex++;
        }
        
        return values;

      default:
        return data;
    }
  };

  const chartData = generateChartData(type);
  
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(Math.max(300, width - 60)); // Reducimos el ancho para evitar cortes, mínimo 300
  };

  // Mostrar indicador de carga mientras se cargan los datos
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Altura automática basada en el tipo de gráfico
  const getChartHeight = () => {
    if (height) return height;
    
    switch (type) {
      case 'bar':
      case 'line':
      case 'bezierLine':
      case 'areaChart':
      case 'horizontalBar':
        return 280;
      case 'pie':
        return 380; // Aumentamos para acomodar leyendas debajo sin cortes
      case 'progress':
        return 220;
      case 'contribution':
        return 180; // Más espacio para el heatmap
      case 'stackedBar':
        return 280;
      default:
        return 280;
    }
  };

  const chartHeight = getChartHeight();

  // Configuración base para todos los gráficos
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(28, 54, 107, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(60, 60, 60, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: colors.primary
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid lines
      stroke: "#e0e0e0",
      strokeWidth: 1
    }
  };

  // 📊 Gráfico de Barras
  const renderBarChart = () => {
    const data = chartData as any;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>{surveyInfo.title}</Text>
        <BarChart
          data={data}
          width={containerWidth}
          height={chartHeight}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars
        />
      </View>
    );
  };

  // 📈 Gráfico de Líneas
  const renderLineChart = () => {
    const data = chartData as any;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>{surveyInfo.title}</Text>
        <LineChart
          data={data}
          width={containerWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          style={styles.chart}
          bezier
          withDots
          withInnerLines
          withOuterLines
          withVerticalLabels
          withHorizontalLabels
        />
      </View>
    );
  };

  // 🥧 Gráfico de Pastel
  const renderPieChart = () => {
    const data = chartData as any[];

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>{surveyInfo.title}</Text>
        <PieChart
          data={data}
          width={containerWidth}
          height={chartHeight - 100} // Dejamos más espacio para la leyenda personalizada
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          hasLegend={false} // Deshabilitamos la leyenda interna
          center={[Math.max(10, (containerWidth - 200) / 4), 20]}
          absolute
        />
        {/* Leyenda personalizada debajo con mejor espaciado */}
        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {item.name}: {item.population}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // 📊 Gráfico de Progreso
  const renderProgressChart = () => {
    const data = chartData as any;
    
    // Generar colores automáticamente según la cantidad de elementos
    const progressColors = generateChartColors(data.labels?.length || 4);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>{surveyInfo.title}</Text>
        <ProgressChart
          data={data}
          width={containerWidth}
          height={chartHeight}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1, _index?: number) => {
              const colorIndex = _index || 0;
              const hexColor = progressColors[colorIndex % progressColors.length];
              // Convertir hex a rgba
              const r = parseInt(hexColor.slice(1, 3), 16);
              const g = parseInt(hexColor.slice(3, 5), 16);
              const b = parseInt(hexColor.slice(5, 7), 16);
              return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
          }}
          hideLegend={false}
        />
      </View>
    );
  };

  // � Gráfico de Contribución (Heatmap)
  const renderContributionGraph = () => {
    const data = chartData as any[];
    const endDate = new Date();

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>{surveyInfo.title}</Text>
        <ContributionGraph
          values={data}
          endDate={endDate}
          numDays={105}
          width={containerWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          style={styles.chart}
          tooltipDataAttrs={() => ({})}
        />
      </View>
    );
  };

  // 📊 Gráfico de Barras Apiladas
  const renderStackedBarChart = () => {
    const data = chartData as any;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>{surveyInfo.title}</Text>
        <StackedBarChart
          data={data}
          width={containerWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          style={styles.chart}
          hideLegend={false}
        />
      </View>
    );
  };

  // 📈 Gráfico de Líneas Suaves (Bezier)
  const renderBezierLineChart = () => {
    const data = chartData as any;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>{surveyInfo.title}</Text>
        <LineChart
          data={data}
          width={containerWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          style={styles.chart}
          bezier
          withDots
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels
          withHorizontalLabels
          withShadow={false}
        />
      </View>
    );
  };

  // 📊 Gráfico de Área
  const renderAreaChart = () => {
    const data = chartData as any;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>{surveyInfo.title}</Text>
        <LineChart
          data={data}
          width={containerWidth}
          height={chartHeight}
          chartConfig={{
            ...chartConfig,
            fillShadowGradient: colors.primary,
            fillShadowGradientOpacity: 0.3,
          }}
          style={styles.chart}
          bezier
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels
          withHorizontalLabels
          withShadow
        />
      </View>
    );
  };

  // 📊 Gráfico de Barras por Departamento
  const renderHorizontalBarChart = () => {
    const data = chartData as any;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>{surveyInfo.title}</Text>
        <BarChart
          data={data}
          width={containerWidth}
          height={chartHeight}
          yAxisLabel=""
          yAxisSuffix="%"
          chartConfig={{
            ...chartConfig,
            barPercentage: 0.7,
          }}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars
          verticalLabelRotation={30}
        />
      </View>
    );
  };

  // 🧠 Selector de tipo de gráfico
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      case 'progress':
        return renderProgressChart();
      case 'contribution':
        return renderContributionGraph();
      case 'stackedBar':
        return renderStackedBarChart();
      case 'bezierLine':
        return renderBezierLineChart();
      case 'areaChart':
        return renderAreaChart();
      case 'horizontalBar':
        return renderHorizontalBarChart();
      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Tipo de gráfico no soportado</Text>
          </View>
        );
    }
  };

  return <View style={styles.container} onLayout={handleLayout}>{renderChart()}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    width: '100%',
    paddingHorizontal: 0,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '100%',
    paddingVertical: 40,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    width: '100%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 10,
    marginVertical: 8,
  },
  // Estilos para la leyenda personalizada del pie chart
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ChartPreview;
