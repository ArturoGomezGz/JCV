import React, { useState } from 'react';
import { router } from 'expo-router';
import { Feed, GuestModal } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardScreen() {
  const { userEmail, userName, logout, isGuest } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const handleProfilePress = () => {
    if (isGuest) {
      setModalMessage('Necesitas crear una cuenta para acceder a la configuración de tu perfil.');
      setShowGuestModal(true);
    } else {
      router.push('/(tabs)/account');
    }
  };

  const handleForumPress = () => {
    if (isGuest) {
      setModalMessage('Necesitas crear una cuenta para acceder al foro de discusión.');
      setShowGuestModal(true);
    } else {
      router.push('/(tabs)/forum');
    }
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/create-account');
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
        isGuest: 'false',
        userEmail
      }
    });
  };

  return (
    <>
      <Feed
        isGuest={false}
        userEmail={userEmail}
        userName={userName}
        onLogout={handleLogout}
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