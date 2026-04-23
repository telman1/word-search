/**
 * Point every word-entry at the current phase: Foucault, «Գիտելիքի հնագիտություն», Karoyan.
 * Run: node scripts/backfill-word-entries-phase.js
 */
const { createStrapi } = require('@strapi/strapi');
const {
  ensureCanonicalCatalog,
  getPhaseWordEntryRelationIds,
} = require('../config/ensure-canonical-catalog');

async function main() {
  const app = createStrapi();
  await app.load();
  try {
    await ensureCanonicalCatalog(app);
    const { authorId, bookId, translatorId } = await getPhaseWordEntryRelationIds(app);
    const entries = await app.entityService.findMany('api::word-entry.word-entry', {
      fields: ['id'],
    });
    for (const e of entries) {
      await app.entityService.update('api::word-entry.word-entry', e.id, {
        data: {
          book: bookId,
          authors: [authorId],
          translators: [translatorId],
        },
      });
    }
    console.log('Backfill complete:', entries.length, 'word-entries');
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
