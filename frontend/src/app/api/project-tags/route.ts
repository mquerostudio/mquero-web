import { getProjectTagRelations } from '@/lib/projects';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const relations = await getProjectTagRelations();
    return NextResponse.json({ relations });
  } catch (error) {
    console.error('Error fetching project-tag relations:', error);
    return NextResponse.json({ error: 'Failed to fetch project-tag relations' }, { status: 500 });
  }
} 