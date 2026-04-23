const path = require('path');
const fs = require('fs');
const {
  CANONICAL_AUTHORS,
  CANONICAL_BOOKS,
  CANONICAL_TRANSLATOR,
} = require('../config/canonical-catalog');

const PDF_SEPARATORS = [' – ', ' - ', ' — ', ' –', '- ', '– ', '–'];

async function findAuthorByArmenianName(nameArmenian) {
  const rows = await strapi.entityService.findMany('api::author.author', {
    filters: { nameArmenian: { $eq: nameArmenian } },
    limit: 1,
  });
  return rows[0] || null;
}

async function ensureCanonicalCatalog() {
  const authorByName = new Map();
  for (const a of CANONICAL_AUTHORS) {
    let row = await findAuthorByArmenianName(a.nameArmenian);
    if (!row) {
      row = await strapi.entityService.create('api::author.author', { data: { ...a } });
      console.log('Canonical catalog: created author', a.nameArmenian);
    }
    authorByName.set(a.nameArmenian, row);
  }

  for (const b of CANONICAL_BOOKS) {
    const author = authorByName.get(b.authorNameArmenian);
    if (!author) {
      console.warn('Canonical catalog: missing author for book', b.nameArmenian, b.authorNameArmenian);
      continue;
    }
    const existing = await strapi.entityService.findMany('api::book.book', {
      filters: { nameArmenian: { $eq: b.nameArmenian } },
      limit: 1,
    });
    if (existing.length) continue;
    await strapi.entityService.create('api::book.book', {
      data: {
        nameArmenian: b.nameArmenian,
        nameOriginalLanguage: b.nameOriginalLanguage,
        originalLanguageType: b.originalLanguageType,
        author: author.id,
      },
    });
    console.log('Canonical catalog: created book', b.nameArmenian);
  }

  let tr = await strapi.entityService.findMany('api::translator.translator', {
    filters: { nameArmenian: { $eq: CANONICAL_TRANSLATOR.nameArmenian } },
    limit: 1,
  });
  if (!tr.length) {
    await strapi.entityService.create('api::translator.translator', {
      data: { ...CANONICAL_TRANSLATOR },
    });
    console.log('Canonical catalog: created translator', CANONICAL_TRANSLATOR.nameArmenian);
  }
}

