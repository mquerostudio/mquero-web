'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import BlogPostCard from '../../components/custom/BlogPostCard';

interface Project {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  categories: string[];
  categoryLabels: string[];
  relatedArticles: RelatedArticle[];
}

interface RelatedArticle {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  categoryLabels: string[];
}

export default function ProjectsPage() {
  const t = useTranslations('ProjectsPage');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);

  // Categories
  const categories = [
    { id: 'all', name: 'All projects' },
    { id: 'pcb-design', name: 'PCB Design' },
    { id: 'embedded-systems', name: 'Embedded Systems' },
    { id: 'firmware', name: 'Firmware' },
    { id: 'iot', name: 'IoT' }
  ];

  // Projects data with related articles
  const projects: Project[] = [
    {
      id: 1,
      title: 'Smart Home Energy Monitor',
      description: 'A complete energy monitoring system that tracks power consumption in real-time and provides insights to reduce energy usage.',
      imageSrc: '/placeholder.png',
      link: '/projects/smart-home-energy-monitor',
      categories: ['pcb-design', 'embedded-systems', 'iot'],
      categoryLabels: ['PCB DESIGN', 'EMBEDDED SYSTEMS', 'IOT'],
      relatedArticles: [
        {
          id: 101,
          title: 'Designing PCBs for Energy Monitoring',
          description: 'Learn about the specific considerations when designing PCBs for energy monitoring applications.',
          imageSrc: '/placeholder.png',
          link: '/blog/pcb-energy-monitoring',
          categoryLabels: ['PCB DESIGN', 'ENERGY']
        },
        {
          id: 102,
          title: 'IoT Protocols for Home Automation',
          description: 'An overview of the most efficient communication protocols for home automation systems.',
          imageSrc: '/placeholder.png',
          link: '/blog/iot-protocols',
          categoryLabels: ['IOT', 'PROTOCOLS']
        },
        {
          id: 103,
          title: 'Data Visualization for Energy Consumption',
          description: 'Techniques for creating intuitive dashboards to display energy consumption data.',
          imageSrc: '/placeholder.png',
          link: '/blog/energy-data-visualization',
          categoryLabels: ['DATA', 'UI/UX']
        }
      ]
    },
    {
      id: 2,
      title: 'Wireless Sensor Network for Agriculture',
      description: 'A distributed system of sensors that monitor soil conditions, weather, and plant health to optimize farming operations.',
      imageSrc: '/placeholder.png',
      link: '/projects/agricultural-sensor-network',
      categories: ['embedded-systems', 'iot', 'firmware'],
      categoryLabels: ['EMBEDDED SYSTEMS', 'IOT', 'FIRMWARE'],
      relatedArticles: [
        {
          id: 201,
          title: 'Low-Power Design for Remote Sensors',
          description: 'Strategies for designing ultra-low power sensors that can operate for months on battery power.',
          imageSrc: '/placeholder.png',
          link: '/blog/low-power-sensors',
          categoryLabels: ['POWER MANAGEMENT', 'SENSORS']
        },
        {
          id: 202,
          title: 'Environmental Protection for Outdoor Electronics',
          description: 'How to protect electronic devices from harsh environmental conditions in agricultural settings.',
          imageSrc: '/placeholder.png',
          link: '/blog/outdoor-electronics',
          categoryLabels: ['HARDWARE', 'DESIGN']
        },
        {
          id: 203,
          title: 'Wireless Communication in Rural Areas',
          description: 'Overcoming challenges of wireless communication in remote agricultural environments.',
          imageSrc: '/placeholder.png',
          link: '/blog/rural-wireless',
          categoryLabels: ['WIRELESS', 'NETWORKING']
        }
      ]
    },
    {
      id: 3,
      title: 'Wearable Health Monitor',
      description: 'A compact wearable device that tracks vital signs and provides real-time health insights to users and healthcare providers.',
      imageSrc: '/placeholder.png',
      link: '/projects/wearable-health-monitor',
      categories: ['pcb-design', 'firmware', 'embedded-systems'],
      categoryLabels: ['PCB DESIGN', 'FIRMWARE', 'EMBEDDED SYSTEMS'],
      relatedArticles: [
        {
          id: 301,
          title: 'Miniaturization Techniques for Wearable Electronics',
          description: 'Advanced techniques for creating compact PCB designs suitable for wearable devices.',
          imageSrc: '/placeholder.png',
          link: '/blog/wearable-miniaturization',
          categoryLabels: ['PCB DESIGN', 'WEARABLES']
        },
        {
          id: 302,
          title: 'Biometric Sensor Integration',
          description: 'How to integrate and calibrate various biometric sensors for accurate health monitoring.',
          imageSrc: '/placeholder.png',
          link: '/blog/biometric-sensors',
          categoryLabels: ['SENSORS', 'HEALTH TECH']
        },
        {
          id: 303,
          title: 'Battery Management for Wearables',
          description: 'Optimizing battery life and charging systems for wearable electronic devices.',
          imageSrc: '/placeholder.png',
          link: '/blog/wearable-battery',
          categoryLabels: ['POWER MANAGEMENT', 'BATTERIES']
        }
      ]
    }
  ];

  // Handle category selection
  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
      return;
    }
    
    // If "all" is currently selected, remove it
    const newCategories = selectedCategories.filter(id => id !== 'all');
    
    // Toggle the selected category
    if (newCategories.includes(categoryId)) {
      // If this is the last category and we're removing it, select "all" again
      if (newCategories.length === 1) {
        setSelectedCategories(['all']);
      } else {
        setSelectedCategories(newCategories.filter(id => id !== categoryId));
      }
    } else {
      setSelectedCategories([...newCategories, categoryId]);
    }
  };

  // Filter projects based on selected categories using AND logic
  const filteredProjects = selectedCategories.includes('all')
    ? projects
    : projects.filter(project => 
        // Check if project has ALL selected categories (AND logic)
        selectedCategories.every(category => project.categories.includes(category))
      );

  return (
    <div className="w-full py-12">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategories.includes(category.id)
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Projects List */}
        <div className="space-y-12">
          {filteredProjects.map(project => (
            <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Project Card */}
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 relative">
                  <Image
                    src={project.imageSrc}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.categoryLabels.map((label, index) => (
                      <span 
                        key={index} 
                        className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  <Link 
                    href={project.link}
                    className="bg-black text-white px-6 py-2 rounded-md inline-block hover:bg-gray-800 transition-colors"
                  >
                    {t('viewProject')}
                  </Link>
                </div>
              </div>

              {/* Related Articles */}
              <div className="bg-gray-50 p-6">
                <h3 className="text-xl font-bold mb-4">{t('relatedArticles')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {project.relatedArticles.map(article => (
                    <BlogPostCard
                      key={article.id}
                      title={article.title}
                      description={article.description}
                      categoryLabels={article.categoryLabels}
                      imageSrc={article.imageSrc}
                      link={article.link}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 