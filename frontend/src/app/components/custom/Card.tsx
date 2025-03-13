'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';

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
  const CardContent = () => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md h-full flex flex-col group">
      <div className="h-64 relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
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