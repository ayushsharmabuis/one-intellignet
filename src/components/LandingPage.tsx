
import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';
import { useIntersectionObserver } from '../utils/animations';

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Simulate loading for animation purposes
    setTimeout(() => {
      setIsLoaded(true);
    }, 200);
  }, []);

  // Animation triggers using intersection observer
  const setFeatureSectionRef = useIntersectionObserver(
    (entry) => {
      if (entry.isIntersecting) {
        const elements = document.querySelectorAll('.feature-card');
        elements.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('animate-slide-in-bottom');
            el.classList.remove('opacity-0');
          }, i * 150);
        });
      }
    },
    { threshold: 0.2 }
  );

  return (
    <div className="min-h-screen bg-one-dark overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="hero-gradient"></div>
        <div className="container mx-auto text-center z-10 mt-16">
          <div className={`transition-all duration-1000 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="inline-block mb-4">
              <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20">
                The Future of AI Interaction
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight">
              <span className="block">One platform for all your</span>
              <span className="text-one-accent">AI tools & needs</span>
            </h1>
            <p className="max-w-2xl mx-auto text-one-text-muted text-xl mb-8">
              Discover, access, and manage all your AI tools in one intelligent platform
              designed for seamless integration and maximum productivity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <button 
                onClick={onGetStarted}
                className="interactive-button text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 inline-block" size={18} />
              </button>
              <button 
                onClick={scrollToFeatures}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-300
                          bg-one-light text-one-text-muted hover:text-white
                          transform hover:-translate-y-1 active:translate-y-0"
              >
                Learn More
                <ArrowDown className="ml-2 inline-block" size={18} />
              </button>
            </div>
          </div>

          {/* Hero Floating Elements */}
          <div className={`relative h-64 md:h-80 mt-8 transition-all duration-1000 transform ${
            isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
              <div className="relative">
                {/* Central Design Element */}
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-one-dark border border-one-border flex items-center justify-center mx-auto shadow-glow-sm">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-one-accent/5 border border-one-accent/20 flex items-center justify-center pulse-element">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-one-accent/10 border border-one-accent/30 flex items-center justify-center">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-one-accent animate-pulse-glow"></div>
                    </div>
                  </div>
                </div>
                
                {/* Circular Orbit */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-80 md:h-80 rounded-full border border-one-border/30 animate-rotate-slow"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full border border-one-border/20 animate-rotate-slow" style={{ animationDuration: '15s' }}></div>
                
                {/* Floating AI Cards */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4 md:-translate-y-28 floating-element">
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-32 text-center">
                    <div className="text-xs md:text-sm">Chatbots</div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-3/4 transform -translate-y-1/4 md:translate-x-20 floating-element" style={{ animationDelay: '1s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-32 text-center">
                    <div className="text-xs md:text-sm">Code AI</div>
                  </div>
                </div>
                <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 md:translate-y-10 floating-element" style={{ animationDelay: '1.5s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-32 text-center">
                    <div className="text-xs md:text-sm">Design AI</div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 md:-translate-x-20 floating-element" style={{ animationDelay: '2s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-32 text-center">
                    <div className="text-xs md:text-sm">Video AI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button onClick={scrollToFeatures} className="text-one-text-muted hover:text-white">
            <ArrowDown size={24} />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-container" ref={setFeatureSectionRef}>
        <div className="text-center mb-16">
          <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20">
            Why One-Intelligent
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">
            All Your AI Tools in One Place
          </h2>
          <p className="text-one-text-muted max-w-2xl mx-auto">
            One-Intelligent brings together the best AI tools in a seamless, integrated platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card glass-card rounded-xl p-6 opacity-0 transition-all duration-500" style={{transitionDelay: `${index * 0.1}s`}}>
              <div className="w-12 h-12 rounded-lg bg-one-accent/10 flex items-center justify-center text-one-accent mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-one-text-muted">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button 
            onClick={onGetStarted}
            className="interactive-button text-lg"
          >
            Start Your AI Journey
            <ArrowRight className="ml-2 inline-block" size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

// Feature data
import { 
  MessageSquare, Code, Brush, Video, Robot, Search, 
  Zap, Lock, Clock, Layers, Users, LineChart 
} from 'lucide-react';

const features = [
  {
    title: 'AI Chat Assistants',
    description: 'Access multiple chat assistants from different providers all in one unified interface.',
    icon: MessageSquare
  },
  {
    title: 'Code Generation',
    description: 'Generate, debug, and optimize code across multiple programming languages.',
    icon: Code
  },
  {
    title: 'Creative Design',
    description: 'Create images, graphics, and design assets with cutting-edge AI tools.',
    icon: Brush
  },
  {
    title: 'Video Generation',
    description: 'Produce and edit videos using the latest AI video generation technology.',
    icon: Video
  },
  {
    title: 'Automation Tools',
    description: 'Automate workflows and repetitive tasks with powerful AI automation.',
    icon: Robot
  },
  {
    title: 'Universal Search',
    description: 'Search across all your AI tools and content with our intelligent search engine.',
    icon: Search
  },
  {
    title: 'One-Click Integration',
    description: 'Connect all your existing AI tools with a single click integration system.',
    icon: Zap
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-level security ensuring your data and AI interactions remain private.',
    icon: Lock
  },
  {
    title: 'Real-time Updates',
    description: 'Stay updated with the latest AI tools and features as they become available.',
    icon: Clock
  },
];

export default LandingPage;
