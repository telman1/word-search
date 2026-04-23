/** Mirrors backend-strapi word-entry enumeration values */

export const PART_OF_SPEECH_VALUES = [
  'գոյական',
  'ածական',
  'թվական',
  'դերանուն',
  'բայ',
  'մակբայ',
  'կապ',
  'շաղկապ',
  'վերաբերական',
  'ձայնարկություն',
]

export const PLURAL_FORMATION_VALUES = ['եր', 'ներ', 'իկ', 'այք', 'ինք', 'ք']

/**
 * @param {string | undefined} value
 * @param {'en' | 'hy'} language
 * @param {(key: string) => string} t
 */
export function labelPartOfSpeech(value, language, t) {
  if (!value) return ''
  if (language === 'en') {
    const k = `word.enumPartOfSpeech.${value}`
    const out = t(k)
    return out !== k ? out : value
  }
  return value
}

/**
 * @param {string[]} values
 * @param {'en' | 'hy'} language
 * @param {(key: string) => string} t
 */
export function formatPartOfSpeechList(values, language, t) {
  if (!values?.length) return ''
  return values
    .map((v) => labelPartOfSpeech(v, language, t))
    .filter(Boolean)
    .join(', ')
}

/**
 * @param {string | undefined} value
 * @param {'en' | 'hy'} language
 * @param {(key: string) => string} t
 */
export function labelPluralFormation(value, language, t) {
  if (!value) return ''
  if (language === 'en') {
    const k = `word.enumPluralFormation.${value}`
    const out = t(k)
    return out !== k ? out : value
  }
  return value
}

/**
 * @param {string[] | undefined} values
 * @param {'en' | 'hy'} language
 * @param {(key: string) => string} t
 */
export function formatPluralFormationList(values, language, t) {
  if (!values?.length) return ''
  return values
    .map((v) => labelPluralFormation(v, language, t))
    .filter(Boolean)
    .join(', ')
}
