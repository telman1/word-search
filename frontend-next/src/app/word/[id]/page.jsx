'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../../contexts/LanguageContext'
import { buildWordEntryDetailQuery } from '../../../lib/strapi-query'
import { formatPartOfSpeechList, labelPossessiveForm } from '../../../lib/word-entry-enum-labels'
import {
  formatPersonList,
  getEntryAuthors,
  getEntryTranslators,
  getPartOfSpeechValues,
} from '../../../lib/word-entry-display'
import { formatOriginalLanguageBilingual } from '../../../lib/original-language-labels'

function hasDisplayText(value) {
  if (value == null) return false
  return String(value).trim().length > 0
}

export default function WordDetail() {
  const { t, language } = useLanguage()
  const params = useParams()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchWordEntry(params.id)
    }
  }, [params.id])

  const fetchWordEntry = async (id) => {
    setLoading(true)
    setError('')
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'
      // Strapi 5 uses documentId; encode for URL safety
      const docId = encodeURIComponent(id)
      
      const q = buildWordEntryDetailQuery()
      const response = await fetch(`${apiBaseUrl}/api/word-entries/${docId}?${q}`)
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error?.message || `HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.data) {
        throw new Error('Word entry not found')
      }
      
      setEntry(data.data)
    } catch (err) {
      setError(t('word.errorLoading'))
      console.error('Word entry fetch error:', err.message, err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">{t('word.loading')}</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!entry) {
    return <div className="error">{t('word.notFound')}</div>
  }

  const authors = getEntryAuthors(entry)
  const translators = getEntryTranslators(entry)
  const partOfSpeechValues = getPartOfSpeechValues(entry)

  return (
    <div className="word-detail">
      <div className="word-header">
        <h1 className="original-word">{entry.wordUnitOriginalLanguage}</h1>
        <h2 className="armenian-word">
          {entry.wordUnitEasternArmenian}
          {entry.wordUnitWesternArmenian && ` / ${entry.wordUnitWesternArmenian}`}
        </h2>
        {entry.originalLanguageType && (
          <div className="language">
            {formatOriginalLanguageBilingual(entry.originalLanguageType)}
          </div>
        )}
      </div>

      <div className="word-info">
        <div className="info-grid">
          {partOfSpeechValues.length > 0 && (
            <div className="info-item">
              <div className="label">{t('word.partOfSpeech')}</div>
              <div className="value">{formatPartOfSpeechList(partOfSpeechValues, language, t)}</div>
            </div>
          )}
          {entry.possessiveCompositionForm && (
            <div className="info-item">
              <div className="label">{t('word.possessiveCompositionForm')}</div>
              <div className="value">{labelPossessiveForm(entry.possessiveCompositionForm, language, t)}</div>
            </div>
          )}
          {authors.length > 0 && (
            <div className="info-item">
              <div className="label">{t('word.author')}</div>
              <div className="value">{formatPersonList(authors)}</div>
            </div>
          )}
          {entry.book &&
            (hasDisplayText(entry.book.nameArmenian) ||
              hasDisplayText(entry.book.nameOriginalLanguage)) && (
              <div className="info-item">
                <div className="label">{t('word.book')}</div>
                <div className="value">
                  {entry.book.nameArmenian}
                  {entry.book.nameOriginalLanguage && ` (${entry.book.nameOriginalLanguage})`}
                </div>
              </div>
            )}
          {translators.length > 0 && (
            <div className="info-item">
              <div className="label">{t('word.translator')}</div>
              <div className="value">{formatPersonList(translators)}</div>
            </div>
          )}
        </div>

        {hasDisplayText(entry.wordUnitWesternArmenian) && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">{t('word.wordUnitWesternArmenian')}</div>
            <div className="value">{entry.wordUnitWesternArmenian}</div>
          </div>
        )}

        {hasDisplayText(entry.suggestedEquivalentArmenian) && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">{t('word.suggestedEquivalentArmenian')}</div>
            <div className="value">{entry.suggestedEquivalentArmenian}</div>
          </div>
        )}

        {hasDisplayText(entry.suggestedEquivalentOriginal) && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">{t('word.suggestedEquivalentOriginal')}</div>
            <div className="value">{entry.suggestedEquivalentOriginal}</div>
          </div>
        )}

        {hasDisplayText(entry.translatorCommentary) && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">{t('word.translatorCommentary')}</div>
            <div className="value">{entry.translatorCommentary}</div>
          </div>
        )}

        {hasDisplayText(entry.wordMeaningSense) && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">{t('word.wordMeaningSense')}</div>
            <div className="value">{entry.wordMeaningSense}</div>
          </div>
        )}

        {hasDisplayText(entry.contextualPassageArmenian) && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">{t('word.contextualPassageArmenian')}</div>
            <div className="value">{entry.contextualPassageArmenian}</div>
          </div>
        )}

        {hasDisplayText(entry.contextualPassageOriginal) && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="label">{t('word.contextualPassageOriginal')}</div>
            <div className="value">{entry.contextualPassageOriginal}</div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#473D3D', textDecoration: 'none' }}>
          {t('common.backToSearch')}
        </Link>
      </div>
    </div>
  )
}
