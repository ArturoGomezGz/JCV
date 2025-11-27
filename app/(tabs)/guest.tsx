import React from 'react';
import { router } from 'expo-router';
import { Feed } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

export default function GuestScreen() {
  const { logout } = useAuth();

  const handleBackToLogin = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/create-account');
  };

  const handleProfilePress = () => {
    // Guest users should be redirected to create account
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
        isGuest: 'true'
      }
    });
  };

  return (
    <Feed
      isGuest={true}
      onBackToLogin={handleBackToLogin}
      onCreateAccount={handleCreateAccount}
      onChartPress={handleChartPress}
      onProfilePress={handleProfilePress}
    />
  );
}