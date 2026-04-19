const path = require('path');
const fs = require('fs');

const PDF_SEPARATORS = [' – ', ' - ', ' — ', ' –', '- ', '– ', '–'];

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
              data: { wordUnitEasternArmenian: left, wordUnitOriginalLanguage: right, originalLanguageType: lang, book: book.id, translator: translator.id }
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

  // Check if we already have word entries
  const wordEntryCount = await strapi.entityService.count('api::word-entry.word-entry');
  
  if (wordEntryCount > 0) {
    console.log('Data already exists, skipping bootstrap...');
    return;
  }

  console.log('Bootstrapping sample data...');

  // Create sample Author
  const author = await strapi.entityService.create('api::author.author', {
    data: {
      nameArmenian: 'Օրինակ Հեղինակ',
      nameOriginalLanguage: 'Sample Author',
      originalLanguageType: 'english'
    }
  });
  console.log('Created author:', author.id);

  // Create sample Book (new schema)
  const book = await strapi.entityService.create('api::book.book', {
    data: {
      nameArmenian: 'Օրինակ Գիրք',
      nameOriginalLanguage: 'Sample Book',
      originalLanguageType: 'english',
      author: author.id
    }
  });
  console.log('Created book:', book.id);

  // Create sample Translator (new schema)
  const translator = await strapi.entityService.create('api::translator.translator', {
    data: {
      nameArmenian: 'Օրինակ Թարգմանիչ',
      nameOriginalLanguage: 'Sample Translator',
      originalLanguageType: 'english'
    }
  });
  console.log('Created translator:', translator.id);

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
      originalLanguageType: 'english'
    },
    {
      wordUnitEasternArmenian: 'տուն',
      wordUnitWesternArmenian: 'տուն',
      wordUnitOriginalLanguage: 'home',
      suggestedEquivalentArmenian: 'տան',
      suggestedEquivalentOriginal: 'home',
      contextualPassageArmenian: 'Բարի վերադարձ տուն:',
      contextualPassageOriginal: 'Welcome home!',
      originalLanguageType: 'english'
    },
    {
      wordUnitEasternArmenian: 'տուն',
      wordUnitWesternArmenian: 'տուն',
      wordUnitOriginalLanguage: 'maison',
      suggestedEquivalentArmenian: 'տուն',
      suggestedEquivalentOriginal: 'maison',
      contextualPassageArmenian: 'Սա մեծ տուն է:',
      contextualPassageOriginal: 'C\'est une grande maison.',
      originalLanguageType: 'french'
    }
  ];

  for (const entry of wordEntries) {
    await strapi.entityService.create('api::word-entry.word-entry', {
      data: {
        ...entry,
        book: book.id,
        translator: translator.id
      }
    });
    console.log('Created word entry:', entry.wordUnitOriginalLanguage, '->', entry.wordUnitEasternArmenian);
  }

  console.log('Bootstrap completed successfully!');
};
