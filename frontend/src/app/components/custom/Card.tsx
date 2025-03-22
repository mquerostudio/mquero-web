'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTheme } from '../ThemeProvider';

interface CardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  link?: string;
}

const Card = ({
  title,
  description,
  imageSrc,
  imageAlt = 'Project image',
  link
}: CardProps) => {
  const { resolvedTheme } = useTheme();

  const CardContent = () => (
    <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-md ${resolvedTheme === 'dark' ? 'shadow-gray-900/30' : ''} h-full flex flex-col group transition-all duration-500 hover:shadow-lg`}>
      <div className="h-64 relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 will-change-transform"
        />
      </div>
      <div className="p-6 flex-grow">
        <h3 className={`text-xl font-bold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{description}</p>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default Card; 