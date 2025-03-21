import { getProjectBySlug } from '@/lib/projects';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ project });
  } catch (error) {
    let slug = '';
    try {
      slug = (await params).slug;
    } catch (e) {
      // Fallback if we can't get the slug
    }
    
    console.error(`Error fetching project ${slug}:`, error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
} 