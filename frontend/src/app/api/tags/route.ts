import { getTags, getArticleTagRelations } from '@/lib/tags';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'get-relations') {
      const relations = await getArticleTagRelations();
      return NextResponse.json({ relations });
    }
    
    // Default: get all tags
    const tags = await getTags();
    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
} 