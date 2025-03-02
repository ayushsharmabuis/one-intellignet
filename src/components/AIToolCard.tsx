
import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  tags?: string[];
}

interface AIToolCardProps {
  tool: AITool;
  index: number;
}

const AIToolCard: React.FC<AIToolCardProps> = ({ tool, index }) => {
  return (
    <div 
      className="glass-card rounded-xl overflow-hidden relative group transition-all duration-500 glow-effect"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6">
        <div className="mb-4 w-12 h-12 rounded-lg bg-one-accent/10 flex items-center justify-center text-one-accent">
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
            <p className="text-one-text-muted text-sm line-clamp-3 mb-4">
              {tool.description}
            </p>
          </div>
          
          <a 
            href={tool.url} 
            className="flex items-center mt-auto text-one-accent font-medium group"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span>Try Tool</span>
            <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-transparent to-one-accent/5 transition-opacity duration-300"></div>
    </div>
  );
};

export default AIToolCard;
