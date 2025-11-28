import React, { useState } from 'react';
import { router } from 'expo-router';
import { Feed, GuestModal } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

export default function GuestScreen() {
  const { logout } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleBackToLogin = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/create-account');
  };

  const handleProfilePress = () => {
    // Show popup instead of redirecting directly
    setModalMessage('Necesitas crear una cuenta para acceder a la configuración de tu perfil.');
    setShowGuestModal(true);
  };

  const handleForumPress = () => {
    // Show popup instead of redirecting directly for forum/chat access
    setModalMessage('Necesitas crear una cuenta para acceder a los mensajes.');
    setShowGuestModal(true);
  };

  const handleChartPress = (
    title: string, 
    chartType: 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar', 
    category: string, 
    question: string
  ) => {
    router.push({
      pathname: '/content/[id]',
      params: {
        id: encodeURIComponent(title),
        title,
        chartType,
        category,
        question,
        isGuest: 'true'
      }
    });
  };

  return (
    <>
      <Feed
        isGuest={true}
        onBackToLogin={handleBackToLogin}
        onCreateAccount={handleCreateAccount}
        onChartPress={handleChartPress}
        onProfilePress={handleProfilePress}
        onForumPress={handleForumPress}
      />
      <GuestModal
        visible={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onCreateAccount={handleCreateAccount}
        message={modalMessage}
      />
    </>
  );
}