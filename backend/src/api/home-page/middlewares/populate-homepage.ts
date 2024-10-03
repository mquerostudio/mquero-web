/**
 * `populate-homepage` middleware
 */

import type { Core } from '@strapi/strapi';

const populate = {
  populate: {
    blocks: {
      on: {
        'layout.hero-section': {
          populate: {
            image: {
              fields: ["url", "alternativeText", "height", "width"]
            },
            link: {
              populate: true
            }
          },
        },
        'layout.skill-section': {
          populate: "*",
        }
      }
    }
  }
}

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In populate-homepage middleware.');

    ctx.query = {
      ...ctx.query,
      ...populate
    };

    await next();
  };
};
