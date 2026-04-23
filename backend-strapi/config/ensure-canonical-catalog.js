const {
  CANONICAL_AUTHORS,
  CANONICAL_BOOKS,
  CANONICAL_TRANSLATOR,
} = require('./canonical-catalog');

async function findAuthorByArmenianName(strapi, nameArmenian) {
  const rows = await strapi.entityService.findMany('api::author.author', {
    filters: { nameArmenian: { $eq: nameArmenian } },
    limit: 1,
  });
  return rows[0] || null;
}

async function findBookByAuthorIdAndName(strapi, authorId, nameArmenian) {
  const rows = await strapi.entityService.findMany('api::book.book', {
    filters: {
      $and: [
        { author: { id: { $eq: authorId } } },
        { nameArmenian: { $eq: nameArmenian } },
      ],
    },
    limit: 1,
  });
  return rows[0] || null;
}

/**
 * Create missing authors, books, translator from canonical-catalog.
 * Renames legacy book titles in place (e.g. եր → bare form) when needed.
 */
async function ensureCanonicalCatalog(strapi) {
  const authorByName = new Map();
  for (const a of CANONICAL_AUTHORS) {
    let row = await findAuthorByArmenianName(strapi, a.nameArmenian);
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

    let row =
      (await findBookByAuthorIdAndName(strapi, author.id, b.nameArmenian)) || null;
    if (!row && b.legacyNameArmenian) {
      row = await findBookByAuthorIdAndName(strapi, author.id, b.legacyNameArmenian);
    }
    if (row) {
      if (b.legacyNameArmenian && row.nameArmenian === b.legacyNameArmenian) {
        await strapi.entityService.update('api::book.book', row.id, {
          data: { nameArmenian: b.nameArmenian },
        });
        console.log('Canonical catalog: renamed book', b.legacyNameArmenian, '->', b.nameArmenian);
      }
      continue;
    }

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

  const tr = await strapi.entityService.findMany('api::translator.translator', {
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

const BOOK_SPEC = CANONICAL_BOOKS[0]

/**
 * IDs for the current product phase: Foucault / Archaeology of Knowledge / Karoyan.
 * Call only after `ensureCanonicalCatalog` (e.g. Strapi bootstrap or import script).
 */
async function getPhaseWordEntryRelationIds(strapi) {
  const author = await findAuthorByArmenianName(strapi, BOOK_SPEC.authorNameArmenian);
  const translator = (
    await strapi.entityService.findMany('api::translator.translator', {
      filters: { nameArmenian: { $eq: CANONICAL_TRANSLATOR.nameArmenian } },
      limit: 1,
    })
  )[0];
  if (!author) {
    throw new Error(`Phase author missing: ${BOOK_SPEC.authorNameArmenian}`);
  }
  if (!translator) {
    throw new Error(`Phase translator missing: ${CANONICAL_TRANSLATOR.nameArmenian}`);
  }
  let book =
    (await findBookByAuthorIdAndName(strapi, author.id, BOOK_SPEC.nameArmenian)) || null;
  if (!book && BOOK_SPEC.legacyNameArmenian) {
    book = await findBookByAuthorIdAndName(strapi, author.id, BOOK_SPEC.legacyNameArmenian);
  }
  if (!book) {
    throw new Error(`Phase book missing: ${BOOK_SPEC.nameArmenian}`);
  }
  return { authorId: author.id, bookId: book.id, translatorId: translator.id };
}

module.exports = {
  ensureCanonicalCatalog,
  getPhaseWordEntryRelationIds,
}
