'use strict';

/**
 * translator service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::translator.translator');

