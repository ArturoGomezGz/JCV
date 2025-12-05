import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

/**
 * Interface for PDF generation parameters
 */
export interface PDFReportData {
  title: string;
  chartType: string;
  category: string;
  question: string;
  analysis: string;
  userEmail?: string;
  date?: Date;
}

/**
 * Generates HTML content for the PDF report with professional design
 */
const generateHTMLContent = (data: PDFReportData): string => {
  const currentDate = data.date || new Date();
  const formattedDate = currentDate.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Convert markdown-like formatting to HTML
  const formatAnalysis = (text: string): string => {
    let html = text
      // Bold text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Handle bullet points by wrapping consecutive items in ul tags
    html = html.replace(/^([•\-*] .+)(\n[•\-*] .+)*/gm, (match) => {
      const items = match
        .split('\n')
        .map(line => line.replace(/^[•\-*] (.+)$/, '<li>$1</li>'))
        .join('\n');
      return `<ul>\n${items}\n</ul>`;
    });

    // Split by paragraphs and wrap them properly
    const paragraphs = html.split('\n\n').filter(p => p.trim());
    html = paragraphs
      .map(p => {
        // Don't wrap headers, lists, or already wrapped elements
        if (p.match(/^<(h[1-3]|ul|ol|div|blockquote)/)) {
          return p;
        }
        // Replace single line breaks within paragraphs
        const content = p.replace(/\n/g, '<br/>');
        return `<p>${content}</p>`;
      })
      .join('\n');

    return html;
  };

  const formattedAnalysis = formatAnalysis(data.analysis);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte - ${data.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 3px solid #007AFF;
    }
    
    .logo-container {
      margin-bottom: 20px;
    }
    
    .logo {
      width: 120px;
      height: auto;
    }
    
    .report-title {
      font-size: 28px;
      font-weight: bold;
      color: #007AFF;
      margin-bottom: 10px;
    }
    
    .report-subtitle {
      font-size: 16px;
      color: #666;
      font-style: italic;
    }
    
    .metadata {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    
    .metadata-row {
      display: flex;
      margin-bottom: 12px;
      align-items: flex-start;
    }
    
    .metadata-row:last-child {
      margin-bottom: 0;
    }
    
    .metadata-label {
      font-weight: bold;
      color: #007AFF;
      min-width: 120px;
      font-size: 14px;
    }
    
    .metadata-value {
      color: #555;
      flex: 1;
      font-size: 14px;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 22px;
      font-weight: bold;
      color: #007AFF;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .content {
      font-size: 14px;
      color: #444;
      line-height: 1.8;
    }
    
    .content p {
      margin-bottom: 12px;
    }
    
    .content h1, .content h2, .content h3 {
      color: #007AFF;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    
    .content h1 {
      font-size: 20px;
    }
    
    .content h2 {
      font-size: 18px;
    }
    
    .content h3 {
      font-size: 16px;
    }
    
    .content ul {
      list-style: none;
      padding-left: 0;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    
    .content li {
      padding-left: 25px;
      position: relative;
      margin-bottom: 8px;
    }
    
    .content li:before {
      content: "•";
      color: #007AFF;
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    
    .content strong {
      color: #222;
      font-weight: 600;
    }
    
    .content em {
      font-style: italic;
      color: #555;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
    
    .footer-info {
      margin-bottom: 8px;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .header {
        page-break-after: avoid;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <!-- Header with Logo -->
  <div class="header">
    <div class="logo-container">
      <!-- Note: For production, replace with actual logo URL or base64 encoded image -->
      <div style="font-size: 48px; color: #007AFF; font-weight: bold;">JCV</div>
    </div>
    <h1 class="report-title">Reporte de Análisis</h1>
    <p class="report-subtitle">Generado el ${formattedDate}</p>
  </div>

  <!-- Metadata Section -->
  <div class="metadata">
    <div class="metadata-row">
      <span class="metadata-label">📊 Título:</span>
      <span class="metadata-value">${data.title}</span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">📈 Tipo de Gráfica:</span>
      <span class="metadata-value">${data.chartType}</span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">🏷️ Categoría:</span>
      <span class="metadata-value">${data.category}</span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">❓ Pregunta:</span>
      <span class="metadata-value">${data.question}</span>
    </div>
    ${data.userEmail ? `
    <div class="metadata-row">
      <span class="metadata-label">👤 Usuario:</span>
      <span class="metadata-value">${data.userEmail}</span>
    </div>
    ` : ''}
  </div>

  <!-- Analysis Section -->
  <div class="section">
    <h2 class="section-title">Análisis e Interpretación</h2>
    <div class="content">
      ${formattedAnalysis}
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-info">
      <strong>JCV Analytics Platform</strong>
    </div>
    <div class="footer-info">
      Este reporte ha sido generado automáticamente por el sistema de análisis JCV
    </div>
    <div class="footer-info">
      © ${currentDate.getFullYear()} JCV. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generates a PDF report and returns the URI
 */
export const generatePDFReport = async (data: PDFReportData): Promise<string> => {
  try {
    const html = generateHTMLContent(data);
    
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('No se pudo generar el PDF. Por favor, intenta de nuevo.');
  }
};

/**
 * Generates and shares a PDF report
 */
export const generateAndSharePDF = async (data: PDFReportData): Promise<void> => {
  try {
    const pdfUri = await generatePDFReport(data);
    
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir Reporte PDF',
        UTI: 'com.adobe.pdf',
      });
    } else {
      throw new Error('La funcionalidad de compartir no está disponible en este dispositivo.');
    }
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw error;
  }
};

/**
 * Generates and prints a PDF report (for web/print preview)
 */
export const printPDFReport = async (data: PDFReportData): Promise<void> => {
  try {
    const html = generateHTMLContent(data);
    
    await Print.printAsync({
      html,
    });
  } catch (error) {
    console.error('Error printing PDF:', error);
    throw new Error('No se pudo imprimir el PDF. Por favor, intenta de nuevo.');
  }
};
