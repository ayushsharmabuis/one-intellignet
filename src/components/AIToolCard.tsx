
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  tags?: string[];
  rating?: number;
  pricing?: string;
}

interface AIToolCardProps {
  tool: AITool;
  index: number;
}

const AIToolCard: React.FC<AIToolCardProps> = ({ tool, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Mouse move effect for the card
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      // Calculate rotation based on mouse position
      const rotateY = 10 * (0.5 - x);
      const rotateX = 10 * (y - 0.5);
      
      // Apply 3D rotation and lighting effect
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(123, 92, 250, 0.15), transparent)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.background = '';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="glass-card rounded-xl overflow-hidden relative group transition-all duration-500 glow-effect"
      style={{ 
        animationDelay: `${index * 100}ms`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease, background 0.3s ease'
      }}
    >
      <div className="p-6">
        <div className="mb-4 w-12 h-12 rounded-lg bg-one-accent/10 flex items-center justify-center text-one-accent transform transition-transform group-hover:scale-110 duration-300">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src={tool.icon} 
              alt={`${tool.name} icon`} 
              className="w-6 h-6 object-contain" 
              loading="lazy"
            />
          </div>
        </div>
        
        <div className="flex flex-col h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lg text-one-text">{tool.name}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-one-accent/10 text-one-accent border border-one-accent/20">
                {tool.category}
              </span>
            </div>
            <p className="text-one-text-muted text-sm line-clamp-3 mb-2">
              {tool.description}
            </p>
            
            {/* Display rating */}
            {tool.rating && (
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm text-one-text-muted">{tool.rating.toFixed(1)}</span>
                </div>
                {tool.pricing && (
                  <span className="ml-auto text-xs text-one-text-muted">{tool.pricing}</span>
                )}
              </div>
            )}
          </div>
          
          <a 
            href={tool.url} 
            className="flex items-center mt-auto text-one-accent font-medium group/link"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-one-accent after:origin-bottom-right after:transition-transform after:duration-300 group-hover/link:after:scale-x-100 group-hover/link:after:origin-bottom-left">Try Tool</span>
            <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover/link:translate-x-1" />
          </a>
        </div>
      </div>
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-transparent to-one-accent/5 transition-opacity duration-300"></div>
      
      {/* Animated border effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 border border-one-accent/0 group-hover:border-one-accent/30 rounded-xl transition-all duration-500"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-one-accent/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out"></div>
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-one-accent/50 to-transparent transform translate-x-full group-hover:-translate-x-full transition-transform duration-1500 ease-in-out"></div>
      </div>
    </div>
  );
};

export default AIToolCard;
