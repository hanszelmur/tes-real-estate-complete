import React from 'react';
import { getInitials } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md' }) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeStyles[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeStyles[size]} rounded-full bg-gold text-white flex items-center justify-center font-semibold`}
    >
      {getInitials(name)}
    </div>
  );
};
