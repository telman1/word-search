'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
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
      const encoded = encodeURIComponent(searchQuery)
      // Case-insensitive search across first 5 content columns
      const url = `${apiBase}/api/word-entries?` +
        `filters[$or][0][wordUnitEasternArmenian][$containsi]=${encoded}` +
        `&filters[$or][1][wordUnitWesternArmenian][$containsi]=${encoded}` +
        `&filters[$or][2][suggestedEquivalentArmenian][$containsi]=${encoded}` +
        `&filters[$or][3][wordUnitOriginalLanguage][$containsi]=${encoded}` +
        `&filters[$or][4][suggestedEquivalentOriginal][$containsi]=${encoded}` +
        `&populate[book]=*&populate[translator]=*`
      
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
        <input
          type="text"
          placeholder={t('common.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">{t('common.searching')}</div>}

      {results.length > 0 && (
        <div className="results-container">
          {results.map((entry) => (
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
              {entry.book && (
                <div className="book">{t('home.book')}: {entry.book.nameArmenian} ({entry.book.nameOriginalLanguage})</div>
              )}
              {entry.translator && (
                <div className="translator">{t('home.translator')}: {entry.translator.nameArmenian} ({entry.translator.nameOriginalLanguage})</div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && query && results.length === 0 && (
        <div className="loading">{t('common.noResults')} &quot;{query}&quot;</div>
      )}
    </div>
  )
}


