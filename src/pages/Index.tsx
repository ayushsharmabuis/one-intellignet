
import React, { useState } from 'react';
import LandingPage from '../components/LandingPage';
import Questionnaire from '../components/Questionnaire';
import Dashboard from '../components/Dashboard';
import Chatbot from '../components/Chatbot';
import AnimatedBackground from '../components/AnimatedBackground';
import { usePreferences } from '../hooks/usePreferences';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'questionnaire' | 'dashboard'>('landing');
  const { 
    preferences, 
    updateInterests, 
    updateFrequency, 
    updatePricingPreference,
    completeQuestionnaire,
    resetPreferences 
  } = usePreferences();

  // If user has already completed the questionnaire, show the dashboard
  React.useEffect(() => {
    if (preferences.completedQuestionnaire) {
      setCurrentView('dashboard');
    }
  }, [preferences.completedQuestionnaire]);

  const handleGetStarted = () => {
    console.log("Get Started clicked, navigating to questionnaire");
    setCurrentView('questionnaire');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleCompleteQuestionnaire = () => {
    setCurrentView('dashboard');
  };

  const handleResetPreferences = () => {
    resetPreferences();
    setCurrentView('landing');
  };

  const handleUpdatePreference = (
    key: keyof Omit<typeof preferences, 'completedQuestionnaire'>,
    value: any
  ) => {
    switch (key) {
      case 'interests':
        updateInterests(value);
        break;
      case 'frequency':
        updateFrequency(value);
        break;
      case 'pricingPreference':
        updatePricingPreference(value);
        break;
    }
  };

  return (
    <div className="relative overflow-hidden w-full h-full">
      <AnimatedBackground />
      
      {currentView === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      
      {currentView === 'questionnaire' && (
        <Questionnaire
          updatePreferences={handleUpdatePreference}
          completeQuestionnaire={completeQuestionnaire}
          onBack={handleBackToLanding}
          onComplete={handleCompleteQuestionnaire}
        />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard
          preferences={preferences}
          onResetPreferences={handleResetPreferences}
        />
      )}
      
      <Chatbot />
    </div>
  );
};

export default Index;
