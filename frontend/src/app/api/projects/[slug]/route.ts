import { getProjectBySlug } from '@/lib/projects';
import { getTags, getTagNamesByIds } from '@/lib/tags';
import { NextResponse } from 'next/server';

interface ProjectParams {
  slug: string;
}

export async function GET(
  request: Request, 
  { params }: { params: Promise<ProjectParams> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    const project = await getProjectBySlug(slug, locale);
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Fetch tag names if the project has tags
    if (project.tags && Array.isArray(project.tags) && project.tags.length > 0) {
      const allTags = await getTags();
      const tagNames = await getTagNamesByIds(project.tags, allTags);
      
      // Add tag names to the project
      return NextResponse.json({ 
        project: {
          ...project,
          tagNames
        } 
      });
    }
    
    return NextResponse.json({ project });
  } catch (error) {
    let errorSlug = '';
    try {
      const paramsObj = await params;
      errorSlug = paramsObj.slug;
    } catch (e) {
      // Fallback if we can't get the slug
    }
    
    console.error(`Error fetching project ${errorSlug}:`, error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
} 