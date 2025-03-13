'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import BlogPostCard from '../../../components/custom/BlogPostCard';

export default function ProjectDetailPage() {
  const t = useTranslations('ProjectsPage');
  const params = useParams();
  const slug = params.slug;

  // This would typically come from an API or CMS
  const project = {
    id: slug,
    title: 'Smart Home Energy Monitor',
    description: 'A complete energy monitoring system that tracks power consumption in real-time and provides insights to reduce energy usage.',
    fullDescription: `
      <p>The Smart Home Energy Monitor is a comprehensive solution designed to help homeowners understand and optimize their energy consumption. By providing real-time data and actionable insights, this system enables users to make informed decisions about their energy usage, leading to cost savings and reduced environmental impact.</p>
      
      <h2>Project Overview</h2>
      <p>This project combines hardware and software components to create a seamless energy monitoring experience:</p>
      <ul>
        <li>Custom-designed PCB with energy measurement ICs</li>
        <li>Microcontroller-based data processing unit</li>
        <li>Wireless communication module for data transmission</li>
        <li>Cloud-based data storage and analysis</li>
        <li>Mobile and web applications for user interaction</li>
      </ul>
      
      <h2>Technical Specifications</h2>
      <p>The hardware components of this project include:</p>
      <ul>
        <li>ATmega328P microcontroller operating at 16MHz</li>
        <li>ADE7953 energy measurement IC for accurate power monitoring</li>
        <li>ESP8266 Wi-Fi module for wireless connectivity</li>
        <li>Split-core current transformers for non-invasive current measurement</li>
        <li>Voltage divider circuit for mains voltage sampling</li>
        <li>Power supply with multiple isolation barriers for safety</li>
      </ul>
      
      <h2>Design Challenges</h2>
      <p>Developing this project presented several challenges that required innovative solutions:</p>
      <ul>
        <li>Ensuring electrical safety when measuring mains voltage</li>
        <li>Achieving high accuracy in power measurements across various load types</li>
        <li>Optimizing wireless communication for reliability and low power consumption</li>
        <li>Designing an intuitive user interface for technical and non-technical users</li>
        <li>Implementing secure data transmission and storage</li>
      </ul>
      
      <h2>Implementation Process</h2>
      <p>The development of this project followed a structured approach:</p>
      <ol>
        <li>Requirements analysis and system architecture design</li>
        <li>Schematic design and component selection</li>
        <li>PCB layout and manufacturing</li>
        <li>Firmware development and testing</li>
        <li>Backend infrastructure setup</li>
        <li>Mobile and web application development</li>
        <li>System integration and validation</li>
        <li>Field testing and refinement</li>
      </ol>
      
      <h2>Results and Impact</h2>
      <p>The Smart Home Energy Monitor has demonstrated significant benefits in real-world applications:</p>
      <ul>
        <li>Average energy savings of 15-20% for users</li>
        <li>Identification of energy-inefficient appliances and behaviors</li>
        <li>Early detection of electrical issues before they cause damage</li>
        <li>Increased awareness of energy consumption patterns</li>
        <li>Reduced carbon footprint through optimized energy usage</li>
      </ul>
      
      <h2>Future Developments</h2>
      <p>This project continues to evolve with planned enhancements including:</p>
      <ul>
        <li>Integration with smart home ecosystems (HomeKit, Google Home, Alexa)</li>
        <li>Machine learning algorithms for predictive energy analysis</li>
        <li>Expanded sensor capabilities for environmental monitoring</li>
        <li>Community features for comparing and sharing energy-saving strategies</li>
        <li>Hardware refinements for easier installation and expanded compatibility</li>
      </ul>
    `,
    completionDate: 'June 2023',
    client: 'Self-initiated project',
    role: 'Hardware & Firmware Engineer',
    duration: '8 months',
    featuredImage: '/placeholder.png',
    galleryImages: [
      '/placeholder.png',
      '/placeholder.png',
      '/placeholder.png',
      '/placeholder.png'
    ],
    categories: ['PCB Design', 'Embedded Systems', 'IoT'],
    technologies: ['ATmega328P', 'ESP8266', 'ADE7953', 'React', 'Node.js', 'MQTT'],
    githubLink: 'https://github.com/username/smart-home-energy-monitor',
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
  };

  return (
    <div className="w-full py-12">
      <div className="max-w-6xl w-full mx-auto">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.categories.map((category, index) => (
              <span 
                key={index} 
                className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded"
              >
                {category.toUpperCase()}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-gray-700 mb-6">{project.description}</p>
        </div>

        {/* Featured Image */}
        <div className="w-full h-64 md:h-96 relative mb-8 rounded-lg overflow-hidden">
          <Image
            src={project.featuredImage}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-500 mb-1">Completion Date</h3>
            <p>{project.completionDate}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-500 mb-1">Client</h3>
            <p>{project.client}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-500 mb-1">Role</h3>
            <p>{project.role}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-500 mb-1">Duration</h3>
            <p>{project.duration}</p>
          </div>
        </div>

        {/* Technologies Used */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span 
                key={index} 
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Project Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: project.fullDescription }}
        />

        {/* Project Gallery */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.galleryImages.map((image, index) => (
              <div key={index} className="h-64 relative rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${project.title} gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Link */}
        {project.githubLink && (
          <div className="mb-12 flex justify-center">
            <a 
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View Project on GitHub
            </a>
          </div>
        )}

        {/* Related Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">{t('relatedArticles')}</h2>
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

        {/* Back to Projects Button */}
        <div className="flex justify-center">
          <Link 
            href="/projects" 
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            {t('backToProjects')}
          </Link>
        </div>
      </div>
    </div>
  );
} 