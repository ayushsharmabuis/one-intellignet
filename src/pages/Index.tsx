import React, { useState, useEffect } from 'react';
import LandingPage from '../components/LandingPage';
import Questionnaire from '../components/Questionnaire';
import Dashboard from '../components/Dashboard';
import SignupPage from '../components/SignupPage';
import { usePreferences } from '../hooks/usePreferences';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../lib/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

// Define localStorage keys
const VIEW_STATE_KEY = 'lastViewState';
const QUESTIONNAIRE_SHOWN_KEY = 'questionnaireShown';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'signup' | 'questionnaire' | 'dashboard'>('landing');
  
  const { 
    preferences, 
    updateInterests, 
    updateFrequency, 
    updatePricingPreference,
    completeQuestionnaire,
    resetPreferences 
  } = usePreferences();
  const { toast } = useToast();
  const { currentUser, isNewUser, markUserOnboarded, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Track if questionnaire has been shown in this session
  const [questionnaireShownThisSession, setQuestionnaireShownThisSession] = useState(() => {
    // Check if we have a stored value in localStorage
    const stored = localStorage.getItem(QUESTIONNAIRE_SHOWN_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  // Simple authentication check - if user is logged in and has completed questionnaire, show dashboard
  useEffect(() => {
    console.log("Auth state changed:", { 
      currentUser: currentUser?.email || 'none', 
      isNewUser, 
      questionnaire: preferences?.completedQuestionnaire,
      path: location.pathname
    });
    
    // Only redirect if we have a current user and authentication loading is complete
    if (currentUser && !authLoading) {
      if (location.pathname !== '/') {
        // If we're on a valid route, don't redirect
        return;
      }
      
      // Check if the user has completed the questionnaire
      if (preferences.completedQuestionnaire) {
        // If questionnaire is completed, always go to dashboard
        console.log("Questionnaire already completed, redirecting to dashboard");
        navigate('/dashboard', { replace: true });
      } else if (isNewUser && !questionnaireShownThisSession) {
        // Only show questionnaire for new users and only once per session
        console.log("New user, showing questionnaire");
        setCurrentView('questionnaire');
        setQuestionnaireShownThisSession(true);
        localStorage.setItem(QUESTIONNAIRE_SHOWN_KEY, JSON.stringify(true));
      } else {
        // Default to dashboard for returning users
        console.log("Returning user, redirecting to dashboard");
        navigate('/dashboard', { replace: true });
      }
    } else if (!currentUser && !authLoading && location.pathname === '/') {
      // If not logged in and on the home page, show landing
      setCurrentView('landing');
    }
  }, [currentUser, isNewUser, preferences.completedQuestionnaire, authLoading, questionnaireShownThisSession, navigate, location.pathname]);

  const handleGetStarted = () => {
    setCurrentView('signup');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleSignup = () => {
    if (isNewUser && !preferences.completedQuestionnaire && !questionnaireShownThisSession) {
      setCurrentView('questionnaire');
      setQuestionnaireShownThisSession(true);
      localStorage.setItem(QUESTIONNAIRE_SHOWN_KEY, JSON.stringify(true));
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleCompleteQuestionnaire = async () => {
    if (currentUser) {
      await markUserOnboarded();
      completeQuestionnaire();
    }
    navigate('/dashboard', { replace: true });
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
    <>
      {/* Always render landing page when in landing view */}
      {currentView === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      
      {/* Render signup when in signup view */}
      {currentView === 'signup' && (
        <SignupPage 
          onBack={handleBackToLanding}
          onSignup={handleSignup}
        />
      )}
      
      {/* Render questionnaire when in questionnaire view */}
      {currentView === 'questionnaire' && (
        <Questionnaire
          updatePreferences={handleUpdatePreference}
          completeQuestionnaire={completeQuestionnaire}
          onBack={handleBackToLanding}
          onComplete={handleCompleteQuestionnaire}
        />
      )}
      
      {/* Render dashboard when in dashboard view */}
      {currentView === 'dashboard' && (
        <Dashboard
          preferences={preferences}
          onResetPreferences={handleResetPreferences}
        />
      )}
    </>
  );
};

export default Index;
