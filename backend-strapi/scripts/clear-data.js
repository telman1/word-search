/**
 * Clear all Word Entries, Books, and Translators from the database.
 * Run: node scripts/clear-data.js
 * 
 * Requires: cd backend-strapi first, and Strapi env must be loadable.
 */

const { createStrapi } = require('@strapi/strapi');

async function clearData() {
  const app = createStrapi();
  await app.load();

  try {
    // Delete all word entries first (they reference book and translator)
    const entries = await app.entityService.findMany('api::word-entry.word-entry', {});
    for (const e of entries) {
      await app.entityService.delete('api::word-entry.word-entry', e.id);
    }
    console.log(`Deleted ${entries.length} word entries.`);

    // Delete all books
    const books = await app.entityService.findMany('api::book.book', {});
    for (const b of books) {
      await app.entityService.delete('api::book.book', b.id);
    }
    console.log(`Deleted ${books.length} books.`);

    // Delete all translators
    const translators = await app.entityService.findMany('api::translator.translator', {});
    for (const t of translators) {
      await app.entityService.delete('api::translator.translator', t.id);
    }
    console.log(`Deleted ${translators.length} translators.`);

    console.log('Clear complete.');
    await app.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await app.destroy();
    process.exit(1);
  }
}

clearData();
