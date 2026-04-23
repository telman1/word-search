'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import { buildEnhancedWordEntriesQuery } from '../../lib/strapi-query'
import { CURRENT_WORD_ENTRY_PHASE } from '../../lib/phase-defaults'
import { getEntryAuthors, getEntryTranslators } from '../../lib/word-entry-display'
import SearchInputWithKeyboard from '../../components/SearchInputWithKeyboard'

function armenianWordDisplay(entry) {
  const e = entry.wordUnitEasternArmenian || ''
  const w = entry.wordUnitWesternArmenian || ''
  if (e && w) return `${e} / ${w}`
  return e || w || ''
}

export default function EnhancedSearchPage() {
  const { t } = useLanguage()
  const initial = useMemo(() => {
    const p = CURRENT_WORD_ENTRY_PHASE
    return {
      easternArmenian: '',
      westernArmenian: '',
      originalLanguageWord: '',
      authorArmenian: p.authorNameArmenian,
      authorOriginal: p.authorNameOriginal,
      bookArmenian: p.bookNameArmenian,
      bookOriginal: p.bookNameOriginal,
      translatorArmenian: p.translatorNameArmenian,
      translatorOriginal: p.translatorNameOriginal,
    }
  }, [])
  const [form, setForm] = useState(initial)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    setLoading(true)
    setResults([])
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'
      const qs = buildEnhancedWordEntriesQuery(form)
      const url = `${apiBase}/api/word-entries?${qs}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch')
      }
      const data = await response.json()
      setResults(data.data || [])
      setSearched(true)
    } catch (err) {
      console.error(err)
      setError(t('enhancedSearch.errorSearch'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="enhanced-search-page">
      <div className="enhanced-search-header">
        <h1 className="enhanced-search-title">{t('enhancedSearch.title')}</h1>
        {/*<p className="enhanced-search-intro">{t('enhancedSearch.intro')}</p>*/}
      </div>

      <form className="enhanced-search-form search-container" onSubmit={handleSubmit}>
        <div className="enhanced-search-grid">
          <label className="enhanced-field">
            <span className="enhanced-field-label">{t('enhancedSearch.labelEastern')}</span>
            <SearchInputWithKeyboard
              type="text"
              className="search-input"
              value={form.easternArmenian}
              onChange={(e) => setField('easternArmenian', e.target.value)}
              placeholder={t('enhancedSearch.phEastern')}
              autoComplete="off"
            />
          </label>
          <label className="enhanced-field">
            <span className="enhanced-field-label">{t('enhancedSearch.labelWestern')}</span>
            <SearchInputWithKeyboard
              type="text"
              className="search-input"
              value={form.westernArmenian}
              onChange={(e) => setField('westernArmenian', e.target.value)}
              placeholder={t('enhancedSearch.phWestern')}
              autoComplete="off"
            />
          </label>
          <label className="enhanced-field enhanced-field-full">
            <span className="enhanced-field-label">{t('enhancedSearch.labelOriginalWord')}</span>
            <SearchInputWithKeyboard
              type="text"
              className="search-input"
              value={form.originalLanguageWord}
              onChange={(e) => setField('originalLanguageWord', e.target.value)}
              placeholder={t('enhancedSearch.phOriginalWord')}
              autoComplete="off"
            />
          </label>
          <label className="enhanced-field">
            <span className="enhanced-field-label">{t('enhancedSearch.labelAuthorAm')}</span>
            <SearchInputWithKeyboard
              type="text"
              className="search-input"
              value={form.authorArmenian}
              onChange={(e) => setField('authorArmenian', e.target.value)}
              placeholder={t('enhancedSearch.phAuthorAm')}
              autoComplete="off"
            />
          </label>
          <label className="enhanced-field">
            <span className="enhanced-field-label">{t('enhancedSearch.labelAuthorOrig')}</span>
            <SearchInputWithKeyboard
              type="text"
              className="search-input"
              value={form.authorOriginal}
              onChange={(e) => setField('authorOriginal', e.target.value)}
              placeholder={t('enhancedSearch.phAuthorOrig')}
              autoComplete="off"
            />
          </label>
          <label className="enhanced-field">
            <span className="enhanced-field-label">{t('enhancedSearch.labelBookAm')}</span>
            <SearchInputWithKeyboard
              type="text"
              className="search-input"
              value={form.bookArmenian}
              onChange={(e) => setField('bookArmenian', e.target.value)}
              placeholder={t('enhancedSearch.phBookAm')}
              autoComplete="off"
            />
          </label>
          <label className="enhanced-field">
            <span className="enhanced-field-label">{t('enhancedSearch.labelBookOrig')}</span>
            <SearchInputWithKeyboard
              type="text"
              className="search-input"
              value={form.bookOriginal}
              onChange={(e) => setField('bookOriginal', e.target.value)}
              placeholder={t('enhancedSearch.phBookOrig')}
              autoComplete="off"
            />
          </label>
          <label className="enhanced-field">
            <span className="enhanced-field-label">{t('enhancedSearch.labelTranslatorAm')}</span>
            <SearchInputWithKeyboard
              type="text"
              className="search-input"
              value={form.translatorArmenian}
              onChange={(e) => setField('translatorArmenian', e.target.value)}
              placeholder={t('enhancedSearch.phTranslatorAm')}
              autoComplete="off"
            />
          </label>
          <label className="enhanced-field">
            <span className="enhanced-field-label">{t('enhancedSearch.labelTranslatorOrig')}</span>
            <SearchInputWithKeyboard
              type="text"
              className="search-input"
              value={form.translatorOriginal}
              onChange={(e) => setField('translatorOriginal', e.target.value)}
              placeholder={t('enhancedSearch.phTranslatorOrig')}
              autoComplete="off"
            />
          </label>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="enhanced-search-actions">
          <button type="submit" className="enhanced-search-submit" disabled={loading}>
            {loading ? t('common.searching') : t('enhancedSearch.submit')}
          </button>
          <Link href="/" className="enhanced-search-back">
            {t('common.backToSearch')}
          </Link>
        </div>
      </form>

      {loading && <div className="loading">{t('common.searching')}</div>}

      {!loading && results.length > 0 && (
        <div className="results-container enhanced-results">
          {results.map((entry) => (
            <article key={entry.documentId || entry.id} className="result-item enhanced-result-card">
              <Link href={`/word/${entry.documentId || entry.id}`} className="enhanced-result-link">
                <div className="original-word">{entry.wordUnitOriginalLanguage}</div>
                <div className="armenian-word">{armenianWordDisplay(entry)}</div>
              </Link>
              <EnhancedResultFields entry={entry} t={t} />
            </article>
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="loading">{t('enhancedSearch.noHits')}</div>
      )}
    </div>
  )
}

function EnhancedResultFields({ entry, t }) {
  const authors = getEntryAuthors(entry)
  const translators = getEntryTranslators(entry)
  const rows = []

  const w = armenianWordDisplay(entry)
  if (w) {
    rows.push({ key: 'r01', label: t('enhancedSearch.result01'), value: w })
  }
  if (entry.suggestedEquivalentArmenian) {
    rows.push({
      key: 'r04',
      label: t('enhancedSearch.result04'),
      value: entry.suggestedEquivalentArmenian,
    })
  }
  if (entry.wordUnitOriginalLanguage) {
    rows.push({
      key: 'r05',
      label: t('enhancedSearch.result05'),
      value: entry.wordUnitOriginalLanguage,
    })
  }
  if (entry.suggestedEquivalentOriginal) {
    rows.push({
      key: 'r06',
      label: t('enhancedSearch.result06'),
      value: entry.suggestedEquivalentOriginal,
    })
  }
  if (entry.translatorCommentary) {
    rows.push({
      key: 'r07',
      label: t('enhancedSearch.result07'),
      value: entry.translatorCommentary,
    })
  }
  if (entry.wordMeaningSense) {
    rows.push({
      key: 'r08',
      label: t('enhancedSearch.result08'),
      value: entry.wordMeaningSense,
    })
  }
  if (entry.contextualPassageArmenian) {
    rows.push({
      key: 'r09',
      label: t('enhancedSearch.result09'),
      value: entry.contextualPassageArmenian,
    })
  }
  if (entry.contextualPassageOriginal) {
    rows.push({
      key: 'r10',
      label: t('enhancedSearch.result10'),
      value: entry.contextualPassageOriginal,
    })
  }
  const authorAm = authors.map((a) => a.nameArmenian).filter(Boolean).join('; ')
  if (authorAm) {
    rows.push({
      key: 'r11',
      label: t('enhancedSearch.result11'),
      value: authorAm,
    })
  }
  const authorOrig = authors.map((a) => a.nameOriginalLanguage).filter(Boolean).join('; ')
  if (authorOrig) {
    rows.push({
      key: 'r12',
      label: t('enhancedSearch.result12'),
      value: authorOrig,
    })
  }
  if (entry.book?.nameArmenian) {
    rows.push({
      key: 'r13',
      label: t('enhancedSearch.result13'),
      value: entry.book.nameArmenian,
    })
  }
  if (entry.book?.nameOriginalLanguage) {
    rows.push({
      key: 'r14',
      label: t('enhancedSearch.result14'),
      value: entry.book.nameOriginalLanguage,
    })
  }
  const translatorAm = translators.map((tr) => tr.nameArmenian).filter(Boolean).join('; ')
  if (translatorAm) {
    rows.push({
      key: 'r15',
      label: t('enhancedSearch.result15'),
      value: translatorAm,
    })
  }
  const trOrig = translators.map((tr) => tr.nameOriginalLanguage).filter(Boolean).join('; ')
  if (trOrig) {
    rows.push({
      key: 'r16',
      label: t('enhancedSearch.result16'),
      value: trOrig,
    })
  }

  return (
    <dl className="enhanced-result-dl">
      {rows.map((row) => (
        <div key={row.key} className="enhanced-result-row">
          <dt className="enhanced-result-dt">{row.label}</dt>
          <dd className="enhanced-result-dd">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
