'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import en from '../translations/en.json'
import hy from '../translations/hy.json'

const BUNDLED = { en, hy }

function translationsForLang(lang) {
  return BUNDLED[lang] ?? en
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [translations, setTranslations] = useState(en)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en'
    setLanguage(savedLanguage)
    setTranslations(translationsForLang(savedLanguage))
  }, [])

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    setTranslations(translationsForLang(lang))
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        if (key.includes('.items')) {
          return []
        }
        return key
      }
    }

    if (typeof value === 'string' || Array.isArray(value)) {
      return value
    }

    if (key.includes('.items')) {
      return []
    }

    return key
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
