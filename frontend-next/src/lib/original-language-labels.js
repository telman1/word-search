/** Strapi `originalLanguageType` enum → English name and Armenian name (bilingual line). */
const ORIGINAL_LANGUAGE_BILINGUAL = {
  english: { en: 'english', hy: 'անգլերեն' },
  french: { en: 'french', hy: 'ֆրանսերեն' },
  german: { en: 'german', hy: 'գերմաներեն' },
  italian: { en: 'italian', hy: 'իտալերեն' },
  other: { en: 'other', hy: 'այլ' },
}

/**
 * @param {string | null | undefined} code
 * @returns {string} e.g. "french - ֆրանսերեն", or the raw code if unknown
 */
export function formatOriginalLanguageBilingual(code) {
  if (code == null || code === '') return ''
  const key = String(code).toLowerCase()
  const row = ORIGINAL_LANGUAGE_BILINGUAL[key]
  if (!row) return String(code)
  return `${row.en} - ${row.hy}`
}
