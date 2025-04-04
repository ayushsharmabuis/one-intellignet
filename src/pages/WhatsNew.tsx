import React from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsNew: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user came from dashboard
  const isFromDashboard = location.state?.fromDashboard || false;
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-one-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto pt-20">
          {/* Back button - only show when coming from dashboard */}
          {isFromDashboard && (
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="text-one-text-muted hover:text-white flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Button>
            </div>
          )}
          
          <div className="text-center mb-16">
            <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20 mb-4 inline-block animate-pulse">
              NEW
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">What's New in One-Intelligent</h1>
            <p className="text-xl text-one-text-muted max-w-2xl mx-auto">
              We've been busy making One-Intelligent even better for you!
            </p>
          </div>
          
          {/* New Features Section */}
          <div className="bg-one-card/30 backdrop-blur-sm border border-one-border rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">New Tools & Features</h2>
            
            <div className="space-y-8">
              <div className="bg-one-darker/50 rounded-xl p-6 border border-one-border/50 hover:border-one-accent/30 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-one-accent">Professional Categories</h3>
                <p className="text-one-text-muted mb-4">
                  We've added specialized professional categories to help you find industry-specific AI tools:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>AI for Business</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>AI for Content Creation</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>AI for Development</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>AI for Students</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>AI for Creatives</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>AI for Healthcare</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-one-darker/50 rounded-xl p-6 border border-one-border/50 hover:border-one-accent/30 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-one-accent">Expanded Tool Collection</h3>
                <p className="text-one-text-muted mb-4">
                  Our AI tool library has grown! Discover powerful new additions across categories:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Midjourney for AI Image Generation</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>GitHub Copilot for Code Generation</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>DeepSource for Debugging</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>New AI Video Generation tools</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-one-darker/50 rounded-xl p-6 border border-one-border/50 hover:border-one-accent/30 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-one-accent">Enhanced Mobile Experience</h3>
                <p className="text-one-text-muted mb-4">
                  We've completely redesigned the mobile experience to make it more intuitive and user-friendly:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Optimized Professional Categories navigation</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Simplified tool upload process</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Improved subcategory display</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Better tool filtering on small screens</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-one-darker/50 rounded-xl p-6 border border-one-border/50 hover:border-one-accent/30 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-one-accent">User Interface Improvements</h3>
                <p className="text-one-text-muted mb-4">
                  We've made several improvements to the overall user experience:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Revamped "Why We Built One-Intelligent" section</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>New tool rating system</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Updated category filtering</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Simplified navigation and user flow</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Explore Our New Features</h2>
            <p className="text-one-text-muted mb-6">
              Return to the dashboard to explore all these exciting new tools and features!
            </p>
            {!isFromDashboard && (
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-one-accent hover:bg-one-accent/90 text-white transition-all duration-300"
              >
                Get Started <ArrowRight className="ml-2" size={16} />
              </Link>
            )}
            {isFromDashboard && (
              <Button 
                onClick={handleBack}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-one-accent hover:bg-one-accent/90 text-white transition-all duration-300"
              >
                Return to Dashboard <ArrowRight className="ml-2" size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsNew; 