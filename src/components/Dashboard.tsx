import React, { useState, useEffect } from 'react';
import { Search, User, Menu, X, LogOut, Upload, BookmarkIcon, ArrowLeft, Shield, Bell, Star, ArrowRight, ExternalLink, ChevronDown, ChevronRight, Twitter, Github, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import AIToolCard, { AITool } from './AIToolCard';
import CategorySelector from './CategorySelector';
import { UserPreferences } from '../hooks/usePreferences';
import { useAuth } from '../lib/AuthContext';
import { logOut } from '../lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { allAITools, getToolsByCategory } from './AllAITools';
import { Switch } from '@/components/ui/switch';
import { professionalCategories } from '../data/professionalCategories';
import ProfessionalCategories from './ProfessionalCategories';
import ProfessionalTools from './ProfessionalTools';
import UploadToolsPage from './UploadToolsPage';
import ProfileMenu from './ProfileMenu';

// Simple Profile Component
const ProfileSection = ({ onBack, user }: { onBack: () => void, user: any }) => {
  const [name, setName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      // Implement your update profile logic here
      // For example: await updateUserProfile(user.uid, { displayName: name, username, bio });
      
      setMessage('Profile updated successfully!');
      setLoading(false);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="h-full">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-2xl font-bold text-white">Your Profile</h2>
      </div>
      
      <div className="bg-one-darker rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-full bg-one-light flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">{name || 'User'}</h3>
            <p className="text-gray-400 text-sm mb-3">{user?.email || 'No email address'}</p>
            <p className="text-gray-300">{bio || 'No bio yet'}</p>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-one-light text-white rounded-md border border-one-border focus:border-one-accent focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-one-light text-white rounded-md border border-one-border focus:border-one-accent focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-one-light text-white rounded-md border border-one-border focus:border-one-accent focus:outline-none"
            />
          </div>
          
          {message && (
            <p className={`text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </p>
          )}
          
          <Button 
            onClick={handleUpdateProfile} 
            disabled={loading}
            className="w-full bg-one-accent hover:bg-one-accent-hover"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface DashboardProps {
  preferences: UserPreferences;
  onResetPreferences?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ preferences }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredTools, setFilteredTools] = useState<AITool[]>([]);
  const { currentUser, setCurrentUser } = useAuth();
  const { toast } = useToast();
  const [savedTools, setSavedTools] = useState<string[]>([]);
  const [showUploadTools, setShowUploadTools] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedProfCategories, setExpandedProfCategories] = useState<string[]>([]);
  const [selectedProfCategory, setSelectedProfCategory] = useState('development');
  const [selectedProfSubcategory, setSelectedProfSubcategory] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const INITIAL_TOOL_COUNT = 9;
  
  // AI categories
  const aiCategories = [
    "AI Image Generation",
    "AI Video Generation",
    "AI Code Editor",
    "AI App Builder",
    "AI Writing",
    "AI for Editing",
    "AI for Music",
    "AI Text Generation"
  ];

  // Filter out Text to Video and Chatbots categories
  const filteredMockTools = mockAITools.filter(tool => 
    tool.category !== 'Text to Video' && tool.category !== 'Chatbots'
  );

  // Toggle category expansion to show subcategories
  const toggleCategoryExpansion = (categoryId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };
  
  // Handle category selection
  const handleProfCategorySelect = (categoryId: string, subcategoryId: string = '') => {
    setSelectedProfCategory(categoryId);
    setSelectedProfSubcategory(subcategoryId);
  };
  
  // Check if a category is expanded
  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId);
  };

  const toggleProfCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedProfCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  useEffect(() => {
    // Filter tools based on search and category
    let filtered = [...allAITools];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory === 'Saved Tools') {
      filtered = filtered.filter((tool) => savedTools.includes(tool.id));
    } else if (selectedCategory.startsWith('AI for Business:')) {
      // This is a subcategory selection
      const subcategory = selectedCategory.split(':')[1];
      if (subcategory === 'All Business Tools') {
        // Show all business tools
        filtered = filtered.filter((tool) => tool.category === 'AI for Business');
      } else {
        // Show only tools for this specific subcategory
        filtered = filtered.filter((tool) => 
          tool.category === 'AI for Business' && tool.subcategory === subcategory
        );
      }
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }

    // Filter by preferences (interest categories)
    if (preferences.interests.length > 0) {
      // Prioritize tools matching user interests but don't exclude others
      filtered.sort((a, b) => {
        const aMatchesInterest = preferences.interests.some(
          (interest) => a.category.toLowerCase().includes(interest) || a.category === interest
        );
        const bMatchesInterest = preferences.interests.some(
          (interest) => b.category.toLowerCase().includes(interest) || b.category === interest
        );

        if (aMatchesInterest && !bMatchesInterest) return -1;
        if (!aMatchesInterest && bMatchesInterest) return 1;
        return 0;
      });
    }

    // Check if we should limit the number of tools for this category
    const shouldLimit = !searchTerm && !expandedCategories.includes(selectedCategory);
    
    // Limit the number of tools for any category unless expanded
    if (shouldLimit) {
      filtered = filtered.slice(0, INITIAL_TOOL_COUNT);
    }

    setFilteredTools(filtered);
  }, [searchTerm, selectedCategory, preferences.interests, savedTools, expandedCategories]);

  useEffect(() => {
    // Simulate loading for animation purposes
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleShowMoreTools = () => {
    setExpandedCategories(prev => [...prev, selectedCategory]);
  };

  const getTotalToolCount = () => {
    if (selectedCategory === 'Saved Tools') {
      return allAITools.filter((tool) => savedTools.includes(tool.id)).length;
    } else if (selectedCategory !== 'all') {
      return allAITools.filter((tool) => tool.category === selectedCategory).length;
    }
    return allAITools.length;
  };

  if (showProfile) {
    return <ProfileSection onBack={() => setShowProfile(false)} user={currentUser} />;
  }

  // Add this useEffect to hide the "No tools found" message
  useEffect(() => {
    const hideEmptyMessage = () => {
      const emptyMessages = document.querySelectorAll('.p-6.bg-one-darker.rounded-lg.border.border-one-border');
      emptyMessages.forEach(element => {
        if (element.textContent?.includes('No tools found')) {
          (element as HTMLElement).style.display = 'none';
        }
      });
    };
    
    // Run initially and when search or category changes
    hideEmptyMessage();
    
    // Set up a mutation observer to handle dynamic content
    const observer = new MutationObserver(hideEmptyMessage);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [searchTerm, selectedProfCategory, selectedProfSubcategory]);

  // Ensure the component has the latest user preferences
  useEffect(() => {
    // If this is loaded directly via URL, ensure we have the right preferences
    if (currentUser && !isLoaded) {
      // Preferences should already be loaded via the usePreferences hook
      setIsLoaded(true);
      console.log("Dashboard loaded via direct URL, synced preferences");
    }
  }, [currentUser, isLoaded]);

  return (
    <div className="min-h-screen bg-one-dark flex flex-col">
      {/* Header */}
      <header className="bg-one-darker border-b border-one-border sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            {/* Hamburger menu button - Only visible on desktop */}
            <button
              className="mr-4 text-white hover:text-white hidden lg:block"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Logo />
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex relative max-w-lg w-full mx-8">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white">
              <Search size={18} />
            </div>
            <input
              type="search"
              className="w-full pl-10 pr-4 py-2 bg-one-light border border-one-border rounded-lg focus:outline-none focus:ring-1 focus:ring-one-accent text-white"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => {
                // Open upload tools in a new tab/window
                const uploadToolsURL = `${window.location.origin}/upload-tools`;
                window.open(uploadToolsURL, '_blank');
              }}
              variant="outline" 
              className="flex items-center space-x-2 bg-one-accent hover:bg-one-accent-hover text-white border-none md:px-6 md:py-3 px-3 py-2"
            >
              <Upload size={16} />
              <span className="md:inline hidden">Upload Your Tools</span>
              <span className="md:hidden inline">Upload</span>
            </Button>
            
            {/* Profile Button */}
            <div className="relative">
            <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="text-white hover:text-white p-2 rounded-full hover:bg-one-light transition-colors"
                aria-label="Open profile menu"
            >
              <User size={20} />
            </button>
              
              {/* Profile Menu */}
              <ProfileMenu 
                isOpen={profileMenuOpen} 
                onClose={() => setProfileMenuOpen(false)} 
              />
            </div>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white">
              <Search size={18} />
            </div>
            <input
              type="search"
              className="w-full pl-10 pr-4 py-2 bg-one-light border border-one-border rounded-lg focus:outline-none focus:ring-1 focus:ring-one-accent text-white"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Only visible on desktop */}
        <aside
          className={`fixed lg:relative inset-0 lg:inset-auto z-20 w-64 bg-one-darker border-r border-one-border transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0 lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
          } lg:block hidden`}
        >
          {/* User Profile Section - At the top */}
          <div className="p-4 border-b border-one-border">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-white mb-4">
              Your Profile
            </h2>
            
            {/* User Profile */}
            {currentUser && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-one-accent/20 flex items-center justify-center mr-2">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || 'User'} 
                        className="w-8 h-8 rounded-full" 
                      />
                    ) : (
                      <User size={16} className="text-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-300">
                      {currentUser.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white mb-3">
              Preferences
            </h3>
            
            <div className="space-y-2 mb-4">
              {preferences.interests.length > 0 ? (
                <div>
                  <div className="text-xs text-white mb-1">Interests:</div>
                  <div className="flex flex-wrap gap-2">
                    {preferences.interests.map((interest) => (
                      <span key={interest} className="text-xs px-2 py-1 rounded-full bg-one-light text-white">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-white">No preferences set</div>
              )}
            </div>
          </div>

          {/* Categories Section - Moved closer to the top */}
          <div className="p-4 mt-2">
            {/* First show the Saved Tools button */}
            <button
              onClick={() => handleCategorySelect('Saved Tools')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                selectedCategory === 'Saved Tools'
                  ? 'bg-one-accent/10 text-one-accent'
                  : 'text-white hover:bg-one-light hover:text-white'
              } mb-4`}
            >
              <BookmarkIcon size={16} className="mr-2" />
              Saved Tools
              {savedTools.length > 0 && (
                <span className="ml-auto bg-one-accent text-white text-xs rounded-full px-2 py-0.5">
                  {savedTools.length}
                </span>
              )}
            </button>
            
            {/* AI Categories Header */}
            <h2 className="font-semibold text-sm uppercase tracking-wider text-white mb-4">
              AI Categories
            </h2>
            
            <nav className="space-y-1">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-one-accent/10 text-one-accent'
                    : 'text-white hover:bg-one-light hover:text-white'
                }`}
              >
                All AI Tools
              </button>
              
              {/* AI Categories */}
              {aiCategories.map((category) => (
                <div key={category}>
                  <button
                    onClick={category === "AI for Business" 
                      ? (e) => toggleCategoryExpansion(category, e)
                      : () => handleCategorySelect(category)
                    }
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category
                        ? "bg-one-accent/10 text-one-accent"
                        : "text-white hover:bg-one-light hover:text-white"
                    }`}
                  >
                    <span>{category}</span>
                    {category === "AI for Business" && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className={`transition-transform ${expandedCategories.includes(category) ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                  </button>
                  
                  {/* Business subcategories dropdown */}
                  {category === "AI for Business" && expandedCategories.includes(category) && (
                    <div className="ml-3 mt-1 space-y-1 border-l border-one-border pl-3">
                      <button
                        onClick={(e) => {
                          handleProfCategorySelect(category);
                          e.stopPropagation();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                          selectedProfCategory === category
                            ? 'bg-one-accent/10 text-one-accent'
                            : 'text-white hover:bg-one-light hover:text-white'
                        }`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                          <line x1="8" y1="21" x2="16" y2="21"></line>
                          <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        All Business Tools
                      </button>
                      
                      <button
                        onClick={(e) => {
                          handleProfCategorySelect(category);
                          e.stopPropagation();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                          selectedProfCategory === 'AI for Sales'
                            ? 'bg-one-accent/10 text-one-accent'
                            : 'text-white hover:bg-one-light hover:text-white'
                        }`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        AI for Sales
                      </button>
                      
                      <button
                        onClick={(e) => {
                          handleProfCategorySelect(category);
                          e.stopPropagation();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                          selectedProfCategory === 'AI for Marketing'
                            ? 'bg-one-accent/10 text-one-accent'
                            : 'text-white hover:bg-one-light hover:text-white'
                        }`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                        AI for Marketing
                      </button>
                      
                      <button
                        onClick={(e) => {
                          handleProfCategorySelect(category);
                          e.stopPropagation();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                          selectedProfCategory === 'AI for Logo Design'
                            ? 'bg-one-accent/10 text-one-accent'
                            : 'text-white hover:bg-one-light hover:text-white'
                        }`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                          <path d="M2 2l7.586 7.586"></path>
                          <circle cx="11" cy="11" r="2"></circle>
                        </svg>
                        AI for Logo Design
                      </button>
                      
                      <button
                        onClick={(e) => {
                          handleProfCategorySelect(category);
                          e.stopPropagation();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                          selectedProfCategory === 'AI for Customer Support'
                            ? 'bg-one-accent/10 text-one-accent'
                            : 'text-white hover:bg-one-light hover:text-white'
                        }`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        AI for Customer Support
                      </button>
                      
                      <button
                        onClick={(e) => {
                          handleProfCategorySelect(category);
                          e.stopPropagation();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                          selectedProfCategory === 'AI for Finance & Accounting'
                            ? 'bg-one-accent/10 text-one-accent'
                            : 'text-white hover:bg-one-light hover:text-white'
                        }`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        AI for Finance & Accounting
                      </button>
                      
                      <button
                        onClick={(e) => {
                          handleProfCategorySelect(category);
                          e.stopPropagation();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                          selectedProfCategory === 'AI for Productivity & Automation'
                            ? 'bg-one-accent/10 text-one-accent'
                            : 'text-white hover:bg-one-light hover:text-white'
                        }`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                        </svg>
                        AI for Productivity & Automation
                      </button>
                      
                      <button
                        onClick={(e) => {
                          handleProfCategorySelect(category);
                          e.stopPropagation();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                          selectedProfCategory === 'AI for Supply Chain & Logistics'
                            ? 'bg-one-accent/10 text-one-accent'
                            : 'text-white hover:bg-one-light hover:text-white'
                        }`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <rect x="1" y="3" width="15" height="13"></rect>
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                          <circle cx="5.5" cy="18.5" r="2.5"></circle>
                          <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                        AI for Supply Chain & Logistics
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Add this before your Professional Categories section - make it smaller on mobile */}
          <div className="h-12 md:h-72"></div> {/* Adjusted height for mobile vs desktop */}

          {/* Professional Categories section */}
          <div className="p-3 border-t border-[#1f1f2f] pt-4 professional-categories-section">
            <div className="py-2 px-2 text-white font-semibold mb-3">
              Professional Categories
            </div>
            
            <div className="space-y-1">
              {professionalCategories.map((category) => (
                <div key={category.id} className="mb-1">
                  <div 
                    className={`flex items-center justify-between py-2 px-3 rounded-md cursor-pointer ${
                      selectedProfCategory === category.id && !selectedProfSubcategory
                        ? 'bg-[#292952] text-purple-400' 
                        : 'text-gray-300 hover:bg-[#15151e]'
                    }`}
                    onClick={() => handleProfCategorySelect(category.id)}
                  >
                    <span>{category.name}</span>
                    <ChevronRight 
                      size={16} 
                      className={`text-gray-400 transition-transform ${
                        expandedProfCategories.includes(category.id) ? 'rotate-90' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Only for mobile: ensure single category expansion
                        // For desktop: allow multiple categories to be expanded
                        const isMobile = window.innerWidth < 1024;
                        if (isMobile) {
                          setExpandedProfCategories(
                            expandedProfCategories.includes(category.id) 
                              ? [] 
                              : [category.id]
                          );
                        } else {
                          // Original desktop behavior - toggle individual category
                          const newExpanded = expandedProfCategories.includes(category.id)
                            ? expandedProfCategories.filter(id => id !== category.id)
                            : [...expandedProfCategories, category.id];
                          setExpandedProfCategories(newExpanded);
                        }
                      }}
                    />
                  </div>
                  
                  {/* Subcategories */}
                  {expandedProfCategories.includes(category.id) && (
                    <div className="ml-3 mt-1 border-l border-[#1f1f2f] pl-3">
                      {category.subcategories.map((subcategory) => (
                        <div 
                          key={subcategory.id}
                          className={`py-2 px-3 text-sm ${
                            selectedProfCategory === category.id && selectedProfSubcategory === subcategory.id
                              ? 'bg-[#292952] text-purple-400' 
                              : 'text-gray-400 hover:text-white hover:bg-[#15151e]'
                          } rounded-md cursor-pointer mb-1`}
                          onClick={() => handleProfCategorySelect(category.id, subcategory.id)}
                        >
                          {subcategory.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {showUploadTools ? (
            /* Render UploadToolsPage when showUploadTools is true */
            <UploadToolsPage onBack={() => setShowUploadTools(false)} />
          ) : (
            /* Render regular dashboard content */
            <div className="p-6">
              {/* Mobile Category Selector */}
              <div className="mb-8 lg:hidden">
                <CategorySelector
                  categories={['Saved Tools', 'All AI Tools', ...aiCategories]}
                  selectedCategory={selectedCategory === 'all' ? 'All AI Tools' : selectedCategory}
                  onSelectCategory={(category) => handleCategorySelect(category === 'All AI Tools' ? 'all' : category)}
                />
              </div>

              {/* Mobile Professional Categories */}
              <div className="mb-6 lg:hidden">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <span className="text-purple-400 mr-2">Professional Categories</span>
                  <div className="h-px bg-gradient-to-r from-purple-500 to-transparent flex-grow"></div>
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {professionalCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        handleProfCategorySelect(category.id);
                        // Set expanded categories to ONLY this category
                        // This ensures only one category is expanded at a time
                        setExpandedProfCategories(
                          expandedProfCategories.includes(category.id) 
                            ? [] 
                            : [category.id]
                        );
                        // Show toast notification
                        toast({
                          title: "Tools loaded",
                          description: "Scroll down to view AI tools for this category",
                          duration: 3000,
                        });
                        
                        // Auto-scroll to professional tools section after a short delay
                        setTimeout(() => {
                          const toolsSection = document.querySelector('.text-purple-400.mr-3');
                          if (toolsSection) {
                            const yOffset = -100; // Offset to show some context above
                            const y = toolsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({top: y, behavior: 'smooth'});
                          }
                        }, 300);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        selectedProfCategory === category.id
                          ? 'bg-one-accent text-white'
                          : 'bg-one-darker text-gray-300 hover:bg-one-light hover:text-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                
                {/* Mobile Subcategories - Only one category shown at a time */}
                {professionalCategories.map((category) => 
                  expandedProfCategories.includes(category.id) && (
                    <div key={`subcategories-${category.id}`} className="bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-purple-900/30 mb-4">
                      <h4 className="text-sm font-medium text-white mb-2">{category.name} Categories:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => {
                              handleProfCategorySelect(category.id, subcategory.id);
                              // Show toast notification
                              toast({
                                title: "Subcategory selected",
                                description: "Scroll down to view AI tools for this subcategory",
                                duration: 3000,
                              });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs ${
                              selectedProfCategory === category.id && selectedProfSubcategory === subcategory.id
                                ? 'bg-one-accent text-white'
                                : 'bg-one-darker text-gray-300 hover:bg-one-light hover:text-white'
                            }`}
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className={`transform transition-all duration-500 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {/* Welcome Message */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-white mb-2">Welcome to your AI dashboard</h1>
                  <p className="text-gray-300">
                    Discover and access powerful AI tools tailored to your preferences
                  </p>
                </div>

                {/* AI Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map((tool, index) => (
                    <div
                      key={tool.id}
                      className={`transform transition-all duration-500 ${
                        isLoaded
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 0.05}s` }}
                    >
                      {/* Pass only the supported props to AIToolCard */}
                      <AIToolCard 
                        tool={tool} 
                        index={index} 
                      />
                    </div>
                  ))}
                </div>

                {/* Show More button */}
                {!searchTerm && filteredTools.length === INITIAL_TOOL_COUNT && getTotalToolCount() > INITIAL_TOOL_COUNT && !expandedCategories.includes(selectedCategory) && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={handleShowMoreTools}
                      className="px-6 py-3 bg-one-accent text-white rounded-lg hover:bg-one-accent/90 transition-colors flex items-center gap-2"
                    >
                      <span>Show more AI tools</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Professional Tools Section */}
                {selectedProfCategory && (
                  <div className="mb-0 mt-8 md:mt-0" style={{ marginBottom: "-1px" }}>
                    {/* Mobile indicator that appears when category is selected */}
                    <div className="lg:hidden fixed bottom-4 right-4 z-30 animate-pulse">
                      <button 
                        onClick={() => {
                          // Scroll to the professional tools section
                          document.querySelector('.text-purple-400.mr-3')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-one-accent text-white rounded-full p-3 shadow-lg flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14M5 12l7 7 7-7"/>
                        </svg>
                        <span className="ml-2 mr-1">View Tools</span>
                      </button>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-6">
                      <div className="flex items-center">
                        <span className="text-purple-400 mr-3">Professional AI Tools</span>
                        <div className="h-px bg-gradient-to-r from-purple-500 to-transparent flex-grow"></div>
                      </div>
                    </h2>
                    
                    <ProfessionalTools
                      selectedCategory={selectedProfCategory} 
                      selectedSubcategory={selectedProfSubcategory}
                      searchTerm={searchTerm}
                      tools={allAITools}
                      professionalCategories={professionalCategories}
                    />
                  </div>
                )}

                {/* Why We Built One-Intelligent Section */}
                <div className="mt-20 bg-gradient-to-br from-one-darker to-black rounded-xl p-12 border border-one-border overflow-hidden relative shadow-2xl">
                  {/* Background elements for visual interest */}
                  <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/10 rounded-full blur-3xl"></div>
                  
                  <article className="relative z-10">
                    <header className="text-center mb-12">
                      <h2 className="text-4xl font-bold text-white mb-4" id="why-one-intelligent">Why We Built One-Intelligent</h2>
                      <p className="text-xl text-purple-400 mb-4 font-medium">Revolutionizing how people discover and use AI tools</p>
                      <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"></div>
                    </header>
                    
                    <div className="grid md:grid-cols-3 gap-8 text-gray-300">
                      <section className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-purple-900/30 shadow-lg hover:border-purple-500/30 transition-all duration-300">
                        <h3 className="text-2xl font-semibold text-white mb-6">The Challenge</h3>
                        <p className="mb-6">The AI ecosystem is growing rapidly but remains fragmented and inaccessible:</p>
                        <ul className="space-y-4">
                          <li className="flex items-start">
                            <span className="text-red-400 mr-3 mt-1">●</span>
                            <span>Thousands of AI tools scattered across the web</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-red-400 mr-3 mt-1">●</span>
                            <span>Difficult to find the right tool for specific needs</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-red-400 mr-3 mt-1">●</span>
                            <span>High technical barriers for average users</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-red-400 mr-3 mt-1">●</span>
                            <span>Premium pricing makes many tools inaccessible</span>
                          </li>
                      </ul>
                      </section>
                      
                      <section className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-purple-900/30 shadow-lg hover:border-purple-500/30 transition-all duration-300">
                        <h3 className="text-2xl font-semibold text-white mb-6">Our Solution</h3>
                        <p className="mb-6">One-Intelligent brings together the best AI tools in a single, accessible platform:</p>
                        <ul className="space-y-4">
                          <li className="flex items-start">
                            <span className="text-green-400 mr-3 mt-1">●</span>
                            <span><strong className="text-white">Unified Directory:</strong> 1000+ AI tools in one place</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-3 mt-1">●</span>
                            <span><strong className="text-white">Intelligent Categories:</strong> Find tools for your specific needs</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-3 mt-1">●</span>
                            <span><strong className="text-white">Simplified Access:</strong> User-friendly interface for everyone</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-3 mt-1">●</span>
                            <span><strong className="text-white">Cost Effective:</strong> Free options and affordable integration</span>
                          </li>
                      </ul>
                      </section>
                      
                      <section className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-purple-900/30 shadow-lg hover:border-purple-500/30 transition-all duration-300">
                        <h3 className="text-2xl font-semibold text-white mb-6">Our Mission</h3>
                        <p className="mb-6">We're democratizing access to AI technology for everyone:</p>
                        <ul className="space-y-4">
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-3 mt-1">●</span>
                            <span><strong className="text-white">Universal Access:</strong> Making AI available to all skill levels</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-3 mt-1">●</span>
                            <span><strong className="text-white">Productivity Focus:</strong> Helping professionals work smarter</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-3 mt-1">●</span>
                            <span><strong className="text-white">Education:</strong> Building AI literacy through practical tools</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-3 mt-1">●</span>
                            <span><strong className="text-white">Innovation:</strong> Driving the future of AI integration</span>
                          </li>
                        </ul>
                      </section>
                    </div>
                    
                    <footer className="mt-12 text-center">
                      <p className="text-2xl font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 text-transparent bg-clip-text inline-block pb-1">
                        Discover the power of AI with One-Intelligent - Your gateway to the future
                      </p>
                    </footer>
                  </article>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-one-darker border-t border-one-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <Logo className="h-8" />
              </div>
              <p className="text-gray-400 mb-4">Unifying the world's AI tools in one intelligent platform.</p>
              <div className="flex space-x-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-one-light p-2 rounded-full hover:bg-one-accent transition-colors">
                  <Twitter size={16} className="text-white" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-one-light p-2 rounded-full hover:bg-one-accent transition-colors">
                  <Github size={16} className="text-white" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-one-light p-2 rounded-full hover:bg-one-accent transition-colors">
                  <Linkedin size={16} className="text-white" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-one-light p-2 rounded-full hover:bg-one-accent transition-colors">
                  <Instagram size={16} className="text-white" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-white font-medium text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/pricing" state={{ fromDashboard: true }} className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
                </li>
                <li>
                  <Link to="/integrations" state={{ fromDashboard: true }} className="text-gray-400 hover:text-white transition-colors">Integrations</Link>
                </li>
                <li>
                  <Link to="/whats-new" state={{ fromDashboard: true }} className="text-gray-400 hover:text-white transition-colors">What's New</Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-medium text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" state={{ fromDashboard: true }} className="text-gray-400 hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/careers" state={{ fromDashboard: true }} className="text-gray-400 hover:text-white transition-colors">Careers</Link>
                </li>
                <li>
                  <Link to="/legal" state={{ fromDashboard: true }} className="text-gray-400 hover:text-white transition-colors">Legal</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-one-border flex flex-col md:flex-row justify-between items-center">
            <div>
            <p className="text-gray-400 text-sm">© 2025 One-Intelligent. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/legal#privacy" state={{ fromDashboard: true }} className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link to="/legal#terms" state={{ fromDashboard: true }} className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link to="/legal#cookies" state={{ fromDashboard: true }} className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Sidebar Overlay - Only for PC view */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Mock data for AI tools
const mockAITools: AITool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'A versatile AI chatbot by OpenAI, capable of natural language understanding and generation.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://chat.openai.com',
    rating: 4.8,
    pricing: 'Freemium (Free + Paid for GPT-4)'
  },
  {
    id: '2',
    name: 'Google Gemini',
    description: 'Google\'s advanced AI chatbot powered by the Gemini model, designed for conversational AI and real-time information.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://gemini.google.com',
    rating: 4.6,
    pricing: 'Free'
  },
  {
    id: '3',
    name: 'Microsoft Bing AI',
    description: 'Integrated with Bing search, this chatbot provides real-time information and assistance.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://bing.com/chat',
    rating: 4.5,
    pricing: 'Free'
  },
  {
    id: '4',
    name: 'Claude',
    description: 'A conversational AI focused on safety and helpfulness, developed by Anthropic.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://claude.ai',
    rating: 4.7,
    pricing: 'Freemium (Free + Paid for Claude Pro)'
  },
  {
    id: '5',
    name: 'Perplexity AI',
    description: 'An AI-powered search engine and chatbot that provides concise, sourced answers.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://perplexity.ai',
    rating: 4.7,
    pricing: 'Freemium (Free + Paid for Pro features)'
  },
  {
    id: '6',
    name: 'DeepSeek Chat',
    description: 'A powerful AI chatbot developed by DeepSeek, offering advanced conversational capabilities.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://deepseek.com',
    rating: 4.5,
    pricing: 'Freemium (Free + Paid for advanced features)'
  },
  {
    id: '7',
    name: 'HuggingChat',
    description: 'An open-source AI chatbot by Hugging Face, offering customizable conversational AI.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://huggingface.co/chat',
    rating: 4.4,
    pricing: 'Free'
  },
  {
    id: '8',
    name: 'Jasper Chat',
    description: 'A chatbot designed for businesses, specializing in content creation and marketing.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://jasper.ai',
    rating: 4.6,
    pricing: 'Paid (Starts at $39/month)'
  },
  {
    id: '9',
    name: 'Character.AI',
    description: 'A chatbot platform that allows users to create and interact with AI-powered characters.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://beta.character.ai',
    rating: 4.7,
    pricing: 'Freemium (Free + Paid for faster responses)'
  },
  {
    id: '10',
    name: 'Replika',
    description: 'An AI companion chatbot focused on emotional support and personal interaction.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://replika.ai',
    rating: 4.5,
    pricing: 'Freemium (Free + Paid for premium features)'
  },
  {
    id: '11',
    name: 'Mantra AI',
    description: 'Mantra AI is Indian powered AI Chatbot powered by one-intelligent.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://mantraai.netlify.app',
    rating: 4.6,
    pricing: 'Free'
  },
  {
    id: '12',
    name: 'x.ai',
    description: 'A high-performance AI platform designed for fast and efficient AI inference.',
    category: 'Chatbots',
    icon: 'https://via.placeholder.com/30',
    url: 'https://x.ai',
    rating: 4.8,
    pricing: 'Paid (Contact for pricing)'
  },
  // Text to Video Tools
  {
    id: '13',
    name: 'Synthesia',
    description: 'A leading AI video generation platform that creates professional videos from text using AI avatars.',
    category: 'Text to Video',
    icon: 'https://via.placeholder.com/30',
    url: 'https://synthesia.io',
    rating: 4.7,
    pricing: 'Paid (Starts at $30/month)'
  },
  {
    id: '14',
    name: 'Pictory',
    description: 'Converts blog posts and text into engaging videos with AI voiceovers and visuals.',
    category: 'Text to Video',
    icon: 'https://via.placeholder.com/30',
    url: 'https://pictory.ai',
    rating: 4.6,
    pricing: 'Freemium (Free + Paid plans from $19/month)'
  },
  {
    id: '15',
    name: 'Lumen5',
    description: 'A user-friendly tool that transforms text into videos for marketing, social media, and presentations.',
    category: 'Text to Video',
    icon: 'https://via.placeholder.com/30',
    url: 'https://lumen5.com',
    rating: 4.5,
    pricing: 'Freemium (Free + Paid plans from $29/month)'
  },
  {
    id: '16',
    name: 'Runway ML',
    description: 'A creative suite for AI-powered video editing, including text-to-video generation.',
    category: 'Text to Video',
    icon: 'https://via.placeholder.com/30',
    url: 'https://runwayml.com',
    rating: 4.8,
    pricing: 'Freemium (Free + Paid plans from $15/month)'
  },
  {
    id: '17',
    name: 'InVideo',
    description: 'A video creation platform that uses AI to turn text into professional videos with templates.',
    category: 'Text to Video',
    icon: 'https://via.placeholder.com/30',
    url: 'https://invideo.io',
    rating: 4.6,
    pricing: 'Freemium (Free + Paid plans from $15/month)'
  },
  {
    id: '18',
    name: 'Designs.ai',
    description: 'An AI-powered design suite that includes text-to-video capabilities for quick video creation.',
    category: 'Text to Video',
    icon: 'https://via.placeholder.com/30',
    url: 'https://designs.ai',
    rating: 4.5,
    pricing: 'Freemium (Free + Paid plans from $29/month)'
  },
  {
    id: '19',
    name: 'Elai.io',
    description: 'Generates videos from text using AI avatars and voiceovers in multiple languages.',
    category: 'Text to Video',
    icon: 'https://via.placeholder.com/30',
    url: 'https://elai.io',
    rating: 4.6,
    pricing: 'Freemium (Free + Paid plans from $23/month)'
  },
  {
    id: '20',
    name: 'Pictory',
    description: 'Converts long-form text into short, engaging videos with AI-generated visuals and voiceovers.',
    category: 'Text to Video',
    icon: 'https://via.placeholder.com/30',
    url: 'https://pictory.ai',
    rating: 4.7,
    pricing: 'Freemium (Free + Paid plans from $19/month)'
  },
  {
    id: '21',
    name: 'DeepBrain AI',
    description: 'Creates AI-generated videos from text using realistic AI avatars and voice synthesis.',
    category: 'Text to Video',
    icon: 'https://via.placeholder.com/30',
    url: 'https://deepbrain.io',
    rating: 4.6,
    pricing: 'Paid (Starts at $30/month)'
  },
  {
    id: '22',
    name: 'Vidnami',
    description: 'A video creation tool that uses AI to turn text into engaging marketing videos.',
    category: 'Text to Video',
    icon: 'https://via.placeholder.com/30',
    url: 'https://godaddy.com',
    rating: 4.5,
    pricing: 'Paid (Contact for pricing)'
  }
];

export default Dashboard;
