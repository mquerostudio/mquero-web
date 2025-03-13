import { createDirectus, rest } from '@directus/sdk';

// Use the provided Directus API endpoint
const apiUrl = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_DIRECTUS_API_ENDPOINT || 'https://tardis.mquero.com' 
  : process.env.DIRECTUS_API_ENDPOINT || 'https://tardis.mquero.com';

const directus = createDirectus(apiUrl).with(rest());

export default directus; 