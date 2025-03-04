
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    // Handle the Get Started button click
    // Scroll to the top and trigger onGetStarted in the parent component
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Find the get started button in the hero section and click it
    const heroGetStartedBtn = document.querySelector('.hero-get-started-btn') as HTMLButtonElement;
    if (heroGetStartedBtn) {
      heroGetStartedBtn.click();
    }
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-one-darker/80 backdrop-blur-lg shadow-md'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Logo className="z-20" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/features"
              className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              to="/contact"
              className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            >
              Contact
            </Link>
            <button 
              className="interactive-button"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle and Chatbot Button */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <button 
              className="w-10 h-10 rounded-full bg-one-accent/20 flex items-center justify-center text-white hover:bg-one-accent/40 transition-colors duration-200 shadow-glow-sm"
              onClick={toggleChatbot}
            >
              <MessageCircle size={20} />
            </button>
            <button 
              className="md:hidden z-20 text-one-text-muted hover:text-one-text" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-10 bg-one-darker/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-lg">
          <Link
            to="/"
            className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/features"
            className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/contact"
            className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <button
            className="interactive-button mt-4"
            onClick={() => {
              setMobileMenuOpen(false);
              handleGetStarted();
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* AI Chatbot Button (Fixed Position) */}
      <button 
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-one-accent text-white flex items-center justify-center hover:bg-one-accent-hover transition-colors duration-300 shadow-glow-md z-50"
        onClick={toggleChatbot}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Modal (Simple Implementation) */}
      {showChatbot && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-one-darker border border-one-border rounded-lg shadow-glow-md p-4 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <button onClick={toggleChatbot}>
              <X size={20} className="text-one-text-muted hover:text-white" />
            </button>
          </div>
          <div className="bg-one-dark h-72 rounded-md p-4 overflow-y-auto flex flex-col justify-end">
            <div className="bg-one-accent/20 p-3 rounded-lg rounded-bl-none mb-2 max-w-[80%] text-sm">
              Hello! I'm your AI assistant. How can I help you today?
            </div>
            <div className="mt-auto">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="w-full bg-one-card border border-one-border rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-one-accent"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
