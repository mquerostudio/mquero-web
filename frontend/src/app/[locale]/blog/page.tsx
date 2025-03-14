'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import BlogPostCard from '../../components/custom/BlogPostCard';

import { getPosts } from '@/lib/posts';

export default async function BlogPage() {
  const t = useTranslations('BlogPage');
  const [posts, setPosts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredPost, setFeaturedPost] = useState(null);

  const featuredPosts = await getPosts({
    fields: ['title', 'slug']
  });

  console.log('featuredPosts', featuredPosts);

  // Categories - hardcoded for now, can be fetched from API later
  const categories = [
    { id: 'all', name: 'All articles', slug: 'all' },
    { id: 'pcb-design', name: 'PCB Design', slug: 'pcb-design' },
    { id: 'embedded-systems', name: 'Embedded Systems', slug: 'embedded-systems' },
    { id: 'firmware', name: 'Firmware', slug: 'firmware' }
  ];

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
      return;
    }
    
    const newSelectedCategories = selectedCategories.includes('all')
      ? [categoryId]
      : selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId];
    
    // If no categories are selected, default to "all"
    setSelectedCategories(newSelectedCategories.length === 0 ? ['all'] : newSelectedCategories);
  };

  // Filter posts based on selected categories
  const filteredPosts = selectedCategories.includes('all')
    ? posts
    : posts.filter(post => 
        post.categories.some(category => selectedCategories.includes(category.id))
      );

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="max-w-6xl w-full mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12">
        <div className="max-w-6xl w-full mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

        {/* Featured Article */}
        {featuredPost && (
          <div className="mb-12">
            <div className="flex flex-col md:flex-row bg-gray-100 rounded-lg overflow-hidden">
              <div className="md:w-1/2 p-8">
                <div className="flex flex-wrap gap-1 mb-2">
                  {featuredPost.categories.map((category, index) => (
                    <span 
                      key={index} 
                      className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-gray-700 mb-6">{featuredPost.description}</p>
                <Link 
                  href={`/blog/${featuredPost.slug}`}
                  className="bg-black text-white px-6 py-2 rounded-md inline-block hover:bg-gray-800 transition-colors"
                >
                  {t('readNow')}
                </Link>
              </div>
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <Image
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}

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
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <BlogPostCard
                key={post.id}
                title={post.title}
                description={post.description}
                categoryLabels={post.categories.map(cat => cat.name)}
                imageSrc={post.featuredImage}
                link={`/blog/${post.slug}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles found for the selected categories.</p>
          </div>
        )}
      </div>
    </div>
  );
} 