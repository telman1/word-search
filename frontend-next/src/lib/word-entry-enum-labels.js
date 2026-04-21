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

export const POSSESSIVE_FORM_VALUES = ['եր', 'ներ', 'իկ', 'այք', 'ինք', 'ք']

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
 * @param {string | undefined} value
 * @param {'en' | 'hy'} language
 * @param {(key: string) => string} t
 */
export function labelPossessiveForm(value, language, t) {
  if (!value) return ''
  if (language === 'en') {
    const k = `word.enumPossessive.${value}`
    const out = t(k)
    return out !== k ? out : value
  }
  return value
}
