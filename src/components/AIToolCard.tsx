import React from 'react';
import { Star, ArrowRight } from 'lucide-react';

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  icon: string;
  url: string;
  rating: number;
  pricing: string;
  tags?: string[];
}

interface AIToolCardProps {
  tool: AITool;
  index: number;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

const AIToolCard: React.FC<AIToolCardProps> = ({ 
  tool, 
  index, 
  isSaved = false,
  onToggleSave
}) => {
  return (
    <div className="bg-[#1F1F2E] rounded-lg p-5 h-full flex flex-col hover:border-gray-700 transition-all duration-200">
      {/* Top section with icon */}
      <div className="mb-3">
        <div className="h-10 w-10 rounded bg-[#2D2D3E] flex items-center justify-center overflow-hidden">
          {tool.icon ? (
            <img 
              src={tool.icon} 
              alt={tool.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-white font-medium">
              {tool.name.substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>
      </div>
      
      {/* Name and category badge */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-white text-lg">{tool.name}</h3>
        <div className="px-3 py-1 bg-[#2D2D3E] text-[#8969FF] rounded-full text-xs">
          {tool.category === 'AI Video Generation' ? 'Text to Video' : tool.category}
        </div>
      </div>
      
      {/* Description */}
      <div className="flex-grow flex items-center mb-5">
        <p className="text-sm text-gray-300 leading-relaxed max-h-[4.8em] overflow-hidden text-center px-1"
           style={{ 
             display: '-webkit-box', 
             WebkitLineClamp: 3, 
             WebkitBoxOrient: 'vertical',
             lineHeight: '1.6',
             wordSpacing: '0.05em',
             hyphens: 'auto'
           }}>
          {tool.description}
        </p>
      </div>
      
      {/* Rating and pricing */}
      <div className="flex items-center justify-between text-xs text-gray-300 mt-auto mb-4">
        <div className="flex items-center">
          <Star size={14} className="text-yellow-400 mr-1" />
          <span>{tool.rating.toFixed(1)}</span>
        </div>
        <div>
          <span>{tool.pricing}</span>
        </div>
      </div>
      
      {/* Try Tool button */}
      <a 
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#8969FF] hover:text-[#9979FF] text-sm font-medium flex items-center"
      >
        Try Tool <ArrowRight size={14} className="ml-1" />
      </a>
    </div>
  );
};

export default AIToolCard;
