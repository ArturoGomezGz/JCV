# 📊 Documentación de Gráficas - JCV

## Introducción

Este documento describe los campos y tipos de datos necesarios para crear gráficas en el feed de la aplicación JCV. Las gráficas se generan a partir de datos almacenados en Firestore y se renderizan usando el componente `ChartPreview` con la librería `react-native-chart-kit`.

---

## Estructura Base de Datos

Todas las gráficas se almacenan en Firestore en la colección **`feed`** con la siguiente estructura:

### Interfaz SurveyData

```typescript
interface SurveyData {
  id: string;                    // ID único del documento (ej: "001", "002")
  title: string;                 // Título que se muestra en la gráfica
  category: string;              // Categoría para clasificación y filtrado
  question: string;              // Pregunta asociada a la encuesta/gráfica
  chartType: string;             // Tipo de gráfica (ver tabla de tipos)
  description: string;           // Descripción detallada del gráfico
  chartData: object;             // Estructura de datos específica del tipo (ver abajo)
  report?: string;               // (Opcional) Reporte en Markdown generado por IA
}
```

---

## Tipos de Gráficas Soportadas

La aplicación soporta **9 tipos de gráficas** diferentes. Cada una requiere una estructura de datos específica en el campo `chartData`:

### 1. 📊 Bar Chart (`bar`)

**Descripción**: Gráfico de barras ideal para comparar valores entre categorías.

**Uso**: Comparaciones rápidas, análisis categóricos, datos por período.

**Estructura chartData**:
```json
{
  "labels": ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  "values": [12, 19, 15, 22, 18, 17]
}
```

**Campos requeridos**:
- `labels` (array de strings): Etiquetas del eje X
- `values` (array de números): Valores para cada etiqueta

---

### 2. 🥧 Pie Chart (`pie`)

**Descripción**: Gráfico circular para mostrar proporciones de un total.

**Uso**: Distribuciones de porcentajes, composiciones, partes de un todo.

**Estructura chartData**:
```json
{
  "labels": ["Excelente", "Bueno", "Regular", "Malo"],
  "values": [28, 32, 25, 15]
}
```

**Campos requeridos**:
- `labels` (array de strings): Nombres de cada sección
- `values` (array de números): Valores o porcentajes para cada sección

**Nota**: Los valores no necesitan sumar 100, se calculan automáticamente como proporción.

---

### 3. 📈 Line Chart (`line`)

**Descripción**: Gráfico de líneas para mostrar tendencias y cambios en el tiempo.

**Uso**: Análisis temporal, evoluciones, tendencias, comparación de series.

**Estructura chartData**:
```json
{
  "labels": ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  "datasets": [
    {
      "name": "2023",
      "values": [18, 22, 19, 25, 23, 20]
    },
    {
      "name": "2024",
      "values": [20, 24, 21, 27, 25, 22]
    }
  ]
}
```

**Campos requeridos**:
- `labels` (array de strings): Períodos o puntos en el eje X
- `datasets` (array de objetos): Series de datos
  - `name` (string): Nombre de la serie
  - `values` (array de números): Valores para cada punto

**Nota**: Requiere obligatoriamente múltiples series (datasets).

---

### 4. 📊 Progress Chart (`progress`)

**Descripción**: Gráfico de progreso circular para mostrar porcentajes de completitud.

**Uso**: KPIs, avances, metas cumplidas, métricas de rendimiento.

**Estructura chartData**:
```json
{
  "labels": ["Planificación", "Ejecución", "Evaluación", "Mejora"],
  "values": [75, 68, 58, 82]
}
```

**Campos requeridos**:
- `labels` (array de strings): Nombres de los elementos a evaluar
- `values` (array de números): Porcentajes (0-100) para cada elemento

**Nota**: Los valores se convierten automáticamente a decimales (0-1) internamente.

---

### 5. 📊 Stacked Bar Chart (`stackedBar`)

**Descripción**: Gráfico de barras apiladas para mostrar composición y comparación.

