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
      // Search in both originalWord and armenianWord fields
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'}/api/words?filters[$or][0][originalWord][$contains]=${encodeURIComponent(searchQuery)}&filters[$or][1][armenianWord][$contains]=${encodeURIComponent(searchQuery)}&populate[author][fields][0]=name&populate[translator][fields][0]=name&populate[book][fields][0]=title&populate[connections][fields][0]=id&populate[connections][fields][1]=originalWord&populate[connections][fields][2]=armenianWord`
      )
      
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

  const getAllConnections = (word) => {
    const connections = []
    
    if (word.connections && Array.isArray(word.connections)) {
      connections.push(...word.connections.map(conn => ({
        originalWord: conn.originalWord,
        armenianWord: conn.armenianWord,
        id: conn.id
      })))
    }
    
    return connections
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
          {results.map((word) => {
            const connections = getAllConnections(word)

            return (
              <div key={word.id} className="result-item">
                <div className="word-display">
                  <Link href={`/word/${word.originalWord}`}>
                    <div className="original-word">{word.originalWord}</div>
                    {word.armenianWord && (
                      <div className="armenian-word">{word.armenianWord}</div>
                    )}
                  </Link>
                </div>
                {word.originalLanguage && (
                  <div className="language">{word.originalLanguage}</div>
                )}
                {word.book && (
                  <div className="book">{t('home.book')}: {word.book.title}</div>
                )}
                {word.author && (
                  <div className="author">{t('home.author')}: {word.author.name}</div>
                )}
                {word.translator && (
                  <div className="translator">{t('home.translator')}: {word.translator.name}</div>
                )}
                
                {connections.length > 0 && (
                  <div className="connections">
                    <div className="connection-type">{t('home.connectedWords')}</div>
                    <div className="connected-words">
                      {connections.slice(0, 5).map((conn) => (
                        <Link
                          key={conn.id}
                          href={`/word/${conn.id}`}
                          className="connected-word"
                        >
                          {conn.armenianWord || conn.originalWord}
                        </Link>
                      ))}
                      {connections.length > 5 && (
                        <span className="connected-word">+{connections.length - 5} {t('home.more')}</span>
                      )}
                    </div>
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


