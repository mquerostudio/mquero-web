import { createDirectus, rest } from '@directus/sdk';

export interface ItemsQuery {
  fields?: Array<string>;
  filter?: Record<string, any>;
}

export const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_API_ENDPOINT || '').with(rest());
