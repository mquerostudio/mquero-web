import { directus, type ItemsQuery } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export interface Post {
  slug?: string;
  title?: string;
  body?: string;
  summary?: string;
  cover?: string;
  tags?: number[]; // Now an array of tag IDs
  tagNames?: string[]; // Added for convenience when enriched
  status?: string;
  user_created?: string;
  user_updated?: string;
  date_created?: string;
  date_updated?: string;
}

export async function getPosts(options?: ItemsQuery): Promise<Post[]> {
  return directus.request(readItems('posts', options)) as unknown as Post[];
}

/**
 * Get a single post by slug
 * @param slug Post slug
 * @returns Promise<Post | undefined> Single post or undefined if not found
 */
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts({
    fields: ['slug', 'title', 'body', 'summary', 'cover', 'date_created', 'tags', 'status', 'user_created'],
    filter: {
      _and: [
        { slug: { _eq: slug } },
        { status: { _eq: 'published' } }
      ]
    }
  });
  
  return Array.isArray(posts) && posts.length > 0 ? posts[0] : undefined;
}

/**
 * Get all unique tags from all posts
 * @returns Promise<string[]> Array of unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getPosts({
    fields: ['tags', 'status']
  });
  
  // Get only published posts
  const publishedPosts = Array.isArray(posts) 
    ? posts.filter(post => post.status === 'published')
    : [];
  
  // Extract all tags from posts and create a unique list
  const allTags = new Set<string>();
  
  publishedPosts.forEach(post => {
    if (post.tags) {
      try {
        const tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags;
        if (Array.isArray(tags)) {
          tags.forEach(tag => allTags.add(tag));
        }
      } catch (e) {
        // Skip if tags cannot be parsed
      }
    }
  });
  
  return Array.from(allTags).sort();
}

/**
 * Parse tag IDs from a post
 * @param tags Tags as number[] or string representation of number[]
 * @returns Array of tag IDs
 */
export function parseTagIds(tags?: number[] | string): number[] {
  if (!tags) return [];
  
  if (Array.isArray(tags)) {
    return tags.filter(tag => typeof tag === 'number');
  }
  
  try {
    const parsedTags = JSON.parse(tags);
    return Array.isArray(parsedTags) 
      ? parsedTags.filter(tag => typeof tag === 'number')
      : [];
  } catch (e) {
    return [];
  }
}