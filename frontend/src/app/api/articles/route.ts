import { getArticles, getArticlesWithTranslations } from '@/lib/posts';
import { getTags, getArticleTagRelations, getTagNamesByIds } from '@/lib/tags';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const locale = searchParams.get('locale') || 'en';
    
    if (action === 'get-tags') {
      const tags = await getTags();
      return NextResponse.json({ tags });
    }
    
    if (action === 'get-tag-relations') {
      const relations = await getArticleTagRelations();
      return NextResponse.json({ relations });
    }
    
    // Default: get articles with translations
    const articles = await getArticlesWithTranslations(locale);

    // Sort articles by date (newest first)
    const sortedArticles = [...articles].sort((a, b) => {
      return new Date(b.date_created || '').getTime() - new Date(a.date_created || '').getTime();
    });
    
    // Fetch all tags for enriching the response with tag names
    const allTags = await getTags();
    const tagRelations = await getArticleTagRelations();
    
    // Create a map of tag IDs by article ID
    const articleTagsMap = new Map<string, number[]>();
    tagRelations.forEach(relation => {
      const articleId = relation.articles_id;
      const tagId = relation.tags_id;
      
      if (!articleTagsMap.has(articleId)) {
        articleTagsMap.set(articleId, []);
      }
      
      articleTagsMap.get(articleId)?.push(tagId);
    });
    
    // Enrich articles with tag names
    const enrichedArticles = await Promise.all(sortedArticles.map(async (article) => {
      // Get tag IDs for this article
      const tagIds = articleTagsMap.get(article.id) || [];
      
      // Convert tag IDs to tag names
      const tagNames = await getTagNamesByIds(tagIds, allTags);
      
      return {
        ...article,
        tagNames
      };
    }));
    
    return NextResponse.json({ articles: enrichedArticles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
} 