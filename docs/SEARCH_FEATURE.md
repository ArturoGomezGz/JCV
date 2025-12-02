# Search Window (Ventana de Búsqueda) - Documentation

## Overview
The search window provides a complete flow for users to search and filter survey data from the mini-spss API.

## API Integration
- **Base URL**: `https://mini-spss-production.up.railway.app/`
- **Service File**: `services/miniSpssApiService.ts`

### Available Endpoints

1. **GET /categorias** - Get all question categories
2. **GET /preguntas/categoria/{categoria_id}** - Get questions by category
3. **POST /respuestas/{question_id}/filtros** - Get responses with filters

## User Flow

### 1. Category Selection
- User sees a list of available categories
- User selects a category to view related questions
- Categories are loaded from `/categorias` endpoint

### 2. Question Selection
- After selecting a category, questions are loaded from `/preguntas/categoria/{categoria_id}`
- User can browse and select a question to view its responses
- Each question shows:
  - Question ID (identificador)
  - Question text (pregunta)
  - Category badge
  - Number of answer options

### 3. Filter Application
- User can click the "Filtros" button (enabled after selecting a question)
- Filter modal shows all available filters:
  - **Calidad de Vida** (Quality of Life): 1 (Baja), 2 (Media), 3 (Alta)
  - **Municipio** (Municipality): El Salto, Guadalajara, San Pedro Tlaquepaque, Tlajomulco de Zúñiga, Tonalá, Zapopan
  - **Sexo** (Gender): Hombre, Mujer
  - **Edad** (Age): Min and Max age range
  - **Escolaridad** (Education): Sec<, Prep, Univ+
  - **NSE** (Socioeconomic Level): D+/D/E, C/C-, A/B/C+, Sin datos suficientes

### 4. Results Display
- Results are fetched from `/respuestas/{question_id}/filtros` with POST body containing filters
- Results show:
  - Question information
  - Total number of responses
  - Response breakdown (with percentage or count)
  - Visual progress bars for each answer option
  - Applied filters (if any)
  - Complete JSON data for debugging/development

## Components

### CategorySelector
**File**: `components/CategorySelector.tsx`
- Displays list of categories
- Handles category selection
- Shows loading state

### QuestionList
**File**: `components/QuestionList.tsx`
- Displays questions for selected category
- Shows question details (ID, text, category, options count)
- Handles question selection

### FilterModal
**File**: `components/FilterModal.tsx`
- Modal interface for filter configuration
- All filter options with proper labels
- Apply and Clear filter actions
- Age range input fields

### ResultsDisplay
**File**: `components/ResultsDisplay.tsx`
- Displays response data
- Shows visual progress bars
- Displays applied filters
- Shows complete JSON data

## Main Screen
**File**: `app/(tabs)/search.tsx`

### State Management
- `categorias`: List of available categories
- `selectedCategoria`: Currently selected category
- `preguntas`: List of questions for selected category
- `selectedPregunta`: Currently selected question
- `filtros`: Currently applied filters
- `results`: Response data from API
- `currentView`: Current view state ('categories' | 'questions' | 'results')

### Navigation
- Back button to navigate between views
- Tab navigation integrated with existing app navigation
- Filter button (enabled only when question is selected)

## Future Enhancements
- Replace JSON display with proper chart visualizations
- Add search functionality within categories and questions
- Implement caching for better performance
- Add favorites/bookmarks for frequently accessed questions
- Export results functionality
- Share results with other users