**Uso**: Distribuciones de presupuesto, composición de totales, análisis de componentes.

**Estructura chartData**:
```json
{
  "labels": ["T1", "T2", "T3", "T4"],
  "series": ["Infraestructura", "Servicios", "Administración"],
  "values": [
    [45, 25, 15],
    [50, 30, 20],
    [42, 28, 18],
    [48, 32, 22]
  ]
}
```

**Campos requeridos**:
- `labels` (array de strings): Etiquetas del eje X
- `series` (array de strings): Nombres de cada serie/componente
- `values` (array de arrays): Matriz de valores donde cada fila corresponde a un label y cada columna a una serie

**Estructura de values**: 
- Número de filas = número de labels
- Número de columnas = número de series

---

### 6. 📈 Bezier Line Chart (`bezierLine`)

**Descripción**: Gráfico de líneas suaves que resaltan tendencias naturales.

**Uso**: Tendencias suavizadas, progresiones orgánicas, datos de satisfacción.

**Estructura chartData**:
```json
{
  "labels": ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  "values": [3.8, 4.1, 4.0, 4.5, 4.3, 4.2]
}
```

**Alternativa con múltiples series**:
```json
{
  "labels": ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  "datasets": [
    {
      "name": "Serie 1",
      "values": [3.8, 4.1, 4.0, 4.5, 4.3, 4.2]
    },
    {
      "name": "Serie 2",
      "values": [3.5, 3.9, 3.8, 4.2, 4.1, 4.0]
    }
  ]
}
```

**Campos requeridos**:
- `labels` (array de strings): Puntos en el eje X
- `values` O `datasets`: Datos a graficar

---

### 7. 📊 Area Chart (`areaChart`)

**Descripción**: Gráfico de área que enfatiza volumen y magnitud en el tiempo.

**Uso**: Acumulación, impacto total, énfasis en magnitud de datos.

**Estructura chartData**:
```json
{
  "labels": ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  "values": [3.5, 3.8, 3.7, 4.0, 3.9, 3.8]
}
```

**Alternativa con múltiples series**:
```json
{
  "labels": ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  "datasets": [
    {
      "name": "Área 1",
      "values": [3.5, 3.8, 3.7, 4.0, 3.9, 3.8]
    },
    {
      "name": "Área 2",
      "values": [2.1, 2.3, 2.2, 2.5, 2.4, 2.3]
    }
  ]
}
```

**Campos requeridos**:
- `labels` (array de strings): Períodos en el eje X
- `values` O `datasets`: Datos a graficar

---

### 8. 📊 Horizontal Bar Chart (`horizontalBar`)

**Descripción**: Gráfico de barras horizontal para comparar categorías con nombres largos.

**Uso**: Rankings, evaluaciones departamentales, datos con etiquetas extensas.

**Estructura chartData**:
```json
{
  "labels": ["Obras Públicas", "Servicios Sociales", "Hacienda", "Seguridad", "Ambiente"],
  "values": [4.2, 3.8, 3.5, 4.0, 3.9]
}
```

**Campos requeridos**:
- `labels` (array de strings): Nombres de departamentos/categorías
- `values` (array de números): Valores de evaluación para cada categoría

---

### 9. 🗓️ Contribution Graph (`contribution`)

**Descripción**: Gráfico de contribución tipo heatmap para mostrar actividad en el tiempo.

**Uso**: Calendarios de actividad, tracking de contribuciones, heatmaps temporales.

