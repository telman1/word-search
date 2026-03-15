'use strict';

/**
 * word-entry service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::word-entry.word-entry');
