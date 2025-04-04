import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative mr-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-one-accent to-purple-400 flex items-center justify-center shadow-glow-sm">
          <span className="text-white font-bold text-lg">1</span>
        </div>
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-one-accent animate-pulse-glow shadow-glow-sm"></div>
      </div>
      <div className="text-xl font-bold tracking-tight text-white">
        <span>One</span>
        <span className="text-one-accent">Intelligent</span>
      </div>
    </div>
  );
};

export default Logo;
