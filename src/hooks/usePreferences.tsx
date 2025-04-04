import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';

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
  const { currentUser, isNewUser, userProfile } = useAuth();
  const userId = currentUser?.uid || 'anonymous';
  
  // Initialize state from localStorage if available
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const storageKey = `userPreferences_${userId}`;
      const savedPrefs = localStorage.getItem(storageKey);
      return savedPrefs ? JSON.parse(savedPrefs) : defaultPreferences;
    } catch (error) {
      console.error('Error loading preferences from localStorage:', error);
      return defaultPreferences;
    }
  });

  // Synchronize with Firebase user status
  useEffect(() => {
    if (currentUser && userProfile) {
      // If user exists in Firebase and has a profile
      const completedQuestionnaire = userProfile.isNewUser === false;
      
      if (completedQuestionnaire !== preferences.completedQuestionnaire) {
        console.log("Updating questionnaire status from Firebase:", completedQuestionnaire);
        setPreferences(prev => ({
          ...prev,
          completedQuestionnaire
        }));
      }
    }
  }, [currentUser, userProfile, isNewUser, preferences.completedQuestionnaire]);

  // Update localStorage when preferences change
  useEffect(() => {
    try {
      const storageKey = `userPreferences_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences to localStorage:', error);
    }
  }, [preferences, userId]);

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
    const storageKey = `userPreferences_${userId}`;
    setPreferences(defaultPreferences);
    localStorage.removeItem(storageKey);
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
