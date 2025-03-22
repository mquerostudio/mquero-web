'use client';

import { ReactNode } from 'react';
import { useTheme } from '../ThemeProvider';

interface SkillCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
}

const SkillCard = ({ title, description, icon, color }: SkillCardProps) => {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-6 h-full transition-colors duration-300`}>
      <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-4 text-white`}>
        {icon}
      </div>
      <h3 className={`text-xl font-bold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{description}</p>
    </div>
  );
};

export default SkillCard; 