'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import { buildEnhancedWordEntriesQuery } from '../../lib/strapi-query'
import SearchInputWithKeyboard from '../../components/SearchInputWithKeyboard'

const ENHANCED_SEARCH_STORAGE_KEY = 'word-search-mvp:enhanced-search-state'
const ENHANCED_SEARCH_STATE_VERSION = 1

const emptyForm = {
  easternArmenian: '',
  westernArmenian: '',
  originalLanguageWord: '',
  authorArmenian: '',
  authorOriginal: '',
  bookArmenian: '',
  bookOriginal: '',
  translatorArmenian: '',
  translatorOriginal: '',
}

function readSessionState() {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(ENHANCED_SEARCH_STORAGE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    if (p.v !== ENHANCED_SEARCH_STATE_VERSION || !p.form || typeof p.form !== 'object') return null
    return {
      form: { ...emptyForm, ...p.form },
      results: Array.isArray(p.results) ? p.results : [],
      searched: Boolean(p.searched),
    }
  } catch {
    return null
  }
}

function armenianWordDisplay(entry) {
  const e = entry.wordUnitEasternArmenian || ''
  const w = entry.wordUnitWesternArmenian || ''
  if (e && w) return `${e} / ${w}`
  return e || w || ''
}

export default function EnhancedSearchPage() {
  const { t } = useLanguage()
  const [form, setForm] = useState(() => ({ ...emptyForm }))
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [sessionRestored, setSessionRestored] = useState(false)

  useEffect(() => {
    const stored = readSessionState()
    if (stored) {
      setForm(stored.form)
      setResults(stored.results)
      setSearched(stored.searched)
    }
    setSessionRestored(true)
  }, [])

  useEffect(() => {
    if (!sessionRestored) return
    try {
      sessionStorage.setItem(
        ENHANCED_SEARCH_STORAGE_KEY,
        JSON.stringify({
          v: ENHANCED_SEARCH_STATE_VERSION,
          form,
          results,
          searched,
        })
      )
    } catch (err) {
      console.error('Could not persist enhanced search state', err)
    }
  }, [form, results, searched, sessionRestored])

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
