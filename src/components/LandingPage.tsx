import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown, ArrowRight, Bot, Star, Zap, ChevronUp, Github, Twitter, Linkedin, Instagram, Check, Shield, Sparkles, Cpu, Film } from 'lucide-react';
import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';
import { useIntersectionObserver } from '../utils/animations';
import Chatbot from './Chatbot';

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animatedText, setAnimatedText] = useState<string[]>([]);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activePricingPlan, setActivePricingPlan] = useState<'monthly' | 'annual'>('monthly');
  
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToReviews = () => {
    document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const heroText = "Ready To Access";
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroSection = document.querySelector('.hero-section');
      const heroElements = document.querySelector('.hero-elements');
      const heroBackground = document.querySelector('.hero-gradient');
      
      if (heroSection && heroElements && heroBackground) {
        const heroElementsHtmlElement = heroElements as HTMLElement;
        const heroBackgroundHtmlElement = heroBackground as HTMLElement;
        
        const maxTransform = 80; // Reduced from 100
        const elementTransform = Math.min(scrollY * 0.3, maxTransform); // Reduced from 0.4
        const bgTransform = Math.min(scrollY * 0.15, maxTransform/2); // Reduced from 0.2
        
        heroElementsHtmlElement.style.transform = `translateY(${elementTransform}px)`;
        heroBackgroundHtmlElement.style.transform = `translateY(${bgTransform}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialInterval);
  }, []);

  const setValuePropSectionRef = useIntersectionObserver(
    (entry) => {
      if (entry.isIntersecting) {
        const elements = document.querySelectorAll('.value-prop-item');
        elements.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('animate-slide-in-bottom');
            el.classList.remove('opacity-0');
          }, i * 200);
        });
      }
    },
    { threshold: 0.2 }
  );

  const setFeaturesSectionRef = useIntersectionObserver(
    (entry) => {
      if (entry.isIntersecting) {
        const elements = document.querySelectorAll('.features-section .value-prop-item');
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

  const setReviewsSectionRef = useIntersectionObserver(
    (entry) => {
      if (entry.isIntersecting) {
        const elements = document.querySelectorAll('.review-card');
        elements.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('animate-fade-in');
            el.classList.remove('opacity-0');
          }, i * 150);
        });
      }
    },
    { threshold: 0.2 }
  );

  const setCtaSectionRef = useIntersectionObserver(
    (entry) => {
      if (entry.isIntersecting) {
        const elements = document.querySelectorAll('.cta-animated');
        elements.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('animate-fade-in');
            el.classList.remove('opacity-0');
          }, i * 150);
        });
      }
    },
    { threshold: 0.2 }
  );

  useEffect(() => {
    const buttons = document.querySelectorAll('.interactive-button');
    
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e: any) => {
        const rect = button.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const xOffset = -((x - 0.5) * 10);
        const yOffset = (y - 0.5) * 10;
        
        const buttonElement = button as HTMLElement;
        buttonElement.style.transform = `perspective(800px) rotateX(${yOffset}deg) rotateY(${xOffset}deg) translateZ(5px) scale(1.02)`;
        buttonElement.style.background = `linear-gradient(120deg, rgba(123, 92, 250, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)`;
      });
      
      button.addEventListener('mouseleave', () => {
        const buttonElement = button as HTMLElement;
        buttonElement.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
        buttonElement.style.background = '';
      });
    });

    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
      card.addEventListener('mousemove', (e: any) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const xOffset = -((x - 0.5) * 4);
        const yOffset = (y - 0.5) * 4;
        
        const cardElement = card as HTMLElement;
        cardElement.style.transform = `perspective(1000px) rotateX(${yOffset}deg) rotateY(${xOffset}deg) translateZ(10px)`;
        cardElement.style.boxShadow = `0 15px 35px -15px rgba(123, 92, 250, 0.25)`;
      });
      
      card.addEventListener('mouseleave', () => {
        const cardElement = card as HTMLElement;
        cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        cardElement.style.boxShadow = '';
      });
    });
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-one-dark overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      {/* Add Chatbot component */}
      <Chatbot />

      <section className="hero-section">
        <div className="hero-gradient"></div>
        <div className="container mx-auto z-10 mt-12 hero-elements">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className={`lg:w-1/2 transition-all duration-1000 transform ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="text-center lg:text-left">
                <div className="inline-block mb-6">
                  <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20">
                  THE ULTIMATE AI TOOLKIT
                </span>
              </div>
              
              <div className="mb-6">
                  <h1 ref={heroTextRef} className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight overflow-hidden">
                    <span className="block mb-3">
                      Ready To Access
                    </span>
                    <span className="text-one-accent block">
                    Multiple AI Tools In One Place
                </span>
              </h1>
              </div>
              
                <p ref={heroSubtitleRef} className="max-w-xl mx-auto lg:mx-0 text-one-text-muted text-lg md:text-xl mb-10 font-light">
                Access and manage all your favorite AI tools in one place. Boost productivity, streamline workflows, and unlock AI's full potential.
              </p>
              
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-16">
                <button 
                  onClick={onGetStarted}
                    className="interactive-button text-lg relative overflow-hidden group/button hero-get-started-btn font-medium px-8 py-3 rounded-lg bg-one-accent text-white"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 inline-block transition-transform duration-300 group-hover/button:translate-x-1" size={18} />
                  </span>
                </button>
                <button 
                  onClick={scrollToReviews}
                    className="px-8 py-3 rounded-lg font-medium transition-all duration-300
                              text-one-text hover:text-white
                              transform active:translate-y-0 relative overflow-hidden flex items-center"
                >
                  <span className="relative z-10 flex items-center">
                    View Reviews
                    <ArrowDown className="ml-2 inline-block" size={18} />
                  </span>
                </button>
                </div>
              </div>
            </div>

            {/* Right side animation */}
            <div className={`lg:w-1/2 relative h-96 transition-all duration-1000 transform ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Central platform hub */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-one-dark border border-one-border flex items-center justify-center mx-auto shadow-glow-md">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-one-accent/10 border border-one-accent/30 flex items-center justify-center pulse-element">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-one-accent/20 border border-one-accent/40 flex items-center justify-center">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-one-accent animate-pulse-glow flex items-center justify-center">
                          <span className="text-xl md:text-2xl text-white font-bold">1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Orbiting rings */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-72 md:h-72 rounded-full border border-one-border/30 animate-rotate-slow">
                  <span className="absolute w-6 h-6 bg-one-accent/80 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-glow-md flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </span>
                </div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[22rem] md:h-[22rem] rounded-full border border-one-border/20 animate-rotate-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                  <span className="absolute w-6 h-6 bg-[#9b87f5]/80 rounded-full bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 shadow-glow-sm flex items-center justify-center">
                    <Sparkles size={14} className="text-white" />
                  </span>
                </div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[26rem] md:h-[26rem] rounded-full border border-one-border/10 animate-rotate-slow" style={{ animationDuration: '20s' }}>
                  <span className="absolute w-6 h-6 bg-[#7B5CFA]/80 rounded-full left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-glow-sm flex items-center justify-center">
                    <Film size={14} className="text-white" />
                  </span>
                  </div>
                
                {/* Floating tool cards with icons and labels - Arranged in a circle around the center */}
                <div className="absolute top-[5%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 floating-element" style={{ animationDelay: '0.3s', animationDuration: '4s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-28 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <div className="w-full h-12 bg-one-dark/50 rounded-lg mb-1 overflow-hidden flex items-center justify-center">
                      <Bot size={16} className="text-one-accent" />
                </div>
                    <div className="text-xs font-medium">AI Chatbots</div>
                  </div>
                </div>
                
                <div className="absolute top-[30%] right-[5%] transform -translate-y-1/2 floating-element" style={{ animationDelay: '0.8s', animationDuration: '4.5s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-28 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <Sparkles className="mx-auto mb-1 text-one-accent" size={18} />
                    <div className="text-xs font-medium">Image Gen</div>
                  </div>
                </div>
                
                <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 floating-element" style={{ animationDelay: '1.3s', animationDuration: '5s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-28 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <Film className="mx-auto mb-1 text-one-accent" size={18} />
                    <div className="text-xs font-medium">Video AI</div>
                  </div>
                </div>
                
                <div className="absolute top-[30%] left-[5%] transform -translate-y-1/2 floating-element" style={{ animationDelay: '1.8s', animationDuration: '4.2s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-28 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <Zap className="mx-auto mb-1 text-one-accent" size={18} />
                    <div className="text-xs font-medium">Productivity</div>
                  </div>
                </div>

                <div className="absolute right-[20%] top-[12%] transform floating-element" style={{ animationDelay: '2.3s', animationDuration: '5.2s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-28 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <svg className="mx-auto mb-1 text-one-accent" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.325 3.05L8.66741 20.45L10.5174 21.05L15.1674 3.65L13.325 3.05Z" fill="currentColor" />
                      <path d="M5.64741 6.51L2.07741 10.08L5.64741 13.65L7.05741 12.24L4.89741 10.08L7.05741 7.92L5.64741 6.51Z" fill="currentColor" />
                      <path d="M18.3674 6.51L16.9574 7.92L19.1174 10.08L16.9574 12.24L18.3674 13.65L21.9374 10.08L18.3674 6.51Z" fill="currentColor" />
                    </svg>
                    <div className="text-xs font-medium">Code AI</div>
                  </div>
                </div>

                <div className="absolute bottom-[25%] right-[20%] floating-element" style={{ animationDelay: '2.8s', animationDuration: '4.8s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-28 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <svg className="mx-auto mb-1 text-one-accent" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                      <line x1="2" y1="20" x2="2" y2="20"></line>
                    </svg>
                    <div className="text-xs font-medium">Audio AI</div>
                  </div>
                </div>

                <div className="absolute bottom-[25%] left-[20%] floating-element" style={{ animationDelay: '3.3s', animationDuration: '5.3s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-28 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <svg className="mx-auto mb-1 text-one-accent" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="text-xs font-medium">AI Research</div>
                  </div>
                </div>

                <div className="absolute left-[20%] top-[12%] floating-element" style={{ animationDelay: '3.8s', animationDuration: '4.5s' }}>
                  <div className="glass-card p-2 rounded-lg shadow-glow-sm w-24 md:w-28 text-center transform transition-transform hover:scale-110 hover:shadow-glow-md duration-300">
                    <svg className="mx-auto mb-1 text-one-accent" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
                      <path d="M2 12.8995V11.1005C2 10.1996 2.73061 9.4601 3.63019 9.4601C4.73816 9.4601 5.64722 8.5502 5.64722 7.44153C5.64722 6.83107 5.95046 6.26058 6.46427 5.90767C7.20024 5.36369 7.20024 4.27019 6.46427 3.7262L6.46425 3.7262C5.96874 3.3733 5.66548 2.8028 5.66548 2.19234C5.66548 1.08484 6.57455 0.174951 7.68251 0.174951H9.48148C10.3812 0.174951 11.1116 0.905665 11.1116 1.8064C11.1116 2.91497 12.0207 3.82373 13.1288 3.82373C13.7421 3.82373 14.3158 4.12691 14.6698 4.64121L14.6698 4.64122C15.2169 5.37727 16.3123 5.37727 16.8593 4.64122C17.2134 4.12692 17.7871 3.82373 18.4005 3.82373C19.5085 3.82373 20.4175 2.91498 20.4175 1.8064C20.4175 0.905665 21.148 0.174951 22.0477 0.174951H23.8467C24.4833 0.174951 25 0.691655 25 1.32833V2.19234C25 3.2998 24.0909 4.20867 22.9828 4.20867C21.8749 4.20867 20.9659 5.11733 20.9659 6.22591C20.9659 6.83638 20.6626 7.40685 20.1488 7.75976L20.1488 7.75979C19.4128 8.30376 19.4128 9.39727 20.1488 9.94125L20.1488 9.94126C20.6626 10.2942 20.9659 10.8646 20.9659 11.4751C20.9659 12.5826 21.8749 13.4923 22.9828 13.4923C24.09 13.4923 25 14.4014 25 15.5081V16.372C25 17.0087 24.4833 17.5254 23.8467 17.5254H22.0477C21.148 17.5254 20.4175 16.7947 20.4175 15.894C20.4175 14.7854 19.5085 13.8767 18.4005 13.8767C17.7871 13.8767 17.2134 13.5735 16.8593 13.0592L16.8593 13.0592C16.3123 12.3231 15.2169 12.3231 14.6698 13.0592C14.3158 13.5735 13.7421 13.8767 13.1288 13.8767C12.0207 13.8767 11.1116 14.7854 11.1116 15.894C11.1116 16.7947 10.3812 17.5254 9.48147 17.5254H7.68251C6.57455 17.5254 5.66548 16.6155 5.66548 15.5081C5.66548 14.3976 4.75642 13.4889 3.64846 13.4889H3.63019C2.73061 13.4889 2 12.7494 2 11.8486V11.1005" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <div className="text-xs font-medium">Text Analysis</div>
                  </div>
                </div>
                
                {/* Connection lines (animated) */}
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }}>
                  {/* Radial connection lines from center to each AI tool */}
                  <line x1="50%" y1="50%" x2="50%" y2="5%" stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash-offset"></line>
                  <line x1="50%" y1="50%" x2="95%" y2="30%" stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash-offset" style={{ animationDelay: '0.5s' }}></line>
                  <line x1="50%" y1="50%" x2="50%" y2="95%" stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash-offset" style={{ animationDelay: '1s' }}></line>
                  <line x1="50%" y1="50%" x2="5%" y2="30%" stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash-offset" style={{ animationDelay: '1.5s' }}></line>
                  <line x1="50%" y1="50%" x2="80%" y2="12%" stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash-offset" style={{ animationDelay: '2s' }}></line>
                  <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash-offset" style={{ animationDelay: '2.5s' }}></line>
                  <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash-offset" style={{ animationDelay: '3s' }}></line>
                  <line x1="50%" y1="50%" x2="20%" y2="12%" stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash-offset" style={{ animationDelay: '3.5s' }}></line>
                  <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(123, 92, 250, 0.2)" />
                      <stop offset="50%" stopColor="rgba(123, 92, 250, 0.6)" />
                      <stop offset="100%" stopColor="rgba(123, 92, 250, 0.2)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button onClick={scrollToFeatures} className="text-one-text-muted hover:text-white transition-colors">
            <ArrowDown size={24} />
          </button>
        </div>
      </section>

      {/* What is OneIntelligent Section */}
      <section id="features" className="section-container py-20 md:py-40 px-4" ref={setValuePropSectionRef}>
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20">
              WHAT IS ONE-INTELLIGENT
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4 text-white">
              All AI Tools in One Platform
            </h2>
          </div>

          <div className="flex flex-col items-center mb-10 md:mb-20">
            <div className="w-full max-w-4xl value-prop-item opacity-0">
              <div className="rounded-2xl border border-one-border/30 bg-one-card/30 backdrop-blur-sm p-6 md:p-10 shadow-glow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-one-accent/5 to-transparent"></div>
                
                <div className="relative z-10">
                  <p className="text-lg md:text-xl text-one-text leading-relaxed mb-6 md:mb-8 font-medium">
                    One-Intelligent is a revolutionary platform that brings together all your favorite AI tools into a single, unified interface. We've created a seamless ecosystem where you can access, manage, and utilize a vast array of AI services without the hassle of juggling multiple subscriptions, logins, and interfaces.
                  </p>
                  
                  <p className="text-lg md:text-xl text-one-text leading-relaxed mb-6 md:mb-8 font-medium">
                    Our platform integrates cutting-edge AI tools for text generation, image creation, video editing, code development, audio processing, and productivity enhancement. Whether you're a creative professional, developer, marketer, or business owner, One-Intelligent streamlines your workflow and maximizes your AI potential.
                  </p>
                  
                  <p className="text-lg md:text-xl text-one-text leading-relaxed mb-6 md:mb-8 font-medium">
                    What sets us apart is our commitment to providing a frictionless experience – no ads, direct tool access, real-time analytics, and personalized recommendations that learn from your usage patterns. With over 1000+ AI tools at your fingertips, you'll never need to switch between multiple platforms again.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-one-accent/10 flex items-center justify-center">
                        <Check className="text-one-accent" size={20} />
                      </div>
                      <span className="text-one-text text-base md:text-lg">No Advertisements</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-one-accent/10 flex items-center justify-center">
                        <Check className="text-one-accent" size={20} />
                      </div>
                      <span className="text-one-text text-base md:text-lg">Direct Tool Access</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-one-accent/10 flex items-center justify-center">
                        <Check className="text-one-accent" size={20} />
                      </div>
                      <span className="text-one-text text-base md:text-lg">Unified Billing</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-one-accent/10 flex items-center justify-center">
                        <Check className="text-one-accent" size={20} />
                      </div>
                      <span className="text-one-text text-base md:text-lg">Personalized Experience</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (hidden on mobile) */}
      <section className="features-section section-container py-40 bg-one-darker hidden md:block" ref={setFeaturesSectionRef}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20">
              FEATURES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4 text-white">
              Features of One-Intelligent
            </h2>
            <p className="text-lg text-one-text-muted max-w-3xl mx-auto font-medium">
              Discover what makes One-Intelligent the ultimate platform for AI access and management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1: No Ads */}
            <div className="bg-one-card/30 backdrop-blur-sm p-8 rounded-2xl border border-one-border/30 hover:border-one-accent/30 hover:shadow-glow-sm transition-all duration-300 value-prop-item opacity-0">
              <div className="w-16 h-16 rounded-full bg-one-accent/10 flex items-center justify-center mb-6">
                <svg className="text-one-accent" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 7.58 7.58 4 12 4C13.85 4 15.55 4.63 16.9 5.69L5.69 16.9C4.63 15.55 4 13.85 4 12ZM12 20C10.15 20 8.45 19.37 7.1 18.31L18.31 7.1C19.37 8.45 20 10.15 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">100% Ad-Free Experience</h3>
              <p className="text-one-text-muted">Enjoy a clean, distraction-free interface with absolutely no advertisements. Focus purely on your AI tools and creative process.</p>
            </div>

            {/* Feature 2: Direct Tool Access */}
            <div className="bg-one-card/30 backdrop-blur-sm p-8 rounded-2xl border border-one-border/30 hover:border-one-accent/30 hover:shadow-glow-sm transition-all duration-300 value-prop-item opacity-0">
              <div className="w-16 h-16 rounded-full bg-one-accent/10 flex items-center justify-center mb-6">
                <Zap className="text-one-accent" size={28} />
                  </div>
              <h3 className="text-xl font-bold mb-3">Direct Tool Redirect</h3>
              <p className="text-one-text-muted">Access any AI tool instantly with our seamless redirect system. No more navigation hassles or multiple login screens.</p>
            </div>

            {/* Feature 3: 1000+ AI Tools */}
            <div className="bg-one-card/30 backdrop-blur-sm p-8 rounded-2xl border border-one-border/30 hover:border-one-accent/30 hover:shadow-glow-sm transition-all duration-300 value-prop-item opacity-0">
              <div className="w-16 h-16 rounded-full bg-one-accent/10 flex items-center justify-center mb-6">
                <Sparkles className="text-one-accent" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">1000+ AI Tools</h3>
              <p className="text-one-text-muted">Access an ever-growing library of over 1000 AI tools across all categories, from text and image generation to code and audio processing.</p>
            </div>

            {/* Feature 4: Real-time Dashboard */}
            <div className="bg-one-card/30 backdrop-blur-sm p-8 rounded-2xl border border-one-border/30 hover:border-one-accent/30 hover:shadow-glow-sm transition-all duration-300 value-prop-item opacity-0">
              <div className="w-16 h-16 rounded-full bg-one-accent/10 flex items-center justify-center mb-6">
                <svg className="text-one-accent" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 8.5H7V16H9V8.5Z" fill="currentColor"/>
                  <path d="M13 7H11V16H13V7Z" fill="currentColor"/>
                  <path d="M17 10.5H15V16H17V10.5Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Dashboard</h3>
              <p className="text-one-text-muted">Monitor your AI tool usage, track performance metrics, and visualize your productivity with our comprehensive real-time dashboard.</p>
                </div>
                
            {/* Feature 5: Unified Billing */}
            <div className="bg-one-card/30 backdrop-blur-sm p-8 rounded-2xl border border-one-border/30 hover:border-one-accent/30 hover:shadow-glow-sm transition-all duration-300 value-prop-item opacity-0">
              <div className="w-16 h-16 rounded-full bg-one-accent/10 flex items-center justify-center mb-6">
                <svg className="text-one-accent" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 6H3C2.45 6 2 6.45 2 7V17C2 17.55 2.45 18 3 18H21C21.55 18 22 17.55 22 17V7C22 6.45 21.55 6 21 6ZM20 16H4V8H20V16ZM11 10H13V14H11V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Unified Billing System</h3>
              <p className="text-one-text-muted">Simplify your finances with our unified billing system. One subscription covers all your AI tools, with transparent usage tracking and cost management.</p>
          </div>
          
            {/* Feature 6: Custom Integration */}
            <div className="bg-one-card/30 backdrop-blur-sm p-8 rounded-2xl border border-one-border/30 hover:border-one-accent/30 hover:shadow-glow-sm transition-all duration-300 value-prop-item opacity-0">
              <div className="w-16 h-16 rounded-full bg-one-accent/10 flex items-center justify-center mb-6">
                <svg className="text-one-accent" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H9C9.55228 10 10 9.55228 10 9V4C10 3.44772 9.55228 3 9 3Z" fill="currentColor"/>
                  <path d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z" fill="currentColor"/>
                  <path d="M9 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14Z" fill="currentColor"/>
                  <path d="M20 14H15C14.4477 14 14 14.4477 14 15V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Workflow Automation</h3>
              <p className="text-one-text-muted">Create custom automation workflows that combine multiple AI tools to accomplish complex tasks with minimal effort and maximum efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="section-container py-32" ref={setReviewsSectionRef}>
        <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20">
              TESTIMONIALS
          </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 text-white">
            User Experiences
          </h2>
            <p className="text-lg text-one-text-muted max-w-3xl mx-auto font-medium">
              See what our users are saying about their experience with One-Intelligent
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="review-card glass-card rounded-xl p-8 text-center opacity-0">
                    <div className="flex justify-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={20} 
                          className={`${star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-600'} mx-0.5`} 
                          fill={star <= testimonial.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <p className="text-one-text mb-6 italic">{testimonial.text}</p>
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-one-accent">
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-one-text-muted">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                  activeTestimonial === index ? 'bg-one-accent' : 'bg-one-border'
                }`}
              />
            ))}
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="py-40 relative overflow-hidden mt-24" ref={setCtaSectionRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-one-dark to-one-darker opacity-80"></div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/lovable-uploads/9092faf0-1f11-4eb6-b372-f68ccf274d6e.png')] bg-cover bg-center"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20 inline-block mb-6 cta-animated opacity-0">
              Get Started Today
            </span>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 cta-animated opacity-0" style={{ animationDelay: '0.1s' }}>
              Ready To <span className="text-one-accent">Access All Your AI Tools</span> In Just One Platform
            </h2>
            
            <p className="text-one-text-muted text-lg mb-8 cta-animated opacity-0" style={{ animationDelay: '0.2s' }}>
              Join One-Intelligent today and experience the future of unified AI in a single powerful platform
            </p>
            
            <div className="cta-animated opacity-0" style={{ animationDelay: '0.3s' }}>
              <button 
                onClick={onGetStarted}
                className="interactive-button text-lg relative overflow-hidden group/cta px-8 py-4"
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 inline-block transition-transform duration-300 group-hover/cta:translate-x-1" size={20} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#7B5CFA] to-[#9B87F5] opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"></span>
                <span className="absolute -inset-1 rounded-lg opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300 blur bg-gradient-to-r from-[#7B5CFA]/50 to-[#9B87F5]/50"></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-one-darker py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-6 flex items-center">
                <span className="text-one-accent">One</span>
                <span className="text-white">-Intelligent</span>
              </div>
              <p className="text-one-text-muted mb-6">
                Unifying the world's AI tools in one intelligent platform.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Instagram, link: 'https://www.instagram.com/oneintelligent.ai?igsh=MTJ6MmI3cm45enN4dw==' }
                ].map((social, index) => (
                  <a 
                    key={index} 
                    href={social.link} 
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-one-card text-one-text-muted hover:text-white hover:bg-one-accent/20 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
            
            {footerLinks.map((column, colIndex) => (
              <div key={colIndex}>
                <h3 className="font-bold mb-6">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href={link.url} 
                        className="text-one-text-muted hover:text-white transition-colors duration-300 story-link"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <hr className="border-one-border my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-one-text-muted text-sm">
              © 2025 OneIntelligent. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-one-text-muted hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-one-text-muted hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-one-text-muted hover:text-white text-sm transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Chatbot component */}
      <Chatbot />
    </div>
  );
};

const features = [
  {
    title: 'Unified AI Ecosystem',
    description: 'Access over 50+ AI tools and services through a single dashboard, with unified billing and authentication.',
    icon: Zap
  },
  {
    title: 'Cross-Tool Workflows',
    description: 'Create powerful workflows that combine multiple AI tools for complex tasks without switching platforms.',
    icon: Bot
  },
  {
    title: 'AI-Powered Content Creation',
    description: 'Generate text, images, videos, code, and audio with specialized AI tools optimized for each medium.',
    icon: Sparkles
  },
  {
    title: 'Enterprise-Grade Security',
    description: 'Bank-level data protection with end-to-end encryption and compliance with GDPR, HIPAA, and other standards.',
    icon: Shield
  },
  {
    title: 'Advanced Personalization',
    description: 'AI that learns from your usage patterns to customize recommendations and optimize your workflow.',
    icon: Cpu
  },
  {
    title: 'Collaboration Features',
    description: 'Share AI-generated assets, workflows, and projects with team members through built-in collaboration tools.',
    icon: Bot
  },
  {
    title: 'Cost Optimization',
    description: 'Save on subscription costs with our consolidated platform compared to individual subscriptions for each AI tool.',
    icon: Zap
  },
  {
    title: 'Continuous Updates',
    description: 'Gain immediate access to the latest AI models and technologies as they become available, without additional setup.',
    icon: Sparkles
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    title: 'Product Designer',
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
    text: "One-Intelligent completely transformed my workflow. I now have access to all my favorite AI tools in one place, saving me hours every week.",
    rating: 5
  },
  {
    name: 'Michael Chen',
    title: 'Software Engineer',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    text: "As a developer, I rely on multiple AI tools daily. Having them all integrated in One-Intelligent has boosted my productivity tremendously.",
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    title: 'Content Creator',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    text: "The personalized recommendations and seamless integration between different AI tools make One-Intelligent an essential part of my creative process.",
    rating: 4
  },
];

const footerLinks = [
  {
    title: 'Product',
    links: [
      { text: 'Pricing', url: '/pricing' },
      { text: 'Integrations', url: '/integrations' },
      { text: "What's New", url: '/whats-new' },
    ]
  },
  {
    title: 'Company',
    links: [
      { text: 'About Us', url: '/about' },
      { text: 'Careers', url: '/careers' },
      { text: 'Legal', url: '/legal' },
    ]
  }
];

export default LandingPage;
