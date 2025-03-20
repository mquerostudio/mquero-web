import { getPostBySlug } from '@/lib/posts';
import { getTags, getTagNamesByIds, getTagsByPostSlug } from '@/lib/tags';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Properly await params before accessing properties
    const slug = (await params).slug;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }
    
    const post = await getPostBySlug(slug);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Fetch tag information if the post has tags
    if (post.tags && Array.isArray(post.tags) && post.tags.length > 0) {
      const tags = await getTags();
      const tagNames = await getTagNamesByIds(post.tags, tags);
      
      // Add tag names to the post
      return NextResponse.json({ 
        post: {
          ...post,
          tagNames
        } 
      });
    }
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
} 