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
 * 1. Ensure the canonical catalog exists and wire every line to the current phase
 *    (Միշել Ֆուկո — Գիտելիքի հնագիտություն — Նազարեթ Կարոյան)
 * 2. Parse each line, split on – or -
 * 3. Create Word Entries (Eastern Armenian + Original only, rest empty)
 */

const fs = require('fs');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');
const {
  ensureCanonicalCatalog,
  getPhaseWordEntryRelationIds,
} = require('../config/ensure-canonical-catalog');

const SEPARATORS = [' – ', ' - ', ' — ', ' –', '- '];

async function importFromFile(filePath, originalLanguageType = 'french') {
  const app = createStrapi();
  await app.load();

  try {
    const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

    await ensureCanonicalCatalog(app);
    const { bookId, translatorId, authorId } = await getPhaseWordEntryRelationIds(app);
    console.log('Using phase catalog: book id', bookId, 'translator', translatorId, 'author', authorId);

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
          translators: [translatorId],
          authors: [authorId],
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
