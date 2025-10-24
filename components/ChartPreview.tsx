import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
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
import { colors } from '../constants/Colors';
import surveysData from '../data/surveysData.json';

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
}

const ChartPreview: React.FC<ChartPreviewProps> = ({
  type,
  height,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(300);
  
  // Función para obtener datos y título del survey correspondiente
  const getSurveyData = (chartType: string) => {
    const survey = surveysData.surveys.find(s => s.chartType === chartType);
    return {
      title: survey?.title || 'Gráfico',
      category: survey?.category || 'General'
    };
  };

  const surveyInfo = getSurveyData(type);

  // Función para generar datos basados en la información del survey
  const generateChartData = (chartType: string) => {
    const survey = surveysData.surveys.find(s => s.chartType === chartType);
    
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
        return {
          labels: data.labels,
          datasets: [
            {
              data: data.values,
              color: (opacity = 1) => `rgba(28, 54, 107, ${opacity})`,
              strokeWidth: chartType === 'bezierLine' ? 4 : 3
            }
          ]
        };

      case 'pie':
        const colors = ['#1C366B', '#36A2EB', '#FFCE56', '#FF6384', '#FF9F40'];
        return data.labels?.map((label: string, index: number) => ({
          name: label,
          population: data.values[index],
          color: colors[index % colors.length],
          legendFontColor: '#7F7F7F',
          legendFontSize: 15,
        })) || [];

      case 'progress':
        return {
          labels: data.labels,
          data: data.values?.map((value: number) => value / 100) || [] // Convertir a decimal
        };

      case 'stackedBar':
        return {
          labels: data.labels,
          legend: data.series,
          data: data.values,
          barColors: ['#9dcb74ff', '#36A2EB', '#FF6384'],
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
    setContainerWidth(width - 20); // Dejamos un padding de 10px a cada lado
  };

  // Altura automática basada en el tipo de gráfico
  const getChartHeight = () => {
    if (height) return height;
    
    switch (type) {
      case 'bar':
      case 'line':
      case 'bezierLine':
      case 'areaChart':
      case 'horizontalBar':
        return 200;
      case 'pie':
        return 280; // Aumentamos aún más para acomodar leyendas debajo
      case 'progress':
        return 160;
      case 'contribution':
        return 130; // Más compacto para el heatmap
      case 'stackedBar':
        return 200;
      default:
        return 200;
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
          height={chartHeight - 60} // Reducimos altura para dejar espacio a leyendas
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          hasLegend={false} // Deshabilitamos la leyenda interna
          center={[Math.max(10, (containerWidth - 200) / 4), 20]}
          absolute
        />
        {/* Leyenda personalizada debajo */}
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
              const colors = [
                `rgba(28, 54, 107, ${opacity})`,
                `rgba(255, 99, 132, ${opacity})`,
                `rgba(54, 162, 235, ${opacity})`,
                `rgba(255, 206, 86, ${opacity})`
              ];
              return colors[_index || 0];
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
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    width: '100%',
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
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
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
