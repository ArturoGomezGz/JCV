// Pantalla de feed principal para usuarios invitados y logueados
// TODO: Implementar paginación cuando la cantidad de encuestas sea muy grande
// TODO: Agregar filtros por categoría y fecha
// TODO: Implementar sistema de favoritos para encuestas
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../constants/Colors';
import BottomNavigation from './BottomNavigation';
import ChartCard from './ChartCard';
import { fetchSurveys, SurveyData } from '../services/surveysService';

interface FeedProps {
  isGuest?: boolean;
  onBackToLogin?: () => void;
  onCreateAccount?: () => void;
  onLogout?: () => void;
  userEmail?: string;
  onChartPress?: (title: string, chartType: 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar', category: string, question: string) => void;
}

const Feed: React.FC<FeedProps> = ({ 
  isGuest = true,
  onBackToLogin,
  onCreateAccount,
  onLogout,
  userEmail,
  onChartPress
}) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // TODO: En el futuro, esta llamada será a la API real
      const surveysData = await fetchSurveys();
      setSurveys(surveysData);
    } catch (error) {
      console.error('Error cargando encuestas:', error);
      setHasError(true);
      Alert.alert(
        'Error',
        'No se pudieron cargar las encuestas. Por favor, intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurveyPress = (survey: SurveyData) => {
    if (onChartPress) {
      onChartPress(
        survey.title,
        survey.chartType,
        survey.category,
        survey.question
      );
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando encuestas...</Text>
        </View>
      );
    }

    if (hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ Error al cargar las encuestas</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSurveys}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <View style={styles.tabInfo}>
          <Text style={styles.tabTitle}>📊 Encuestas de Satisfacción Ciudadana</Text>
          <Text style={styles.tabDescription}>
            Explora los resultados de las encuestas sobre servicios públicos y gestión municipal.
            {surveys.length > 0 && ` (${surveys.length} encuestas disponibles)`}
          </Text>
        </View>

        <View style={styles.chartsGrid}>
          {surveys.map((survey) => (
            <ChartCard
              key={survey.id}
              title={survey.title}
              chartType={survey.chartType}
              onPress={() => handleSurveyPress(survey)}
            />
          ))}
        </View>
      </>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.welcomeTitle}>
            {isGuest ? 'Modo Invitado' : `Bienvenido${userEmail ? `, ${userEmail.split('@')[0]}` : ''}`}
          </Text>
          
          <Text style={styles.description}>
            {isGuest 
              ? 'Estás navegando como invitado. Tienes acceso limitado a las funciones de la aplicación.'
              : 'Explora todas las funcionalidades disponibles en tu dashboard personalizado.'
            }
          </Text>
          
          {renderContent()}

          <View style={styles.buttonContainer}>
            {isGuest ? (
              <>
                <TouchableOpacity
                  style={styles.createAccountButton}
                  onPress={onCreateAccount}
                >
                  <Text style={styles.createAccountButtonText}>Crear Cuenta</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={onBackToLogin}
                >
                  <Text style={styles.backButtonText}>Volver al Login</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onLogout}
              >
                <Text style={styles.backButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  tabInfo: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  tabDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  chartsGrid: {
    gap: 15,
  },
  loadingContainer: {
    backgroundColor: colors.surface,
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 15,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fff5f5',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7d7',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e53e3e',
    textAlign: 'center',
    marginBottom: 15,
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
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    gap: 15,
    marginTop: 20,
  },
  createAccountButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
  },
  createAccountButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Feed;