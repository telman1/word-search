/**
 * Build Strapi 5 REST query strings. No `qs` dependency — avoids bundler chunk
 * resolution issues (e.g. missing ./611.js) and keeps bracket keys unencoded.
 * @see https://docs.strapi.io/dev-docs/api/rest/parameters
 */

export const WORD_SEARCH_PAGE_SIZE = 30

const STABLE_PAGINATION_SORT = { sort: ['id:asc'] }

const WORD_ENTRY_POPULATE = {
  populate: {
    translators: true,
    authors: true,
    partOfSpeeches: true,
    pluralFormations: true,
    book: {
      // populate[book][populate]=* — nested relations on Book (incl. author) without naming keys
      // (avoids prod 400s from strict validation on populate[book][populate][author]=…).
      populate: '*',
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
/**
 * @param {string} searchQuery
 * @param {{ page: number, pageSize?: number }} [pagination]
 */
export function buildHomeWordSearchQuery(searchQuery, pagination) {
  const pageSize = pagination?.pageSize ?? WORD_SEARCH_PAGE_SIZE
  const page = Math.max(1, pagination?.page ?? 1)
  return stringifyStrapi({
    filters: {
      $or: [
        { wordUnitEasternArmenian: { $containsi: searchQuery } },
        { wordUnitWesternArmenian: { $containsi: searchQuery } },
        { suggestedEquivalentArmenian: { $containsi: searchQuery } },
        { wordUnitOriginalLanguage: { $containsi: searchQuery } },
        { suggestedEquivalentOriginal: { $containsi: searchQuery } },
        { translatorCommentary: { $containsi: searchQuery } },
        { wordMeaningSense: { $containsi: searchQuery } },
        { contextualPassageArmenian: { $containsi: searchQuery } },
        { contextualPassageOriginal: { $containsi: searchQuery } },
      ],
    },
    ...STABLE_PAGINATION_SORT,
    pagination: { page, pageSize },
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
 * @param {{ page: number, pageSize?: number }} [pagination]
 */
export function buildEnhancedWordEntriesQuery(values, pagination) {
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
    filters.authors = authorFilters
  }
  if (Object.keys(bookFilters).length > 0) {
    filters.book = bookFilters
  }

  const translatorFilters = {}
  if (trAm) translatorFilters.nameArmenian = { $containsi: trAm }
  if (trOrig) translatorFilters.nameOriginalLanguage = { $containsi: trOrig }
  if (Object.keys(translatorFilters).length > 0) {
    filters.translators = translatorFilters
  }

  const pageSize = pagination?.pageSize ?? WORD_SEARCH_PAGE_SIZE
  const page = Math.max(1, pagination?.page ?? 1)

  return stringifyStrapi({
    filters,
    ...STABLE_PAGINATION_SORT,
    pagination: { page, pageSize },
    ...WORD_ENTRY_POPULATE,
  })
}
