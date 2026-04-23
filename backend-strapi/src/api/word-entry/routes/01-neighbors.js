'use strict';

/**
 * Sibling entries by internal id — order is stable and matches "creation order" by id.
 * Registered before the generic :id findOne route so it does not shadow this path.
 */
module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/word-entries/:id/neighbors',
      handler: 'api::word-entry.word-entry.neighbors',
      config: {
        auth: false,
      },
    },
  ],
};
