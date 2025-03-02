
import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';
import { useIntersectionObserver } from '../utils/animations';

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animatedText, setAnimatedText] = useState<string[]>([]);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Text animation effect
  useEffect(() => {
    const heroText = "One platform for all your AI tools & needs";
    const animationDelay = 40; // ms between each character

    const animateText = async () => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Initial delay
      
      for (let i = 0; i <= heroText.length; i++) {
        setAnimatedText(heroText.slice(0, i).split(''));
        await new Promise(resolve => setTimeout(resolve, animationDelay));
      }
    };

    if (isLoaded) {
      animateText();
    }
  }, [isLoaded]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroSection = document.querySelector('.hero-section');
      const heroElements = document.querySelector('.hero-elements');
      const heroBackground = document.querySelector('.hero-gradient');
      
      if (heroSection && heroElements && heroBackground) {
        heroElements.setAttribute('style', `transform: translateY(${scrollY * 0.4}px)`);
        heroBackground.setAttribute('style', `transform: translateY(${scrollY * 0.2}px)`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  // 3D tilt effect for CTA button
  useEffect(() => {
    const buttons = document.querySelectorAll('.interactive-button');
    
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e: any) => {
        const rect = button.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const xOffset = -((x - 0.5) * 10);
        const yOffset = (y - 0.5) * 10;
        
        button.style.transform = `perspective(800px) rotateX(${yOffset}deg) rotateY(${xOffset}deg) translateZ(5px) scale(1.02)`;
        button.style.background = `linear-gradient(120deg, rgba(123, 92, 250, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)`;
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
        button.style.background = '';
      });
    });
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-one-dark overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="hero-gradient absolute inset-0 bg-hero-glow opacity-80"></div>
        <div className="container mx-auto text-center z-10 mt-16 hero-elements">
          <div className={`transition-all duration-1000 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="inline-block mb-4">
              <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20 animate-pulse-glow">
                The Future of AI Interaction
              </span>
            </div>
            
            <h1 ref={heroTextRef} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight overflow-hidden">
              <span className="block mb-2 relative">
                {animatedText.map((char, index) => (
                  <span 
                    key={index} 
                    className="inline-block animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 0.03}s`,
                      opacity: 0,
                      animationFillMode: 'forwards'
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
                <span className="inline-block animate-pulse">|</span>
              </span>
              <span className="text-one-accent block transform-gpu animate-slide-in-bottom" style={{ animationDelay: '1.5s', opacity: 0, animationFillMode: 'forwards' }}>
                AI tools & needs
              </span>
            </h1>
            
            <p ref={heroSubtitleRef} className="max-w-2xl mx-auto text-one-text-muted text-xl mb-8 transform-gpu animate-slide-in-bottom" style={{ animationDelay: '1.8s', opacity: 0, animationFillMode: 'forwards' }}>
              Discover, access, and manage all your AI tools in one intelligent platform
              designed for seamless integration and maximum productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 transform-gpu animate-slide-in-bottom" style={{ animationDelay: '2s', opacity: 0, animationFillMode: 'forwards' }}>
              <button 
                onClick={onGetStarted}
                className="interactive-button text-lg relative overflow-hidden group/button"
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 inline-block transition-transform duration-300 group-hover/button:translate-x-1" size={18} />
                </span>
                <span className="absolute inset-0 bg-one-accent transition-all duration-300 group-hover/button:opacity-80"></span>
                <span className="absolute inset-0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300">
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#9b87f5] via-[#7B5CFA] to-[#8F74FF] animate-pulse-glow"></span>
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-full group-hover/button:translate-x-[-100%] transition-transform duration-1000"></span>
              </button>
              <button 
                onClick={scrollToFeatures}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-300
                          bg-one-light text-one-text-muted hover:text-white hover:bg-opacity-80
                          transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Learn More
                  <ArrowDown className="ml-2 inline-block" size={18} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-one-accent/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
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
                
                {/* Circular Orbit with glow effect */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-80 md:h-80 rounded-full border border-one-border/30 animate-rotate-slow">
                  <span className="absolute w-4 h-4 bg-one-accent/80 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-glow-md"></span>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full border border-one-border/20 animate-rotate-slow" style={{ animationDuration: '15s' }}>
                  <span className="absolute w-3 h-3 bg-[#9b87f5]/80 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-glow-sm"></span>
                </div>
                
                {/* Floating AI Cards with enhanced animations */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4 md:-translate-y-28 floating-element">
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-32 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <div className="text-xs md:text-sm">Chatbots</div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-3/4 transform -translate-y-1/4 md:translate-x-20 floating-element" style={{ animationDelay: '1s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-32 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <div className="text-xs md:text-sm">Code AI</div>
                  </div>
                </div>
                <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 md:translate-y-10 floating-element" style={{ animationDelay: '1.5s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-32 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <div className="text-xs md:text-sm">Design AI</div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 md:-translate-x-20 floating-element" style={{ animationDelay: '2s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-32 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <div className="text-xs md:text-sm">Video AI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button onClick={scrollToFeatures} className="text-one-text-muted hover:text-white transition-colors">
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
            className="interactive-button text-lg relative overflow-hidden group/cta"
          >
            <span className="relative z-10 flex items-center">
              Start Your AI Journey
              <ArrowRight className="ml-2 inline-block transition-transform duration-300 group-hover/cta:translate-x-1" size={18} />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#7B5CFA] to-[#9B87F5] opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"></span>
            <span className="absolute -inset-1 rounded-lg opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300 blur bg-gradient-to-r from-[#7B5CFA]/50 to-[#9B87F5]/50"></span>
          </button>
        </div>
      </section>
    </div>
  );
};

// Feature data
import { 
  MessageSquare, Code, Brush, Video, Bot, Search, 
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
    icon: Bot
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
