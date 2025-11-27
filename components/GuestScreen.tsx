// Pantalla de feed principal para usuarios invitados y logueados
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../constants/Colors';
import BottomNavigation from './BottomNavigation';
import ChartCard from './ChartCard';

// Definición de la interfaz TypeScript para las props del componente
interface FeedProps {
  isGuest?: boolean;
  onBackToLogin?: () => void;
  onCreateAccount?: () => void;
  onLogout?: () => void;
  userEmail?: string;
}

// Componente principal: Feed
const Feed: React.FC<FeedProps> = ({ 
  isGuest = true,
  onBackToLogin,
  onCreateAccount,
  onLogout,
  userEmail
}) => {
  const [activeTab, setActiveTab] = useState('chat');

  // Datos de ejemplo para las gráficas
  const barChartData = [
    { x: 'Ene', y: 13 },
    { x: 'Feb', y: 16 },
    { x: 'Mar', y: 14 },
    { x: 'Abr', y: 19 },
    { x: 'May', y: 22 },
    { x: 'Jun', y: 18 },
  ];

  const pieChartData = [
    { label: 'Móvil', value: 45, color: colors.primary },
    { label: 'Desktop', value: 30, color: '#FF6B6B' },
    { label: 'Tablet', value: 25, color: '#4ECDC4' },
  ];

  const lineChartData = [
    { x: 1, y: 2 },
    { x: 2, y: 5 },
    { x: 3, y: 3 },
    { x: 4, y: 8 },
    { x: 5, y: 6 },
    { x: 6, y: 9 },
  ];

  const progressChartData = [
    { label: 'Completado', percentage: 75, color: '#4CAF50' },
    { label: 'En Progreso', percentage: 60, color: '#FF9800' },
    { label: 'Pendiente', percentage: 30, color: '#F44336' },
  ];

  const donutChartData = [
    { label: 'Ventas', value: 40, color: '#9C27B0' },
    { label: 'Marketing', value: 25, color: '#2196F3' },
    { label: 'Soporte', value: 20, color: '#FF5722' },
    { label: 'Desarrollo', value: 15, color: '#795548' },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  const handleCreateAccount = () => {
    if (onCreateAccount) {
      onCreateAccount();
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === 'stats') {
      // Navigate to search screen
      const { router } = require('expo-router');
      router.push('/(tabs)/search');
    } else {
      console.log('Tab pressed:', tabName);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Título de bienvenida */}
          <Text style={styles.welcomeTitle}>
            {isGuest ? 'Modo Invitado' : `Bienvenido${userEmail ? `, ${userEmail.split('@')[0]}` : ''}`}
          </Text>
          
          {/* Descripción */}
          <Text style={styles.description}>
            {isGuest 
              ? 'Estás navegando como invitado. Tienes acceso limitado a las funciones de la aplicación.'
              : 'Explora todas las funcionalidades disponibles en tu dashboard personalizado.'
            }
          </Text>
          
          {/* Información del tab activo */}
          <View style={styles.tabInfo}>
            <Text style={styles.tabInfoText}>
              Tab activo: <Text style={styles.tabInfoValue}>{activeTab}</Text>
            </Text>
          </View>
          
          {/* Sección de funciones disponibles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isGuest ? 'Funciones Disponibles:' : 'Funciones Completas:'}
            </Text>
            <View style={styles.featureList}>
              {isGuest ? (
                <>
                  <Text style={styles.featureItem}>• Ver contenido público</Text>
                  <Text style={styles.featureItem}>• Explorar funcionalidades básicas</Text>
                  <Text style={styles.featureItem}>• Acceso de solo lectura</Text>
                </>
              ) : (
                <>
                  <Text style={styles.featureItem}>• Acceso completo a todas las funciones</Text>
                  <Text style={styles.featureItem}>• Crear y editar contenido</Text>
                  <Text style={styles.featureItem}>• Configuraciones personalizadas</Text>
                  <Text style={styles.featureItem}>• Sincronización en la nube</Text>
                </>
              )}
            </View>
          </View>

          {/* Gráficas de demostración */}
          <ChartCard
            title="Actividad Mensual"
            chartType="bar"
            data={barChartData}
            onPress={() => console.log('Pressed: Bar Chart')}
          />

          <ChartCard
            title="Distribución de Dispositivos"
            chartType="pie"
            data={pieChartData}
            onPress={() => console.log('Pressed: Pie Chart')}
          />

          <ChartCard
            title="Tendencia de Crecimiento"
            chartType="line"
            data={lineChartData}
            onPress={() => console.log('Pressed: Line Chart')}
          />

          <ChartCard
            title="Estado de Proyectos"
            chartType="progress"
            data={progressChartData}
            onPress={() => console.log('Pressed: Progress Chart')}
          />

          <ChartCard
            title="Distribución de Equipos"
            chartType="donut"
            data={donutChartData}
            onPress={() => console.log('Pressed: Donut Chart')}
          />

          {/* Botones de acción */}
          <View style={styles.buttonContainer}>
            {isGuest ? (
              <>
                {/* Botón para crear cuenta */}
                <TouchableOpacity
                  style={styles.createAccountButton}
                  onPress={handleCreateAccount}
                >
                  <Text style={styles.createAccountButtonText}>Crear Cuenta</Text>
                </TouchableOpacity>
                
                {/* Botón para volver al login */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackToLogin}
                >
                  <Text style={styles.backButtonText}>Volver al Login</Text>
                </TouchableOpacity>
              </>
            ) : (
              /* Botón para cerrar sesión */
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleLogout}
              >
                <Text style={styles.backButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
};

// Estilos del componente
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
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  tabInfo: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabInfoText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  tabInfoValue: {
    color: colors.primary,
    fontWeight: 'bold',
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
  section: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  featureList: {
    paddingLeft: 10,
  },
  featureItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  restrictedItem: {
    fontSize: 14,
    color: colors.textDisabled,
    marginBottom: 8,
    lineHeight: 20,
  },
  placeholder: {
    backgroundColor: colors.background,
    padding: 25,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 15,
  },
  createAccountButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
  },
  createAccountButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Feed;