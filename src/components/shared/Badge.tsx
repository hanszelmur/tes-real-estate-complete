import React from 'react';
import { getStatusColor } from '../../utils/helpers';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};
