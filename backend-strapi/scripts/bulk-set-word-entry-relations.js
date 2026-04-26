/**
 * Set book, authors, and translators for every Word Entry to the Foucault / Karoyan / Archaeology
 * of Knowledge catalog (same strings as config/canonical-catalog.js).
 *
 * Book title matches either canonical `Գիտելիքի հնագիտությանը` or the alias `Գիտելիքի հնագիտություն`.
 *
 * Run from backend-strapi (or: npm run set-word-entry-relations):
 *   node scripts/bulk-set-word-entry-relations.js
 *
 * Idempotent: safe to re-run if the process stops mid-way. Requires a working DB connection;
 * on remote hosts (e.g. Neon) use a stable network and wait for Strapi to finish bootstrapping.
 */

const { createStrapi } = require('@strapi/strapi');
const { CANONICAL_TRANSLATOR, CANONICAL_BOOKS } = require('../config/canonical-catalog');

const AUTHOR_NAME_AM = 'Միշել Ֆուկո';
/** First entry in CANONICAL_BOOKS is Foucault's *Archaeology of Knowledge* in Armenian. */
const FOUCAULT_BOOK = CANONICAL_BOOKS[0];
const BOOK_NAME_ALIASES = [FOUCAULT_BOOK.nameArmenian, 'Գիտելիքի հնագիտություն'];

const PAGE = 200;

async function findFirstBook(app) {
  /** Prefer db.query for lookups (avoids document layer edge cases on some DBs). */
  for (const name of [...new Set(BOOK_NAME_ALIASES)]) {
    const book = await app.db.query('api::book.book').findOne({
      where: { nameArmenian: name },
    });
    if (book) return book;
  }
  return null;
}

async function run() {
  const app = createStrapi();
  await app.load();

  try {
    console.log('Resolving author, translator, and book from the database...');
    const authorRow = await app.db.query('api::author.author').findOne({
      where: { nameArmenian: AUTHOR_NAME_AM },
    });
    if (!authorRow) {
      console.error(`Author not found: nameArmenian = "${AUTHOR_NAME_AM}". Create it or run bootstrap.`);
      process.exit(1);
    }

    const translatorRow = await app.db.query('api::translator.translator').findOne({
      where: { nameArmenian: CANONICAL_TRANSLATOR.nameArmenian },
    });
    if (!translatorRow) {
      console.error(
        `Translator not found: nameArmenian = "${CANONICAL_TRANSLATOR.nameArmenian}". Create it or run bootstrap.`
      );
      process.exit(1);
    }

    const book = await findFirstBook(app);
    if (!book) {
      console.error(
        `Book not found for names: ${JSON.stringify(BOOK_NAME_ALIASES)}. Create it or run bootstrap.`
      );
      process.exit(1);
    }

    const authorId = authorRow.id;
    const translatorId = translatorRow.id;
    const bookId = book.id;

    const uid = 'api::word-entry.word-entry';
    const pageSize = PAGE;
    let updated = 0;
    let page = 1;

    for (;;) {
      const { results, pagination } = await app.db.query(uid).findPage({ page, pageSize });
      if (!results.length) break;

      for (const e of results) {
        await app.entityService.update(uid, e.id, {
          data: {
            book: bookId,
            authors: [authorId],
            translators: [translatorId],
          },
        });
        updated++;
      }

      console.log(
        `Page ${page}/${Math.max(1, pagination.pageCount)} (${updated} word entries updated so far).`
      );
      if (page >= pagination.pageCount) break;
      page += 1;
    }

    console.log(
      `Updated ${updated} word entries → book: "${book.nameArmenian}" (id ${bookId}), author: ${AUTHOR_NAME_AM} (id ${authorId}), translator: ${CANONICAL_TRANSLATOR.nameArmenian} (id ${translatorId}).`
    );
    await app.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await app.destroy();
    process.exit(1);
  }
}

run();
