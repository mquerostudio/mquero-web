/**
 * `populate-global` middleware
 */

import type { Core } from '@strapi/strapi';

const populate = {
  populate: [
    "header.logo.image",
    "header.headerLink",
    "footer.footerColumnOne.logo.image",
    "footer.footerColumnTwo",
    "footer.footerColumnThree.socialMedia.image"
  ]
}

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In populate-global middleware.');

    ctx.query = {
      ...ctx.query,
      ...populate
    }

    await next();
  };
};
