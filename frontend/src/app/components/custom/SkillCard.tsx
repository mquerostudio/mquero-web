'use client';

import { ReactNode } from 'react';

interface SkillCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
}

const SkillCard = ({ title, description, icon, color }: SkillCardProps) => {
  return (
    <div className="bg-gray-100 rounded-lg p-6 h-full">
      <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-4 text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default SkillCard; 