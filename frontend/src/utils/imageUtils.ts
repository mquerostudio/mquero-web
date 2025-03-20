/**
 * Utility functions for working with Directus images
 */

export interface DirectusImageOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'inside' | 'outside';
  quality?: number;
  format?: 'jpg' | 'png' | 'webp' | 'tiff';
  withoutEnlargement?: boolean;
}

/**
 * Generates a URL for a Directus asset with optional transformations
 * 
 * @param assetId - The Directus asset ID
 * @param options - Transformation options following Directus API
 * @param placeholderImage - Fallback image URL if assetId is not provided
 * @returns The complete URL to the transformed image
 * 
 * @see https://docs.directus.io/reference/files.html for all available options
 */
export function getDirectusImageUrl(
  assetId?: string, 
  options?: DirectusImageOptions,
  placeholderImage: string = '/placeholder-image.jpg'
): string {
  if (!assetId) return placeholderImage;
  
  const apiEndpoint = process.env.NEXT_PUBLIC_DIRECTUS_API_ENDPOINT || 'https://tardis.mquero.com';
  let url = `${apiEndpoint}/assets/${assetId}`;
  
  // Add transformation parameters
  if (options) {
    const params = new URLSearchParams();
    
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.fit) params.append('fit', options.fit);
    if (options.quality) params.append('quality', options.quality.toString());
    if (options.format) params.append('format', options.format);
    if (options.withoutEnlargement !== undefined) {
      params.append('withoutEnlargement', options.withoutEnlargement.toString());
    }
    
    const paramsString = params.toString();
    if (paramsString) {
      url += `?${paramsString}`;
    }
  }
  
  return url;
}

/**
 * Predefined image transformations for common use cases
 */
export const ImagePresets = {
  /**
   * For thumbnail sized images in cards/lists
   */
  thumbnail: {
    width: 400,
    height: 300,
    fit: 'cover' as const,
    quality: 80,
    format: 'webp' as const
  },
  
  /**
   * For featured/hero images
   */
  featured: {
    width: 1200,
    height: 800,
    fit: 'cover' as const,
    quality: 90,
    format: 'webp' as const
  },
  
  /**
   * For profile/avatar images
   */
  avatar: {
    width: 80,
    height: 80,
    fit: 'cover' as const,
    quality: 85,
    format: 'webp' as const
  }
}; 