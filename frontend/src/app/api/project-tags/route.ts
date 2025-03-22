import { getProjectTagRelations } from '@/lib/projects';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project');
    
    const relations = await getProjectTagRelations();
    
    // If a project ID is provided, filter by that project
    const filteredRelations = projectId
      ? relations.filter(relation => relation.projects_id === projectId)
      : relations;
    
    return NextResponse.json({ relations: filteredRelations });
  } catch (error) {
    console.error('Error fetching project-tag relations:', error);
    return NextResponse.json({ error: 'Failed to fetch project-tag relations' }, { status: 500 });
  }
} 