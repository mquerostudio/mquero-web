'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import BlogPostCard from '../../components/custom/BlogPostCard';

export default function BlogPage() {
  const t = useTranslations('BlogPage');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);

  // Featured article data
  const featuredArticle = {
    id: 'featured-1',
    title: 'This is a feature article - the last article writed',
    description: 'Lorem ipsum dolor amet, consectetur adipiscing elit. Elementum non donec cursus turpis tristique magnis massa natoque ultrices magnis quis nascetur leo massa pellentesque.',
    imageSrc: '/placeholder.png',
    link: '/blog/featured-1'
  };

  // Categories
  const categories = [
    { id: 'all', name: 'All articles' },
    { id: 'category1', name: 'Category 1' },
    { id: 'category2', name: 'Category 2' },
    { id: 'category3', name: 'Category 3' }
  ];

  // Blog posts data with multiple categories (tags)
  const blogPosts = [
    {
      id: 1,
      title: 'Article name - Headline for article',
      description: 'Short description of the blog post content. This gives readers a preview of what to expect.',
      categories: ['category1', 'category2'],
      categoryLabels: ['CATEGORY 1', 'CATEGORY 2'],
      imageSrc: '/placeholder.png',
      link: '/blog/1'
    },
    {
      id: 2,
      title: 'Article name - Headline for article',
      description: 'Short description of the blog post content. This gives readers a preview of what to expect.',
      categories: ['category2'],
      categoryLabels: ['CATEGORY 2'],
      imageSrc: '/placeholder.png',
      link: '/blog/2'
    },
    {
      id: 3,
      title: 'Article name - Headline for article',
      description: 'Short description of the blog post content. This gives readers a preview of what to expect.',
      categories: ['category3', 'category1'],
      categoryLabels: ['CATEGORY 3', 'CATEGORY 1'],
      imageSrc: '/placeholder.png',
      link: '/blog/3'
    },
    {
      id: 4,
      title: 'Article name - Headline for article',
      description: 'Short description of the blog post content. This gives readers a preview of what to expect.',
      categories: ['category1'],
      categoryLabels: ['CATEGORY 1'],
      imageSrc: '/placeholder.png',
      link: '/blog/4'
    },
    {
      id: 5,
      title: 'Article name - Headline for article',
      description: 'Short description of the blog post content. This gives readers a preview of what to expect.',
      categories: ['category2', 'category3'],
      categoryLabels: ['CATEGORY 2', 'CATEGORY 3'],
      imageSrc: '/placeholder.png',
      link: '/blog/5'
    },
    {
      id: 6,
      title: 'Article name - Headline for article',
      description: 'Short description of the blog post content. This gives readers a preview of what to expect.',
      categories: ['category3'],
      categoryLabels: ['CATEGORY 3'],
      imageSrc: '/placeholder.png',
      link: '/blog/6'
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

  // Filter posts based on selected categories using AND logic
  const filteredPosts = selectedCategories.includes('all')
    ? blogPosts
    : blogPosts.filter(post => 
        // Check if post has ALL selected categories (AND logic)
        selectedCategories.every(category => post.categories.includes(category))
      );

  return (
    <div className="w-full py-12">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

        {/* Featured Article */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold mb-4">{featuredArticle.title}</h2>
              <p className="text-gray-700 mb-6">{featuredArticle.description}</p>
              <Link 
                href={featuredArticle.link}
                className="bg-black text-white px-6 py-2 rounded-md inline-block hover:bg-gray-800 transition-colors"
              >
                {t('readNow')}
              </Link>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <Image
                src={featuredArticle.imageSrc}
                alt={featuredArticle.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

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

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
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
    </div>
  );
} 