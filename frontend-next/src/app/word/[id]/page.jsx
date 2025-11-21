'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function WordDetail() {
  const params = useParams()
  const [word, setWord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchWord(params.id)
    }
  }, [params.id])

  const fetchWord = async (id) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'}/api/words/${id}?populate[author][fields][0]=name&populate[translator][fields][0]=name&populate[book][fields][0]=title&populate[connections][fields][0]=id&populate[connections][fields][1]=originalWord&populate[connections][fields][2]=armenianWord`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch word')
      }
      
      const data = await response.json()
      setWord(data.data)
    } catch (err) {
      setError('Error loading word. Please try again.')
      console.error('Word fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading word...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!word) {
    return <div className="error">Word not found</div>
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
              <div className="label">Book:</div>
              <div className="value">{word.book.title}</div>
            </div>
          )}
          {word.author && (
            <div className="info-item">
              <div className="label">Author:</div>
              <div className="value">{word.author.name}</div>
            </div>
          )}
          {word.translator && (
            <div className="info-item">
              <div className="label">Translator:</div>
              <div className="value">{word.translator.name}</div>
            </div>
          )}
        </div>
        
        {word.originalExampleSentence && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">Original Example Sentence:</div>
            <div className="value">{word.originalExampleSentence}</div>
          </div>
        )}
        
        {word.armenianExampleSentence && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">Armenian Example Sentence:</div>
            <div className="value">{word.armenianExampleSentence}</div>
          </div>
        )}
      </div>

      {word.connections && word.connections.length > 0 && (
        <div className="connections-section">
          <h2 className="section-title">Connected Words</h2>
          <div className="connected-words">
            {word.connections.map((conn) => (
              <Link
                key={conn.id}
                href={`/word/${conn.id}`}
                className="connected-word"
              >
                {conn.armenianWord || conn.originalWord}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>
          ← Back to Search
        </Link>
      </div>
    </div>
  )
}