**Estructura chartData**:
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "values": [1, 2, 3, 2, 1, 4, 5, 3, 2, 1]
}
```

**Campos requeridos**:
- `startDate` (string ISO): Fecha inicial en formato YYYY-MM-DD
- `endDate` (string ISO): Fecha final en formato YYYY-MM-DD
- `values` (array de números): Intensidades/valores para cada día en el rango

**Nota**: El sistema genera automáticamente una fecha para cada día entre startDate y endDate.

---

## Documento Completo en Firestore

### Ejemplo: Bar Chart

```json
{
  "id": "survey-001",
  "title": "Satisfacción con Servicios Públicos por Mes",
  "category": "Servicios Públicos Generales",
  "question": "¿Cómo calificaría la calidad general de los servicios públicos?",
  "chartType": "bar",
  "description": "Gráfico de barras que muestra la satisfacción mensual",
  "chartData": {
    "labels": ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    "values": [12, 19, 15, 22, 18, 17]
  }
}
```

### Ejemplo: Stacked Bar Chart

```json
{
  "id": "survey-005",
  "title": "Distribución de Presupuesto por Área",
  "category": "Gestión Financiera",
  "question": "¿Cómo evalúa la distribución del presupuesto municipal?",
  "chartType": "stackedBar",
  "description": "Comparación trimestral de presupuesto por áreas",
  "chartData": {
    "labels": ["T1", "T2", "T3", "T4"],
    "series": ["Infraestructura", "Servicios", "Administración"],
    "values": [
      [45, 25, 15],
      [50, 30, 20],
      [42, 28, 18],
      [48, 32, 22]
    ]
  }
}
```

---

## Componente ChartPreview

### Uso en la Aplicación

El componente `ChartPreview` se utiliza para renderizar gráficas:

```tsx
import ChartPreview from '../components/ChartPreview';

export default function Feed() {
  const surveyData = {
    id: "001",
    title: "Mi Gráfica",
    category: "Categoría",
    question: "¿Pregunta?",
    chartType: "bar",
    description: "Descripción",
    chartData: {
      labels: ["A", "B", "C"],
      values: [10, 20, 30]
    }
  };

  return (
    <ChartPreview 
      type="bar"
      height={250}
      surveyData={surveyData}
    />
  );
}
```

### Props del Componente

```typescript
interface ChartPreviewProps {
  type: 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 
        'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar';
  height?: number;                    // Altura personalizada (opcional)
  surveyData?: SurveyData;           // Datos de la gráfica (opcional)
}
```

---

## Validaciones y Reglas

### Campos Obligatorios en SurveyData

Para que una gráfica se renderice correctamente, estos campos **deben estar presentes**:

- ✅ `id`: Identificador único
- ✅ `title`: Título visible
- ✅ `category`: Categoría de clasificación
- ✅ `question`: Pregunta asociada
- ✅ `chartType`: Tipo válido de gráfica
- ✅ `description`: Descripción del gráfico
- ✅ `chartData`: Datos estructurados según tipo

### Tipos de Datos

| Campo | Tipo | Valores Válidos |
|-------|------|-----------------|
| `chartType` | string | `bar`, `line`, `pie`, `progress`, `contribution`, `stackedBar`, `bezierLine`, `areaChart`, `horizontalBar` |
| `labels` | array | Array de strings |
| `values` | array | Array de números |
| `datasets` | array | Array de objetos con `name` y `values` |
| `series` | array | Array de strings (solo para stackedBar) |

---

## Alturas Recomendadas por Tipo

La aplicación ajusta automáticamente la altura, pero puedes personalizarla:

| Tipo | Altura Recomendada | Uso |
|------|-------------------|-----|
| `bar` | 200px | Espaciado normal |
| `line` | 200px | Espaciado normal |
| `pie` | 280px | Mayor espacio para leyenda |
| `progress` | 160px | Compacto |
| `contribution` | 130px | Muy compacto |
| `stackedBar` | 200px | Espaciado normal |
| `bezierLine` | 200px | Espaciado normal |
| `areaChart` | 200px | Espaciado normal |
| `horizontalBar` | 200px | Espaciado normal |

---

## Servicio de Encuestas

### Funciones Disponibles

```typescript
// Obtener todas las encuestas
const surveys = await fetchSurveys(): Promise<SurveyData[]>

// Obtener una encuesta específica
const survey = await fetchSurveyById(id): Promise<SurveyData | null>

// Filtrar por categoría
const surveys = await fetchSurveysByCategory(category): Promise<SurveyData[]>

