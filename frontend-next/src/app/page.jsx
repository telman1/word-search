'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import { buildHomeWordSearchQuery } from '../lib/strapi-query'
import SearchInputWithKeyboard from '../components/SearchInputWithKeyboard'
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
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchWords(query.trim())
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const searchWords = async (searchQuery) => {
    setLoading(true)
    setError('')
    
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'
      const qs = buildHomeWordSearchQuery(searchQuery)
      const url = `${apiBase}/api/word-entries?${qs}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch words')
      }
      
      const data = await response.json()
      setResults(data.data || [])
    } catch (err) {
      setError(t('home.errorSearching'))
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

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

      {!loading && !error && query && results.length === 0 && (
        <div className="loading">{t('common.noResults')} &quot;{query}&quot;</div>
      )}
    </div>
  )
}


