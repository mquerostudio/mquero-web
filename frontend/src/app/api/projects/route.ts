import { getProjectsWithTranslations } from '@/lib/projects';
import { getTags, getTagNamesByIds } from '@/lib/tags';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    // Fetch projects with translations for the current locale
    const projects = await getProjectsWithTranslations(locale);

    // Sort projects by date (newest first)
    const sortedProjects = [...projects].sort((a, b) => {
      return new Date(b.date_created || '').getTime() - new Date(a.date_created || '').getTime();
    });
    
    // Fetch all tags for enriching the response with tag names
    const allTags = await getTags();
    
    // Enrich projects with tag names
    const enrichedProjects = await Promise.all(sortedProjects.map(async (project) => {
      // Get tag IDs for this project
      const tagIds = project.tags || [];
      
      // Convert tag IDs to tag names
      const tagNames = await getTagNamesByIds(tagIds, allTags);
      
      return {
        ...project,
        tagNames
      };
    }));
    
    return NextResponse.json({ projects: enrichedProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
} 