import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle URL-encoded wearable image paths
  // Example: /wearables/bodys/Blazing%20Flame.png -> /wearables/bodys/Blazing Flame.png
  if (pathname.startsWith('/wearables/')) {
    const wearableMatch = pathname.match(/^\/wearables\/([^/]+)\/(.+)$/);
    
    if (wearableMatch) {
      const [, category, encodedFilename] = wearableMatch;
      const validCategories = ['backgrounds', 'bodys', 'eyes', 'hands', 'heads', 'clothes', 'faces', 'mouths'];
      
      if (validCategories.includes(category)) {
        // Check if filename is URL encoded
        try {
          const decodedFilename = decodeURIComponent(encodedFilename);
          
          // If decoding changed the filename, it was encoded - rewrite to decoded path
          if (decodedFilename !== encodedFilename) {
            const newPath = `/wearables/${category}/${decodedFilename}`;
            const url = request.nextUrl.clone();
            url.pathname = newPath;
            
            // Only rewrite if it's an image request
            const acceptHeader = request.headers.get('accept') || '';
            if (acceptHeader.includes('image') || pathname.endsWith('.png') || pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
              return NextResponse.rewrite(url);
            }
          }
        } catch (e) {
          // If decoding fails, continue with original path
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/wearables/:path*',
  ],
};

