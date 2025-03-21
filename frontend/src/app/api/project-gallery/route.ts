import { getGalleryImagesByProjectSlug } from '@/lib/projects';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectSlug = searchParams.get('project');
    
    if (!projectSlug) {
      return NextResponse.json({ error: 'Project slug parameter is required' }, { status: 400 });
    }
    
    const galleryImages = await getGalleryImagesByProjectSlug(projectSlug);
    
    return NextResponse.json({ galleryImages });
  } catch (error) {
    console.error('Error fetching project gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch project gallery images' }, { status: 500 });
  }
} 