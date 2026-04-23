'use strict';

/**
 * word-entry controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const UID = 'api::word-entry.word-entry';

module.exports = createCoreController(UID, ({ strapi }) => ({
  /**
   * GET /api/word-entries/:id/neighbors
   * Next / previous in ascending internal id order (same as default list sort in admin).
   */
  async neighbors(ctx) {
    const { id: documentId } = ctx.params;
    if (!documentId) {
      return ctx.badRequest('Missing document id');
    }

    const current = await strapi.documents(UID).findOne({ documentId });
    if (!current) {
      return ctx.notFound('Word entry not found');
    }

    const internalId = current.id;
    const nextList = await strapi.entityService.findMany(UID, {
      fields: ['documentId', 'id'],
      filters: { id: { $gt: internalId } },
      sort: { id: 'asc' },
      limit: 1,
    });
    const prevList = await strapi.entityService.findMany(UID, {
      fields: ['documentId', 'id'],
      filters: { id: { $lt: internalId } },
      sort: { id: 'desc' },
      limit: 1,
    });

    const next = nextList[0];
    const prev = prevList[0];

    return {
      data: {
        nextDocumentId: next?.documentId ?? null,
        prevDocumentId: prev?.documentId ?? null,
        sortBy: 'id',
      },
    };
  },
}));
