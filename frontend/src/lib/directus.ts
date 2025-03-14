import { createDirectus, rest } from '@directus/sdk';

export interface ItemsQuery {
  fields?: Array<string>;
}

export const directus = createDirectus('https://tardis.mquero.com/').with(rest());
