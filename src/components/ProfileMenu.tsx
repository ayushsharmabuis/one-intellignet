import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { usePreferences } from '../hooks/usePreferences';
import { updateUserProfile } from '../lib/firebase';
import { User, Mail, LogOut, Edit2, Check, X, Loader } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const { preferences } = usePreferences();
  const { toast } = useToast();
  const menuRef = useRef<HTMLDivElement>(null);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set display name from currentUser when component mounts or user changes
    setDisplayName(currentUser?.displayName || '');
  }, [currentUser]);

  useEffect(() => {
    // Handle clicks outside the menu to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSaveDisplayName = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const result = await updateUserProfile(currentUser, displayName);
      if (result.success) {
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your display name has been updated successfully.",
        });
      } else {
        toast({
          title: "Update failed",
          description: result.error || "An error occurred while updating your profile.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate('/', { replace: true });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while trying to log out.",
        variant: "destructive"
      });
    }
  };

  // Get readable labels for preferences
  const getInterestLabels = () => {
    const interestMap: Record<string, string> = {
      chatbots: 'Chatbots',
      code: 'Code Generation',
      design: 'AI Design Tools',
      video: 'AI Video Tools',
      automation: 'Automation',
      writing: 'Content Writing',
      audio: 'Audio & Music',
      research: 'Research & Analysis'
    };
    
    return preferences.interests.map(interest => interestMap[interest] || interest);
  };
  
  const getFrequencyLabel = () => {
    const frequencyMap: Record<string, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      rarely: 'Rarely'
    };
    
    return frequencyMap[preferences.frequency] || preferences.frequency;
  };
  
  const getPricingLabel = () => {
    const pricingMap: Record<string, string> = {
      free: 'Free Tools Only',
      premium: 'Premium Tools',
      both: 'Both Free & Premium'
    };
    
    return pricingMap[preferences.pricingPreference] || preferences.pricingPreference;
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute top-16 right-4 w-80 bg-one-dark border border-one-border rounded-lg shadow-xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-one-accent/10 px-4 py-3 border-b border-one-border">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-one-accent/20 flex items-center justify-center mr-3">
            <User size={20} className="text-one-accent" />
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-sm bg-one-darker border border-one-border py-1 px-2 rounded w-full focus:border-one-accent/70 focus:ring-one-accent/40 transition-all"
                  placeholder="Enter your name"
                  disabled={loading}
                />
                <button 
                  onClick={handleSaveDisplayName}
                  disabled={loading}
                  className="text-white p-1 bg-one-accent rounded-full hover:bg-one-accent/80"
                >
                  {loading ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setDisplayName(currentUser?.displayName || '');
                  }}
                  className="text-one-text-muted p-1 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  {currentUser?.displayName || 'User'}
                </h3>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-one-text-muted hover:text-white p-1"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            
            <div className="flex items-center text-sm text-one-text-muted">
              <Mail size={12} className="mr-1" />
              {currentUser?.email}
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="p-4">
        <h4 className="text-sm font-medium uppercase text-one-text-muted mb-2">Your Preferences</h4>
        
        {/* Interests */}
        <div className="mb-4">
          <h5 className="text-xs text-one-text-muted">Interests</h5>
          <div className="flex flex-wrap gap-1 mt-1">
            {getInterestLabels().map((interest, index) => (
              <span 
                key={index}
                className="text-xs bg-one-accent/10 border border-one-accent/20 rounded-full px-2 py-0.5 text-one-accent"
              >
                {interest}
              </span>
            ))}
            {preferences.interests.length === 0 && (
              <span className="text-xs text-one-text-muted">No interests selected</span>
            )}
          </div>
        </div>
        
        {/* Frequency */}
        <div className="mb-4">
          <h5 className="text-xs text-one-text-muted">Usage Frequency</h5>
          <div className="text-sm mt-1">
            {preferences.frequency ? getFrequencyLabel() : 'Not specified'}
          </div>
        </div>
        
        {/* Pricing */}
        <div className="mb-4">
          <h5 className="text-xs text-one-text-muted">Pricing Preference</h5>
          <div className="text-sm mt-1">
            {preferences.pricingPreference ? getPricingLabel() : 'Not specified'}
          </div>
        </div>
      </div>
      
      {/* Footer with Actions */}
      <div className="border-t border-one-border p-3">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-one-light py-2 text-sm text-one-text-muted hover:text-white transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu; 