/**
 * global router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::global.global', {
    config: {
        find: {
            middlewares: ["api::global.populate-global"],
        },
        findOne: {
            middlewares: ["api::global.populate-global"],
        },
    },
});
