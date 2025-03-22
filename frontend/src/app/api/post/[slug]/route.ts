import { getArticleBySlug } from '@/lib/posts';
import { getTags, getTagNamesByIds, getTagsByArticleId } from '@/lib/tags';
import { NextResponse } from 'next/server';

interface PostParams {
  slug: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<PostParams> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }
    
    const article = await getArticleBySlug(slug, locale);
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    // Fetch tag information if the article has tags
    if (article.tags && Array.isArray(article.tags) && article.tags.length > 0) {
      const tags = await getTagsByArticleId(article.id);
      
      // Add tag names to the article
      return NextResponse.json({ 
        article: {
          ...article,
          tagNames: tags.map(tag => tag.name)
        } 
      });
    }
    
    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
} 