
import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown, ArrowRight, Bot, Star, Users, Zap, Code, Brush, Video, Search, Lock, Clock, MessageSquare, LineChart, ChevronUp, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';
import { useIntersectionObserver } from '../utils/animations';

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animatedText, setAnimatedText] = useState<string[]>([]);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeBlogCategory, setActiveBlogCategory] = useState('all');
  
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        // Fix TypeScript error by using proper element casting
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
    // Simulate loading for animation purposes
    setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialInterval);
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

  const setBlogSectionRef = useIntersectionObserver(
    (entry) => {
      if (entry.isIntersecting) {
        const elements = document.querySelectorAll('.blog-card');
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
  }, [isLoaded]);

  // Filter blog posts by category
  const filteredBlogPosts = activeBlogCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeBlogCategory);

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
            <div key={index} className="feature-card glass-card rounded-xl p-6 opacity-0 transition-all duration-500 transform hover:scale-105 hover:shadow-glow-md" style={{transitionDelay: `${index * 0.1}s`}}>
              <div className="w-12 h-12 rounded-lg bg-one-accent/10 flex items-center justify-center text-one-accent mb-4 transition-all duration-300 group-hover:bg-one-accent/20">
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

      {/* Blog Section */}
      <section id="blog" className="section-container" ref={setBlogSectionRef}>
        <div className="text-center mb-16">
          <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20">
            Latest Updates
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">
            AI Knowledge Hub
          </h2>
          <p className="text-one-text-muted max-w-2xl mx-auto">
            Discover the latest insights, tutorials, and news from the world of AI
          </p>
          
          {/* Blog Categories */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {['all', 'tutorials', 'news', 'insights', 'case-studies'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveBlogCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeBlogCategory === category 
                    ? 'bg-one-accent text-white' 
                    : 'bg-one-card text-one-text-muted hover:bg-one-border/50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogPosts.map((post, index) => (
            <div 
              key={index} 
              className="blog-card glass-card rounded-xl overflow-hidden opacity-0 transition-all duration-500 transform hover:scale-105 hover:shadow-glow-md"
              style={{transitionDelay: `${index * 0.1}s`}}
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-one-dark/80 z-10"></div>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full bg-one-accent/80 text-white text-xs font-medium">
                    {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-one-text-muted text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-one-text-muted">{post.date}</span>
                  <a href="#" className="text-one-accent text-sm font-medium flex items-center hover:underline">
                    Read More 
                    <ArrowRight size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#" className="inline-flex items-center px-6 py-3 rounded-lg font-medium text-one-accent border border-one-accent/50 transition-all duration-300 hover:bg-one-accent/10 hover:shadow-glow-sm">
            View All Articles
            <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </section>

      {/* Reviews Section */}
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

      {/* Final CTA Section */}
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

      {/* Footer */}
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

// Blog posts data 
const blogPosts = [
  {
    title: 'The Future of AI-Powered Workflow Automation',
    excerpt: 'Discover how AI is revolutionizing workflow automation and increasing productivity across industries.',
    category: 'insights',
    date: 'June 15, 2023',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Getting Started with AI Image Generation: A Beginner's Guide',
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

// Testimonials data
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

// Footer links
const footerLinks = [
  {
    title: 'Product',
    links: [
      { text: 'Features', url: '#features' },
      { text: 'Pricing', url: '#' },
      { text: 'Integrations', url: '#' },
      { text: 'Enterprise', url: '#' },
      { text: 'What\'s New', url: '#' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { text: 'Blog', url: '#blog' },
      { text: 'Documentation', url: '#' },
      { text: 'Guides', url: '#' },
      { text: 'Support Center', url: '#' },
      { text: 'API', url: '#' },
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
