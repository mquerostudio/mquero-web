import { getPosts } from '@/lib/posts';
import { getTags, getPostTagRelations, getTagNamesByIds } from '@/lib/tags';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'get-tags') {
      const tags = await getTags();
      return NextResponse.json({ tags });
    }
    
    if (action === 'get-tag-relations') {
      const relations = await getPostTagRelations();
      return NextResponse.json({ relations });
    }
    
    // Default: get posts
    const posts = await getPosts({
      fields: ['slug', 'title', 'body', 'cover', 'date_created', 'tags', 'status', 'summary']
    });

    // Filter published posts
    const publishedPosts = Array.isArray(posts) 
      ? posts.filter(post => post.status === 'published')
      : [];

    // Sort posts by date (newest first)
    const sortedPosts = [...publishedPosts].sort((a, b) => {
      return new Date(b.date_created || '').getTime() - new Date(a.date_created || '').getTime();
    });
    
    // Fetch all tags for enriching the response with tag names
    const allTags = await getTags();
    
    // Enrich posts with tag names
    const enrichedPosts = await Promise.all(sortedPosts.map(async (post) => {
      // If post has tag IDs, convert them to tag names
      if (post.tags && Array.isArray(post.tags)) {
        const tagNames = await getTagNamesByIds(post.tags, allTags);
        return {
          ...post,
          tagNames
        };
      }
      return post;
    }));
    
    return NextResponse.json({ posts: enrichedPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
} 