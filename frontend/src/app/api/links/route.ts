import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { NextResponse } from 'next/server';

export interface LinkItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  position: string;
  color: string;
  featured: boolean | null;
  description: string | null;
}

export async function GET() {
  try {
    // Fetch links from Directus
    const links = await directus.request(readItems('links')) as unknown as LinkItem[];
    
    // Sort links by position
    const sortedLinks = [...links].sort((a, b) => {
      const posA = parseInt(a.position || '0');
      const posB = parseInt(b.position || '0');
      return posA - posB;
    });
    
    return NextResponse.json({ data: sortedLinks });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
} 