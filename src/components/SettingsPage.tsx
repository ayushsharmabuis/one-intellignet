import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, Globe, Bell, Shield, Eye, Lock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '../lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Theme settings
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [toolUpdates, setToolUpdates] = useState(true);
  const [newFeatures, setNewFeatures] = useState(true);
  
  // Privacy settings
  const [shareUsageData, setShareUsageData] = useState(false);
  const [enhancedPrivacy, setEnhancedPrivacy] = useState(true);
  
  // Save settings handler
  const handleSaveSettings = () => {
    // Here you would typically save these settings to a database or local storage
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-one-dark text-one-text">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-one-text-muted hover:text-white mr-4"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="space-y-10">
          {/* Appearance Settings */}
          <div className="bg-one-darker border border-one-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Sun size={20} className="mr-2 text-one-accent" />
              Appearance
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-one-text-muted">Enable dark theme for the application</p>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Font Size</h3>
                  <span className="text-sm bg-one-light px-2 py-1 rounded">
                    {fontSize}px
                  </span>
                </div>
                <p className="text-sm text-one-text-muted mb-4">Adjust the text size throughout the application</p>
                <Slider 
                  value={[fontSize]} 
                  min={12} 
                  max={24} 
                  step={1}
                  onValueChange={(value) => setFontSize(value[0])}
                />
              </div>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-one-darker border border-one-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Bell size={20} className="mr-2 text-one-accent" />
              Notifications
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-one-text-muted">Receive important updates via email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Tool Updates</h3>
                  <p className="text-sm text-one-text-muted">Get notified when tools are updated</p>
                </div>
                <Switch 
                  checked={toolUpdates} 
                  onCheckedChange={setToolUpdates} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">New Features</h3>
                  <p className="text-sm text-one-text-muted">Be informed about new platform features</p>
                </div>
                <Switch 
                  checked={newFeatures} 
                  onCheckedChange={setNewFeatures} 
                />
              </div>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div className="bg-one-darker border border-one-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Shield size={20} className="mr-2 text-one-accent" />
              Privacy & Security
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enhanced Privacy Mode</h3>
                  <p className="text-sm text-one-text-muted">Enable stricter privacy protections</p>
                </div>
                <Switch 
                  checked={enhancedPrivacy} 
                  onCheckedChange={setEnhancedPrivacy} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Usage Data Sharing</h3>
                  <p className="text-sm text-one-text-muted">Share anonymous usage data to improve the platform</p>
                </div>
                <Switch 
                  checked={shareUsageData} 
                  onCheckedChange={setShareUsageData} 
                />
              </div>
              
              <div>
                <Button 
                  variant="outline" 
                  className="w-full border-one-border hover:bg-one-light text-one-text"
                >
                  <Lock size={16} className="mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings}
              className="bg-one-accent hover:bg-one-accent-hover text-white flex items-center gap-2 py-6 px-8"
            >
              <Save size={16} />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 