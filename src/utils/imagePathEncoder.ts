/**
 * Encodes image paths to handle special characters (spaces, quotes, etc.)
 * This is necessary for Next.js Image component to work correctly in production
 * 
 * @param imagePath - The image path that may contain special characters
 * @returns The encoded image path with filename properly URL encoded
 */
export function encodeImagePath(imagePath: string | null | undefined): string {
  if (!imagePath) return '';
  
  // Split path into parts
  const pathParts = imagePath.split('/');
  const filename = pathParts.pop() || '';
  
  // Only encode the filename part, keep the directory structure intact
  const encodedFilename = encodeURIComponent(filename);
  
  return [...pathParts, encodedFilename].join('/');
}

