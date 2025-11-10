import React from 'react';
import { Home } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizeStyles = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeStyles[size]} rounded-full bg-gold flex items-center justify-center text-white`}>
        <Home className="w-1/2 h-1/2" />
      </div>
      {showText && (
        <span className={`${textSizeStyles[size]} font-bold text-gray-900`}>
          TES Real Estate
        </span>
      )}
    </div>
  );
};
