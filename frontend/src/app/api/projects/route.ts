import { getProjects, getProjectPostRelations } from '@/lib/projects';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'get-relations') {
      const relations = await getProjectPostRelations();
      return NextResponse.json({ relations });
    }
    
    // Default: get projects
    const projects = await getProjects({
      fields: ['slug', 'title', 'body', 'summary', 'cover', 'date_created', 'projects', 'tags', 'status']
    });

    // Filter published projects
    const publishedProjects = Array.isArray(projects) 
      ? projects.filter(project => project.status === 'published')
      : [];

    // Sort projects by date (newest first)
    const sortedProjects = [...publishedProjects].sort((a, b) => {
      return new Date(b.date_created || '').getTime() - new Date(a.date_created || '').getTime();
    });
    
    return NextResponse.json({ projects: sortedProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
} 