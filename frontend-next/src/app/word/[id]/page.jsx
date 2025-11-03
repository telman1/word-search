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
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'}/api/words/${id}?populate=*`
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

  const getAllRelations = (word) => {
    const relations = []
    
    if (word.relations_from) {
      relations.push(...word.relations_from.map(rel => ({
        type: rel.relation_type,
        word: rel.to_word.lemma,
        id: rel.to_word.id,
        weight: rel.weight,
        comment: rel.comment
      })))
    }
    
    if (word.relations_to) {
      relations.push(...word.relations_to.map(rel => ({
        type: rel.relation_type,
        word: rel.from_word.lemma,
        id: rel.from_word.id,
        weight: rel.weight,
        comment: rel.comment
      })))
    }
    
    return relations
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

  const relations = getAllRelations(word)
  const groupedRelations = relations.reduce((acc, rel) => {
    if (!acc[rel.type]) {
      acc[rel.type] = []
    }
    acc[rel.type].push(rel)
    return acc
  }, {})

  return (
    <div className="word-detail">
      <div className="word-header">
        <h1 className="lemma">{word.lemma}</h1>
        {word.language && (
          <div className="language">{word.language.name}</div>
        )}
        {word.part_of_speech && (
          <span className="part-of-speech">{word.part_of_speech}</span>
        )}
      </div>

      <div className="word-info">
        <div className="info-grid">
          {word.lemma_part && (
            <div className="info-item">
              <div className="label">Lemma Part:</div>
              <div className="value">{word.lemma_part}</div>
            </div>
          )}
          {word.affix && (
            <div className="info-item">
              <div className="label">Affix:</div>
              <div className="value">{word.affix}</div>
            </div>
          )}
          {word.affix_number && (
            <div className="info-item">
              <div className="label">Affix Number:</div>
              <div className="value">{word.affix_number}</div>
            </div>
          )}
          {word.affix_type && (
            <div className="info-item">
              <div className="label">Affix Type:</div>
              <div className="value">{word.affix_type}</div>
            </div>
          )}
          {word.root && (
            <div className="info-item">
              <div className="label">Root:</div>
              <div className="value">{word.root}</div>
            </div>
          )}
          {word.root_number && (
            <div className="info-item">
              <div className="label">Root Number:</div>
              <div className="value">{word.root_number}</div>
            </div>
          )}
          {word.stem && (
            <div className="info-item">
              <div className="label">Stem:</div>
              <div className="value">{word.stem}</div>
            </div>
          )}
          {word.ordinal && (
            <div className="info-item">
              <div className="label">Ordinal:</div>
              <div className="value">{word.ordinal}</div>
            </div>
          )}
        </div>
        
        {word.notes && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">Notes:</div>
            <div className="value" dangerouslySetInnerHTML={{ __html: word.notes }} />
          </div>
        )}
      </div>

      {Object.keys(groupedRelations).length > 0 && (
        <div className="relations-section">
          <h2 className="section-title">Relations</h2>
          {Object.entries(groupedRelations).map(([type, rels]) => (
            <div key={type} className="relation-group">
              <div className="relation-type">{type}</div>
              <div className="related-words">
                {rels.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/word/${rel.id}`}
                    className="related-word"
                    title={rel.comment || undefined}
                  >
                    {rel.word}
                    {rel.weight && ` (${rel.weight})`}
                  </Link>
                ))}
              </div>
            </div>
          ))}
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


