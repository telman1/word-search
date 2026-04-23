/**
 * Normalized display helpers for Strapi word-entry (multi authors/translators/POS).
 */

/** @param {object} entry */
export function getEntryAuthors(entry) {
  const list = entry?.authors
  if (Array.isArray(list) && list.length) return list
  const bookAuthor = entry?.book?.author
  return bookAuthor ? [bookAuthor] : []
}

/** @param {object} entry */
export function getEntryTranslators(entry) {
  const list = entry?.translators
  return Array.isArray(list) ? list : []
}

/** @param {{ nameArmenian?: string, nameOriginalLanguage?: string }[]} people */
export function formatPersonList(people) {
  return people
    .map((p) => {
      const orig = p.nameOriginalLanguage ? ` (${p.nameOriginalLanguage})` : ''
      return `${p.nameArmenian || ''}${orig}`.trim()
    })
    .filter(Boolean)
    .join('; ')
}

/** @param {object} entry */
export function getPartOfSpeechValues(entry) {
  const items = entry?.partOfSpeeches
  if (!Array.isArray(items) || !items.length) return []
  return items.map((i) => i?.value).filter(Boolean)
}

/** @param {object} entry */
export function getPluralFormationValues(entry) {
  const items = entry?.pluralFormations
  if (!Array.isArray(items) || !items.length) return []
  return items.map((i) => i?.value).filter(Boolean)
}
