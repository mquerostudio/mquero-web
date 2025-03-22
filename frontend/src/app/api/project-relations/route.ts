import { getProjectArticleRelations } from '@/lib/projects';
import { getArticlesWithTranslations } from '@/lib/posts';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project');
    const locale = searchParams.get('locale') || 'en';
    
    // Get all project-article relations
    const relations = await getProjectArticleRelations();
    
    // If a project ID is provided, filter by that project
    const filteredRelations = projectId
      ? relations.filter(relation => relation.projects_id === projectId)
      : relations;
    
    // If we need to return related articles, fetch them
    if (projectId) {
      // Get article IDs from relations
      const articleIds = filteredRelations.map(relation => relation.articles_id);
      
      // Fetch those articles with translations
      const articles = await getArticlesWithTranslations(locale);
      
      // Filter to only include related articles
      const relatedArticles = articles.filter(article => 
        articleIds.includes(article.id)
      );
      
      return NextResponse.json({ 
        relations: filteredRelations,
        relatedArticles
      });
    }
    
    // Default: just return relations
    return NextResponse.json({ relations: filteredRelations });
  } catch (error) {
    console.error('Error fetching project relations:', error);
    return NextResponse.json({ error: 'Failed to fetch project relations' }, { status: 500 });
  }
} 