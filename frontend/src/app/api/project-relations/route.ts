import { getProjectPostRelations } from '@/lib/projects';
import { getPosts } from '@/lib/posts';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectSlug = searchParams.get('project');
    
    // Get all project-post relations
    const relations = await getProjectPostRelations();
    
    // If a project slug is provided, filter by that project
    const filteredRelations = projectSlug
      ? relations.filter(relation => relation.projects_slug === projectSlug)
      : relations;
    
    // If we need to return related posts, fetch them
    if (projectSlug) {
      // Get post slugs from relations
      const postSlugs = filteredRelations.map(relation => relation.posts_slug);
      
      // Fetch those posts
      const posts = await getPosts({
        fields: ['slug', 'title', 'summary', 'cover', 'date_created', 'tags', 'status'],
        filter: {
          _and: [
            { slug: { _in: postSlugs } },
            { status: { _eq: 'published' } }
          ]
        }
      });
      
      return NextResponse.json({ 
        relations: filteredRelations,
        relatedPosts: posts
      });
    }
    
    // Default: just return relations
    return NextResponse.json({ relations: filteredRelations });
  } catch (error) {
    console.error('Error fetching project relations:', error);
    return NextResponse.json({ error: 'Failed to fetch project relations' }, { status: 500 });
  }
} 