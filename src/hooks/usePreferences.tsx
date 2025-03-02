
import { useState, useEffect } from 'react';

// Define types for user preferences
export interface UserPreferences {
  interests: string[];
  frequency: string;
  pricingPreference: string;
  completedQuestionnaire: boolean;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  interests: [],
  frequency: '',
  pricingPreference: '',
  completedQuestionnaire: false,
};

export const usePreferences = () => {
  // Initialize state from localStorage if available
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const savedPrefs = localStorage.getItem('userPreferences');
      return savedPrefs ? JSON.parse(savedPrefs) : defaultPreferences;
    } catch (error) {
      console.error('Error loading preferences from localStorage:', error);
      return defaultPreferences;
    }
  });

  // Update localStorage when preferences change
  useEffect(() => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences to localStorage:', error);
    }
  }, [preferences]);

  // Update interests
  const updateInterests = (interests: string[]) => {
    setPreferences(prev => ({ ...prev, interests }));
  };

  // Update frequency
  const updateFrequency = (frequency: string) => {
    setPreferences(prev => ({ ...prev, frequency }));
  };

  // Update pricing preference
  const updatePricingPreference = (pricingPreference: string) => {
    setPreferences(prev => ({ ...prev, pricingPreference }));
  };

  // Mark questionnaire as completed
  const completeQuestionnaire = () => {
    setPreferences(prev => ({ ...prev, completedQuestionnaire: true }));
  };

  // Reset preferences to default
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
  };

  return {
    preferences,
    updateInterests,
    updateFrequency,
    updatePricingPreference,
    completeQuestionnaire,
    resetPreferences,
  };
};
