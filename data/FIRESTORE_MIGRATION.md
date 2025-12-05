# Migración a Firestore

## Resumen
Los datos del feed ahora se obtienen desde **Firestore** en lugar del archivo JSON local `surveysData.json`.

## Estructura de Firestore

### Colección: `feed`

Cada documento en la colección `feed` representa una encuesta de satisfacción ciudadana.

**ID del Documento**: `"001"`, `"002"`, `"003"`, etc.

**Campos del Documento**:
```json
{
  "title": "Satisfacción con Servicios Públicos por Mes",
  "category": "Servicios Públicos Generales",
  "question": "¿Cómo calificaría la calidad general de los servicios públicos de su municipio?",
  "chartType": "bar",
  "description": "Gráfico de barras ideal para comparar valores entre diferentes categorías o períodos...",
  "chartData": {
    "labels": ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    "values": [12, 19, 15, 22, 18, 17]
  }
}
```

**Nota importante**: 
- El campo `id` fue eliminado. Ahora el ID del documento de Firestore se utiliza como identificador de la encuesta.
- El campo `chartData` es ahora un **map directo en el documento**, no una subcolección.

## Cambios Realizados

### 1. Estructura de Firestore Actualizada
**Antes**: El campo `chartData` era una **subcolección** dentro de cada documento:
```
feed/
  └── 001/
      ├── (campos del documento)
      └── chartData/ (subcolección)
          └── (documentos con datos de gráficos)
```

**Ahora**: El campo `chartData` es un **map directo** dentro del documento:
```
feed/
  └── 001/
      ├── title: "..."
      ├── category: "..."
      ├── chartData: { labels: [...], values: [...] }  ← Map, no subcolección
```

### 2. Servicio de Encuestas (`services/surveysService.ts`)
- Eliminada la función `fetchChartData()` que obtenía datos desde la subcolección
- Actualizado `mapFirestoreDocToSurvey()` para recibir solo 2 parámetros: `docId` y `data`
- El `chartData` ahora se obtiene directamente de `data.chartData`

### 3. Función `fetchSurveys()`
```typescript
// Antes: Hacía await a fetchChartData() para cada documento
for (const docSnapshot of querySnapshot.docs) {
  const chartData = await fetchChartData(docSnapshot.id);
  const survey = mapFirestoreDocToSurvey(docSnapshot.id, docSnapshot.data(), chartData);
}

// Ahora: Accede directamente al map en el documento
for (const docSnapshot of querySnapshot.docs) {
  const survey = mapFirestoreDocToSurvey(docSnapshot.id, docSnapshot.data());
}
```

### 4. Función `fetchSurveyById()`
```typescript
// Antes: Hacía await a fetchChartData()
const chartData = await fetchChartData(docSnapshot.id);
return mapFirestoreDocToSurvey(docSnapshot.id, docSnapshot.data(), chartData);

// Ahora: Accede directamente al map
return mapFirestoreDocToSurvey(docSnapshot.id, docSnapshot.data());
```

## Compatibilidad

La interfaz `SurveyData` se mantiene igual, permitiendo que todos los componentes existentes funcionen sin cambios:

```typescript
export interface SurveyData {
  id: string;        // Ahora es el ID del documento de Firestore
  title: string;
  category: string;
  question: string;
  chartType: 'bar' | 'line' | 'pie' | ...;
  description: string;
  chartData: any;
}
```

## Configuración Requerida

Asegúrate de tener las variables de entorno de Firebase configuradas en tu archivo `.env`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

## Archivo JSON Anterior

El archivo `surveysData.json` puede mantenerse como referencia o backup, pero ya no se utiliza en la aplicación.
