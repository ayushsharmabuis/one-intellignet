import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown, ArrowRight, Bot, Star, Zap, ChevronUp, Github, Twitter, Linkedin, Instagram, Check, Shield, Sparkles, Cpu } from 'lucide-react';
import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';
import { useIntersectionObserver } from '../utils/animations';

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

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroSection = document.querySelector('.hero-section');
      const heroElements = document.querySelector('.hero-elements');
      const heroBackground = document.querySelector('.hero-gradient');
      
      if (heroSection && heroElements && heroBackground) {
        const heroElementsHtmlElement = heroElements as HTMLElement;
        const heroBackgroundHtmlElement = heroBackground as HTMLElement;
        
        heroElementsHtmlElement.style.transform = `translateY(${scrollY * 0.4}px)`;
        heroBackgroundHtmlElement.style.transform = `translateY(${scrollY * 0.2}px)`;
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

  const setPricingSectionRef = useIntersectionObserver(
    (entry) => {
      if (entry.isIntersecting) {
        const elements = document.querySelectorAll('.pricing-card');
        elements.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('animate-zoom-in');
            el.classList.remove('opacity-0');
          }, i * 200);
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
                onClick={scrollToPricing}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-300
                          bg-one-light text-one-text-muted hover:text-white hover:bg-opacity-80
                          transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  View Pricing
                  <ArrowDown className="ml-2 inline-block" size={18} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-one-accent/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          </div>

          <div className={`relative h-64 md:h-80 mt-8 transition-all duration-1000 transform ${
            isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
              <div className="relative">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-one-dark border border-one-border flex items-center justify-center mx-auto shadow-glow-sm">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-one-accent/5 border border-one-accent/20 flex items-center justify-center pulse-element">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-one-accent/10 border border-one-accent/30 flex items-center justify-center">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-one-accent animate-pulse-glow"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-80 md:h-80 rounded-full border border-one-border/30 animate-rotate-slow">
                  <span className="absolute w-4 h-4 bg-one-accent/80 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-glow-md"></span>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full border border-one-border/20 animate-rotate-slow" style={{ animationDuration: '15s' }}>
                  <span className="absolute w-3 h-3 bg-[#9b87f5]/80 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-glow-sm"></span>
                </div>
                
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
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button onClick={scrollToFeatures} className="text-one-text-muted hover:text-white transition-colors">
            <ArrowDown size={24} />
          </button>
        </div>
      </section>

      <section id="features" className="section-container py-24" ref={setValuePropSectionRef}>
        <div className="text-center mb-20">
          <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20">
            Why One-Intelligent
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            The Future of AI Integration
          </h2>
          <p className="text-one-text-muted max-w-2xl mx-auto text-lg">
            One-Intelligent brings together the best AI tools in a seamless, integrated platform that empowers your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {features.map((item, index) => (
            <div 
              key={index} 
              className="value-prop-item flex gap-6 opacity-0 transition-all duration-500"
              style={{transitionDelay: `${index * 0.1}s`}}
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-one-accent/10 flex items-center justify-center text-one-accent transition-all duration-300 group-hover:bg-one-accent/20 shadow-glow-sm">
                  <item.icon size={28} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-one-text-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="section-container py-24 bg-one-darker relative overflow-hidden" ref={setPricingSectionRef}>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-one-accent/5 rounded-full filter blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-one-accent/5 rounded-full filter blur-[100px]"></div>
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20">
              Pricing Plans
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
              Choose the Perfect Plan for Your Needs
            </h2>
            <p className="text-one-text-muted max-w-2xl mx-auto text-lg mb-8">
              Simple, transparent pricing that scales with your requirements.
            </p>
            
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium transition-colors duration-300 ${activePricingPlan === 'monthly' ? 'text-white' : 'text-one-text-muted'}`}>
                Monthly
              </span>
              <button 
                onClick={() => setActivePricingPlan(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                className="relative h-6 w-12 rounded-full bg-one-border/50"
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-one-accent transition-all duration-300 ${
                  activePricingPlan === 'monthly' ? 'left-1' : 'left-7'
                }`}></span>
              </button>
              <span className={`text-sm font-medium transition-colors duration-300 ${activePricingPlan === 'annual' ? 'text-white' : 'text-one-text-muted'}`}>
                Annual <span className="text-xs text-one-accent">(Save 20%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card glass-card rounded-xl p-8 opacity-0 transition-all duration-500 border ${
                  plan.popular ? 'border-one-accent/50 shadow-glow-sm' : 'border-one-border/50'
                }`}
                style={{transitionDelay: `${index * 0.1}s`}}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-8 transform -translate-y-1/2 px-4 py-1 bg-one-accent text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-one-text-muted text-sm mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold">${activePricingPlan === 'monthly' ? plan.price.monthly : plan.price.annual}</span>
                  <span className="text-one-text-muted">/{activePricingPlan === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <Check size={18} className="text-one-accent mt-0.5 mr-2 flex-shrink-0" />
                      <span className={fIndex < plan.highlightedFeatures ? 'text-white' : 'text-one-text-muted'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'bg-one-accent text-white hover:bg-one-accent-hover shadow-glow-sm hover:shadow-glow-md'
                      : 'bg-one-light text-one-text hover:bg-one-border'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-one-text-muted mb-4">
              Need a custom solution for your enterprise?
            </p>
            <a href="#" className="inline-flex items-center text-one-accent hover:text-one-accent-hover font-medium">
              Contact our sales team
              <ArrowRight size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </section>

      <section id="reviews" className="section-container" ref={setReviewsSectionRef}>
        <div className="text-center mb-16">
          <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20">
            What Users Say
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">
            User Experiences
          </h2>
          <p className="text-one-text-muted max-w-2xl mx-auto">
            See how One-Intelligent is transforming the way professionals work with AI
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
                    <p className="text-one-text mb-6 italic">"{testimonial.text}"</p>
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
      </section>

      <section id="cta" className="py-24 relative overflow-hidden" ref={setCtaSectionRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-one-dark to-one-darker opacity-80"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg')] bg-cover bg-center"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20 inline-block mb-6 cta-animated opacity-0">
              Get Started Today
            </span>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 cta-animated opacity-0" style={{ animationDelay: '0.1s' }}>
              Ready to Transform Your <span className="text-one-accent">AI Experience</span>?
            </h2>
            
            <p className="text-one-text-muted text-lg mb-10 cta-animated opacity-0" style={{ animationDelay: '0.2s' }}>
              Join thousands of professionals using One-Intelligent to streamline their AI workflow and boost productivity.
            </p>
            
            <div className="cta-animated opacity-0" style={{ animationDelay: '0.3s' }}>
              <button 
                onClick={onGetStarted}
                className="interactive-button text-lg relative overflow-hidden group/cta px-8 py-4"
              >
                <span className="relative z-10 flex items-center">
                  Start Your AI Journey
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
                  { icon: Twitter, link: '#' },
                  { icon: Github, link: '#' },
                  { icon: Linkedin, link: '#' },
                  { icon: Instagram, link: '#' }
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
              © 2023 One-Intelligent. All rights reserved.
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
        
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-one-accent/80 text-white flex items-center justify-center hover:bg-one-accent transition-all duration-300 shadow-glow-md transform hover:-translate-y-1 z-50"
        >
          <ChevronUp size={24} />
        </button>
      </footer>
    </div>
  );
};

const features = [
  {
    title: 'All-in-One AI Platform',
    description: 'One unified interface for all your AI needs. No more switching between different tools and platforms.',
    icon: Zap
  },
  {
    title: 'Seamless Integration',
    description: 'Connect with your existing workflow and favorite apps without disruption or complicated setup.',
    icon: Bot
  },
  {
    title: 'Enhanced Productivity',
    description: 'Save hours every week with streamlined AI processes and automated task management.',
    icon: Sparkles
  },
  {
    title: 'Enterprise-Grade Security',
    description: 'Your data stays private with end-to-end encryption and secure cloud infrastructure.',
    icon: Shield
  },
  {
    title: 'Advanced AI Technology',
    description: 'Leverage the most advanced AI models and technology from leading providers in one place.',
    icon: Cpu
  },
  {
    title: 'Personalized Experience',
    description: 'AI that learns your preferences and adapts to your unique workflow requirements.',
    icon: Bot
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small projects',
    price: {
      monthly: 9,
      annual: 7
    },
    features: [
      'Access to basic AI tools',
      '100 queries per day',
      'Email support',
      'Single user',
      'Standard response time',
      'Basic integrations'
    ],
    highlightedFeatures: 3,
    popular: false
  },
  {
    name: 'Pro',
    description: 'Ideal for professionals and growing teams',
    price: {
      monthly: 29,
      annual: 23
    },
    features: [
      'Access to all AI tools',
      'Unlimited queries',
      'Priority support',
      'Up to 5 team members',
      'Advanced analytics',
      'All integrations',
      'Custom workflows'
    ],
    highlightedFeatures: 5,
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For organizations requiring advanced features',
    price: {
      monthly: 99,
      annual: 79
    },
    features: [
      'Everything in Pro plan',
      'Unlimited team members',
      'Dedicated support',
      'Custom AI training',
      'Advanced security features',
      'API access',
      'Custom integrations',
      'SLA guarantees'
    ],
    highlightedFeatures: 6,
    popular: false
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    title: 'Product Designer',
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
    text: 'One-Intelligent completely transformed my workflow. I now have access to all my favorite AI tools in one place, saving me hours every week.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    title: 'Software Engineer',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    text: 'As a developer, I rely on multiple AI tools daily. Having them all integrated in One-Intelligent has boosted my productivity tremendously.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    title: 'Content Creator',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    text: 'The personalized recommendations and seamless integration between different AI tools make One-Intelligent an essential part of my creative process.',
    rating: 4
  },
];

const blogPosts = [
  {
    title: 'The Future of AI-Powered Workflow Automation',
    excerpt: 'Discover how AI is revolutionizing workflow automation and increasing productivity across industries.',
    category: 'insights',
    date: 'June 15, 2023',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: "Getting Started with AI Image Generation: A Beginner's Guide",
    excerpt: 'Learn the basics of AI image generation and how to create stunning visuals with simple prompts.',
    category: 'tutorials',
    date: 'May 28, 2023',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'How AI is Transforming the Creative Industry',
    excerpt: 'An in-depth look at how artificial intelligence is changing the landscape for designers, writers, and artists.',
    category: 'insights',
    date: 'May 12, 2023',
    image: 'https://images.unsplash.com/photo-1619450463848-41fba8a3114b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Building Your First AI-Powered Chatbot',
    excerpt: 'Step-by-step tutorial on how to create and deploy your first AI chatbot using modern frameworks.',
    category: 'tutorials',
    date: 'April 30, 2023',
    image: 'https://images.unsplash.com/photo-1677442135146-2c6ba474b4b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'AI Breakthroughs: Top 10 Innovations of 2023',
    excerpt: 'Explore the most significant AI advancements and breakthroughs that happened this year.',
    category: 'news',
    date: 'April 22, 2023',
    image: 'https://images.unsplash.com/photo-1647166545674-ce28ce93bdca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'How a Fintech Company Reduced Costs by 40% Using AI',
    excerpt: 'Case study on how artificial intelligence helped optimize operations and reduce overhead.',
    category: 'case-studies',
    date: 'April 15, 2023',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
];

const footerLinks = [
  {
    title: 'Product',
    links: [
      { text: 'Features', url: '#features' },
      { text: 'Pricing', url: '#pricing' },
      { text: 'Integrations', url: '#' },
      { text: 'Enterprise', url: '#' },
      { text: "What's New", url: '#' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { text: 'Documentation', url: '#' },
      { text: 'Guides', url: '#' },
      { text: 'Support Center', url: '#' },
      { text: 'API', url: '#' },
      { text: 'Community', url: '#' },
    ]
  },
  {
    title: 'Company',
    links: [
      { text: 'About Us', url: '#' },
      { text: 'Careers', url: '#' },
      { text: 'Contact', url: '#' },
      { text: 'Partners', url: '#' },
      { text: 'Legal', url: '#' },
    ]
  }
];

export default LandingPage;
