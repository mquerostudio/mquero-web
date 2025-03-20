import { getProjectBySlug } from '@/lib/projects';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const project = await getProjectBySlug(slug);
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ project });
  } catch (error) {
    console.error(`Error fetching project ${params.slug}:`, error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
} 