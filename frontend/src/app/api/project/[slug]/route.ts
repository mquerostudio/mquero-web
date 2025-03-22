import { getProjectBySlug } from '@/lib/projects';
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
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }
    
    const project = await getProjectBySlug(slug, locale);
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
} 