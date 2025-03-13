'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import BlogPostCard from '../../../components/custom/BlogPostCard';

export default function BlogArticlePage() {
  const t = useTranslations('BlogPage');
  const params = useParams();
  const slug = params.slug;

  // This would typically come from an API or CMS
  const article = {
    id: slug,
    title: 'How to Design Efficient PCB Layouts for Embedded Systems',
    description: 'Learn the best practices for designing PCB layouts that optimize space, reduce interference, and improve overall system performance.',
    content: `
      <p>Printed Circuit Board (PCB) design is a critical aspect of embedded systems development. A well-designed PCB can significantly improve the performance, reliability, and manufacturability of your electronic devices.</p>
      
      <h2>Understanding the Basics</h2>
      <p>Before diving into PCB layout design, it's essential to understand the basic principles that govern electronic circuits. These include:</p>
      <ul>
        <li>Signal integrity considerations</li>
        <li>Power distribution requirements</li>
        <li>Thermal management needs</li>
        <li>Electromagnetic compatibility (EMC)</li>
      </ul>
      
      <p>When designing PCBs for embedded systems, you need to consider the specific requirements of microcontrollers, sensors, and other components that make up your system.</p>
      
      <h2>Component Placement</h2>
      <p>The placement of components on your PCB is perhaps the most crucial step in the design process. Proper component placement can:</p>
      <ul>
        <li>Minimize signal path lengths</li>
        <li>Reduce electromagnetic interference</li>
        <li>Improve thermal performance</li>
        <li>Facilitate easier assembly and testing</li>
      </ul>
      
      <p>Start by placing critical components such as microcontrollers, crystals, and high-speed interfaces. Then, arrange supporting components around them in a logical manner.</p>
      
      <h2>Routing Techniques</h2>
      <p>After placing your components, the next step is to route the connections between them. Effective routing techniques include:</p>
      <ul>
        <li>Using appropriate trace widths based on current requirements</li>
        <li>Maintaining consistent impedance for high-speed signals</li>
        <li>Implementing proper ground planes</li>
        <li>Minimizing vias in critical signal paths</li>
      </ul>
      
      <p>Remember that the shortest path isn't always the best path. Sometimes, a slightly longer route that avoids potential interference sources is preferable.</p>
      
      <h2>Power Distribution</h2>
      <p>Proper power distribution is essential for the reliable operation of your embedded system. Consider these practices:</p>
      <ul>
        <li>Use wide traces or copper pours for power connections</li>
        <li>Place decoupling capacitors close to IC power pins</li>
        <li>Implement star grounding where appropriate</li>
        <li>Consider using dedicated power planes for complex designs</li>
      </ul>
      
      <h2>Design for Manufacturability</h2>
      <p>A well-designed PCB should not only function correctly but also be easy to manufacture. Design for manufacturability (DFM) considerations include:</p>
      <ul>
        <li>Adhering to your manufacturer's design rules</li>
        <li>Using standard component packages when possible</li>
        <li>Providing adequate clearance for assembly equipment</li>
        <li>Including proper fiducial marks for automated assembly</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Designing efficient PCB layouts for embedded systems requires a balance of electrical engineering principles, practical experience, and attention to detail. By following the best practices outlined in this article, you can create PCBs that not only meet your functional requirements but also are reliable, manufacturable, and cost-effective.</p>
    `,
    publishDate: 'April 15, 2023',
    author: 'Manuel Quero',
    authorTitle: 'Electronics Engineer',
    authorImage: '/profile-picture.png',
    featuredImage: '/placeholder.png',
    categories: ['PCB Design', 'Embedded Systems'],
    readTime: '8 min read'
  };

  // Related articles
  const relatedArticles = [
    {
      id: 1,
      title: 'Choosing the Right Microcontroller for Your Project',
      description: 'A comprehensive guide to selecting microcontrollers based on your project requirements and constraints.',
      categories: ['Microcontrollers', 'Embedded Systems'],
      categoryLabels: ['MICROCONTROLLERS', 'EMBEDDED SYSTEMS'],
      imageSrc: '/placeholder.png',
      link: '/blog/microcontroller-selection'
    },
    {
      id: 2,
      title: 'Power Management Techniques for Battery-Powered Devices',
      description: 'Learn how to optimize power consumption in your embedded designs to extend battery life.',
      categories: ['Power Management', 'Battery Devices'],
      categoryLabels: ['POWER MANAGEMENT', 'BATTERY DEVICES'],
      imageSrc: '/placeholder.png',
      link: '/blog/power-management'
    },
    {
      id: 3,
      title: 'Debugging Common Issues in Embedded Firmware',
      description: 'Practical approaches to identifying and resolving common problems in embedded firmware development.',
      categories: ['Firmware', 'Debugging'],
      categoryLabels: ['FIRMWARE', 'DEBUGGING'],
      imageSrc: '/placeholder.png',
      link: '/blog/firmware-debugging'
    }
  ];

  return (
    <div className="w-full py-12">
      <div className="max-w-4xl w-full mx-auto">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {article.categories.map((category, index) => (
              <span 
                key={index} 
                className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded"
              >
                {category.toUpperCase()}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden relative">
                <Image 
                  src={article.authorImage} 
                  alt={article.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-medium text-black">{article.author}</span>
                <span className="block text-xs">{article.authorTitle}</span>
              </div>
            </div>
            <span>•</span>
            <span>{article.publishDate}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full h-64 md:h-96 relative mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Author Bio */}
        <div className="bg-gray-100 p-6 rounded-lg mb-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden relative">
              <Image 
                src={article.authorImage} 
                alt={article.author}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{article.author}</h3>
              <p className="text-gray-600">{article.authorTitle}</p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">{t('relatedArticles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map(post => (
              <BlogPostCard
                key={post.id}
                title={post.title}
                description={post.description}
                categoryLabels={post.categoryLabels}
                imageSrc={post.imageSrc}
                link={post.link}
              />
            ))}
          </div>
        </div>

        {/* Back to Blog Button */}
        <div className="flex justify-center">
          <Link 
            href="/blog" 
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            {t('backToBlog')}
          </Link>
        </div>
      </div>
    </div>
  );
} 