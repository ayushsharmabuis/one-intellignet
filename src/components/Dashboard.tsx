import React, { useState, useEffect } from 'react';
import { Search, User, Bell, Menu, X, LogOut } from 'lucide-react';
import Logo from './Logo';
import AIToolCard, { AITool } from './AIToolCard';
import CategorySelector from './CategorySelector';
import { UserPreferences } from '../hooks/usePreferences';

interface DashboardProps {
  preferences: UserPreferences;
  onResetPreferences: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ preferences, onResetPreferences }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredTools, setFilteredTools] = useState<AITool[]>([]);

  // Get all category names from the tools list
  const categories = [...new Set(mockAITools.map((tool) => tool.category))];

  useEffect(() => {
    // Filter tools based on search and category
    let filtered = [...mockAITools];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
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

    setFilteredTools(filtered);
  }, [searchTerm, selectedCategory, preferences.interests]);

  useEffect(() => {
    // Simulate loading for animation purposes
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-one-dark flex flex-col">
      {/* Header */}
      <header className="bg-one-darker border-b border-one-border sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="mr-4 text-one-text-muted hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Logo />
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex relative max-w-lg w-full mx-8">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-one-text-muted">
              <Search size={18} />
            </div>
            <input
              type="search"
              className="w-full pl-10 pr-4 py-2 bg-one-light border border-one-border rounded-lg focus:outline-none focus:ring-1 focus:ring-one-accent text-one-text"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-one-text-muted hover:text-white p-2 rounded-full hover:bg-one-light transition-colors">
              <Bell size={20} />
            </button>
            <button className="text-one-text-muted hover:text-white p-2 rounded-full hover:bg-one-light transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-one-text-muted">
              <Search size={18} />
            </div>
            <input
              type="search"
              className="w-full pl-10 pr-4 py-2 bg-one-light border border-one-border rounded-lg focus:outline-none focus:ring-1 focus:ring-one-accent text-one-text"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:relative inset-0 lg:inset-auto z-20 w-64 bg-one-darker border-r border-one-border transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-one-text-muted mb-4">
              Categories
            </h2>
            <nav className="space-y-1">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-one-accent/10 text-one-accent'
                    : 'text-one-text-muted hover:bg-one-light hover:text-white'
                }`}
              >
                All Tools
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-one-accent/10 text-one-accent'
                      : 'text-one-text-muted hover:bg-one-light hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
          
          {/* User Preferences Section */}
          <div className="p-4 border-t border-one-border mt-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-one-text-muted mb-4">
              Your Preferences
            </h2>
            <div className="space-y-2 mb-4">
              {preferences.interests.length > 0 ? (
                <div>
                  <div className="text-xs text-one-text-muted mb-1">Interests:</div>
                  <div className="flex flex-wrap gap-2">
                    {preferences.interests.map((interest) => (
                      <span key={interest} className="text-xs px-2 py-1 rounded-full bg-one-light text-one-text-muted">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-one-text-muted">No preferences set</div>
              )}
            </div>
            <button
              onClick={onResetPreferences}
              className="flex items-center text-sm text-one-text-muted hover:text-white transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Reset Preferences
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Mobile Category Selector */}
          <div className="mb-8 lg:hidden">
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>

          <div className={`transform transition-all duration-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {/* Welcome Message */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to your AI dashboard</h1>
              <p className="text-one-text-muted">
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
                  <AIToolCard tool={tool} index={index} />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredTools.length === 0 && (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-one-light flex items-center justify-center mb-4">
                  <Search size={24} className="text-one-text-muted" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className="text-one-text-muted max-w-md mx-auto">
                  We couldn't find any AI tools matching your search. Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Mock data for AI tools - replaced with only the chatbot tools
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
  }
];

export default Dashboard;
