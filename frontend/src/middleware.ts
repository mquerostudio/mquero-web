import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Main middleware function
export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Handle redirect from mquero.es to mquero.com
  if (hostname.includes('mquero.es')) {
    // Create the new URL with mquero.com
    const newUrl = new URL(url.pathname + url.search, `https://mquero.com`);
    return NextResponse.redirect(newUrl);
  }

  // If not redirecting, continue with the internationalization middleware
  return intlMiddleware(request);
}

// Configure which paths should be processed by middleware
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or contain static files
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/', '/sitemap.xml']
};