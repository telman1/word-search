'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Word {
  id: number
  lemma: string
  part_of_speech?: string
  language?: {
    name: string
    code: string
  }
  relations_from?: Array<{
    id: number
    relation_type: string
    to_word: {
      id: number
      lemma: string
    }
  }>
  relations_to?: Array<{
    id: number
    relation_type: string
    from_word: {
      id: number
      lemma: string
    }
  }>
}

type Relation = {
  type: string
  word: string
  id: number
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Word[]>([])
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

  const searchWords = async (searchQuery: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'}/api/words?filters[lemma][$contains]=${encodeURIComponent(searchQuery)}&populate=language,relations_from.to_word,relations_to.from_wordpopulate[language]=true&populate[relations_from][populate][to_word]=true&populate[relations_to][populate][from_word]=true`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch words')
      }
      
      const data = await response.json()
      setResults(data.data || [])
    } catch (err) {
      setError('Error searching words. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getAllRelations = (word: Word) => {
    const relations: Relation[] = []
    
    if (word.relations_from) {
      relations.push(...word.relations_from.map(rel => ({
        type: rel.relation_type,
        word: rel.to_word.lemma,
        id: rel.to_word.id
      })))
    }
    
    if (word.relations_to) {
      relations.push(...word.relations_to.map(rel => ({
        type: rel.relation_type,
        word: rel.from_word.lemma,
        id: rel.from_word.id
      })))
    }
    
    return relations
  }

  return (
    <div>
      <div className="search-container">
        <h1 style={{ marginBottom: '1rem', fontSize: '1.8rem', color: '#1e293b' }}>
          Search Words
        </h1>
        <input
          type="text"
          placeholder="Enter a word to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Searching...</div>}

      {results.length > 0 && (
        <div className="results-container">
          {results.map((word) => {
            const relations = getAllRelations(word)
            const groupedRelations = relations.reduce((acc, rel) => {
              if (!acc[rel.type]) {
                acc[rel.type] = []
              }
              acc[rel.type].push(rel)
              return acc
            }, {} as Record<string, Relation[]>)

            return (
              <div key={word.id} className="result-item">
                <div className="lemma">
                  <Link href={`/word/${word.id}`}>
                    {word.lemma}
                  </Link>
                </div>
                {word.language && (
                  <div className="language">{word.language.name}</div>
                )}
                {word.part_of_speech && (
                  <span className="part-of-speech">{word.part_of_speech}</span>
                )}
                
                {Object.keys(groupedRelations).length > 0 && (
                  <div className="relations">
                    {Object.entries(groupedRelations).slice(0, 2).map(([type, rels]) => (
                      <div key={type}>
                        <div className="relation-type">{type}:</div>
                        <div className="related-words">
                          {rels.slice(0, 3).map((rel) => (
                            <Link
                              key={rel.id}
                              href={`/word/${rel.id}`}
                              className="related-word"
                            >
                              {rel.word}
                            </Link>
                          ))}
                          {rels.length > 3 && (
                            <span className="related-word">+{rels.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {!loading && !error && query && results.length === 0 && (
        <div className="loading">No words found for &quot;{query}&quot;</div>
      )}
    </div>
  )
}
