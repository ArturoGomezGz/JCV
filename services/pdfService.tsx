/**
 * Servicio para generar reportes PDF de gráficas con análisis de IA
 * Utiliza @react-pdf/renderer para crear PDFs con formato profesional
 */

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Interfaces para las opciones de exportación
export interface PDFExportOptions {
  title: string;
  category: string;
  question: string;
  analysisText: string;
  chartImage: string; // Base64 encoded image
  userEmail: string;
  surveyId: string;
  chartType: 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar';
}

export interface PDFExportResult {
  success: boolean;
  message: string;
  filePath?: string;
  error?: string;
}

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#0066cc',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 10,
  },
  metadata: {
    marginBottom: 20,
  },
  metadataRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    width: 100,
  },
  metadataValue: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 10,
  },
  chartImage: {
    width: '100%',
    maxHeight: 300,
    objectFit: 'contain',
    marginBottom: 20,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#333333',
    marginBottom: 8,
  },
  boldText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#333333',
    marginLeft: 15,
    marginBottom: 5,
  },
  heading2: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
    marginBottom: 8,
  },
  heading3: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
    marginBottom: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#999999',
    fontSize: 9,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10,
  },
});

/**
 * Convierte texto markdown simple a componentes React-PDF
 * Soporta: títulos, negritas, listas, párrafos
 */
const parseMarkdownToPDF = (markdown: string) => {
  const lines = markdown.split('\n');
  const elements: React.ReactElement[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      continue;
    }

    // Detectar títulos
    if (line.startsWith('### ')) {
      elements.push(
        <Text key={`heading3-${key++}`} style={styles.heading3}>
          {line.substring(4)}
        </Text>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <Text key={`heading2-${key++}`} style={styles.heading2}>
          {line.substring(3)}
        </Text>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <Text key={`heading1-${key++}`} style={styles.sectionTitle}>
          {line.substring(2)}
        </Text>
      );
    }
    // Detectar listas con viñetas
    else if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
      elements.push(
        <Text key={`bullet-${key++}`} style={styles.bulletPoint}>
          • {line.substring(2)}
        </Text>
      );
    }
    // Detectar texto en negritas
    else if (line.includes('**')) {
      const cleanText = line.replace(/\*\*/g, '');
      elements.push(
        <Text key={`bold-${key++}`} style={styles.boldText}>
          {cleanText}
        </Text>
      );
    }
    // Párrafo normal
    else {
      elements.push(
        <Text key={`text-${key++}`} style={styles.text}>
          {line}
        </Text>
      );
    }
  }

  return elements;
};

/**
 * Componente de documento PDF
 */
const ChartReportDocument: React.FC<PDFExportOptions> = ({
  title,
  category,
  question,
  analysisText,
  chartImage,
  surveyId,
  chartType,
}) => {
  const parsedAnalysis = parseMarkdownToPDF(analysisText);
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Metadata */}
        <View style={styles.metadata}>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Categoría:</Text>
            <Text style={styles.metadataValue}>{category}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Pregunta:</Text>
            <Text style={styles.metadataValue}>{question}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Tipo de Gráfica:</Text>
            <Text style={styles.metadataValue}>{chartType}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Fecha:</Text>
            <Text style={styles.metadataValue}>{currentDate}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>ID Encuesta:</Text>
            <Text style={styles.metadataValue}>{surveyId}</Text>
          </View>
        </View>

        {/* Chart Image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visualización de Datos</Text>
          <Image
            src={chartImage}
            style={styles.chartImage}
          />
        </View>

        {/* AI Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análisis Generado por IA</Text>
          {parsedAnalysis}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Reporte generado automáticamente - {currentDate}
        </Text>
      </Page>
    </Document>
  );
};

/**
 * Genera y guarda un PDF con los datos de la gráfica y el análisis
 */
export const generateChartPDF = async (
  options: PDFExportOptions
): Promise<PDFExportResult> => {
  try {
    console.log('🔄 Iniciando generación de PDF...');

    // Validar datos requeridos
    if (!options.title || !options.chartImage || !options.analysisText) {
      throw new Error('Faltan datos requeridos para generar el PDF');
    }

    // Generar el documento PDF
    const doc = <ChartReportDocument {...options} />;
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();

    // Convertir blob a base64 para guardarlo
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]); // Remover el prefijo data:application/pdf;base64,
      };
      reader.onerror = reject;
    });
    reader.readAsDataURL(blob);
    const base64data = await base64Promise;

    // Guardar el PDF en el sistema de archivos usando la nueva API
    const fileName = `reporte_${options.surveyId}_${Date.now()}.pdf`;
    const file = new File(Paths.document, fileName);
    
    // Escribir el contenido del PDF
    await file.write(base64data);

    console.log('✅ PDF generado exitosamente:', file.uri);

    // Verificar si podemos compartir
    const canShare = await Sharing.isAvailableAsync();
    
    if (canShare) {
      // Compartir el archivo
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir Reporte PDF',
        UTI: 'com.adobe.pdf',
      });

      return {
        success: true,
        message: 'PDF generado y compartido exitosamente',
        filePath: file.uri,
      };
    } else {
      return {
        success: true,
        message: 'PDF generado exitosamente',
        filePath: file.uri,
      };
    }
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    return {
      success: false,
      message: 'Error al generar el PDF',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
