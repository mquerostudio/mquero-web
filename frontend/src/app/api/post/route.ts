import { getArticleBySlug } from '@/lib/posts';
import { getTags, getArticleTagRelations, getTagsByArticleId } from '@/lib/tags';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const locale = searchParams.get('locale') || 'en';
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' }, 
        { status: 400 }
      );
    }
    
    // Get the article with translation
    const article = await getArticleBySlug(slug, locale);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' }, 
        { status: 404 }
      );
    }
    
    // Get the tags for this article
    const tags = await getTagsByArticleId(article.id);
    
    // Return the article with tags
    return NextResponse.json({
      article: {
        ...article,
        tags: tags.map(tag => tag.id), // Include tag IDs
        tagNames: tags.map(tag => tag.name) // Include tag names for convenience
      }
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' }, 
      { status: 500 }
    );
  }
} 