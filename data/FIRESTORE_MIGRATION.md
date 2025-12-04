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

**Nota importante**: El campo `id` fue eliminado. Ahora el ID del documento de Firestore se utiliza como identificador de la encuesta.

## Cambios Realizados

### 1. Servicio de Encuestas (`services/surveysService.ts`)
- **Antes**: Importaba datos de `surveysData.json`
- **Ahora**: Obtiene datos de Firestore usando `getDocs()` y `getDoc()`

### 2. Función `fetchSurveys()`
```typescript
// Antes: Leía del JSON local
const data = surveysData as any;

// Ahora: Lee de Firestore
const feedCollection = collection(db, 'feed');
const querySnapshot = await getDocs(feedCollection);
```

### 3. Función `fetchSurveyById()`
```typescript
// Antes: Buscaba en el array local
const surveys = await fetchSurveys();
return surveys.find(survey => survey.id === id) || null;

// Ahora: Lee directamente de Firestore por ID
const docRef = doc(db, 'feed', id);
const docSnapshot = await getDoc(docRef);
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
