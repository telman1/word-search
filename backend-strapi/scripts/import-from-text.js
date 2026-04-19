/**
 * Import word entries from a text file.
 * Format: one line per entry, "easternArmenian – originalLanguage"
 * (Use en-dash – or hyphen - as separator)
 *
 * Run: node scripts/import-from-text.js <path-to-file> [originalLanguageType]
 *
 * Example:
 *   node scripts/import-from-text.js ./data/words.txt french
 *
 * The script will:
 * 1. Create a Book and Translator for import (if none exist)
 * 2. Parse each line, split on – or -
 * 3. Create Word Entries (Eastern Armenian + Original only, rest empty)
 */

const fs = require('fs');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

const SEPARATORS = [' – ', ' - ', ' — ', ' –', '- '];

async function importFromFile(filePath, originalLanguageType = 'french') {
  const app = createStrapi();
  await app.load();

  try {
    const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

    // Get or create Book and Translator
    let books = await app.entityService.findMany('api::book.book', {});
    let translators = await app.entityService.findMany('api::translator.translator', {});
    let authors = await app.entityService.findMany('api::author.author', {});

    if (authors.length === 0) {
      const author = await app.entityService.create('api::author.author', {
        data: {
          nameArmenian: 'PDF Ներմուծում',
          nameOriginalLanguage: 'PDF Import',
          originalLanguageType: originalLanguageType,
        },
      });
      authors = [author];
      console.log('Created default Author.');
    }

    if (books.length === 0) {
      const book = await app.entityService.create('api::book.book', {
        data: {
          nameArmenian: 'PDF Ներմուծում',
          nameOriginalLanguage: 'PDF Import',
          originalLanguageType: originalLanguageType,
          author: authors[0].id,
        },
      });
      books = [book];
      console.log('Created default Book.');
    }
    if (translators.length === 0) {
      const translator = await app.entityService.create('api::translator.translator', {
        data: {
          nameArmenian: 'PDF Ներմուծում',
          nameOriginalLanguage: 'PDF Import',
          originalLanguageType: originalLanguageType,
        },
      });
      translators = [translator];
      console.log('Created default Translator.');
    }

    const bookId = books[0].id;
    const translatorId = translators[0].id;

    let created = 0;
    let skipped = 0;

    for (const line of lines) {
      let left = '';
      let right = '';

      for (const sep of SEPARATORS) {
        if (line.includes(sep)) {
          const idx = line.indexOf(sep);
          left = line.slice(0, idx).trim();
          right = line.slice(idx + sep.length).trim();
          break;
        }
      }

      if (!left || !right) {
        console.warn('Skipped (no separator):', line.slice(0, 50));
        skipped++;
        continue;
      }

      await app.entityService.create('api::word-entry.word-entry', {
        data: {
          wordUnitEasternArmenian: left,
          wordUnitOriginalLanguage: right,
          originalLanguageType: originalLanguageType,
          book: bookId,
          translator: translatorId,
        },
      });
      created++;
      console.log(`  ${left} – ${right}`);
    }

    console.log(`\nImported ${created} entries, skipped ${skipped}.`);
    await app.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await app.destroy();
    process.exit(1);
  }
}

const filePath = process.argv[2];
const lang = process.argv[3] || 'french';

if (!filePath) {
  console.error('Usage: node scripts/import-from-text.js <path-to-file> [originalLanguageType]');
  console.error('Example: node scripts/import-from-text.js ./data/words.txt french');
  process.exit(1);
}

importFromFile(filePath, lang);
