/**
 * home-page router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::home-page.home-page', {
    config: {
        find: {
            middlewares: ["api::home-page.populate-homepage"],
        },
        findOne: {
            middlewares: ["api::home-page.populate-homepage"],
        },
    },
});
