import React from 'react';
import { router } from 'expo-router';
import { Feed } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardScreen() {
  const { userEmail, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
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
    <Feed
      isGuest={false}
      userEmail={userEmail}
      onLogout={handleLogout}
      onChartPress={handleChartPress}
    />
  );
}