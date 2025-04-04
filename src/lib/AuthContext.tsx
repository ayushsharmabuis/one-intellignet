import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, getCurrentUser, getUserProfile, storeUserProfile, markUserAsExisting, type UserProfile } from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isNewUser: boolean;
  setCurrentUser: (user: User | null) => void;
  markUserOnboarded: () => Promise<boolean>;
  setIsNewUser: (value: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  isNewUser: false,
  setCurrentUser: () => {},
  markUserOnboarded: async () => false,
  setIsNewUser: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Local storage keys
const USER_STATUS_KEY = 'userStatus';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Function to fetch user profile data
  const fetchUserProfile = async (user: User) => {
    if (!user) return null;
    
    try {
      console.log("Fetching user profile for:", user.email);
      
      // Use a local cache to avoid redundant fetches
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      
      // Determine if this is a new user
      const newUserStatus = profile ? !!profile.isNewUser : true;
      setIsNewUser(newUserStatus);
      
      // If no profile exists yet, create one
      if (!profile) {
        console.log("Creating new user profile for:", user.email);
        storeUserProfile(user, true);
      }
      
      return profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Function to mark user as completed onboarding
  const markUserOnboarded = async (): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      console.log("Marking user as onboarded:", currentUser.email);
      
      // Update Firebase
      const success = await markUserAsExisting(currentUser.uid);
      
      if (success) {
        // Update local state
        setIsNewUser(false);
        setUserProfile(prev => {
          if (!prev) return null;
          const updated = { ...prev, isNewUser: false };
          console.log("Updated user profile:", updated);
          return updated;
        });
        
        // Store the status in localStorage for persistence
        try {
          localStorage.setItem(`${USER_STATUS_KEY}_${currentUser.uid}`, JSON.stringify({ 
            isOnboarded: true, 
            timestamp: new Date().toISOString() 
          }));
        } catch (error) {
          console.warn("Could not save onboarding status to localStorage:", error);
        }
        
        console.log("✅ User onboarding status updated successfully");
      } else {
        console.error("Failed to update user onboarding status in Firebase");
      }
      
      return success;
    } catch (error) {
      console.error("Error marking user as onboarded:", error);
      return false;
    }
  };
  
  // Function to log out
  const logout = async (): Promise<void> => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setUserProfile(null);
      setIsNewUser(false);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log("Auth state changed:", user?.email || "logged out");
      setCurrentUser(user);
      
      if (user) {
        // Fetch profile in the background
        fetchUserProfile(user);
      } else {
        setUserProfile(null);
        setIsNewUser(false);
      }
      
      setLoading(false);
    });

    // Cleanup
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    isNewUser,
    setCurrentUser,
    markUserOnboarded,
    setIsNewUser,
    logout,
  };

  // Render children unconditionally to avoid blank screen
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 