'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../../contexts/LanguageContext'

export default function WordDetail() {
  const { t } = useLanguage()
  const params = useParams()
  const [word, setWord] = useState(null)
  const [connectedWords, setConnectedWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchWord(params.id)
    }
  }, [params.id])

  const fetchWord = async (identifier) => {
    setLoading(true)
    setError('')
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'
      let response
      
      // Check if identifier is numeric (ID) or string (name)
      const isNumeric = /^\d+$/.test(identifier)
      
      if (isNumeric) {
        // Fetch by ID
        response = await fetch(
          `${apiBaseUrl}/api/words/${identifier}?populate[author][fields][0]=name&populate[translator][fields][0]=name&populate[book][fields][0]=title&populate[connections][populate][0]=author&populate[connections][populate][1]=translator&populate[connections][populate][2]=book`
        )
      } else {
        // Fetch by name (search for exact match in originalWord or armenianWord)
        response = await fetch(
          `${apiBaseUrl}/api/words?filters[$or][0][originalWord][$eq]=${encodeURIComponent(identifier)}&filters[$or][1][armenianWord][$eq]=${encodeURIComponent(identifier)}&populate[author][fields][0]=name&populate[translator][fields][0]=name&populate[book][fields][0]=title&populate[connections][populate][0]=author&populate[connections][populate][1]=translator&populate[connections][populate][2]=book`
        )
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch word')
      }
      
      const data = await response.json()
      const wordData = isNumeric ? data.data : (data.data && data.data[0])
      
      if (!wordData) {
        throw new Error('Word not found')
      }
      
      setWord(wordData)
      
      // Fetch full details of connected words
      if (wordData.connections && wordData.connections.length > 0) {
        fetchConnectedWordsDetails(wordData.connections)
      }
    } catch (err) {
      setError(t('word.errorLoading'))
      console.error('Word fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchConnectedWordsDetails = async (connections) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'
      
      // Fetch full details for each connected word
      const connectedWordsPromises = connections.map(async (conn) => {
        const response = await fetch(
          `${apiBaseUrl}/api/words/${conn.id}?populate[author][fields][0]=name&populate[translator][fields][0]=name&populate[book][fields][0]=title`
        )
        if (response.ok) {
          const data = await response.json()
          return data.data
        }
        return null
      })
      
      const fetchedWords = await Promise.all(connectedWordsPromises)
      setConnectedWords(fetchedWords.filter(word => word !== null))
    } catch (err) {
      console.error('Error fetching connected words:', err)
    }
  }

  if (loading) {
    return <div className="loading">{t('word.loading')}</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!word) {
    return <div className="error">{t('word.notFound')}</div>
  }

  return (
    <div className="word-detail">
      <div className="word-header">
        <h1 className="original-word">{word.originalWord}</h1>
        {word.armenianWord && (
          <h2 className="armenian-word">{word.armenianWord}</h2>
        )}
        {word.originalLanguage && (
          <div className="language">{word.originalLanguage}</div>
        )}
      </div>

      <div className="word-info">
        <div className="info-grid">
          {word.book && (
            <div className="info-item">
              <div className="label">{t('word.book')}</div>
              <div className="value">{word.book.title}</div>
            </div>
          )}
          {word.author && (
            <div className="info-item">
              <div className="label">{t('word.author')}</div>
              <div className="value">{word.author.name}</div>
            </div>
          )}
          {word.translator && (
            <div className="info-item">
              <div className="label">{t('word.translator')}</div>
              <div className="value">{word.translator.name}</div>
            </div>
          )}
        </div>
        
        {word.originalExampleSentence && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">{t('word.originalExample')}</div>
            <div className="value">{word.originalExampleSentence}</div>
          </div>
        )}
        
        {word.armenianExampleSentence && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">{t('word.armenianExample')}</div>
            <div className="value">{word.armenianExampleSentence}</div>
          </div>
        )}
      </div>

      {connectedWords.length > 0 && (
        <div className="connections-section">
          <h2 className="section-title">{t('word.connectedWords')}</h2>
          <div className="connected-words-grid">
            {connectedWords.map((connectedWord) => (
              <div key={connectedWord.id} className="connected-word-card">
                <Link href={`/word/${connectedWord.id}`} className="connected-word-link">
                  <div className="connected-word-header">
                    <h3 className="connected-original-word">{connectedWord.originalWord}</h3>
                    {connectedWord.armenianWord && (
                      <h4 className="connected-armenian-word">{connectedWord.armenianWord}</h4>
                    )}
                    {connectedWord.originalLanguage && (
                      <div className="connected-language">{connectedWord.originalLanguage}</div>
                    )}
                  </div>
                  
                  <div className="connected-word-info">
                    {connectedWord.book && (
                      <div className="connected-info-item">
                        <span className="connected-label">{t('word.book')}</span>
                        <span className="connected-value">{connectedWord.book.title}</span>
                      </div>
                    )}
                    {connectedWord.author && (
                      <div className="connected-info-item">
                        <span className="connected-label">{t('word.author')}</span>
                        <span className="connected-value">{connectedWord.author.name}</span>
                      </div>
                    )}
                    {connectedWord.translator && (
                      <div className="connected-info-item">
                        <span className="connected-label">{t('word.translator')}</span>
                        <span className="connected-value">{connectedWord.translator.name}</span>
                      </div>
                    )}
                    {connectedWord.originalExampleSentence && (
                      <div className="connected-info-item">
                        <span className="connected-label">{t('word.originalExample')}</span>
                        <span className="connected-value">{connectedWord.originalExampleSentence}</span>
                      </div>
                    )}
                    {connectedWord.armenianExampleSentence && (
                      <div className="connected-info-item">
                        <span className="connected-label">{t('word.armenianExample')}</span>
                        <span className="connected-value">{connectedWord.armenianExampleSentence}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>
          {t('common.backToSearch')}
        </Link>
      </div>
    </div>
  )
}