module.exports = async () => {
  // Optional: Clear all data and import from PDF-style text file
  // Set CLEAR_AND_IMPORT_PDF=1 and optionally IMPORT_FILE=./data/words.txt
  if (process.env.CLEAR_AND_IMPORT_PDF === '1') {
    const importPath = process.env.IMPORT_FILE || path.join(__dirname, '..', 'data', 'sample-import.txt');
    const lang = process.env.IMPORT_LANG || 'french';
    try {
      // Delete all word entries
      const entries = await strapi.entityService.findMany('api::word-entry.word-entry', {});
      for (const e of entries) await strapi.entityService.delete('api::word-entry.word-entry', e.id);
      // Delete books and translators
      const books = await strapi.entityService.findMany('api::book.book', {});
      const translators = await strapi.entityService.findMany('api::translator.translator', {});
      const authors = await strapi.entityService.findMany('api::author.author', {});
      for (const b of books) await strapi.entityService.delete('api::book.book', b.id);
      for (const t of translators) await strapi.entityService.delete('api::translator.translator', t.id);
      for (const a of authors) await strapi.entityService.delete('api::author.author', a.id);
      console.log('Cleared all data.');
      // Import from file
      if (fs.existsSync(importPath)) {
        const content = fs.readFileSync(importPath, 'utf-8');
        const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
        const author = await strapi.entityService.create('api::author.author', {
          data: { nameArmenian: 'PDF Ներմուծում', nameOriginalLanguage: 'PDF Import', originalLanguageType: lang }
        });
        const book = await strapi.entityService.create('api::book.book', {
          data: { nameArmenian: 'PDF Ներմուծում', nameOriginalLanguage: 'PDF Import', originalLanguageType: lang, author: author.id }
        });
        const translator = await strapi.entityService.create('api::translator.translator', {
          data: { nameArmenian: 'PDF Ներմուծում', nameOriginalLanguage: 'PDF Import', originalLanguageType: lang }
        });
        let count = 0;
        for (const line of lines) {
          let left = '', right = '';
          for (const sep of PDF_SEPARATORS) {
            if (line.includes(sep)) {
              const idx = line.indexOf(sep);
              left = line.slice(0, idx).trim();
              right = line.slice(idx + sep.length).trim();
              break;
            }
          }
          if (left && right) {
            await strapi.entityService.create('api::word-entry.word-entry', {
              data: {
                wordUnitEasternArmenian: left,
                wordUnitOriginalLanguage: right,
                originalLanguageType: lang,
                book: book.id,
                translators: [translator.id],
                authors: [author.id],
              },
            });
            count++;
          }
        }
        console.log(`Imported ${count} entries from ${importPath}.`);
      }
    } catch (err) {
      console.error('Clear/import error:', err);
    }
  }

  // Grant Public role read access to WordEntry, Book, Translator APIs (fixes 403 Forbidden)
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' }
  });
  if (publicRole) {
    const actionsToAllow = [
      'api::word-entry.word-entry.find',
      'api::word-entry.word-entry.findOne',
      'api::book.book.find',
      'api::book.book.findOne',
      'api::translator.translator.find',
      'api::translator.translator.findOne',
      'api::author.author.find',
      'api::author.author.findOne'
    ];
    const existingPermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
      where: { role: publicRole.id }
    });
    const existingActions = new Set(existingPermissions.map(p => p.action));
    for (const action of actionsToAllow) {
      if (!existingActions.has(action)) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id }
        });
        console.log('Granted Public role permission:', action);
      }
    }
  }

  await ensureCanonicalCatalog();

  // Check if we already have word entries
  const wordEntryCount = await strapi.entityService.count('api::word-entry.word-entry');
  
  if (wordEntryCount > 0) {
    console.log('Data already exists, skipping bootstrap...');
    return;
  }

  console.log('Bootstrapping sample data...');

  const sampleBookRows = await strapi.entityService.findMany('api::book.book', {
    filters: { nameArmenian: { $eq: 'Գիտելիքի հնագիտությունը' } },
    limit: 1,
    populate: { author: true },
  });
  const sampleTrRows = await strapi.entityService.findMany('api::translator.translator', {
    filters: { nameArmenian: { $eq: CANONICAL_TRANSLATOR.nameArmenian } },
    limit: 1,
  });
  const book = sampleBookRows[0];
  const translator = sampleTrRows[0];
  const author = book.author && typeof book.author === 'object' ? book.author : null;
  const authorId = author?.id ?? book.author;
  if (!book || !translator || authorId == null) {
    console.error('Bootstrap: canonical book, author, or translator missing; cannot create sample word entries.');
    return;
  }

  // Sample word entries
  const wordEntries = [
    {
      wordUnitEasternArmenian: 'տուն',
      wordUnitWesternArmenian: 'տուն',
      wordUnitOriginalLanguage: 'house',
      suggestedEquivalentArmenian: 'տան',
      suggestedEquivalentOriginal: 'home',
      translatorCommentary: 'Sample commentary',
      wordMeaningSense: 'A building for human habitation',
      contextualPassageArmenian: 'Ես ապրում եմ գեղեցիկ տան մեջ:',
      contextualPassageOriginal: 'I live in a beautiful house.',
      originalLanguageType: 'english',
      partOfSpeeches: [{ value: 'գոյական' }],
      possessiveCompositionForm: 'եր',
    },
    {
      wordUnitEasternArmenian: 'տուն',
      wordUnitWesternArmenian: 'տուն',
      wordUnitOriginalLanguage: 'home',
      suggestedEquivalentArmenian: 'տան',
      suggestedEquivalentOriginal: 'home',
      contextualPassageArmenian: 'Բարի վերադարձ տուն:',
      contextualPassageOriginal: 'Welcome home!',
      originalLanguageType: 'english',
      partOfSpeeches: [{ value: 'գոյական' }],
      possessiveCompositionForm: 'ներ',
    },
    {
      wordUnitEasternArmenian: 'տուն',
      wordUnitWesternArmenian: 'տուն',
      wordUnitOriginalLanguage: 'maison',
      suggestedEquivalentArmenian: 'տուն',
      suggestedEquivalentOriginal: 'maison',
      contextualPassageArmenian: 'Սա մեծ տուն է:',
      contextualPassageOriginal: 'C\'est une grande maison.',
      originalLanguageType: 'french',
      partOfSpeeches: [{ value: 'գոյական' }],
      possessiveCompositionForm: 'իկ',
    },
  ];

  for (const entry of wordEntries) {
    await strapi.entityService.create('api::word-entry.word-entry', {
      data: {
        ...entry,
        book: book.id,
        translators: [translator.id],
        authors: [authorId],
      }
    });
    console.log('Created word entry:', entry.wordUnitOriginalLanguage, '->', entry.wordUnitEasternArmenian);
  }

  console.log('Bootstrap completed successfully!');
};
