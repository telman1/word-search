'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import { buildHomeWordSearchQuery, WORD_SEARCH_PAGE_SIZE } from '../lib/strapi-query'
import SearchInputWithKeyboard from '../components/SearchInputWithKeyboard'
import SearchPagination from '../components/SearchPagination'
import { formatPartOfSpeechList, formatPluralFormationList } from '../lib/word-entry-enum-labels'
import {
  formatPersonList,
  getEntryAuthors,
  getEntryTranslators,
  getPartOfSpeechValues,
  getPluralFormationValues,
} from '../lib/word-entry-display'

export default function Home() {
  const { t, language } = useLanguage()
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [results, setResults] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const lastFetchId = useRef(0)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(query.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    if (!searchTerm) {
      setResults([])
      setPageCount(0)
      setTotal(0)
      return
    }
    const fetchId = ++lastFetchId.current
    setLoading(true)
    setError('')
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'
    const qs = buildHomeWordSearchQuery(searchTerm, { page, pageSize: WORD_SEARCH_PAGE_SIZE })
    const url = `${apiBase}/api/word-entries?${qs}`

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch words')
        }
        return response.json()
      })
      .then((data) => {
        if (fetchId !== lastFetchId.current) return
        setResults(data.data || [])
        const p = data.meta?.pagination
        if (p) {
          setPageCount(p.pageCount ?? 0)
          setTotal(p.total ?? 0)
        } else {
          setPageCount(0)
          setTotal(0)
        }
      })
      .catch((err) => {
        if (fetchId !== lastFetchId.current) return
        setError(t('home.errorSearching'))
        console.error('Search error:', err)
      })
      .finally(() => {
        if (fetchId !== lastFetchId.current) return
        setLoading(false)
      })
  }, [searchTerm, page, t])

  return (
    <div>
      <div className="search-container">
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#1e293b' }}>
          {t('common.searchLabel')}
        </label>
        <SearchInputWithKeyboard
          type="text"
          placeholder={t('common.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <div style={{ marginTop: '1rem' }}>
          <Link href="/enhanced-search" className="enhanced-search-entry-link">
            {t('enhancedSearch.openLink')}
          </Link>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">{t('common.searching')}</div>}

      {!loading && searchTerm && total > 0 && (
        <div className="search-result-summary">
          {t('common.showingCount')
            .replace('{from}', String((page - 1) * WORD_SEARCH_PAGE_SIZE + 1))
            .replace('{to}', String((page - 1) * WORD_SEARCH_PAGE_SIZE + results.length))
            .replace('{total}', String(total))}
        </div>
      )}

      {results.length > 0 && (
        <div className="results-container">
          {results.map((entry) => {
            const authors = getEntryAuthors(entry)
            const translators = getEntryTranslators(entry)
            const partOfSpeechValues = getPartOfSpeechValues(entry)
            const pluralFormationValues = getPluralFormationValues(entry)
            return (
            <div key={entry.documentId || entry.id} className="result-item">
              <Link href={`/word/${entry.documentId || entry.id}`} className="word-display">
                <div className="original-word">{entry.wordUnitOriginalLanguage}</div>
                <div className="armenian-word">
                  {entry.wordUnitEasternArmenian} {entry.wordUnitWesternArmenian && `/ ${entry.wordUnitWesternArmenian}`}
                </div>
                {entry.suggestedEquivalentArmenian && (
                  <div className="suggested-equiv">{entry.suggestedEquivalentArmenian}</div>
                )}
                {entry.suggestedEquivalentOriginal && (
                  <div className="suggested-equiv">{entry.suggestedEquivalentOriginal}</div>
                )}
              </Link>
              {partOfSpeechValues.length > 0 && (
                <div className="part-of-speech">
                  {t('home.partOfSpeech')}: {formatPartOfSpeechList(partOfSpeechValues, language, t)}
                </div>
              )}
              {pluralFormationValues.length > 0 && (
                <div className="plural-formation">
                  {t('home.pluralFormation')}:{' '}
                  {formatPluralFormationList(pluralFormationValues, language, t)}
                </div>
              )}
              {authors.length > 0 && (
                <div className="author">
                  {t('home.author')}: {formatPersonList(authors)}
                </div>
              )}
              {entry.book && (
                <div className="book">{t('home.book')}: {entry.book.nameArmenian} ({entry.book.nameOriginalLanguage})</div>
              )}
              {translators.length > 0 && (
                <div className="translator">
                  {t('home.translator')}: {formatPersonList(translators)}
                </div>
              )}
            </div>
            )
          })}
        </div>
      )}

      {searchTerm && !error && pageCount > 1 && (
        <SearchPagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          t={t}
          disabled={loading}
        />
      )}

      {!loading && !error && searchTerm && results.length === 0 && (
        <div className="loading">{t('common.noResults')} &quot;{searchTerm}&quot;</div>
      )}
    </div>
  )
}