// Obtener categorías únicas
const categories = await fetchCategories(): Promise<string[]>

// Obtener estadísticas generales
const stats = await fetchSurveyStats()

// Actualizar reporte de IA
const success = await updateSurveyReport(surveyId, report)
```

---

## Ejemplo Práctico: Crear una Nueva Gráfica

### Paso 1: Preparar los Datos

```json
{
  "title": "Análisis de Tráfico",
  "category": "Movilidad",
  "question": "¿Cómo es la congestión vehicular en tu zona?",
  "chartType": "line",
  "description": "Evolución del tráfico por horas del día",
  "chartData": {
    "labels": ["6am", "9am", "12pm", "3pm", "6pm", "9pm"],
    "datasets": [
      {
        "name": "Lunes",
        "values": [65, 85, 70, 75, 90, 60]
      },
      {
        "name": "Viernes",
        "values": [72, 95, 75, 82, 100, 70]
      }
    ]
  }
}
```

### Paso 2: Guardar en Firestore

La colección **`feed`** debe contener un documento con ID único (ej: "009"):

```
firestore/
└── feed/
    └── 009/
        ├── title: "Análisis de Tráfico"
        ├── category: "Movilidad"
        ├── question: "¿Cómo es la congestión vehicular en tu zona?"
        ├── chartType: "line"
        ├── description: "Evolución del tráfico por horas del día"
        └── chartData: {...}
```

### Paso 3: Usar en el Componente

```tsx
<ChartPreview type="line" height={250} />
// O con datos específicos
<ChartPreview 
  type="line" 
  surveyData={{
    id: "009",
    title: "Análisis de Tráfico",
    category: "Movilidad",
    question: "¿Cómo es la congestión vehicular en tu zona?",
    chartType: "line",
    description: "Evolución del tráfico por horas del día",
    chartData: {...}
  }}
/>
```

---

## Tabla Resumen de Tipos

| Tipo | Mejor Para | Estructura Requerida | Complejidad |
|------|-----------|----------------------|------------|
| **bar** | Comparaciones | `labels`, `values` | ⭐ Baja |
| **pie** | Proporciones | `labels`, `values` | ⭐ Baja |
| **line** | Tendencias | `labels`, `datasets` | ⭐⭐ Media |
| **progress** | Porcentajes/KPIs | `labels`, `values` | ⭐ Baja |
| **stackedBar** | Composición | `labels`, `series`, `values` (matriz) | ⭐⭐ Media |
| **bezierLine** | Tendencias suaves | `labels`, `values` o `datasets` | ⭐⭐ Media |
| **areaChart** | Volumen/impacto | `labels`, `values` o `datasets` | ⭐⭐ Media |
| **horizontalBar** | Rankings | `labels`, `values` | ⭐ Baja |
| **contribution** | Actividad temporal | `startDate`, `endDate`, `values` | ⭐⭐ Media |

---

## Notas Importantes

1. **Colores Automáticos**: Los colores se generan automáticamente según el tipo de gráfica y cantidad de series.

2. **Carga de Datos**: El componente `ChartPreview` carga automáticamente desde Firestore si no se proporciona `surveyData`.

3. **Validación**: Firestore valida que estén presentes todos los campos obligatorios.

4. **Reportes de IA**: El campo `report` es opcional y se genera mediante la función `updateSurveyReport()`.

5. **Responsive**: Las gráficas se adaptan automáticamente al ancho del contenedor.

6. **Altura Flexible**: Usa el prop `height` para personalizar, o déjalo sin especificar para usar los valores por defecto.

---

## Soporte y Errores

Si una gráfica no se renderiza:

- ✅ Verifica que `chartType` sea válido
- ✅ Confirma que todos los campos obligatorios estén presentes
- ✅ Valida que la estructura de `chartData` coincida con el tipo
- ✅ Revisa la consola para mensajes de error
- ✅ Asegúrate que los datos en Firestore sean válidos JSON

---

**Última actualización**: Diciembre 2024
**Versión del componente**: ChartPreview v1.0
