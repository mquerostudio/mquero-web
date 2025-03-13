import directus from './directus';
import { readItems } from '@directus/sdk';

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  publishDate: string;
  featuredImage: string;
  author: {
    id: string;
    name: string;
    title: string;
    avatar: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
  readTime: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

/**
 * Fetches all blog posts from the CMS
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await directus.request(
      readItems('Article', {
        fields: [
          'id',
          'title',
          'description',
          'slug',
          'publishDate',
          'featuredImage',
          'readTime',
          { author: ['id', 'name', 'title', 'avatar'] },
          { categories: ['id', 'name'] }
        ],
        sort: ['-publishDate'],
        filter: {
          status: {
            _eq: 'published'
          }
        }
      })
    );
    
    return posts as unknown as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetches a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await directus.request(
      readItems('Article', {
        fields: [
          'id',
          'title',
          'description',
          'content',
          'slug',
          'publishDate',
          'featuredImage',
          'readTime',
          { author: ['id', 'name', 'title', 'avatar'] },
          { categories: ['id', 'name'] }
        ],
        filter: {
          slug: {
            _eq: slug
          },
          status: {
            _eq: 'published'
          }
        },
        limit: 1
      })
    );
    
    return posts && posts.length > 0 ? (posts[0] as unknown as BlogPost) : null;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches all blog categories
 */
export async function getAllCategories(): Promise<BlogCategory[]> {
  try {
    const categories = await directus.request(
      readItems('blog_categories', {
        fields: ['id', 'name', 'slug'],
        sort: ['name']
      })
    );
    
    return categories as unknown as BlogCategory[];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

/**
 * Fetches related blog posts based on categories
 */
export async function getRelatedPosts(postId: string, categoryIds: string[], limit = 3): Promise<BlogPost[]> {
  try {
    const posts = await directus.request(
      readItems('Article', {
        fields: [
          'id',
          'title',
          'description',
          'slug',
          'publishDate',
          'featuredImage',
          'readTime',
          { categories: ['id'] }
        ],
        filter: {
          _and: [
            {
              id: {
                _neq: postId
              }
            },
            {
              status: {
                _eq: 'published'
              }
            },
            {
              categories: {
                id: {
                  _in: categoryIds
                }
              }
            }
          ]
        },
        limit: limit,
        sort: ['-publishDate']
      })
    );
    
    return posts as unknown as BlogPost[];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

/**
 * Fetches the featured blog post (most recent post)
 */
export async function getFeaturedPost(): Promise<BlogPost | null> {
  try {
    const posts = await directus.request(
      readItems('Article', {
        fields: [
          'id',
          'title',
          'description',
          'slug',
          'publishDate',
          'featuredImage',
          { categories: ['id', 'name'] }
        ],
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['-publishDate'],
        limit: 1
      })
    );
    
    return posts && posts.length > 0 ? (posts[0] as unknown as BlogPost) : null;
  } catch (error) {
    console.error('Error fetching featured post:', error);
    return null;
  }
} 