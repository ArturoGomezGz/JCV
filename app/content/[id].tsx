import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Content } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

export default function ContentScreen() {
  const params = useLocalSearchParams();
  const { userEmail } = useAuth();
  
  const title = params.title as string;
  const chartType = params.chartType as 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar';
  const category = params.category as string;
  const question = params.question as string;
  const isGuest = params.isGuest === 'true';
  const paramUserEmail = params.userEmail as string;

  const handleBack = () => {
    router.back();
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/create-account');
  };

  return (
    <Content
      title={title}
      chartType={chartType}
      category={category}
      question={question}
      onBack={handleBack}
      isGuest={isGuest}
      userEmail={isGuest ? '' : (paramUserEmail || userEmail)}
      onCreateAccount={handleCreateAccount}
    />
  );
}