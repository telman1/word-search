/**
 * Build Strapi 5 REST query strings. No `qs` dependency — avoids bundler chunk
 * resolution issues (e.g. missing ./611.js) and keeps bracket keys unencoded.
 * @see https://docs.strapi.io/dev-docs/api/rest/parameters
 */

const WORD_ENTRY_POPULATE = {
  populate: {
    translator: true,
    book: {
      populate: ['author'],
    },
  },
}

/** Same idea as qs.stringify(..., { encodeValuesOnly: true }) */
function stringifyStrapi(obj) {
  const parts = []
  function walk(prefix, val) {
    if (val === undefined || val === null) return
    if (typeof val === 'boolean') {
      parts.push(`${prefix}=${val ? 'true' : 'false'}`)
      return
    }
    if (typeof val !== 'object') {
      parts.push(`${prefix}=${encodeURIComponent(String(val))}`)
      return
    }
    if (Array.isArray(val)) {
      val.forEach((item, index) => {
        walk(`${prefix}[${index}]`, item)
      })
      return
    }
    for (const k of Object.keys(val)) {
      const key = prefix ? `${prefix}[${k}]` : k
      walk(key, val[k])
    }
  }
  walk('', obj)
  return parts.join('&')
}

/**
 * Strapi 5 REST: nested objects for filters + populate.
 * @see https://docs.strapi.io/dev-docs/api/rest/populate-select
 */
export function buildHomeWordSearchQuery(searchQuery) {
  return stringifyStrapi({
    filters: {
      $or: [
        { wordUnitEasternArmenian: { $containsi: searchQuery } },
        { wordUnitWesternArmenian: { $containsi: searchQuery } },
        { suggestedEquivalentArmenian: { $containsi: searchQuery } },
        { wordUnitOriginalLanguage: { $containsi: searchQuery } },
        { suggestedEquivalentOriginal: { $containsi: searchQuery } },
      ],
    },
    ...WORD_ENTRY_POPULATE,
  })
}

export function buildWordEntryDetailQuery() {
  return stringifyStrapi(WORD_ENTRY_POPULATE)
}

/**
 * @param {{
 *   easternArmenian: string,
 *   westernArmenian: string,
 *   originalLanguageWord: string,
 *   authorArmenian: string,
 *   authorOriginal: string,
 *   bookArmenian: string,
 *   bookOriginal: string,
 *   translatorArmenian: string,
 *   translatorOriginal: string,
 * }} values
 */
export function buildEnhancedWordEntriesQuery(values) {
  const ea = values.easternArmenian.trim()
  const wa = values.westernArmenian.trim()
  const orig = values.originalLanguageWord.trim()
  const authAm = values.authorArmenian.trim()
  const authOrig = values.authorOriginal.trim()
  const bookAm = values.bookArmenian.trim()
  const bookOrig = values.bookOriginal.trim()
  const trAm = values.translatorArmenian.trim()
  const trOrig = values.translatorOriginal.trim()

  const filters = {}
  if (ea) filters.wordUnitEasternArmenian = { $containsi: ea }
  if (wa) filters.wordUnitWesternArmenian = { $containsi: wa }
  if (orig) filters.wordUnitOriginalLanguage = { $containsi: orig }

  const authorFilters = {}
  if (authAm) authorFilters.nameArmenian = { $containsi: authAm }
  if (authOrig) authorFilters.nameOriginalLanguage = { $containsi: authOrig }

  const bookFilters = {}
  if (bookAm) bookFilters.nameArmenian = { $containsi: bookAm }
  if (bookOrig) bookFilters.nameOriginalLanguage = { $containsi: bookOrig }
  if (Object.keys(authorFilters).length > 0) {
    bookFilters.author = authorFilters
  }
  if (Object.keys(bookFilters).length > 0) {
    filters.book = bookFilters
  }

  const translatorFilters = {}
  if (trAm) translatorFilters.nameArmenian = { $containsi: trAm }
  if (trOrig) translatorFilters.nameOriginalLanguage = { $containsi: trOrig }
  if (Object.keys(translatorFilters).length > 0) {
    filters.translator = translatorFilters
  }

  return stringifyStrapi({
    filters,
    ...WORD_ENTRY_POPULATE,
  })
}
