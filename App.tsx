import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { LoginForm, CreateAccountForm, DashboardScreen, Feed, FooterLogo, HeaderLogo, Content } from './components';
import { colors } from './constants/Colors';

export default function App() {
  // Estado para manejar qué vista mostrar - ahora con múltiples opciones
  const [currentView, setCurrentView] = useState<'login' | 'createAccount' | 'dashboard' | 'guest' | 'content'>('login');
  const [userEmail, setUserEmail] = useState<string>('');
  const [contentData, setContentData] = useState<{
    title: string;
    chartType: 'bar' | 'pie' | 'line' | 'progress' | 'donut';
    data: any[];
    previousView: 'dashboard' | 'guest';
  } | null>(null);

  const handleLogin = async (email: string, password: string) => {
    // Aquí puedes implementar tu lógica de autenticación
    setUserEmail(email);
    setCurrentView('dashboard');
  
  };

  const handleCreateAccountNavigation = () => {
    // Navegar a la vista de crear cuenta
    setCurrentView('createAccount');
  };

  const handleCreateAccount = async (email: string, password: string, confirmPassword: string) => {
    // Volver al login después de crear la cuenta
    setCurrentView('login');
  };

  const handleBackToLogin = () => {
    // Volver a la vista de login
    setCurrentView('login');
  };

  const handleGuestAccess = async () => {
    // Navegar a la vista de invitado
    setCurrentView('guest');
  };

  const handleLogout = () => {
    // Limpiar datos del usuario y volver al login
    setUserEmail('');
    setContentData(null);
    setCurrentView('login');
  };

  const handleChartPress = (title: string, chartType: 'bar' | 'pie' | 'line' | 'progress' | 'donut', data: any[]) => {
    // Guardar los datos del contenido y la vista anterior
    setContentData({
      title,
      chartType,
      data,
      previousView: currentView === 'dashboard' ? 'dashboard' : 'guest'
    });
    setCurrentView('content');
  };

  const handleBackFromContent = () => {
    // Volver a la vista anterior (dashboard o guest)
    if (contentData) {
      setCurrentView(contentData.previousView);
    } else {
      setCurrentView('dashboard'); // Fallback
    }
  };

  // Función para renderizar el contenido según la vista actual
  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm 
            onLogin={handleLogin}
            onCreateAccount={handleCreateAccountNavigation}
            onGuestAccess={handleGuestAccess}
            isLoading={false}
          />
        );
      
      case 'createAccount':
        return (
          <CreateAccountForm
            onCreateAccount={handleCreateAccount}
            onBackToLogin={handleBackToLogin}
            isLoading={false}
          />
        );
      
      case 'dashboard':
        return (
          <Feed
            isGuest={false}
            userEmail={userEmail}
            onLogout={handleLogout}
            onChartPress={handleChartPress}
          />
        );
      
      case 'guest':
        return (
          <Feed
            isGuest={true}
            onBackToLogin={handleBackToLogin}
            onCreateAccount={handleCreateAccountNavigation}
            onChartPress={handleChartPress}
          />
        );

      case 'content':
        return contentData ? (
          <Content
            title={contentData.title}
            chartType={contentData.chartType}
            data={contentData.data}
            onBack={handleBackFromContent}
          />
        ) : null;
      
      default:
        return (
          <LoginForm 
            onLogin={handleLogin}
            onCreateAccount={handleCreateAccountNavigation}
            onGuestAccess={handleGuestAccess}
            isLoading={false}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Solo mostrar logos en login y createAccount */}
      {(currentView === 'login' || currentView === 'createAccount') && (
        <>
          <HeaderLogo />
          <FooterLogo />
        </>
      )}
      
      {/* Renderizar la vista actual */}
      {renderCurrentView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
